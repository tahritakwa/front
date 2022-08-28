import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Filter, Operation, PredicateFormat} from '../../../shared/utils/predicate';
import {UserConstant} from '../../../constant/Administration/user.constant';
import {SharedConstant} from '../../../constant/shared/shared.constant';

@Component({
  selector: 'app-search-candidate',
  templateUrl: './search-candidate.component.html',
  styleUrls: ['./search-candidate.component.scss']
})
export class SearchCandidateComponent {
  @Input()
  type: string;
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
    this.filterListCandidate();
  }

  private filterListCandidate() {
    if (this.value) {
      this.value = this.value ? this.value.replace(/\s+/g, SharedConstant.BLANK_SPACE) : this.value;
      this.predicate.Filter.push(new Filter(UserConstant.FULL_NAME, Operation.contains, this.value, false, true));
      this.predicate.Filter.push(new Filter(UserConstant.FIRST_NAME_FIELD, Operation.contains, this.value, false, true));
      this.predicate.Filter.push(new Filter(UserConstant.LAST_NAME_FIELD, Operation.contains, this.value, false, true));
      this.predicate.Filter.push(new Filter(UserConstant.EMAIL_FIELD, Operation.contains, this.value, false, true));
    }
    this.sendData.emit({'predicate': this.predicate});
  }

}
