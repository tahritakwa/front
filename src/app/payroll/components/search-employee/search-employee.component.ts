import {Component, EventEmitter, Output} from '@angular/core';
import {Filter, Operation, Operator, PredicateFormat} from '../../../shared/utils/predicate';
import {EmployeeConstant} from '../../../constant/payroll/employee.constant';

@Component({
  selector: 'app-search-employee',
  templateUrl: './search-employee.component.html',
  styleUrls: ['./search-employee.component.scss']
})
export class SearchEmployeeComponent {
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

  /**
   * Constructor
   * @param listEmployeeComponen
   */
  constructor() {
  }

  /**
   * Construct the predicate for filter the employee list and send it to the list employee component
   * @param searchTheme
   */
  public filter() {
    this.predicate = new PredicateFormat();
    this.predicate.Filter = new Array<Filter>();
    this.filterListEmployee();
  }

  /**
   * Filter the employee list on the value entered by the user
   * Used on list employee UI
   */
  private filterListEmployee() {
    // Search theme is Matricule and Matricule value is not undefined
    if (this.value) {
      // Reduce all successive spacing characters to one
      this.value = this.value ? this.value.replace(/\s+/g, ' ') : this.value;
      // Filter by contain of the full name or Firstname or Lastname or email or Reverse full name
      this.predicate.Filter.push(new Filter(EmployeeConstant.FULL_NAME, Operation.contains, this.value, false, true));
      this.predicate.Filter.push(new Filter(EmployeeConstant.FIRST_NAME, Operation.contains, this.value, false, true));
      this.predicate.Filter.push(new Filter(EmployeeConstant.LAST_NAME, Operation.contains, this.value, false, true));
      this.predicate.Filter.push(new Filter(EmployeeConstant.EMAIL, Operation.contains, this.value, false, true));
      this.predicate.Filter.push(new Filter(EmployeeConstant.REVERSE_FULL_NAME, Operation.contains, this.value, false, true));
      // Filter by equality of the matricule
      this.predicate.Filter.push(new Filter(EmployeeConstant.REGISTRATION_NUMBER, Operation.eq, this.value, false, true));
      this.predicate.Operator = Operator.or;
    }
    // Send the predicate to the list employee component
    this.sendData.emit({'predicate': this.predicate});
  }
}
