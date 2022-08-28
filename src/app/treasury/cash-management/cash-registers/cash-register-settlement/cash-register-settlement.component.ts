import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DataStateChangeEvent, PagerSettings } from '@progress/kendo-angular-grid';
import { removeFilter } from '@progress/kendo-angular-grid/dist/es2015/filtering/base-filter-cell.component';
import { DataResult, DataSourceRequestState } from '@progress/kendo-data-query';
import { CompanyService } from '../../../../administration/services/company/company.service';
import { FieldTypeConstant } from '../../../../constant/shared/fieldType.constant';
import { SharedConstant } from '../../../../constant/shared/shared.constant';
import { TreasuryConstant } from '../../../../constant/treasury/treasury.constant';
import { NumberConstant } from '../../../../constant/utility/number.constant';
import { AuthService } from '../../../../login/Authentification/services/auth.service';
import { LocalStorageService } from '../../../../login/Authentification/services/local-storage-service';
import { Currency } from '../../../../models/administration/currency.model';
import { DocumentEnumerator } from '../../../../models/enumerators/document.enum';
import { OutstandingDocumentTypeEnumerator } from '../../../../models/enumerators/outstanding-document-type.enum';
import { PaymentStatusEnumerator } from '../../../../models/enumerators/payment-status.enum';
import { TiersTypeEnumerator } from '../../../../models/enumerators/tiers-type.enum';
import { FiltrePredicateModel } from '../../../../models/shared/filtrePredicate.model';
import { CashRegister } from '../../../../models/treasury/cash-register.model';
import { PaymentModeService } from '../../../../payment/services/payment-method/payment-mode.service';
import { DeadLineDocumentService } from '../../../../sales/services/dead-line-document/dead-line-document.service';
import { FormModalDialogService } from '../../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { ColumnSettings } from '../../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../../shared/utils/grid-settings.interface';
import { Filter, Operation, Operator, PredicateFormat, Relation } from '../../../../shared/utils/predicate';
import { isNotNullOrUndefinedAndNotEmptyValue } from '../../../../stark-permissions/utils/utils';
import { PermissionConstant } from '../../../../Structure/permission-constant';
import { PopUpSettlementUpdateDisposeComponent } from '../../../components/pop-up-settlement-update-dispose/pop-up-settlement-update-dispose.component';

const API_GET_DATA_WITH_SPEC_FILTRE = 'getDataWithSpecificFilter';
@Component({
  selector: 'app-cash-register-settlement',
  templateUrl: './cash-register-settlement.component.html',
  styleUrls: ['./cash-register-settlement.component.scss']
})
export class CashRegisterSettlementComponent implements OnInit, OnChanges {

  @Input() cashRegister: CashRegister;
  tiersType = TiersTypeEnumerator.Customer;
  settlementFormGroup: FormGroup;
  predicate: PredicateFormat;
  idTiers: number;
  formatOptions;
  paymentStatusEnum = PaymentStatusEnumerator;
  // pager settings
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  invoicesList = new Array<any>();
  invoicesListSelected = new Array<any>();
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
      filterable: true,
      _width: 150
    },
    {
      field: TreasuryConstant.NAME_TIERS,
      title: TreasuryConstant.CLIENT,
      tooltip: TreasuryConstant.TIERS_NAME,
      filterable: true,
      _width: 150
    },
    {
      field: TreasuryConstant.SETTLEMENT_DATE,
      title: TreasuryConstant.REDUCED_SETTLEMENT_DATE_TITLE,
      format: this.translate.instant("DATE_AND_TIME_FORMAT"),
      tooltip: TreasuryConstant.SETTLEMENT_DATE_TITLE,
      filterable: true,
      _width: 150
    },
    {
      field: TreasuryConstant.NAME_METHOD,
      title: TreasuryConstant.PAYMENT,
      tooltip: TreasuryConstant.PAYMENT_MODE,
      filterable: true,
      _width: 150
    },
    {
      field: TreasuryConstant.SETTLEMENT_TOTAL_AMOUNT,
      title: TreasuryConstant.TOTAL_AMOUNT_UPPERCASE,
      tooltip: TreasuryConstant.TOTAL_AMOUNT_TO_BE_PAID,
      filterable: true,
      _width: 150
    }
  ];

  // Grid settings
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
    gridData: new Object as DataResult
  };
  // formatDate
  dateFormat = this.translate.instant(SharedConstant.DATE_FORMAT);

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
    private localStorageService: LocalStorageService, private fb: FormBuilder,
    private paymentModeService: PaymentModeService, private router: Router,
    private authService: AuthService) {
    this.language = this.localStorageService.getLanguage();

  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.cashRegister.currentValue) {
      this.predicatePaymentHistory = [];
      let predicateAdv = this.preparePredicate();
      this.predicatePaymentHistory.push(predicateAdv);
      this.predicateAdvancedSearch = predicateAdv;
      this.gridSettings.state.skip = NumberConstant.ZERO;
      this.gridSettings.state.take = NumberConstant.TWENTY;
      this.initGridDataSource();
    }
  }



  ngOnInit() {
    this.hasShowCustomerPaymentHistoryPermission = this.authService.hasAuthority(PermissionConstant.TreasuryPermissions.READONLY_CUSTOMER_PAYMENT_HISTORY);
    this.hasUpdateCustomerPaymentHistoryPermission = this.authService.hasAuthority(PermissionConstant.TreasuryPermissions.UPDATE_CUSTOMER_PAYMENT_HISTORY);
    let predicateAdv = this.preparePredicate();
    let predicateQuick = predicateAdv;
    this.predicateAdvancedSearch = predicateAdv
    this.predicateQuickSearch = predicateQuick
    this.companyService.getCurrentCompany().subscribe(company => {
      this.userCurrency = company.IdCurrencyNavigation;
    });
    this.predicatePaymentHistory.push(predicateAdv);
    this.initGridDataSource();
    this.companyService.getCurrentCompany().subscribe((data) => {
      this.companyWithholdingTax = data.WithholdingTax;
    });
    this.initCustomersFiltreConfig();
  }

  private preparePredicate(): PredicateFormat {
    const myPredicate = new PredicateFormat();
    myPredicate.Filter = new Array<Filter>();
    myPredicate.Filter.push(new Filter(TreasuryConstant.SESSION_CASH_NAVIGATION_ID_CASH_REGISTER, Operation.eq, this.cashRegister.Id));
    myPredicate.Filter.push(new Filter(TreasuryConstant.TIERS_TYPE_FROM_ID_TIERS_NAVIGATION, Operation.eq, this.tiersType));
    myPredicate.Relation = new Array<Relation>();
    myPredicate.Relation.push.apply(myPredicate.Relation, [new Relation(TreasuryConstant.ID_TIERS_NAVIGATION),
    new Relation(TreasuryConstant.USED_CURRENCY), new Relation(TreasuryConstant.PAYMENT_METHOD_NAVIGATION)]);
    return myPredicate;
  }

  initGridDataSource() {
    this.settlementService.reloadServerSideDataWithListPredicate(this.gridSettings.state, this.predicatePaymentHistory,
      SharedConstant.GET_DATA_WITH_SPECIFIC_FILTER).subscribe(result => {
        this.gridSettings.gridData.data = result.data;
        this.gridSettings.gridData.total = result.total;
      });
  }

  // Set up grid while page number has changed
  public dataStateChange(state: DataStateChangeEvent) {
    this.gridSettings.state = state;
    this.initGridDataSource();
  }


  paymentMethodFilterChange($event) {
    removeFilter(this.gridSettings.state.filter, TreasuryConstant.ID_PAYMENT_STATUS);
    if ($event) {
      this.gridSettings.state.filter.filters.push({ field: TreasuryConstant.ID_PAYMENT_STATUS, operator: 'eq', value: $event });
    }
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.initGridDataSource();
  }





  openDetailsForm(dataItem) {
    const TITLE = dataItem.Code;
    const data = {};
    data['Settlement'] = dataItem;
    data['CompanyWithholdingTax'] = this.companyWithholdingTax;
    data['tiersType'] = this.tiersType;
    data['showButtons'] = true;
    this.formModalDialogService.openDialog(TITLE, PopUpSettlementUpdateDisposeComponent,
      this.viewRef, this.initGridDataSource.bind(this), data, true, SharedConstant.MODAL_DIALOG_SIZE_L);
  }




  /**
   * load advancedSearch parameters config
   * @private
   */
  private initCustomersFiltreConfig() {
    this.filtreFieldsColumns.push(new FiltrePredicateModel(TreasuryConstant.CODE, FieldTypeConstant.TEXT_TYPE, TreasuryConstant.CODE_FIELD));
    this.filtreFieldsColumns.push(new FiltrePredicateModel(TreasuryConstant.CLIENT, FieldTypeConstant.customerComponent, TreasuryConstant.ID_TIERS));
    this.filtreFieldsColumns.push(new FiltrePredicateModel(TreasuryConstant.SETTLEMENT_DATE_TITLE, FieldTypeConstant.DATE_TYPE, TreasuryConstant.SETTLEMENT_DATE));
    this.filtreFieldsInputs.push(new FiltrePredicateModel(TreasuryConstant.PAYMENT_MODE, FieldTypeConstant.TEXT_TYPE, TreasuryConstant.METHOD_NAME));
    this.filtreFieldsInputs.push(new FiltrePredicateModel(TreasuryConstant.TOTAL_AMOUNT_UPPERCASE, FieldTypeConstant.numerictexbox_type, TreasuryConstant.SETTLEMENT_TOTAL_AMOUNT));
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
    this.initGridDataSource();
  }

  getOperatorPredicate(operator: Operator) {
    this.predicateAdvancedSearch.Operator = operator;
  }

  searchClick() {
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.initGridDataSource();
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
      if (isDefaultOperationField && (filtreFromAdvSearch.prop == TreasuryConstant.CODE_FIELD || filtreFromAdvSearch.prop == TreasuryConstant.SETTLEMENT_REFERENCE || filtreFromAdvSearch.prop == TreasuryConstant.LABEL)) {
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

}