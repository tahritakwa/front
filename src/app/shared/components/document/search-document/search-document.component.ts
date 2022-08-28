import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {KeyboardConst} from '../../../../constant/keyboard/keyboard.constant';
import {Filter, Operation, OrderBy, OrderByDirection, PredicateFormat, Relation} from '../../../utils/predicate';
import {DocumentConstant} from '../../../../constant/sales/document.constant';

@Component({
  selector: 'app-search-document',
  templateUrl: './search-document.component.html',
  styleUrls: ['./search-document.component.scss']
})
export class SearchDocumentComponent implements OnInit {

  /**
   * Decorator to emit filtre object to the parent component
   */
  @Output() public sendData = new EventEmitter<any>();
  /**
   * filtre search value
   */
  public documentSearch: string;

  constructor() {
  }

  /**
   * @param event
   */
  @HostListener('window:keyup', ['$event'])
  keyEvent(event) {
    if (event.key === KeyboardConst.ENTER) {
      this.filter();
    }
  }

  filter() {
    const documentPredicate = new PredicateFormat();
    documentPredicate.Filter = new Array<Filter>();
    documentPredicate.Filter.push(new Filter(DocumentConstant.ID_TIER_NAVIGATION_NAME, Operation.contains, this.documentSearch, false, true));
    documentPredicate.Filter.push(new Filter(DocumentConstant.CODE, Operation.contains, this.documentSearch, false, true));
    documentPredicate.Filter.push(new Filter(DocumentConstant.DOCUMENT_TTC_PRICE_WITH_CURRENCY, Operation.contains, this.documentSearch, false, true));
    documentPredicate.Filter.push(new Filter(DocumentConstant.DOCUMENT_HT_PRICE_WITH_CURRENCY, Operation.contains, this.documentSearch, false, true));
    documentPredicate.Filter.push(new Filter(DocumentConstant.VALIDATOR_NAME, Operation.contains, this.documentSearch, false, true));
    documentPredicate.OrderBy = new Array<OrderBy>();
    documentPredicate.OrderBy.push.apply(documentPredicate.OrderBy, [new OrderBy(DocumentConstant.ID, OrderByDirection.desc)]);
    documentPredicate.Relation = new Array<Relation>();
    documentPredicate.Relation.push.apply(documentPredicate.Relation, [new Relation(DocumentConstant.ID_DOCUMENT_STATUS_NAVIGATION),
      new Relation(DocumentConstant.ID_TIER_NAVIGATION), new Relation(DocumentConstant.ID_CREATOR_NAVIGATION)]);
    this.sendData.emit({'predicate': documentPredicate});
  }

  ngOnInit() {
  }

}
