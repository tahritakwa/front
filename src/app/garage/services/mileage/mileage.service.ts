import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppConfig } from '../../../../COM/config/app.config';
import { Operation } from '../../../../COM/Models/operations';
import { GarageConstant } from '../../../constant/garage/garage.constant';
import { Mileage } from '../../../models/garage/mileage.model';
import { ObjectToSave } from '../../../models/shared/objectToSend';
import { ResourceServiceGarage } from '../../../shared/services/resource/ressource.service.garage';

@Injectable()
export class MileageService extends ResourceServiceGarage<Mileage> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig, 'mileage', 'Mileage');
  }

  GetProposedMileageToDoForCurrentMileage(valueToSend: number): Observable<any> {
    return this.callService(Operation.POST, GarageConstant.GET_PROPOSED_MILEAGE_TO_DO_FOR_CURRENT_MILEAGE, valueToSend);
  }
  public addMileage(mileage: Mileage, operationIds: Array<number>): Observable<any> {
    const data: any = {};
    data[GarageConstant.MILEAGE] = mileage;
    data[GarageConstant.OPERATION_IDS] = operationIds;
    const objectToSave: ObjectToSave = new ObjectToSave();
    objectToSave.Model = data;
    return this.callService(Operation.POST, GarageConstant.ADD_MILEAGE, objectToSave);
  }
  public updateMileage(mileage: Mileage, operationIds: Array<number>): Observable<any> {
    const data: any = {};
    data[GarageConstant.MILEAGE] = mileage;
    data[GarageConstant.OPERATION_IDS] = operationIds;
    const objectToSave: ObjectToSave = new ObjectToSave();
    objectToSave.Model = data;
    return this.callService(Operation.POST, GarageConstant.UPDATE_MILEAGE, objectToSave);
  }
}
