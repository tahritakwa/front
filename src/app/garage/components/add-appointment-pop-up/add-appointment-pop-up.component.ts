import { Component, ComponentRef, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';
import { ModalDialogInstanceService } from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { GarageConstant } from '../../../constant/garage/garage.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { dateValueGT, dateValueLT, ValidationService } from '../../../shared/services/validation/validation.service';
import { AppointmentService } from '../../services/appointment/appointment.service';
import * as moment from 'moment';
import { VehicleCategoryEnumerator } from '../../../models/enumerators/vehicle-category.enum';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { AppointmentStateEnumerator } from '../../../models/enumerators/appointment-state.enum';

@Component({
  selector: 'app-add-appointment-pop-up',
  templateUrl: './add-appointment-pop-up.component.html',
  styleUrls: ['./add-appointment-pop-up.component.scss']
})
export class AddAppointmentPopUpComponent implements OnInit {

  // Modal Settings
  dialogOptions: Partial<IModalDialogOptions<any>>;
  public closeDialogSubject: Subject<any>;
  public isUpdateMode = false;
  private id: number;
  private idGarage: number;
  private idVehicle: number;
  private appointmentToUpdate: any;
  formatDate = this.translate.instant(SharedConstant.DATE_FORMAT);
  public vehicleCategory = VehicleCategoryEnumerator.Customer;
  // Permission Parameters
  public hasAddPermission: boolean;
  public hasUpdatePermission: boolean;
  // Form Group
  form: FormGroup;

  constructor(private formBuilder: FormBuilder, private validationService: ValidationService,
    public appointmentService: AppointmentService, private modalService: ModalDialogInstanceService,
    private growlService: GrowlService,
    private authService: AuthService,
    private translate: TranslateService) { }

  ngOnInit() {
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.GaragePermissions.ADD_APPOINTMENT);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.GaragePermissions.UPDATE_APPOINTMENT);
    this.CreateFormGroup();
    if (this.isUpdateMode) {
      this.getDataToUpdate(); } else {
      this.addTimeDependencyControl();
    }
  }


  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.dialogOptions = options;
    this.id = this.dialogOptions.data.id;
    this.idGarage = this.dialogOptions.data.idGarage;
    this.idVehicle = this.dialogOptions.data.idVehicle;
    this.isUpdateMode = this.id > NumberConstant.ZERO;
    this.closeDialogSubject = options.closeDialogSubject;
  }

  CreateFormGroup() {
    this.form = this.formBuilder.group({
      IdGarage: [this.idGarage ? this.idGarage : undefined, Validators.required],
      IdVehicle: [this.idVehicle ? this.idVehicle : undefined, Validators.required],
      IsAllDay: [NumberConstant.ZERO],
      StartDate: [undefined, Validators.required],
      StartHour: [undefined],
      EndDate: [undefined],
      EndHour: [undefined],
      Note: [''],
      State : [AppointmentStateEnumerator.Open]
    });
  }

  addDateDependencyControl() {
    this.StartDate.setValidators([Validators.required,
    dateValueLT(new Observable(o => o.next(this.EndDate.value)))]);
    this.EndDate.setValidators([Validators.required,
    dateValueGT(new Observable(o => o.next(this.StartDate.value)))]);
    this.StartDate.updateValueAndValidity();
    this.EndDate.updateValueAndValidity();
  }

  removeDateDependencyControl() {
    this.StartDate.setValidators([Validators.required]);
    this.EndDate.setValidators([]);
    this.StartDate.updateValueAndValidity();
    this.EndDate.updateValueAndValidity();
  }
addTimeDependencyControl() {
    this.StartHour.setValidators([Validators.required]);
    this.EndHour.setValidators([Validators.required]);
    this.StartHour.updateValueAndValidity();
    this.EndHour.updateValueAndValidity();
  }

  removeTimeDependencyControl() {
    this.StartHour.setValidators([]);
    this.EndHour.setValidators([]);
    this.StartHour.updateValueAndValidity();
    this.EndHour.updateValueAndValidity();
  }

  save() {
    if (this.form.valid) {
      this.appointmentToUpdate = Object.assign({}, this.appointmentToUpdate, this.form.getRawValue());
      // change add hours to dates
      if (!this.IsAllDay.value) {
        this.addTimeToDate(this.appointmentToUpdate.StartDate, this.StartHour.value);
        this.appointmentToUpdate.EndDate = new Date(this.appointmentToUpdate.StartDate);
        this.addTimeToDate(this.appointmentToUpdate.EndDate, this.EndHour.value);
        if (this.appointmentToUpdate.EndDate < this.appointmentToUpdate.StartDate ) {
          // show Time error
          this.growlService.ErrorNotification(this.translate.instant('TIME_CONTROL_ERROR'));
          return;
        }
      } else {
        this.appointmentToUpdate.EndDate = new Date(this.appointmentToUpdate.EndDate.getFullYear(),
        this.appointmentToUpdate.EndDate.getMonth(), this.appointmentToUpdate.EndDate.getDate());
        const endDateTomorrow = this.appointmentToUpdate.EndDate.setDate(this.appointmentToUpdate.EndDate.getDate() + 1);
        this.appointmentToUpdate.EndDate = moment(endDateTomorrow).subtract(1, 'minutes').toDate();
      }
      // Save the object
      this.appointmentService.save(this.appointmentToUpdate, !this.isUpdateMode).subscribe(() => {
        this.dialogOptions.onClose();
        this.modalService.closeAnyExistingModalDialog();
      });
    } else {
      this.validationService.validateAllFormFields(this.form);
    }
  }

  addTimeToDate(date: Date, time: string) {
    const indexHours = time.indexOf(':');
    const hours = time.substring(0, indexHours);
    const minutes = time.substring(indexHours + 1, time.length);
    date.setHours(+hours, +minutes, 0);
  }

  private getDataToUpdate() {
    this.appointmentService.getById(this.id).subscribe((data) => {
      this.appointmentToUpdate = data;
      this.appointmentToUpdate.StartDate = new Date(data.StartDate);
      this.appointmentToUpdate.EndDate = new Date(data.EndDate);
      if (!data.IsAllDay) {
        // event in the same day
        this.appointmentToUpdate.StartHour = (moment(this.appointmentToUpdate.StartDate)).format('HH:mm');
        this.appointmentToUpdate.EndHour = (moment(this.appointmentToUpdate.EndDate)).format('HH:mm');
      } else {
        this.appointmentToUpdate.EndDate = new Date(this.appointmentToUpdate.EndDate.getFullYear(),
        this.appointmentToUpdate.EndDate.getMonth(), this.appointmentToUpdate.EndDate.getDate());
      }
      this.form.patchValue(this.appointmentToUpdate);
      if (this.IsAllDay.value) {
        this.addDateDependencyControl();
       } else {
        this.addTimeDependencyControl();
      }
      if (!this.hasUpdatePermission) {
        this.form.disable();
      }
      if(this.appointmentToUpdate.State == AppointmentStateEnumerator.Completed) {
        this.form.disable();
      }
    });
  }

  isAllDayChange($event) {
    this.StartHour.setValue(undefined);
    this.EndHour.setValue(undefined);
    if (this.IsAllDay.value) {
      this.removeTimeDependencyControl();
      this.addDateDependencyControl();
    } else {
      this.EndDate.setValue(undefined);
      this.removeDateDependencyControl();
      this.addTimeDependencyControl();
    }
  }

  startHourChange($event) {
    this.EndHour.updateValueAndValidity();
  }

  endHourChange($event) {
    this.StartHour.updateValueAndValidity();
  }

  startDateChange($event) {
    if (!this.IsAllDay.value) {
      this.EndDate.setValue(undefined);
    }
    this.EndDate.updateValueAndValidity();
  }

  endDateChange($event) {
    this.StartDate.updateValueAndValidity();
  }

  get StartDate(): FormControl {
    return this.form.get(GarageConstant.START_DATE) as FormControl;
  }
  get StartHour(): FormControl {
    return this.form.get(GarageConstant.START_HOUR) as FormControl;
  }
  get EndDate(): FormControl {
    return this.form.get(GarageConstant.END_DATE) as FormControl;
  }
  get EndHour(): FormControl {
    return this.form.get(GarageConstant.END_HOUR) as FormControl;
  }
  get IsAllDay(): FormControl {
    return this.form.get(GarageConstant.IS_ALL_DAY) as FormControl;
  }
}
