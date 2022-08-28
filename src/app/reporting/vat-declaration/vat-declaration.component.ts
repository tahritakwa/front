import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DataStateChangeEvent, PagerSettings, SelectableSettings } from '@progress/kendo-angular-grid';
import { DataSourceRequestState } from '@progress/kendo-data-query';
import { GrowlService } from '../../../COM/Growl/growl.service';
import { TaxeService } from '../../administration/services/taxe/taxe.service';
import { TaxeConstant } from '../../constant/Administration/taxe.constant';
import { SharedConstant } from '../../constant/shared/shared.constant';
import { NumberConstant } from '../../constant/utility/number.constant';
import { FileService } from '../../shared/services/file/file-service.service';
import { ColumnSettings } from '../../shared/utils/column-settings.interface';
import { GridSettings } from '../../shared/utils/grid-settings.interface';
import { ReportingService } from '../services/reporting.service';
import { process } from '@progress/kendo-data-query';
import { DocumentConstant } from '../../constant/sales/document.constant';
import { ClaimConstant } from '../../constant/helpdesk/claim.constant';
import { SwalWarring } from '../../shared/components/swal/swal-popup';
import { SharedAccountingConstant } from '../../constant/accounting/sharedAccounting.constant';
import { CompanyService } from '../../administration/services/company/company.service';
import { AuthService } from '../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../Structure/permission-constant';
const AND = 'and';

@Component({
  selector: 'app-vat-declaration',
  templateUrl: './vat-declaration.component.html',
  styleUrls: ['./vat-declaration.component.scss']
})
export class VatDeclarationComponent implements OnInit {
  public formatDate: string = this.translate.instant(SharedConstant.DATE_FORMAT);
  public valueStartDate: Date;
  public valueEndDate: Date;
  private oldStartDateValue: Date;
  private oldEndDateValue: Date;
  public minEndDate: Date;
  public maxStartDate: Date;
  showStartDateErrorMessage: boolean;
  showEndDateErrorMessage: boolean;
  public havePrintPermission = false;
  itemsList = [];
  companyCurrency ;
  datePipe = new DatePipe('en-US');
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
        field: "TiersName",
        title: DocumentConstant.TIERS,
        filterable: false,
        _width: 100
      },
      {
        field: "TotalHT",
        title: DocumentConstant.TOTAL_HT,
        filterable: false,
        format: DocumentConstant.FORMAT_NUMBER,
        _width: 100
      },
      {
        field: "FiscalStamp",
        title: DocumentConstant.TAX_STAMP,
        filterable: false,
        format: DocumentConstant.FORMAT_NUMBER,
        _width: 100
      },
      {
        field: "TotalVat",
        title: DocumentConstant.TOTAL_VAT,
        filterable: false,
        format: DocumentConstant.FORMAT_NUMBER,
        _width: 100
      },
      {
        field: "TotalTTC",
        title: DocumentConstant.TOTAL_TTC,
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
    totalLine: any;
    public isPurchaseType = true ;
    public idTier = 0;
  constructor(public taxeService: TaxeService,
    private translate: TranslateService,
    private fileServiceService: FileService,
    private growlService: GrowlService,
    public reportingService: ReportingService,
    private swalWarrings: SwalWarring,
    private cdRef: ChangeDetectorRef,
    private companyService: CompanyService, public authService: AuthService) {}

  ngOnInit() {
    this.havePrintPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.PRINT_VAT_DECLARATION);
    this.gridSettings.state.skip = 0;
    this.gridSettings.state.filter.filters = [];
    this.gridSettings.gridData = {
      data: [],
      total: 0
    };
    this.companyService.getCurrentCompany().subscribe(data =>{
      this.companyCurrency = data.IdCurrencyNavigation.Symbole;
    });
  }

  public startDateValueChange(selectedDate: Date) {
    if (selectedDate) {
      if(this.oldStartDateValue != selectedDate){
        this.oldStartDateValue = selectedDate;
        if (!this.oldStartDateValue) {
          this.minEndDate = undefined;
        } else {
          this.minEndDate = this.oldStartDateValue;
        }
        this.cdRef.detectChanges();
      }
      this.valueStartDate = selectedDate;
      this.showStartDateErrorMessage = false;
    }
  }

  public endDateValueChange(selectedDate: Date) {
    if (selectedDate) {
      if(this.oldEndDateValue != selectedDate){
        this.oldEndDateValue = selectedDate;
        if (!this.oldEndDateValue) {
          this.maxStartDate = undefined;
        } else {
          this.maxStartDate = this.oldEndDateValue;
        }
        this.cdRef.detectChanges();
      }
      this.valueEndDate = selectedDate;
      this.showEndDateErrorMessage = false;
    }
  }

  public onJasperPrintClick(): void {
    if (!this.valueStartDate) {
      this.showStartDateErrorMessage = true;
    } else if (!this.valueEndDate) {
      this.showEndDateErrorMessage = true;
    } else if (this.valueStartDate > this.valueEndDate) {
      this.growlService.ErrorNotification(this.translate.instant(SharedConstant.DATES_ERROR));
    } else {
      const params = {
        'startdate': this.valueStartDate ? this.valueStartDate.getFullYear() + ',' + (this.valueStartDate.getMonth() + NumberConstant.ONE) + ',' + this.valueStartDate.getDate() : -1,
        'enddate': this.valueEndDate ? this.valueEndDate.getFullYear() + ',' + (this.valueEndDate.getMonth() + NumberConstant.ONE) + ',' + this.valueEndDate.getDate() : -1,
        'isPurchaseType' : this.isPurchaseType,
        'idTier' : this.idTier
      };
      const dataToSend = {
        'Id': 0,
        'reportName': TaxeConstant.VAT_DECLARATION_REPORT_NAME,
        'documentName': this.translate.instant(TaxeConstant.VAT_DECLARATION_UPPERCASE)
                        .concat(SharedConstant.UNDERSCORE).concat(this.datePipe.transform(this.valueStartDate, 'dd/MM/yyyy'))
                        .concat(SharedConstant.UNDERSCORE).concat(this.datePipe.transform(this.valueEndDate, 'dd/MM/yyyy')),
        'reportFormatName': 'pdf',
        'printCopies': 1,
        'PrintType': -1,
        'reportparameters': params
      };
      this.taxeService.downloadVatDeclarationJasperReport(dataToSend).subscribe(res => {
        this.fileServiceService.downLoadFile(res.objectData);
      });
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
    if (!this.valueStartDate && !this.valueEndDate) {
      this.showEndDateErrorMessage = true;
      this.showStartDateErrorMessage = true;
    } else if (!this.valueStartDate) {
      this.showStartDateErrorMessage = true;
    } else if (!this.valueEndDate) {
      this.showEndDateErrorMessage = true;
    } else {
      this.gridSettings.state.skip = 0;
      this.searchDocuments();
    }
  }
  searchDocuments() {
    let startdate =this.valueStartDate ? this.valueStartDate.getFullYear() + ',' + (this.valueStartDate.getMonth() + NumberConstant.ONE) + ',' + this.valueStartDate.getDate() : -1;
    let enddate = this.valueEndDate ? this.valueEndDate.getFullYear() + ',' + (this.valueEndDate.getMonth() + NumberConstant.ONE) + ',' + this.valueEndDate.getDate() : -1;
     this.reportingService.getVatDeclarationLines(startdate, enddate, this.isPurchaseType, this.idTier).subscribe(res => {
          if(res.length > 0){
            res.forEach(element => {
              if(element.DocumentCode !== "Totaux"){
                this.itemsList.push(element);
              }
              if(element.DocumentCode == "Totaux"){
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
  public ChangeType(){
    this.isPurchaseType = !this.isPurchaseType;
    this.idTier = 0;
  }
  public tierSelected($event){
    if($event && $event.selectedValue){
      this.idTier = $event.selectedValue;
    }else{
      this.idTier =0;
    }
  }
}
