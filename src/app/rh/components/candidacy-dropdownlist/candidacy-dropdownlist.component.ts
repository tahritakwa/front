import {Component, Input, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {CandidacyService} from '../../services/candidacy/candidacy.service';
import {Filter, Operation, OrderBy, OrderByDirection, PredicateFormat, Relation} from '../../../shared/utils/predicate';
import {InterviewConstant} from '../../../constant/rh/interview.constant';
import {ReducedCandidacy} from '../../../models/rh/reduced-candidacy.model';
import {CandidacyConstant} from '../../../constant/rh/candidacy.constant';

@Component({
  selector: 'app-candidacy-dropdownlist',
  templateUrl: './candidacy-dropdownlist.component.html',
  styleUrls: ['./candidacy-dropdownlist.component.scss']
})
export class CandidacyDropdownlistComponent implements OnInit {

  @Input() group;
  @Input() allowCustom;
  @Input() recruitmentId;
  @Input() minStep;
  @Input() disabled;
  candidacyDataSource: ReducedCandidacy[];
  candidacyFiltredDataSource: ReducedCandidacy[];

  constructor(private candidacyService: CandidacyService) {
  }

  get IdCandidacy(): FormControl {
    return this.group.get(InterviewConstant.ID_CANDIDACY) as FormControl;
  }

  ngOnInit() {
    this.initDataSource();
  }

  initDataSource(): void {
    this.candidacyService.readDropdownPredicateData(this.preparePredicate()).subscribe(data => {
      this.candidacyDataSource = data;
      this.candidacyFiltredDataSource = this.candidacyDataSource;
    });
  }

  preparePredicate(): PredicateFormat {
    let myPredicate = new PredicateFormat();
    myPredicate.Filter = new Array<Filter>();

    if (this.recruitmentId) {
      myPredicate.Filter.push(new Filter(InterviewConstant.ID_RECRUITMENT, Operation.eq, this.recruitmentId));
    }
    if (this.minStep) {
      myPredicate.Filter.push(new Filter(InterviewConstant.STATE, Operation.gte, this.minStep));
    }
    myPredicate.Filter.push(new Filter(CandidacyConstant.ID_CANDIDATE_NAVIGATION_ID_EMPLOYEE_NAVIGATION, Operation.eq, null));
    myPredicate.Relation = new Array<Relation>();
    myPredicate.Relation.push.apply(myPredicate.Relation,
      [new Relation(InterviewConstant.ID_CANDIDATE_NAVIGATION)]);

    myPredicate.OrderBy = new Array<OrderBy>();
    myPredicate.OrderBy.push.apply(myPredicate.OrderBy,
      [new OrderBy(InterviewConstant.CANDIDATE_IS_FULLNAME, OrderByDirection.asc)]);

    return myPredicate;
  }

  addNew(): void {
    throw new Error('Method not implemented.');
  }

}
