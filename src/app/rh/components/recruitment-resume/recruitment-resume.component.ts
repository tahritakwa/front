import { Component, OnInit, Input } from '@angular/core';
import { RecruitmentService } from '../../services/recruitment/recruitment.service';
import { Recruitment } from '../../../models/rh/recruitment.model';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { CandidacyService } from '../../services/candidacy/candidacy.service';
import { PredicateFormat, Filter, Operation } from '../../../shared/utils/predicate';
import { RecruitmentConstant } from '../../../constant/rh/recruitment.constant';
import { Candidacy } from '../../../models/rh/candidacy.model';
import { RecruitmentState } from '../../../models/enumerators/recruitment-state.enum';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-recruitment-resume',
  templateUrl: './recruitment-resume.component.html',
  styleUrls: ['./recruitment-resume.component.scss']
})
export class RecruitmentResumeComponent implements OnInit {
  @Input() recruitmentId: number;
  currentRecruitment: Recruitment;
  candidacyList: Candidacy[];
  candidacyNumber;
  recruitsNumber;

  public formatDate = this.translate.instant(SharedConstant.DATE_FORMAT);

  constructor(private recruitmentService: RecruitmentService, private candidacyService: CandidacyService, private translate: TranslateService) { }

  ngOnInit() {
    this.initDataOfResume();
  }

  initDataOfResume() {
    if (this.recruitmentId) {
      this.recruitmentService.getById(this.recruitmentId).subscribe(result => {
        this.currentRecruitment = result;
      });

      this.candidacyService.callPredicateData(this.preparePredicate()).subscribe((data) => {
        this.candidacyList = data;
        this.candidacyNumber = this.candidacyList.length;
        this.recruitsNumber = this.candidacyList.filter(c => c.State === RecruitmentState.Closed).length;
      });

    }
  }

  private preparePredicate(): PredicateFormat {
    const myPredicate = new PredicateFormat();
    myPredicate.Filter = new Array<Filter>();
    myPredicate.Filter.push(new Filter(RecruitmentConstant.CANDIDACY_ID_RECRUITMENT, Operation.eq, this.recruitmentId));
    return myPredicate;
  }

}
