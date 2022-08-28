import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewContainerRef} from '@angular/core';
import {PagerSettings} from '@progress/kendo-angular-grid';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {State} from '@progress/kendo-data-query';
import {ColumnSettings} from '../../../shared/utils/column-settings.interface';
import {GridSettings} from '../../../shared/utils/grid-settings.interface';
import {FormModalDialogService} from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import {SwalWarring} from '../../../shared/components/swal/swal-popup';
import {AddInterviewComponent} from '../../../rh/interview/add-interview/add-interview.component';
import {Interview} from '../../../models/rh/interview.model';
import {InterviewService} from '../../../rh/services/interview/interview.service';
import {Filter, Operation, PredicateFormat, Relation} from '../../../shared/utils/predicate';
import {InterviewConstant} from '../../../constant/rh/interview.constant';
import {InterviewEnumerator, InterviewMarkEnumerator} from '../../../models/enumerators/interview.enum';
import {InterviewMark} from '../../../models/rh/interview-mark.model';
import {ExitEmployeeConstant} from '../../../constant/payroll/exit-employee.constant';
import {NewEmailComponent} from '../../../rh/components/new-email/new-email.component';
import {EmailEnumerator} from '../../../models/enumerators/email.enum';
import {PostponeInterviewComponent} from '../../../rh/components/postpone-interview/postpone-interview.component';
import {ExitEmployee} from '../../../models/payroll/exit-employee.model';
import {EmailHistoryComponent} from '../../../rh/components/email-history/email-history.component';
import {InterviewEmailService} from '../../../rh/services/interview-email/interview-email.service';
import {Subscription} from 'rxjs/Subscription';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { Employee } from '../../../models/payroll/employee.model';
import { EmployeeService } from '../../services/employee/employee.service';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-list-meeting-exit-employee',
  templateUrl: './list-meeting-exit-employee.component.html',
  styleUrls: ['./list-meeting-exit-employee.component.scss']
})
export class ListMeetingExitEmployeeComponent implements OnInit, OnDestroy {
  @Output() actionSelectedInterview = new EventEmitter<boolean>();
  @Input() employeeExit: ExitEmployee;
  @Input() isRefused: boolean;
  State: number;
  public postponeMode: any = [];
  public inteviewEnumerator = InterviewEnumerator;
  isModal = false;
  public employeeExitMode: any = [];
  listInterview: Array<Interview>;
  interviewPredicate: PredicateFormat;
  predicate: PredicateFormat;
  listIdEmployeeExit: Array<number>;
  public interview: Interview;
  public langList: Array<string> = ['fr', 'en'];
  /**
   * permissions
   */
   public hasUpdateInterviewPermission: boolean;
   public hasDelayInterviewPermission: boolean;
   public hasCancelInterviewPermission: boolean;
   public hasHistoryMailInterviewPermission: boolean;
   public hasDeleteInterviewPermission: boolean;
   public hasConfirmDisponibilityPermission: boolean;
   public hasInviteEmployeePermission: boolean;
   public hasAddInterviewPermission: boolean;
   public connectedEmployee: Employee;
  // # gridSettings
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public gridState: State = {
    skip: 0,
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
      field: InterviewConstant.INTERVIEW_DATE,
      title: InterviewConstant.MEETING_DATE,
      filterable: true,
      filter: 'date',
      format: this.translate.instant(SharedConstant.DATE_FORMAT),
      _width: NumberConstant.THREE_HUNDRED
    },
    {
      field: InterviewConstant.START_TIME,
      title: InterviewConstant.HOUR.toUpperCase(),
      filterable: true,
      format: this.translate.instant(SharedConstant.DATE_FORMAT),
      _width: NumberConstant.THREE_HUNDRED
    },
    {
      field: InterviewConstant.STATUS,
      title: InterviewConstant.STATUS_TITLE,
      filterable: true,
      filter: 'numeric',
      _width: NumberConstant.THREE_HUNDRED
    }
  ];
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };
  private subscriptions: Subscription[] = [];

  public formatDate = this.translate.instant(SharedConstant.DATE_FORMAT);
  constructor(private formModalDialogService: FormModalDialogService
    , private viewRef: ViewContainerRef, private swalWarrings: SwalWarring, private interviewService: InterviewService,
      public interviewEmailService: InterviewEmailService, public authService: AuthService, private employeeService: EmployeeService
      , private translate: TranslateService ) {
  }

  ngOnInit() {
    this.hasUpdateInterviewPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.UPDATE_INTERVIEW);
    this.hasDelayInterviewPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.DELAY_INTERVIEW_PERMISSION);
    this.hasCancelInterviewPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.CANCEL_INTERVIEW_PERMISSION);
    this.hasHistoryMailInterviewPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.INTERVIEW_MAIL_HISTORY);
    this.hasDeleteInterviewPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.DELETE_INTERVIEW);
    this.hasConfirmDisponibilityPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.CONFIRM_DISPONIBILITY);
    this.hasInviteEmployeePermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.INVITE_EMPLOYEE);
    this.hasAddInterviewPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.ADD_INTERVIEW);
    this.interviewPredicate = new PredicateFormat();
    this.employeeService.getConnectedEmployee().subscribe(data => {
      this.connectedEmployee = data;
    });
    this.initInterviewList();
  }

  public addHandler() {
    this.employeeExitMode[ExitEmployeeConstant.EMPLOYEE_EXIT_MODE] = true;
    this.employeeExitMode[ExitEmployeeConstant.EXIT_EMPLOYEE_ID] = this.employeeExit.Id;
    this.employeeExitMode[ExitEmployeeConstant.EMPLOYEE] = this.employeeExit;
    this.formModalDialogService.openDialog(ExitEmployeeConstant.ADD_MEETING,
      AddInterviewComponent, this.viewRef, this.onCloseMeetingModal.bind(this),
      this.employeeExitMode, true, SharedConstant.MODAL_DIALOG_SIZE_M);
  }

  public dataStateChange($event: State) {
    this.gridSettings.state = $event;
    this.interviewPredicate.pageSize = this.gridSettings.state.take;
    this.interviewPredicate.page = this.gridSettings.state.skip / this.gridSettings.state.take + NumberConstant.ONE;
    this.initInterviewList();
  }

  public getInterview(idInterview): Interview {
    return this.listInterview.find(x => x.Id === idInterview);
  }

  public getInterviewEmailHistoric(interview: Interview) {
    this.predicate = new PredicateFormat();
    this.predicate.Relation = new Array<Relation>();
    this.predicate.Filter = new Array<Filter>();
    this.predicate.Filter.push(new Filter(InterviewConstant.ID_INTERVIEW, Operation.eq, interview.Id));
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(InterviewConstant.ID_EMAIL_NAVIGATION)]);
    this.subscriptions.push(this.interviewEmailService.reloadServerSideData(this.historyEmailState, this.predicate).subscribe(res => {
      this.formModalDialogService.openDialog(InterviewConstant.MAIL_HISTORY,
        EmailHistoryComponent, this.viewRef, this.onCloseEmailModal.bind(this),
        res.data, true, SharedConstant.MODAL_DIALOG_SIZE_M);
    }));

  }
  private prepareInterviewPredicate() {
    this.interviewPredicate.Filter = new Array<Filter>();
    this.interviewPredicate.Filter.push(new Filter(ExitEmployeeConstant.ID_EXIT_EMPLOYEE, Operation.eq, this.employeeExit.Id));
    this.interviewPredicate.Relation = new Array<Relation>();
    this.interviewPredicate.Relation.push.apply(this.interviewPredicate.Relation, [new Relation
      (ExitEmployeeConstant.ID_EXIT_EMPLOYEE_NAVIGATION)]);
    this.interviewPredicate.Relation.push.apply(this.interviewPredicate.Relation, [new Relation
      (InterviewConstant.INTERVIEW_MARK)]);
  }


  public formatTime(): string {
    return SharedConstant.PIPE_FORMAT_TIME;
  }

  isInterviewMarkRequestedToInterviewer(interviewMarkStatus): boolean {
    return interviewMarkStatus === InterviewMarkEnumerator.InterviewMarkRequestedToInterviewer;
  }

  allRequiredConfirmed(interview): boolean {
    const interviewMarkList = interview.InterviewMark;
    return interviewMarkList.filter(x => x.IsRequired &&
      x.Status !== InterviewMarkEnumerator.InterviewerAvailabilityConfirmed).length === NumberConstant.ZERO;
  }

  confirmAvailability(interviewMark: InterviewMark) {
    this.subscriptions.push(this.interviewService.confirmAvailabilityForTheInterview(interviewMark).subscribe(() => {
      this.initInterviewList();
    }));
  }

  /**
   *prepare email to invite the employee
   * @param interview
   * @param lang
   */
  public prepareEmailHandler(interview: Interview, lang: string) {
    this.interview = interview;
    this.subscriptions.push(this.interviewService.generateInterviewEmail(interview, lang).subscribe(result => {
      interview.IdEmailNavigation = result;
      this.formModalDialogService.openDialog(InterviewConstant.INTERVIEW_INVITATION,
        NewEmailComponent, this.viewRef, this.onCloseEmailModal.bind(this),
        interview.IdEmailNavigation, true, SharedConstant.MODAL_DIALOG_SIZE_M);
    }));
  }

  public confirmCandidateDisponibility(interview: Interview) {
    this.subscriptions.push(this.interviewService.confirmCandidateDisponibility(interview).subscribe(() => {
      this.actionSelectedInterview.emit();
      this.initInterviewList();
    }));
  }

  public deleteInterview(interview: any) {
    this.swalWarrings.CreateSwal().then((result) => {
      if (result.value) {
        this.subscriptions.push(this.interviewService.remove(interview).subscribe(() => {
          this.initInterviewList();
        }));
      }
    });
  }

  /**
   *edit mode
   * @param id
   */
  public openEditInterviewModal(id: number) {
    this.postponeMode = [];
    this.postponeMode[InterviewConstant.IS_DELAY_MODE] = false;
    this.postponeMode[InterviewConstant.IS_CHANGE_MODE] = true;
    this.openModal(ExitEmployeeConstant.UPDATE_MEETING, this.postponeMode, id);
  }

  /**
   * open modal
   * @param title
   * @param postponeMode
   */
  public openModal(title: string, postponeMode: boolean, id: number) {
    const interview = this.getInterview(id);
    this.postponeMode[ExitEmployeeConstant.EMPLOYEE_EXIT_MODE] = true;
    this.postponeMode[InterviewConstant.INTERVIEW] = interview;
    this.formModalDialogService.openDialog(title,
      AddInterviewComponent, this.viewRef, this.onCloseMeetingModal.bind(this),
      this.postponeMode, true, SharedConstant.MODAL_DIALOG_SIZE_M);
  }

  /**
   * delay mode
   * @param id
   */
  public openDelayMeetingModal(id: number) {
    this.postponeMode = [];
    this.postponeMode[InterviewConstant.IS_DELAY_MODE] = true;
    this.postponeMode[InterviewConstant.IS_CHANGE_MODE] = false;
    this.openModal(ExitEmployeeConstant.DELAY_MEETING, this.postponeMode, id);
  }

  /**
   * cancel mode
   * @param id
   */
  public openPostponeInterviewDialog(id: number) {
    const interview = this.getInterview(id);
    this.postponeMode = [];
    this.postponeMode[InterviewConstant.IS_DELAY_MODE_MEETING] = false;
    this.postponeMode[InterviewConstant.IS_CANCEL_MODE_MEETING] = true;
    this.postponeMode[InterviewConstant.INTERVIEW] = interview;
    this.formModalDialogService.openDialog(ExitEmployeeConstant.CANCEL_MEETING,
      PostponeInterviewComponent, this.viewRef, this.onClosePostponeInterviewModal.bind(this),
      this.postponeMode, true, SharedConstant.MODAL_DIALOG_SIZE_M);
  }

  ngOnDestroy(): void {
    if (this.subscriptions !== undefined) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
  }

  private onCloseMeetingModal(data: any): void {
    this.actionSelectedInterview.emit();
    this.initInterviewList();
  }

  private initInterviewList() {
    this.listInterview = new Array<Interview>();
    this.prepareInterviewPredicate();
    this.subscriptions.push(this.interviewService.reloadServerSideData(this.gridSettings.state, this.interviewPredicate).subscribe(res => {
      if (res) {
        this.gridSettings.gridData = res;
        this.listInterview = res.data;
      }
    }));
  }


  private onCloseEmailModal(data: any): void {
    if (data &&
      data.Status === EmailEnumerator.SendRequested &&
      this.interview &&
      this.interview.Status < InterviewEnumerator.InterviewRequestedToCandidate) {
      this.subscriptions.push(this.interviewService.makeTheInterviewAsRequestedToCandidate(this.interview).subscribe(result => {
        this.initInterviewList();
      }));
    }
    this.initInterviewList();
  }

  private onClosePostponeInterviewModal(data: any): void {
    this.actionSelectedInterview.emit();
    this.initInterviewList();
  }
}
