import { Component, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Filter, Operation, Operator, PredicateFormat, Relation } from '../../../../shared/utils/predicate';
import { DataStateChangeEvent, GridComponent, PagerSettings } from '@progress/kendo-angular-grid';
import { SharedConstant } from '../../../../constant/shared/shared.constant';
import { DataResult, DataSourceRequestState } from '@progress/kendo-data-query';
import { NumberConstant } from '../../../../constant/utility/number.constant';
import { ColumnSettings } from '../../../../shared/utils/column-settings.interface';
import { TreasuryConstant } from '../../../../constant/treasury/treasury.constant';
import { GridSettings } from '../../../../shared/utils/grid-settings.interface';
import { DeadLineDocumentService } from '../../../../sales/services/dead-line-document/dead-line-document.service';
import { PaymentModeService } from '../../../../payment/services/payment-method/payment-mode.service';
import { Currency } from '../../../../models/administration/currency.model';
import { OutstandingDocumentTypeEnumerator } from '../../../../models/enumerators/outstanding-document-type.enum';
import { DocumentEnumerator } from '../../../../models/enumerators/document.enum';
import { Router } from '@angular/router';
import { FormModalDialogService } from '../../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { TiersTypeEnumerator } from '../../../../models/enumerators/tiers-type.enum';
import { PopUpSettlementUpdateDisposeComponent } from '../../pop-up-settlement-update-dispose/pop-up-settlement-update-dispose.component';
import { CompanyService } from '../../../../administration/services/company/company.service';
import { PaymentStatusEnumerator } from '../../../../models/enumerators/payment-status.enum';
import { removeFilter } from '@progress/kendo-angular-grid/dist/es2015/filtering/base-filter-cell.component';
import { isNullOrUndefined } from 'util';
import { FiltrePredicateModel } from '../../../../models/shared/filtrePredicate.model';
import { FieldTypeConstant } from '../../../../constant/shared/fieldType.constant';
import { isNotNullOrUndefinedAndNotEmptyValue } from '../../../../stark-permissions/utils/utils';
import { TiersConstants } from '../../../../constant/purchase/tiers.constant';
import { ComponentsConstant } from '../../../../constant/shared/components.constant';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../../Structure/permission-constant';
import { LanguageService } from '../../../../shared/services/language/language.service';
import {LocalStorageService} from '../../../../login/Authentification/services/local-storage-service';

@Component({
  selector: 'app-settlements-history',
  templateUrl: './settlements-history.component.html',
  styleUrls: ['./settlements-history.component.scss']
})
export class SettlementsHistoryComponent implements OnInit {
  @Input() tiersType: number;
  @ViewChild('grid') grid: GridComponent;
  settlementFormGroup: FormGroup;
  predicate: PredicateFormat;
  idTiers: number;
  formatOptions;
  paymentStatusEnum = PaymentStatusEnumerator;
  // pager settings
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  invoicesList = new Array<any>();
  invoicesListSelected = new Array<any>();
  idInvoices = new Array<number>();
  companyWithholdingTax = false;
  /**
   * Grid state
   */
  public gridState: DataSourceRequestState = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.TWENTY,
    filter: {
      logic: 'and',
      filters: []
    }
  };

  outstandingDocumentTypeEnumerator = OutstandingDocumentTypeEnumerator;

  tiersTypeEnum = TiersTypeEnumerator;
  public documentType = DocumentEnumerator;
  /**
   * Grid columns
   */
  public columnsConfig: ColumnSettings[] = [
    {
      field: TreasuryConstant.CODE_FIELD,
      title: TreasuryConstant.CODE,
      tooltip: TreasuryConstant.CODE_SETTLEMENT_TITLE,
      filterable: true
    },
    {
      field: TreasuryConstant.LABEL,
      title: TreasuryConstant.LABEL_TITLE,
      tooltip: TreasuryConstant.LABEL_SETTLEMENT,
      filterable: true
    },
    {
      field: TreasuryConstant.SETTLEMENT_REFERENCE,
      title: TreasuryConstant.EXTERNAL_REFERENCE,
      tooltip: TreasuryConstant.EXTERNAL_REFERENCE_SETTLEMENT,
      filterable: true
    },
    {
      field: TreasuryConstant.NAME_TIERS,
      title: this.getTiersTitle(),
      tooltip: TreasuryConstant.TIERS_NAME,
      filterable: true
    },
    {
      field: TreasuryConstant.SETTLEMENT_DATE,
      title: TreasuryConstant.REDUCED_SETTLEMENT_DATE_TITLE,
      format: this.translate.instant(SharedConstant.DATE_FORMAT),
      tooltip: TreasuryConstant.SETTLEMENT_DATE_TITLE,
      filterable: true
    },
    {
      field: TreasuryConstant.COMMITMENT_DATE,
      title: TreasuryConstant.REDUCED_COMMITMENT_DATE_TITLE,
      format: this.translate.instant(SharedConstant.DATE_FORMAT),
      tooltip: TreasuryConstant.COMMITMENT_DATE_TITLE,
      filterable: true
    },
    {
      field: TreasuryConstant.NAME_METHOD,
      title: TreasuryConstant.PAYMENT,
      tooltip: TreasuryConstant.PAYMENT_MODE,
      filterable: true
    },
    {
      field: TreasuryConstant.SETTLEMENT_TOTAL_AMOUNT,
      title: TreasuryConstant.TOTAL_AMOUNT_UPPERCASE,
      tooltip: TreasuryConstant.TOTAL_AMOUNT_TO_BE_PAID,
      filterable: true
    },
    {
      field: TreasuryConstant.WITHHOLDING_TAX,
      title: TreasuryConstant.WITHHOLDING_TITLE,
      tooltip: TreasuryConstant.WITH_HOLDING_TAX,
      filterable: true
    },
    {
      field: TreasuryConstant.PAYMENT_STATUS,
      title: TreasuryConstant.STATUT,
      tooltip: TreasuryConstant.SETTLEMENT_PAYMENT_STATUS,
      filterable: true
    },
  ];

  // Grid settings
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
    gridData: new Object as DataResult
  };
  // formatDate
  dateFormat = this.translate.instant(SharedConstant.DATE_FORMAT);
  // Total amount of all settlements
  totalAmountSettlements = NumberConstant.ZERO;
  // direction of settlement
  direction: number;
  userCurrency: Currency;
  language: string;
  public paymentHistory;
  /**
   * quick search predicate
   */
  public predicateQuickSearch: PredicateFormat;
  public predicatePaymentHistory: PredicateFormat[] = [];
  filtreFieldsColumns = [];
  filtreFieldsInputs = [];
  public predicateAdvancedSearch: PredicateFormat;
  public dropdownSettings = {};
  // Permission
  public hasShowCustomerPaymentHistoryPermission: boolean;
  public hasUpdateCustomerPaymentHistoryPermission: boolean;
  public hasShowtSupplierPaymentHistoryPermission: boolean;
  public hasUpdateSupplierPaymentHistoryPermission: boolean;

  constructor(private settlementService: DeadLineDocumentService, private companyService: CompanyService,
    public formModalDialogService: FormModalDialogService,
    private viewRef: ViewContainerRef, private translate: TranslateService,
              private localStorageService : LocalStorageService, private fb: FormBuilder,
      private paymentModeService: PaymentModeService, private router: Router,
      private authService: AuthService) {
     this.language = this.localStorageService.getLanguage();

  }

  ngOnInit() {
    this.hasShowCustomerPaymentHistoryPermission = this.authService.hasAuthority(PermissionConstant.TreasuryPermissions.READONLY_CUSTOMER_PAYMENT_HISTORY);
    this.hasUpdateCustomerPaymentHistoryPermission = this.authService.hasAuthority(PermissionConstant.TreasuryPermissions.UPDATE_CUSTOMER_PAYMENT_HISTORY);
    this.hasShowtSupplierPaymentHistoryPermission = this.authService.hasAuthority(PermissionConstant.TreasuryPermissions.READONLY_SUPPLIER_PAYMENT_HISTORY);
    this.hasUpdateSupplierPaymentHistoryPermission = this.authService.hasAuthority(PermissionConstant.TreasuryPermissions.UPDATE_SUPPLIER_PAYMENT_HISTORY);
    let predicateAdv = this.preparePredicate();
    let predicateQuick = this.preparePredicate();
    this.predicateAdvancedSearch = predicateAdv
    this.predicateQuickSearch = predicateQuick
    this.companyService.getCurrentCompany().subscribe(company => {
      this.userCurrency = company.IdCurrencyNavigation;
    });
    this.predicatePaymentHistory.push(this.preparePredicate());
    this.initGridDataSource();
    this.getInvoicesList();
    this.companyService.getCurrentCompany().subscribe((data) => {
      this.companyWithholdingTax = data.WithholdingTax;
    });
    this.initCustomersFiltreConfig();
    this.initPaymentHistory();
    this.initDropdownInvoicesFilter();
  }

  private preparePredicate(): PredicateFormat {
    const myPredicate = new PredicateFormat();
    myPredicate.Filter = new Array<Filter>();
    myPredicate.Filter.push(new Filter(TreasuryConstant.TIERS_TYPE_FROM_ID_TIERS_NAVIGATION, Operation.eq, this.tiersType, false, false));
    myPredicate.Relation = new Array<Relation>();
    myPredicate.Relation.push.apply(myPredicate.Relation, [new Relation(TreasuryConstant.ID_TIERS_NAVIGATION),
      new Relation(TreasuryConstant.USED_CURRENCY), new Relation(TreasuryConstant.PAYMENT_METHOD_NAVIGATION),
      new Relation("IdBankAccountNavigation")]);
    myPredicate.SpecificRelation = new Array<string>();
    myPredicate.SpecificRelation.push("IdBankAccountNavigation.IdBankNavigation");
    return myPredicate;
  }

  initGridDataSource(isQuickSearch?: boolean) {
    this.grid.loading = true;
    if (!this.idInvoices || (this.idInvoices && this.idInvoices.length === NumberConstant.ZERO)) {
      this.settlementService.reloadServerSideDataWithListPredicate(this.gridSettings.state, this.predicatePaymentHistory,
        SharedConstant.GET_DATA_WITH_SPECIFIC_FILTER).subscribe(result => {
          this.gridSettings.gridData.data = result.data;
          this.gridSettings.gridData.total = result.total;
          this.totalAmountSettlements = result.sum;
          this.grid.loading = false;
        });
    } else {
      this.gridSettings.state.skip = NumberConstant.ZERO;
      this.getSettlements();
      this.getInvoicesList();
    }
  }

  getSettlements() {
    this.settlementService.getAllSettlements(this.gridSettings.state, this.tiersType,
      null, null, this.idInvoices, this.predicatePaymentHistory[NumberConstant.ZERO]).subscribe(result => {
        this.gridSettings.gridData.data = result.listData;
        this.gridSettings.gridData.total = result.total;
        this.totalAmountSettlements = result.sum;
        this.grid.loading = false;
      });
  }

  setPredicateFilter(isQuickSearch) {
    this.predicatePaymentHistory = [];
    if (isQuickSearch) {
      this.predicatePaymentHistory.push(this.predicateQuickSearch);
    } else {
      this.predicateAdvancedSearch.Operator = Operator.and;
      this.gridState.filter.logic = SharedConstant.LOGIC_AND;
      this.gridSettings.state.filter.logic = SharedConstant.LOGIC_AND;
      this.predicatePaymentHistory.push(this.predicateAdvancedSearch);
    }
  }

  getInvoicesList() {
    this.settlementService.getInvoicesBySettlement(this.tiersType, this.predicatePaymentHistory[NumberConstant.ZERO]).subscribe(result => {
      this.invoicesList = result;
    });
  }

  valueChange() {
    this.idInvoices = this.invoicesListSelected.map(invoice => invoice.Id);
    if (this.idInvoices.length === NumberConstant.ZERO) {
      this.initGridDataSource(false);
      this.totalAmountSettlements = NumberConstant.ZERO;
    } else {
      this.gridSettings.state.skip = NumberConstant.ZERO;
      this.getSettlements();
      this.getInvoicesList();
    }

  }

  // Set up grid while page number has changed
  public dataStateChange(state: DataStateChangeEvent) {
    this.gridSettings.state = state;
    this.initGridDataSource();
    this.getInvoicesList();
  }

  public initPaymentHistory() {
    this.predicatePaymentHistory.push(this.preparePredicate());
  }

  paymentMethodFilterChange($event) {
    removeFilter(this.gridSettings.state.filter, TreasuryConstant.ID_PAYMENT_STATUS);
    if ($event) {
      this.gridSettings.state.filter.filters.push({ field: TreasuryConstant.ID_PAYMENT_STATUS, operator: 'eq', value: $event });
    }
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.initGridDataSource();
  }

  getTiersTitle(): string {
    return this.tiersType === this.tiersTypeEnum.Customer ? TreasuryConstant.CLIENT : TreasuryConstant.SUPPLIER;
  }

  openDetailsForm(dataItem) {
    const TITLE = dataItem.Code;
    const data = {};
    data['Settlement'] = dataItem;
    data['CompanyWithholdingTax'] = this.companyWithholdingTax;
    data['tiersType'] = this.tiersType;
    this.formModalDialogService.openDialog(TITLE, PopUpSettlementUpdateDisposeComponent,
      this.viewRef, this.initGridDataSource.bind(this), data, true, SharedConstant.MODAL_DIALOG_SIZE_L);
  }

  public filter() {
    this.predicateQuickSearch = this.preparePredicate();
    if (this.paymentHistory !== "") {
      this.predicateQuickSearch.Filter.push(new Filter(TreasuryConstant.CODE_FIELD, Operation.contains, this.paymentHistory, false, true));
      this.predicateQuickSearch.Filter.push(new Filter(TreasuryConstant.NAME_FROM_ID_TIERS_NAVIGATION, Operation.contains, this.paymentHistory, false, true));
      }
    this.predicatePaymentHistory = [];
    this.predicatePaymentHistory.push(this.mergefilters());
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.initGridDataSource(true);
  }

  public getTypeSupplierField() {
    if (this.tiersType === this.tiersTypeEnum.Customer) {
      return FieldTypeConstant.customerComponent;
    } else {
      return FieldTypeConstant.supplierComponent;
    }
  }

  /**
   * load advancedSearch parameters config
   * @private
   */
  private initCustomersFiltreConfig() {
    const typeSupplierField = this.getTypeSupplierField();
    this.filtreFieldsColumns.push(new FiltrePredicateModel(TreasuryConstant.CODE, FieldTypeConstant.TEXT_TYPE, TreasuryConstant.CODE_FIELD));
    this.filtreFieldsColumns.push(new FiltrePredicateModel(TreasuryConstant.LABEL_TITLE, FieldTypeConstant.TEXT_TYPE, TreasuryConstant.LABEL));
    this.filtreFieldsColumns.push(new FiltrePredicateModel(TreasuryConstant.EXTERNAL_REFERENCE, FieldTypeConstant.TEXT_TYPE, TreasuryConstant.SETTLEMENT_REFERENCE));
    this.filtreFieldsColumns.push(new FiltrePredicateModel(this.getTiersTitle(), typeSupplierField, TreasuryConstant.ID_TIERS));
    this.filtreFieldsInputs.push(new FiltrePredicateModel(TreasuryConstant.SETTLEMENT_DATE_TITLE, FieldTypeConstant.DATE_TYPE, TreasuryConstant.SETTLEMENT_DATE));
    this.filtreFieldsInputs.push(new FiltrePredicateModel(TreasuryConstant.COMMITMENT_DATE_TITLE, FieldTypeConstant.DATE_TYPE, TreasuryConstant.COMMITMENT_DATE));
    this.filtreFieldsInputs.push(new FiltrePredicateModel(TreasuryConstant.PAYMENT_MODE, FieldTypeConstant.TEXT_TYPE, TreasuryConstant.METHOD_NAME));
    this.filtreFieldsInputs.push(new FiltrePredicateModel(TreasuryConstant.TOTAL_AMOUNT_UPPERCASE, FieldTypeConstant.numerictexbox_type, TreasuryConstant.SETTLEMENT_TOTAL_AMOUNT));
    this.filtreFieldsInputs.push(new FiltrePredicateModel(TreasuryConstant.WITHHOLDING_TITLE, FieldTypeConstant.TEXT_TYPE, TreasuryConstant.WITHHOLDING_TAX));
    this.filtreFieldsInputs.push(new FiltrePredicateModel(TreasuryConstant.PAYMENT_STATUS_TITLE, FieldTypeConstant.paymentStatusComponent, TreasuryConstant.PAYMENT_STATUS));
  }

  getFiltrePredicate(filtre) {
    this.predicatePaymentHistory = [];
    this.prepareSpecificFiltreFromAdvancedSearch(filtre);
    this.prepareFiltreFromAdvancedSearch(filtre);
    this.predicatePaymentHistory.push(this.mergefilters());
  }

  mergefilters() {
    let predicate = new PredicateFormat();
    if (this.predicateAdvancedSearch) {
      this.cloneAdvancedSearchPredicate(predicate);
    }
    if (this.predicateQuickSearch.Filter.length !== NumberConstant.ZERO) {
      predicate.Filter = predicate.Filter.concat(this.predicateQuickSearch.Filter);
    }
    return (predicate);
  }

  public cloneAdvancedSearchPredicate(targetPredicate: PredicateFormat) {
    targetPredicate.Filter = this.predicateAdvancedSearch.Filter;
    targetPredicate.IsDefaultPredicate = this.predicateAdvancedSearch.IsDefaultPredicate;
    targetPredicate.Operator = this.predicateAdvancedSearch.Operator;
    targetPredicate.OrderBy = this.predicateAdvancedSearch.OrderBy;
    targetPredicate.Relation = this.predicateAdvancedSearch.Relation;
    targetPredicate.SpecFilter = this.predicateAdvancedSearch.SpecFilter;
    targetPredicate.SpecificRelation = this.predicateAdvancedSearch.SpecificRelation;
    targetPredicate.page = this.predicateAdvancedSearch.page;
    targetPredicate.pageSize = this.predicateAdvancedSearch.pageSize;
    targetPredicate.values = this.predicateAdvancedSearch.values;
  }

  resetClickEvent() {
    this.predicateAdvancedSearch = this.preparePredicate();
    this.predicatePaymentHistory = [];
    this.predicatePaymentHistory.push(this.mergefilters());
    this.initGridDataSource(true);
  }

  getOperatorPredicate(operator: Operator) {
    this.predicateAdvancedSearch.Operator = operator;
  }

  searchClick() {
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.initGridDataSource(false);
  }

  private prepareSpecificFiltreFromAdvancedSearch(filtre) {
    if (filtre.SpecificFiltre && !filtre.SpecificFiltreToDelete) {
      this.predicateAdvancedSearch.SpecFilter = this.predicateAdvancedSearch.SpecFilter.filter(value => value.Prop !== filtre.SpecificFiltre.Prop);
      this.predicateAdvancedSearch.SpecFilter.push(filtre.SpecificFiltre);
    } else if (filtre.SpecificFiltreToDelete) {
      this.predicateAdvancedSearch.SpecFilter = this.predicateAdvancedSearch.SpecFilter.filter(value => value.Prop !== filtre.SpecificFiltre.Prop);
    }
  }

  /**
   * case filtre date between : we don't remove the old filtre date value
   * @param filtre
   * @private
   */
  private prepareFiltreFromAdvancedSearch(filtreFromAdvSearch) {
    let isDefaultOperationField = this.predicateAdvancedSearch.Filter.filter(value => value.prop == filtreFromAdvSearch.prop).length == NumberConstant.ZERO ? true : false;
    this.predicateAdvancedSearch.Filter = this.predicateAdvancedSearch.Filter.filter(value => value.prop !== filtreFromAdvSearch.prop);
    if (filtreFromAdvSearch.isDateFiltreBetween) {
      this.prepareDatesFiltres(filtreFromAdvSearch);
    } else if (filtreFromAdvSearch.operation && isNotNullOrUndefinedAndNotEmptyValue(filtreFromAdvSearch.value) && !filtreFromAdvSearch.SpecificFiltre) {
      if (isDefaultOperationField && (filtreFromAdvSearch.prop == TreasuryConstant.CODE_FIELD || filtreFromAdvSearch.prop == TreasuryConstant.SETTLEMENT_REFERENCE || filtreFromAdvSearch.prop == TreasuryConstant.LABEL) ){
        filtreFromAdvSearch.operation = Operation.contains;
      }
      this.predicateAdvancedSearch.Filter.push(filtreFromAdvSearch);
    }
  }

  private prepareDatesFiltres(filtreFromAdvSearch) {
    if (isNotNullOrUndefinedAndNotEmptyValue(filtreFromAdvSearch.filtres[NumberConstant.ZERO].value)) {
      this.predicateAdvancedSearch.Filter.push(filtreFromAdvSearch.filtres[NumberConstant.ZERO]);
    }
    if (isNotNullOrUndefinedAndNotEmptyValue(filtreFromAdvSearch.filtres[NumberConstant.ONE].value)) {
      this.predicateAdvancedSearch.Filter.push(filtreFromAdvSearch.filtres[NumberConstant.ONE]);
    }
  }

  public initDropdownInvoicesFilter() {
    this.dropdownSettings = {
      singleSelection: false,
      idField: ComponentsConstant.ID,
      textField: TiersConstants.CODE,
      selectAllText: `${this.translate.instant(ComponentsConstant.SELECT_ALL)}`,
      unSelectAllText: `${this.translate.instant(ComponentsConstant.DESELECT_ALL)}`,
      itemsShowLimit: NumberConstant.TWO,
      allowSearchFilter: true
    };
  }

}
