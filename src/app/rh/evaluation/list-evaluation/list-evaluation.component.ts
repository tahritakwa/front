import { Component, OnInit, Input, ViewContainerRef, Output, EventEmitter } from '@angular/core';
import { PagerSettings } from '@progress/kendo-angular-grid';
import { InterviewService } from '../../services/interview/interview.service';
import { InterviewMarkService } from '../../services/interview-mark/interview-mark.service';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { FormModalDialogService } from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { InterviewEnumerator, InterviewMarkEnumerator } from '../../../models/enumerators/interview.enum';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { State } from '@progress/kendo-data-query';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { InterviewConstant } from '../../../constant/rh/interview.constant';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { PredicateFormat, Filter, Operation, Relation, OrderBy, OrderByDirection } from '../../../shared/utils/predicate';
import { InterviewMark } from '../../../models/rh/interview-mark.model';
import { EvaluationFormComponent } from '../evaluation-form/evaluation-form.component';
import { EvaluationConstant } from '../../../constant/rh/evaluation.constant';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ValidationService } from '../../../shared/services/validation/validation.service';
import { RecruitmentState } from '../../../models/enumerators/recruitment-state.enum';
import { RecruitmentService } from '../../services/recruitment/recruitment.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';

@Component({
  selector: 'app-list-evaluation',
  templateUrl: './list-evaluation.component.html',
  styleUrls: ['./list-evaluation.component.scss']
})
export class ListEvaluationComponent implements OnInit {

  // # begin attribut region
  @Output() actionSelected = new EventEmitter<boolean>();
  @Input() recruitmentId: number;
  recruitmentState: number;
  isModal = false;
  public inteviewEnumerator = InterviewEnumerator;
  public hasFullRecuitmentPermission: boolean;
  public hasAddOrUpdateRecruitmentPermission: boolean;
  // # gridSettings
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public gridState: State = {
    skip: NumberConstant.ZERO as number,
    take: NumberConstant.TEN as number,
    filter: {
      logic: SharedConstant.LOGIC_AND,
      filters: []
    }
  };
  public interviewMarkToUpdate: InterviewMark;
  public columnsConfig: ColumnSettings[] = [
    {
      field: InterviewConstant.CANDIDATE_NAVIGATION_FIRST_NAME,
      title: InterviewConstant.CANDIDATE_UPPERCASE,
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: InterviewConstant.INTERVIEW_DATE,
      title: InterviewConstant.INTERVIEW_DATE_UPPERCASE,
      filterable: true,
      filter: 'date',
      format: this.translate.instant(SharedConstant.DATE_FORMAT),
      _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: InterviewConstant.START_TIME,
      title: InterviewConstant.HOUR.toUpperCase(),
      filterable: true,
      format: this.translate.instant(SharedConstant.DATE_FORMAT),
      _width: NumberConstant.TWO_HUNDRED
    }
  ];
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };
  // # gridSettings
  // # end attribut region

  public formatDate = this.translate.instant(SharedConstant.DATE_FORMAT);
  constructor(public interviewService: InterviewService,
              private interviewMarkService: InterviewMarkService,
              private formModalDialogService: FormModalDialogService,
              private viewRef: ViewContainerRef,
              public authService: AuthService,
      private recruitmentService: RecruitmentService,
      private translate: TranslateService  ) {
    this.hasFullRecuitmentPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.FULL_RECRUITMENT);
    this.hasAddOrUpdateRecruitmentPermission = this.authService.hasAuthorities([PermissionConstant.RHAndPaiePermissions.ADD_RECRUITMENT,
      PermissionConstant.RHAndPaiePermissions.UPDATE_RECRUITMENT]);
  }

  // # begin ng region
  ngOnInit() {
    this.initGridDataSource();
  }

  // # end ng region

  // # begin method region
  initGridDataSource() {
    this.interviewService.reloadServerSideData(this.gridSettings.state, this.preparePredicate()).subscribe(data => {
      this.gridSettings.gridData = data;
      this.initRecruitmentState();
    });
  }

  initRecruitmentState(): any {
    this.recruitmentService.getById(this.recruitmentId).subscribe(result => {
      this.recruitmentState = result.State;
    });
  }

  public dataStateChange(state: State): void {
    this.gridSettings.state = state;
    this.initGridDataSource();
  }

  preparePredicate(): PredicateFormat {
    let myPredicate = new PredicateFormat();
    if (this.recruitmentId) {
      myPredicate.Filter = new Array<Filter>();
      myPredicate.Filter.push(new Filter(InterviewConstant.RECRUITMENT_NAVIGATION_ID, Operation.eq, this.recruitmentId));
      myPredicate.Filter.push(new Filter(InterviewConstant.STATUS, Operation.gte, InterviewEnumerator.InterviewConfirmedByCandidate));
    }
    myPredicate.Relation = new Array<Relation>();
    myPredicate.Relation.push.apply(myPredicate.Relation,
      [new Relation(InterviewConstant.ID_CANDIDACY_NAVIGATION)]);
    myPredicate.Relation.push.apply(myPredicate.Relation,
      [new Relation(InterviewConstant.CANDIDACY_ID_CANDIDATE_NAVIGATION)]);
    myPredicate.Relation.push.apply(myPredicate.Relation,
      [new Relation(InterviewConstant.INTERVIEW_MARK)]);
    myPredicate.Relation.push.apply(myPredicate.Relation,
      [new Relation(InterviewConstant.ID_EMAIL_NAVIGATION)]);
    myPredicate.Relation.push.apply(myPredicate.Relation,
      [new Relation(InterviewConstant.ID_EVALUATION_CRITERIA_NAVIGATION)]);
    myPredicate.OrderBy = new Array<OrderBy>();
    myPredicate.OrderBy.push.apply(myPredicate.OrderBy,
      [new OrderBy(InterviewConstant.FIRST_NAME_FILTRE, OrderByDirection.asc)]);

    return myPredicate;
  }

  isInterviewMarkRequestedToInterviewer(interviewMarkStatus): boolean {
    return interviewMarkStatus === InterviewMarkEnumerator.InterviewMarkRequestedToInterviewer;
  }

  haveRequired(interviewMarkList: InterviewMark[]): boolean {
    return interviewMarkList.find(x => x.IsRequired) !== undefined;
  }

  haveOptional(interviewMarkList: InterviewMark[]): boolean {
    return interviewMarkList.find(x => !x.IsRequired) !== undefined;
  }

  allRequiredConfirmed(interviewMarkList: InterviewMark[]): boolean {
    return interviewMarkList.filter(x => x.IsRequired &&
      x.Status !== InterviewMarkEnumerator.InterviewerAvailabilityConfirmed).length === 0;
  }

  addNewEvaluation(interviewMark: InterviewMark) {
    let predicate: PredicateFormat = new PredicateFormat();
    predicate.Filter = new Array<Filter>();
    predicate.Filter.push(new Filter(InterviewConstant.ID, Operation.eq, interviewMark.Id));
    predicate.Relation = new Array<Relation>();
    predicate.Relation.push.apply(predicate.Relation, [new Relation(InterviewConstant.INTERVIEW_NAVIGATION)]);
    this.interviewMarkService.getModelByCondition(predicate).subscribe((result) => {
      interviewMark = result;
      this.interviewMarkService.GetInterviewMarkCriteriaMarkList(interviewMark.Id).subscribe(data => {
        interviewMark.CriteriaMark = data;
        this.formModalDialogService.openDialog(EvaluationConstant.CANDIDATE_EVALUATION_FORM,
          EvaluationFormComponent, this.viewRef, this.onCloseContractModal.bind(this), interviewMark, true,
          SharedConstant.MODAL_DIALOG_SIZE_M);
      });
    });
  }

  public isUpdateMode(interviewMark: InterviewMark): boolean {
    if (interviewMark.InterviewerDecision != null) {
      return true;
    }
    return false;

  }

  isCurrentRecruitmentCompleted(): boolean {
    return this.recruitmentState === RecruitmentState.Closed;
  }

  private onCloseContractModal(): void {
    this.actionSelected.emit();
  }

  // # end method region
}
