import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppConfig } from '../../../../COM/config/app.config'; 
import { Operation } from '../../../../COM/Models/operations';
import { GarageConstant } from '../../../constant/garage/garage.constant';
import { OperationType } from '../../../models/garage/operation-type.model';
import { ObjectToSave } from '../../../models/shared/objectToSend';
import { ResourceServiceGarage } from '../../../shared/services/resource/ressource.service.garage';

@Injectable()
export class OperationTypeService   extends ResourceServiceGarage<OperationType> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig, 'operationType', 'OperationType');
  }

  updateOperationType(model: OperationType): Observable<any> {
    const objectToSave: ObjectToSave = new ObjectToSave();
    objectToSave.Model = model;
    return this.callService(Operation.POST, GarageConstant.UPDATE_OPERATION_TYPE, objectToSave);
  }
}
