import { Component, HostListener, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { TranslateService } from '@ngx-translate/core';
import { FormModalDialogService } from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { ReportingInModalComponent } from '../../../shared/components/reports/reporting-in-modal/reporting-in-modal.component';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { DataStateChangeEvent, GridComponent, RowClassArgs } from '@progress/kendo-angular-grid';
import { DataSourceRequestState } from '@progress/kendo-data-query';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { ReportingConstant } from '../../../constant/accounting/reporting.constant';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { SharedAccountingConstant } from '../../../constant/accounting/sharedAccounting.constant';
import { ReportingService } from '../../services/reporting/reporting.service';
import { ValidationService } from '../../../shared/services/validation/validation.service';
import { Observable } from 'rxjs/Observable';
import { GenericAccountingService } from '../../services/generic-accounting.service';
import { DatePipe } from '@angular/common';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { AccountingConfigurationService } from '../../services/configuration/accounting-configuration.service';
import { Operation } from '../../../../COM/Models/operations';
import { Currency } from '../../../models/administration/currency.model';
import NumberFormatOptions = Intl.NumberFormatOptions;
import { CompanyService } from '../../../administration/services/company/company.service';
import { FiscalYearStateEnumerator } from '../../../models/enumerators/fiscal-year-state-enumerator.enum';
import { FiscalYearService } from '../../services/fiscal-year/fiscal-year.service';
import { AccountsConstant } from '../../../constant/accounting/account.constant';
import {ActivatedRoute, Router} from '@angular/router';
import {AccountingConfigurationConstant} from '../../../constant/accounting/accounting-configuration.constant';
import {FiscalYearConstant} from '../../../constant/accounting/fiscal-year.constant';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {SpinnerService} from '../../../../COM/spinner/spinner.service';
import {ReportTemplateDefaultParameters} from '../../../models/accounting/report-template-default-parameters';
import {KeyboardConst} from '../../../constant/keyboard/keyboard.constant';
import {StarkRolesService} from '../../../stark-permissions/service/roles.service';
import { ReducedCurrency } from '../../../models/administration/reduced-currency.model';
import { RoleConfigConstant } from '../../../Structure/_roleConfigConstant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { ReportTemplateDefaultParams } from './../../../models/accounting/report-template-default-params';


const INTERMEDIARY_BALANCE = 'intermediaryBalance';

@Component({
  selector: 'app-intermediary-balance',
  templateUrl: './intermediary-balance.component.html',
  styleUrls: ['./intermediary-balance.component.scss']
})
export class IntermediaryBalanceComponent implements OnInit {

  public intermediaryBalanceForm: FormGroup;

  public editedRowIndex: number;
  public editLineMode = false;
  public cib = ReportingConstant.CIB;
  public iib = ReportingConstant.IIB;
  public currentType = this.cib;

  provisionalEdition = false;
  public reportConfigFormGroup: FormGroup;

  @ViewChild(GridComponent)
  private grid: GridComponent;

  spinner=false;
  firstGeneration = true;
  public gridState: DataSourceRequestState = {
    filter: { // Initial filter descriptor
      logic: 'and',
      filters: []
    }
  };

  public previousFiscalYearLabel = '-';
  public currentFiscalYearLabel = '-';
  public currentFiscalYear: any;
  fiscalYears: any;

  fiscalYearIsOpened = true;
  public signValues;
  public columnsConfig: ColumnSettings[] = ReportingConstant.INTERMEDIARY_BALANCE_REPORTS_DEFAULT_COLUMNS_CONFIG;

  public displayReportDetails = false;
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig
  };


  lastUpdated: any;
  user: any;
  reportLinesOnPreview: any;
  public formatNumberOptions: NumberFormatOptions;
  public currencyCode: string;

  public AccountingPermissions = PermissionConstant.AccountingPermissions;

  constructor(private fb: FormBuilder, private growlService: GrowlService, private reportingService: ReportingService,
    private translate: TranslateService, private formModalDialogService: FormModalDialogService, private validationService: ValidationService,
    private viewContainerRef: ViewContainerRef, private genericAccountingService: GenericAccountingService, private route: ActivatedRoute,
    private accountingConfigurationService: AccountingConfigurationService, private fiscalYearService: FiscalYearService, private datePipe: DatePipe,
    public authService: AuthService, private companyService: CompanyService, private reportService: ReportingService, private spinnerService: SpinnerService,
    private router: Router) {
    if (this.route.snapshot.data['currentFiscalYear']) {
      this.currentFiscalYear = this.route.snapshot.data['currentFiscalYear'];
      this.fiscalYearIsOpened = this.currentFiscalYear.closingState === FiscalYearStateEnumerator.Open
      || this.currentFiscalYear.closingState === FiscalYearStateEnumerator.PartiallyClosed;
      if(!this.fiscalYearIsOpened){
        this.growlService.warningNotification(this.translate.instant(SharedAccountingConstant.SELECTED_FISCAL_YEAR_IS_NOT_OPENED_YOU_ARE_IN_READ_MODE));
      }
    } else {
      this.accountingConfigurationService.getJavaGenericService().getEntityList(
        AccountingConfigurationConstant.CURRENT_FISCAL_YEAR_URL
      ).subscribe(data => {
        this.currentFiscalYear = data;
        this.fiscalYearIsOpened = data.closingState === FiscalYearStateEnumerator.Open || data.closingState === FiscalYearStateEnumerator.PartiallyClosed;
        if(!this.fiscalYearIsOpened){
          this.growlService.warningNotification(this.translate.instant(SharedAccountingConstant.SELECTED_FISCAL_YEAR_IS_NOT_OPENED_YOU_ARE_IN_READ_MODE));
        }
      });
    }
    if (this.route.snapshot.data['fiscalYears']) {
      this.fiscalYears = this.route.snapshot.data['fiscalYears'];
    } else {
      this.fiscalYearService.getJavaGenericService().getEntityList(FiscalYearConstant.FIND_ALL_METHOD_URL).subscribe(data => {
        this.fiscalYears = data;
      });
    }
  }

  private createInputForm(): void {
    this.intermediaryBalanceForm = this.fb.group({
      fiscalYearId: [0, [Validators.required, Validators.min(1)]],
    });
  }

  public rowClassCallback = (context: RowClassArgs) => {
    return { grayed: context.dataItem.highlighted };
  }

  previewReportInGrid() {
    if (this.intermediaryBalanceForm.valid) {
      this.firstGeneration = false;
      this.initGridDataSource();
    } else {
      this.validationService.validateAllFormFields(this.intermediaryBalanceForm);
    }
  }

  receiveCurrentFiscalYear($event) {
    if ($event !== undefined && $event.selectedValue !== undefined) {
      this.closeEditor(this.editedRowIndex);
      this.intermediaryBalanceForm.controls['fiscalYearId'].setValue($event.selectedValue);
      this.fiscalYearService.getJavaGenericService().getEntityById($event.selectedValue).subscribe(data => {
        this.fiscalYearIsOpened = data.closingState === FiscalYearStateEnumerator.Open
          || data.closingState === FiscalYearStateEnumerator.PartiallyClosed;
        if (!this.fiscalYearIsOpened) {
          this.growlService.warningNotification(
            this.translate.instant(SharedAccountingConstant.SELECTED_FISCAL_YEAR_IS_NOT_OPENED_YOU_ARE_IN_READ_MODE)
          );
        }
        this.previewReportInGrid();
      });
    }
  }

  public onPrintClick(): void {
    this.reportService.getJavaGenericService().getData(AccountsConstant.TOMCAT_SERVER_URL).subscribe(data => {
      this.openPrintModal(data);
    });
  }

  public onPrintClickJasper (): void {
    const dataToSend = {
      company: '',
      logoDataBase64:'',
      companyAdressInfo: '',
      generationDate: '',
      commercialRegister:'',
      matriculeFisc:'',
      mail:'',
      webSite:'',
      tel:'',
    };
    this.spinner = true;

    this.companyService.getCurrentCompany().subscribe( company => {
      let srcPicture = this.companyService.getPicture(company.AttachmentUrl)
      const printPDF = () => {
         this.genericAccountingService.setCompanyInfos(dataToSend, company);
         const reportTemplateParams = new ReportTemplateDefaultParams(dataToSend.company,dataToSend.logoDataBase64, dataToSend.companyAdressInfo, this.provisionalEdition, dataToSend.generationDate,dataToSend.commercialRegister,dataToSend.matriculeFisc,dataToSend.mail,dataToSend.webSite,dataToSend.tel);
         this.reportingService.getJavaGenericService().saveEntity(reportTemplateParams,
          ReportingConstant.JASPER_ENTITY_NAME + `/` +
          ReportingConstant.GENERATE_ANNUAL_REPORT_JASPER + `/` +
          `${this.intermediaryBalanceForm.value.fiscalYearId}/${ReportingConstant.IB}`)
         .subscribe(data => {
          this.genericAccountingService.downloadPDFFile(data, this.translate.instant(ReportingConstant.INTERMEDIARY_BALANCE));
         }, () => { }, () => {
           this.spinner = false;
         });
             }
             if (srcPicture == ""){
               dataToSend.logoDataBase64= "";
               printPDF();
             }
             else{ srcPicture.subscribe(
              (res:any)=>{
                if(res){
                  dataToSend.logoDataBase64= res;}},
                  () => {dataToSend.logoDataBase64= "";},
                  () => printPDF());
            }
   });
  }

  openPrintModal(url) {
    if (this.intermediaryBalanceForm.invalid) {
      return;
    }
    const dataToSend = {
      accountingUrl: url.url,
      provisionalEdition: this.provisionalEdition,
      fiscalYearId: this.intermediaryBalanceForm.controls.fiscalYearId.value,
      reportType: ReportingConstant.IB,
      company: '',
      companyAdressInfo: '',
      companyCode: '',
      reportName: INTERMEDIARY_BALANCE
    };

    this.companyService.getCurrentCompany().subscribe(company => {
      this.genericAccountingService.setCompanyInfo(dataToSend, company);
    },error => {}, ()=>{
      this.formModalDialogService.openDialog(null, ReportingInModalComponent, this.viewContainerRef, null, dataToSend, null,
        SharedConstant.MODAL_DIALOG_SIZE_ML);
    });
  }

  public lineClickHandler({ rowIndex, dataItem }) {
    if (this.authService.hasAuthority(this.AccountingPermissions.UPDATE_FINANCIAL_STATES_REPORTS_FORMULA) && this.fiscalYearIsOpened) {
      this.intermediaryBalanceForm.disable();
      if ( this.editedRowIndex !== undefined && this.editedRowIndex !== rowIndex) {
        this.saveHandler();
      }
      this.reportConfigFormGroup = this.reportingService.editHandler(rowIndex, dataItem, this.grid);
      if (this.reportConfigFormGroup) {
          if (dataItem.negative === this.signValues[1].status) {
            this.reportConfigFormGroup.controls['negative'].setValue(true);
          } else {
            this.reportConfigFormGroup.controls['negative'].setValue(false);
          }
          this.editedRowIndex = rowIndex;
          this.editLineMode = true;
        }
    }
  }

  public cancelHandler({ rowIndex }) {
    this.closeEditor(rowIndex);
  }

  public closeEditor(rowIndex: number) {
    this.grid.closeRow(rowIndex);
    this.intermediaryBalanceForm.enable();
    if(this.intermediaryBalanceForm.getRawValue().fiscalYearId){
      this.fiscalYearService.getJavaGenericService().getEntityById(this.intermediaryBalanceForm.getRawValue().fiscalYearId).subscribe(data => {
        this.fiscalYearIsOpened = data.closingState === FiscalYearStateEnumerator.Open || data.closingState === FiscalYearStateEnumerator.PartiallyClosed;
      });
    }
  }

  public keyEnterAction(sender: GridComponent, formGroup: any, e: KeyboardEvent) {
    const rowIndex = this.editedRowIndex;
    if (!formGroup || !formGroup.valid || e.key !== KeyboardConst.ENTER) {
      return;
    }
    this.editedRowIndex = rowIndex;
    this.reportConfigFormGroup = formGroup;
    this.saveHandler();
  }

  terminateOperation(rowIndex: number) {
    this.initGridDataSource();
    this.closeEditor(rowIndex);
    this.editedRowIndex = undefined;
  }

  resetFormula(dataItem) {
    if (dataItem.id) {
      this.reportingService.getJavaGenericService().callService(Operation.PUT, ReportingConstant.RESET_REPORT_LINE, dataItem).finally(()=>{
          this.terminateOperation(this.editedRowIndex);
        }
      ).subscribe();
    }
  }

  public saveHandler() {
    this.reportingService.saveHandler(this.editedRowIndex, this.reportConfigFormGroup, this.terminateOperation.bind(this));
    this.editedRowIndex = undefined;
  }

  public initSignValues() {
    this.signValues = [{ negative: false, status: `${this.translate.instant(ReportingConstant.POSITIVE)}` },
    { negative: true, status: `${this.translate.instant(ReportingConstant.NEGATIVE)}` }];
  }
  initGridDataSource(data?: any) {
    if (data !== undefined) {
      this.assignDataToGrid(data);
    } else {
      this.spinner=true;
      this.reportingService.getJavaGenericService().getEntityList(`${ReportingConstant.GENERATE_ANNUAL_REPORT}/` +
        `${this.intermediaryBalanceForm.getRawValue().fiscalYearId}/${this.currentType}`)
        .subscribe(reportLines => {
          this.assignDataToGrid(reportLines);
        },()=>{},()=>{
          this.spinner = false;
        });
    }
  }

  assignDataToGrid(data) {
    data.map(reportLine => {
      this.signValues = [{ negative: false, status: `${this.translate.instant(ReportingConstant.POSITIVE)}` },
      { negative: true, status: `${this.translate.instant(ReportingConstant.NEGATIVE)}` }];
      if (reportLine.negative === true) {
        reportLine.negative = this.signValues[1].status;
      } else if (reportLine.negative === false) {
        reportLine.negative = this.signValues[0].status;
      }
    });
    this.reportLinesOnPreview = data;
    this.gridSettings.gridData = data;
    this.previousFiscalYearLabel = data[0].previousFiscalYear;
    this.currentFiscalYearLabel = data[0].fiscalYear.name;
    const lastUpdatedReportLine = data.sort((a: any, b: any) => {
      return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
    });
    this.user = lastUpdatedReportLine[0].user;
    this.lastUpdated = this.datePipe.transform(lastUpdatedReportLine[0].lastUpdated, SharedAccountingConstant.YYYY_MM_DD_HH_MM_SS);
    this.displayReportDetails = true;
  }

  public dataStateChange(state: DataStateChangeEvent): void {
    this.gridSettings.state = state;
  }

  changeReportType() {
    this.closeEditor(this.editedRowIndex);
    if (this.currentType === this.cib) {
      this.currentType = this.iib;
    } else {
      this.currentType = this.cib;
    }
    this.initGridDataSource();
  }

  handleChangeReportType() {
    if (!this.isIntermediaryBalanceFormChanged()) {
      this.changeReportType();
    } else {
      this.genericAccountingService.openModalToConfirmSwitchingToAnotherOperationType()
        .then((result) => {
          if (result.value) {
            this.changeReportType();
          }
        });
    }
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.genericAccountingService.handleCanDeactivateToLeaveCurrentComponent(this.isIntermediaryBalanceFormChanged.bind(this));
  }

  isIntermediaryBalanceFormChanged() {
    return this.reportConfigFormGroup !== undefined;
  }
  private setSelectedCurrency(currency: ReducedCurrency) {
    this.formatNumberOptions = {
      style: 'decimal',
      maximumFractionDigits: currency.Precision,
      minimumFractionDigits: currency.Precision
    };
  }
  ngOnInit() {
    this.initSignValues();
    this.companyService.getDefaultCurrencyDetails().subscribe((currency: ReducedCurrency) => {
      this.setSelectedCurrency(currency);
      this.currencyCode = currency.Code;
    });
    this.createInputForm();
    this.intermediaryBalanceForm.controls['fiscalYearId'].setValue(this.currentFiscalYear.id);
    if(this.authService.hasAuthority(this.AccountingPermissions.VIEW_FINANCIAL_STATES_REPORTS) ||
      this.authService.hasAuthority(this.AccountingPermissions.UPDATE_FINANCIAL_STATES_REPORTS_FORMULA)){
      this.initGridDataSource();
    }
  }
  @HostListener('document:keydown.Enter', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.previewReportInGrid();
  }
  changeProvisionalEdition() {
    this.provisionalEdition = !this.provisionalEdition;
  }

  onClickPrintExcel() {
    const dataToSend = {
      company: '',
      logoDataBase64:'',
      companyAdressInfo: '',
      generationDate: '',
      commercialRegister:'',
      matriculeFisc:'',
      mail:'',
      webSite:'',
      tel:'',
    };
    this.spinner = true;
    let reportName = this.translate.instant(ReportingConstant.INTERMEDIARY_BALANCE);
    let reportUrl = ReportingConstant.EXCEL_ENTITY_NAME + `/`+ReportingConstant.GET_ANNUAL_REPORT+ `/`;
    this.companyService.getCurrentCompany().subscribe( company => {
      let srcPicture = this.companyService.getPicture(company.AttachmentUrl)
      const printPDF = () => {
        this.genericAccountingService.setCompanyInfos(dataToSend, company);
        const reportTemplateParams = new ReportTemplateDefaultParams(dataToSend.company,dataToSend.logoDataBase64, dataToSend.companyAdressInfo, this.provisionalEdition, dataToSend.generationDate,dataToSend.commercialRegister,dataToSend.matriculeFisc,dataToSend.mail,dataToSend.webSite,dataToSend.tel);
      this.reportingService.getJavaGenericService().saveEntity(reportTemplateParams,
       reportUrl +`${this.currentFiscalYear.id}/${ReportingConstant.IIB}`)
        .subscribe(data => {
         this.spinner = false;
         this.genericAccountingService.downloadExcelFile(data, reportName);
       }, () => {}, () => {
         this.spinner = false;
       });
             }
             if (srcPicture == ""){
               dataToSend.logoDataBase64= "";
               printPDF();
             }
             else{ srcPicture.subscribe(
              (res:any)=>{
                if(res){
                  dataToSend.logoDataBase64= res;}},
                  () => {dataToSend.logoDataBase64= "";},
                  () => printPDF());
            }
       this.spinnerService.hideLaoder();
   });
  }

  public goToHistoric() {
    this.router.navigateByUrl(ReportingConstant.REPORT_HISTORY_URL.concat(ReportingConstant.CIB));
  }
}
