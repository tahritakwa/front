import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppConfig } from '../../../../COM/config/app.config';
import { Operation } from '../../../../COM/Models/operations';
import { GarageConstant } from '../../../constant/garage/garage.constant';
import { OperationKit } from '../../../models/garage/operation-kit.model';
import { ObjectToSend } from '../../../models/sales/object-to-save.model';
import { ObjectToSave } from '../../../models/shared/objectToSend';
import { ResourceServiceGarage } from '../../../shared/services/resource/ressource.service.garage';

@Injectable()
export class OperationKitService extends ResourceServiceGarage<OperationKit> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig, 'operationKit', 'OperationKit');
  }

  addOperationKit(model: any): Observable<any> {
    const objectToSave: ObjectToSave = new ObjectToSave();
    objectToSave.Model = model;
    return this.callService(Operation.POST, GarageConstant.ADD_OPERATIONKIT_API, objectToSave);
  }

  updateOperationKit(model: any): Observable<any> {
    const objectToSave: ObjectToSave = new ObjectToSave();
    objectToSave.Model = model;
    return this.callService(Operation.POST, GarageConstant.UPDATE_OPERATIONKIT_API, objectToSave);
  }

  getOperationKitByCondiction(idOperationKit: number): Observable<any> {
    const data: any = {};
    data['idOperationKit'] = idOperationKit;
    const objectToSend: ObjectToSend = new ObjectToSend(data, null);
    return this.callService(Operation.POST, GarageConstant.GET_OPERATION_KIT_BYCONDICTION, objectToSend);
  }

  getOperationAndItemForOperationKit(listIdsOperationKit: Array<number>, idWarehouse?: number): Observable<any> {
    const data: any = {};
    data['listIdsOperationKit'] = listIdsOperationKit;
    data['idWarehouse'] = idWarehouse;
    const objectToSend: ObjectToSend = new ObjectToSend(data, null);
    return this.callService(Operation.POST, GarageConstant.GET_OPERATION_AND_ITEM_FOR_OPERATION_KIT, objectToSend);
  }
}
