import { Component, OnInit, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SchedulerModelFields } from '@progress/kendo-angular-scheduler';
import { EnumValues } from 'enum-values';
import { GarageConstant } from '../../../../constant/garage/garage.constant';
import { SharedConstant } from '../../../../constant/shared/shared.constant';
import { VehicleCategoryEnumerator } from '../../../../models/enumerators/vehicle-category.enum';
import { Intervention } from '../../../../models/garage/intervention.model';
import { Reception } from '../../../../models/garage/reception.model';
import { SwalWarring } from '../../../../shared/components/swal/swal-popup';
import { FormModalDialogService } from '../../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { AddAppointmentPopUpComponent } from '../../../components/add-appointment-pop-up/add-appointment-pop-up.component';
import { AppointmentService } from '../../../services/appointment/appointment.service';
import { InterventionService } from '../../../services/intervention/intervention.service';
import { AuthService } from '../../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../../Structure/permission-constant';
import { AppointmentStateEnumerator } from '../../../../models/enumerators/appointment-state.enum';
@Component({
  selector: 'app-appointment-request',
  templateUrl: './appointment-request.component.html',
  styleUrls: ['./appointment-request.component.scss',
    '../../../../../assets/styles/planning.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppointmentRequestComponent implements OnInit {
  public events: SchedulerModelFields[] = [];
  public group: any;
  public searchFormGroup: FormGroup;

  // Calender Dates
  public todayDate: Date = new Date();
  public startDate: Date;
  public endDate: Date;

  public dateTimeFormat = SharedConstant.PIPE_FORMAT_DATE_TIME;
  public dateFormat = this.translate.instant(SharedConstant.DATE_FORMAT);
  // Calendar setting
  public startTime = '08:00';
  public endTime = '19:00';
  // Permission Parameters
  public hasAddPermission: boolean;
  public hasUpdatePermission: boolean;
  public hasShowPermission: boolean;
  public hasDeletePermission: boolean;
  public hasAddInterventionToTheEvent: boolean;
  public hasUpdateInterventionToTheEvent: boolean;
  // Event Fileds model
  public eventFields: SchedulerModelFields = {
    id: 'Id',
    title: 'Title',
    description: 'Description',
    start: 'StartDate',
    end: 'EndDate',
    isAllDay: 'IsAllDay',
    recurrenceId: 'recurrenceId'
  };
  // Enums
  appointmentStateEnumerator = AppointmentStateEnumerator;
  public vehicleCategory = VehicleCategoryEnumerator.Customer;

  constructor(public translate: TranslateService, private fb: FormBuilder, private swalWarning: SwalWarring,
    private router: Router, private viewRef: ViewContainerRef, private appointmentService: AppointmentService,
    private interventionService: InterventionService, private formModalDialogService: FormModalDialogService,
    private authService: AuthService) { }

  ngOnInit() {
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.GaragePermissions.ADD_APPOINTMENT);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.GaragePermissions.UPDATE_APPOINTMENT);
    this.hasShowPermission = this.authService.hasAuthority(PermissionConstant.GaragePermissions.SHOW_APPOINTMENT);
    this.hasDeletePermission = this.authService.hasAuthority(PermissionConstant.GaragePermissions.DELETE_APPOINTMENT);
    this.hasAddInterventionToTheEvent = this.authService.hasAuthority(PermissionConstant.GaragePermissions.ADD_INTERVENTION);
    this.hasUpdateInterventionToTheEvent = this.authService.hasAuthority(PermissionConstant.GaragePermissions.UPDATE_INTERVENTION);

    this.createSearchFormGroup();
  }

  goToVehicleDetails(id) {
    this.router.navigate([]).then(() => {
      window.open(GarageConstant.NAVIGATE_TO_EDIT_CUSTOMERS_VEHICLES.concat(id), '_blank');
    });
  }

  public removeEvent(dataItem) {
    this.swalWarning.CreateSwal(GarageConstant.DELETE_MESSAGE).then((result) => {
      if (result.value) {
        this.appointmentService.remove(dataItem).subscribe(() => {
          this.initDataSource();
        });
      }
    });
  }

  createSearchFormGroup() {
    this.searchFormGroup = this.fb.group({
      IdGarage: [undefined],
      IdVehicle: [undefined]
    });
  }

  addNewAppointment() {
    const title = GarageConstant.ADD_APPOINTMENT;
    const data = {'idGarage' : this.IdGarage.value, 'idVehicle' : this.IdVehicle.value};
    this.formModalDialogService.openDialog(title, AddAppointmentPopUpComponent, this.viewRef,
      this.initDataSource.bind(this), data, true, SharedConstant.MODAL_DIALOG_SIZE_M);
  }


  loadDataSource($event) {
    this.todayDate = $event.selectedDate;
    this.startDate = $event.dateRange.start;
    this.endDate = $event.dateRange.end;
    // Init event in the range of start and end date
    this.initDataSource();
  }

  initDataSource(): void {
    this.appointmentService.getAppointmentsList(this.startDate, this.endDate,
       this.IdGarage.value, this.IdVehicle.value).subscribe(res => {
        res.forEach(x => {
          x.StartDate = new Date(x.StartDate);
          x.EndDate = new Date(x.EndDate);
        });
        this.events = res;
      });
  }

  addInterventionToTheEvent($event) {
    if ($event && $event.dataItem && $event.dataItem.Id && $event.dataItem.IdVehicle && $event.dataItem.IdGarage) {
      // Create the reception model
      const reception: Reception = new Reception();
      reception.IdVehicle = $event.dataItem.IdVehicle;
      const today = new Date();
      reception.ReceiptDate = new Date();
      reception.ReceiptHours =
        String(today.getHours()).concat(':').concat(String(today.getMinutes()));
      // Create the intervention model
      const intervention: Intervention = new Intervention();
      intervention.IdGarage = $event.dataItem.IdGarage;
      intervention.IdReceptionNavigation = reception;
      this.interventionService.addInterventionToTheEvent(intervention, $event.dataItem.Id).subscribe((result) => {
        this.closeAppointmentEditPopUp();
        this.router.navigate([]).then(() => {
          window.open(GarageConstant.NAVIGATE_TO_INTERVENTION_ORDER_EDIT.concat(result.Id), '_blank');
        });
      });
    } else {
      this.swalWarning.CreateSwal(GarageConstant.ADD_INTERVENTION_FROM_EVENT_SWAL_TEXT,
        GarageConstant.ADD_INTERVENTION_FROM_EVENT_SWAL_TITLE, GarageConstant.OKAY, null, true);
    }
  }

  updateInterventionOfTheEvent($event) {
    if ($event && $event.dataItem && $event.dataItem.IdIntervention) {
      this.router.navigate([]).then(() => {
        window.open(GarageConstant.NAVIGATE_TO_INTERVENTION_ORDER_EDIT.concat($event.dataItem.IdIntervention), '_blank');
      });
    }
  }

  editTheEvent($event) {
    const data = {'id' : $event.dataItem.Id};
    const title = GarageConstant.UPDATE_APPOINTMENT;
    this.formModalDialogService.openDialog(title, AddAppointmentPopUpComponent, this.viewRef,
      this.closeAppointmentEditPopUp.bind(this), data , true, SharedConstant.MODAL_DIALOG_SIZE_M);
  }

  private closeAppointmentEditPopUp() {
    this.initDataSource();
  }

  // Getters Section
  get IdGarage(): FormControl {
    return this.searchFormGroup.get(GarageConstant.ID_GARAGE) as FormControl;
  }

  get IdVehicle(): FormControl {
    return this.searchFormGroup.get(GarageConstant.ID_VEHICLE) as FormControl;
  }
}
