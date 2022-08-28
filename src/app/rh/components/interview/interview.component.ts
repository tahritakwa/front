import { Component, OnInit, Input } from '@angular/core';
import { Interview } from '../../../models/rh/interview.model';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { InterviewMarkService } from '../../services/interview-mark/interview-mark.service';
import { InterviewMark } from '../../../models/rh/interview-mark.model';
import { PredicateFormat, Filter, Operation, Relation } from '../../../shared/utils/predicate';
import { InterviewConstant } from '../../../constant/rh/interview.constant';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-interview',
  templateUrl: './interview.component.html',
  styleUrls: ['./interview.component.scss']
})
export class InterviewComponent implements OnInit {
  @Input() interview: Interview;
  @Input() index: number;

  public formatDate = this.translate.instant(SharedConstant.DATE_FORMAT);
  constructor(private interviewMarkService: InterviewMarkService, private translate: TranslateService) { }

  ngOnInit() {
    this.initInterviewMark();
  }

  initInterviewMark() {

    this.interviewMarkService.callPredicateData(this.prepareInterviewMarkPradicate(),
      SharedConstant.GET_DATA_SOURCE_PREDICATE_AS_NO_TRACKING).subscribe(result => {
      this.interview.InterviewMark = result as Array<InterviewMark>;

    });

  }

  prepareInterviewMarkPradicate() {
    const myPredicate = new PredicateFormat();

    myPredicate.Filter = new Array<Filter>();
    myPredicate.Filter.push(new Filter(InterviewConstant.ID_INTERVIEW, Operation.eq, this.interview.Id));

    myPredicate.Relation = new Array<Relation>();
    myPredicate.Relation.push.apply(myPredicate.Relation,
      [new Relation(InterviewConstant.ID_EMPLOYEE_NAVIGATION)]);

    return myPredicate;
  }
}
