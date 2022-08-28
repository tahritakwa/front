import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AppConfig } from '../../../../COM/config/app.config'; 
import { VehicleBrand } from '../../../models/garage/vehicle-brand.model';
import { ResourceServiceGarage } from '../../../shared/services/resource/ressource.service.garage';

@Injectable()
export class VehicleBrandService extends ResourceServiceGarage<VehicleBrand> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig, 'vehicleBrand', 'VehicleBrand', 'Inventory');
  }

}
