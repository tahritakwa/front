import { Component, ComponentRef, HostListener, OnDestroy, OnInit, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FiscalYearDropdownComponent } from '../../../shared/components/fiscal-year-dropdown/fiscal-year-dropdown.component';
import { IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';
import { Subscription } from 'rxjs/Subscription';
import { ValidationService } from '../../../shared/services/validation/validation.service';
import { FormModalDialogService } from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { ReportingInModalComponent } from '../../../shared/components/reports/reporting-in-modal/reporting-in-modal.component';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { AccountingConfigurationService } from '../../services/configuration/accounting-configuration.service';
import { ReportingConstant } from '../../../constant/accounting/reporting.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { TranslateService } from '@ngx-translate/core';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { DataSourceRequestState } from '@progress/kendo-data-query';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { DataStateChangeEvent, GridComponent, RowClassArgs } from '@progress/kendo-angular-grid';
import { SharedAccountingConstant } from '../../../constant/accounting/sharedAccounting.constant';
import { ReportingService } from '../../services/reporting/reporting.service';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { Observable } from 'rxjs/Observable';
import { GenericAccountingService } from '../../services/generic-accounting.service';
import { DatePipe } from '@angular/common';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { Operation } from '../../../../COM/Models/operations';
import { CompanyService } from '../../../administration/services/company/company.service';
import { Currency } from '../../../models/administration/currency.model';
import { FiscalYearService } from '../../services/fiscal-year/fiscal-year.service';
import { FiscalYearStateEnumerator } from '../../../models/enumerators/fiscal-year-state-enumerator.enum';
import NumberFormatOptions = Intl.NumberFormatOptions;
import { AccountsConstant } from '../../../constant/accounting/account.constant';
import {AccountingConfigurationConstant} from '../../../constant/accounting/accounting-configuration.constant';
import {ActivatedRoute, Router} from '@angular/router';
import {FiscalYearConstant} from '../../../constant/accounting/fiscal-year.constant';
import {DocumentAccountConstant} from '../../../constant/accounting/document-account.constant';
import {saveAs} from '@progress/kendo-file-saver';
import {SpinnerService} from '../../../../COM/spinner/spinner.service';
import {ReportTemplateDefaultParameters} from '../../../models/accounting/report-template-default-parameters';
import {KeyboardConst} from '../../../constant/keyboard/keyboard.constant';
import {StarkRolesService} from '../../../stark-permissions/service/roles.service';
import { ReducedCurrency } from '../../../models/administration/reduced-currency.model';
import { RoleConfigConstant } from '../../../Structure/_roleConfigConstant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { ReportTemplateDefaultParams } from '../../../models/accounting/report-template-default-params';

@Component({
  selector: 'app-generate-state-of-income',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './generate-state-of-income.component.html',
  styleUrls: ['./generate-state-of-income.component.scss']
})

export class GenerateStateOfIncomeComponent implements OnInit, OnDestroy, IModalDialog {

  public stateOfIncomeTypeData: any[];
  public stateOfIncomeTypeDataFilter: any[];
  public stateOfIncomeForm: FormGroup;
  public reportConfigFormGroup: FormGroup;
  public editLineMode = false;
  public editedRowIndex: number;
  public readonly SIMPLE_STATE_OF_INCOME_REPORT = 'stateOfIncome';
  public readonly ANNEX_STATE_OF_INCOME_REPORT = 'AnnexeStateOfIncome';

  public signValues;
  firstGeneration = true;
  @ViewChild(FiscalYearDropdownComponent) fiscalYearDropdownComponent;

  options: Partial<IModalDialogOptions<any>>;

  public spinner = false;
  private subscription: Subscription;

  @ViewChild(GridComponent)
  private grid: GridComponent;
  public formatNumberOptions: NumberFormatOptions;

  public gridState: DataSourceRequestState = {
    skip: NumberConstant.ZERO,
    filter: { // Initial filter descriptor
      logic: 'and',
      filters: []
    }
  };
  public columnsConfig: ColumnSettings[] = ReportingConstant.REPORTS_DEFAULT_COLUMNS_CONFIG;
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig
  };
  public displayReportDetails = false;
  public previousFiscalYearLabel = '-';
  public currentFiscalYearLabel = '-';
  public currentFiscalYear: any;
  fiscalYears: any;


  fiscalYearIsOpened = true;

  lastUpdated: any;
  user: any;
  reportLinesOnPreview: any;
  provisionalEdition = false;
  currencyCode: string;
  urlReport = '';
  nameReport = '';
  reportType = '';
  public AccountingPermissions = PermissionConstant.AccountingPermissions;

  constructor(private fb: FormBuilder,
    private validationService: ValidationService,
    private translate: TranslateService,
    private accountingConfigurationService: AccountingConfigurationService,
    private reportingService: ReportingService,
    private genericAccountingService: GenericAccountingService,
    private growlService: GrowlService,
    private fiscalYearService: FiscalYearService,
    private datePipe: DatePipe,
    private formModalDialogService: FormModalDialogService,
    private swalWarrings: SwalWarring,
    private viewRef: ViewContainerRef,
    private route: ActivatedRoute,
    public authService: AuthService,
    private companyService: CompanyService,
    private reportService: ReportingService,
    private router: Router,
    private spinnerService: SpinnerService) {
    if (this.route.snapshot.data['currentFiscalYear']) {
      this.currentFiscalYear = this.route.snapshot.data['currentFiscalYear'];
      this.fiscalYearIsOpened = this.currentFiscalYear.closingState === FiscalYearStateEnumerator.Open
        || this.currentFiscalYear.closingState === FiscalYearStateEnumerator.PartiallyClosed;
      if (!this.fiscalYearIsOpened) {
        this.growlService.warningNotification(this.translate.instant(SharedAccountingConstant.SELECTED_FISCAL_YEAR_IS_NOT_OPENED_YOU_ARE_IN_READ_MODE));
      }
    } else {
      this.accountingConfigurationService.getJavaGenericService().getEntityList(
        AccountingConfigurationConstant.CURRENT_FISCAL_YEAR_URL
      ).subscribe(data => {
        this.currentFiscalYear = data;
        this.fiscalYearIsOpened = data.closingState === FiscalYearStateEnumerator.Open || data.closingState === FiscalYearStateEnumerator.PartiallyClosed;
        if (!this.fiscalYearIsOpened) {
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

  public rowClassCallback = (context: RowClassArgs) => {
    return { grayed: context.dataItem.highlighted };
  }

  public initSignValues() {
    this.signValues = [{ negative: false, status: `${this.translate.instant(ReportingConstant.POSITIVE)}` },
    { negative: true, status: `${this.translate.instant(ReportingConstant.NEGATIVE)}` }];
  }

  initGridDataSource(data?: any) {
    if (data !== undefined) {
      this.assignDataToGrid(data);
    } else {
      this.spinner = true;
      this.reportingService.getJavaGenericService().getEntityList(`${ReportingConstant.GENERATE_ANNUAL_REPORT}/` +
        `${this.stateOfIncomeForm.value.fiscalYearId}/${ReportingConstant.SOI}`)
        .subscribe(reportLines => {
          this.assignDataToGrid(reportLines);
        }, () => {}, () => {
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

  private createAddForm() {
    this.stateOfIncomeForm = this.fb.group({
      fiscalYearId: ['', [Validators.required]],
      stateOfIncomeType: ['', [Validators.required]],
    });
  }

  previewReportInGrid() {
    if (this.stateOfIncomeForm.valid) {
      this.firstGeneration = false;
      this.initGridDataSource();
    } else {
      this.validationService.validateAllFormFields(this.stateOfIncomeForm);
    }
  }


getUrlReport() {
  if (this.stateOfIncomeForm.getRawValue().stateOfIncomeType === NumberConstant.ZERO) {
    this.urlReport = `${ReportingConstant.JASPER_ENTITY_NAME}/${ReportingConstant.GENERATE_ANNUAL_REPORT_JASPER}/`;
    this.nameReport = this.translate.instant(ReportingConstant.STATE_OF_INCOME);
  } else {
    this.urlReport = `${ReportingConstant.JASPER_ENTITY_NAME}/${ReportingConstant.GENERATE_ANNUAL_REPORT_ANNEX_JASPER}/`;
    this.nameReport = this.translate.instant(ReportingConstant.ANNEX_STATE_OF_INCOME);
  }
}


  onPrintClick() {
    this.reportService.getJavaGenericService().getData(AccountsConstant.TOMCAT_SERVER_URL).subscribe(data => {
      this.openPrintModal(data);
    });
  }

  onClickPrintJasper() {
    this.spinner = true;
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
    this.getUrlReport();
    this.companyService.getCurrentCompany().subscribe( company => {
      let srcPicture = this.companyService.getPicture(company.AttachmentUrl)
      const printPDF = () => {
        this.genericAccountingService.setCompanyInfos(dataToSend, company);
       const reportTemplateParams = new ReportTemplateDefaultParams(dataToSend.company,dataToSend.logoDataBase64, dataToSend.companyAdressInfo, this.provisionalEdition, dataToSend.generationDate,dataToSend.commercialRegister,dataToSend.matriculeFisc,dataToSend.mail,dataToSend.webSite,dataToSend.tel);
     this.reportingService.getJavaGenericService().saveEntity(reportTemplateParams,
      this.urlReport + `${this.stateOfIncomeForm.value.fiscalYearId}/${ReportingConstant.SOI}`)
      .subscribe(data => {
        this.genericAccountingService.downloadPDFFile(data, this.nameReport);

       }, () => { }, () => {
         this.spinner = false;
       });
             }
             if (srcPicture == ""){
               dataToSend.logoDataBase64= "";
               printPDF();
             }
             else{ srcPicture.subscribe((res:any)=>{
              if(res){
                dataToSend.logoDataBase64= res;}},
                () => {dataToSend.logoDataBase64= "";},
                () => printPDF());
          }
   });

  }
  openPrintModal(url) {
    if (this.stateOfIncomeForm.invalid) {
      return;
    }
    let report;
    if (this.stateOfIncomeForm.getRawValue().stateOfIncomeType === NumberConstant.ZERO) {
      report = this.SIMPLE_STATE_OF_INCOME_REPORT;
    } else {
      report = this.ANNEX_STATE_OF_INCOME_REPORT;
    }
    const dataToSend = {
      accountingUrl: url.url,
      provisionalEdition: this.provisionalEdition,
      fiscalYearId: this.stateOfIncomeForm.controls.fiscalYearId.value,
      reportType: ReportingConstant.SOI,
      company: '',
      companyAdressInfo: '',
      companyCode: '',
      reportName: report
    };
    this.companyService.getCurrentCompany().subscribe(company => {
      this.genericAccountingService.setCompanyInfo(dataToSend, company);
    }, error => {}, () => {
      this.formModalDialogService.openDialog(null, ReportingInModalComponent, this.viewRef, null, dataToSend, null,
        SharedConstant.MODAL_DIALOG_SIZE_ML);
    });
  }

  receiveCurrentFiscalYear($event) {
    if ($event !== undefined && $event.selectedValue !== undefined) {
      this.stateOfIncomeForm.controls['fiscalYearId'].setValue($event.selectedValue);
      this.fiscalYearService.getJavaGenericService().getEntityById($event.selectedValue).subscribe(data => {
        this.fiscalYearIsOpened = data.closingState === FiscalYearStateEnumerator.Open
        || data.closingState === FiscalYearStateEnumerator.PartiallyClosed;
        if (!this.fiscalYearIsOpened) {
          this.growlService.warningNotification(this.translate.instant(SharedAccountingConstant.SELECTED_FISCAL_YEAR_IS_NOT_OPENED_YOU_ARE_IN_READ_MODE));
        }
        this.previewReportInGrid();
      });
    }
  }

  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.options = options;
  }

  public lineClickHandler({ rowIndex, dataItem }) {
    if (this.authService.hasAuthority(this.AccountingPermissions.UPDATE_FINANCIAL_STATES_REPORTS_FORMULA) && this.fiscalYearIsOpened) {
      this.stateOfIncomeForm.disable();
      if ( this.editedRowIndex !== undefined && this.editedRowIndex !== rowIndex && this.editLineMode) {
        this.saveHandler();
        this.closeEditor(this.editedRowIndex);
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
    this.stateOfIncomeForm.enable();
    if (this.stateOfIncomeForm.getRawValue().fiscalYearId) {
      this.fiscalYearService.getJavaGenericService().getEntityById(this.stateOfIncomeForm.getRawValue().fiscalYearId).subscribe(data => {
        this.fiscalYearIsOpened = data.closingState === FiscalYearStateEnumerator.Open || data.closingState === FiscalYearStateEnumerator.PartiallyClosed;
      });
    }
  }

  terminateOperation(rowIndex: number) {
    this.initGridDataSource();
    this.closeEditor(rowIndex);
  }

  public saveHandler() {
    this.reportingService.saveHandler(this.editedRowIndex, this.reportConfigFormGroup, this.terminateOperation.bind(this));
  }

  public dataStateChange(state: DataStateChangeEvent): void {
    this.gridSettings.state = state;
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

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.genericAccountingService.handleCanDeactivateToLeaveCurrentComponent(this.isStateOfIncomeFormChanged.bind(this));
  }

  isStateOfIncomeFormChanged() {
    return this.reportConfigFormGroup !== undefined;
  }

  private setSelectedCurrency(currency: ReducedCurrency) {
    this.formatNumberOptions = {
      style: 'decimal',
      maximumFractionDigits: currency.Precision,
      minimumFractionDigits: currency.Precision
    };
  }

  handleFilterStateOfIncome(writtenValue) {
    this.stateOfIncomeTypeData = this.stateOfIncomeTypeDataFilter.filter((s) =>
      s.text.toLowerCase().includes(writtenValue.toLowerCase())
      || s.text.toLocaleLowerCase().includes(writtenValue.toLowerCase())
    );
  }

  ngOnInit() {
    this.initSignValues();
    this.companyService.getDefaultCurrencyDetails().subscribe((currency: ReducedCurrency)=> {
      this.setSelectedCurrency(currency);
      this.currencyCode = currency.Code;
    });
    this.stateOfIncomeTypeData = [{
      text: this.translate.instant(ReportingConstant.STATE_OF_INCOME),
      stateOfIncomeType: NumberConstant.ZERO
    }, {
      text: this.translate.instant(ReportingConstant.ANNEX_STATE_OF_INCOME),
      stateOfIncomeType: NumberConstant.ONE
    }];
    this.stateOfIncomeTypeDataFilter = this.stateOfIncomeTypeData;
    this.createAddForm();
    this.stateOfIncomeForm.controls['stateOfIncomeType'].setValue(this.stateOfIncomeTypeData[0].stateOfIncomeType);
    this.stateOfIncomeForm.controls['fiscalYearId'].setValue(this.currentFiscalYear.id);
    if(this.authService.hasAuthority(this.AccountingPermissions.VIEW_FINANCIAL_STATES_REPORTS) ||
      this.authService.hasAuthority(this.AccountingPermissions.UPDATE_FINANCIAL_STATES_REPORTS_FORMULA)){
      this.initGridDataSource();
    }
  }

  ngOnDestroy(): void {
    if (this.subscription !== undefined) {
      this.subscription.unsubscribe();
    }
  }

  resetFormula(dataItem) {
    if (dataItem.id) {
      this.reportingService.getJavaGenericService().callService(Operation.PUT, ReportingConstant.RESET_REPORT_LINE, dataItem).finally(() => {
          this.terminateOperation(this.editedRowIndex);
        }
      ).subscribe();
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
    this.spinner = true;
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
    if (this.stateOfIncomeForm.getRawValue().stateOfIncomeType === NumberConstant.ZERO) {
        this.nameReport = this.translate.instant(ReportingConstant.STATE_OF_INCOME);
        this.urlReport = `${ReportingConstant.EXCEL_ENTITY_NAME}/${ReportingConstant.GET_ANNUAL_REPORT}/`;
    } else {
        this.nameReport = this.translate.instant(ReportingConstant.ANNEX_STATE_OF_INCOME);
        this.urlReport = `${ReportingConstant.EXCEL_ENTITY_NAME}/${ReportingConstant.GENERATE_ANNUAL_REPORT_ANNEX}/`;
    }
    this.companyService.getCurrentCompany().subscribe( company => {
      let srcPicture = this.companyService.getPicture(company.AttachmentUrl)
      const printPDF = () => {
        this.genericAccountingService.setCompanyInfos(dataToSend, company);
        const reportTemplateParams = new ReportTemplateDefaultParams(dataToSend.company,dataToSend.logoDataBase64, dataToSend.companyAdressInfo, this.provisionalEdition, dataToSend.generationDate,dataToSend.commercialRegister,dataToSend.matriculeFisc,dataToSend.mail,dataToSend.webSite,dataToSend.tel);
      this.reportingService.getJavaGenericService().saveEntity(reportTemplateParams, this.urlReport + `${this.currentFiscalYear.id}/${ReportingConstant.SOI}`)
        .subscribe(data => {
         this.spinner = false;
         this.genericAccountingService.downloadExcelFile(data, this.nameReport);
       }, () => {}, () => {
         this.spinner = false;
       });
             }
             if (srcPicture == ""){
               dataToSend.logoDataBase64= "";
               printPDF();
             }
             else{ srcPicture.subscribe((res:any)=>{
              if(res){
                dataToSend.logoDataBase64= res;}},
                () => {dataToSend.logoDataBase64= "";},
                () => printPDF());
          }
      this.spinnerService.hideLaoder();
   });
  }

  public goToHistoric() {
    this.router.navigateByUrl(ReportingConstant.REPORT_HISTORY_URL.concat(ReportingConstant.SOI));
  }
}
