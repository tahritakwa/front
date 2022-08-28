import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AppConfig } from '../../../../COM/config/app.config';
import { InterventionLoanVehicle } from '../../../models/garage/intervention-loan-vehicle.model';
import { ResourceServiceGarage } from '../../../shared/services/resource/ressource.service.garage';

@Injectable()
export class InterventionLoanVehicleService extends ResourceServiceGarage<InterventionLoanVehicle> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig, 'interventionLoanVehicle', 'InterventionLoanVehicle');
  }
}
