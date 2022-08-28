import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ItemConstant } from '../../../constant/inventory/item.constant';
import { Filter, Operation, Operator, PredicateFormat } from '../../../shared/utils/predicate';

@Component({
  selector: 'app-quick-search-item',
  templateUrl: './quick-search-item.component.html',
  styleUrls: ['./quick-search-item.component.scss']
})
export class QuickSearchItemComponent implements OnInit {

  public itemSearchValue: string;
  // the sender of the data to the parent
  @Output() sendData = new EventEmitter<any>();
  @Output() sendPredicate = new EventEmitter<any>();
  @Input() valueToFind: string;
  @Input() disabled: boolean;
  quickPredicate: PredicateFormat;
  constructor() { }

  ngOnInit() {
    if (this.valueToFind) {
      this.itemSearchValue = this.valueToFind;
      this.filter();
    }
  }
  public filter() {
    /**
     * item predicate contains filter list
     * Operator OR
     */
    const itemPredicate = new PredicateFormat();
    itemPredicate.Filter = new Array<Filter>();
    itemPredicate.Filter.push(new Filter(ItemConstant.DESCRIPTION, Operation.contains, this.itemSearchValue, false, true));
    itemPredicate.Filter.push(new Filter(ItemConstant.CODE, Operation.contains, this.itemSearchValue, false, true));
    this.quickPredicate = itemPredicate;
    this.sendPredicate.emit({ 'itemSearchValue': this.itemSearchValue });
    this.sendData.emit(this.itemSearchValue);
  }

}
