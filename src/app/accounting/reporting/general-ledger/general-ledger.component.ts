import { Component, HostListener, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { GridComponent, GridDataResult, PageChangeEvent, PagerSettings } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { ReportingConstant } from '../../../constant/accounting/reporting.constant';
import { FiscalYearConstant } from '../../../constant/accounting/fiscal-year.constant';
import { FormGroup } from '@angular/forms';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { TranslateService } from '@ngx-translate/core';
import { ReportingService } from '../../services/reporting/reporting.service';
import { BehaviorSubjectService } from '../../services/reporting/behavior-subject.service';
import { PageFilterService } from '../../services/page-filter-accounting.service';
import { SharedAccountingConstant } from '../../../constant/accounting/sharedAccounting.constant';
import { ValidationService } from '../../../shared/services/validation/validation.service';
import { Currency } from '../../../models/administration/currency.model';
import { CompanyService } from '../../../administration/services/company/company.service';
import { ActivatedRoute } from '@angular/router';
import NumberFormatOptions = Intl.NumberFormatOptions;
import { GenericAccountingService } from '../../services/generic-accounting.service';
import { AccountingConfigurationConstant } from '../../../constant/accounting/accounting-configuration.constant';
import { AccountingConfigurationService } from '../../services/configuration/accounting-configuration.service';
import { FiscalYearService } from '../../services/fiscal-year/fiscal-year.service';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { FormModalDialogService } from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { AccountsConstant } from '../../../constant/accounting/account.constant';
import { ReportingInModalComponent } from '../../../shared/components/reports/reporting-in-modal/reporting-in-modal.component';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { SpinnerService } from '../../../../COM/spinner/spinner.service';
import { ReportTemplateDefaultParameters } from '../../../models/accounting/report-template-default-parameters';
import {LetteringConstant} from '../../../constant/accounting/lettering.constant';
import { ReducedCurrency } from '../../../models/administration/reduced-currency.model';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { ReportTemplateDefaultParams } from '../../../models/accounting/report-template-default-params';

const general_ledger = 'generalLedger';

@Component({
  selector: 'app-general-ledger',
  templateUrl: './general-ledger.component.html',
})
export class GeneralLedgerComponent implements OnInit {

  public searchOnDetailsIsEnabled = true;
  public generalLedgerView: BehaviorSubject<GridDataResult>;

  public pageSize = NumberConstant.ONE;
  public currentPage = NumberConstant.ZERO;
  public currencyCode: string;
  public accountTypeListFilter: any[];
  spinner = false;
  public sortParams = null;
  public field = '';
  public direction = '';
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS_BEGIN_WITH_ONE;



  public formatDate = this.translate.instant(SharedConstant.DATE_FORMAT);

  provisionalEdition = false;
  public gridState: State = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.ONE,
    filter: {
      logic: 'and',
      filters: []
    }
  };

  public totalDebit: number;
  public totalCredit: number;
  public totalBalance: number;

  public generalLedgerFilterFormGroup: FormGroup;

  public gridSettings: GridSettings = {
    state: this.gridState,
  };
  public accountTypeList = [{
    value: SharedAccountingConstant.ALL,
    text: this.translate.instant(SharedAccountingConstant.ALL),
    disable: true
  },
  { value: SharedAccountingConstant.IS_LITERABLE, text: this.translate.instant(SharedAccountingConstant.IS_LITERABLE), disable: true },
  {
    value: SharedAccountingConstant.IS_NOT_LITERABLE,
    text: this.translate.instant(SharedAccountingConstant.IS_NOT_LITERABLE),
    disable: true
  }];

  public letteringOperationTypeData = [{
    text: this.translate.instant(SharedAccountingConstant.ALL),
    value: SharedAccountingConstant.ALL
  }, {
    text: this.translate.instant(LetteringConstant.LETTER),
    value: LetteringConstant.LETTER
  }, {
    text: this.translate.instant(LetteringConstant.NOT_LITERATE),
    value: LetteringConstant.NOT_LITERATE
  }];
  public letteringOperationTypeDataFilter: any[];

  @ViewChild(GridComponent) grid: GridComponent;
  public formatNumberOptions: NumberFormatOptions;
  public startDate: Date;
  public endDate: Date;
  public currentFiscalYear;
  public AccountingPermissions = PermissionConstant.AccountingPermissions;

  constructor(private reportingService: ReportingService, private growlService: GrowlService,
    private viewRef: ViewContainerRef, private translate: TranslateService, public authService: AuthService,
    private behaviorSubjectForGridDataResultService: BehaviorSubjectService, private pageFilterService: PageFilterService,
    private validationService: ValidationService, private companyService: CompanyService, private route: ActivatedRoute,
    private genericAccountingService: GenericAccountingService, private accountingConfigurationService: AccountingConfigurationService,
    private reportService: ReportingService, private formModalDialogService: FormModalDialogService, private spinnerService: SpinnerService
  ) {
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

  public itemDisabled(itemArgs: { dataItem: any, index: number }) {
    return !itemArgs.dataItem.disable;
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
    this.searchOnDetailsIsEnabled = false;
    if (this.generalLedgerFilterFormGroup.valid) {
      if (this.pageFilterService.isTrueIfBeginAccountCodeIsLowerThanEndAccountCode(this.generalLedgerFilterFormGroup)) {
        if (this.pageFilterService.isTrueIfStartDateIsLowerThanEndDate(this.generalLedgerFilterFormGroup)) {
          this.searchOnDetailsIsEnabled = true;
          this.reloadGeneralLedger();
        } else {
          this.growlService.ErrorNotification(this.translate.instant(ReportingConstant.START_DATE_IS_AFTER_END_DATE));
        }
      } else {
        this.growlService.ErrorNotification(this.translate.instant(ReportingConstant.BEGIN_ACCOUNT_CODE_IS_GREATER_THAN_END_ACCOUNT));
      }
    } else {
      this.validationService.validateAllFormFields(this.generalLedgerFilterFormGroup);
    }
  }

  reloadGeneralLedger() {
    const startDate = this.pageFilterService.getStartDateToUseInPageFilter(this.generalLedgerFilterFormGroup);
    const endDate = this.pageFilterService.getEndDateToUseInPageFilter(this.generalLedgerFilterFormGroup);
    const dataGrid = [];
    let beginAmount = this.generalLedgerFilterFormGroup.value.beginAmount;
    let endAmount = this.generalLedgerFilterFormGroup.value.endAmount;
    if (this.genericAccountingService.isNullAndUndefinedAndEmpty(this.generalLedgerFilterFormGroup.value.amount )) {
      if (this.generalLedgerFilterFormGroup.value.beginAmount === null) {
        this.generalLedgerFilterFormGroup.controls['beginAmount'].setValue('');
        beginAmount = this.generalLedgerFilterFormGroup.value.beginAmount;
      }
      if (this.generalLedgerFilterFormGroup.value.endAmount === null) {
        this.generalLedgerFilterFormGroup.controls['endAmount'].setValue('');
        endAmount = this.generalLedgerFilterFormGroup.value.endAmount;
      }
    } else {
      beginAmount = this.generalLedgerFilterFormGroup.value.amount;
      endAmount = this.generalLedgerFilterFormGroup.value.amount;
    }
    this.reportingService.getJavaGenericService().getEntityList(
      `${ReportingConstant.GENERAL_LEDGER}` +
      `?page=${this.currentPage}&size=${this.pageSize}&startDate=${startDate}&endDate=${endDate}` +
      `&beginAccountCode=${this.generalLedgerFilterFormGroup.value.beginAccountCode}` +
      `&endAccountCode=${this.generalLedgerFilterFormGroup.value.endAccountCode}` +
      `&beginAmount=${beginAmount}` +
      `&endAmount=${endAmount}` +
      `&accountType=${this.generalLedgerFilterFormGroup.value.accountType.value}` +
      `&letteringOperationType=${this.generalLedgerFilterFormGroup.value.letteringOperationType.value}`
    )
      .subscribe((accountList: any) => {
        this.calculateGeneralLedgerTotal(accountList.content[accountList.content.length - 1]);
        accountList.content.splice(accountList.content.length - 1, 1);
        accountList.content.forEach(x => {
          dataGrid.push({
            'accountId': x.accountId, 'account': `${x.accountCode} ${x.accountName}`,
            'debit': x.totalDebit, 'credit': x.totalCredit, 'balance': x.totalBalance,
            'startDate': startDate, 'endDate': endDate, 'literable': x.literable
          });
        });
        this.generalLedgerView.next({
          data: dataGrid,
          total: accountList.totalElements
        });

        /*Expand all account details*/
        for (let i = 0; i < accountList.totalElements; i++) {
          this.grid.expandRow(i);
        }

      });
  }

  public onClickPrintByTelerik(): void {
    this.searchOnDetailsIsEnabled = false;
    if (this.generalLedgerFilterFormGroup.valid) {
      if (this.pageFilterService.isTrueIfBeginAccountCodeIsLowerThanEndAccountCode(this.generalLedgerFilterFormGroup)) {
        if (this.pageFilterService.isTrueIfStartDateIsLowerThanEndDate(this.generalLedgerFilterFormGroup)) {
          this.reportService.getJavaGenericService().getData(AccountsConstant.TOMCAT_SERVER_URL).subscribe(data => {
            const url = data;
            const dataToSend = this.initDataToSendToTelerikReport(url);
            this.companyService.getCurrentCompany().subscribe((company) => {
              this.genericAccountingService.setCompanyInfo(dataToSend, company);
            }, error => { }, () => {
              this.formModalDialogService.openDialog(null, ReportingInModalComponent, this.viewRef, null, dataToSend,
                null, SharedConstant.MODAL_DIALOG_SIZE_ML);
            });
          });
          this.searchOnDetailsIsEnabled = true;
          this.setCurrentPageToFirstPage();
          this.reloadGeneralLedger();
        } else {
          this.growlService.ErrorNotification(this.translate.instant(ReportingConstant.START_DATE_IS_AFTER_END_DATE));
        }
      } else {
        this.growlService.ErrorNotification(this.translate.instant(ReportingConstant.BEGIN_ACCOUNT_CODE_IS_GREATER_THAN_END_ACCOUNT));
      }
    } else {
      this.validationService.validateAllFormFields(this.generalLedgerFilterFormGroup);
    }
  }

  initDataToSendToTelerikReport(url: any) {
    return {
      'accountingUrl': url.url,
      'reportName': general_ledger,
      'provisionalEdition': this.provisionalEdition,
      'startDate': this.pageFilterService.getStartDateToUseInPageFilter(this.generalLedgerFilterFormGroup),
      'endDate': this.pageFilterService.getEndDateToUseInPageFilter(this.generalLedgerFilterFormGroup),
      'beginAccountCode': this.generalLedgerFilterFormGroup.value.beginAccountCode,
      'endAccountCode': this.generalLedgerFilterFormGroup.value.endAccountCode,
      'beginAmount': this.generalLedgerFilterFormGroup.value.beginAmount,
      'endAmount': this.generalLedgerFilterFormGroup.value.endAmount,
      'accountType': this.generalLedgerFilterFormGroup.value.accountType.value,
      'company': '',
      'companyAdressInfo': '',
      'companyCode': '',
    };
  }

  public onClickPrintByJasper(): void {
    this.searchOnDetailsIsEnabled = false;
    if (this.generalLedgerFilterFormGroup.valid) {
      if (this.pageFilterService.isTrueIfBeginAccountCodeIsLowerThanEndAccountCode(this.generalLedgerFilterFormGroup)) {
        if (this.pageFilterService.isTrueIfStartDateIsLowerThanEndDate(this.generalLedgerFilterFormGroup)) {
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
          const startDate = this.pageFilterService.getStartDateToUseInPageFilter(this.generalLedgerFilterFormGroup);
          const endDate = this.pageFilterService.getEndDateToUseInPageFilter(this.generalLedgerFilterFormGroup);

          this.companyService.getCurrentCompany().subscribe( company => {
            let srcPicture = this.companyService.getPicture(company.AttachmentUrl)
            const printPDF = () => {
              this.genericAccountingService.setCompanyInfos(dataToSend, company);
              const reportTemplateParams = new ReportTemplateDefaultParams(dataToSend.company,dataToSend.logoDataBase64, dataToSend.companyAdressInfo, this.provisionalEdition, dataToSend.generationDate,dataToSend.commercialRegister,dataToSend.matriculeFisc,dataToSend.mail,dataToSend.webSite,dataToSend.tel);
              let beginAmount = this.generalLedgerFilterFormGroup.value.beginAmount;
              let endAmount = this.generalLedgerFilterFormGroup.value.endAmount;
              if (this.genericAccountingService.isNullAndUndefinedAndEmpty(this.generalLedgerFilterFormGroup.value.amount )) {
                if (this.generalLedgerFilterFormGroup.value.beginAmount === null) {
                  this.generalLedgerFilterFormGroup.controls['beginAmount'].setValue('');
                  beginAmount = this.generalLedgerFilterFormGroup.value.beginAmount;
                }
                if (this.generalLedgerFilterFormGroup.value.endAmount === null) {
                  this.generalLedgerFilterFormGroup.controls['endAmount'].setValue('');
                  endAmount = this.generalLedgerFilterFormGroup.value.endAmount;
                }
              } else {
                beginAmount = this.generalLedgerFilterFormGroup.value.amount;
                endAmount = this.generalLedgerFilterFormGroup.value.amount;
              }
              this.reportingService.getJavaGenericService().saveEntity(reportTemplateParams,
              `${ReportingConstant.JASPER_ENTITY_NAME}/${ReportingConstant.GENERAL_LEDGER_REPORT}` +
              `?page=${this.currentPage}&size=${this.pageSize}&startDate=${startDate}&endDate=${endDate}` +
              `&beginAccountCode=${this.generalLedgerFilterFormGroup.value.beginAccountCode}` +
              `&endAccountCode=${this.generalLedgerFilterFormGroup.value.endAccountCode}` +
              `&beginAmount=${beginAmount}` +
              `&endAmount=${endAmount}` +
              `&accountType=${this.generalLedgerFilterFormGroup.value.accountType.value}` +
              `&letteringOperationType=${this.generalLedgerFilterFormGroup.value.letteringOperationType.value}` +
              `&field=${this.field}&direction=${this.direction}`) .subscribe(data => {
                this.genericAccountingService.downloadPDFFile(data, this.translate.instant(SharedAccountingConstant.GENERAL_LEDGER_TITLE));
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
          this.setCurrentPageToFirstPage();
          this.reloadGeneralLedger();
        }  else {
          this.growlService.ErrorNotification(this.translate.instant(ReportingConstant.START_DATE_IS_AFTER_END_DATE));
        }
      } else {
        this.growlService.ErrorNotification(this.translate.instant(ReportingConstant.BEGIN_ACCOUNT_CODE_IS_GREATER_THAN_END_ACCOUNT));
      }
    } else {
      this.validationService.validateAllFormFields(this.generalLedgerFilterFormGroup);
    }
  }

  private calculateGeneralLedgerTotal(totalElement: any) {
    this.totalDebit = totalElement.totalDebit;
    this.totalCredit = totalElement.totalCredit;
    this.totalBalance = totalElement.totalBalance;
  }

  onSearch() {
    this.initGeneralLedger();
  }

  initGeneralLedger() {
    this.searchOnDetailsIsEnabled = false;
    if (this.generalLedgerFilterFormGroup.valid) {
      if (this.pageFilterService.isTrueIfBeginAccountCodeIsLowerThanEndAccountCode(this.generalLedgerFilterFormGroup)) {
        if (this.pageFilterService.isTrueIfStartDateIsLowerThanEndDate(this.generalLedgerFilterFormGroup)) {
          this.searchOnDetailsIsEnabled = true;
          this.setCurrentPageToFirstPage();
          this.reloadGeneralLedger();
        } else {
          this.growlService.ErrorNotification(this.translate.instant(ReportingConstant.START_DATE_IS_AFTER_END_DATE));
        }
      } else {
        this.growlService.ErrorNotification(this.translate.instant(ReportingConstant.BEGIN_ACCOUNT_CODE_IS_GREATER_THAN_END_ACCOUNT));
      }
    } else {
      this.validationService.validateAllFormFields(this.generalLedgerFilterFormGroup);
    }
  }

  private setSelectedCurrency(currency: ReducedCurrency) {
    this.formatNumberOptions = {
      style: 'decimal',
      maximumFractionDigits: currency.Precision,
      minimumFractionDigits: currency.Precision
    };
  }

  getCurrencyCurrency() {
    this.companyService.getDefaultCurrencyDetails().subscribe((currency: ReducedCurrency) => {
      this.setSelectedCurrency(currency);
      this.currencyCode = currency.Code;
    });
  }

  handleFilterChange(writtenValue) {
    this.accountTypeList = this.accountTypeListFilter.filter((s) =>
      s.text.toLowerCase().includes(writtenValue.toLowerCase())
      || s.text.toLocaleLowerCase().includes(writtenValue.toLowerCase())
    );
  }

  public ngOnInit(): void {
    this.getCurrencyCurrency();
    this.letteringOperationTypeDataFilter = this.letteringOperationTypeData;
    this.generalLedgerView = this.behaviorSubjectForGridDataResultService;
    this.generalLedgerFilterFormGroup = this.pageFilterService.initPageFilterFormGroup();
    this.pageFilterService.initFormDatesThroughCurrentFiscalYear(this.generalLedgerFilterFormGroup, this.reloadGeneralLedger.bind(this),
      SharedAccountingConstant.START_DATE_ACCOUNTING, SharedAccountingConstant.END_DATE_ACCOUNTING, this.currentFiscalYear);
    this.accountTypeListFilter = this.accountTypeList;
  }

  @HostListener('document:keydown.Enter', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.generalLedgerFilterFormGroup.untouched) {
      this.initGeneralLedger();
    }
    else {
      this.generalLedgerFilterFormGroup.markAsUntouched();
    }
  }

  changeProvisionalEdition() {
    this.provisionalEdition = !this.provisionalEdition;
  }

  onClickPrintExcel() {
    this.searchOnDetailsIsEnabled = false;
    if (this.generalLedgerFilterFormGroup.valid) {
      if (this.pageFilterService.isTrueIfBeginAccountCodeIsLowerThanEndAccountCode(this.generalLedgerFilterFormGroup)) {
        if (this.pageFilterService.isTrueIfStartDateIsLowerThanEndDate(this.generalLedgerFilterFormGroup)) {
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
                const startDate = this.pageFilterService.getStartDateToUseInPageFilter(this.generalLedgerFilterFormGroup);
                const endDate = this.pageFilterService.getEndDateToUseInPageFilter(this.generalLedgerFilterFormGroup);
                let beginAmount = this.generalLedgerFilterFormGroup.value.beginAmount;
                let endAmount = this.generalLedgerFilterFormGroup.value.endAmount;
                if (this.genericAccountingService.isNullAndUndefinedAndEmpty(this.generalLedgerFilterFormGroup.value.amount )) {
                  if (this.generalLedgerFilterFormGroup.value.beginAmount === null) {
                    this.generalLedgerFilterFormGroup.controls['beginAmount'].setValue('');
                    beginAmount = this.generalLedgerFilterFormGroup.value.beginAmount;
                  }
                  if (this.generalLedgerFilterFormGroup.value.endAmount === null) {
                    this.generalLedgerFilterFormGroup.controls['endAmount'].setValue('');
                    endAmount = this.generalLedgerFilterFormGroup.value.endAmount;
                  }
                } else {
                  beginAmount = this.generalLedgerFilterFormGroup.value.amount;
                  endAmount = this.generalLedgerFilterFormGroup.value.amount;
                }
                this.reportingService.getJavaGenericService().saveEntity(reportTemplateParams, ReportingConstant.EXCEL_ENTITY_NAME
                 + '/' + ReportingConstant.GENERAL_LEDGER_URL +
                 `?page=${this.currentPage}&size=${this.pageSize}&startDate=${startDate}&endDate=${endDate}` +
                 `&beginAccountCode=${this.generalLedgerFilterFormGroup.value.beginAccountCode}` +
                 `&endAccountCode=${this.generalLedgerFilterFormGroup.value.endAccountCode}` +
                 `&beginAmount=${beginAmount}` +
                 `&endAmount=${endAmount}` +
                 `&accountType=${this.generalLedgerFilterFormGroup.value.accountType.value}` +
                 `&letteringOperationType=${this.generalLedgerFilterFormGroup.value.letteringOperationType.value}` +
                 `&field=${this.field}&direction=${this.direction}`
               )
                .subscribe(data => {
                 this.spinner = false;
                 this.genericAccountingService.downloadExcelFile(data, this.translate.instant('GENERAL_LEDGER'));
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
          this.searchOnDetailsIsEnabled = true;
          this.setCurrentPageToFirstPage();
          this.reloadGeneralLedger();
        } else {
          this.growlService.ErrorNotification(this.translate.instant(ReportingConstant.START_DATE_IS_AFTER_END_DATE));
        }
      } else {
        this.growlService.ErrorNotification(this.translate.instant(ReportingConstant.BEGIN_ACCOUNT_CODE_IS_GREATER_THAN_END_ACCOUNT));
      }
    } else {
      this.validationService.validateAllFormFields(this.generalLedgerFilterFormGroup);
    }
  }


  handleFilterOperationTypeChange(writtenValue) {
    this.letteringOperationTypeData = this.letteringOperationTypeDataFilter.filter((s) =>
      s.text.toLowerCase().includes(writtenValue.toLowerCase())
      || s.text.toLocaleLowerCase().includes(writtenValue.toLowerCase())
    );
  }

  getSortParam(event) {
    this.sortParams = event;
    this.field = this.sortParams.field;
    this.direction = this.sortParams.direction;
  }
}
