import { Component, HostListener, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DataStateChangeEvent, GridComponent, GridDataResult, PageChangeEvent, PagerSettings } from '@progress/kendo-angular-grid';
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
import { ActivatedRoute } from '@angular/router';
import { FiscalYearService } from '../../services/fiscal-year/fiscal-year.service';
import { AccountingConfigurationConstant } from '../../../constant/accounting/accounting-configuration.constant';
import { TranslateService } from '@ngx-translate/core';
import { ValidationService } from '../../../shared/services/validation/validation.service';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import {ReportTemplateDefaultParameters} from '../../../models/accounting/report-template-default-parameters';
import {SpinnerService} from '../../../../COM/spinner/spinner.service';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { ReducedCurrency } from '../../../models/administration/reduced-currency.model';
import { RoleConfigConstant } from '../../../Structure/_roleConfigConstant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { ReportTemplateDefaultParams } from '../../../models/accounting/report-template-default-params';

@Component({
  selector: 'app-state-of-journals',
  templateUrl: './state-of-journals.component.html',
  styleUrls: ['./state-of-journals.component.scss']
})
export class StateOfJournalsComponent implements OnInit {
  public stateOfJournalsView: BehaviorSubject<GridDataResult>;
  public readonly STATE_OF_JOURNALS = 'stateOfJournals';
  private pageSize = SharedConstant.DEFAULT_ITEMS_NUMBER;
  public currentPage = NumberConstant.ZERO;
  public totalAmount: number;
  public stateOfJournalsFilterFormGroup: FormGroup;
  public formatNumberOptions: NumberFormatOptions;
  public currencyCode: string;
  public currentFiscalYear;
  public spinner = false;

  public journalList: any;

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

  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public startDate: Date;
  public endDate: Date;
  public AccountingPermissions = PermissionConstant.AccountingPermissions;

  public formatDate = this.translate.instant(SharedConstant.DATE_FORMAT);

  constructor(private behaviorSubjectForGridDataResultService: BehaviorSubjectService, private reportingService: ReportingService,
    private accountingConfigurationService: AccountingConfigurationService, private route: ActivatedRoute,
    private pageFilterService: PageFilterService, private genericAccountingService: GenericAccountingService,
    private formBuilder: FormBuilder, private companyService: CompanyService, private translate: TranslateService,
    private validationService: ValidationService, private growlService: GrowlService, private spinnerService: SpinnerService,
    public authService: AuthService) {
    if (this.route.snapshot.data['currentFiscalYear']) {
      this.currentFiscalYear = this.route.snapshot.data['currentFiscalYear'];
      this.startDate = new Date(this.currentFiscalYear.startDate);
      this.endDate = new Date(this.currentFiscalYear.endDate);
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

  public onSearch() {
    this.initStateOfJournals();
  }

  initJournalList() {
    this.genericAccountingService.getJournalList().then((data: any) => {
      this.journalList = data;
    });
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

  public setCurrentPageToFirstPage() {
    this.currentPage = NumberConstant.ZERO;
    this.gridSettings.state.skip = NumberConstant.ZERO;
  }

  reloadStateOfJournals() {
    const startDate = this.pageFilterService.getStartDateToUseInPageFilter(this.stateOfJournalsFilterFormGroup);
    const endDate = this.pageFilterService.getEndDateToUseInPageFilter(this.stateOfJournalsFilterFormGroup);
    const data = [];
    this.reportingService.getJavaGenericService().getEntityList(
      `${ReportingConstant.STATE_OF_JOURNALS}` +
      `?page=${this.currentPage}&size=${this.pageSize}&startDate=${startDate}&endDate=${endDate}`)
      .subscribe((journalList: any) => {
        this.totalAmount = journalList.content[journalList.numberOfElements - 1].totalAmount;
        journalList.content.splice(journalList.numberOfElements - 1, 1);
        journalList.content.forEach(x => {
          data.push({
            'journalId': x.journalId,
            'codeJournal': x.journalCode,
            'journal': x.journalLabel,
            'totalAmount': x.totalAmount,
            'startDate': startDate, 'endDate': endDate
          });
        });
        let totalElements = journalList.totalElements;
        if ((journalList.numberOfElements - 1) % this.pageSize !== 0 || totalElements === 1) {
          totalElements -= 1;
        }
        this.stateOfJournalsView.next({
          data,
          total: totalElements
        });
      });
  }

  initPageFilterFormGroupStateOfJournal() {
    return this.formBuilder.group({
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]]
    });
  }

  public onClickPrintByJasper(): void {
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
               const reportTemplateParams = new ReportTemplateDefaultParams(dataToSend.company,dataToSend.logoDataBase64, dataToSend.companyAdressInfo, this.provisionalEdition, dataToSend.generationDate,dataToSend.commercialRegister,dataToSend.matriculeFisc,dataToSend.mail,dataToSend.webSite,dataToSend.tel);
               const startDate = this.pageFilterService.getStartDateToUseInPageFilter(this.stateOfJournalsFilterFormGroup);
               const endDate = this.pageFilterService.getEndDateToUseInPageFilter(this.stateOfJournalsFilterFormGroup);
               this.reportingService.getJavaGenericService().saveEntity(reportTemplateParams, ReportingConstant.JASPER_ENTITY_NAME
                + '/' + ReportingConstant.STATE_OF_JOURNAL_REPORT +
                `?startDate=${startDate}&endDate=${endDate}`)
               .subscribe(data => {
                this.genericAccountingService.downloadPDFFile(data, this.translate.instant(ReportingConstant.STATE_OF_JOURNALS_TITLE));
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

  changeProvisionalEdition() {
    this.provisionalEdition = !this.provisionalEdition;
  }

  private setSelectedCurrency(currency: ReducedCurrency) {
    this.formatNumberOptions = {
      style: 'decimal',
      maximumFractionDigits: currency.Precision,
      minimumFractionDigits: currency.Precision
    };
  }

  public ngOnInit(): void {
    this.companyService.getDefaultCurrencyDetails().subscribe((currency: ReducedCurrency) => {
      this.setSelectedCurrency(currency);
      this.currencyCode = currency.Code;
    });
    this.stateOfJournalsView = this.behaviorSubjectForGridDataResultService;
    this.initJournalList();
    this.stateOfJournalsFilterFormGroup = this.pageFilterService.initPageFilterFormGroup();
    if(this.authService.hasAuthority(this.AccountingPermissions.VIEW_JOURNALS_REPORTS)) {
      this.pageFilterService.initFormDatesThroughCurrentFiscalYear(this.stateOfJournalsFilterFormGroup, this.reloadStateOfJournals.bind(this),
        SharedAccountingConstant.START_DATE_ACCOUNTING, SharedAccountingConstant.END_DATE_ACCOUNTING, this.currentFiscalYear);
    }
  }

  @HostListener('document:keydown.Enter', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.initStateOfJournals();
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
        this.companyService.getCurrentCompany().subscribe( company => {
          let srcPicture = this.companyService.getPicture(company.AttachmentUrl)
          const printPDF = () => {
            this.genericAccountingService.setCompanyInfos(dataToSend, company);
            const reportTemplateParams = new ReportTemplateDefaultParams(dataToSend.company,dataToSend.logoDataBase64, dataToSend.companyAdressInfo, this.provisionalEdition, dataToSend.generationDate,dataToSend.commercialRegister,dataToSend.matriculeFisc,dataToSend.mail,dataToSend.webSite,dataToSend.tel);
            const startDate = this.pageFilterService.getStartDateToUseInPageFilter(this.stateOfJournalsFilterFormGroup);
           const endDate = this.pageFilterService.getEndDateToUseInPageFilter(this.stateOfJournalsFilterFormGroup);

            this.reportingService.getJavaGenericService().saveEntity(reportTemplateParams, ReportingConstant.EXCEL_ENTITY_NAME
             + '/' + ReportingConstant.STATE_OF_JOURNALS +
             `?startDate=${startDate}&endDate=${endDate}`
           )
            .subscribe(data => {
             this.spinner = false;
            this.genericAccountingService.downloadExcelFile(data, this.translate.instant(ReportingConstant.STATE_OF_JOURNALS_TITLE));
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
}
