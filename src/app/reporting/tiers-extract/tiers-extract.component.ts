import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DataStateChangeEvent, PagerSettings, SelectableSettings } from '@progress/kendo-angular-grid';
import { DataSourceRequestState } from '@progress/kendo-data-query';
import { TiersConstants } from '../../constant/purchase/tiers.constant';
import { SharedConstant } from '../../constant/shared/shared.constant';
import { NumberConstant } from '../../constant/utility/number.constant';
import { TiersTypeEnumerator } from '../../models/enumerators/tiers-type.enum';
import { TiersService } from '../../purchase/services/tiers/tiers.service';
import { FileService } from '../../shared/services/file/file-service.service';
import { ColumnSettings } from '../../shared/utils/column-settings.interface';
import { GridSettings } from '../../shared/utils/grid-settings.interface';
import { ReportingService } from '../services/reporting.service';
import { process } from '@progress/kendo-data-query';
import { DocumentConstant } from '../../constant/sales/document.constant';
import { ClaimConstant } from '../../constant/helpdesk/claim.constant';
import { SharedAccountingConstant } from '../../constant/accounting/sharedAccounting.constant';
import { SwalWarring } from '../../shared/components/swal/swal-popup';
import { CompanyService } from '../../administration/services/company/company.service';
import { AuthService } from '../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../Structure/permission-constant';
import { LocalStorageService } from '../../login/Authentification/services/local-storage-service';
const AND = 'and';

@Component({
  selector: 'app-tiers-extract',
  templateUrl: './tiers-extract.component.html',
  styleUrls: ['./tiers-extract.component.scss']
})
export class TiersExtractComponent implements OnInit {
  customerExtract = true;
  supplierExtract = false;
  public formatDate: string = this.translate.instant(SharedConstant.DATE_FORMAT);
  tiersId: number;
  tiersName: string;
  idTypeTiers: number;
  valueStartDate: Date;
  showTiersDopDownErrorMessage: boolean;
  showStartDateErrorMessage: boolean;
  maxDate = new Date();
  itemsList = [];
  totalLine: any;
  companyCurrency ;
  totalCurrency: string;
  public havePrintPermission=false;
  public precision ;

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
      field: DocumentConstant.DOCUMENT_CODE,
      title: DocumentConstant.REFERENCE,
      filterable: true,
      _width: 90
    },
    {
      field: DocumentConstant.DOCUMENT_DATE,
      title: DocumentConstant.DATE,
      filterable: true,
      format: ClaimConstant.DOCUMENT_FORMAT,
      _width: 90
    },
    {
      field: "TotalCredit",
      title: DocumentConstant.CREDIT,
      filterable: false,
      format: DocumentConstant.FORMAT_NUMBER,
      _width: 100
    },
    {
      field: "TotalDebit",
      title: DocumentConstant.DEBIT,
      filterable: false,
      format: DocumentConstant.FORMAT_NUMBER,
      _width: 100
    }
  ];
  /**
   * Grid settingsproprety
   */
  public gridSettings: GridSettings = {
  state: this.gridState,
  columnsConfig: this.columnsConfig
};
  constructor(public tiersService: TiersService,
    private translate: TranslateService,
    private fileServiceService: FileService,
    public reportingService: ReportingService,
    private swalWarrings: SwalWarring,
    private companyService: CompanyService , public authService: AuthService, public localStorageService : LocalStorageService) { }

  ngOnInit() {
    this.havePrintPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.PRINT_TIERS_EXTRACT);
    this.companyCurrency = this.localStorageService.getCurrencySymbol();
    this.gridSettings.state.skip = 0;
    this.gridSettings.state.filter.filters = [];
    this.gridSettings.gridData = {
      data: [],
      total: 0
    };
  }

  showCustomerExtract() {
    this.customerExtract = true;
    this.supplierExtract = false;
    this.tiersId = undefined;
    this.tiersName = undefined;
    this.idTypeTiers = undefined;
    this.showTiersDopDownErrorMessage = false;
  }

  showSupplierExtract() {
    this.customerExtract = false;
    this.supplierExtract = true;
    this.tiersId = undefined;
    this.tiersName = undefined;
    this.idTypeTiers = undefined;
    this.showTiersDopDownErrorMessage = false;
  }

  receiveSupplier(idSelectedTiers: number, selectedTiers: any) {
    if (idSelectedTiers && selectedTiers) {
      this.tiersId = idSelectedTiers;
      this.tiersName = selectedTiers.Name;
      this.idTypeTiers = selectedTiers.IdTypeTiers;
      this.showTiersDopDownErrorMessage = false;
    } else {
      this.tiersId = undefined;
      this.tiersName = undefined;
      this.idTypeTiers = undefined;
      this.showTiersDopDownErrorMessage = true;
    }
  }

  public startDateValueChange(selectedDate: Date) {
    if (selectedDate) {
      this.valueStartDate = selectedDate;
      this.showStartDateErrorMessage = false;
    }
  }

  public onJasperPrintClick(): void {
    if (this.tiersId && this.valueStartDate) {
      this.clickSearch();
      const tiersType = this.idTypeTiers === TiersTypeEnumerator.Customer ? TiersConstants.CUSTOMER : TiersConstants.SUPPLIER;
      const params = {
        'idtiers': this.tiersId,
        'startdate': this.valueStartDate ? this.valueStartDate.getFullYear() + ',' + (this.valueStartDate.getMonth() + NumberConstant.ONE) + ',' + this.valueStartDate.getDate() : -1
      };
      const dataToSend = {
        'Id': this.tiersId,
        'reportName': TiersConstants.TIERS_EXTRACT_REPORT_NAME,
        'documentName': this.translate.instant(TiersConstants.TIERS_EXTRACT_UPPERCASE)
                        .concat(SharedConstant.UNDERSCORE).concat(this.translate.instant(tiersType))
                        .concat(SharedConstant.UNDERSCORE).concat(this.tiersName),
        'reportFormatName': 'pdf',
        'printCopies': 1,
        'PrintType': -1,
        'reportparameters': params
      };
      this.tiersService.downloadJasperReport(dataToSend).subscribe(res => {
        this.fileServiceService.downLoadFile(res.objectData);
      });
    } else if (!this.tiersId) {
      this.showTiersDopDownErrorMessage = true;
    } else if (!this.valueStartDate) {
      this.showStartDateErrorMessage = true;
    }
  }
  initGridDataSource() {
    this.gridState = this.gridSettings.state;
    const itemsList = Object.assign([], this.itemsList);
    this.gridSettings.gridData = process(itemsList, this.gridState);
  }
  clickSearch() {
    this.itemsList = [];
    this.totalLine = null;
    if (!this.valueStartDate && !this.tiersId) {
      this.showTiersDopDownErrorMessage = true;
      this.showStartDateErrorMessage = true;
    } else if (!this.valueStartDate) {
      this.showStartDateErrorMessage = true;
    }else if (!this.tiersId) {
      this.showTiersDopDownErrorMessage = true;
      } else {
      this.gridSettings.state.skip = 0;
      this.searchDocuments();
    }
  }
  searchDocuments() {
    let startdate = this.valueStartDate ? this.valueStartDate.getFullYear() + ',' + (this.valueStartDate.getMonth() + NumberConstant.ONE) + ',' + this.valueStartDate.getDate(): -1;
       this.reportingService.getTiersExtractLines(this.tiersId, startdate).subscribe(res => {
        if(res.length > 0){
          res.forEach(element => {
            if(element.DocumentCode !== "Totaux"){
              this.itemsList.push(element);
            }
            if(element.DocumentCode == "Totaux"){
              this.totalLine = element;
            }
          });
          this.initGridDataSource();
        }else {
          this.openModal();
          this.initGridDataSource();
        }
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
