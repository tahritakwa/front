import { Component, ComponentRef, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { EnumValues } from 'enum-values';
import { IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';
import { ModalDialogInstanceService } from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { LeaveTypeConstant } from '../../../constant/payroll/leave-type.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { Periodicity } from '../../../models/enumerators/periodicity.enum';
import { LeaveType } from '../../../models/payroll/leave-type.model';
import { StyleConfigService } from '../../../shared/services/styleConfig/style-config.service';
import { lowerOrEqualThan, ValidationService } from '../../../shared/services/validation/validation.service';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { LeaveTypeService } from '../../services/leave-type/leave-type.service';

@Component({
  selector: 'app-add-leave-type',
  templateUrl: './add-leave-type.component.html',
  styleUrls: ['./add-leave-type.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddLeaveTypeComponent implements OnInit, OnDestroy {
  /*
   * Form Group
   */
  leaveTypeFormGroup: FormGroup;
  /*
   * is updateMode
   */
  public isUpdateMode: boolean;
  /*
   * If modal=true
   */
  public isModal: boolean;
  /*
   * dialog subject
   */
  dialogOptions: Partial<IModalDialogOptions<any>>;
  /*
   * Data input of the modal
   */
  public leaveType: LeaveType;
  /**
   * Is cumulable
   */
  public isCumulable = false;
  /**
   * Format Date
   */
  public formatDate: string = this.translate.instant(SharedConstant.DATE_FORMAT);
  minDate = new Date(new Date().getFullYear() + NumberConstant.ONE, NumberConstant.ZERO, NumberConstant.ONE);
  maxDate = new Date(new Date().getFullYear() + NumberConstant.ONE, NumberConstant.ELEVEN, NumberConstant.THIRTY_ONE);
  public unitDataSource: any[] = [];
  public checkboxTouched = false;
  private id: number;
  private isSaveOperation = false;
  private subscriptions: Subscription[] = [];
  public hasAddLeaveTypePermission: boolean;
  public hasUpdateLeaveTypePermission: boolean;
  constructor(private modalService: ModalDialogInstanceService, private router: Router, public translate: TranslateService,
              private activatedRoute: ActivatedRoute, private formBuilder: FormBuilder,
               private authService: AuthService, private styleConfigService: StyleConfigService,
              private leaveTypeService: LeaveTypeService, private fb: FormBuilder, private validationService: ValidationService) {
    this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
      this.id = +params['id'] || 0;
    }));
  }

  get Id(): FormControl {
    return this.leaveTypeFormGroup.get(SharedConstant.ID) as FormControl;
  }

  get Code(): FormControl {
    return this.leaveTypeFormGroup.get(LeaveTypeConstant.CODE) as FormControl;
  }

  get Label(): FormControl {
    return this.leaveTypeFormGroup.get(LeaveTypeConstant.LABEL) as FormControl;
  }

  get Paid(): FormControl {
    return this.leaveTypeFormGroup.get(LeaveTypeConstant.PAID) as FormControl;
  }

  get RequiredDocument(): FormControl {
    return this.leaveTypeFormGroup.get(LeaveTypeConstant.REQUIRED_DOCUMENT) as FormControl;
  }

  get Cumulable(): FormControl {
    return this.leaveTypeFormGroup.get(LeaveTypeConstant.CUMULABLE) as FormControl;
  }

  get Calendar(): FormControl {
    return this.leaveTypeFormGroup.get(LeaveTypeConstant.CALENDAR) as FormControl;
  }

  get AuthorizedOvertaking(): FormControl {
    return this.leaveTypeFormGroup.get(LeaveTypeConstant.AUTHORIZEDOVERTAKING) as FormControl;
  }

  get MaximumNumberOfDays(): FormControl {
    return this.leaveTypeFormGroup.get(LeaveTypeConstant.MAXIMIM_NUMBER_OF_DAYS) as FormControl;
  }

  get Description(): FormControl {
    return this.leaveTypeFormGroup.get(LeaveTypeConstant.DESCRIPTION) as FormControl;
  }

  get Period(): FormControl {
    return this.leaveTypeFormGroup.get(LeaveTypeConstant.PERIOD) as FormControl;
  }

  get Worked(): FormControl {
    return this.leaveTypeFormGroup.get(LeaveTypeConstant.WORKED) as FormControl;
  }

  get ExpiryDate(): FormControl {
    return this.leaveTypeFormGroup.get(LeaveTypeConstant.EXPIRYDATE) as FormControl;
  }

  ngOnInit() {
    this.initDropDownDataSource();
    this.hasAddLeaveTypePermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.ADD_LEAVETYPE);
    this.hasUpdateLeaveTypePermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.UPDATE_LEAVETYPE);
    this.isUpdateMode = this.id > 0 ? true : false;
    this.createLeaveTypeForm();
    if (this.isUpdateMode) {
      this.getDataToUpdate();
    }
  }

  /**
   * Inialise Modal
   * @param reference
   * @param options
   */
  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.isModal = true;
    this.dialogOptions = options;
    if (this.leaveType) {
      this.isUpdateMode = true;
    } else {
      this.isUpdateMode = false;
    }
  }

  initDropDownDataSource(): void {
    const unitEnum = EnumValues.getNamesAndValues(Periodicity);
    unitEnum.forEach(elem => {
      elem.name = elem.name.toUpperCase();
      this.subscriptions.push(this.translate.get(elem.name.toUpperCase()).subscribe(trans => elem.name = trans));
      this.unitDataSource.push(elem);
    });
  }

  updateValue() {
    this.MaximumNumberOfDays.updateValueAndValidity();
  }

  public clickCumulable() {
    this.isCumulable = !this.isCumulable;
    this.Cumulable.setValue(this.isCumulable);
    if (this.isCumulable) {
      this.ExpiryDate.setValue(undefined);
    }
  }

  /**
   * Save LeaveType
   */
  public save(): void {
    if (this.leaveTypeFormGroup.valid) {
      this.isSaveOperation = true;
      const leaveTypeToSave: LeaveType = Object.assign({}, this.leaveType, this.leaveTypeFormGroup.value);
      this.subscriptions.push(this.leaveTypeService.save(leaveTypeToSave, !this.isUpdateMode).subscribe((data) => {
        if (this.isModal) {
          this.dialogOptions.onClose();
          this.modalService.closeAnyExistingModalDialog();
        } else {
          this.router.navigate([LeaveTypeConstant.LEAVE_LIST_URL]);
        }
      }));
    } else {
      this.validationService.validateAllFormFields(this.leaveTypeFormGroup);
    }
  }

  backToList() {
    this.router.navigateByUrl(LeaveTypeConstant.LEAVE_LIST_URL);
  }

  toggleEditable() {
    this.checkboxTouched = true;
  }

  isFormChanged(): boolean {
    return this.leaveTypeFormGroup.touched || this.checkboxTouched;
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

  ngOnDestroy(): void {
    if (this.subscriptions !== undefined) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
  }

  private getDataToUpdate() {
    this.subscriptions.push(this.leaveTypeService.getById(this.id).subscribe((data) => {
      this.leaveType = data;
      this.isCumulable = this.leaveType.Cumulable;
      this.leaveTypeFormGroup.patchValue(data);
      if (!this.hasUpdateLeaveTypePermission) {
        this.leaveTypeFormGroup.disable();
      }
    }));
  }
  getFooterClass(): string {
    return this.styleConfigService.getFooterClassSettingLayoutAddComponent();
  }
  /**
   * Create LeaveType form
   * @param leaveType
   */
  private createLeaveTypeForm(leaveType?: LeaveType): void {
    this.leaveTypeFormGroup = this.formBuilder.group({
      Id: [leaveType && leaveType.Id ? leaveType.Id : NumberConstant.ZERO],
      Code: [{value: leaveType && leaveType.Code ? leaveType.Code : '', disabled: true}],
      Label: [leaveType && leaveType.Label ? leaveType.Label : '',
        [Validators.required, Validators.maxLength(NumberConstant.TWO_HUNDRED_FIFTY)]],
      Paid: [leaveType ? leaveType.Paid : false],
      RequiredDocument: [leaveType ? leaveType.RequiredDocument : false],
      Calendar: [leaveType ? leaveType.Calendar : false],
      Cumulable: [leaveType ? leaveType.Cumulable : false],
      MaximumNumberOfDays: [leaveType ? leaveType.MaximumNumberOfDays : '',
        [Validators.required, Validators.pattern('^[0-9]*'), Validators.min(NumberConstant.ONE)]],
      Description: [leaveType && leaveType.Description ? leaveType.Description : ''],
      ExpiryDate: [leaveType && leaveType.ExpiryDate ? new Date(leaveType.ExpiryDate) : ''],
      Period: [leaveType && leaveType.Period ? leaveType.Period : '', Validators.required],
      AuthorizedOvertaking: [leaveType ? leaveType.AuthorizedOvertaking : false],
      Worked: [leaveType ? leaveType.Worked : false]
    });
    this.MaximumNumberOfDays.setValidators([
      Validators.required,
      Validators.min(NumberConstant.ONE),
      lowerOrEqualThan(new Observable(o => o.next(this.Period.value === NumberConstant.ONE ? NumberConstant.THIRTY_ONE
        : NumberConstant.YEAR_DAYS)))
    ]);
  }
}
