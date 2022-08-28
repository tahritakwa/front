import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ItemConstant } from '../../constant/inventory/item.constant';
import { Filter, Operation, Operator, PredicateFormat } from '../../shared/utils/predicate';

@Component({
  selector: 'app-search-expense',
  templateUrl: './search-expense.component.html',
  styleUrls: ['./search-expense.component.scss']
})
export class SearchExpenseComponent implements OnInit {
  @Output() sendPredicate = new EventEmitter<any>();
  public itemSearchValue: string;
  quickPredicate: PredicateFormat;
  constructor() { }

  ngOnInit() {
  }
  public filter() {
    /**
     * item predicate contains filter list
     * Operator OR
     */
    const itemPredicate = new PredicateFormat();
    itemPredicate.Operator = Operator.or;
    itemPredicate.Filter = new Array<Filter>();
    itemPredicate.Filter.push(new Filter(ItemConstant.DESCRIPTION, Operation.contains, this.itemSearchValue, false, true));
    itemPredicate.Filter.push(new Filter(ItemConstant.CODE, Operation.contains, this.itemSearchValue, false, true));
    this.quickPredicate = itemPredicate;
    this.sendPredicate.emit({ 'searchValue': this.itemSearchValue });
  }
}
