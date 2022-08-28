import {Component, Injectable, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DataSourceRequestState, State} from '@progress/kendo-data-query';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ColumnSettings} from '../../../../shared/utils/column-settings.interface';
import {DocumentAccountConstant} from '../../../../constant/accounting/document-account.constant';
import {GridSettings} from '../../../../shared/utils/grid-settings.interface';
import {DocumentAccountService} from '../../../services/document-account/document-account.service';
import {SwalWarring} from '../../../../shared/components/swal/swal-popup';
import {SharedConstant} from '../../../../constant/shared/shared.constant';
import {GrowlService} from '../../../../../COM/Growl/growl.service';
import {TranslateService} from '@ngx-translate/core';
import {GridComponent, PagerSettings} from '@progress/kendo-angular-grid';
import {Subscription} from 'rxjs/Subscription';
import {JournalConstants} from '../../../../constant/accounting/journal.constant';
import {JournalService} from '../../../services/journal/journal.service';
import {SharedAccountingConstant} from '../../../../constant/accounting/sharedAccounting.constant';
import {NumberConstant} from '../../../../constant/utility/number.constant';
import {CompanyService} from '../../../../administration/services/company/company.service';
import {GenericAccountingService} from '../../../services/generic-accounting.service';
import {FiscalYearStateEnumerator} from '../../../../models/enumerators/fiscal-year-state-enumerator.enum';
import {FiscalYearService} from '../../../services/fiscal-year/fiscal-year.service';
import {AccountingConfigurationService} from '../../../services/configuration/accounting-configuration.service';
import {NumberFormatOptions} from '@progress/kendo-angular-intl';
import {Filter} from '../../../../models/accounting/Filter';
import {AccountingConfigurationConstant} from '../../../../constant/accounting/accounting-configuration.constant';
import {KeyboardConst} from '../../../../constant/keyboard/keyboard.constant';
import {SearchConstant} from '../../../../constant/search-item';
import {FiltrePredicateModel} from '../../../../models/shared/filtrePredicate.model';
import {FieldTypeConstant} from '../../../../constant/shared/fieldType.constant';
import {Filter as predicate, Operator, PredicateFormat} from '../../../../shared/utils/predicate';
import {isNullOrUndefined} from 'util';
import {DocumentAccountStatus} from '../../../../models/enumerators/document-account-status.enum';
import { ReducedCurrency } from '../../../../models/administration/reduced-currency.model';
import { AuthService } from '../../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../../Structure/permission-constant';

@Component({
  selector: 'app-list-document-account',
  templateUrl: './document-account-list.component.html',
  styleUrls: ['./document-account-list.component.scss']
})
@Injectable()
export class DocumentAccountListComponent implements OnInit, OnDestroy {
  private subscription$: Subscription;
  private pageSize = SharedConstant.DEFAULT_ITEMS_NUMBER;
  private currentPage = NumberConstant.ZERO;
  public titleBtnGrid = DocumentAccountConstant.TITLE_BTN_GRID;

  @ViewChild('grid') public grid: GridComponent;
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public gridState: DataSourceRequestState = {
    skip: NumberConstant.ZERO,
    take: this.pageSize,
    filter: {
      logic: SharedConstant.LOGIC_AND,
      filters: []
    }
  };
  public spinner = false;

  private currencyId: number;
  public currencyCode: string;
  public sortParams = '';

  public formGroup: FormGroup;

  public lineSearchFormGroup: FormGroup;
  public accountFilteredList;
  public accountList;
  public purchasePrecision: number;

  public formatNumberOptions: NumberFormatOptions;

  public journalFiltredList = [];

  public currentFiscalYear: any;
  public formatDate = this.translate.instant(SharedConstant.DATE_FORMAT);

  public filters = new Array<Filter>();

  public closedPeriodEndDate = null;

  public fiscalYearIsOpened = true;

  public columnsConfig: ColumnSettings[] = [
    {
      field: DocumentAccountConstant.CODE_DOCUMENT_FIELD,
      title: DocumentAccountConstant.CODE_DOCUMENT_TITLE,
      tooltip: DocumentAccountConstant.CODE_DOCUMENT_TITLE,
      filterable: true
    },
    {
      field: DocumentAccountConstant.LABEL_FIELD,
      title: DocumentAccountConstant.LABEL_TITLE,
      tooltip: DocumentAccountConstant.LABEL_TITLE,
      filterable: true,
    },
    {
      field: DocumentAccountConstant.JOURNAL_FIELD,
      title: DocumentAccountConstant.JOURNAL_TITLE,
      tooltip: DocumentAccountConstant.JOURNAL_TITLE,
      filterable: true
    },
    {
      field: DocumentAccountConstant.DOCUMENT_DATE_FIELD,
      title: DocumentAccountConstant.DOCUMENT_DATE_TITLE,
      tooltip: DocumentAccountConstant.DOCUMENT_DATE_TITLE,
      filterable: true,
      filter: 'date'
    },
    {
      field: DocumentAccountConstant.BALANCE_FIELD,
      title: DocumentAccountConstant.BALANCE_TITLE,
      tooltip: DocumentAccountConstant.BALANCE_TITLE,
      filterable: true,
      filter: 'numeric'
    }];

  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig
  };
  public keyAction: any;

  public filterFieldsColumns = [];
  public filterFieldsInputs = [];
  /**
   * advanced search predicate
   */
  public predicateAdvancedSearch: PredicateFormat;
  public fieldType;
  public AccountingPermissions = PermissionConstant.AccountingPermissions;
  constructor(private documentAccountService: DocumentAccountService, private swalWarrings: SwalWarring,
              private router: Router, private growlService: GrowlService,
              private translate: TranslateService,
              private journalService: JournalService,
              private formBuilder: FormBuilder,
              private accountingConfigurationService: AccountingConfigurationService,
              private route: ActivatedRoute,
              private authService: AuthService,
              private genericAccountingService: GenericAccountingService,
              private companyService: CompanyService) {
    this.getCompanyCurrency();
    this.initAccountFilteredList();
    if (this.route.snapshot.data['currentFiscalYear']) {
      this.currentFiscalYear = this.route.snapshot.data['currentFiscalYear'];
      this.fiscalYearIsOpened = this.currentFiscalYear.closingState === FiscalYearStateEnumerator.Open ||
        this.currentFiscalYear.closingState === FiscalYearStateEnumerator.PartiallyClosed;
      if (!this.fiscalYearIsOpened) {
        this.growlService.warningNotification(this.translate.instant(SharedAccountingConstant.SELECTED_FISCAL_YEAR_IS_NOT_OPENED_YOU_ARE_IN_READ_MODE));
      }
      this.setClosingDate(this.currentFiscalYear.closingState);
    } else {
      this.accountingConfigurationService.getJavaGenericService().getEntityList(
        AccountingConfigurationConstant.CURRENT_FISCAL_YEAR_URL
      ).subscribe(data => {
        this.currentFiscalYear = data;
        this.fiscalYearIsOpened = data.closingState === FiscalYearStateEnumerator.Open || data.closingState === FiscalYearStateEnumerator.PartiallyClosed;
        this.setClosingDate(this.currentFiscalYear.closingState);
        if (!this.fiscalYearIsOpened) {
          this.growlService.warningNotification(this.translate.instant(SharedAccountingConstant.SELECTED_FISCAL_YEAR_IS_NOT_OPENED_YOU_ARE_IN_READ_MODE));
        }
      });
    }
    this.initJournalFilteredList();
  }

  public setClosingDate(closingState: FiscalYearStateEnumerator): void {
    if (closingState === FiscalYearStateEnumerator.PartiallyClosed) {
      this.closedPeriodEndDate = this.currentFiscalYear.closingDate;
    }
  }

  initAccountFilteredList() {
    this.genericAccountingService.getAccountList().then((accountList: any) => {
      this.accountList = accountList;
      this.accountFilteredList = accountList.slice(0);
    });
  }

  openAddDocumentAccountInNewTab() {
    return this.isThereAtLeastOneFieldInFilter();
  }

  initGridDataSource() {
    let filtersContainingFiscalYear = new Array<Filter>();
    this.filters.forEach(filter => {
      filtersContainingFiscalYear.push(filter);
    });
    this.spinner = true;
    filtersContainingFiscalYear.push(new Filter(SharedAccountingConstant.FILTER_TYPES.DROP_DOWN_LIST,
      SharedAccountingConstant.FILTER_OPERATORS.EQUAL, 'fiscalYear', this.currentFiscalYear.id));
    const lineSearchFormGroupValue = this.lineSearchFormGroup.getRawValue();
    if (!this.genericAccountingService.isNullAndUndefinedAndEmpty(lineSearchFormGroupValue['amount'])) {
      const debitAmountFilter = new Filter('numeric', 'eq', 'debitAmount', Number.parseFloat(lineSearchFormGroupValue['amount']).toFixed(this.formatNumberOptions.minimumFractionDigits));
      const creditAmountFilter = new Filter('numeric', 'eq', 'creditAmount', Number.parseFloat(lineSearchFormGroupValue['amount']).toFixed(this.formatNumberOptions.minimumFractionDigits));
      filtersContainingFiscalYear.push(debitAmountFilter);
      filtersContainingFiscalYear.push(creditAmountFilter);
      this.filters.push(debitAmountFilter);
      this.filters.push(creditAmountFilter);
    }
    if (!this.genericAccountingService.isNullAndUndefinedAndEmpty(lineSearchFormGroupValue['accountId'])) {
      const lineAccountFilter = new Filter('dropdown', 'eq', 'lineAccountId', lineSearchFormGroupValue['accountId']);
      filtersContainingFiscalYear.push(lineAccountFilter);
      this.filters.push(lineAccountFilter);
    }
    this.documentAccountService.getJavaGenericService().sendData(
      SharedAccountingConstant.FILTER_APIS.GET_DOCUMENT_ACCOUNT_LIST +
      `?page=${this.currentPage}&size=${this.pageSize}${this.sortParams}`, filtersContainingFiscalYear)
      .subscribe(data => {
        this.gridSettings.gridData = {data: data.listDocumentDto, total: data.total};
        this.getJournalList();
      }, () => {
      }, () => {
        this.spinner = false;
      });
  }

  public removeHandler(dataItem) {
    const swalWarningMessage = `${this.translate.instant(DocumentAccountConstant.DOCUMENT_ACCOUNT_DELETE_MSG_TEXT)}`;
    this.swalWarrings.CreateSwal(swalWarningMessage, DocumentAccountConstant.DOCUMENT_ACCOUNT_DELETE_MSG_TITLE).then((result) => {
      if (result.value) {
        this.documentAccountService.getJavaGenericService().deleteEntity(dataItem.id)
          .subscribe(() => {
              this.growlService.successNotification(this.translate.instant(SharedAccountingConstant.SUCCESS_OPERATION));
              this.initGridDataSource();
            },
            () => {
              this.growlService.ErrorNotification(this.translate.instant(SharedAccountingConstant.FAILURE_OPERATION));
            });
      }
    });
  }

  public isThereAtLeastOneFieldInFilter(): boolean {
    return this.filters.length > 0;
  }

  public goToAdvancedEdit(dataItem) {
    let urlPrefixe = DocumentAccountConstant.DOCUMENT_ACCOUNT_CONSULT;
    if (this.authService.hasAuthority(this.AccountingPermissions.UPDATE_DOCUMENTS_ACCOUNTS)){
      urlPrefixe = DocumentAccountConstant.DOCUMENT_ACCOUNT_EDIT_URL;
    }
    if (this.isThereAtLeastOneFieldInFilter()) {
      const url = this.router.serializeUrl(this.router.createUrlTree([urlPrefixe.concat(dataItem.id)], { queryParams: { id: null } }));
      window.open(url, '_blank');
    } else {
      this.router.navigateByUrl(urlPrefixe.concat(dataItem.id));
    }

  }

  public goToHistoric(dataItem) {
    if (this.isThereAtLeastOneFieldInFilter()) {
      const url = this.router.serializeUrl(this.router.createUrlTree([DocumentAccountConstant.DOCUMENT_ACCOUNT_HISTORY_URL.concat(dataItem.id)]));
      window.open(url, '_blank');
    } else {
      this.router.navigateByUrl(DocumentAccountConstant.DOCUMENT_ACCOUNT_HISTORY_URL.concat(dataItem.id));
    }
    
  }

  public dataStateChange(state: State): void {
    this.gridSettings.state = state;
    this.currentPage = (state.skip) / this.pageSize;
    this.pageSize = state.take;
    this.sortParams = this.genericAccountingService.getSortParams(state.sort);
  }

  public resetToFirstPage() {
    this.currentPage = 0;
    this.gridSettings.state.skip = this.currentPage;
  }

  public journalValueChange() {
    this.resetToFirstPage();
    this.initGridDataSource();
  }

  public onPageChange() {
    this.initGridDataSource();
  }

  public filterChange() {
    this.initGridDataSource();
  }

  public sortChange() {
    this.resetToFirstPage();
    this.initGridDataSource();
  }

  getJournalList() {
    return this.journalService.getJavaGenericService().getEntityList(JournalConstants.FIND_ALL_METHOD_URL);
  }

  handleKeyAction() {
    this.keyAction = (event) => {
      if (event.code === KeyboardConst.F2) {
        this.router.navigateByUrl(DocumentAccountConstant.DOCUMENT_ACCOUNT_ADD_URL);
      }
      if (event.code === KeyboardConst.ENTER || event.code === KeyboardConst.NUMPAD_ENTER) {
        this.initGridDataSource();
      }
    };
    document.addEventListener(SearchConstant.KEY_DOWN, this.keyAction);
  }

  private setSelectedCurrency(currency: ReducedCurrency) {
    this.purchasePrecision = currency.Precision;
    this.formatNumberOptions = {
      style: 'decimal',
      maximumFractionDigits: currency.Precision,
      minimumFractionDigits: currency.Precision
    };
  }

  getCompanyCurrency() {
    this.companyService.getDefaultCurrencyDetails().subscribe((currency: ReducedCurrency) => {
      this.currencyId = currency.Id;
      this.setSelectedCurrency(currency);
      this.currencyCode = currency.Code;
    });
  }

  initJournalFilteredList() {
    this.genericAccountingService.getJournalList().then((journalList: any) => {
      this.journalFiltredList = journalList;
    });
  }

  goToBillDocument(billdId: number, journalLabel: string) {
    let url;
    if(journalLabel === 'Achat'){
      url = `${DocumentAccountConstant.PURCHASE_INVOICE_URL}${billdId}/${this.currencyId}`;
    } else {
      url  = `${DocumentAccountConstant.INVOICE_URL}${billdId}/${this.currencyId}`;
    }
    window.open(url, '_blank');
  }

  handleFilterJournal(writtenValue) {
    this.journalFiltredList = this.genericAccountingService.getJournalFilteredListByWrittenValue(writtenValue);
  }

  public getDocumentAccountStatus() {
    return DocumentAccountStatus;
  }

  handleFilterAccount(writtenValue: string) {
    if (writtenValue === '') {
      this.accountFilteredList = this.genericAccountingService.doAsyncTaskUsingPromiseAndSetTimeOut(NumberConstant.ONE_HUNDRED).then(() => {
      });
    }
    this.accountFilteredList = this.genericAccountingService.getAccountFilteredListByWrittenValue(writtenValue);
  }

  selectionChangeAccountDropdown($event) {
    this.genericAccountingService.selectionChangeAccountDropdown($event);
    this.genericAccountingService.doAsyncTaskUsingPromiseAndSetTimeOut(NumberConstant.ONE_HUNDRED).then(() => {
      this.handleSearch();
    });
  }

  handleSearch() {
    this.filters = this.prepareFilter();
    this.initGridDataSource();
  }

  prepareFilter() {
    const filters = new Array<Filter>();
    this.predicateAdvancedSearch.Filter.forEach(filter => {
      if (filter.value !== "") {
        filters.push(new Filter(this.getFieldType(filter), this.getOperation(filter), filter.prop,
        this.fieldType === FieldTypeConstant.numerictexbox_type ? this.getvalue(filter.value) : filter.value));
      }
    });
    return filters;
  }

  getFieldType(filter: predicate): string {
    this.fieldType = this.genericAccountingService.getType(filter, this.filterFieldsColumns, this.filterFieldsInputs);
    return this.genericAccountingService.getFilterType(this.fieldType);
  }

  getOperation(filter: predicate): string {
    return this.genericAccountingService.getOperation(filter, this.filterFieldsColumns, this.filterFieldsInputs);
  }

  getvalue(value: any) {
    return this.genericAccountingService.getValue(value, this.formatNumberOptions);
  }

  searchClick() {
    this.filters = this.prepareFilter();
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.initGridDataSource();

  }

  getFilterPredicate(filtre) {
    this.prepareSpecificFiltreFromAdvancedSearch(filtre);
    this.prepareFiltreFromAdvancedSearch(filtre);
  }

  private prepareSpecificFiltreFromAdvancedSearch(filtre) {
    if (filtre.SpecificFiltre && !filtre.SpecificFiltreToDelete) {
      this.predicateAdvancedSearch.SpecFilter = this.predicateAdvancedSearch.SpecFilter.filter(value => value.Prop !== filtre.SpecificFiltre.Prop);
      this.predicateAdvancedSearch.SpecFilter.push(filtre.SpecificFiltre);
    } else if (filtre.SpecificFiltreToDelete) {
      this.predicateAdvancedSearch.SpecFilter = this.predicateAdvancedSearch.SpecFilter.filter(value => value.Prop !== filtre.SpecificFiltre.Prop);
    }
  }

  private prepareFiltreFromAdvancedSearch(filtreFromAdvSearch) {
    this.predicateAdvancedSearch.Filter = this.predicateAdvancedSearch.Filter.filter(value => value.prop !== filtreFromAdvSearch.prop);
    if (filtreFromAdvSearch.operation && !isNullOrUndefined(filtreFromAdvSearch.value) && !filtreFromAdvSearch.SpecificFiltre) {
      this.predicateAdvancedSearch.Filter.push(filtreFromAdvSearch);
    }
  }

  getOperatorPredicate(operator: Operator) {
    this.predicateAdvancedSearch.Operator = operator;
  }

  resetClickEvent() {
    this.filters = [];
    this.lineSearchFormGroup.controls['accountId'].setValue('');
    this.lineSearchFormGroup.controls['amount'].setValue('');
    this.initPredicateAdvancedSearch();
    this.initGridDataSource();
  }

  initFilterFiledConfig() {
    this.filterFieldsColumns.push(new FiltrePredicateModel(DocumentAccountConstant.CODE_DOCUMENT_TITLE, FieldTypeConstant.TEXT_TYPE, DocumentAccountConstant.CODE_DOCUMENT_FIELD));
    this.filterFieldsColumns.push(new FiltrePredicateModel(DocumentAccountConstant.LABEL_TITLE, FieldTypeConstant.TEXT_TYPE, DocumentAccountConstant.LABEL_FIELD));
    this.filterFieldsColumns.push(new FiltrePredicateModel(DocumentAccountConstant.JOURNAL_TITLE, FieldTypeConstant.journalComponent, SharedAccountingConstant.FILTER_DROP_DOWN_BY.JOURNAL));
    this.filterFieldsInputs.push(new FiltrePredicateModel(DocumentAccountConstant.DOCUMENT_DATE_TITLE, FieldTypeConstant.DATE_TYPE_ACC, DocumentAccountConstant.DOCUMENT_DATE_FIELD));
    this.filterFieldsInputs.push(new FiltrePredicateModel(DocumentAccountConstant.BALANCE_TITLE, FieldTypeConstant.numerictexbox_type, DocumentAccountConstant.BALANCE_FIELD));

  }

  initPredicateAdvancedSearch() {
    this.predicateAdvancedSearch = new PredicateFormat();
    this.predicateAdvancedSearch.Filter = new Array<predicate>();
  }


  ngOnInit() {
    this.initPredicateAdvancedSearch();
    this.initFilterFiledConfig();
    this.initLetteringFilterFormGroup();
    this.handleKeyAction();
    if(this.authService.hasAuthority(this.AccountingPermissions.VIEW_DOCUMENTS_ACCOUNTS) ||
    this.authService.hasAuthority(this.AccountingPermissions.UPDATE_DOCUMENTS_ACCOUNTS) ||
    this.authService.hasAuthority(this.AccountingPermissions.DELETE_DOCUMENTS_ACCOUNTS)) {
    this.initGridDataSource();
    }
  }

  initLetteringFilterFormGroup() {
    this.lineSearchFormGroup = this.formBuilder.group({
      amount: null,
      accountId: null,
    });
  }

  ngOnDestroy(): void {
    if (this.subscription$) {
      this.subscription$.unsubscribe();
    }
    document.removeEventListener(SearchConstant.KEY_DOWN, this.keyAction, false);
  }
}
