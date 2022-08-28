import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Filter, Operation, OrderBy, PredicateFormat, Relation} from '../../../shared/utils/predicate';
import {UserConstant} from '../../../constant/Administration/user.constant';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {EmployeeConstant} from '../../../constant/payroll/employee.constant';
import {isNotNullOrUndefinedAndNotEmptyValue} from '../../../stark-permissions/utils/utils';

@Component({
  selector: 'app-search-user',
  templateUrl: './search-user.component.html',
  styleUrls: ['./search-user.component.scss']
})
export class SearchUserComponent {
  @Input() type: string;
  @Input() isBToB: boolean;
  /**
   * Predicate to filter on the list of employees
   */
  predicate: PredicateFormat;
  /**
   * The value of the desired registration number
   */
  public value: string;

  // the sender of the data to the parent
  @Output() sendData = new EventEmitter<any>();

  constructor() {
  }

  /**
   * Construct the predicate for filter the employee list and send it to the list employee component
   * @param searchTheme
   */
  public filter() {
    this.predicate = new PredicateFormat();
    this.predicate.Filter = new Array<Filter>();
    this.filterListUser();
  }

  private filterListUser() {
    if (this.value) {
      this.value = this.value ? this.value.replace(/\s+/g, SharedConstant.BLANK_SPACE) : this.value;
      this.predicate.Filter.push(new Filter(EmployeeConstant.FULL_NAME, Operation.contains, this.value, false, true));
      this.predicate.Filter.push(new Filter(UserConstant.FIRST_NAME_FIELD, Operation.contains, this.value, false, true));
      this.predicate.Filter.push(new Filter(UserConstant.LAST_NAME_FIELD, Operation.contains, this.value, false, true));
      this.predicate.Filter.push(new Filter(UserConstant.EMAIL_FIELD, Operation.contains, this.value, false, true));
      this.addFilterByTier();
    }
    this.predicate.Filter.push(new Filter(UserConstant.IS_BTOB, this.isBToB ? Operation.eq : Operation.neq, true));
    this.sendData.emit({'predicate': this.predicate});
  }

  private addFilterByTier() {
    if (isNotNullOrUndefinedAndNotEmptyValue(this.predicate.Filter) && this.isBToB) {
      this.predicate.Filter.push(new Filter(UserConstant.CUSTOMER_ID, Operation.isnotnull));
      this.predicate.Filter.push(new Filter(UserConstant.CUSTOMER, Operation.contains, this.value, false, true));
    }
  }
}
