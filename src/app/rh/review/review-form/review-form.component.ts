import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { InterviewConstant } from '../../../constant/rh/interview.constant';
import { ReviewConstant } from '../../../constant/rh/review.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { InterviewEnumerator } from '../../../models/enumerators/interview.enum';
import { ReviewFormationStatus } from '../../../models/enumerators/review-formation-status.enum';
import { ReviewObjectiveStatus } from '../../../models/enumerators/review-objective-status.enum';
import { ReviewState } from '../../../models/enumerators/review-state.enum';
import { EmployeeSkills } from '../../../models/payroll/employee-skills.model';
import { Employee } from '../../../models/payroll/employee.model';
import { EmployeeReviewPosition } from '../../../models/rh/employee-review-position.model';
import { Interview } from '../../../models/rh/interview.model';
import { Objective } from '../../../models/rh/objective.model';
import { Question } from '../../../models/rh/question.model';
import { ReviewForm } from '../../../models/rh/review-form.model';
import { ReviewFormation } from '../../../models/rh/review-formation.model';
import { ReviewSkills } from '../../../models/rh/review-skills.model';
import { Review } from '../../../models/rh/Review.model';
import { EmployeeSkillsService } from '../../../payroll/services/employee-skills/employee-skills.service';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { UserCurrentInformationsService } from '../../../shared/services/utility/user-current-informations.service';
import { ValidationService } from '../../../shared/services/validation/validation.service';
import { Filter, Operation, OrderBy, OrderByDirection, PredicateFormat, Relation } from '../../../shared/utils/predicate';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { InterviewService } from '../../services/interview/interview.service';
import { ObjectiveService } from '../../services/objective/objective.service';
import { ReviewFormationService } from '../../services/review-formation/review-formation.service';
import { ReviewSkillsService } from '../../services/review-skills/review-skills.service';
import { ReviewService } from '../../services/review/review.service';

@Component({
  selector: 'app-review-form',
  templateUrl: './review-form.component.html',
  styleUrls: ['./review-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReviewFormComponent implements OnInit {


  @Input() idReview: number;
  @Input() isCollaboratorConnected: boolean;
  @Input() IsUserInSuperHierarchicalEmployeeList = false;
  @Input() reviewState: number;

  connectedEmployee: Employee;
  
  reviewFormGroup: FormGroup;
  reviewFormToUpdate: ReviewForm;
  connectedEmployeeId: number;
  skillsToIgnore: number[] = [];
  formationToIgnore: number[] = [];
  pastObjective: Objective[];
  futureObjective: Objective[];
  pastReviewFormation: ReviewFormation[];
  futureReviewFormation: ReviewFormation[];
  pastReviewSkills: ReviewSkills[];
  futureReviewSkills: ReviewSkills[];
  formatDate = this.translate.instant(SharedConstant.DATE_FORMAT);
  reviewObjectiveStatus = ReviewObjectiveStatus;
  reviewFormationStatus = ReviewFormationStatus;
  interviews: Interview[];
  interviewStatus = InterviewEnumerator;
  currentReview: Review;
  employeeReviewPosition: EmployeeReviewPosition;
  /* actvation flags */
  canViewInterview = true;
  canRatePastObjectiveEmployee = false;
  canRatePastObjectiveManager = false;
  canRatePastFormationEmployee = false;
  canRatePastFormationManager = false;
  canRateSkillsEmployee = false;
  canRateSkillsManager = false;
  reviewEnum = ReviewState;
  /*
   *permissions
   */
  public hasUpdateReviewPermission: boolean;

  /*end activation flags */
  constructor(private fb: FormBuilder, private objectiveService: ObjectiveService, private swalWarrings: SwalWarring,
    private validationService: ValidationService, private reviewFormationService: ReviewFormationService,
    private reviewSkillsService: ReviewSkillsService, private employeeSkillsService: EmployeeSkillsService,
      private reviewService: ReviewService, private translate: TranslateService, private authService: AuthService,
    private interviewService: InterviewService, private userCurrentInformationsService: UserCurrentInformationsService) {
      this.employeeReviewPosition = new EmployeeReviewPosition();
    }

  /**
   * Getters
   */
  get PastObjective(): FormArray {
    return this.reviewFormGroup.get(ReviewConstant.PAST_OBJECTIVE) as FormArray;
  }

  get FutureObjective(): FormArray {
    return this.reviewFormGroup.get(ReviewConstant.FUTURE_OBJECTIVE) as FormArray;
  }

  get PastReviewFormation(): FormArray {
    return this.reviewFormGroup.get(ReviewConstant.PAST_REVIEW_FORMATION) as FormArray;
  }

  get FutureReviewFormation(): FormArray {
    return this.reviewFormGroup.get(ReviewConstant.FUTURE_REVIEW_FORMATION) as FormArray;
  }

  get PastReviewSkills(): FormArray {
    return this.reviewFormGroup.get(ReviewConstant.PAST_REVIEW_SKILLS) as FormArray;
  }

  get FutureReviewSkills(): FormArray {
    return this.reviewFormGroup.get(ReviewConstant.FUTURE_REVIEW_SKILLS) as FormArray;
  }

  get Interview(): FormArray {
    return this.reviewFormGroup.get(ReviewConstant.INTERVIEW) as FormArray;
  }

  ngOnInit() {
    this.hasUpdateReviewPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.UPDATE_ANNUALINTERVIEW);
      this.userCurrentInformationsService.getConnectedEmployeeId().subscribe(idEmployee => {
          this.connectedEmployeeId = idEmployee;
      this.initReviewForm();
      this.getCurrentReview();
      this.initEmployeeReviewPositon();
    });
    this.createAddForm();
  }

  /**
   * Check role of connected user and init the list gridDataSource
   */
  predicateForRole(): PredicateFormat {
    const predicate: PredicateFormat = new PredicateFormat();
    predicate.Filter = new Array<Filter>();
    predicate.Filter.push(new Filter(ReviewConstant.ID, Operation.eq, this.idReview));
    predicate.Relation = new Array<Relation>();
    predicate.Relation.push.apply(predicate.Relation, [new Relation(ReviewConstant.ID_EMPLOYEE_COLLABORATOR_NAVIGATION)]);
    return predicate;
  }

  getReviewFormRows(): ReviewForm {
    if (this.reviewFormGroup.valid) {
      const reviewFormAssign: ReviewForm = Object.assign({}, this.reviewFormGroup.getRawValue());
      return reviewFormAssign;
    } else {
      this.validationService.validateAllFormFields(this.reviewFormGroup);
    }
  }

  /**
   * Past objective section
   */
  generatePastObjective() {
    this.reviewService.GetPastObjectiveList(this.idReview).subscribe((data) => {
      this.pastObjective = data.listData;
      if (this.pastObjective) {
        this.pastObjective.forEach((objective) => {
          this.PastObjective.push(this.buildPastObjectiveForm(objective));
        });
      }
    });
  }

  buildPastObjectiveForm(objective: Objective): FormGroup {
    return this.fb.group({
      Id: [objective ? objective.Id : NumberConstant.ZERO],
      IdReview: [objective ? objective.IdReview : NumberConstant.ZERO],
      IdEmployee: [objective ? objective.IdEmployee : NumberConstant.ZERO],
      Label: [{value: objective ? objective.Label : '', disabled: true}, Validators.required],
      ExpectedDate: [{value: objective ? new Date (objective.ExpectedDate) : '', disabled: true}, Validators.required],
      RealisationDate: [{value: objective && objective.RealisationDate ? new Date(objective.RealisationDate) : '', 
        disabled: !this.hasUpdateReviewPermission && this.reviewState === this.reviewEnum.Completed},
        this.validationService.conditionalValidator((() => this.isCollaboratorConnected), Validators.required)],
      ObjectiveCollaboratorStatus: [{value: objective && objective.ObjectiveCollaboratorStatus ? objective.ObjectiveCollaboratorStatus : '', 
        disabled: !this.hasUpdateReviewPermission && !this.canRatePastObjectiveEmployee || this.reviewState === this.reviewEnum.Completed || null},
        this.validationService.conditionalValidator((() => this.isCollaboratorConnected), Validators.required)],
      ObjectiveManagerStatus: [{value: objective && objective.ObjectiveManagerStatus ? objective.ObjectiveManagerStatus : '',
        disabled: !this.hasUpdateReviewPermission && !this.canRatePastObjectiveManager || this.reviewState === this.reviewEnum.Completed || null},
        this.validationService.conditionalValidator((() => !this.isCollaboratorConnected), Validators.required)],
      IsDeleted: [false]
    });
  }

  /**
   * Future objective section
   */
  addFutureObjective() {
    this.FutureObjective.push(this.buildFutureObjectiveForm());
  }

  generateFutureObjective() {
    this.objectiveService.readPredicateData(this.predicateForFutureObjective()).subscribe((data) => {
      this.futureObjective = data;
      if (this.futureObjective && this.futureObjective.length > 0) {
        this.futureObjective.forEach((objective) => {
          this.FutureObjective.push(this.buildFutureObjectiveForm(objective));
        });
      } else {
        this.addFutureObjective();
      }
    });
  }

  buildFutureObjectiveForm(objective?: Objective): FormGroup {
    return this.fb.group({
      Id: [objective ? objective.Id : NumberConstant.ZERO],
      IdReview: [this.idReview],
      IdEmployee: [objective ? objective.IdEmployee : NumberConstant.ZERO],
      Label: [{value : objective ? objective.Label : '', disabled : !this.hasUpdateReviewPermission && !( this.employeeReviewPosition.IsManagement ||
        this.employeeReviewPosition.IsReviewManager || this.employeeReviewPosition.IsCollaborator) || this.reviewState === this.reviewEnum.Completed}, [Validators.required]],
      ExpectedDate: [{value: objective && objective.ExpectedDate ? new Date(objective.ExpectedDate) : '', 
        disabled: !this.hasUpdateReviewPermission && !( this.employeeReviewPosition.IsManagement || this.employeeReviewPosition.IsReviewManager || this.employeeReviewPosition.IsCollaborator)
           || this.reviewState === this.reviewEnum.Completed}, Validators.required],
      IsDeleted: [false]
    });
  }

  /**
   * Delete future objective of the current review
   * @param $event
   * @param index
   */
  deleteFutureObjective($event: Objective, index: number) {
    if ($event.Id !== NumberConstant.ZERO) {
      this.swalWarrings.CreateSwal(ReviewConstant.DELETE_OBJECTIVE).then((result) => {
        if (result.value) {
            const hasRole = this.hasUpdateReviewPermission || this.connectedEmployee.Id === $event.IdEmployee || this.IsUserInSuperHierarchicalEmployeeList;
            this.objectiveService.deleteObjectiveModel(hasRole, $event).subscribe(() => {
              this.FutureObjective.removeAt(index);
            });
        }
      });
    } else {
      if (this.FutureObjective.at(index).get(ReviewConstant.ID).value === NumberConstant.ZERO) {
        this.FutureObjective.removeAt(index);
      }
    }
  }

  /**
   * Past ReviewFormation section
   */
  generatePastReviewFormation() {
    this.reviewService.GetPastReviewFormationList(this.idReview).subscribe((data) => {
      this.pastReviewFormation = data.listData;
      if (this.pastReviewFormation) {
        this.pastReviewFormation.forEach((reviewFormation) => {
          this.PastReviewFormation.push(this.buildPastReviewFormationForm(reviewFormation));
        });
      }
    });
  }

  buildPastReviewFormationForm(reviewFormation: ReviewFormation): FormGroup {
    return this.fb.group({
      Id: [reviewFormation ? reviewFormation.Id : NumberConstant.ZERO],
      IdReview: [reviewFormation ? reviewFormation.IdReview : NumberConstant.ZERO],
      IdEmployee: [reviewFormation ? reviewFormation.IdEmployee : NumberConstant.ZERO],
      IdFormation: [{
        value: reviewFormation ? reviewFormation.IdFormation : '',
        disabled: true
      }, Validators.required],
      Date: [reviewFormation && reviewFormation.Date ? new Date(reviewFormation.Date) : '',
        this.validationService.conditionalValidator((() => this.isCollaboratorConnected), Validators.required)],
      FormationCollaboratorStatus: [{ value: reviewFormation && reviewFormation.FormationCollaboratorStatus ? reviewFormation.FormationCollaboratorStatus : '',
        disabled: !this.hasUpdateReviewPermission && !this.canRatePastFormationEmployee || this.reviewState === this.reviewEnum.Completed || null},
         this.validationService.conditionalValidator((() => this.isCollaboratorConnected), Validators.required)],
      FormationManagerStatus: [{ value: reviewFormation && reviewFormation.FormationManagerStatus ? reviewFormation.FormationManagerStatus : '',
      disabled: !this.hasUpdateReviewPermission && !this.canRatePastFormationManager || this.reviewState === this.reviewEnum.Completed || null},
        this.validationService.conditionalValidator((() => !this.isCollaboratorConnected), Validators.required)],
      IsDeleted: [false]
    });
  }

  /**
   * Future ReviewFormation section
   */

  addFutureReviewFormation() {
    this.FutureReviewFormation.push(this.buildFutureReviewFormationForm());
  }

  generateFutureReviewFormation() {
    this.reviewFormationService.readPredicateData(this.predicateForFutureReviewFormation()).subscribe((data) => {
      this.futureReviewFormation = data;
      if (this.futureReviewFormation && this.futureReviewFormation.length > 0) {
        this.futureReviewFormation.forEach((reviewFormation) => {
          this.FutureReviewFormation.push(this.buildFutureReviewFormationForm(reviewFormation));
          this.formationToIgnore.push(reviewFormation.IdFormation);
        });
      }
    });
  }

  buildFutureReviewFormationForm(reviewFormation?: ReviewFormation): FormGroup {
    return this.fb.group({
      Id: [reviewFormation ? reviewFormation.Id : NumberConstant.ZERO],
      IdReview: [this.idReview],
      IdEmployee: [reviewFormation ? reviewFormation.IdEmployee : NumberConstant.ZERO],
      IdFormation: [reviewFormation ? reviewFormation.IdFormation : '', Validators.required],
      Date: [{value : reviewFormation && reviewFormation.Date ? new Date(reviewFormation.Date) : '', disabled : !this.hasUpdateReviewPermission || this.reviewState === this.reviewEnum.Completed}, Validators.required],
      IsDeleted: [false]
    });
  }

  deleteFutureReviewFormation($event: ReviewFormation, index: number) {
    if ($event.Id !== NumberConstant.ZERO) {
      this.swalWarrings.CreateSwal(ReviewConstant.DELETE_FORMATION).then((result) => {
        if (result.value) {
            const hasRole = this.hasUpdateReviewPermission || this.connectedEmployee.Id === $event.IdEmployee || this.IsUserInSuperHierarchicalEmployeeList;
            this.reviewFormationService.deleteReviewFormationModel(hasRole, $event).subscribe(() => {
              this.FutureReviewFormation.removeAt(index);
              // remove the id formation in the formationToIgnore
              this.formationToIgnore = this.formationToIgnore.filter(z => z !== $event.IdFormation);
              (this.reviewFormGroup.get(ReviewConstant.FUTURE_REVIEW_FORMATION) as FormArray)[ReviewConstant.CONTROLS].splice(0);
              this.generateFutureReviewFormation();
            });
        }
      });
    } else {
      if (this.FutureReviewFormation.at(index).get(ReviewConstant.ID).value === NumberConstant.ZERO) {
        this.FutureReviewFormation.removeAt(index);
      }
    }
  }

  isFutureReviewForamtionVisible(index: number) {
    return !this.FutureReviewFormation.at(index).get(ReviewConstant.IS_DELETED).value;
  }

  /**
   * Past ReviewSkills section
   */
  generatePastReviewSkills() {
    this.employeeSkillsService.getPastReviewSkillsList(this.idReview).subscribe((data) => {
      const employeeSkills: EmployeeSkills[] = data.listData;
      const pastReviewSkillsList: ReviewSkills[] = [];
      employeeSkills.forEach((employeeSkill) => {
        pastReviewSkillsList.push(new ReviewSkills(NumberConstant.ZERO, employeeSkill.IdSkills, employeeSkill.Rate));
      });
      this.pastReviewSkills = pastReviewSkillsList;
      if (this.pastReviewSkills) {
        this.pastReviewSkills.forEach((reviewSKill) => {
          this.PastReviewSkills.push(this.buildPastReviewSkills(reviewSKill));
          this.skillsToIgnore.push(reviewSKill.IdSkills);
        });
      }
    });
  }

  buildPastReviewSkills(reviewSkills: ReviewSkills): FormGroup {
    return this.fb.group({
      Id: [reviewSkills ? reviewSkills.Id : NumberConstant.ZERO],
      IdReview: [this.idReview],
      IdEmployee: [this.connectedEmployeeId ? this.connectedEmployeeId : NumberConstant.ZERO],
      IdSkills: [{ value: reviewSkills ? reviewSkills.IdSkills : '', disabled: true }, Validators.required],
      OldRate: [{ value: reviewSkills ? reviewSkills.OldRate : '', disabled: true }, Validators.required],
      IsOld: [true],
      CollaboratorMark: [{
        value: reviewSkills ? reviewSkills.CollaboratorMark : '',
        disabled: !this.hasUpdateReviewPermission || !this.canRateSkillsEmployee
      }],
      ManagerMark: [{
        value: reviewSkills ? reviewSkills.ManagerMark : '',
        disabled: !this.hasUpdateReviewPermission || !this.canRateSkillsManager
      }],
      IsDeleted: [false]
    });
  }

  isPastReviewSkillsVisible(index: number) {
    return !this.PastReviewSkills.at(index).get(ReviewConstant.IS_DELETED).value;
  }

  /**
   * Future ReviewSkills section
   */

  addFutureReviewSkills() {
    this.FutureReviewSkills.push(this.buildFutureReviewSkillsForm());
  }

  generateFutureReviewSkills() {
    this.reviewSkillsService.readPredicateData(this.predicateForFutureReviewSkills()).subscribe((data) => {
      this.futureReviewSkills = data;
      if (this.futureReviewSkills) {
        this.futureReviewSkills.forEach((reviewSkill) => {
          this.FutureReviewSkills.push(this.buildFutureReviewSkillsForm(reviewSkill));
          this.skillsToIgnore.push(reviewSkill.IdSkills);
        });
      }
    });
  }

  buildFutureReviewSkillsForm(reviewSkills?: ReviewSkills): FormGroup {
    return this.fb.group({
      Id: [reviewSkills ? reviewSkills.Id : NumberConstant.ZERO],
      IdReview: [this.idReview],
      IdEmployee: [reviewSkills ? reviewSkills.IdEmployee : this.connectedEmployeeId],
      IdSkills: [{
        value: reviewSkills ? reviewSkills.IdSkills : '',
        disabled: reviewSkills ? reviewSkills.IsOld : false
      }, Validators.required],
      OldRate: [{value: reviewSkills ? reviewSkills.OldRate : '', disabled: true}, Validators.required],
      IsOld: [reviewSkills ? reviewSkills.IsOld : false, Validators.required],
      CollaboratorMark: [{
        value: reviewSkills && reviewSkills.CollaboratorMark ?
          reviewSkills.CollaboratorMark : '', disabled: !this.hasUpdateReviewPermission || !this.isCollaboratorConnected
      }, Validators.required],
      ManagerMark: [{
        value: reviewSkills && reviewSkills.ManagerMark ?
          reviewSkills.ManagerMark : '', disabled: !this.hasUpdateReviewPermission || this.isCollaboratorConnected
      }, Validators.required],
      IsDeleted: [false]
    });
  }

  deleteFutureReviewSkills($event: ReviewSkills, index: number) {
    if ($event.Id !== NumberConstant.ZERO) {
      this.swalWarrings.CreateSwal(ReviewConstant.DELETE_REVIEW_SKILLS).then((result) => {
        if (result.value) {
            const hasRole = this.hasUpdateReviewPermission || this.connectedEmployee.Id === $event.IdEmployee || this.IsUserInSuperHierarchicalEmployeeList;
            this.reviewSkillsService.deleteReviewSkillsModel(hasRole, $event).subscribe(() => {
              this.FutureReviewSkills.removeAt(index);
              // remove the id skills in the skillsToIgnore
              this.skillsToIgnore = this.skillsToIgnore.filter(z => z !== $event.IdSkills);
              (this.reviewFormGroup.get(ReviewConstant.FUTURE_REVIEW_SKILLS) as FormArray)[ReviewConstant.CONTROLS].splice(0);
              this.generateFutureReviewSkills();
            });
        }
      });
    } else {
      if (this.FutureReviewSkills.at(index).get(ReviewConstant.ID).value === NumberConstant.ZERO) {
        this.FutureReviewSkills.removeAt(index);
      }
    }
  }

  isFutureReviewSkillsVisible(index: number) {
    return !this.FutureReviewSkills.at(index).get(ReviewConstant.IS_DELETED).value;
  }

  generateInterviews() {
    this.interviewService.readPredicateData(this.predicateForQuestions()).subscribe(result => {
      this.interviews = result;
      if (this.interviews) {
        this.interviews.forEach((interview) => {
          this.Interview.push(this.buildInterviewForm(interview));
        });
      }
    });
  }

  buildInterviewForm(interview: Interview): FormGroup {
    const questions = this.fb.array([]);
    const interviewFormGroup = this.fb.group({
      Id: [interview ? interview.Id : NumberConstant.ZERO],
      IdReview: [this.idReview],
      FullName: [interview ? interview.IdSupervisorNavigation.FullName : ''],
      CreationDate: [interview ? new Date(interview.CreationDate) : new Date()],
      InterviewDate: [interview ? new Date(interview.InterviewDate) : new Date()],
      Status: [interview ? interview.Status : ''],
      Question: questions,
      IdSupervisor: [interview ? interview.IdSupervisor : NumberConstant.ZERO]
    });
    if (interview.Question) {
      interview.Question.forEach(question => {
        questions.push(this.buildInterviewQuestionForm(question));
      });
    }
    return interviewFormGroup;
  }

  buildInterviewQuestionForm(question?: Question): FormGroup {
    return this.fb.group({
      Id: [question ? question.Id : NumberConstant.ZERO],
      IdInterview: [question ? question.IdInterview : NumberConstant.ZERO],
      QuestionLabel: [{
        value: question ? question.QuestionLabel : '',
        disabled: this.isCollaboratorConnected
      },
        this.validationService.conditionalValidator((() => !this.isCollaboratorConnected), Validators.required)],
      ResponseLabel: [{
        value: question ? question.ResponseLabel : '',
        disabled: this.isCollaboratorConnected
      },
        this.validationService.conditionalValidator((() => !this.isCollaboratorConnected), Validators.required)],
      IsDeleted: [false]
    });
  }

  /**
   * Get the checked radio button of the current review formation
   */
  checkedCollaboratorSatisfying(status: number): boolean {
    return status === this.reviewFormationStatus.Satisfying;
  }

  checkedCollaboratorPartiallySatisfying(status: number): boolean {
    return status === this.reviewFormationStatus.PartiallySatisfying;
  }

  checkedCollaboratorNotSatisfying(status: number): boolean {
    return status === this.reviewFormationStatus.NoSatisfying;
  }

  checkedManagerSatisfying(status: number): boolean {
    return status === this.reviewFormationStatus.Satisfying;
  }

  checkedManagerPartiallySatisfying(status: number): boolean {
    return status === this.reviewFormationStatus.PartiallySatisfying;
  }

  checkedManagerNotSatisfying(status: number): boolean {
    return status === this.reviewFormationStatus.NoSatisfying;
  }

  /**
   * Get the checked radio button of the current objective
   */
  checkedCollaboratorReached(status: number): boolean {
    return status === this.reviewObjectiveStatus.Reached;
  }

  checkedCollaboratorPartiallyReached(status: number): boolean {
    return status === this.reviewObjectiveStatus.PartiallyReached;
  }

  checkedCollaboratorNotReached(status: number): boolean {
    return status === this.reviewObjectiveStatus.NotReached;
  }

  checkedManagerReached(status: number): boolean {
    return status === this.reviewObjectiveStatus.Reached;
  }

  checkedManagerPartiallyReached(status: number): boolean {
    return status === this.reviewObjectiveStatus.PartiallyReached;
  }

  checkedManagerNotReached(status: number): boolean {
    return status === this.reviewObjectiveStatus.NotReached;
  }

  private createAddForm(): void {
    this.reviewFormGroup = this.fb.group({
      PastObjective: this.fb.array([]),
      FutureObjective: this.fb.array([]),
      PastReviewFormation: this.fb.array([]),
      FutureReviewFormation: this.fb.array([]),
      PastReviewSkills: this.fb.array([]),
      FutureReviewSkills: this.fb.array([]),
      Interview: this.fb.array([])
    });
  }

  private initReviewForm() {
    this.generatePastObjective();
    this.generateFutureObjective();
    this.generatePastReviewFormation();
    this.generateFutureReviewFormation();
    this.generatePastReviewSkills();
    this.generateFutureReviewSkills();
    this.generateInterviews();
  }

  private predicateForFutureObjective(): PredicateFormat {
    const predicate = new PredicateFormat();
    predicate.Filter = new Array<Filter>();
    predicate.Filter.push(new Filter(ReviewConstant.ID_REVIEW, Operation.eq, this.idReview));
    predicate.OrderBy = new Array<OrderBy>();
    predicate.OrderBy.push(new OrderBy(ReviewConstant.ID, OrderByDirection.asc));
    return predicate;
  }

  private predicateForFutureReviewFormation(): PredicateFormat {
    const predicate = new PredicateFormat();
    predicate.Filter = new Array<Filter>();
    predicate.Filter.push(new Filter(ReviewConstant.ID_REVIEW, Operation.eq, this.idReview));
    predicate.OrderBy = new Array<OrderBy>();
    predicate.OrderBy.push(new OrderBy(ReviewConstant.ID, OrderByDirection.asc));
    return predicate;
  }

  private predicateForFutureReviewSkills(): PredicateFormat {
    const predicate = new PredicateFormat();
    predicate.Filter = new Array<Filter>();
    predicate.Filter.push(new Filter(ReviewConstant.ID_REVIEW, Operation.eq, this.idReview));
    predicate.OrderBy = new Array<OrderBy>();
    predicate.OrderBy.push(new OrderBy(ReviewConstant.ID, OrderByDirection.asc));
    return predicate;
  }

  private predicateForQuestions(): PredicateFormat {
    const predicate = new PredicateFormat();
    predicate.Filter = new Array<Filter>();
    predicate.Filter.push(new Filter(ReviewConstant.ID_REVIEW, Operation.eq, this.idReview));
    predicate.OrderBy = new Array<OrderBy>();
    predicate.OrderBy.push(new OrderBy(ReviewConstant.ID, OrderByDirection.asc));
    predicate.Relation = new Array<Relation>();
    predicate.Relation.push(new Relation(InterviewConstant.QUESTION));
    predicate.Relation.push(new Relation(InterviewConstant.ID_SUPERVISOR_NAVIGATION));
    return predicate;
  }

  /**
   * Authorised Access
   */

  private getCurrentReview() {
    this.currentReview = new Review();
    this.reviewService.getById(this.idReview).subscribe(x => {
      this.currentReview = x;
      if (this.connectedEmployeeId === this.currentReview.IdEmployeeCollaborator) {
        this.canViewInterview = false;
      } else {
        this.canViewInterview = true;
      }
    }
    );
  }

  private initEmployeeReviewPositon() {
    this.reviewService.ConnectedEmployeePriveleges(this.idReview).subscribe(
      x => this.prepareAccessFlags(x)
    );
  }

  private prepareAccessFlags(x: EmployeeReviewPosition) {
    this.employeeReviewPosition = x;
    if (this.employeeReviewPosition.IsCollaborator) {
      this.canRatePastFormationEmployee = true;
      this.canRatePastObjectiveEmployee = true;
      this.canRateSkillsEmployee = true;
    } else if (x.IsManagement || x.IsReviewManager) {
      this.canRatePastFormationManager = true;
      this.canRatePastObjectiveManager = true;
      this.canRateSkillsManager = true;
    }
  }

}
