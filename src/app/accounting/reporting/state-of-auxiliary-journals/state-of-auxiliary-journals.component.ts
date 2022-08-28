import { Component, OnInit, HostListener, ViewChild, ViewContainerRef } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { FiscalYearConstant } from '../../../constant/accounting/fiscal-year.constant';
import { PageFilterService } from '../../services/page-filter-accounting.service';
import { GenericAccountingService } from '../../services/generic-accounting.service';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { NumberFormatOptions } from '@progress/kendo-angular-intl';
import { CompanyService } from '../../../administration/services/company/company.service';
import { Currency } from '../../../models/administration/currency.model';
import { BehaviorSubject } from 'rxjs';
import { GridDataResult, GridComponent, PagerSettings } from '@progress/kendo-angular-grid';
import { SharedAccountingConstant } from '../../../constant/accounting/sharedAccounting.constant';
import { BehaviorSubjectService } from '../../services/reporting/behavior-subject.service';
import { State } from '@progress/kendo-data-query';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { ValidationService } from '../../../shared/services/validation/validation.service';
import { ReportingService } from '../../services/reporting/reporting.service';
import { ReportingConstant } from '../../../constant/accounting/reporting.constant';
import { ActivatedRoute } from '@angular/router';
import { ReportingInModalComponent } from '../../../shared/components/reports/reporting-in-modal/reporting-in-modal.component';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { FormModalDialogService } from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { DatePipe } from '@angular/common';
import { AccountsConstant } from '../../../constant/accounting/account.constant';
import { AccountingConfigurationService } from '../../services/configuration/accounting-configuration.service';
import { FiscalYearService } from '../../services/fiscal-year/fiscal-year.service';
import { TranslateService } from '@ngx-translate/core';
import { AccountingConfigurationConstant } from '../../../constant/accounting/accounting-configuration.constant';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import {SpinnerService} from '../../../../COM/spinner/spinner.service';
import {ReportTemplateDefaultParameters} from '../../../models/accounting/report-template-default-parameters';
import {ComponentsConstant} from '../../../constant/shared/components.constant';
import {TiersConstants} from '../../../constant/purchase/tiers.constant';
import {JournalConstants} from '../../../constant/accounting/journal.constant';
import { ReducedCurrency } from '../../../models/administration/reduced-currency.model';
import { RoleConfigConstant } from '../../../Structure/_roleConfigConstant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { ReportTemplateDefaultParams } from '../../../models/accounting/report-template-default-params';

const StateOfAuxiliaryJournals = 'StateOfAuxiliaryJournals';


@Component({
  selector: 'app-state-of-auxiliary-journals',
  templateUrl: './state-of-auxiliary-journals.component.html',
  styleUrls: ['./state-of-auxiliary-journals.component.scss']
})
export class StateOfAuxiliaryJournalsComponent implements OnInit {

  public stateOfAuxiliaryJournalsFilterFormGroup: FormGroup;
  private pageSize = NumberConstant.TWENTY;
  public currentPage = NumberConstant.ZERO;
  public formatNumberOptions: NumberFormatOptions;
  public currencyCode: string;
  public stateOfJournalsView: BehaviorSubject<GridDataResult>;
  public valuesIdJournal = [];
  public totalDebit = 0;
  public totalCredit = 0;

  public journalList: any[] = this.activatedRoute.snapshot.data['journals'];
  public journalListFilter: any[];
  public journalListSelected = [];

  public isStateOfAuxiliaryJournalBeingLoaded = false;
  public isReportBeingPrinted = false;

  public formatDate = this.translate.instant(SharedConstant.DATE_FORMAT);

  public gridState: State = {
    skip: NumberConstant.ZERO,
    take: this.pageSize,
    filter: {
      logic: 'and',
      filters: []
    }
  };

  provisionalEdition = false;


  @ViewChild(GridComponent) grid: GridComponent;

  public gridSettings: GridSettings = {
    state: this.gridState
  };

  pagerSettings: PagerSettings = {
    buttonCount: NumberConstant.TWENTY, info: true, type: 'numeric', pageSizes: [NumberConstant.TEN,
    NumberConstant.TWENTY, NumberConstant.FIFTY, NumberConstant.ONE_HUNDRED], previousNext: true
  };
  public currentFiscalYear;

  public startDate = new Date(this.activatedRoute.snapshot.data['currentFiscalYear'].startDate);
  public endDate = new Date(this.activatedRoute.snapshot.data['currentFiscalYear'].endDate);
  /**
   * properties checkbox Multiselect
   */
  public limitSelection = NumberConstant.THREE;
  public ShowFilter = true;
  public dropdownSettings = {};
  public isMultiSelectTouched: boolean;
  public placeholder = '';
  public AccountingPermissions = PermissionConstant.AccountingPermissions;

  constructor(private reportingService: ReportingService, private behaviorSubjectForGridDataResultService: BehaviorSubjectService,
    private pageFilterService: PageFilterService, private genericAccountingService: GenericAccountingService,
    private companyService: CompanyService, private validationService: ValidationService,
    private activatedRoute: ActivatedRoute, private viewRef: ViewContainerRef, private accountingConfigurationService: AccountingConfigurationService,
    private formBuilder: FormBuilder, private reportService: ReportingService, public authService: AuthService,
    private formModalDialogService: FormModalDialogService, private datePipe: DatePipe, private translate: TranslateService,
    private growlService: GrowlService, private spinnerService : SpinnerService
  ) {
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

  handleJournalFilter(value: string): void {
    this.journalList = this.journalListFilter.filter((s) =>
      s.label.toLowerCase().includes(value.toLowerCase())
      || s.code.toString().includes(value.toLowerCase()));
  }

  public dataStateChange(state: State): void {
    this.gridSettings.state = state;
    this.currentPage = (state.skip) / (state.take);
    this.pageSize = state.take;
  }

  public onPageChange() {
    if (this.stateOfAuxiliaryJournalsFilterFormGroup.valid) {
      if (this.pageFilterService.isTrueIfStartDateIsLowerThanEndDate(this.stateOfAuxiliaryJournalsFilterFormGroup)) {
        this.reloadStateOfAuxiliaryJournal();
      } else {
        this.growlService.ErrorNotification(this.translate.instant(ReportingConstant.START_DATE_IS_AFTER_END_DATE));
      }
    } else {
      this.validationService.validateAllFormFields(this.stateOfAuxiliaryJournalsFilterFormGroup);
    }
  }

  public onSearch() {
    this.initStateOfAuxiliaryJournal();
  }

  public initStateOfAuxiliaryJournal() {
    if (this.stateOfAuxiliaryJournalsFilterFormGroup.valid) {
      if (this.pageFilterService.isTrueIfStartDateIsLowerThanEndDate(this.stateOfAuxiliaryJournalsFilterFormGroup)) {
        this.setCurrentPageToFirstPage();
        this.reloadStateOfAuxiliaryJournal();
      } else {
        this.growlService.ErrorNotification(this.translate.instant(ReportingConstant.START_DATE_IS_AFTER_END_DATE));
      }
    } else {
      this.validationService.validateAllFormFields(this.stateOfAuxiliaryJournalsFilterFormGroup);
    }
  }

  public setCurrentPageToFirstPage() {
    this.currentPage = NumberConstant.ZERO;
    this.gridSettings.state.skip = NumberConstant.ZERO;
  }

  getCompanyCurrency() {
    this.companyService.getDefaultCurrencyDetails().subscribe((currency: ReducedCurrency) => {
      this.setSelectedCurrency(currency);
      this.currencyCode = currency.Code;
    });
  }

  private setSelectedCurrency(currency: ReducedCurrency) {
    this.formatNumberOptions = {
      style: 'decimal',
      maximumFractionDigits: currency.Precision,
      minimumFractionDigits: currency.Precision
    };
  }

  onClickPrintByTelerik() {
    if (this.stateOfAuxiliaryJournalsFilterFormGroup.valid) {
      if (this.pageFilterService.isTrueIfStartDateIsLowerThanEndDate(this.stateOfAuxiliaryJournalsFilterFormGroup)) {
        this.reportService.getJavaGenericService().getData(AccountsConstant.TOMCAT_SERVER_URL).subscribe(data => {
          this.openPrintModal(data);
        });
        this.setCurrentPageToFirstPage();
        this.reloadStateOfAuxiliaryJournal();
      } else {
        this.growlService.ErrorNotification(this.translate.instant(ReportingConstant.START_DATE_IS_AFTER_END_DATE));
      }
    } else {
      this.validationService.validateAllFormFields(this.stateOfAuxiliaryJournalsFilterFormGroup);
    }
  }

  openPrintModal(url) {
    const dataToSend = {
      accountingUrl: url.url,
      provisionalEdition: this.provisionalEdition,
      company: '',
      companyAdressInfo: '',
      companyCode: '',
      reportName: StateOfAuxiliaryJournals,
      startDate: this.getStartDateToUseInPageFilter(this.stateOfAuxiliaryJournalsFilterFormGroup),
      endDate: this.getEndDateToUseInPageFilter(this.stateOfAuxiliaryJournalsFilterFormGroup),
      journalIds: this.getValuesJournalIds(this.stateOfAuxiliaryJournalsFilterFormGroup)
    };
    this.companyService.getCurrentCompany().subscribe(company => {
      this.genericAccountingService.setCompanyInfo(dataToSend, company);
    }, error => { }, () => {
      this.formModalDialogService.openDialog(null, ReportingInModalComponent, this.viewRef, null, dataToSend, null,
        SharedConstant.MODAL_DIALOG_SIZE_ML);
    });
  }

  getEndDateToUseInPageFilter(formGroup: any) {
    const date = new Date(formGroup.value.endDate);
    const endDateYear = date.getFullYear();
    const endDateMonth = date.getMonth();
    const endDateDay = date.getDate();
    return this.datePipe.transform(new Date(endDateYear, endDateMonth, endDateDay, NumberConstant.TWENTY_THREE,
      NumberConstant.FIFTY_NINE, NumberConstant.FIFTY_NINE), SharedAccountingConstant.YYYY_MM_DD_HH_MM_SS);
  }

  getStartDateToUseInPageFilter(formGroup: any) {
    const date = new Date(formGroup.value.startDate);
    const startDateYear = date.getFullYear();
    const startDateMonth = date.getMonth();
    const startDateDay = date.getDate();
    return this.datePipe.transform(new Date(startDateYear, startDateMonth, startDateDay, NumberConstant.ZERO,
      NumberConstant.ZERO, NumberConstant.ZERO), SharedAccountingConstant.YYYY_MM_DD_HH_MM_SS);
  }

  getValuesJournalIdsReport(formGroup: any) {
    const listeIdjournal = formGroup.value.valuesIdJournal;
    if (listeIdjournal === '' || listeIdjournal === undefined || listeIdjournal.length === 0) {
      return this.journalList.map(line => line.id);
    } else {
      return listeIdjournal;
    }
  }

  getValuesJournalIds(formGroup: any) {
    const listeIdjournal = formGroup.value.valuesIdJournal;
    if (listeIdjournal === '' || listeIdjournal === undefined || listeIdjournal.length === 0) {
      return this.journalList.map(line => line.id).toString();
    } else {
      return listeIdjournal.toString();
    }
  }

  changeProvisionalEdition() {
    this.provisionalEdition = !this.provisionalEdition;
  }

  initPageFilterFormGroup() {
    return this.formBuilder.group({
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      valuesIdJournal: []
    });
  }

  ngOnInit() {
    this.getCompanyCurrency();
    this.initCheckboxMultiSelectJournal();
    this.stateOfJournalsView = this.behaviorSubjectForGridDataResultService;
    this.stateOfAuxiliaryJournalsFilterFormGroup = this.initPageFilterFormGroup();
    if(this.authService.hasAuthority(this.AccountingPermissions.VIEW_JOURNALS_REPORTS)) {
      this.pageFilterService.initFormDatesThroughCurrentFiscalYear(this.stateOfAuxiliaryJournalsFilterFormGroup, this.reloadStateOfAuxiliaryJournal.bind(this),
      SharedAccountingConstant.START_DATE_ACCOUNTING, SharedAccountingConstant.END_DATE_ACCOUNTING, this.currentFiscalYear);
      this.journalListFilter = this.journalList;
    }
    }

  @HostListener('document:keydown.Enter', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.initStateOfAuxiliaryJournal();
  }

  public onClickPrintByJasper(): void {
    if (this.stateOfAuxiliaryJournalsFilterFormGroup.valid) {
      if (this.pageFilterService.isTrueIfStartDateIsLowerThanEndDate(this.stateOfAuxiliaryJournalsFilterFormGroup)) {
        this.isReportBeingPrinted = true;
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
        const startDate = this.pageFilterService.getStartDateToUseInPageFilter(this.stateOfAuxiliaryJournalsFilterFormGroup);
        const endDate = this.pageFilterService.getEndDateToUseInPageFilter(this.stateOfAuxiliaryJournalsFilterFormGroup);

        this.companyService.getCurrentCompany().subscribe( company => {
          let srcPicture = this.companyService.getPicture(company.AttachmentUrl)
          const printPDF = () => {
             this.genericAccountingService.setCompanyInfos(dataToSend, company);
             const reportTemplateParams = new ReportTemplateDefaultParams(dataToSend.company,dataToSend.logoDataBase64, dataToSend.companyAdressInfo, this.provisionalEdition, dataToSend.generationDate,dataToSend.commercialRegister,dataToSend.matriculeFisc,dataToSend.mail,dataToSend.webSite,dataToSend.tel);
             this.reportingService.getJavaGenericService().saveEntity(reportTemplateParams, `${ReportingConstant.JASPER_ENTITY_NAME}/${ReportingConstant.STATE_OF_AUXILIARY_REPORT_JOURNALS}` +
             `?&endDate=${endDate}&startDate=${startDate}&journalIds=${this.valuesIdJournal}`)
             .subscribe(data => {
              this.genericAccountingService.downloadPDFFile(data, this.translate.instant(ReportingConstant.AUXILIARY_JOURNALS));
            }, error => { this.isReportBeingPrinted = false; }, () => {
              this.isReportBeingPrinted = false;
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
        this.reloadStateOfAuxiliaryJournal();
      } else {
        this.growlService.ErrorNotification(this.translate.instant(ReportingConstant.START_DATE_IS_AFTER_END_DATE));
      }
    } else {
      this.validationService.validateAllFormFields(this.stateOfAuxiliaryJournalsFilterFormGroup);
    }
  }

  reloadStateOfAuxiliaryJournal() {
    this.isStateOfAuxiliaryJournalBeingLoaded = true;
    const startDate = this.pageFilterService.getStartDateToUseInPageFilter(this.stateOfAuxiliaryJournalsFilterFormGroup);
    const endDate = this.pageFilterService.getEndDateToUseInPageFilter(this.stateOfAuxiliaryJournalsFilterFormGroup);
    const dataGrid = [];
    this.valuesIdJournal = this.journalListSelected.map(journal => journal.id);
    this.reportingService.getJavaGenericService().sendData(
      `${ReportingConstant.STATE_OF_AUXILIARY_JOURNALS}` +
      `?page=${this.currentPage}&size=${this.pageSize}&startDate=${startDate}&endDate=${endDate}`, this.valuesIdJournal)
      .subscribe((stateOfAuxiliaryJournalPage: any) => {

        this.totalDebit = stateOfAuxiliaryJournalPage.totalDebitAmount;
        this.totalCredit = stateOfAuxiliaryJournalPage.totalCreditAmount;

        stateOfAuxiliaryJournalPage.content.forEach(x => {
          dataGrid.push({
            'journalId': x.id, 'codeJournal': x.code, 'labelJournal': x.label,
            'totalDebit': x.totalDebit, 'totalCredit': x.totalCredit,
            'startDate': startDate, 'endDate': endDate
          });
        });

        this.stateOfJournalsView.next({
          data: dataGrid,
          total: stateOfAuxiliaryJournalPage.totalElements
        });

      }, () => { }, () => {
        this.isStateOfAuxiliaryJournalBeingLoaded = false;
      });
  }
  onClickPrintExcel() {
    if (this.stateOfAuxiliaryJournalsFilterFormGroup.valid) {
      if (this.pageFilterService.isTrueIfStartDateIsLowerThanEndDate(this.stateOfAuxiliaryJournalsFilterFormGroup)) {
        this.isReportBeingPrinted = true;
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
        const startDate = this.pageFilterService.getStartDateToUseInPageFilter(this.stateOfAuxiliaryJournalsFilterFormGroup);
        const endDate = this.pageFilterService.getEndDateToUseInPageFilter(this.stateOfAuxiliaryJournalsFilterFormGroup);
        this.companyService.getCurrentCompany().subscribe( company => {
          let srcPicture = this.companyService.getPicture(company.AttachmentUrl)
          const printPDF = () => {
            this.genericAccountingService.setCompanyInfos(dataToSend, company);
            const reportTemplateParams = new ReportTemplateDefaultParams(dataToSend.company,dataToSend.logoDataBase64, dataToSend.companyAdressInfo, this.provisionalEdition, dataToSend.generationDate,dataToSend.commercialRegister,dataToSend.matriculeFisc,dataToSend.mail,dataToSend.webSite,dataToSend.tel);
          this.reportingService.getJavaGenericService().saveEntity(reportTemplateParams, ReportingConstant.EXCEL_ENTITY_NAME + '/' + `${ReportingConstant.STATE_OF_AUXILIARY_REPORT_JOURNALS}` +
          `?journalIds=${this.valuesIdJournal}&endDate=${endDate}&startDate=${startDate}`)
            .subscribe(data => {
             this.isReportBeingPrinted = false;
           this.genericAccountingService.downloadExcelFile(data, this.translate.instant(ReportingConstant.AUXILIARY_JOURNALS));
           }, () => {}, () => {
             this.isReportBeingPrinted = false;
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
        this.reloadStateOfAuxiliaryJournal();
      } else {
        this.growlService.ErrorNotification(this.translate.instant(ReportingConstant.START_DATE_IS_AFTER_END_DATE));
      }
    } else {
      this.validationService.validateAllFormFields(this.stateOfAuxiliaryJournalsFilterFormGroup);
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
}
