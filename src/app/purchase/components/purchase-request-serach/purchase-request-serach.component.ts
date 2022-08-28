import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PurchaseRequestConstant } from '../../../constant/purchase/purchase-request.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { Filter, Operation, PredicateFormat, Relation, SpecFilter } from '../../../shared/utils/predicate';

@Component({
  selector: 'app-purchase-request-serach',
  templateUrl: './purchase-request-serach.component.html',
  styleUrls: ['./purchase-request-serach.component.scss']
})
export class PurchaseRequestSerachComponent implements OnInit {
  // the sender of the data to the parent
  @Output() sendData = new EventEmitter<PredicateFormat>();
  /**
   * place holder search input
   */
  public searchPlaceHolder: string;
  /**
   * searched value
   */
  public searchValue = '';

  filter() {
    const myPredicate = PredicateFormat.preparePurchaseRequestDocumentPredicateWithSpecificFiltre();
    myPredicate.Filter.push(new Filter(PurchaseRequestConstant.CODE, Operation.contains, this.searchValue, false, true));
    myPredicate.Filter.push(new Filter(PurchaseRequestConstant.ID_CREATOR_NAVIGATION_FULLNAME, Operation.contains, this.searchValue, false, true));
    myPredicate.Filter.push(new Filter(PurchaseRequestConstant.ID_VALIDATOR_NAVIGATION_FULLNAME, Operation.contains, this.searchValue));
    myPredicate.Relation.push(new Relation(PurchaseRequestConstant.DOCUMENT_LINE));
    /**
     * item specific filtre
     */
    const itemPredicate = new PredicateFormat();
    itemPredicate.Filter = new Array<Filter>();
    itemPredicate.Filter.push(new Filter(PurchaseRequestConstant.ID_ITEM_NAVIGATION_DESCREPTION, Operation.contains, this.searchValue, false, true));
    const itemSpecFilter = new SpecFilter(SharedConstant.SALES_MODULE, PurchaseRequestConstant.DOCUMENT_LINE, PurchaseRequestConstant.ID_DOCUMENT, itemPredicate);
    myPredicate.SpecFilter.push(itemSpecFilter);
    this.sendData.emit(myPredicate);
  }

  constructor() {
  }

  ngOnInit() {
  }

}
