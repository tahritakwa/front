import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Filter, Operation, PredicateFormat} from '../../../shared/utils/predicate';
import {RoleConfigConstant} from '../../../constant/Administration/role-config.constant';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {DataSourceRequestState} from '@progress/kendo-data-query';
import {SharedConstant} from '../../../constant/shared/shared.constant';

@Component({
  selector: 'app-search-role-config',
  templateUrl: './search-role-config.component.html',
  styleUrls: ['./search-role-config.component.scss']
})
export class SearchRoleConfigComponent implements OnInit {

  public searchValue : string;
  @Input() predicate : PredicateFormat;
  @Input() state : DataSourceRequestState;
  @Output() sendPredicate = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
  }

  public search() {
    this.predicate = this.predicate ? this.predicate : new PredicateFormat();
    this.predicate.Filter = new Array<Filter>();
    this.state.skip = NumberConstant.ZERO;
    this.predicate.Filter.push(new Filter(RoleConfigConstant.CODE, Operation.contains, this.searchValue));
    this.predicate.Filter.push(new Filter(SharedConstant.LABEL, Operation.contains, this.searchValue));
    this.sendPredicate.emit(this.searchValue);
  }
}
