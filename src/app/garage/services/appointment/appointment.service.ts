import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppConfig } from '../../../../COM/config/app.config';
import { Operation } from '../../../../COM/Models/operations';
import { GarageConstant } from '../../../constant/garage/garage.constant';
import { Appointment } from '../../../models/garage/appointment.model';
import { ObjectToSend } from '../../../models/sales/object-to-save.model';
import { ResourceServiceGarage } from '../../../shared/services/resource/ressource.service.garage';

@Injectable()
export class AppointmentService extends ResourceServiceGarage<Appointment> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig, 'appointment', 'Appointment');
  }

  getAppointmentsList(startDate: Date, endDate: Date, idGarage: number, idVehicle: number): Observable<any> {
    const data: any = {};
    data['idGarage'] = idGarage;
    data['idVehicle'] = idVehicle;
    data['startDate'] = startDate;
    data['endDate'] = endDate;
    return this.callService(Operation.POST, GarageConstant.GET_APPOINTMENT_LIST, data);
  }

}

