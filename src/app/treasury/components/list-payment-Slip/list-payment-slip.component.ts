import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {PagerSettings} from '@progress/kendo-angular-grid';
import {State} from '@progress/kendo-data-query';
import {CompanyService} from '../../../administration/services/company/company.service';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {TreasuryConstant} from '../../../constant/treasury/treasury.constant';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {PaymentMethodEnumerator} from '../../../models/enumerators/payment-method.enum';
import {PaymentSlipStatusEnumerator} from '../../../models/enumerators/payment-slip-status.enum';
import {DeadLineDocumentService} from '../../../sales/services/dead-line-document/dead-line-document.service';
import {SwalWarring} from '../../../shared/components/swal/swal-popup';
import {ColumnSettings} from '../../../shared/utils/column-settings.interface';
import {GridSettings} from '../../../shared/utils/grid-settings.interface';
import {Filter, Operation, Operator, OrderBy, OrderByDirection, PredicateFormat, Relation} from '../../../shared/utils/predicate';
import {PaymentSlipService} from '../../services/payment-slip.service';
import {isUndefined} from 'util';
import {isNotNullOrUndefinedAndNotEmptyValue} from '../../../stark-permissions/utils/utils';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';

@Component({
  selector: 'app-list-payment-slip',
  templateUrl: './list-payment-slip.component.html',
  styleUrls: ['./list-payment-slip.component.scss']
})
export class ListPaymentSlipComponent implements OnInit, OnChanges {

  @Input() paymentMethod;
  @Input() public predicateAdvancedSearch: PredicateFormat;
  @Output() totalSettlementNumberToAddEmitter: EventEmitter<number> = new EventEmitter<number>();
  // searchByTiersString: string;
  StartDate: any;
  EndDate: any;

  // Enums
  paymentEnum = PaymentMethodEnumerator;
  paymentSlipStatusEnumerator = PaymentSlipStatusEnumerator;

  public currencyCode: string;

  // interface attributs
  dateFormat = this.translateService.instant(SharedConstant.DATE_FORMAT);
  public paymentSlipFormGroup: FormGroup;
  listPaymentSlipStatus: Array<any> = [];

  defaultPaymentSlipStatus = {
    Id: 0,
    Value: this.translateService.instant(TreasuryConstant.ALL)
  };

  // Predicate
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public predicate: PredicateFormat = new PredicateFormat();
  public settlementPredicate: PredicateFormat = new PredicateFormat();

  public gridState: State = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.TWENTY,
    // Initial filter descriptor
    filter: {
      logic: SharedConstant.LOGIC_AND,
      filters: []
    },
  };

  numberOfSettlementToAddInBankCheck = NumberConstant.ZERO;
  numberOfSettlementToAddInBankDraft = NumberConstant.ZERO;

  public columnsConfig: ColumnSettings[] = [
    {
      field: TreasuryConstant.REFERENCE,
      title: TreasuryConstant.REFERENCE_OF_PAYMENT_SLIP_TITLE,
      tooltip: TreasuryConstant.REFERENCE_PAYMENT_SLIP,
      filterable: true
    },
    {
      field: TreasuryConstant.DATE,
      title: TreasuryConstant.DEPOSIT_DATE,
      tooltip: TreasuryConstant.DEPOSIT_DATE,
      filterable: true
    },
    {
      field: TreasuryConstant.ID_BANKACCOUNT_NAVIGATION_ID_BANK_NAVIGATION_NAME,
      title: TreasuryConstant.BANK_TITLE,
      tooltip: TreasuryConstant.BANK_FROM_BANK_ACCOUNT,
      filterable: true
    },
    {
      field: TreasuryConstant.AGENCY,
      title: TreasuryConstant.AGENCY_TITLE,
      tooltip: TreasuryConstant.NAME_AGENCY_TITLE,
      filterable: true
    },
    {
      field: TreasuryConstant.TOTAL_AMOUNT_WITH_NUMBERS,
      title: TreasuryConstant.TOTAL_AMOUNT_UPPERCASE,
      tooltip: TreasuryConstant.TOTAL_AMOUNT_UPPERCASE,
      filterable: true
    },
    {
      field: TreasuryConstant.STATE,
      title: TreasuryConstant.STATE.toUpperCase(),
      tooltip: TreasuryConstant.STATE_PAYMENT_SLIP,
      filterable: true
    }
  ];

  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };

  public paymentSlip;
  /**
   * quick search predicate
   */
  public predicateQuickSearch: PredicateFormat;
  public predicateSlips;
  @Input() isClickedSearch;
  @Input() isClickedReset;
  @Input() isActiveTab;

  // Permissions
  public hasDeletePaymentSlip : boolean;
  public haveAddPaymentSlipPermission = false ;
  public haveUpdatePaymentSlipPermission = false ;
  public haveShowPaymentSlipPermission : boolean;

  constructor(public paymentSlipService: PaymentSlipService,
              private deadLineDocumentService: DeadLineDocumentService,
              public companyService: CompanyService,
              private router: Router, private translateService: TranslateService,
              private swalWarrings: SwalWarring,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.haveAddPaymentSlipPermission = this.authService.hasAuthority(PermissionConstant.TreasuryPermissions.ADD_TREASURY_BANK_SLIP)
    this.haveUpdatePaymentSlipPermission = this.authService.hasAuthority(PermissionConstant.TreasuryPermissions.UPDATE_TREASURY_BANK_SLIP)
    this.hasDeletePaymentSlip = this.authService.hasAuthority(PermissionConstant.TreasuryPermissions.DELETE_TREASURY_BANK_SLIP)
    this.haveShowPaymentSlipPermission = this.authService.hasAuthority(PermissionConstant.TreasuryPermissions.SHOW_TREASURY_BANK_SLIP);
    this.companyService.getCurrentCompany().subscribe(company => {
      this.currencyCode = company.IdCurrencyNavigation.Code;
    });
    this.predicateQuickSearch = this.preparePredicate();
    this.initGridDataSource(false);
    this.getSettlementNumberToAddInBankCheck();
  }

  public initGridDataSource(isQuickSearch?: boolean): void {
    this.setPredicateFiltre(isQuickSearch);
    if (isNotNullOrUndefinedAndNotEmptyValue(this.isActiveTab)) {
      this.getDataWithSpecificFilter();
    }
  }

  public getDataWithSpecificFilter() {
    this.paymentSlipService.reloadServerSideDataWithListPredicate(this.gridSettings.state, this.predicateSlips,
      SharedConstant.GET_DATA_WITH_SPECIFIC_FILTER).subscribe(result => {
      this.gridSettings.gridData = result;
    });
  }

  public getSettlementNumberToAddInBankCheck() {
    this.deadLineDocumentService.getSettlementNumberToAddInBankCheck(this.paymentMethod).subscribe((result) => {
      if (this.paymentMethod === this.paymentEnum.BankCheck) {
        this.numberOfSettlementToAddInBankCheck = result;
        this.totalSettlementNumberToAddEmitter.emit(this.numberOfSettlementToAddInBankCheck);
      } else if (this.paymentMethod === this.paymentEnum.DraftBank) {
        this.numberOfSettlementToAddInBankDraft = result;
        this.totalSettlementNumberToAddEmitter.emit(this.numberOfSettlementToAddInBankDraft);
      }
    });
  }

  public preparePredicate(predicate?: PredicateFormat, isResetClick?: boolean): PredicateFormat {
    let myPredicate;
    if (predicate && predicate.Filter) {
      myPredicate = predicate;
      const indexType = this.getIndexTypeFilter(predicate);
      if (indexType >= NumberConstant.ZERO) {
        myPredicate.Filter.splice(indexType, NumberConstant.ONE);
      }
    } else {
      myPredicate = new PredicateFormat();
      myPredicate.Filter = new Array<Filter>();
    }
    if (isResetClick && !this.isActiveTab && this.paymentMethod === PaymentMethodEnumerator.BankCheck) {
      this.paymentMethod = PaymentMethodEnumerator.DraftBank;
    }
    myPredicate.Filter.push(new Filter(TreasuryConstant.SETTLEMENT_TYPE, Operation.eq, this.paymentMethod, false, false));
    myPredicate.Relation = new Array<Relation>();
    myPredicate.Relation.push(new Relation(TreasuryConstant.ID_BANK_ACCOUNT_NAVIGATION));
    myPredicate.Relation.push(new Relation(TreasuryConstant.ID_BANK_ACCOUNT_NAVIGATION_ID_BANK_NAVIGATION));
    myPredicate.OrderBy = new Array<OrderBy>();
    myPredicate.OrderBy.push(new OrderBy(TreasuryConstant.ID, OrderByDirection.desc));
    return myPredicate;
  }

  public getIndexTypeFilter(predicate: PredicateFormat) {
    return predicate.Filter.findIndex(filter => filter.prop === TreasuryConstant.SETTLEMENT_TYPE);
  }

  /**
   * dataStateChange
   * @param state
   */
  public dataStateChange(state: State): void {
    this.gridSettings.state = state;
    this.initGridDataSource(false);
  }

  public removeHandler(dataItem) {
    this.swalWarrings.CreateSwal(TreasuryConstant.DELETE_PAYMENT_TEXTE_SLIP, TreasuryConstant.DELETE_PAYMENT_TITLE_SLIP).then((result) => {
      if (result.value) {
        this.paymentSlipService.remove(dataItem).subscribe(() => {
          this.initGridDataSource(false);
          this.getSettlementNumberToAddInBankCheck();
        });
      }
    });
  }

  public generatePaymentSlip(): void {
    if (this.paymentMethod === PaymentMethodEnumerator.BankCheck) {
      this.router.navigateByUrl(TreasuryConstant.ADD_CHECK_PATH);
    } else if (this.paymentMethod === PaymentMethodEnumerator.DraftBank) {
      this.router.navigateByUrl(TreasuryConstant.ADD_DRAFT_PATH);
    }
  }

  public filter() {
    this.predicateQuickSearch = this.preparePredicate();
    this.predicateQuickSearch.Filter.push(new Filter(TreasuryConstant.REFERENCE, Operation.contains, this.paymentSlip, false, true));
    this.predicateQuickSearch.Filter.push(new Filter(TreasuryConstant.ID_BANKACCOUNT_NAVIGATION_ID_BANK_NAVIGATION_NAME, Operation.contains, this.paymentSlip, true, true));
    this.predicateQuickSearch.Filter.push(new Filter(TreasuryConstant.AGENCY, Operation.contains, this.paymentSlip, false, true));
    this.predicateQuickSearch.Filter.push(new Filter(TreasuryConstant.TOTAL_AMOUNT_WITH_NUMBERS, Operation.contains, this.paymentSlip, false, true));
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.initGridDataSource(true);
  }


  goToAdvancedEdit(dataItem) {
    if (this.paymentMethod === this.paymentEnum.BankCheck) {
      this.router.navigateByUrl(TreasuryConstant.CHECK_EDIT_URL.concat(dataItem.Id).concat('/').concat(dataItem.State));
    } else if (this.paymentMethod === this.paymentEnum.DraftBank) {
      this.router.navigateByUrl(TreasuryConstant.DRAFT_EDIT_URL.concat(dataItem.Id).concat('/').concat(dataItem.State));
    }
  }

  private setPredicateFiltre(isQuickSearch) {
    this.predicateSlips = [];
    if (isUndefined(isQuickSearch)) {
      this.predicateSlips.push(this.preparePredicate());
    } else if (isQuickSearch) {
      this.predicateSlips.push(this.predicateQuickSearch);
    } else if (isQuickSearch === false) {
      this.predicateAdvancedSearch = this.preparePredicate(this.predicateAdvancedSearch);
      this.predicateAdvancedSearch.Operator = Operator.and;
      this.gridState.filter.logic = SharedConstant.LOGIC_AND;
      this.gridSettings.state.filter.logic = SharedConstant.LOGIC_AND;
      this.predicateSlips.push(this.predicateAdvancedSearch);
    }
  }

  resetDataDraft(isResetClick: boolean) {
    this.predicateSlips[NumberConstant.ZERO] = this.preparePredicate(undefined, isResetClick);
    this.getDataWithSpecificFilter();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.isClickedSearch &&
      changes.isClickedSearch.previousValue !== changes.isClickedSearch.currentValue) {
      this.initGridDataSource(false);
    }

    if (changes.isActiveTab && isUndefined(changes.isClickedReset)) {
      this.initGridDataSource();
    }
    if (!changes.isActiveTab && changes.isClickedReset &&
      changes.isClickedReset.previousValue !== changes.isClickedReset.currentValue) {
      this.resetDataDraft(true);
    }
  }
}
