import { Component, OnInit, ViewChild, OnDestroy, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ValidationService, dateValueGT } from '../../../shared/services/validation/validation.service';
import { FileInfo } from '../../../models/shared/objectToSend';
import { LeaveRequestConstant } from '../../../constant/payroll/leave.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { Leave } from '../../../models/payroll/leave.model';
import { LeaveService } from '../../services/leave/leave.service';
import { DatePipe } from '@angular/common';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { AdministrativeDocumentStatusEnumerator } from '../../../models/enumerators/administrative-document-status.enum';
import { Employee } from '../../../models/payroll/employee.model';
import { EmployeeService } from '../../services/employee/employee.service';
import { Comment } from '../../../models/shared/comment.model';
import { CommentService } from '../../../shared/services/signalr/comment/comment.service';
import { CreatedData } from '../../../models/shared/created-data.model';
import { InformationTypeEnum } from '../../../shared/services/signalr/information/information.enum';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { AdministrativeDocumentConstant } from '../../../constant/payroll/administrative-document-constant';
import { EmployeeDropdownComponent } from '../../../shared/components/employee-dropdown/employee-dropdown.component';
import { isNullOrUndefined } from 'util';
import { DayHour } from '../../../models/shared/day-hour.model';
import { FormModalDialogService } from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { OvershootLeaveModalComponent } from '../../components/overshoot-leave-modal/overshoot-leave-modal.component';
import { PredicateFormat, Filter } from '../../../shared/utils/predicate';
import { LeaveType } from '../../../models/payroll/leave-type.model';
import { LeaveRemainingBalance } from '../../../models/shared/leave-remaining-balance.model';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import {LocalStorageService} from '../../../login/Authentification/services/local-storage-service';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';

@Component({
  selector: 'app-leave-request-add',
  templateUrl: './leave-request-add.component.html',
  styleUrls: ['./leave-request-add.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    DatePipe
  ]
})
export class LeaveRequestAddComponent implements OnInit, OnDestroy {

  @ViewChild('allEmployeeDropdown') allEmployeeDropdown: EmployeeDropdownComponent;
  @ViewChild('hierarchyEmployeeDropdown') hierarchyEmployeeDropdown: EmployeeDropdownComponent;
  /**
   * is updateMode
   */
  public isUpdateMode = false;
  /**
   * Set true if component is call for validation
   */
  public isValidateMode = false;
  /**
   * Leave Form Group
   */
  public leaveAddFormGroup: FormGroup;
  /**
   * Employee leave documents associated
   */
  public leaveAttachementFileInfo: Array<FileInfo>;
  public daysHoursRemaining: DayHour;
  public leaveAlreadyValidate;
  public myLeave = true;
  public predicateLeaveType: PredicateFormat;
  // The Id of th connected Empployee
  public selectedEmployee = NumberConstant.ZERO;
  public employeeAssociated: Employee;
  public currentEmployee: Employee;
  public leavesList: Leave[] = [];
  // Is true if the connected user has the right to update or to validate the request
  public hasRight = false;
  public leaveRemainingBalance: LeaveRemainingBalance;
  public newLeaveRemainingBalance: LeaveRemainingBalance;
  searchPredicate: PredicateFormat;
  idCommentToEdit = NumberConstant.ZERO;
  toEditComent: Comment;
  public tab = false;
  /**
   * Leave to update
   */
  public leaveToUpdate: Leave;
  /**
   * Format Date
   */
  public formatDate: string = this.translate.instant(SharedConstant.DATE_FORMAT);
  // Enum  Waiting , Accepted , Refused
  public statusCode = AdministrativeDocumentStatusEnumerator;
  // List of comments
  public commentsData: Comment[] = [];
  public startDateTime: Date;
  public endDateTime: Date;
  public startDate: Date;
  public updateDayshoursNumberCalculate: Number;
  required = false;
  public hasUpdatePermission: boolean;
  public hasValidateAllLeaveRequestPermission: boolean;
  public hasAddPermission: boolean;
  public hasCancelPermission: boolean;
  public hasValidatePermission: boolean;
  public hasRefusePermission: boolean;
  public hasListPermission: boolean;
  /**
   * Contain the id of leave to update or validate
   */
  private idLeave: number;
  private isSaveOperation = false;
  private subscriptions: Subscription[] = [];
  connectedEmployee: Employee;
  public isUpperHierrarchyOrTeamManager = false;

  /**
   * Constructor
   */
  constructor(public leaveService: LeaveService, private fb: FormBuilder,
              private activatedRoute: ActivatedRoute, private router: Router,
              private validationService: ValidationService,
              private swalWarrings: SwalWarring,
              private formModalDialogService: FormModalDialogService,
              private viewRef: ViewContainerRef,
              private commentService: CommentService,
              private employeeService: EmployeeService,
              private translate: TranslateService, private growlService: GrowlService,
      private swalWarring: SwalWarring, public authService: AuthService, private localStorageService: LocalStorageService) {
    this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
      this.idLeave = +params[SharedConstant.ID_LOWERCASE] || NumberConstant.ZERO;
      this.isUpdateMode = this.idLeave > NumberConstant.ZERO;
      this.leaveAttachementFileInfo = new Array<FileInfo>();
    }));
    this.employeeService.getConnectedEmployee().subscribe(connectedEmployee => {
      this.employeeAssociated = connectedEmployee;
    });
  }

  /**
   *  Start Date getter
   */
  get StartDate(): FormControl {
    return this.leaveAddFormGroup.get(SharedConstant.START_DATE) as FormControl;
  }

  /**
   *  End Date getter
   */
  get EndDate(): FormControl {
    return this.leaveAddFormGroup.get(SharedConstant.END_DATE) as FormControl;
  }

  get IdLeaveType(): FormControl {
    return this.leaveAddFormGroup.get(LeaveRequestConstant.ID_LEAVE_TYPE) as FormControl;
  }

  get Description(): FormControl {
    return this.leaveAddFormGroup.get(LeaveRequestConstant.DESCRIPTION) as FormControl;
  }

  get StartTime(): FormControl {
    return this.leaveAddFormGroup.get(LeaveRequestConstant.START_TIME) as FormControl;
  }

  get EndTime(): FormControl {
    return this.leaveAddFormGroup.get(LeaveRequestConstant.END_TIME) as FormControl;
  }

  get Comment(): FormControl {
    return this.leaveAddFormGroup.get(LeaveRequestConstant.COMMENT) as FormControl;
  }

  get IdEmployee(): FormControl {
    return this.leaveAddFormGroup.get(LeaveRequestConstant.EMPLOYEE_ID) as FormControl;
  }

  get Message(): FormControl {
    return this.leaveAddFormGroup.get(SharedConstant.MESSAGE) as FormControl;
  }

  get Status(): FormControl {
    return this.leaveAddFormGroup.get(LeaveRequestConstant.STATUS) as FormControl;
  }

  ngOnInit() {
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.ADD_LEAVE);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.UPDATE_LEAVE);
    this.hasValidatePermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.VALIDATE_LEAVE);
    this.hasRefusePermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.REFUSE_LEAVE);
    this.hasCancelPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.CANCEL_LEAVE);
    this.hasListPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.LIST_LEAVE);
    this.searchPredicate = new PredicateFormat();
    this.searchPredicate.Filter = new Array<Filter>();
    this.createAddForm();
    this.subscriptions.push(this.employeeService.getConnectedEmployee().subscribe((res: Employee) => {
        this.connectedEmployee = res;
        this.employeeAssociated = this.connectedEmployee;
        if (this.isUpdateMode) {
          this.getDataToUpdate();
        } else {
          this.setFormToDefault();
          this.selectedEmployee = this.connectedEmployee.Id;
          this.leaveAddFormGroup.controls[LeaveRequestConstant.EMPLOYEE_ID].setValue(this.selectedEmployee);
          this.leaveAttachementFileInfo = new Array<FileInfo>();
        }
      })
    );
    this.commentService.initCommentHubConnection();
    this.subscribeOnCommentList();
  }

  ngOnDestroy(): void {
    this.commentService.destroyCommentHubConnection();
    if (this.subscriptions !== undefined) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
  }

  /**
   * Set the form to his default values
   */
  setFormToDefault(date?: Date) {
    if (!date) {
      date = new Date();
      this.startDateTime = date;
      this.endDateTime = date;
    }
    this.subscriptions.push(this.leaveService.getHoursPeriodOfDate(date).subscribe(data => {
      this.leaveToUpdate = new Leave();
      this.leaveToUpdate.Id = NumberConstant.ZERO;
      this.leaveToUpdate.IdEmployee = this.selectedEmployee;
      this.leaveToUpdate.StartDate = date;
      this.leaveToUpdate.EndDate = date;
      this.leaveToUpdate.StartTime = data[NumberConstant.ZERO][SharedConstant.VALUE];
      this.leaveToUpdate.EndTime = data[data.length - NumberConstant.ONE][SharedConstant.VALUE];
      this.leaveAddFormGroup.patchValue(this.leaveToUpdate);
      if (this.allEmployeeDropdown) {
        this.allEmployeeDropdown.initDataSource();
      } else if (this.hierarchyEmployeeDropdown) {
        this.hierarchyEmployeeDropdown.initDataSource();
      }
    }));
  }

  /**
   * Add Leave request
   */
  public save(leaveType: LeaveType, isAuthorizedOvertaking: boolean): void {
    if (this.leaveAddFormGroup.valid) {
      const leaveAssign: Leave = Object.assign({}, this.leaveToUpdate, this.leaveAddFormGroup.getRawValue());
      leaveAssign.IdLeaveTypeNavigation = leaveType;
      leaveAssign.IdLeaveTypeNavigation.AuthorizedOvertaking = isAuthorizedOvertaking;
      // Save file
      if (this.leaveAttachementFileInfo.length !== NumberConstant.ZERO) {
        leaveAssign.LeaveFileInfo = this.leaveAttachementFileInfo;
      }
      this.fixDateLag(leaveAssign);
      this.isSaveOperation = true;
      // Save or update the leave
      this.subscriptions.push(this.leaveService.save(leaveAssign, !this.isUpdateMode).subscribe((res) => {
        if (this.hasListPermission) {
          this.router.navigate([LeaveRequestConstant.LEAVE_LIST_URL]);
        } else {
          this.leaveAttachementFileInfo = new Array<FileInfo>();
          this.ngOnInit();
        }
      }));
    } else {
      this.validationService.validateAllFormFields(this.leaveAddFormGroup);
    }

  }

  /**
   * validate overshoot Leave informations befor save action
   */
  public validateOvershootLeaveBeforSave(): void {
    if (this.leaveAddFormGroup.valid && this.validateDocumentRequiredCondition()) {
      const leave: Leave = Object.assign({}, this.leaveToUpdate, this.leaveAddFormGroup.value);
      if (!this.leaveToUpdate.IdLeaveTypeNavigation.AuthorizedOvertaking && this.leaveToUpdate.LeaveBalanceRemaining &&
        (this.leaveToUpdate.LeaveBalanceRemaining.Day < NumberConstant.ZERO ||
          this.leaveToUpdate.LeaveBalanceRemaining.Hour < NumberConstant.ZERO)) {
        this.setOvershootleaveInformations(leave);
      } else {
        this.save(leave.IdLeaveTypeNavigation, true);
      }
    } else {
      this.validationService.validateAllFormFields(this.leaveAddFormGroup);
    }
  }

  /**
   * Opens the information model for overshoot leave information
   */
  public setOvershootleaveInformations(leave: Leave) {
    if (this.leaveToUpdate.CurrentBalance &&
      (this.leaveToUpdate.CurrentBalance.Day > NumberConstant.ZERO || this.leaveToUpdate.CurrentBalance.Hour > NumberConstant.ZERO)) {
      this.swalWarring.CreateSwal(LeaveRequestConstant.CONVERT_LEAVE_SURPLUS, SharedConstant.WARNING,
        SharedConstant.YES, SharedConstant.NO).then((res) => {
        if (res.value) {
          this.subscriptions.push(this.leaveService.getTwoLeavesDecomposedFromNegativeBalanceLeave(leave).subscribe(levaes => {
            const primaryLeave = levaes.objectData.find(x => x.CurrentBalance);
            this.EndDate.patchValue(new Date(primaryLeave.EndDate));
            this.EndTime.patchValue(primaryLeave.EndTime);
            this.leaveToUpdate = primaryLeave;
            this.isSaveOperation = true;
            // Save file
            if (this.leaveAttachementFileInfo.length !== NumberConstant.ZERO) {
              primaryLeave.LeaveFileInfo = this.leaveAttachementFileInfo;
            }
            this.formModalDialogService.openDialog(LeaveRequestConstant.LEAVE_CONVERSION,
              OvershootLeaveModalComponent, this.viewRef, null,
              levaes, true, SharedConstant.MODAL_DIALOG_SIZE_ML);
          }));
        } else {
          this.growlService.warningNotification(`${this.translate.instant(SharedConstant.VALIDATION_CURRENT_DAY_HOUR_REMINING)}`);
        }
      });
    } else {
      this.growlService.warningNotification(`${this.translate.instant(SharedConstant.VALIDATION_CURRENT_DAY_HOUR_REMINING)}`);
    }
  }

  checkRights() {
    this.myLeave = this.leaveToUpdate.IdEmployee === this.connectedEmployee.Id;
    if (!((!this.myLeave && this.isUpperHierrarchyOrTeamManager) || (this.isUpdateMode && this.myLeave) || this.hasValidatePermission)) {
      this.isSaveOperation = true;
    }
  }

  prepareCommentsList() {
    // Prepare Comment list
    this.commentsData = this.leaveToUpdate.Comments;
    this.commentsData.forEach((x) => {
      this.getSrcPictureEmployee(x);
    });
  }

  checkIfDocumentHasBeenAlreadyValidated() {
    // Disable the input fields if the leave state is not: Waiting or if the leave endDate < todays date
    if (this.leaveToUpdate.Status !== AdministrativeDocumentStatusEnumerator.Waiting) {
      this.leaveAddFormGroup.disable();
      this.leaveAddFormGroup.get(SharedConstant.MESSAGE).enable();
      this.leaveAlreadyValidate = true;
    } else {
      this.leaveAlreadyValidate = false;
    }
  }

  deletecomment(idComment: number) {
    const element = this.commentsData.find(x => x.Id === idComment);
    if (element && element.Employee.Id === this.connectedEmployee.Id) {
      this.commentService.remove(element).subscribe(() => {
        const index = this.commentsData.findIndex(x => x.Id === idComment);
        this.commentsData.splice(index, NumberConstant.ONE);
        this.Message.reset();
      });
    } else {
      this.growlService.warningNotification(this.translate.instant(SharedConstant.UNAUTHRIZED_ERROR_MSG));
    }
  }

  editcomment(idComment: number) {
    const element = this.commentsData.find(x => x.Id === idComment);
    if (element && element.Employee.Id === this.connectedEmployee.Id) {
      this.Message.setValue(element.Message);
      this.idCommentToEdit = element.Id;
      this.toEditComent = element;
    } else {
      this.growlService.warningNotification(this.translate.instant(SharedConstant.UNAUTHRIZED_ERROR_MSG));
    }
  }

  /**
   * set the endDate value to the startDate if the startDate > endDate
   * @param event
   */
  public startDateValueChange(selectedDate: Date) {
    if (selectedDate) {
      this.startDateTime = selectedDate;

      this.subscriptions.push(this.leaveService.getHoursPeriodOfDate(selectedDate).subscribe((data) => {
        if (this.StartDate.value > this.EndDate.value) {
          this.EndDate.setValue(selectedDate);
          this.endDateTime = selectedDate;
          const endTime = data.find(x => x.Value === this.EndTime.value);
          if (endTime) {
            this.EndTime.patchValue(endTime.Value);
          } else {
            this.EndTime.patchValue(data[data.length - NumberConstant.ONE][SharedConstant.VALUE]);
          }
        }
        // if the hours dropdown contains the startTime
        const startTime = data.find(x => x.Value === this.StartTime.value);
        if (startTime) {
          this.StartTime.patchValue(startTime.Value);
        } else {
          this.StartTime.patchValue(data[NumberConstant.ZERO][SharedConstant.VALUE]);
        }
        if (this.IdLeaveType.valid) {
          this.calculateNumberOfDays();
        }
      }));
    }
  }

  /**
   * set the startDate minValue to the endDate if the endDate < startDate
   * @param event
   */
  public endDateValueChange(selectedDate: Date) {
    this.endDateTime = selectedDate;
    if (selectedDate) {
      this.subscriptions.push(this.leaveService.getHoursPeriodOfDate(this.endDateTime).subscribe((data) => {
        if (selectedDate < this.StartDate.value) {
          this.StartDate.setValue(selectedDate);
          this.startDateTime = selectedDate;
          const startTime = data.find(x => x.Value === this.StartTime.value);
          if (startTime) {
            this.StartTime.patchValue(startTime.Value);
          } else {
            this.StartTime.patchValue(data[NumberConstant.ZERO][SharedConstant.VALUE]);
          }
        }
        const endTime = data.find(x => x.Value === this.EndTime.value);
        if (endTime) {
          this.EndTime.patchValue(endTime.Value);
        } else {
          this.EndTime.patchValue(data[data.length - NumberConstant.ONE][SharedConstant.VALUE]);
        }
        if (this.IdLeaveType.valid) {
          this.calculateNumberOfDays();
        }
      }));
    }
  }

  /**
   * When time dropdown value is changed, calculate new value of Days and Hours number.
   * @param time
   */
  public timeValueChange() {
    if (this.IdLeaveType.valid) {
      this.calculateNumberOfDays();
    }
  }

  /**
   * count number of days
   */
  calculateNumberOfDays() {
    if (!isNullOrUndefined(this.IdLeaveType.value) && this.IdLeaveType.value !== '') {
      const leave: Leave = Object.assign({}, this.leaveToUpdate, this.leaveAddFormGroup.value);
      this.fixDateLag(leave);
      leave.IdLeaveType = this.IdLeaveType.value;
      this.leaveService.CalculateLeaveBalance(leave).subscribe(leaveData => {
        this.leaveToUpdate = leaveData;
      });
    }
  }

  /**
   * Accept or reject request
   * @param state
   */
  public setRequestState(state) {
    this.swalWarrings.CreateSwal(this.getSwalText(state), null, AdministrativeDocumentConstant.OKAY).then((result) => {
      if (result.value) {
        this.Status.setValue(state);
        if (this.leaveAddFormGroup.valid) {
          const leaveAssign: Leave = Object.assign({}, this.leaveToUpdate, this.leaveAddFormGroup.getRawValue());
          if (state === this.statusCode.Accepted) {
            this.leaveService.validateLeaveRequest(leaveAssign).subscribe(() => {
              this.router.navigate([LeaveRequestConstant.LEAVE_LIST_URL]);
            });
          } else {
            this.leaveService.save(leaveAssign, !this.isUpdateMode).subscribe(() => {
              this.router.navigate([LeaveRequestConstant.LEAVE_LIST_URL]);
            });
          }
        } else {
          this.validationService.validateAllFormFields(this.leaveAddFormGroup);
        }
      }
    });
  }

  /**
   * change the drowpdown value with the connected user if user has clear the value
   * @param $event
   */
  public changeEmployeeDropdownValue($event) {
    if (this.IdEmployee.value === 0 || this.IdEmployee.value === null || this.IdEmployee.value === undefined) {
      this.leaveAddFormGroup.controls[LeaveRequestConstant.EMPLOYEE_ID].setValue(this.selectedEmployee);
      this.isUpperHierrarchyOrTeamManager = false;
      this.myLeave = true;
    }
    if (!isNullOrUndefined($event)) {
      this.currentEmployee = $event.employeeFiltredDataSource
        .filter(x => x.Id === this.leaveAddFormGroup.controls[LeaveRequestConstant.EMPLOYEE_ID].value)[0];
      this.currentEmployee && this.currentEmployee.HiringDate ? this.StartDate.setValidators([Validators.required,
        dateValueGT(new Observable(o => o.next(this.currentEmployee.HiringDate)))]) : dateValueGT(Observable.of(null));
      this.currentEmployee && this.currentEmployee.HiringDate ? this.EndDate.setValidators([Validators.required,
        dateValueGT(new Observable(o => o.next(this.currentEmployee.HiringDate)))]) : dateValueGT(Observable.of(null));
      this.employeeService.isConnectedUserTeamManagerOrHierarchic(this.currentEmployee.Id).toPromise().then(res => {
        this.isUpperHierrarchyOrTeamManager = res;
        this.myLeave = this.currentEmployee.Id === this.connectedEmployee.Id;
      });
    }
    this.calculateNumberOfDays();
  }

  getSwalText(state): string {
    if (state === this.statusCode.Accepted) {
      return LeaveRequestConstant.VALIDATE_LEAVE_REQUEST_ALERT;
    }
    if (state === this.statusCode.Refused) {
      return LeaveRequestConstant.REFUS_LEAVE_REQUEST_ALERT;
    }
    if (state === this.statusCode.Canceled) {
      return LeaveRequestConstant.CANCEL_LEAVE_REQUEST_ALERT;
    }
  }

  changeTabs(event): void {
    if (event) {
      this.tab = true;
    } else {
      this.tab = false;
    }
  }

  isRequired(event) {
    this.required = event;
  }

  validCommentary(): boolean {
    if (this.Message.value) {
      return this.Message.value.replace(/^\s+|\s+$/g, '') === '';
    } else {
      return true;
    }
  }

  isFormChanged(): boolean {
    if (this.leaveAddFormGroup.touched || this.leaveAttachementFileInfo.length !== NumberConstant.ZERO) {
      return true;
    }
    return false;
  }

  /**
   * this method will be called by CanDeactivateGuard service to check the leaving component possibility
   */
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.isSaveOperation) {
      this.isSaveOperation = false;
      return true;
    }
    return this.validationService.handleCanDeactivateToLeaveCurrentComponent(this.isFormChanged.bind(this));
  }

  /**
   * subscribe on notication list
   */
  private subscribeOnCommentList(): void {
    this.subscriptions.push(this.commentService.listCommentSubject.subscribe((data: Comment) => {
      this.getSrcPictureEmployee(data);
      this.commentsData.push(data);
    }));
  }

  /*
   * Prepare Add form component
   */
  private createAddForm() {
    this.leaveAddFormGroup = this.fb.group({
      Id: [NumberConstant.ZERO],
      Description: ['', [Validators.maxLength(NumberConstant.TWO_HUNDRED_FIFTY)]],
      StartDate: ['', Validators.required],
      StartTime: ['', Validators.required],
      EndDate: ['', Validators.required],
      EndTime: ['', Validators.required],
      IdLeaveType: ['', [Validators.required]],
      Comment: [''],
      IdEmployee: [NumberConstant.ZERO, [Validators.required]],
      Message: [''],
      Status: [NumberConstant.ZERO]
    });
  }

  private validateDocumentRequiredCondition(): boolean {
    if (this.leaveToUpdate.IdLeaveTypeNavigation &&
      this.leaveToUpdate.IdLeaveTypeNavigation.RequiredDocument && this.leaveAttachementFileInfo.length === NumberConstant.ZERO) {
      let errorMessage = `${this.translate.instant(SharedConstant.LEAVE_WITH_JUSTIFICATION_VIOLATION)}`;
      errorMessage = errorMessage.replace('{' + LeaveRequestConstant.LEAVE_TYPE_UPPER.concat('}'),
        this.leaveToUpdate.IdLeaveTypeNavigation.Label);
      this.growlService.warningNotification(this.translate.instant(errorMessage));
      return false;
    }
    return true;
  }

  /**
   * @param leave Set leave times and file when update mode
   */
  private setLeaveTimeAndFile(leave: Leave) {
    if (leave.StartTime) {
      this.StartTime.setValue(leave.StartTime);
    }
    if (leave.EndTime) {
      this.EndTime.setValue(leave.EndTime);
    }
    if (this.leaveToUpdate.LeaveFileInfo) {
      this.leaveAttachementFileInfo = this.leaveToUpdate.LeaveFileInfo;
    }
  }

  /**
   * Get data to Update
   */
  private getDataToUpdate() {
    this.subscriptions.push(this.leaveService.getById(this.idLeave).subscribe((data) => {
      this.leaveToUpdate = data;
      if (this.leaveToUpdate != null) {
        this.employeeAssociated = this.leaveToUpdate.IdEmployeeNavigation;
        this.selectedEmployee = this.leaveToUpdate.IdEmployee;
        this.isUpperHierrarchyOrTeamManager = this.leaveToUpdate.IsConnectedUserInHierarchy;
        this.checkRights();
        if (!(this.myLeave || this.isUpperHierrarchyOrTeamManager || this.hasUpdatePermission)) {
          this.leaveAddFormGroup.disable();
          this.leaveAddFormGroup.get(SharedConstant.MESSAGE).enable();
        }
        this.leaveToUpdate.StartDate = new Date(this.leaveToUpdate.StartDate);
        this.leaveToUpdate.EndDate = new Date(this.leaveToUpdate.EndDate);
        this.startDateTime = this.leaveToUpdate.StartDate;
        this.endDateTime = this.leaveToUpdate.EndDate;
        this.leaveAddFormGroup.patchValue(this.leaveToUpdate);
        this.StartTime.setValue(this.leaveToUpdate.StartTime);
        this.EndTime.setValue(this.leaveToUpdate.EndTime);
        this.leaveAttachementFileInfo = this.leaveToUpdate.LeaveFileInfo;
        this.prepareCommentsList();
        this.calculateNumberOfDays();
        this.checkIfDocumentHasBeenAlreadyValidated();
      } else {
        this.isSaveOperation = true;
        this.router.navigate([LeaveRequestConstant.LEAVE_LIST_URL]);
      }
    }));
  }

  /**
   * Add comment
   */
  private addComment(): void {
    if (this.Message.value) {
      // Prepare comment entity
      const commentEntity: Comment = new Comment();
      commentEntity.Id = NumberConstant.ZERO;
      if (this.toEditComent) {
        Object.assign(commentEntity, this.toEditComent);
      }
      commentEntity.Message = (this.Message.value as string)
        .replace('\n', '<br>');
      commentEntity.CreationDate = new Date();
      commentEntity.IdEntityCreated = this.idLeave;
      commentEntity.EmailCreator = this.localStorageService.getUser().Email;
      commentEntity.EntityName = LeaveRequestConstant.ENTITY_NAME;
      this.commentService.save(commentEntity, this.idCommentToEdit === NumberConstant.ZERO).subscribe(res => {
        if (res) {
          const createdData: CreatedData = new CreatedData(this.leaveToUpdate.Id, this.leaveToUpdate.Code);
          this.commentService.addCommentAndSendNotifTheSuperior(commentEntity, this.leaveToUpdate.IdEmployee, createdData,
            InformationTypeEnum.ADD_COMMENT_LEAVE_REQUEST, true);
        }
        if (this.idCommentToEdit) {
          const index = this.commentsData.findIndex(x => x.Id === this.idCommentToEdit);
          this.commentsData[index] = commentEntity;
          this.idCommentToEdit = NumberConstant.ZERO;
          this.toEditComent = null;
          this.Message.reset();
        } else {
          res = this.getSrcPictureEmployee(res);
          this.Message.reset();
          this.commentsData.push(res);
        }
      });
    }
  }

  /**
   * Get src of picture employee
   */
  private getSrcPictureEmployee(comment: Comment): Comment {
    if (comment.Employee && comment.Employee.PictureFileInfo && comment.Employee.PictureFileInfo.Data) {
      comment.SrcPictureEmployee = 'data:image/png;base64,'.concat(comment.Employee.PictureFileInfo.Data);
    } else {
      comment.SrcPictureEmployee = '../../../../assets/image/user-new-icon1.jpg';
    }
    return comment;
  }

  /**
   * Fix date lag
   * @param leave
   */
  private fixDateLag(leave: Leave) {
    if (!isNullOrUndefined(leave)) {
      leave.StartDate = new Date(leave.StartDate.getFullYear(), leave.StartDate.getMonth(), leave.StartDate.getDate());
      leave.EndDate = new Date(leave.EndDate.getFullYear(), leave.EndDate.getMonth(), leave.EndDate.getDate());
    }
  }


}
