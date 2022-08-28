import { Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Filter, Operation, Operator, PredicateFormat, Relation, SpecFilter } from '../../utils/predicate';
import { KeyboardConst } from '../../../constant/keyboard/keyboard.constant';
import { TiersConstants } from '../../../constant/purchase/tiers.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';

@Component({
  selector: 'app-search-tiers',
  templateUrl: './search-tiers.component.html',
  styleUrls: ['./search-tiers.component.scss']
})
export class SearchTiersComponent implements OnChanges {

  @Input() type;
  @Input() isReduicedTiers = false;
  @Input() disabled;
  tiersString: string;
  // the sender of the data to the parent
  @Output() sendData = new EventEmitter<any>();
  /**
   * place holder search input
   */
  public searchPlaceHolder: string;

  /**
   * @param event
   */
  @HostListener('window:keyup', ['$event'])
  keyEvent(event) {
    if (event.key === KeyboardConst.ENTER) {
      this.filter();
    }
  }

  constructor() {
  }

  /**
   * Construct the predicate for filter the tiers list and send it to the list tiers component
   */
  public filter() {
    /**
     * tiers predicate contains filter list
     * Operator OR
     */
    const tiersPredicate = new PredicateFormat();

    tiersPredicate.Operator = Operator.or;
    tiersPredicate.Filter = new Array<Filter>();
    tiersPredicate.Filter.push(new Filter(TiersConstants.NAME, Operation.contains, this.tiersString, false, true));
    tiersPredicate.Filter.push(new Filter(TiersConstants.CODE_TIERS, Operation.contains, this.tiersString, false, true));

    if (this.isReduicedTiers) {

      tiersPredicate.Filter.push(new Filter(TiersConstants.ACTIVITY_SECTOR, Operation.contains, this.tiersString, false, true));
      tiersPredicate.Filter.push(new Filter(TiersConstants.ID_TAXEGROUP_TIERS_NAVIGATION_LABEL, Operation.contains, this.tiersString, false, true));
    } else {

      tiersPredicate.SpecFilter = new Array<SpecFilter>();
      tiersPredicate.SpecificRelation = new Array<string>();
      tiersPredicate.SpecificRelation.push(TiersConstants.COUNTRY_SPECIFIC_RELATION);
      tiersPredicate.SpecificRelation.push(TiersConstants.CITY_SPECIFIC_RELATION);
      /**
       * country specific filtre
       */
      const countryPredicate = new PredicateFormat();
      countryPredicate.Filter = new Array<Filter>();
      countryPredicate.Filter.push(new Filter(TiersConstants.COUNTRY_NAVIGATION_FIELD, Operation.contains, this.tiersString, false, false));
      const countrySpecFilter = new SpecFilter(SharedConstant.SHARED, TiersConstants.ADDRESS, TiersConstants.ID_TIERS, countryPredicate);
      tiersPredicate.SpecFilter.push(countrySpecFilter);
      /**
       * city specific filtre
       */
      const cityPredicate = new PredicateFormat();
      cityPredicate.Filter = new Array<Filter>();
      cityPredicate.Filter.push(new Filter(TiersConstants.CITY_NAVIGATION_FIELD, Operation.contains, this.tiersString, false, false));
      const citySpecFilter = new SpecFilter(SharedConstant.SHARED, TiersConstants.ADDRESS, TiersConstants.ID_TIERS, cityPredicate);
      tiersPredicate.SpecFilter.push(citySpecFilter);

      tiersPredicate.Filter.push(new Filter(TiersConstants.EMAIL, Operation.contains, this.tiersString, false, true));
      tiersPredicate.Filter.push(new Filter(TiersConstants.ID_TAXEGROUP_TIERS_NAVIGATION_LABEL
        , Operation.contains, this.tiersString, false, true));
      tiersPredicate.Filter.push(new Filter(TiersConstants.ID_CURRENCY_NAVIGATION_CODE
        , Operation.contains, this.tiersString, false, true));
      tiersPredicate.Relation = new Array<Relation>();
      tiersPredicate.Relation.push(new Relation(TiersConstants.ID_CURRENCY_NAVIGATION));
      tiersPredicate.Relation.push(new Relation(TiersConstants.ID_TAXEGROUP_TIERS_NAVIGATION));
      tiersPredicate.Relation.push(new Relation(TiersConstants.PHONE_NAVIGATION));

      if (Number(this.tiersString)) {
        tiersPredicate.Filter.push(new Filter(TiersConstants.PHONE_NAVIGATION_NUMBER
          , Operation.contains, Number(this.tiersString), false, true));
      }

    }

    this.sendData.emit({ 'predicate': tiersPredicate });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.searchPlaceHolder = this.type === NumberConstant.ONE ?
      TiersConstants.CUSTOMER_SEARCH : TiersConstants.SUPPLIER_SEARCH;
  }
}
