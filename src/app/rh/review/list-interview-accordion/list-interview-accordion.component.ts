import { Component,OnInit, Input, ViewContainerRef, Output, EventEmitter,
  OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { Review } from '../../../models/rh/Review.model';
import { State } from '@progress/kendo-data-query';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { InterviewConstant } from '../../../constant/rh/interview.constant';
import { ReviewConstant } from '../../../constant/rh/review.constant';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { InterviewService } from '../../services/interview/interview.service';
import { PredicateFormat, Filter, Relation, OrderBy, OrderByDirection, Operation } from '../../../shared/utils/predicate';
import { Interview } from '../../../models/rh/interview.model';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { InterviewEnumerator, InterviewMarkEnumerator } from '../../../models/enumerators/interview.enum';
import { FormModalDialogService } from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { AddInterviewComponent } from '../../interview/add-interview/add-interview.component';
import { PostponeInterviewComponent } from '../../components/postpone-interview/postpone-interview.component';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { User } from '../../../models/administration/user.model';
import { StarkRolesService } from '../../../stark-permissions/service/roles.service';
import { isNullOrUndefined } from 'util';
import { notEmptyValue } from '../../../stark-permissions/utils/utils';
import { RoleConfigConstant } from '../../../Structure/_roleConfigConstant';
import { EmailHistoryComponent } from '../../components/email-history/email-history.component';
import { InterviewEmailService } from '../../services/interview-email/interview-email.service';
import { UserCurrentInformationsService } from '../../../shared/services/utility/user-current-informations.service';
import { TranslateService } from '@ngx-translate/core';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { EmployeeService } from '../../../payroll/services/employee/employee.service';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { Employee } from '../../../models/payroll/employee.model';

@Component({
  selector: 'app-list-interview-accordion',
  templateUrl: './list-interview-accordion.component.html',
  styleUrls: ['./list-interview-accordion.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ListInterviewAccordionComponent implements OnInit, OnChanges {

  @Input() review: Review;
  @Output() actionSelected = new EventEmitter<boolean>();
  predicate: PredicateFormat;
  singleModelPredicate: PredicateFormat;
  listInterview: Array<Interview>;
  /**
   * permissions
   */
  public hasUpdateInterviewPermission: boolean;
  public hasDelayInterviewPermission: boolean;
  public hasCancelInterviewPermission: boolean;
  public hasHistoryMailInterviewPermission: boolean;
  public hasDeleteInterviewPermission: boolean;
  public connectedUser: User;
  public connectedEmployee: Employee;
  public inteviewEnumerator = InterviewEnumerator;
  public interviewMarkEnumerator = InterviewMarkEnumerator;
  public postponeMode: any = [];
  predicateInterviewEmail: PredicateFormat;
  public interviewGridState: State = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.TEN,
    filter: {
      logic: 'and',
      filters: []
    }
  };
  public historyEmailState: State = {
    skip: 0,
    take: NumberConstant.TEN as number,
    filter: {
      logic: SharedConstant.LOGIC_AND,
      filters: []
    }
  };
  public gridSettings: GridSettings = {
    state: this.interviewGridState,
  };
  formatDate = this.translate.instant(SharedConstant.DATE_FORMAT);

  constructor(private interviewService: InterviewService,
              private interviewEmailService: InterviewEmailService,
              private formModalDialogService: FormModalDialogService,
              private viewRef: ViewContainerRef,
              private swalWarrings: SwalWarring,
              private employeeService: EmployeeService,
      public authService: AuthService, private translate: TranslateService  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.review !== undefined) {
      this.initInterviewForReviewList();
    } else {
      this.listInterview = undefined;
    }
  }

  ngOnInit() {
    this.hasUpdateInterviewPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.UPDATE_INTERVIEW);
    this.hasDelayInterviewPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.DELAY_INTERVIEW_PERMISSION);
    this.hasCancelInterviewPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.CANCEL_INTERVIEW_PERMISSION);
    this.hasHistoryMailInterviewPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.INTERVIEW_MAIL_HISTORY);
    this.hasDeleteInterviewPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.DELETE_INTERVIEW);
      this.employeeService.getConnectedEmployee().subscribe(dataResult => {
      this.connectedEmployee = dataResult;
    });
    if (this.review !== undefined) {
      this.initInterviewForReviewList();
    }
  }

  /* fetch interview list */

  // realoading interview after changes
  reloadCurrentInterview(idInterview: number) {
    this.prepareSingleModelPredicate(idInterview);
    this.interviewService.reloadServerSideData(this.gridSettings.state, this.singleModelPredicate).subscribe(updatedInterviewList => {
      for (const updatedInterview of updatedInterviewList.data) {
        this.updateListInterview(updatedInterview);
      }
    });
  }

  public getInterviewEmailHistoric(interview: Interview) {
    this.predicateInterviewEmail = new PredicateFormat();
    this.predicateInterviewEmail.Relation = new Array<Relation>();
    this.predicateInterviewEmail.Filter = new Array<Filter>();
    this.predicateInterviewEmail.Filter.push(new Filter(InterviewConstant.ID_INTERVIEW, Operation.eq, interview.Id));
    this.predicateInterviewEmail.Relation.push.apply(this.predicateInterviewEmail.Relation,
      [new Relation(InterviewConstant.ID_EMAIL_NAVIGATION)]);
    this.interviewEmailService.reloadServerSideData(this.historyEmailState, this.predicateInterviewEmail).subscribe(res => {
      this.formModalDialogService.openDialog(InterviewConstant.MAIL_HISTORY,
        EmailHistoryComponent, this.viewRef, this.onCloseInterviewModal.bind(this),
        res.data, true, SharedConstant.MODAL_DIALOG_SIZE_M);
    });

  }

  /* fetch single interview */

  // replacing the old interview by the new interview
  updateListInterview(updatedInterview: Interview) {
    const interviewToUpdate = this.listInterview.find(interview => interview.Id === updatedInterview.Id);
    updatedInterview.IsSelected = true;
    const index = this.listInterview.indexOf(interviewToUpdate);
    this.listInterview[index] = updatedInterview;
  }

  // detecting interview changes
  public onConfirmation(idInterview: number) {
    this.reloadCurrentInterview(idInterview);
  }

  /* actions */
  public openChangeInterviewModal(interview: Interview) {
    this.postponeMode = [];
    this.postponeMode[InterviewConstant.REVIEW_MODE] = true;
    this.postponeMode[InterviewConstant.IS_DELAY_MODE] = false;
    this.postponeMode[InterviewConstant.IS_CHANGE_MODE] = true;
    this.postponeMode[InterviewConstant.INTERVIEW] = interview;
    this.postponeMode[ReviewConstant.ID_EMPLOYEE_COLLABORATOR] = interview.IdReviewNavigation.IdEmployeeCollaborator;
    this.formModalDialogService.openDialog(InterviewConstant.UPDATE_INTERVIEW,
      AddInterviewComponent, this.viewRef, this.onCloseInterviewModal.bind(this),
      this.postponeMode, true, SharedConstant.MODAL_DIALOG_SIZE_M);
  }

  public openDelayInterviewModal(interview: Interview) {
    this.postponeMode = [];
    this.postponeMode[InterviewConstant.REVIEW_MODE] = true;
    this.postponeMode[InterviewConstant.IS_DELAY_MODE] = true;
    this.postponeMode[InterviewConstant.IS_CHANGE_MODE] = false;
    this.postponeMode[InterviewConstant.INTERVIEW] = interview;
    this.postponeMode[InterviewConstant.ID_EMPLOYEE_NAVIGATION] = this.review.IdEmployeeCollaboratorNavigation;
    this.formModalDialogService.openDialog(InterviewConstant.DELAY_INTERVIEW,
      AddInterviewComponent, this.viewRef, this.onCloseInterviewModal.bind(this),
      this.postponeMode, true, SharedConstant.MODAL_DIALOG_SIZE_M);
  }

  public openPostponeInterviewDialog(interview) {
    this.postponeMode = [];
    this.postponeMode[InterviewConstant.IS_DELAY_MODE] = false;
    this.postponeMode[InterviewConstant.IS_CANCEL_MODE] = true;
    this.postponeMode[InterviewConstant.INTERVIEW] = interview;

    this.formModalDialogService.openDialog(InterviewConstant.CANCEL_INTERVIEW,
      PostponeInterviewComponent, this.viewRef, this.onCloseInterviewModal.bind(this),
      this.postponeMode, true, SharedConstant.MODAL_DIALOG_SIZE_M);
  }

  public deleteInterview(interview) {
    this.swalWarrings.CreateSwal().then((result) => {
      if (result.value) {
        this.interviewService.remove(interview).subscribe(() => {
          this.initInterviewForReviewList();
        });
      }
    });

  }

  allRequiredConfirmed(interview: Interview): boolean {
    const interviewMarkList = interview.InterviewMark;
    return interviewMarkList.filter(x => x.IsRequired &&
      x.Status !== InterviewMarkEnumerator.InterviewerAvailabilityConfirmed).length === NumberConstant.ZERO;
  }

  interviewIsValidForUpdate(interview: Interview): boolean {
    return (interview.Status !== this.inteviewEnumerator.InterviewDone) && (interview.Status !== this.inteviewEnumerator.InterviewRefused);
  }

  interviewIsValidForDelay(interview: Interview): boolean {
    return (interview.Status !== this.inteviewEnumerator.InterviewDone) && (interview.Status !== this.inteviewEnumerator.InterviewRefused);
  }

  interviewIsValidForCanceling(interview: Interview): boolean {
    return !(interview.Status === this.inteviewEnumerator.InterviewDone) &&
      !(interview.Status === this.inteviewEnumerator.InterviewRefused);
  }

  /* validations */

  interviewIsValidForDelete(interview: Interview): boolean {
    return !(interview.Status === this.inteviewEnumerator.InterviewDone) &&
      !(interview.Status === this.inteviewEnumerator.InterviewRequestedToCandidate) &&
      !(interview.Status === this.inteviewEnumerator.InterviewConfirmedByCandidate) &&
      !(interview.Status === this.inteviewEnumerator.InterviewRefused);
  }

  private preparePredicate() {
    this.predicate = new PredicateFormat();
    this.predicate.Filter = new Array<Filter>();
    this.predicate.Relation = new Array<Relation>();
    this.predicate.OrderBy = new Array<OrderBy>();
    this.predicate.OrderBy.push.apply(this.predicate.OrderBy,
      [new OrderBy(InterviewConstant.INTERVIEW_DATE, OrderByDirection.asc)]);
    this.predicate.Relation.push.apply(this.predicate.Relation,
      [new Relation(InterviewConstant.INTERVIEW_MARK)]);
    this.predicate.Relation.push.apply(this.predicate.Relation,
      [new Relation(InterviewConstant.ID_SUPERVISOR_NAVIGATION)]);
    this.predicate.Relation.push.apply(this.predicate.Relation,
      [new Relation(InterviewConstant.ID_REVIEW_NAVIGATION)]);
    this.predicate.Filter.push(new Filter(InterviewConstant.ID_REVIEW, Operation.eq, this.review.Id, false, true));
  }

  private initInterviewForReviewList() {
    this.listInterview = new Array<Interview>();
    this.preparePredicate();
    this.interviewService.reloadServerSideData(this.gridSettings.state, this.predicate).subscribe(interviewList => {
      for (const inter of interviewList.data) {
        this.listInterview.push(inter);
      }
    });
  }

  private prepareSingleModelPredicate(idInterview: number) {
    this.singleModelPredicate = new PredicateFormat();
    this.singleModelPredicate.Filter = new Array<Filter>();
    this.singleModelPredicate.Relation = new Array<Relation>();
    this.singleModelPredicate.Relation.push.apply(this.singleModelPredicate.Relation,
      [new Relation(InterviewConstant.INTERVIEW_MARK)]);
    this.singleModelPredicate.Relation.push.apply(this.singleModelPredicate.Relation,
      [new Relation(InterviewConstant.ID_SUPERVISOR_NAVIGATION)]);
    this.singleModelPredicate.Relation.push.apply(this.singleModelPredicate.Relation,
      [new Relation(InterviewConstant.ID_REVIEW_NAVIGATION)]);
    this.singleModelPredicate.Filter.push(new Filter(SharedConstant.ID, Operation.eq, idInterview, false, true));
  }

  private onCloseInterviewModal(data: any): void {
    this.actionSelected.emit();
    this.initInterviewForReviewList();
  }
}
