import {Component, ComponentRef, OnDestroy, OnInit} from '@angular/core';
import {ModalDialogInstanceService} from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import {LeaveService} from '../../services/leave/leave.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ValidationService} from '../../../shared/services/validation/validation.service';
import {IModalDialog, IModalDialogOptions} from 'ngx-modal-dialog';
import {Subject} from 'rxjs/Subject';
import {FileInfo} from '../../../models/shared/objectToSend';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {LeaveRequestConstant} from '../../../constant/payroll/leave.constant';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {Leave} from '../../../models/payroll/leave.model';
import {Time} from '@angular/common';
import {PredicateFormat} from '../../../shared/utils/predicate';
import {Router} from '@angular/router';
import {LeaveBalanceRemainingService} from '../../services/leave-balance-remaining/leave-balance-remaining.service';
import {TranslateService} from '@ngx-translate/core';
import {GrowlService} from '../../../../COM/Growl/growl.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-overshoot-leave-modal',
  templateUrl: './overshoot-leave-modal.component.html',
  styleUrls: ['./overshoot-leave-modal.component.scss']
})
export class OvershootLeaveModalComponent implements OnInit, OnDestroy {
  /**
   * Format Date
   */
  public formatDate: string = this.translate.instant(SharedConstant.DATE_FORMAT);
  /**
   * Show controls
   */
  public showControl = true;
  /**
   * Assignement form group
   */
  public moveToOvershootLeaveFormGroup: FormGroup;
  public leavesList: Leave[] = [];
  public predicateLeaveType: PredicateFormat;
  /**
   * If modal=true
   */
  public isModal: boolean;
  /*
   * dialog subject
   */
  options: Partial<IModalDialogOptions<any>>;
  /**
   * Employee leave documents associated
   */
  public leaveOvershootAttachementFileInfo: Array<FileInfo> = new Array<FileInfo>();
  public leaveAttachementFileInfo: Array<FileInfo>;
  public leaveBalanceRemainingListByIdEmployee: any;
  reference: ComponentRef<IModalDialog>;
  public closeDialogSubject: Subject<any>;
  public leaveAlreadyValidate;
  public leave: any;
  public leaveType: any;
  public currentDayHourRemaining: any;
  public daysHoursRemaining: any;
  public startDate: Date;
  public startTime: Time;
  public endTime: Time;
  public daysRemaining: any;
  public startDateTime: Date;
  public endDateTime: Date;
  required = false;
  private subscriptions: Subscription[] = [];

  constructor(private modalService: ModalDialogInstanceService, public leaveService: LeaveService, private router: Router,
              private fb: FormBuilder, private validationService: ValidationService,
              private translate: TranslateService, private growlService: GrowlService,
              public leaveBalanceRemainingService: LeaveBalanceRemainingService) {
    this.leaveAttachementFileInfo = new Array<FileInfo>();
  }

  /**
   *  Start Date getter
   */
  get StartDate(): FormControl {
    return this.moveToOvershootLeaveFormGroup.get(SharedConstant.START_DATE) as FormControl;
  }

  /**
   *  End Date getter
   */
  get EndDate(): FormControl {
    return this.moveToOvershootLeaveFormGroup.get(SharedConstant.END_DATE) as FormControl;
  }

  get IdLeaveType(): FormControl {
    return this.moveToOvershootLeaveFormGroup.get(LeaveRequestConstant.ID_LEAVE_TYPE) as FormControl;
  }

  get Description(): FormControl {
    return this.moveToOvershootLeaveFormGroup.get(LeaveRequestConstant.DESCRIPTION) as FormControl;
  }

  get StartTime(): FormControl {
    return this.moveToOvershootLeaveFormGroup.get(LeaveRequestConstant.START_TIME) as FormControl;
  }

  get EndTime(): FormControl {
    return this.moveToOvershootLeaveFormGroup.get(LeaveRequestConstant.END_TIME) as FormControl;
  }

  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.isModal = true;
    this.options = options;
    // recover the extra leave
    this.leave = options.data.objectData.find(x => !x.CurrentBalance);
    // Set start and Endate of primary leave for fixDateLag method
    const primaryLeave: Leave = options.data.objectData.find(x => x.CurrentBalance);
    primaryLeave.StartDate = new Date(primaryLeave.StartDate);
    primaryLeave.EndDate = new Date(primaryLeave.EndDate);
    this.leavesList.push(primaryLeave);
    this.daysHoursRemaining = options.data.daysHoursRemaining ? options.data.daysHoursRemaining.Day : NumberConstant.ZERO;
    this.closeDialogSubject = options.closeDialogSubject;
  }

  ngOnInit() {
    this.createAddForm();
  }

  ngOnDestroy(): void {
    if (this.subscriptions !== undefined) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
  }

  /**
   * count number of days
   */
  calculateNumberOfDays() {
    if (this.moveToOvershootLeaveFormGroup.valid) {
      const leave: Leave = Object.assign({}, this.leave, this.moveToOvershootLeaveFormGroup.value);
      this.fixDateLag(leave);
      leave.IdLeaveType = this.IdLeaveType.value;
      this.subscriptions.push(this.leaveService.CalculateLeaveBalance(leave).subscribe(leaveData => {
        this.leave = leaveData;
      }));
    }
  }

  save() {
    if (this.moveToOvershootLeaveFormGroup.valid && this.validateDocumentRequiredCondition()) {
      const leave: Leave = Object.assign({}, this.leave, this.moveToOvershootLeaveFormGroup.value);
      if (!this.leave.IdLeaveTypeNavigation.AuthorizedOvertaking && this.leave.LeaveBalanceRemaining &&
        (this.leave.LeaveBalanceRemaining.Day < NumberConstant.ZERO ||
          this.leave.LeaveBalanceRemaining.Hour < NumberConstant.ZERO)) {
        this.growlService.warningNotification(`${this.translate.instant(SharedConstant.VALIDATION_CURRENT_DAY_HOUR_REMINING)}`);
      } else {
        const leaveOvershoot: Leave = Object.assign({}, this.leave, this.moveToOvershootLeaveFormGroup.value);
        if (this.leaveAttachementFileInfo.length !== NumberConstant.ZERO) {
          leaveOvershoot.LeaveFileInfo = this.leaveAttachementFileInfo;
        }
        this.leavesList.push(leaveOvershoot);
        for (let i = NumberConstant.ZERO; i < this.leavesList.length; i++) {
          this.fixDateLag(this.leavesList[i]);
        }
        this.subscriptions.push(this.leaveService.addMassiveLeaves(this.leavesList).subscribe(() => {
          this.options.onClose();
          this.modalService.closeAnyExistingModalDialog();
          this.router.navigateByUrl(LeaveRequestConstant.LEAVE_LIST_URL);
        }));
      }
    } else {
      this.validationService.validateAllFormFields(this.moveToOvershootLeaveFormGroup);
    }
  }

  /**
   * set the endDate value to the startDate if the startDate > endDate
   * @param event
   */
  public startDateValueChange(selectedDate: Date) {
    if (selectedDate) {
      if (this.StartDate.value > this.EndDate.value) {
        this.EndDate.setValue(selectedDate);
        this.endDateTime = selectedDate;
        this.subscriptions.push(this.leaveService.getHoursPeriodOfDate(this.endDateTime).subscribe((data) => {
          const endTime = data.find(x => x.Value === this.EndTime.value);
          if (endTime) {
            this.EndTime.patchValue(endTime.Value);
          } else {
            this.EndTime.patchValue(data[data.length - NumberConstant.ONE][SharedConstant.VALUE]);
          }
        }));
      }
      this.startDateTime = selectedDate;
      this.subscriptions.push(this.leaveService.getHoursPeriodOfDate(this.startDateTime).subscribe((data) => {
        // if the hours dropdown contains the startTime
        const startTime = data.find(x => x.Value === this.StartTime.value);
        if (startTime) {
          this.StartTime.patchValue(startTime.Value);
        } else {
          this.StartTime.patchValue(data[NumberConstant.ZERO][SharedConstant.VALUE]);
        }
      }));
    }
  }

  /**
   * set the startDate minValue to the endDate if the endDate < startDate
   * @param event
   */
  public endDateValueChange(selectedDate: Date) {
    if (selectedDate) {
      if (selectedDate < this.StartDate.value) {
        this.StartDate.setValue(selectedDate);
        this.startDateTime = selectedDate;
        this.subscriptions.push(this.leaveService.getHoursPeriodOfDate(this.startDateTime).subscribe((data) => {
          const startTime = data.find(x => x.Value === this.StartTime.value);
          if (startTime) {
            this.StartTime.patchValue(startTime.Value);
          } else {
            this.StartTime.patchValue(data[NumberConstant.ZERO][SharedConstant.VALUE]);
          }
        }));
      }
      this.endDateTime = selectedDate;
      this.subscriptions.push(this.leaveService.getHoursPeriodOfDate(this.endDateTime).subscribe((data) => {
        const endTime = data.find(x => x.Value === this.EndTime.value);
        if (endTime) {
          this.EndTime.patchValue(endTime.Value);
        } else {
          this.EndTime.patchValue(data[data.length - NumberConstant.ONE][SharedConstant.VALUE]);
        }
      }));
    }
  }

  isRequired(event) {
    this.required = event;
  }

  /*
   * Prepare Add form component
   */
  private createAddForm() {
    this.moveToOvershootLeaveFormGroup = this.fb.group({
      Id: [NumberConstant.ZERO],
      Description: [''],
      StartDate: [new Date(this.leave.StartDate)],
      StartTime: [this.leave.StartTime],
      EndDate: [new Date(this.leave.EndDate), Validators.required],
      EndTime: [this.leave.EndTime],
      IdLeaveType: ['', [Validators.required]],
      IdEmployee: [this.leave.IdEmployee, [Validators.required]],
      LeaveFileInfo: ['']
    });
    this.startDateTime = this.leave.StartDate;
    this.endDateTime = this.leave.EndDate;
  }

  private validateDocumentRequiredCondition(): boolean {
    if (this.leave.IdLeaveTypeNavigation &&
      this.leave.IdLeaveTypeNavigation.RequiredDocument && this.leaveAttachementFileInfo.length === NumberConstant.ZERO) {
      let errorMessage = `${this.translate.instant(SharedConstant.LEAVE_WITH_JUSTIFICATION_VIOLATION)}`;
      errorMessage = errorMessage.replace('{' + LeaveRequestConstant.LEAVE_TYPE_UPPER.concat('}'),
        this.leave.IdLeaveTypeNavigation.Label);
      this.growlService.warningNotification(this.translate.instant(errorMessage));
      return false;
    }
    return true;
  }

  /**
   * Fix date lag
   * @param leave
   */
  private fixDateLag(leave: Leave) {
    leave.StartDate = new Date(Date.UTC(leave.StartDate.getFullYear(), leave.StartDate.getMonth(), leave.StartDate.getDate()));
    leave.EndDate = new Date(Date.UTC(leave.EndDate.getFullYear(), leave.EndDate.getMonth(), leave.EndDate.getDate()));
  }
}
