import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AppConfig } from '../../../../COM/config/app.config';
import { VehicleEnergy } from '../../../models/garage/vehicle-energy.model';
import { ResourceService } from '../resource/resource.service';

@Injectable()
export class VehicleEnergyService extends ResourceService<VehicleEnergy> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(
      httpClient, appConfig, 'base', 'VehicleEnergy', 'Sales');
  }


}
