import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AppConfig } from '../../../../COM/config/app.config';
import { VehicleEnergy } from '../../../models/garage/vehicle-energy.model';
import { ResourceServiceGarage } from '../../../shared/services/resource/ressource.service.garage';

@Injectable()
export class VehicleEnergyService extends ResourceServiceGarage<VehicleEnergy> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig, 'vehicleEnergy', 'VehicleEnergy');
  }

}
