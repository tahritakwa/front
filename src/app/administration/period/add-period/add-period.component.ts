import { Component, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PeriodService } from '../../services/period/period.service';
import { ValidationService } from '../../../shared/services/validation/validation.service';
import { PeriodConstant } from '../../../constant/Administration/period.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { Period } from '../../../models/administration/period.model';
import { Hours } from '../../../models/administration/hours.model';
import { DayOff } from '../../../models/administration/day-off.model';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { TranslateService } from '@ngx-translate/core';
import { Time } from '@angular/common';
import { ContractConstant } from '../../../constant/payroll/Contract.constant';
import { WrongPayslipListComponent } from '../../../shared/components/wrong-payslip-list/wrong-payslip-list.component';
import { WrongPayslipActionEnumerator } from '../../../models/enumerators/wrong-payslip-action.enum';
import { FormModalDialogService } from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { StyleConfigService } from '../../../shared/services/styleConfig/style-config.service';
import { isNotNullOrUndefinedAndNotEmptyValue } from '../../../stark-permissions/utils/utils';
import { isNullOrUndefined } from 'util';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
const STANDARD_HOUR_LABEL = 'HOUR';

@Component({
  selector: 'app-add-period',
  templateUrl: './add-period.component.html',
  styleUrls: ['./add-period.component.scss']
})
export class AddPeriodComponent implements OnInit , OnDestroy {
  public periodFormGroup: FormGroup;
  public isUpdateMode = false;
  public formatDate = this.translateService.instant(SharedConstant.DATE_FORMAT);
  private periodToUpdate: Period;
  private id: number;
  /**
   * Can Edit the period
   */
  public canEdit = true;
  /**
   * Can Extend In Left, otherwise, can extend strat date in left
   */
  public CanExtendInLeft = true;
  /**
   * Can Extend In Right, otherwise, can extend end date in left
   */
  public CanExtendInRight = true;
  public actionEnum = WrongPayslipActionEnumerator;
  public dayOffTouched = false;
  public hourTouched = false;
  public checkboxTouched = false;
  private subscriptions: Subscription[] = [];
  public hadAddPeriodPermission: boolean;
  public hadUpdatePeriodPermission: boolean;

  /**
   Collapse informations
   */
  public scheduleCollapseIsOpened = false;
  public dayOffCollapseIsOpened = false;

  /**
   * attribute to use while verifying the route leave
   */
  private isSaveOperation = false;

  public listUrl = PeriodConstant.PERIOD_LIST_URL;

  /**
   * array with boolean flags to determine whether the hour label element is in edit mode or not (show mode)
   */
  public hourElementIsInModeEdit: boolean[] = [];

  /**
   * array with boolean flags to determine whether the hour label is standard or already modified
   */
  public isHourLabelStandard: boolean[] = [];
  firstInit = true;

  /**
   *
   * @param fb
   * @param periodService
   * @param swalWarrings
   * @param router
   * @param validationService
   * @param activatedRoute
   * @param growlService
   * @param translateService
   * @param rolesService
   * @param viewRef
   * @param formModalDialogService
   * @param styleConfigService
   */
  constructor(private fb: FormBuilder, private periodService: PeriodService, private swalWarrings: SwalWarring,
    private router: Router, private validationService: ValidationService, private activatedRoute: ActivatedRoute,
    private growlService: GrowlService, private translateService: TranslateService,
    private viewRef: ViewContainerRef, private formModalDialogService: FormModalDialogService, private authService: AuthService,
    private styleConfigService: StyleConfigService) {
    // check if is an update mode
    this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
      this.id = params[SharedConstant.ID_LOWERCASE] || 0;
      this.isUpdateMode = this.id > NumberConstant.ZERO;
    }));
  }

  ngOnInit() {
    this.hadAddPeriodPermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.ADD_PERIOD);
    this.hadUpdatePeriodPermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.UPDATE_PERIOD);
    this.cretaePeriodFormGroup();
    if (this.isUpdateMode) {
      this.getDataToUpdate();
    } else {
      if (this.DayOff.length > NumberConstant.ZERO) {
        this.deleteDayOff(NumberConstant.ONE);
      }
      this.addHour();
      this.addDayOff();
      this.firstInit = false;
    }
  }

  /**
   * Create period form group
   */
  cretaePeriodFormGroup() {
    this.periodFormGroup = this.fb.group({
      Id: [NumberConstant.ZERO],
      Label: ['', Validators.required],
      StartDate: ['', Validators.required],
      EndDate: ['', Validators.required],
      FirstDayOfWork: ['', Validators.required],
      LastDayOfWork: ['', Validators.required],
      Hours: this.fb.array([]),
      DayOff: this.fb.array([])
    });
  }

  /**
   * Create hours form group
   * @param hours
   * @param endTime
   */
  private createHoursFormGroup(hours?: Hours, endTime?: Time) {
    return this.fb.group({
      Id: [hours && hours.Id ? hours.Id : NumberConstant.ZERO],
      Label: [{
        value: hours && hours.Label ? hours.Label :
          this.translateService.instant(STANDARD_HOUR_LABEL), disabled: !this.canEdit
      }, [Validators.required]],
      StartTime: [{value: hours && hours.StartTime ? hours.StartTime : endTime ? endTime : '', disabled: !this.canEdit},
        Validators.required],
      EndTime: [{value: hours && hours.EndTime ? hours.EndTime : '', disabled: !this.canEdit}, Validators.required],
      WorkTimeTable: [{value: hours ? hours.WorkTimeTable : true, disabled: !this.canEdit}],
      IdPeriod: [hours && hours.IdPeriod ? hours.IdPeriod : NumberConstant.ZERO],
      IsDeleted: [false]
    });
  }

  /**
   * Create day off formgroup
   * @param dayOff
   */
  private createDayOffFormGroup(dayOff?: DayOff) {
    return this.fb.group({
      Id: [dayOff && dayOff.Id ? dayOff.Id : NumberConstant.ZERO],
      Label: [dayOff && dayOff.Label ? dayOff.Label : '', [Validators.required]],
      Date: [dayOff && dayOff.Date ? new Date(dayOff.Date) : '', [Validators.required]],
      IdPeriod: [dayOff && dayOff.IdPeriod ? dayOff.IdPeriod : NumberConstant.ZERO],
      IsDeleted: [false]
    });
  }

  /**
   * Add new hour form group
   */
  public addHour() {
    const newtHourStartTime =  this.Hours.controls[this.Hours.length - NumberConstant.ONE];
    // If no hours in the period else verify the validity of the previous before the add else throw exception
    if (this.Hours.length === NumberConstant.ZERO) {
      this.Hours.push(this.createHoursFormGroup());
    } else if (newtHourStartTime &&
      newtHourStartTime.valid) {
      this.Hours.push(this.createHoursFormGroup(null, newtHourStartTime.value.EndTime));
      this.hourTouched = true;
    } else if (newtHourStartTime) {
      this.validationService.validateAllFormFields(newtHourStartTime as FormGroup);
    }
    this.hourElementIsInModeEdit.push(false);
    this.isHourLabelStandard.push(true);
  }

  /**
   * Delete hour
   * @param index
   * @param hour
   */
  deleteHour(index: number, hour?): void {
    this.hourTouched = true;
    if (this.Hours.at(index).get(SharedConstant.ID).value === NumberConstant.ZERO) {
      this.Hours.removeAt(index);
      this.changeLabelElementEditMode(index);
    } else {
      this.swalWarrings.CreateSwal(PeriodConstant.HOUR_DELETE_TEXT_MESSAGE, PeriodConstant.HOUR_DELETE_TITLE_MESSAGE).then((result) => {
        if (result.value) {
          this.Hours.at(index).get(SharedConstant.IS_DELETED).setValue(true);
          this.changeLabelElementEditMode(index);
        }
      });
    }
  }

  public changeLabelElementEditMode(index, isInEditMode?: boolean) {
    if (!isNullOrUndefined(isInEditMode)) {
      this.hourElementIsInModeEdit[index] = isInEditMode;
      this.isHourLabelStandard[index] = false;
    } else {
      this.hourElementIsInModeEdit.splice(index, NumberConstant.ONE);
    }
  }

  /**
   * Add new day off form group
   */
  public addDayOff() {
    this.dayOffTouched = true;
    if (this.DayOff.length === NumberConstant.ZERO && !this.firstInit) {
      this.insertDayOffElem();
    } else if (!this.DayOff.valid && this.DayOff.length > NumberConstant.ZERO) {
      this.validationService.validateAllFormFields(this.DayOff.controls[this.DayOff.length - NumberConstant.ONE] as FormGroup);
    } else if (this.DayOff.valid && this.DayOff.length > NumberConstant.ZERO) {
      this.insertDayOffElem();
    }
  }

  public insertDayOffElem() {
    this.DayOff.push(this.createDayOffFormGroup());
  }

  /**
   * Delete day off
   * @param index
   */
  deleteDayOff(index: number) {
    this.dayOffTouched = true;
    if (this.DayOff.at(index).get(SharedConstant.ID).value === NumberConstant.ZERO) {
      this.DayOff.removeAt(index);
    } else {
      this.swalWarrings.CreateSwal(PeriodConstant.DAY_OFF_DELETE_TEXT_MESSAGE,
        PeriodConstant.DAY_OFF_DELETE_TITLE_MESSAGE).then((result) => {
        if (result.value) {
          this.DayOff.at(index).get(SharedConstant.IS_DELETED).setValue(true);
        }
      });
    }
  }

  /**
   * Retrieve the period to edit
   */
  getDataToUpdate() {
    this.subscriptions.push(this.periodService.getById(this.id).subscribe(data => {
      this.periodToUpdate = data;
      this.canEdit = this.periodToUpdate.CanEdit;
      this.initializeForms();
      if (!this.hadUpdatePeriodPermission) {
        this.periodFormGroup.disable();
      }
    }));
  }

  /**
   * initialize Forms in case of update mode
   */
  initializeForms() {
    this.CanExtendInRight = this.periodToUpdate.CanExtendInRight;
    this.CanExtendInLeft = this.periodToUpdate.CanExtendInLeft;
    this.periodToUpdate.StartDate = new Date(this.periodToUpdate.StartDate);
    this.periodToUpdate.EndDate = this.periodToUpdate.EndDate !== null ? new Date(this.periodToUpdate.EndDate) : null;
    if (!isNotNullOrUndefinedAndNotEmptyValue(this.periodToUpdate.DayOff)) {
      this.periodToUpdate.DayOff = new Array<DayOff>();
      this.addDayOff();
      this.firstInit = false;
    }
    this.periodToUpdate.Hours = this.periodToUpdate.Hours !== null ? this.periodToUpdate.Hours : new Array<Hours>();
    this.periodFormGroup.patchValue(this.periodToUpdate);
    if (!this.canEdit) {
      this.periodFormGroup.disable();
    }
    if (this.CanExtendInLeft) {
      this.StartDate.enable();
    }
    if (this.CanExtendInRight) {
      this.EndDate.enable();
    }
    this.periodToUpdate.DayOff.forEach(dayOff => {
      this.DayOff.push(this.createDayOffFormGroup(dayOff));
    });
    this.periodToUpdate.Hours.forEach(hour => {
      this.Hours.push(this.createHoursFormGroup(hour));
      this.hourElementIsInModeEdit.push(false);
    });
  }

  /**
   * Save model
   */
  /**
   * Save model
   */
  save() {
    this.periodFormGroup.updateValueAndValidity();
    const workTimeCheckState = this.Hours.controls.find(x => ((x as FormGroup).controls.WorkTimeTable).value === true
      && ((x as FormGroup).controls.IsDeleted).value === false);
    if (this.periodFormGroup.valid && workTimeCheckState) {
      this.isSaveOperation = true;
      this.periodToUpdate = Object.assign({}, this.periodToUpdate, this.periodFormGroup.getRawValue());
      if (this.isUpdateMode) {
        this.subscriptions.push(this.periodService.checkIfDayOffsUpdateCorruptedPayslipOrTimesheet(this.periodToUpdate).subscribe(res => {
          if (res.model.Payslip.length > NumberConstant.ZERO || res.model.TimeSheet.length > NumberConstant.ZERO) {
            this.formModalDialogService.openDialog(ContractConstant.WRONG_ENTITIES, WrongPayslipListComponent,
              this.viewRef, this.actionToDo.bind(this), res.model, true, SharedConstant.MODAL_DIALOG_SIZE_ML);
          } else {
            this.actionToSave(this.periodToUpdate);
          }
        }));
      } else {
        this.actionToSave(this.periodToUpdate);
      }
    } else {
      this.validationService.validateAllFormFields(this.periodFormGroup);
      if (this.periodFormGroup.valid && !workTimeCheckState) {
        this.growlService.ErrorNotification(this.translateService.instant(PeriodConstant.WORK_TIME_ERROR_MESSAGE));
      }
    }
  }
  actionToDo(action) {
    switch (action) {
      case this.actionEnum.MarkPayslipToWrong:
        this.periodToUpdate.UpdatePayslipAndTimeSheet = true;
        this.actionToSave(this.periodToUpdate);
        break;
      case this.actionEnum.DoNotMarkPayslipToWrong:
        this.periodToUpdate.UpdatePayslipAndTimeSheet = false;
        this.actionToSave(this.periodToUpdate);
      break;
      case this.actionEnum.Cancel:
      break;
    }
  }

  private actionToSave(periodToSave: Period) {
    this.subscriptions.push(this.periodService.save(periodToSave, !this.isUpdateMode).subscribe(() => {
      this.router.navigate([PeriodConstant.PERIOD_LIST_URL]);
    }));
  }

  /**
   * Return valid workTime line or DayOff line
   */
  numberOfValideHoursLines(fA: any): number {
    let formArray: FormArray;
    formArray = fA === PeriodConstant.HOURS ? this.Hours : this.DayOff;
    let size = NumberConstant.ZERO;
    if (formArray.controls.length > NumberConstant.ZERO) {
      formArray.controls.forEach((control: FormControl) => {
        if (control.get(SharedConstant.IS_DELETED) !== null && control.get(SharedConstant.IS_DELETED).value === false) {
          size++;
        }
      });
    }
    return size;
  }


  /**
   * return the visibility of a validityPeriod
   * @param i
   */
  isHourRowVisible(i): boolean {
    return !this.Hours.at(i).get(SharedConstant.IS_DELETED).value;
  }

  /**
   * return the visibility of a validityPeriod
   * @param i
   */
  isDayOffRowVisible(i): boolean {
    return !this.DayOff.at(i).get(SharedConstant.IS_DELETED).value;
  }

  /**
   * Get Lable
   */
  get Label(): FormControl {
    return this.periodFormGroup.get(PeriodConstant.LABEL) as FormControl;
  }

  /**
   * Get StartDate
   */
  get StartDate(): FormControl {
    return this.periodFormGroup.get(SharedConstant.START_DATE) as FormControl;
  }

  /**
   * Get EndDate
   */
  get EndDate(): FormControl {
    return this.periodFormGroup.get(SharedConstant.END_DATE) as FormControl;
  }

  /**
   * Get FirstDayOfWork
   */
  get FirstDayOfWork(): FormControl {
    return this.periodFormGroup.get(PeriodConstant.FIRST_DAY_OF_WORK) as FormControl;
  }

  /**
   * Get LastDayOfWork
   */
  get LastDayOfWork(): FormControl {
    return this.periodFormGroup.get(PeriodConstant.LAST_DAY_OF_WORK) as FormControl;
  }

  /**
   * Get Hours
   */
  get Hours(): FormArray {
    return this.periodFormGroup.get(PeriodConstant.HOURS) as FormArray;
  }

  /**
   * Get DayOff
   */
  get DayOff(): FormArray {
    return this.periodFormGroup.get(PeriodConstant.DAY_OFF) as FormArray;
  }
  /***
  * Check if checkbox touched
  */
  toggleEditable() {
  this.checkboxTouched = true;
  }

  isFormChanged(): boolean {
    return this.periodFormGroup.touched || this.dayOffTouched || this.hourTouched || this.checkboxTouched;
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
  public backToList() {
    this.router.navigateByUrl(SharedConstant.PERIOD_LIST_URL);
  }

  public checkSchedulingHoursCollapse() {
    if (!this.scheduleCollapseIsOpened && !this.Hours.valid) {
      this.scheduleCollapseIsOpened = true;
    }
  }

  public isGlobalFormGroupValid(): boolean {
    if (this.DayOff.valid && this.periodFormGroup.valid) {
      return true;
    } else if (!this.DayOff.valid && !this.dayOffCollapseIsOpened && this.Hours.valid) {
      this.DayOff.controls.forEach((value, index) => {
        if (value.invalid) {
          this.DayOff.removeAt(index);
        }
      });
    }
    return this.periodFormGroup.valid;
  }

  getFooterClass(): string {
    return this.styleConfigService.getFooterClassSettingLayoutAddComponent();
  }

  ngOnDestroy(): void {
    if (this.subscriptions !== undefined) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
  }
  openScheduleCollapse() {
    if (this.Hours.length === NumberConstant.ZERO) {
      this.Hours.push(this.createHoursFormGroup());
    }
  }

}
