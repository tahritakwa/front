import {Component, OnInit, OnDestroy, Input, Output, EventEmitter} from '@angular/core';
import {FormGroup, FormBuilder} from '@angular/forms';
import {Filter, Operation, PredicateFormat, OrderBy, Relation, OrderByDirection, SpecFilter} from '../../../shared/utils/predicate';
import {ItemService} from '../../../inventory/services/item/item.service';
import {ListClaimComponent} from '../../claim/list-claim/list-claim.component';
import {DocumentFormService} from '../../../shared/services/document/document-grid.service';
import {ClaimConstant} from '../../../constant/helpdesk/claim.constant';
import {isNullOrUndefined} from 'util';
import {PeriodConstant} from '../../../constant/Administration/period.constant';
import {FiltrePredicateModel} from '../../../models/shared/filtrePredicate.model';
import {FieldTypeConstant} from '../../../constant/shared/fieldType.constant';

@Component({
  selector: 'app-claim-search-item',
  templateUrl: './claim-search-item.component.html',
  styleUrls: ['./claim-search-item.component.scss']
})
export class ClaimSearchItemComponent implements OnInit, OnDestroy {


  public searchValue: string;
  @Input() predicate: PredicateFormat;
  @Output() sendData = new EventEmitter<any>();

  constructor() {
  }

  ngOnInit(): void {
  }

  public filter() {
    this.predicate.Filter = new Array<Filter>();
    // Filter by Item description
    this.predicate.Filter.push(new Filter(ClaimConstant.ID_ITEM_NAVIGATION_DESCRIPTION_FIELD, Operation.contains,
      this.searchValue, false, true));
    // Filter by Item Code
    this.predicate.Filter.push(new Filter(ClaimConstant.ID_ITEM_NAVIGATION_CODE_FIELD, Operation.contains,
      this.searchValue, false, true));
    // Filter by Code
    this.predicate.Filter.push(new Filter(ClaimConstant.CODE_FIELD, Operation.contains,
      this.searchValue, false, true));
    // Filter by Type
    this.predicate.Filter.push(new Filter(ClaimConstant.ID_CLAIM_TYPE_FIELD, Operation.contains,
      this.searchValue, false, true));
    // Filter by Supplier
    this.predicate.Filter.push(new Filter(ClaimConstant.SUPPLIER_FIELD, Operation.contains,
      this.searchValue, false, true));
    // Filter by Client
    this.predicate.Filter.push(new Filter(ClaimConstant.CLIENT_FIELD, Operation.contains,
      this.searchValue, false, true));
    // Filter by Status
    this.predicate.Filter.push(new Filter(ClaimConstant.ID_CLAIM_STATUS_LABEL_FIELD, Operation.contains,
      this.searchValue, false, true));
    // Filter by warehouse
    this.predicate.Filter.push(new Filter(ClaimConstant.ID_WAREHOUSE_FIELD, Operation.contains,
      this.searchValue, false, true));
    // Send Data to list
    this.sendData.emit(this.predicate);
  }

  ngOnDestroy(): void {
  }

}
