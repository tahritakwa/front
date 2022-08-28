import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { DataStateChangeEvent, PagerSettings, SelectableSettings } from '@progress/kendo-angular-grid';
import { DataSourceRequestState } from '@progress/kendo-data-query';
import { Observable } from 'rxjs';
import { WarehouseConstant } from '../../constant/inventory/warehouse.constant';
import { DocumentConstant } from '../../constant/sales/document.constant';
import { SharedConstant } from '../../constant/shared/shared.constant';
import { WarehouseService } from '../../inventory/services/warehouse/warehouse.service';
import { Warehouse } from '../../models/inventory/warehouse.model';
import { DocumentService } from '../../sales/services/document/document.service';
import { FileService } from '../../shared/services/file/file-service.service';
import { ColumnSettings } from '../../shared/utils/column-settings.interface';
import { GridSettings } from '../../shared/utils/grid-settings.interface';
import { PredicateFormat } from '../../shared/utils/predicate';
import { ReportingService } from '../services/reporting.service';
import { ItemConstant } from '../../constant/inventory/item.constant';
import { process } from '@progress/kendo-data-query';
import { SharedAccountingConstant } from '../../constant/accounting/sharedAccounting.constant';
import { SwalWarring } from '../../shared/components/swal/swal-popup';
import { CompanyService } from '../../administration/services/company/company.service';
import { AuthService } from '../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../Structure/permission-constant';

const AND = 'and';

@Component({
  selector: 'app-stock-valuation',
  templateUrl: './stock-valuation.component.html',
  styleUrls: ['./stock-valuation.component.scss']
})
export class StockValuationComponent implements OnInit {
  wareHouseId: number;
  wareHouseName: string;
  showWarehouseDopDownErrorMessage: boolean;
  itemsList = [];
  totalLine: any;
  companyCurrency ;
  public havePrintPermission =false;
  // pager settings
pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  /**
   * Grid state proprety
   */
  public gridState: DataSourceRequestState = {
    skip: 0,
    take: 50,
    filter: { // Initial filter descriptor
      logic: AND,
      filters: []
    }
  };
  /**
 * Select grid settings
 */
  public selectableSettings: SelectableSettings;
  /**
   * Grid columns proprety
   */
  public columnsConfig: ColumnSettings[] = [
    {
      field: DocumentConstant.SHELF_ATTRIBUTE,
      title: DocumentConstant.SHELF,
      filterable: true,
      _width: 90
    },
    {
      field: ItemConstant.CODE_ITEM,
      title: DocumentConstant.CODE,
      filterable: true,
      _width: 100
    },
    {
      field: ItemConstant.ITEM_ARTICLE,
      title: DocumentConstant.DESIGNATION,
      filterable: false,
      _width: 100
    },
    {
      field: DocumentConstant.TOTAL_QTY,
      title: DocumentConstant.QTY,
      filterable: false,
      format: DocumentConstant.FORMAT_NUMBER,
      _width: 100
    },
    {
      field: ItemConstant.UNIT_PURCHASE_PRICE,
      title: DocumentConstant.P_U,
      filterable: true,
      _width: 90
    },
    {
      field: ItemConstant.TOTAL_PRICE,
      title: ItemConstant.TOTAL,
      filterable: true,
      format: DocumentConstant.FORMAT_NUMBER,
      _width: 100
    },
    {
      field: DocumentConstant.STORAGE_ATTRIBUTE,
      title: DocumentConstant.STORAGE,
      filterable: true,
      _width: 90
    }
  ];
  /**
   * Grid settingsproprety
   */
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig
  };
  docListFormGroup: FormGroup;
  public predicate: PredicateFormat;

  constructor(public warehouseService: WarehouseService,
    private translate: TranslateService,
    private fileServiceService: FileService,
    public documentService: DocumentService,
    public reportingService: ReportingService,
    private swalWarrings: SwalWarring,
    private companyService: CompanyService, public authService: AuthService) { }

  ngOnInit() {
    this.havePrintPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.PRINT_STOCK_VALUATION);
    this.companyService.getCurrentCompany().subscribe(data =>{
      this.companyCurrency = data.IdCurrencyNavigation.Symbole;
    });
    this.gridSettings.state.skip = 0;
    this.gridSettings.state.filter.filters = [];
    this.gridSettings.gridData = {
      data: [],
      total: 0
    };
  }

  initGridDataSource() {
    this.gridState = this.gridSettings.state;
      const itemsList = Object.assign([], this.itemsList);
      this.gridSettings.gridData = process(itemsList, this.gridState);
  }
  warehouseSelect(idSelectedWareHouse: number, listOfAllWarehouseDataSource: Observable<Warehouse>) {
    if (idSelectedWareHouse && listOfAllWarehouseDataSource) {
      this.wareHouseId = idSelectedWareHouse;
      this.wareHouseName = listOfAllWarehouseDataSource.filter(warehouse => warehouse.Id === idSelectedWareHouse)[0].WarehouseName;
      this.showWarehouseDopDownErrorMessage = false;
    } else {
      this.wareHouseId = undefined;
      this.wareHouseName = undefined;
      this.showWarehouseDopDownErrorMessage = true;
    }
  }

  public onJasperPrintClick(): void {
    if (this.wareHouseId) {
      const params = {
        'idwarehouse': this.wareHouseId
      };
      const dataToSend = {
        'Id': this.wareHouseId,
        'reportName': WarehouseConstant.STOCK_VALUATION_REPORT_NAME,
        'documentName': this.translate.instant(WarehouseConstant.STOCK_VALUATION_UPPERCASE)
                        .concat(SharedConstant.UNDERSCORE).concat(this.translate.instant(WarehouseConstant.WAREHOUSE))
                        .concat(SharedConstant.UNDERSCORE).concat(this.wareHouseName),
        'reportFormatName': 'pdf',
        'printCopies': 1,
        'PrintType': -1,
        'reportparameters': params
      };
      this.warehouseService.downloadJasperReport(dataToSend).subscribe(res => {
        this.fileServiceService.downLoadFile(res.objectData);
      });
    } else {
      this.showWarehouseDopDownErrorMessage = true;
    }

  }
  clickSearch() {
    this.itemsList = [];
    this.totalLine = null;
    if(!this.wareHouseId){
      this.showWarehouseDopDownErrorMessage = true;
    }else{
      this.gridSettings.state.skip = 0;
      this.searchDocuments();
    }
  }
  searchDocuments() {
    this.reportingService.getStockValuationLines(this.wareHouseId).subscribe(res => {
      if(res.length > 0){
        res.forEach(element => {
          if(element.Shelf !== "Totaux"){
            this.itemsList.push(element);
          }
          if(element.Shelf == "Totaux"){
            this.totalLine = element;
          }
        });
      }else {
        this.itemsList = [];
        this.totalLine = null;
        this.openModal()
      }
      this.initGridDataSource();
    });
  }
  openModal(): any {
    const swalWarningMessage = `${this.translate.instant(SharedAccountingConstant.NO_RECORDS_FOUND)}`;
    return this.swalWarrings.CreateSwal(swalWarningMessage,'INFO', "OK", null, true);
  }
  /**
 * Data changed listener
 * @param state
 */
  public dataStateChange(state: DataStateChangeEvent): void {
    this.gridSettings.state = state;
    this.initGridDataSource();
  }
}
