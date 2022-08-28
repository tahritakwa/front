import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { DataSourceRequestState } from '@progress/kendo-data-query';
import { Observable } from 'rxjs/Observable';
import { AppConfig } from '../../../../COM/config/app.config';
import { Operation } from '../../../../COM/Models/operations';
import { GarageConstant } from '../../../constant/garage/garage.constant';
import { Vehicle } from '../../../models/garage/vehicle.model';
import { ResourceServiceGarage } from '../../../shared/services/resource/ressource.service.garage';
import { PredicateFormat } from '../../../shared/utils/predicate';

@Injectable()
export class VehicleService extends ResourceServiceGarage<Vehicle> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig, 'vehicle', 'Vehicle');
  }

  public getVehicleRegistrationNumberDropdown(predicate: PredicateFormat): Observable<any> {
    return this.callService(Operation.POST, GarageConstant.GET_VEHICLE_REGISTRATION_NUMBER_DROPDOWN, predicate);
  }

  public getLoanVehicleDropdown(isAvailable: boolean, idVehicle?: number): Observable<any> {
    const data = {};
    data['isAvailable'] = isAvailable;
    data['idVehicle'] = idVehicle;
    return this.callService(Operation.POST, GarageConstant.GET_LOAN_VEHICLE_DROPDOWN, data);
  }

  public getVehicleListWithTiers(state: DataSourceRequestState, predicate: PredicateFormat): Observable<any> {
    super.prepareServerOptions(state, predicate);
    return this.callService(Operation.POST, GarageConstant.GET_VEHICLE_LIST_WITH_TIERS, predicate);
  }
  public downloadCustomerVehicleExcelTemplate(): Observable<any> {
    return super.callService(Operation.GET, 'downloadCustomerVehicleExcelTemplate');
  }
  /**
   * upload Employees from excel file
   * @param file
   */
   public uploadVehicle(file): Observable<any> {
    return super.callService(Operation.POST, GarageConstant.IMPORT_FILE_VEHICLES, file);
  }
/**
   * save excel imported Data
   * @param data
   */
 public saveImportedData(data): Observable<any> {
  return super.callService(Operation.POST, GarageConstant.INSERT_VEHICLE_LIST, data);
}
}
