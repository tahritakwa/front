import { Component, HostListener, OnInit, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { sampleProducts } from '../../../inventory/services/item/products';
import { PagerSettings, RowClassArgs } from '@progress/kendo-angular-grid';
import { DataSourceRequestState, State } from '@progress/kendo-data-query';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { FiscalYearConstant } from '../../../constant/accounting/fiscal-year.constant';
import { ReportingConstant } from '../../../constant/accounting/reporting.constant';
import { FormGroup } from '@angular/forms';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { ReportingService } from '../../services/reporting/reporting.service';
import { PageFilterService } from '../../services/page-filter-accounting.service';
import { ValidationService } from '../../../shared/services/validation/validation.service';
import { Currency } from '../../../models/administration/currency.model';
import { CompanyService } from '../../../administration/services/company/company.service';
import { ActivatedRoute } from '@angular/router';
import { SharedAccountingConstant } from '../../../constant/accounting/sharedAccounting.constant';
import NumberFormatOptions = Intl.NumberFormatOptions;
import { GenericAccountingService } from '../../services/generic-accounting.service';
import { AccountingConfigurationService } from '../../services/configuration/accounting-configuration.service';
import { TranslateService } from '@ngx-translate/core';
import { AccountingConfigurationConstant } from '../../../constant/accounting/accounting-configuration.constant';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { ReportingInModalComponent } from '../../../shared/components/reports/reporting-in-modal/reporting-in-modal.component';
import { AccountsConstant } from '../../../constant/accounting/account.constant';
import { FormModalDialogService } from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { SpinnerService } from '../../../../COM/spinner/spinner.service';
import { ReportTemplateDefaultParameters } from '../../../models/accounting/report-template-default-parameters';
import { ReducedCurrency } from '../../../models/administration/reduced-currency.model';
import { RoleConfigConstant } from '../../../Structure/_roleConfigConstant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { ReportTemplateDefaultParams } from './../../../models/accounting/report-template-default-params';

const trial_balance = 'trialBalance';

@Component({
  selector: 'app-trial-balance',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './trial-balance.component.html',
  styleUrls: ['./trial-balance.component.scss'],
})
export class TrialBalanceComponent implements OnInit {

  public pageSize = SharedConstant.DEFAULT_ITEMS_NUMBER;
  public currentPage = NumberConstant.ZERO;


  public formatDate = this.translate.instant(SharedConstant.DATE_FORMAT);
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;

  public gridState: DataSourceRequestState = {
    skip: NumberConstant.ZERO,
    take: this.pageSize,
    filter: {
      logic: 'and',
      filters: []
    }
  };

  provisionalEdition = false;
  public columnsConfig: ColumnSettings[] = [
    {
      field: ReportingConstant.CODE,
      title: ReportingConstant.CODE_TITLE,
      tooltip: ReportingConstant.CODE_TITLE,
      filterable: true
    },
    {
      field: ReportingConstant.LABEL,
      title: ReportingConstant.LABEL_TITLE,
      tooltip: ReportingConstant.LABEL_TITLE,
      filterable: true,
    },
    {
      field: ReportingConstant.INITIAL_DEBIT,
      title: ReportingConstant.DEBIT,
      tooltip: ReportingConstant.DEBIT,
      filterable: false
    },
    {
      field: ReportingConstant.INITIAL_CREDIT,
      title: ReportingConstant.CREDIT,
      tooltip: ReportingConstant.CREDIT,
      filterable: true,
    },
    {
      field: ReportingConstant.CURRENT_DEBIT,
      title: ReportingConstant.DEBIT,
      tooltip: ReportingConstant.DEBIT,
      filterable: false
    },
    {
      field: ReportingConstant.CURRENT_CREDIT,
      title: ReportingConstant.CREDIT,
      tooltip: ReportingConstant.CREDIT,
      filterable: true,
    },
    {
      field: ReportingConstant.ACCUMULATED_DEBIT,
      title: ReportingConstant.DEBIT,
      tooltip: ReportingConstant.DEBIT,
      filterable: false
    },
    {
      field: ReportingConstant.ACCUMULATED_CREDIT,
      title: ReportingConstant.CREDIT,
      tooltip: ReportingConstant.CREDIT,
      filterable: true,
    },
    {
      field: ReportingConstant.BALANCE_DEBIT,
      title: ReportingConstant.DEBIT,
      tooltip: ReportingConstant.DEBIT,
      filterable: false
    },
    {
      field: ReportingConstant.BALANCE_CREDIT,
      title: ReportingConstant.CREDIT,
      tooltip: ReportingConstant.CREDIT,
      filterable: true,
    }
  ];
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig
  };
  public gridData: any[] = sampleProducts;

  public trialBalanceDebitInitialTotal: number;
  public trialBalanceCreditInitialTotal: number;
  public trialBalanceDebitCurrentTotal: number;
  public trialBalanceCreditCurrentTotal: number;
  public trialBalanceAccumulatedDebit: number;
  public trialBalanceAccumulatedCredit: number;
  public trialBalanceDebit: number;
  public trialBalanceCredit: number;

  public trialBalanceFilterFormGroup: FormGroup;
  public formatNumberOptions: NumberFormatOptions;
  public startDate;
  public endDate;
  public currentFiscalYear;
  public currencyCode: string;
  public spinner = false;
  public AccountingPermissions = PermissionConstant.AccountingPermissions;

  constructor(private reportingService: ReportingService,
    private viewRef: ViewContainerRef,
    private pageFilterService: PageFilterService, private validationService: ValidationService,
    private translate: TranslateService, private growlService: GrowlService, public authService: AuthService,
    private companyService: CompanyService, private route: ActivatedRoute, private genericAccountingService: GenericAccountingService,
    private accountingConfigurationService: AccountingConfigurationService, private reportService: ReportingService,
    private formModalDialogService: FormModalDialogService, private spinnerService: SpinnerService) {
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

  public rowClassCallback = (context: RowClassArgs) => {
    return { highlighted: context.dataItem.accountDto.label.trim() === 'Total Classe' };
  }

  reloadTrialBalance() {
    const startDate = this.pageFilterService.getStartDateToUseInPageFilter(this.trialBalanceFilterFormGroup);
    const endDate = this.pageFilterService.getEndDateToUseInPageFilter(this.trialBalanceFilterFormGroup);
    this.reportingService.getJavaGenericService().getEntityList(
      `${ReportingConstant.GET_TRIAL_BALANCE}` +
      `?page=${this.currentPage}&size=${this.pageSize}&startDate=${startDate}&endDate=${endDate}` +
      `&beginAccountCode=${this.trialBalanceFilterFormGroup.value.beginAccountCode}` +
      `&endAccountCode=${this.trialBalanceFilterFormGroup.value.endAccountCode}`)
      .subscribe(trialBalanceAccounts => {
        this.calculateTrialBalanceTotal(trialBalanceAccounts.content[trialBalanceAccounts.content.length - 1]);
        trialBalanceAccounts.content.splice(trialBalanceAccounts.content.length - 1, 1);
        this.gridSettings.gridData = { data: trialBalanceAccounts.content, total: trialBalanceAccounts.totalElements };
      });
  }

  private calculateTrialBalanceTotal(totalElement: any) {
    this.trialBalanceAccumulatedDebit = totalElement.accumulatedDebit;
    this.trialBalanceAccumulatedCredit = totalElement.accumulatedCredit;
    this.trialBalanceDebitInitialTotal = totalElement.totalInitialDebit;
    this.trialBalanceCreditInitialTotal = totalElement.totalInitialCredit;
    this.trialBalanceDebitCurrentTotal = totalElement.totalCurrentDebit;
    this.trialBalanceCreditCurrentTotal = totalElement.totalCurrentCredit;
    this.trialBalanceDebit = totalElement.balanceDebit;
    this.trialBalanceCredit = totalElement.balanceCredit;
  }

  public dataStateChange(state: State): void {
    this.gridSettings.state = state;
    this.currentPage = (state.skip) / (state.take);
    this.pageSize = state.take;
  }

  public setCurrentPageToFirstPage() {
    this.currentPage = NumberConstant.ZERO;
    this.gridSettings.state.skip = NumberConstant.ZERO;
  }

  public onPageChange() {
    if (this.trialBalanceFilterFormGroup.valid) {
      if (this.pageFilterService.isTrueIfBeginAccountCodeIsLowerThanEndAccountCode(this.trialBalanceFilterFormGroup)) {
        if (this.pageFilterService.isTrueIfStartDateIsLowerThanEndDate(this.trialBalanceFilterFormGroup)) {
          this.reloadTrialBalance();
        } else {
          this.growlService.ErrorNotification(this.translate.instant(ReportingConstant.START_DATE_IS_AFTER_END_DATE));
        }
      } else {
        this.growlService.ErrorNotification(this.translate.instant(ReportingConstant.BEGIN_ACCOUNT_CODE_IS_GREATER_THAN_END_ACCOUNT));
      }
    } else {
      this.validationService.validateAllFormFields(this.trialBalanceFilterFormGroup);
    }
  }

  public onSearch() {
    this.initTrialBalance();
  }

  public initTrialBalance() {
    if (this.trialBalanceFilterFormGroup.valid) {
      if (this.pageFilterService.isTrueIfBeginAccountCodeIsLowerThanEndAccountCode(this.trialBalanceFilterFormGroup)) {
        if (this.pageFilterService.isTrueIfStartDateIsLowerThanEndDate(this.trialBalanceFilterFormGroup)) {
          this.setCurrentPageToFirstPage();
          this.reloadTrialBalance();
        } else {
          this.growlService.ErrorNotification(this.translate.instant(ReportingConstant.START_DATE_IS_AFTER_END_DATE));
        }
      } else {
        this.growlService.ErrorNotification(this.translate.instant(ReportingConstant.BEGIN_ACCOUNT_CODE_IS_GREATER_THAN_END_ACCOUNT));
      }
    } else {
      this.validationService.validateAllFormFields(this.trialBalanceFilterFormGroup);
    }
  }

  private setSelectedCurrency(currency: ReducedCurrency) {
    this.formatNumberOptions = {
      style: 'decimal',
      maximumFractionDigits: currency.Precision,
      minimumFractionDigits: currency.Precision
    };
  }

  getCurrentCompany() {
    this.companyService.getDefaultCurrencyDetails().subscribe((currency: ReducedCurrency) => {
      this.setSelectedCurrency(currency);
      this.currencyCode = currency.Code;
    });
  }

  public ngOnInit(): void {
    this.getCurrentCompany();
    this.trialBalanceFilterFormGroup = this.pageFilterService.initPageFilterFormGroup();
    this.pageFilterService.initFormDatesThroughCurrentFiscalYear(this.trialBalanceFilterFormGroup, this.reloadTrialBalance.bind(this),
      SharedAccountingConstant.START_DATE_ACCOUNTING, SharedAccountingConstant.END_DATE_ACCOUNTING, this.currentFiscalYear);
  }

  @HostListener('document:keydown.Enter', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.trialBalanceFilterFormGroup.untouched) {
      this.initTrialBalance();
    }
    else {
      this.trialBalanceFilterFormGroup.markAsUntouched();
    }
  }

  changeProvisionalEdition() {
    this.provisionalEdition = !this.provisionalEdition;
  }


  public onClickPrintByJasper(): void {
    if (this.trialBalanceFilterFormGroup.valid) {
      if (this.pageFilterService.isTrueIfBeginAccountCodeIsLowerThanEndAccountCode(this.trialBalanceFilterFormGroup)) {
        if (this.pageFilterService.isTrueIfStartDateIsLowerThanEndDate(this.trialBalanceFilterFormGroup)) {
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
          const startDate = this.pageFilterService.getStartDateToUseInPageFilter(this.trialBalanceFilterFormGroup);
          const endDate = this.pageFilterService.getEndDateToUseInPageFilter(this.trialBalanceFilterFormGroup);
          this.companyService.getCurrentCompany().subscribe( company => {
            let srcPicture = this.companyService.getPicture(company.AttachmentUrl)
     const printPDF = () => {
        this.genericAccountingService.setCompanyInfos(dataToSend, company);
        const reportTemplateParams = new ReportTemplateDefaultParams(dataToSend.company,dataToSend.logoDataBase64, dataToSend.companyAdressInfo, this.provisionalEdition, dataToSend.generationDate,dataToSend.commercialRegister,dataToSend.matriculeFisc,dataToSend.mail,dataToSend.webSite,dataToSend.tel);
        this.reportingService.getJavaGenericService().saveEntity(reportTemplateParams, ReportingConstant.JASPER_ENTITY_NAME + '/' + `${ReportingConstant.BALANCE_JASPER_REPORT}` +
        `?beginAccountCode=${this.trialBalanceFilterFormGroup.value.beginAccountCode}` +
        `&endAccountCode=${this.trialBalanceFilterFormGroup.value.endAccountCode}&endDate=${endDate}&startDate=${startDate}`)
        .subscribe(data => {
          this.genericAccountingService.downloadPDFFile(data, this.translate.instant(ReportingConstant.TRIAL_BALANCE_TITLE));
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
          this.reloadTrialBalance();
        } else {
          this.growlService.ErrorNotification(this.translate.instant(ReportingConstant.START_DATE_IS_AFTER_END_DATE));
        }
      } else {
        this.growlService.ErrorNotification(this.translate.instant(ReportingConstant.BEGIN_ACCOUNT_CODE_IS_GREATER_THAN_END_ACCOUNT));
      }
    } else {
      this.validationService.validateAllFormFields(this.trialBalanceFilterFormGroup);
    }
  }

  onClickPrintByTelerik() {
    if (this.trialBalanceFilterFormGroup.valid) {
      if (this.pageFilterService.isTrueIfBeginAccountCodeIsLowerThanEndAccountCode(this.trialBalanceFilterFormGroup)) {
        if (this.pageFilterService.isTrueIfStartDateIsLowerThanEndDate(this.trialBalanceFilterFormGroup)) {
          this.reportService.getJavaGenericService().getData(AccountsConstant.TOMCAT_SERVER_URL).subscribe(data => {
            const url = data;
            const dataToSend = this.pageFilterService.initDataToSendToTelerikReport(trial_balance, url, this.trialBalanceFilterFormGroup, this.provisionalEdition);
            this.companyService.getCurrentCompany().subscribe((company) => {
              this.genericAccountingService.setCompanyInfo(dataToSend, company);
            }, error => { }, () => {
              this.formModalDialogService.openDialog(null, ReportingInModalComponent, this.viewRef, null, dataToSend, null,
                SharedConstant.MODAL_DIALOG_SIZE_ML);
            });
          });
          this.setCurrentPageToFirstPage();
          this.reloadTrialBalance();
        } else {
          this.growlService.ErrorNotification(this.translate.instant(ReportingConstant.START_DATE_IS_AFTER_END_DATE));
        }
      } else {
        this.growlService.ErrorNotification(this.translate.instant(ReportingConstant.BEGIN_ACCOUNT_CODE_IS_GREATER_THAN_END_ACCOUNT));
      }
    } else {
      this.validationService.validateAllFormFields(this.trialBalanceFilterFormGroup);
    }
  }


  onClickPrintExcel() {
    if (this.trialBalanceFilterFormGroup.valid) {
      if (this.pageFilterService.isTrueIfBeginAccountCodeIsLowerThanEndAccountCode(this.trialBalanceFilterFormGroup)) {
        if (this.pageFilterService.isTrueIfStartDateIsLowerThanEndDate(this.trialBalanceFilterFormGroup)) {
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
          const startDate = this.pageFilterService.getStartDateToUseInPageFilter(this.trialBalanceFilterFormGroup);
          const endDate = this.pageFilterService.getEndDateToUseInPageFilter(this.trialBalanceFilterFormGroup);

          this.companyService.getCurrentCompany().subscribe( company => {
            let srcPicture = this.companyService.getPicture(company.AttachmentUrl)
            const printPDF = () => {
              this.genericAccountingService.setCompanyInfos(dataToSend, company);
              const reportTemplateParams = new ReportTemplateDefaultParams(dataToSend.company,dataToSend.logoDataBase64, dataToSend.companyAdressInfo, this.provisionalEdition, dataToSend.generationDate,dataToSend.commercialRegister,dataToSend.matriculeFisc,dataToSend.mail,dataToSend.webSite,dataToSend.tel);
            this.reportingService.getJavaGenericService().saveEntity(reportTemplateParams, ReportingConstant.EXCEL_ENTITY_NAME + '/' + `${ReportingConstant.GET_TRIAL_BALANCE}` +
            `?beginAccountCode=${this.trialBalanceFilterFormGroup.value.beginAccountCode}` +
            `&endAccountCode=${this.trialBalanceFilterFormGroup.value.endAccountCode}&endDate=${endDate}&startDate=${startDate}`)
              .subscribe(data => {
               this.genericAccountingService.downloadExcelFile(data, this.translate.instant(ReportingConstant.TRIAL_BALANCE_TITLE));
             }, () => { }, () => {
                this.spinner = false;
              });
                   }
                   if (srcPicture == ""){
                     dataToSend.logoDataBase64= "";
                     printPDF();
                   }
                   else{ srcPicture.subscribe((res:any)=> {
                   if(res){
                    dataToSend.logoDataBase64= res;}},
                    () => {dataToSend.logoDataBase64= "";},
                    () => printPDF());
                 }
         });
          this.setCurrentPageToFirstPage();
          this.reloadTrialBalance();
        } else {
          this.growlService.ErrorNotification(this.translate.instant(ReportingConstant.START_DATE_IS_AFTER_END_DATE));
        }
      } else {
        this.growlService.ErrorNotification(this.translate.instant(ReportingConstant.BEGIN_ACCOUNT_CODE_IS_GREATER_THAN_END_ACCOUNT));
      }
    } else {
      this.validationService.validateAllFormFields(this.trialBalanceFilterFormGroup);
    }
  }
}

