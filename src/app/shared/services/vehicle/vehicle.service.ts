import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AppConfig } from '../../../../COM/config/app.config';
import { Vehicle } from '../../../models/sales/vehicle.model';
import { ResourceService } from '../resource/resource.service';

@Injectable()
export class VehicleService extends ResourceService<Vehicle> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(
      httpClient, appConfig, 'vehicle', 'Vehicle', 'Sales');
  }


}
