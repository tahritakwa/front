import { Component, HostListener, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DataStateChangeEvent, GridComponent, GridDataResult, PagerSettings } from '@progress/kendo-angular-grid';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { State } from '@progress/kendo-data-query';
import { FormModalDialogService } from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { FiscalYearConstant } from '../../../constant/accounting/fiscal-year.constant';
import { ReportingConstant } from '../../../constant/accounting/reporting.constant';
import { ReportingService } from '../../services/reporting/reporting.service';
import { BehaviorSubjectService } from '../../services/reporting/behavior-subject.service';
import { PageFilterService } from '../../services/page-filter-accounting.service';
import { GenericAccountingService } from '../../services/generic-accounting.service';
import { AccountingConfigurationService } from '../../services/configuration/accounting-configuration.service';
import { CompanyService } from '../../../administration/services/company/company.service';
import { Currency } from '../../../models/administration/currency.model';
import { SharedAccountingConstant } from '../../../constant/accounting/sharedAccounting.constant';
import NumberFormatOptions = Intl.NumberFormatOptions;
import { JournalService } from '../../services/journal/journal.service';
import { ActivatedRoute } from '@angular/router';
import { ValidationService } from '../../../shared/services/validation/validation.service';
import { AccountsConstant } from '../../../constant/accounting/account.constant';
import { DatePipe } from '@angular/common';
import { ReportingInModalComponent } from '../../../shared/components/reports/reporting-in-modal/reporting-in-modal.component';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { FiscalYearService } from '../../services/fiscal-year/fiscal-year.service';
import { TranslateService } from '@ngx-translate/core';
import { AccountingConfigurationConstant } from '../../../constant/accounting/accounting-configuration.constant';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import {ReportTemplateDefaultParameters} from '../../../models/accounting/report-template-default-parameters';
import {SpinnerService} from '../../../../COM/spinner/spinner.service';
import {JournalConstants} from '../../../constant/accounting/journal.constant';
import {ComponentsConstant} from '../../../constant/shared/components.constant';
import { ReducedCurrency } from '../../../models/administration/reduced-currency.model';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { ReportTemplateDefaultParams } from '../../../models/accounting/report-template-default-params';


@Component({
  selector: 'app-centralisation-of-journals',
  templateUrl: './centralisation-of-journals.component.html',
  styleUrls: ['./centralisation-of-journals.component.scss']
})
export class CentralisationOfJournalsComponent implements OnInit {
  public format = 'n0';
  public stateOfJournalsView: BehaviorSubject<GridDataResult>;
  public readonly CENTRALIZING_OF_JOURNALS = 'centralizingJournal';
  private pageSize = SharedConstant.DEFAULT_ITEMS_NUMBER;
  public currentPage = NumberConstant.ZERO;
  public totalAmountDebit: number;
  public totalAmountCredit: number;
  public stateOfJournalsFilterFormGroup: FormGroup;
  public formatNumberOptions: NumberFormatOptions;
  public currencyCode: string;

  public valuesIdJournal: number[];
  public breakingAccount: number = NumberConstant.TWO;
  public breakingCustomerAccount: number = NumberConstant.TWO;
  public breakingSupplierAccount: number = NumberConstant.TWO;
  public autoCorrect = false;
  public provisionalEdition = false;

  public show = false;
  public journalList: any[] = this.activatedRoute.snapshot.data['journals'];
  public journalListFilter: any[];
  public spinner = false;

  public formatDate = this.translate.instant(SharedConstant.DATE_FORMAT);

  public previousBreakingAccount: number = NumberConstant.TWO;
  public previousBreakingCustomerAccount: number = NumberConstant.TWO;
  public previousBreakingSupplierAccount: number = NumberConstant.TWO;
  public gridState: State = {
    skip: NumberConstant.ZERO,
    take: this.pageSize,
    filter: {
      logic: 'and',
      filters: []
    }
  };

  @ViewChild(GridComponent) grid: GridComponent;

  public gridSettings: GridSettings = {
    state: this.gridState
  };

  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public currentFiscalYear: any;
  public startDate = new Date(this.activatedRoute.snapshot.data['currentFiscalYear'].startDate);
  public endDate = new Date(this.activatedRoute.snapshot.data['currentFiscalYear'].endDate);
  public dropdownSettings = {};
  public limitSelection = NumberConstant.THREE;
  public ShowFilter = true;
  public isMultiSelectTouched: boolean;
  public placeholder = '';
  public journalListSelected = [];
  public AccountingPermissions = PermissionConstant.AccountingPermissions;

  constructor(private behaviorSubjectForGridDataResultService: BehaviorSubjectService, private reportingService: ReportingService,
    private datePipe: DatePipe, private viewRef: ViewContainerRef, private accountingConfigurationService: AccountingConfigurationService,
    private formModalDialogService: FormModalDialogService, public authService: AuthService,
    private pageFilterService: PageFilterService, private genericAccountingService: GenericAccountingService,
    private formBuilder: FormBuilder, private companyService: CompanyService, private reportService: ReportingService,
    private activatedRoute: ActivatedRoute, private validationService: ValidationService, private translate: TranslateService, private spinnerService: SpinnerService,
    private growlService: GrowlService) {
    if (this.activatedRoute.snapshot.data['currentFiscalYear']) {
      this.currentFiscalYear = this.activatedRoute.snapshot.data['currentFiscalYear'];
    } else {
      this.accountingConfigurationService.getJavaGenericService().getEntityList(
        AccountingConfigurationConstant.CURRENT_FISCAL_YEAR_URL
      ).subscribe(data => {
        this.currentFiscalYear = data;
        this.startDate = new Date(this.currentFiscalYear.startDate);
        this.endDate = new Date(this.currentFiscalYear.endDate);
      });
    }
  }

  getValuesJournalIds(formGroup: any) {
    const listeIdjournal = formGroup.value.valuesIdJournal;
    if (listeIdjournal === '' || listeIdjournal === undefined || listeIdjournal.length === 0) {
      return this.journalList.map(line => line.id);
    } else {
      return listeIdjournal;
    }
  }

  checkIfNotValid(value: any) {
    return !Number.isInteger(value) || value == null || value === undefined ||
      value > NumberConstant.EIGHT || value < NumberConstant.TWO ||
      value == null && value.indexOf('.') > 0 || value == null && value.indexOf(',') > 0;
  }

  validatechangedVlaueForBreakingAccount(value: any) {
    if (this.checkIfNotValid(value)) {
      this.stateOfJournalsFilterFormGroup.patchValue({ 'breakingAccount': this.previousBreakingAccount });
    } else {
      this.previousBreakingAccount = value;
    }
  }
  validatechangedVlaueForBreakingCustomerAccount(value: any) {
    if (this.checkIfNotValid(value)) {
      this.stateOfJournalsFilterFormGroup.patchValue({ 'breakingCustomerAccount': this.previousBreakingCustomerAccount });
    } else {
      this.previousBreakingCustomerAccount = value;
    }
  }
  validatechangedVlaueForBreakingSupplierAccount(value: any) {
    if (this.checkIfNotValid(value)) {
      this.stateOfJournalsFilterFormGroup.patchValue({ 'breakingSupplierAccount': this.previousBreakingSupplierAccount });
    } else {
      this.previousBreakingSupplierAccount = value;
    }
  }

  public dataStateChange(state: DataStateChangeEvent): void {
    this.gridSettings.state = state;
    this.currentPage = (state.skip) / (state.take);
    this.pageSize = state.take;
  }

  public onPageChange() {
    if (this.stateOfJournalsFilterFormGroup.valid) {
      if (this.pageFilterService.isTrueIfStartDateIsLowerThanEndDate(this.stateOfJournalsFilterFormGroup)) {
        this.reloadStateOfJournals();
      } else {
        this.growlService.ErrorNotification(this.translate.instant(ReportingConstant.START_DATE_IS_AFTER_END_DATE));
      }
    } else {
      this.validationService.validateAllFormFields(this.stateOfJournalsFilterFormGroup);
    }
  }

  getAccountValues(formgroup: FormGroup) {
    this.breakingAccount = formgroup.value.breakingAccount;
    this.breakingCustomerAccount = formgroup.value.breakingCustomerAccount;
    this.breakingSupplierAccount = formgroup.value.breakingSupplierAccount;
  }

  initPageFilterFormGroupStateOfJournal() {
    return this.formBuilder.group({
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      breakingAccount: [this.breakingAccount, [Validators.required]],
      breakingCustomerAccount: [this.breakingCustomerAccount, [Validators.required]],
      breakingSupplierAccount: [this.breakingSupplierAccount, [Validators.required]],
      valuesIdJournal: ['']
    });
  }

  showError() {
    return (this.valuesIdJournal[0] == null);
  }

  private setSelectedCurrency(currency: ReducedCurrency) {
    this.formatNumberOptions = {
      style: 'decimal',
      maximumFractionDigits: currency.Precision,
      minimumFractionDigits: currency.Precision
    };
  }

  handleJournalFilter(value: string): void {
    this.journalList = this.journalListFilter.filter((s) =>
      s.label.toLowerCase().includes(value.toLowerCase())
      || s.code.toString().includes(value.toLowerCase()));
  }

  public ngOnInit(): void {
    this.initCheckboxMultiSelectJournal();
    this.companyService.getDefaultCurrencyDetails().subscribe((currency: ReducedCurrency)=> {
      this.setSelectedCurrency(currency);
      this.currencyCode = currency.Code;
    });
    this.stateOfJournalsView = this.behaviorSubjectForGridDataResultService;
    this.stateOfJournalsFilterFormGroup = this.initPageFilterFormGroupStateOfJournal();
    this.genericAccountingService.getJournalList().then((data: any) => {
      this.journalList = data;
      this.journalListFilter = this.journalList;
      if(this.authService.hasAuthority(this.AccountingPermissions.VIEW_JOURNALS_REPORTS)) {
        this.pageFilterService.initFormDatesThroughCurrentFiscalYear(this.stateOfJournalsFilterFormGroup, this.reloadStateOfJournals.bind(this),
        SharedAccountingConstant.START_DATE_ACCOUNTING, SharedAccountingConstant.END_DATE_ACCOUNTING, this.currentFiscalYear);
      }
    });
  }

  @HostListener('document:keydown.Enter', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.initStateOfJournals();
  }

  public onSearch() {
    this.initStateOfJournals();
  }

  public initStateOfJournals() {
    if (this.stateOfJournalsFilterFormGroup.valid) {
      if (this.pageFilterService.isTrueIfStartDateIsLowerThanEndDate(this.stateOfJournalsFilterFormGroup)) {
        this.setCurrentPageToFirstPage();
        this.reloadStateOfJournals();
      } else {
        this.growlService.ErrorNotification(this.translate.instant(ReportingConstant.START_DATE_IS_AFTER_END_DATE));
      }
    } else {
      this.validationService.validateAllFormFields(this.stateOfJournalsFilterFormGroup);
    }
  }

  onClickPrintByJasper() {
    if (this.stateOfJournalsFilterFormGroup.valid) {
      if (this.pageFilterService.isTrueIfStartDateIsLowerThanEndDate(this.stateOfJournalsFilterFormGroup)) {
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

        this.companyService.getCurrentCompany().subscribe( company => {
          let srcPicture = this.companyService.getPicture(company.AttachmentUrl)
          const printPDF = () => {
            this.genericAccountingService.setCompanyInfos(dataToSend, company);
            const startDate = this.pageFilterService.getStartDateToUseInPageFilter(this.stateOfJournalsFilterFormGroup);
           const endDate = this.pageFilterService.getEndDateToUseInPageFilter(this.stateOfJournalsFilterFormGroup);

            const reportTemplateParams = new ReportTemplateDefaultParams(dataToSend.company,dataToSend.logoDataBase64, dataToSend.companyAdressInfo, this.provisionalEdition, dataToSend.generationDate,dataToSend.commercialRegister,dataToSend.matriculeFisc,dataToSend.mail,dataToSend.webSite,dataToSend.tel);
          this.reportingService.getJavaGenericService().saveEntity(reportTemplateParams,
           `${ReportingConstant.JASPER_ENTITY_NAME}`
           + `/${ReportingConstant.CENTRALIZING_OF_JOURNALS_REPORT}` + `?breakingAccount=${this.breakingAccount}`
           + `&breakingCustomerAccount=${this.breakingCustomerAccount}&breakingSupplierAccount=${this.breakingSupplierAccount}`
           + `&endDate=${endDate}&startDate=${startDate}&journalIds=${this.valuesIdJournal}`)
           .subscribe(data => {
            this.genericAccountingService.downloadPDFFile(data, this.translate.instant(ReportingConstant.CENTRALISATION_OF_JOURNALS));
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
        this.setCurrentPageToFirstPage();
        this.reloadStateOfJournals();
      } else {
        this.growlService.ErrorNotification(this.translate.instant(ReportingConstant.START_DATE_IS_AFTER_END_DATE));
      }
    } else {
      this.validationService.validateAllFormFields(this.stateOfJournalsFilterFormGroup);
    }
  }

  onClickPrintByTelerik() {
    if (this.stateOfJournalsFilterFormGroup.valid) {
      if (this.pageFilterService.isTrueIfStartDateIsLowerThanEndDate(this.stateOfJournalsFilterFormGroup)) {
        this.reportService.getJavaGenericService().getData(AccountsConstant.TOMCAT_SERVER_URL).subscribe(data => {
          this.openPrintModal(data);
        });
        this.setCurrentPageToFirstPage();
        this.reloadStateOfJournals();
      } else {
        this.growlService.ErrorNotification(this.translate.instant(ReportingConstant.START_DATE_IS_AFTER_END_DATE));
      }
    } else {
      this.validationService.validateAllFormFields(this.stateOfJournalsFilterFormGroup);
    }
  }

  public setCurrentPageToFirstPage() {
    this.currentPage = NumberConstant.ZERO;
    this.gridSettings.state.skip = NumberConstant.ZERO;
  }

  openPrintModal(url) {
    const dataToSend = {
      accountingUrl: url.url,
      provisionalEdition: this.provisionalEdition,
      company: '',
      companyAdressInfo: '',
      companyCode: '',
      reportName: 'centralizingJournal',
      startDate: this.datePipe.transform(this.stateOfJournalsFilterFormGroup.value.startDate, SharedAccountingConstant.YYYY_MM_DD_HH_MM_SS),
      endDate: this.datePipe.transform(this.stateOfJournalsFilterFormGroup.value.endDate, SharedAccountingConstant.YYYY_MM_DD_HH_MM_SS),
      journalIds: this.getValuesJournalIds(this.stateOfJournalsFilterFormGroup),
      breakingAccount: this.breakingAccount,
      breakingCustomerAccount: this.breakingCustomerAccount,
      breakingSupplierAccount: this.breakingSupplierAccount
    };
    this.companyService.getCurrentCompany().subscribe(company => {
      this.genericAccountingService.setCompanyInfo(dataToSend, company);
    }, error => { }, () => {
      this.formModalDialogService.openDialog(null, ReportingInModalComponent, this.viewRef, null, dataToSend, null,
        SharedConstant.MODAL_DIALOG_SIZE_ML);
    });
  }

  changeProvisionalEdition() {
    this.provisionalEdition = !this.provisionalEdition;
  }

  reloadStateOfJournals() {
    this.spinner = true;
    this.show = true;
    const startDate = this.pageFilterService.getStartDateToUseInPageFilter(this.stateOfJournalsFilterFormGroup);
    const endDate = this.pageFilterService.getEndDateToUseInPageFilter(this.stateOfJournalsFilterFormGroup);
    const data = [];
    this.valuesIdJournal = this.getValuesIdJournal();
    this.getAccountValues(this.stateOfJournalsFilterFormGroup);
    this.reportingService.getJavaGenericService().sendData(
      `${ReportingConstant.CENTRALIZING_OF_JOURNALS}` +
      `?breakingAccount=${this.breakingAccount}&breakingCustomerAccount=${this.breakingCustomerAccount}` +
      `&breakingSupplierAccount=${this.breakingSupplierAccount}&endDate=${endDate}&page=${this.currentPage}` +
      `&size=${this.pageSize}&startDate=${startDate}`, this.valuesIdJournal)
      .subscribe((journalList: any) => {

        this.totalAmountDebit = journalList.totalDebitAmount.toFixed(NumberConstant.THREE);
        this.totalAmountCredit = journalList.totalCreditAmount.toFixed(NumberConstant.THREE);

        journalList.journalPage.content.forEach(journal => {

          data.push({
            'journalId': journal.id, 'codeJournal': journal.code, 'journal': journal.label,
            'debitJournal': journal.journalDebitAmount,
            'creditJournal': journal.journalCreditAmount,
            'startDate': startDate, 'endDate': endDate,
            'breakingAccount': this.breakingAccount,
            'breakingCustomerAccount': this.breakingCustomerAccount,
            'breakingSupplierAccount': this.breakingSupplierAccount
          });
        });

        this.stateOfJournalsView.next({
          data,
          total: journalList.journalPage.totalElements
        });
      }, () => { }, () => {
        this.spinner = false;
      });
  }

  onClickPrintExcel() {
    if (this.stateOfJournalsFilterFormGroup.valid) {
      if (this.pageFilterService.isTrueIfStartDateIsLowerThanEndDate(this.stateOfJournalsFilterFormGroup)) {
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
        let url = ReportingConstant.CENTRALIZING_OF_JOURNALS_SORTED_REPORT;
        this.companyService.getCurrentCompany().subscribe( company => {
          let srcPicture = this.companyService.getPicture(company.AttachmentUrl)
          const printPDF = () => {
            this.genericAccountingService.setCompanyInfos(dataToSend, company);
            const startDate = this.pageFilterService.getStartDateToUseInPageFilter(this.stateOfJournalsFilterFormGroup);
           const endDate = this.pageFilterService.getEndDateToUseInPageFilter(this.stateOfJournalsFilterFormGroup);

            const reportTemplateParams = new ReportTemplateDefaultParams(dataToSend.company,dataToSend.logoDataBase64, dataToSend.companyAdressInfo, this.provisionalEdition, dataToSend.generationDate,dataToSend.commercialRegister,dataToSend.matriculeFisc,dataToSend.mail,dataToSend.webSite,dataToSend.tel);
          this.reportingService.getJavaGenericService().saveEntity(reportTemplateParams, `${ReportingConstant.EXCEL_ENTITY_NAME}/`
          + `${url}` + `?journalIds=${this.valuesIdJournal}&breakingAccount=${this.breakingAccount}`
          + `&breakingCustomerAccount=${this.breakingCustomerAccount}&breakingSupplierAccount=${this.breakingSupplierAccount}`
          + `&endDate=${endDate}&startDate=${startDate}`)
            .subscribe(data => {
             this.spinner = false;
             this.genericAccountingService.downloadExcelFile(data, this.translate.instant(ReportingConstant.CENTRALISATION_OF_JOURNALS));
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
        this.setCurrentPageToFirstPage();
        this.reloadStateOfJournals();
      } else {
        this.growlService.ErrorNotification(this.translate.instant(ReportingConstant.START_DATE_IS_AFTER_END_DATE));
      }
    } else {
      this.validationService.validateAllFormFields(this.stateOfJournalsFilterFormGroup);
    }
  }
  public initCheckboxMultiSelectJournal() {
    this.dropdownSettings = {
      singleSelection: false,
      idField: AccountingConfigurationConstant.ID,
      textField: JournalConstants.LABEL_FIELD,
      selectAllText: this.translate.instant(ComponentsConstant.SELECT_ALL),
      unSelectAllText: this.translate.instant(ComponentsConstant.DESELECT_ALL),
      itemsShowLimit: this.limitSelection ? this.limitSelection : NumberConstant.THREE,
      allowSearchFilter: this.ShowFilter
    };
  }
  getValuesIdJournal() {
    if (this.journalListSelected.length === NumberConstant.ZERO) {
      return this.getValuesJournalIds(this.stateOfJournalsFilterFormGroup);
    } else {
      return this.journalListSelected.map(journal => journal.id);
    }
  }
}


