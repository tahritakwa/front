import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Filter, Operation, OrderBy, OrderByDirection, PredicateFormat, Relation} from '../../../shared/utils/predicate';
import {StockDocumentConstant} from '../../../constant/inventory/stock-document.constant';

@Component({
  selector: 'app-search-shelf-and-storage',
  templateUrl: './search-shelf-and-storage.component.html',
  styleUrls: ['./search-shelf-and-storage.component.scss']
})
export class SearchShelfAndStorageComponent implements OnInit {
  public searchValue: string;
  // the sender of the data to the parent
  @Output() public sendData = new EventEmitter<PredicateFormat>();

  constructor() {
  }

  ngOnInit() {
  }

  public filter() {
    const myPredicate = new PredicateFormat();
    myPredicate.Filter = new Array<Filter>();
    myPredicate.Filter.push(new Filter(StockDocumentConstant.CODE_FIELD, Operation.contains, this.searchValue,
      false, true));
    myPredicate.Filter.push(new Filter(StockDocumentConstant.ID_WAREHOUSE_SOURCE_FIELD, Operation.contains, this.searchValue,
      false, true));
    myPredicate.Relation = new Array<Relation>();
    myPredicate.Relation.push(new Relation(StockDocumentConstant.ID_DOCUMENT_STATUS_NAVIGATION));
    myPredicate.Relation.push(new Relation(StockDocumentConstant.ID_WAREHOUSE_SOURCE_NAVIGATION));
    myPredicate.Relation.push(new Relation(StockDocumentConstant.ID_STORAGE_SOURCE_NAVIGATION));
    myPredicate.Relation.push(new Relation(StockDocumentConstant.ID_STORAGE_DESTINATION_NAVIGATION));
    myPredicate.OrderBy = new Array<OrderBy>();
    myPredicate.OrderBy.push.apply(myPredicate.OrderBy, [new OrderBy(StockDocumentConstant.ID, OrderByDirection.desc)]);
    this.sendData.emit(myPredicate);
  }

}
