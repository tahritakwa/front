import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewContainerRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DataResult, State } from '@progress/kendo-data-query';
import { Subscription } from 'rxjs/Subscription';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { InterviewMarkConstant } from '../../../constant/rh/interview-mark.constant';
import { InterviewConstant } from '../../../constant/rh/interview.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { EmailEnumerator } from '../../../models/enumerators/email.enum';
import { InterviewEnumerator, InterviewMarkEnumerator } from '../../../models/enumerators/interview.enum';
import { Employee } from '../../../models/payroll/employee.model';
import { InterviewMark } from '../../../models/rh/interview-mark.model';
import { Interview } from '../../../models/rh/interview.model';
import { Review } from '../../../models/rh/Review.model';
import { EmployeeService } from '../../../payroll/services/employee/employee.service';
import { FormModalDialogService } from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { NewEmailComponent } from '../../components/new-email/new-email.component';
import { InterviewMarkService } from '../../services/interview-mark/interview-mark.service';
import { InterviewService } from '../../services/interview/interview.service';

@Component({
  selector: 'app-list-interview-mark',
  templateUrl: './list-interview-mark.component.html',
  styleUrls: ['./list-interview-mark.component.scss']
})
export class ListInterviewMarkComponent implements OnInit, OnChanges, OnDestroy {

  @Input() interview: Interview;
  @Input() review: Review;
  @Output() confirmation = new EventEmitter<number>();
  public interviewMarkEnumerator = InterviewMarkEnumerator;
  public interviewEnumerator = InterviewEnumerator;
  public interviewOfCurrentEmail: Interview;
  public langList: Array<string> = ['fr', 'en'];
  /**
   * permissions
   */
  public hasRemindInterviewerPermission: boolean;
  public hasConfirmDisponibilityPermission: boolean;
  public connectedEmployee: Employee;
  public isCollaborator: boolean;
  canConfirmEmployee = false;

  // access flags
  employeeInvitedNotConfirmed = false;
  canInviteEmployee = false;
  // pager and grid settings for interviewMark
  public interviewGridState: State = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.TEN,
    filter: {
      logic: 'and',
      filters: []
    }
  };
  public ColumnsConfig: ColumnSettings[] = [
    {
      field: InterviewMarkConstant.ID_EMPLOYEE_NAVIGATION_FULL_NAME,
      title: InterviewMarkConstant.INTERVIEWERS,
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED_FIFTY
    },
    {
      field: InterviewMarkConstant.IS_REQUIRED,
      title: InterviewMarkConstant.PRESENCE,
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED_FIFTY
    },
    {
      field: InterviewMarkConstant.STATUS,
      title: InterviewMarkConstant.STATUS.toUpperCase(),
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED_FIFTY
    }
  ];
  public gridSettings: GridSettings = {
    state: this.interviewGridState,
    columnsConfig: this.ColumnsConfig,
  };
  private subscriptions: Subscription[] = [];

  // end pager and grid setting

  constructor(private interviewService: InterviewService,
              private formModalDialogService: FormModalDialogService,
              private viewRef: ViewContainerRef,
              private employeeService: EmployeeService,
              private authService: AuthService, private growlService: GrowlService,
              private translateService: TranslateService) {
  }

  ngOnInit() {
    this.hasRemindInterviewerPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.REMIND_INTERVIEWER_PERMISSION);
    this.hasConfirmDisponibilityPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.CONFIRM_DISPONIBILITY);
    this.initDataGrid();
    this.employeeService.getConnectedEmployee().subscribe(dataResult => {
      this.connectedEmployee = dataResult;
      if (this.interview !== undefined && this.review !== undefined) {
        this.isCollaborator = (this.connectedEmployee.Id === this.review.IdEmployeeCollaborator);
      }
      this.manageAccess();
    });
    this.manageState();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.initDataGrid();
  }

  initDataGrid() {
    if (this.interview !== undefined) {
      const dataResult: DataResult = {
        data: this.interview.InterviewMark,
        total: this.interview.InterviewMark.length,
      };
      this.gridSettings.gridData = dataResult;
    }
  }

  confirmAvailability(interviewMark: InterviewMark) {
    this.subscriptions.push(this.interviewService.confirmAvailabilityForTheInterview(interviewMark).subscribe(() => {
      this.confirmation.emit(interviewMark.IdInterview);
    }));
  }

  public confirmCandidateDisponibility(interview: Interview) {
    this.subscriptions.push(this.interviewService.confirmCandidateDisponibility(interview).subscribe(() => {
      this.confirmation.emit(interview.Id);
    }));
  }

  // open send email modal
  public prepareEmailHandler(interview: Interview, lang: string) {
    this.interviewOfCurrentEmail = interview;
    this.subscriptions.push(this.interviewService.generateInterviewEmail(interview, lang).subscribe(result => {
      interview.IdEmailNavigation = result;
      this.formModalDialogService.openDialog(InterviewConstant.INTERVIEW_INVITATION,
        NewEmailComponent, this.viewRef, this.onCloseEmailModal.bind(this),
        interview.IdEmailNavigation, true, SharedConstant.MODAL_DIALOG_SIZE_M);
    }));
  }

  allRequiredConfirmed(interview: Interview): boolean {
    const interviewMarkList = interview.InterviewMark;
    return interviewMarkList.filter(x => x.IsRequired &&
      x.Status !== InterviewMarkEnumerator.InterviewerAvailabilityConfirmed).length === NumberConstant.ZERO;
  }

  /* validations */

  isInterviewMarkRequestedToInterviewer(interviewMarkStatus): boolean {
    return interviewMarkStatus === InterviewMarkEnumerator.InterviewMarkRequestedToInterviewer;
  }

  isInterviewRefused(interviewStatus): boolean {
    return interviewStatus === InterviewEnumerator.InterviewRefused;
  }

  // Resend email to an interviewer who didn't confirm availability
  resendEmail(interviewMark: InterviewMark) {
    this.subscriptions.push(this.interviewService.resendEmailToInterviewer(this.interview, interviewMark.IdEmployee).subscribe(() => {
      this.growlService.InfoNotification(this.translateService.instant(InterviewMarkConstant.EMAIL_REMINDER_FOR_INTERVIEWER) + ' ' +
        interviewMark.IdEmployeeNavigation.FullName);
    }));
  }

    manageAccess() {
      if (this.hasConfirmDisponibilityPermission) {
        this.canConfirmEmployee = true;
        this.canInviteEmployee = true;
      }
      if (this.connectedEmployee.Id === this.review.IdEmployeeCollaborator) {
         this.canConfirmEmployee = true;
      }
    }

  manageState() {
    if (this.interview.Status === this.interviewEnumerator.InterviewRequestedToCandidate &&
      this.allRequiredConfirmed(this.interview)) {
      this.employeeInvitedNotConfirmed = true;
    }
  }

  // access

  ngOnDestroy(): void {
    if (this.subscriptions !== undefined) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
  }

  private onCloseEmailModal(data: any): void {
    if (data &&
      data.Status === EmailEnumerator.SendRequested &&
      this.interviewOfCurrentEmail &&
      this.interviewOfCurrentEmail.Status < InterviewEnumerator.InterviewRequestedToCandidate) {
      this.subscriptions.push(this.interviewService.makeTheInterviewAsRequestedToCandidate(this.interviewOfCurrentEmail).subscribe(result => {
        this.confirmation.emit(this.interview.Id);
      }));
    }
  }
}
