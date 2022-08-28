import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Filter, Operation, PredicateFormat} from '../../../shared/utils/predicate';
import {TeamConstant} from '../../../constant/payroll/team.constant';
import {Employee} from '../../../models/payroll/employee.model';

@Component({
  selector: 'app-search-team',
  templateUrl: './search-team.component.html',
  styleUrls: ['./search-team.component.scss']
})
export class SearchTeamComponent {
  @Input() teamMembers: Array<Employee>;
  /**
   * The value of the desired registration number
   */
  public value: string;
  public searchValue: string;
  @Input() predicate: PredicateFormat;
  @Output() sendData = new EventEmitter<any>();
  constructor() {
  }

  public filter() {
    this.predicate.Filter = new Array<Filter>();
    // Filter by Item description
    this.predicate.Filter.push(new Filter(TeamConstant.NAME, Operation.contains,
      this.searchValue, false, true));
    // Filter by Item Code
    this.predicate.Filter.push(new Filter(TeamConstant.ID_NAVIGATION_MANAGER_FULLNAME, Operation.contains,
      this.searchValue, false, true));
    // Filter by Code
    this.predicate.Filter.push(new Filter(TeamConstant.CREATION_DATE, Operation.contains,
      this.searchValue, false, true));
    // Filter by Type
    this.predicate.Filter.push(new Filter(TeamConstant.STATUS, Operation.contains,
      this.searchValue, false, true));
    // Filter by Supplier
    this.predicate.Filter.push(new Filter(TeamConstant.ASSIGNED_NUMBER, Operation.contains,
      this.searchValue, false, true));
    this.sendData.emit(this.predicate);
  }

  ngOnDestroy(): void {
  }
}
