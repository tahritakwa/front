import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {TreasuryConstant} from '../../../constant/treasury/treasury.constant';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {TiersTypeEnumerator} from '../../../models/enumerators/tiers-type.enum';
import {ListCheckPaymentSlipComponent} from '../../payment-slip/check/list-check-payment-slip/list-check-payment-slip.component';
import {ListDraftPaymentSlipComponent} from '../../payment-slip/draft/list-draft-payment-slip/list-draft-payment-slip.component';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/pairwise';
import {FiltrePredicateModel} from '../../../models/shared/filtrePredicate.model';
import {FieldTypeConstant} from '../../../constant/shared/fieldType.constant';
import {StyleConstant} from '../../../constant/utility/style.constant';
import {isNullOrUndefined} from 'util';
import {Filter, Operator, OrderBy, OrderByDirection, PredicateFormat} from '../../../shared/utils/predicate';
import {isNotNullOrUndefinedAndNotEmptyValue} from '../../../stark-permissions/utils/utils';

@Component({
  selector: 'app-payment-slip-menu',
  templateUrl: './payment-slip-menu.component.html',
  styleUrls: ['./payment-slip-menu.component.scss']
})
export class PaymentSlipMenuComponent implements OnInit, AfterViewInit {

  @ViewChild(ListCheckPaymentSlipComponent) childListCheckPaymentSlip;
  @ViewChild(ListDraftPaymentSlipComponent) childListDraftPaymentSlip;
  @ViewChild('checkNav', {read: ElementRef}) public checkNav: ElementRef;
  @ViewChild('draftNav', {read: ElementRef}) public draftNav: ElementRef;
  @ViewChild('checkDiv', {read: ElementRef}) public checkDiv: ElementRef;
  @ViewChild('draftDiv', {read: ElementRef}) public draftDiv: ElementRef;

  @Input() tiersType;
  tiersTypeEnum = TiersTypeEnumerator;
  settlementTotalNumberToAddInBankCheck = 0;
  settlementTotalNumberToAddInBankDraft = 0;
  searchFormGroup: FormGroup;
  dateFormat = this.translateService.instant(SharedConstant.DATE_FORMAT);
  draftSelected = false;
  filtreFieldsColumns = [];
  filtreFieldsInputs = [];
  @Output() public searchClickEvent = new EventEmitter<boolean>();
  public predicateAdvancedSearch: PredicateFormat;
  public isClickedSearch = false;
  public isClickedReset = false;

  constructor(private fb: FormBuilder, private translateService: TranslateService,
              private renderer: Renderer2, private router: Router, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.subscribe(params => {
      this.draftSelected = params['draft'] > 0;
    });
  }

  ngOnInit() {
    this.initCustomersFiltreConfig();
    this.predicateAdvancedSearch = this.preparePredicate();
  }

  ngAfterViewInit() {
    if (this.draftSelected) {
      // Select draft nav
      this.renderer.setAttribute(this.draftNav.nativeElement, StyleConstant.ARIA_SELECTED, 'true');
      this.renderer.setAttribute(this.draftNav.nativeElement, StyleConstant.CLASS, 'nav-link nav-link-new active');
      this.renderer.setAttribute(this.draftDiv.nativeElement, StyleConstant.CLASS, 'tab-pane active pt-0 show');
      // deselect check nav
      this.renderer.setAttribute(this.checkNav.nativeElement, StyleConstant.ARIA_SELECTED, 'false');
      this.renderer.setAttribute(this.checkNav.nativeElement, StyleConstant.CLASS, 'nav-link nav-link-new');
      this.renderer.setAttribute(this.checkDiv.nativeElement, StyleConstant.CLASS, 'tab-pane pt-0');

    }
  }


  public changeStartDate() {
    if (this.StartDate.value && this.EndDate.value && this.StartDate.value > this.EndDate.value) {
      this.EndDate.setValue(this.StartDate.value);
    }
  }

  // Check if end date is less than start date
  public changeEndDate() {
    if (this.StartDate.value && this.EndDate.value && this.EndDate.value < this.StartDate.value) {
      this.StartDate.setValue(this.EndDate.value);
    }
  }

  filter() {
    this.childListCheckPaymentSlip.setSearchData(this.searchFormGroup);
    this.childListDraftPaymentSlip.setSearchData(this.searchFormGroup);
  }


  receiveSettlementTotalNumberToAddInBankCheck($event) {
    this.settlementTotalNumberToAddInBankCheck = $event;
  }

  receiveSettlementTotalNumberToAddInBankDraft($event) {
    this.settlementTotalNumberToAddInBankDraft = $event;
  }


  getAddCheckTooltipMessage() {
    if (this.settlementTotalNumberToAddInBankCheck > NumberConstant.ZERO) {
      let tooltipMessage = `${this.translateService.instant(TreasuryConstant.NUMBER_OF_CHECK_TO_ADD_IN_APYMENT_SLIP_MESSGAE)}`;
      tooltipMessage = tooltipMessage.replace('{' + TreasuryConstant.NUMBER_OF_CHECK.concat('}'),
        this.settlementTotalNumberToAddInBankCheck.toString());
      return tooltipMessage;
    } else {
      return this.translateService.instant(TreasuryConstant.NO_CHECK_TO_ADD_IN_APYMENT_SLIP_MESSGAE);
    }
  }

  getAddDraftTooltipMessage() {
    if (this.settlementTotalNumberToAddInBankDraft > NumberConstant.ZERO) {
      let tooltipMessage = `${this.translateService.instant(TreasuryConstant.NUMBER_OF_DRAFT_TO_ADD_IN_APYMENT_SLIP_MESSGAE)}`;
      tooltipMessage = tooltipMessage.replace('{' + TreasuryConstant.NUMBER_OF_DRAFT.concat('}'),
        this.settlementTotalNumberToAddInBankDraft.toString());
      return tooltipMessage;
    } else {
      return this.translateService.instant(TreasuryConstant.NO_DRAFT_TO_ADD_IN_APYMENT_SLIP_MESSGAE);
    }
  }

  /**
   * Get start date
   */
  get StartDate(): FormControl {
    return this.searchFormGroup.get(TreasuryConstant.START_DATE) as FormControl;
  }

  /**
   * Get end date
   */
  get EndDate(): FormControl {
    return this.searchFormGroup.get(TreasuryConstant.END_DATE) as FormControl;
  }

  public preparePredicate(): PredicateFormat {
    const myPredicate = new PredicateFormat();
    myPredicate.Filter = new Array<Filter>();
    myPredicate.OrderBy = new Array<OrderBy>();
    myPredicate.OrderBy.push(new OrderBy(TreasuryConstant.ID, OrderByDirection.desc));
    return myPredicate;
  }

  /**
   * get array<Filtre> from advancedSearchComponenet
   * remove old filter property from the predicate filter list
   * case filtre type date between
   * @param filtre
   */
  getFiltrePredicate(filtre) {
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

  /**
   * case filtre date between : we don't remove the old filtre date value
   * @param filtre
   * @private
   */
  private prepareFiltreFromAdvancedSearch(filtreFromAdvSearch) {
    this.predicateAdvancedSearch.Filter = this.predicateAdvancedSearch.Filter.filter(value => value.prop !== filtreFromAdvSearch.prop);
    if (filtreFromAdvSearch.isDateFiltreBetween) {
      this.prepareDatesFiltres(filtreFromAdvSearch);
    } else if (filtreFromAdvSearch.operation && !isNullOrUndefined(filtreFromAdvSearch.value) && !filtreFromAdvSearch.SpecificFiltre) {
      this.predicateAdvancedSearch.Filter.push(filtreFromAdvSearch);
    }
  }

  resetClickEvent() {
    this.predicateAdvancedSearch = this.preparePredicate();
    this.isClickedReset = !this.isClickedReset;
  }

  /**
   * load advancedSearch parameters config
   * @private
   */
  private initCustomersFiltreConfig() {
    this.filtreFieldsColumns.push(new FiltrePredicateModel(TreasuryConstant.REFERENCE_OF_PAYMENT_SLIP_TITLE, FieldTypeConstant.TEXT_TYPE, TreasuryConstant.REFERENCE));
    this.filtreFieldsColumns.push(new FiltrePredicateModel(TreasuryConstant.DEPOSIT_DATE, FieldTypeConstant.DATE_TYPE, TreasuryConstant.DATE));
    this.filtreFieldsColumns.push(new FiltrePredicateModel(TreasuryConstant.BANK_TITLE, FieldTypeConstant.bankDropdownComponent,
      TreasuryConstant.ID_BANK_FROM_ID_BANK_ACCOUNT_NAVIGATION));
    this.filtreFieldsInputs.push(new FiltrePredicateModel(TreasuryConstant.AGENCY_TITLE, FieldTypeConstant.TEXT_TYPE, TreasuryConstant.AGENCY));
    this.filtreFieldsInputs.push(new FiltrePredicateModel(TreasuryConstant.TOTAL_AMOUNT_UPPERCASE, FieldTypeConstant.numerictexbox_type, TreasuryConstant.TOTAL_AMOUNT_WITH_NUMBERS));
    this.filtreFieldsInputs.push(new FiltrePredicateModel(TreasuryConstant.STATE.toUpperCase(), FieldTypeConstant.paymentSlipStatusComponent,
      TreasuryConstant.STATE));
  }

  private prepareDatesFiltres(filtreFromAdvSearch) {
    if (isNotNullOrUndefinedAndNotEmptyValue(filtreFromAdvSearch.filtres[NumberConstant.ZERO].value)) {
      this.predicateAdvancedSearch.Filter.push(filtreFromAdvSearch.filtres[NumberConstant.ZERO]);
    }
    if (isNotNullOrUndefinedAndNotEmptyValue(filtreFromAdvSearch.filtres[NumberConstant.ONE].value)) {
      this.predicateAdvancedSearch.Filter.push(filtreFromAdvSearch.filtres[NumberConstant.ONE]);
    }
  }

  /**
   * identify the predicate operator AND|OR
   * @param operator
   */
  getOperatorPredicate(operator: Operator) {
    this.predicateAdvancedSearch.Operator = operator;
  }

  searchClick() {
    this.isClickedSearch = !this.isClickedSearch;
  }

  changeValueActiveTab(isDraftTabActif: boolean) {
    this.draftSelected = isDraftTabActif;
  }
}
