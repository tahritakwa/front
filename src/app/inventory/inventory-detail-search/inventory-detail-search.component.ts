import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Filter, Operation, PredicateFormat} from '../../shared/utils/predicate';
import {PeriodConstant} from '../../constant/Administration/period.constant';
import {StockDocumentConstant} from '../../constant/inventory/stock-document.constant';

@Component({
  selector: 'app-inventory-detail-search',
  templateUrl: './inventory-detail-search.component.html',
  styleUrls: ['./inventory-detail-search.component.scss']
})
export class InventoryDetailSearchComponent implements OnInit {
  inventory: string;

  predicate: PredicateFormat;

  // the sender of the data to the parent
  @Output() sendData = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
  }

  public filter() {
    this.predicate = new PredicateFormat();
    this.predicate.Filter = new Array<Filter>();
    this.predicate.Filter.push(new Filter(StockDocumentConstant.ID_ITEM_NAVIGATION_CODE_FIELD, Operation.contains, this.inventory, false, true));
    this.predicate.Filter.push(new Filter(StockDocumentConstant.ID_ITEM_NAVIGATION_DESCRIPTION_FIELD, Operation.contains, this.inventory, false, true));
    this.predicate.Filter.push(new Filter(StockDocumentConstant.SHELF_FIELD, Operation.contains, this.inventory, false, true));
    this.sendData.emit(this.predicate);
  }
}
