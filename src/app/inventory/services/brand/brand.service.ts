import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { ResourceService } from '../../../shared/services/resource/resource.service';
import { AppConfig } from '../../../../COM/config/app.config';
import { VehicleBrand } from '../../../models/inventory/vehicleBrand.model';
import { Observable } from 'rxjs/Observable';
import { Operation } from '../../../../COM/Models/operations';
import { ItemConstant } from '../../../constant/inventory/item.constant';

@Injectable()
export class BrandService extends ResourceService<VehicleBrand> {
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig, 'vehicleBrand', 'VehicleBrand', 'Inventory');
  }

  public addTecDocMissingVehicleBrands(BrandList: Array<string>): Observable<any> {
    return super.callService(Operation.POST, ItemConstant.ADD_TECDOC_MISSING_VEHICLE_BRANDS, BrandList, null, false);
  }
}
