import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { CandidacyConstant } from '../../../constant/rh/candidacy.constant';
import { RecruitmentConstant } from '../../../constant/rh/recruitment.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { RecruitmentState } from '../../../models/enumerators/recruitment-state.enum';
import { Candidacy } from '../../../models/rh/candidacy.model';
import { Recruitment } from '../../../models/rh/recruitment.model';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { EmailService } from '../../../shared/services/email/email.service';
import { Filter, Operation, OrderBy, OrderByDirection, PredicateFormat, Relation } from '../../../shared/utils/predicate';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { ListCandidacyComponent } from '../../candidacy/list-candidacy/list-candidacy.component';
import { ListEvaluationComponent } from '../../evaluation/list-evaluation/list-evaluation.component';
import { ListInterviewByRecruitmentComponent } from '../../interview/list-interview/list-interview-by-recruitment/list-interview-by-recruitment.component';
import { ListOfferByCandidacyComponent } from '../../offer/list-offer/list-offer-by-candidacy.component';
import { CandidacyService } from '../../services/candidacy/candidacy.service';
import { InterviewService } from '../../services/interview/interview.service';
import { RecruitmentService } from '../../services/recruitment/recruitment.service';
import { HiringComponent } from '../hiring/hiring.component';
import { PreSelectionComponent } from '../pre-selection/pre-selection.component';
import { RecruitmentResumeComponent } from '../recruitment-resume/recruitment-resume.component';
import { SelectionComponent } from '../selection/selection.component';

@Component({
  selector: 'app-candidacy-steper',
  templateUrl: './candidacy-steper.component.html',
  styleUrls: ['./candidacy-steper.component.scss']
})
export class CandidacySteperComponent implements OnInit, AfterViewInit {
  isLinear = true;
  @ViewChild('stepper') stepper: MatStepper;
  @ViewChild('candidacyViewChild') candidacyViewChild: ListCandidacyComponent;
  @ViewChild('preselectionViewChild') preselectionViewChild: PreSelectionComponent;
  @ViewChild('interviewViewChild') interviewViewChild: ListInterviewByRecruitmentComponent;
  @ViewChild('evaluationViewChild') evaluationViewChild: ListEvaluationComponent;
  @ViewChild('selectionViewChild') selectionViewChild: SelectionComponent;
  @ViewChild('offerViewChild') offerViewChild: ListOfferByCandidacyComponent;
  @ViewChild('hiringViewChild') hiringViewChild: HiringComponent;
  @ViewChild('recruitmentResumeViewChild') recruitmentResumeViewChild: RecruitmentResumeComponent;
  @Input() recruitmentId: number;
  @Input() currentRecruitment: Recruitment;
  @Output() recruitmentStateChangeAction = new EventEmitter<boolean>();
  preselectedCandidacyList: Candidacy[];
  isCandidacyIsReadyToNextStep = false;
  isPreselectionReadyToNextStep = false;
  isInterviewIsReadyToNextStep = false;
  isEvaluationIsReadyToNextStep = false;
  isSelectionIsReadyToNextStep = false;
  isOfferIsReadyToNextStep = false;
  isHiringIsReadyToNextStep = false;
  public recruitmentState = RecruitmentState;
  public hasCloseRecuitmentPermission: boolean;
  public hasFullRecuitmentPermission: boolean;

  constructor(private candidacyService: CandidacyService, private recruitmentService: RecruitmentService,
    private interviewService: InterviewService, private swalWarrings: SwalWarring, private growlService: GrowlService,
    public authService: AuthService, private translate: TranslateService, private emailService: EmailService) {
  }

  ngOnInit() {
    this.hasCloseRecuitmentPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.CLOSE_RECRUITMENT);
    this.hasFullRecuitmentPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.FULL_RECRUITMENT);
    this.initiateAllStepIsReady();
  }

  ngAfterViewInit() {
    this.goToStep(this.currentRecruitment.State - NumberConstant.TWO);
  }

  initiateAllStepIsReady() {
    this.isCandidacyIsReadyToNextStep = this.isCandidacyIsReadyToNextStepFunction();
    this.isPreselectionReadyToNextStep = this.isPreselectionReadyToNextStepFunction();
    this.isInterviewIsReadyToNextStep = this.isInterviewIsReadyToNextStepFunction();
    this.isEvaluationIsReadyToNextStep = this.isEvaluationIsReadyToNextStepFunction();
    this.isSelectionIsReadyToNextStep = this.isSelectionIsReadyToNextStepFunction();
    this.isOfferIsReadyToNextStep = this.isOfferIsReadyToNextStepFunction();
    this.isHiringIsReadyToNextStep = this.isHiringIsReadyToNextStepFunction();
  }

  isCandidacyIsReadyToNextStepFunction() {
    return this.currentRecruitment.State > RecruitmentState.Candidacy;
  }

  isPreselectionReadyToNextStepFunction() {
    return this.currentRecruitment.State > RecruitmentState.PreSelection;
  }

  isInterviewIsReadyToNextStepFunction() {
    return this.currentRecruitment.State > RecruitmentState.Interview;
  }

  isEvaluationIsReadyToNextStepFunction() {
    return this.currentRecruitment.State > RecruitmentState.Evaluation;
  }

  isSelectionIsReadyToNextStepFunction() {
    return this.currentRecruitment.State > RecruitmentState.Selection;
  }

  isOfferIsReadyToNextStepFunction() {
    return this.currentRecruitment.State > RecruitmentState.Offer;
  }

  isHiringIsReadyToNextStepFunction() {
    return this.currentRecruitment.State > RecruitmentState.Hiring;
  }

  goToStep(recruitmentStep: number) {
    for (let i = 0; i < recruitmentStep; i++) {
      this.stepper.next();
    }
  }

  RefreshAllRecruitmentComponents() {
    this.recruitmentService.getById(this.recruitmentId).subscribe((result) => {
      this.currentRecruitment = result as Recruitment;
      this.initiateAllStepIsReady();
      if (this.candidacyViewChild) {
        this.candidacyViewChild.initGridDataSource();
      }
      if (this.preselectionViewChild) {
        this.preselectionViewChild.initGridDataSource();
      }
      if (this.interviewViewChild) {
        this.interviewViewChild.initGridDataSource();
      }
      if (this.evaluationViewChild) {
        this.evaluationViewChild.initGridDataSource();
      }
      if (this.selectionViewChild) {
        this.selectionViewChild.initGridDataSource();
      }
      if (this.offerViewChild) {
        this.offerViewChild.initGridDataSource();
      }
      if (this.hiringViewChild) {
        this.hiringViewChild.initGridDataSource();
      }
      if (this.recruitmentResumeViewChild) {
        this.recruitmentResumeViewChild.ngOnInit();
      }
      this.recruitmentStateChangeAction.emit();
    });
  }

  fromCandidacyToNextStep() {
    if (this.currentRecruitment.State <= RecruitmentState.Candidacy) {
      this.candidacyService.fromCandidacyToNextStep(this.predicateForNextStep()).subscribe();
    }
  }

  fromPreselectionToNextStep() {
    if (this.currentRecruitment.State <= RecruitmentState.PreSelection) {
      this.candidacyService.fromPreselectionToNextStep(this.predicateForNextStep(RecruitmentState.Interview)).subscribe();
    }
  }


  fromInterviewToNextStep() {
    if (this.currentRecruitment.State <= RecruitmentState.Interview) {
      this.interviewService.fromInterviewToNextStep(this.recruitmentId).subscribe();
    }
  }

  fromEvaluationToNextStep() {
    if (this.currentRecruitment.State <= RecruitmentState.Evaluation) {
      this.interviewService.fromEvaluationToNextStep(this.recruitmentId).subscribe();
    }
  }

  fromSelectionToNextStep() {
    if (this.currentRecruitment.State <= RecruitmentState.Selection) {
      this.candidacyService.fromSelectionToNextStep(this.predicateForNextStep(RecruitmentState.Offer)).subscribe();
    }
  }

  fromOfferToNextStep() {
    if (this.currentRecruitment.State <= RecruitmentState.Offer) {
      this.candidacyService.fromOfferToNextStep(this.predicateForNextStep(RecruitmentState.Hiring)).subscribe();
    }
  }

  generateAndSendTheRejectedMail(dataItem, lang?: string) {
    this.candidacyService.generateRejectedmail(dataItem, lang).subscribe((result) => {
      this.emailService.sendEmail(result).subscribe();
    });
  }

  SendRejectedMail(): void {
    this.candidacyService.getCandidacyListInDoneStep(this.selectionViewChild.gridSettings.state, this.prepareForCandidacyList())
      .subscribe((data) => {
        data.data.forEach((element: Candidacy) => {
          this.generateAndSendTheRejectedMail(element);
        });
      });
  }

  doneClick() {
    this.SendRejectedMail();
    if (this.currentRecruitment.State === RecruitmentState.Hiring) {

      this.swalWarrings.CreateSwal(RecruitmentConstant.DONE_RECRUITMENT_ASSERTION_UPPER_CASE,
        undefined, SharedConstant.CLOSE).then((result) => {
        if (result.value) {
          this.recruitmentService.doneRecruitment(this.recruitmentId).subscribe(() => {
            this.RefreshAllRecruitmentComponents();
            this.stepper._steps[SharedConstant.STEPER_RESULTS_STEPS][RecruitmentState.Hiring - NumberConstant.TWO].completed = true;
            this.stepper.next();
          });
        }
      });

    } else {
      this.growlService.warningNotification(`${this.translate.instant(CandidacyConstant.DONE_RECRUITMENT_VIOLATION)}`);
    }
  }

  private prepareForCandidacyList() {
    const predicate = new PredicateFormat();
    predicate.Filter = new Array<Filter>();
    predicate.Filter.push(new Filter(RecruitmentConstant.CANDIDACY_ID_RECRUITMENT, Operation.eq, this.recruitmentId));
    predicate.Filter.push(new Filter(RecruitmentConstant.STATE, Operation.eq, this.recruitmentState.Selection));
    predicate.Relation = new Array<Relation>();
    predicate.Relation.push.apply(predicate.Relation, [new Relation(RecruitmentConstant.ID_CANDIDATE_NAVIGATION)]);
    predicate.Relation.push.apply(predicate.Relation, [new Relation(RecruitmentConstant.ID_RECRUITMENT_NAVIGATION)]);
    predicate.Relation.push.apply(predicate.Relation, [new Relation(RecruitmentConstant.CANDIDACY_OFFER)]);
    predicate.OrderBy = new Array<OrderBy>();
    predicate.OrderBy.push(new OrderBy(RecruitmentConstant.CANDIDATE_NAVIGATION_FIRST_NAME, OrderByDirection.asc));
    return predicate;
  }

  private predicateForNextStep(minState?): PredicateFormat {
    const predicate = new PredicateFormat();
    predicate.Filter = new Array<Filter>();
    predicate.Filter.push(new Filter(RecruitmentConstant.CANDIDACY_ID_RECRUITMENT, Operation.eq, this.recruitmentId));
    if (minState) {
      predicate.Filter.push(new Filter(RecruitmentConstant.STATE, Operation.gte, minState));
    }
    return predicate;
  }

}
