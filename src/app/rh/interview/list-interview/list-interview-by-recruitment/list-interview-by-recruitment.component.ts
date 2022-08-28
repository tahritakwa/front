import { Component, EventEmitter, Input, OnInit, Output, ViewContainerRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PagerSettings } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { ExitEmployeeConstant } from '../../../../constant/payroll/exit-employee.constant';
import { InterviewConstant } from '../../../../constant/rh/interview.constant';
import { SharedConstant } from '../../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../../constant/utility/number.constant';
import { AuthService } from '../../../../login/Authentification/services/auth.service';
import { EmailEnumerator } from '../../../../models/enumerators/email.enum';
import { InterviewEnumerator, InterviewMarkEnumerator } from '../../../../models/enumerators/interview.enum';
import { RecruitmentState } from '../../../../models/enumerators/recruitment-state.enum';
import { Employee } from '../../../../models/payroll/employee.model';
import { InterviewMark } from '../../../../models/rh/interview-mark.model';
import { Interview } from '../../../../models/rh/interview.model';
import { EmployeeService } from '../../../../payroll/services/employee/employee.service';
import { SwalWarring } from '../../../../shared/components/swal/swal-popup';
import { FormModalDialogService } from '../../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { ColumnSettings } from '../../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../../shared/utils/grid-settings.interface';
import { Filter, Operation, OrderBy, OrderByDirection, PredicateFormat, Relation } from '../../../../shared/utils/predicate';
import { PermissionConstant } from '../../../../Structure/permission-constant';
import { EmailHistoryComponent } from '../../../components/email-history/email-history.component';
import { NewEmailComponent } from '../../../components/new-email/new-email.component';
import { InterviewEmailService } from '../../../services/interview-email/interview-email.service';
import { InterviewService } from '../../../services/interview/interview.service';
import { RecruitmentService } from '../../../services/recruitment/recruitment.service';
import { AddInterviewComponent } from '../../add-interview/add-interview.component';

@Component({
  selector: 'app-list-interview-by-recruitment',
  templateUrl: './list-interview-by-recruitment.component.html',
  styleUrls: ['./list-interview-by-recruitment.component.scss']
})
export class ListInterviewByRecruitmentComponent implements OnInit {

  // # begin attribut region
  @Output() actionSelected = new EventEmitter<boolean>();
  @Input() recruitmentId: number;
  recruitmentState: number;
  public inteviewEnumerator = InterviewEnumerator;
  public interviewOfCurrentEmail: Interview;
  public langList: Array<string> = ['fr', 'en'];
  public candidacyMode: any = [];
  public recruitmentCreationDate: Date;
  public predicate: PredicateFormat;
  /**
   * permissions
   */
   public hasUpdateInterviewPermission: boolean;
   public hasDelayInterviewPermission: boolean;
   public hasHistoryMailInterviewPermission: boolean;
   public hasDeleteInterviewPermission: boolean;
   public hasConfirmDisponibilityPermission: boolean;
   public hasInviteEmployeePermission: boolean;
   public connectedEmployee: Employee;
   public hasAddInterviewPermission: boolean;
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
  public historyEmailState: State = {
    skip: 0,
    take: NumberConstant.TEN as number,
    filter: {
      logic: SharedConstant.LOGIC_AND,
      filters: []
    }
  };
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
      title: InterviewConstant.START_TIME_UPPER_CASE,
      filterable: true,
      format: this.translate.instant(SharedConstant.DATE_FORMAT),
      _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: InterviewConstant.END_TIME,
      title: InterviewConstant.END_TIME_UPPER_CASE,
      filterable: true,
      format: this.translate.instant(SharedConstant.DATE_FORMAT),
      _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: InterviewConstant.INTERVIEW_TYPE_LABEL,
      title: InterviewConstant.INTERVIEW_TYPE_UPPERCASE,
      filterable: true,
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
  states = RecruitmentState;

  constructor(public interviewService: InterviewService,
              public interviewEmailService: InterviewEmailService,
              private translate: TranslateService,
              private swalWarrings: SwalWarring,
              private formModalDialogService: FormModalDialogService,
              private viewRef: ViewContainerRef,
              private recruitmentService: RecruitmentService,
              public authService: AuthService, private employeeService: EmployeeService) {
  }

  // # begin ng region
  ngOnInit() {
    this.hasUpdateInterviewPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.UPDATE_INTERVIEW);
    this.hasDelayInterviewPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.DELAY_INTERVIEW_PERMISSION);
    this.hasHistoryMailInterviewPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.INTERVIEW_MAIL_HISTORY);
    this.hasDeleteInterviewPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.DELETE_INTERVIEW);
    this.hasConfirmDisponibilityPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.CONFIRM_DISPONIBILITY);
    this.hasInviteEmployeePermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.INVITE_EMPLOYEE);
    this.hasAddInterviewPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.ADD_INTERVIEW);
    this.employeeService.getConnectedEmployee().subscribe(data => {
      this.connectedEmployee = data;
    });
    this.initGridDataSource();
  }

  // # end ng region

  // # begin method region
  public removeHandler({dataItem}) {
    this.swalWarrings.CreateSwal().then((result) => {
      if (result.value) {
        this.interviewService.remove(dataItem).subscribe(() => {
          this.initGridDataSource();
        });
      }
    });
  }

  public addHandler() {
    this.candidacyMode = [];
    this.candidacyMode[InterviewConstant.CANDIDACY_MODE] = true;
    this.candidacyMode[InterviewConstant.ID_RECRUITMENT] = this.recruitmentId;
    this.candidacyMode[InterviewConstant.RECRUITMENT_CREATION_DATE] = this.recruitmentCreationDate;
    this.formModalDialogService.openDialog(InterviewConstant.ADD_AN_INTERVIEW,
      AddInterviewComponent, this.viewRef, this.onCloseInterviewModal.bind(this),
      this.candidacyMode, true, SharedConstant.MODAL_DIALOG_SIZE_M);
  }

  /**
   *edit mode
   * @param id
   */
  public openEditInterviewModal(dataItem) {
    this.candidacyMode = [];
    this.candidacyMode[InterviewConstant.IS_DELAY_MODE] = false;
    this.candidacyMode[InterviewConstant.IS_CHANGE_MODE] = true;
    this.openModal(ExitEmployeeConstant.UPDATE_MEETING, dataItem);
  }

  /**
   * open modal
   * @param title
   * @param postponeMode
   */
  public openModal(title: string, interview) {
    // const interview = this.getInterview(id);
    this.candidacyMode[InterviewConstant.CANDIDACY_MODE] = true;
    this.candidacyMode[InterviewConstant.INTERVIEW] = interview;
    this.formModalDialogService.openDialog(title,
      AddInterviewComponent, this.viewRef, this.onCloseInterviewModal.bind(this),
      this.candidacyMode, true, SharedConstant.MODAL_DIALOG_SIZE_M);
  }

  /**
   * delay mode
   * @param id
   */
  public openDelayMeetingModal(dataItem) {
    this.candidacyMode = [];
    this.candidacyMode[InterviewConstant.IS_DELAY_MODE] = true;
    this.candidacyMode[InterviewConstant.IS_CHANGE_MODE] = false;
    this.openModal(ExitEmployeeConstant.DELAY_MEETING, dataItem);
  }

  public prepareEmailHandler(interview: Interview, lang: string) {
    this.interviewOfCurrentEmail = interview;
    this.interviewService.generateInterviewEmail(interview, lang).subscribe(result => {
      interview.IdEmailNavigation = result;
      this.formModalDialogService.openDialog(InterviewConstant.INTERVIEW_INVITATION,
        NewEmailComponent, this.viewRef, this.onCloseEmailModal.bind(this),
        interview.IdEmailNavigation, true, SharedConstant.MODAL_DIALOG_SIZE_M);
    });

  }

  public getInterviewEmailHistoric(interview: Interview) {
    this.predicate = new PredicateFormat();
    this.predicate.Relation = new Array<Relation>();
    this.predicate.Filter = new Array<Filter>();
    this.predicate.Filter.push(new Filter(InterviewConstant.ID_INTERVIEW, Operation.eq, interview.Id));
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(InterviewConstant.ID_EMAIL_NAVIGATION)]);
    this.interviewEmailService.reloadServerSideData(this.historyEmailState, this.predicate).subscribe(res => {
      this.formModalDialogService.openDialog(InterviewConstant.MAIL_HISTORY,
        EmailHistoryComponent, this.viewRef, this.onCloseEmailModal.bind(this),
        res.data, true, SharedConstant.MODAL_DIALOG_SIZE_M);
    });
  }

  public confirmCandidateDisponibility(interview: Interview) {
    this.interviewService.confirmCandidateDisponibility(interview).subscribe(() => {
      this.actionSelected.emit();
    });
  }

  initGridDataSource() {
    this.interviewService.reloadServerSideData(this.gridSettings.state, this.preparePredicate()).subscribe(data => {
      this.gridSettings.gridData = data;
      this.initRecruitmentState();
    });
  }

  initRecruitmentState(): any {
    this.recruitmentService.getById(this.recruitmentId).subscribe(result => {
      this.recruitmentState = result.State;
      this.recruitmentCreationDate = result.CreationDate;
    });
  }

  public dataStateChange(state: State): void {
    this.gridSettings.state = state;
    this.initGridDataSource();
  }

  preparePredicate(): PredicateFormat {
    const myPredicate = new PredicateFormat();

    if (this.recruitmentId) {
      myPredicate.Filter = new Array<Filter>();
      myPredicate.Filter.push(new Filter(InterviewConstant.RECRUITMENT_NAVIGATION_ID, Operation.eq, this.recruitmentId));
    }

    myPredicate.Relation = new Array<Relation>();
    myPredicate.Relation.push.apply(myPredicate.Relation,
      [new Relation(InterviewConstant.ID_CANDIDACY_NAVIGATION)]);
    myPredicate.Relation.push.apply(myPredicate.Relation,
      [new Relation(InterviewConstant.ID_INTERVIEW_TYPE_NAVIGATION)]);
    myPredicate.Relation.push.apply(myPredicate.Relation,
      [new Relation(InterviewConstant.CANDIDACY_ID_CANDIDATE_NAVIGATION)]);
    myPredicate.Relation.push.apply(myPredicate.Relation,
      [new Relation(InterviewConstant.INTERVIEW_MARK)]);
    myPredicate.Relation.push.apply(myPredicate.Relation,
      [new Relation(InterviewConstant.ID_EMAIL_NAVIGATION)]);

    myPredicate.OrderBy = new Array<OrderBy>();
    myPredicate.OrderBy.push.apply(myPredicate.OrderBy,
      [new OrderBy(InterviewConstant.FIRST_NAME_FILTRE, OrderByDirection.asc)]);

    return myPredicate;
  }
  isInterviewMarkRequestedToInterviewer(interviewMarkStatus): boolean {
    return interviewMarkStatus === InterviewMarkEnumerator.InterviewMarkRequestedToInterviewer;
  }

  isCurrentRecruitmentCompleted(): boolean {
    return this.recruitmentState === RecruitmentState.Closed;
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

  confirmAvailability(interviewMark: InterviewMark) {
    this.interviewService.confirmAvailabilityForTheInterview(interviewMark).subscribe(() => {
      this.initGridDataSource();
    });
  }

  private onCloseInterviewModal(data: any): void {
    this.actionSelected.emit();
  }

  private onCloseEmailModal(data: any): void {
    if (data &&
      data.Status === EmailEnumerator.SendRequested &&
      this.interviewOfCurrentEmail &&
      this.interviewOfCurrentEmail.Status < InterviewEnumerator.InterviewRequestedToCandidate) {
      this.interviewService.makeTheInterviewAsRequestedToCandidate(this.interviewOfCurrentEmail).subscribe(result => {
        this.initGridDataSource();
      });
    }
    this.initGridDataSource();
  }

  // # end method region
}
