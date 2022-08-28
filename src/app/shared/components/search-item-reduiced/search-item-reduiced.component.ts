import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { KeyboardConst } from '../../../constant/keyboard/keyboard.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { Filter, Operation, Operator, PredicateFormat } from '../../utils/predicate';

@Component({
  selector: 'app-search-item-reduiced',
  templateUrl: './search-item-reduiced.component.html',
  styleUrls: ['./search-item-reduiced.component.scss']
})
export class SearchItemReduicedComponent implements OnInit {

  @Output() sendData = new EventEmitter<any>();
  searchInput;
  /**
   * Construct the predicate for filter the tiers list and send it to the list tiers component
   * @param searchTheme
   */
  @HostListener('window:keyup', ['$event'])
  keyEvent(event) {
    if (event.key === KeyboardConst.ENTER) {
      this.filter();
    }
  }

  constructor() {
  }
  ngOnInit() {

  }


  public filter() {
    /**
     * tiers predicate contains filter list
     * Operator OR
     */
    const tiersPredicate = new PredicateFormat();

    tiersPredicate.Operator = Operator.or;
    tiersPredicate.Filter = new Array<Filter>();
    tiersPredicate.Filter.push(new Filter(SharedConstant.CODE, Operation.contains, this.searchInput, false, true));
    tiersPredicate.Filter.push(new Filter(SharedConstant.DESCRIPTION, Operation.contains, this.searchInput, false, true));
    tiersPredicate.Filter.push(new Filter(SharedConstant.TIERS_NAVIGATION_NAME, Operation.contains, this.searchInput, false, true));

    this.sendData.emit({ 'predicate': tiersPredicate });
  }

}
