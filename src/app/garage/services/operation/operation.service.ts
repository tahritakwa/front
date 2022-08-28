import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { DataSourceRequestState } from '@progress/kendo-data-query';
import { Observable } from 'rxjs/Observable';
import { AppConfig } from '../../../../COM/config/app.config';
import { Operation as HttpMethod } from '../../../../COM/Models/operations';
import { GarageConstant } from '../../../constant/garage/garage.constant';
import { OperationType } from '../../../models/garage/operation-type.model';
import { Operation } from '../../../models/garage/operation.model';
import { ObjectToSave } from '../../../models/sales/object-to-save.model';
import { ObjectToSave as ObjectToSend } from '../../../models/shared/objectToSend';
import { ResourceServiceGarage } from '../../../shared/services/resource/ressource.service.garage';
import { PredicateFormat } from '../../../shared/utils/predicate';


@Injectable()
export class OperationService extends ResourceServiceGarage<Operation> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig, 'operation', 'Operation');
  }

  public getOperationAmountsAndExcpectedDuration(operationType: OperationType, unitNumber: number, taxeValue: number): Observable<any> {
    const data: any = {};
    data['operationType'] = operationType;
    data['unitNumber'] = unitNumber;
    data['taxeValue'] = taxeValue;
    const objectToSave: ObjectToSave = new ObjectToSave();
    objectToSave.Model = data;
    return this.callService(HttpMethod.POST, GarageConstant.GET_OPERATION_AMOUNTS_AND_EXCPECTED_DURATION, objectToSave);
  }

  public getOperationDurationFormat(idOperation: number, duration: number): Observable<any> {
    const data: any = {};
    data['idOperation'] = idOperation;
    data['duration'] = duration;
    const objectToSave: ObjectToSave = new ObjectToSave();
    objectToSave.Model = data;
    return this.callService(HttpMethod.POST, GarageConstant.GET_OPERATION_DURATION, objectToSave);
  }

  public addOperation(model: Operation): Observable<any> {
    const objectToSend: ObjectToSend = new ObjectToSend();
    objectToSend.Model = model;
    return this.callService(HttpMethod.POST, GarageConstant.ADD_OPERATION_URL, objectToSend);
  }

  public updateOperation(model: Operation): Observable<any> {
    const objectToSend: ObjectToSend = new ObjectToSend();
    objectToSend.Model = model;
    return this.callService(HttpMethod.POST, GarageConstant.UPDATE_OPERATION_URL, objectToSend);
  }

  public deleteOperation(idOperation: number, idItem: number): Observable<any> {
    const data: any = {};
    data['idOperation'] = idOperation;
    data['idItem'] = idItem;
    const objectToSave: ObjectToSave = new ObjectToSave();
    objectToSave.Model = data;
    return this.callService(HttpMethod.PUT, GarageConstant.DELETE_OPERATION, objectToSave);
  }

  public getOperationById(idOperation: number):Observable<any> {
    return this.callService(HttpMethod.GET, GarageConstant.GET_OPERATION_BY_ID.concat('/').concat(String(idOperation)));
  }

  getExpectedDuration(selectedOperation: any, translateService: any): string {
    let duration = '';
    if (selectedOperation.DurationInDays > 0) {
      duration = duration.concat(String(selectedOperation.DurationInDays))
        .concat(translateService.instant(GarageConstant.DAYS));
    }
    if (selectedOperation.DurationInHours > 0) {
      duration = duration.concat(String(selectedOperation.DurationInHours))
        .concat(translateService.instant(GarageConstant.HOURS));
    }
    if (selectedOperation.DurationInMinutes > 0) {
      duration = duration.concat(String(selectedOperation.DurationInMinutes))
        .concat(translateService.instant(GarageConstant.MINUTES));
    }
    if (selectedOperation.DurationInSecondes > 0) {
      duration = duration.concat(String(selectedOperation.DurationInSecondes))
        .concat(translateService.instant(GarageConstant.SECONDES));
    }
    return duration;
  }

  public getOperationsForMileage(state: DataSourceRequestState, predicate: PredicateFormat): Observable<any> {
    super.prepareServerOptions(state, predicate);
    return this.callService(HttpMethod.POST, GarageConstant.GET_OPERATIONS_FOR_MILEAGE, predicate);
  }

  getSparePartsPriceForOneItem(idItem: number, quantity: number, idWarehouse?: number, discount?: number): Observable<any> {
    const data: any = {};
    data['idWarehouse'] = idWarehouse;
    data['idItem'] = idItem;
    data['quantity'] = quantity;
    data['discount'] = discount;
    const objectToSend: ObjectToSave = new ObjectToSave(data, null);
    return this.callService(HttpMethod.POST, GarageConstant.GET_SPARE_PART_SPRICE_FOR_ONE_ITEM, objectToSend);
  }
  public getOperationsForKitOperation(state: DataSourceRequestState, predicate: PredicateFormat): Observable<any> {
    super.prepareServerOptions(state, predicate);
    return this.callService(HttpMethod.POST, GarageConstant.GET_OPERATIONS_FOR_OPERATION_KIT, predicate);
  }
  public getProposedOperationWithPredicate(state: DataSourceRequestState, predicate: PredicateFormat, idMileage: number): Observable<any> {
    super.prepareServerOptions(state, predicate);
    const data: any = {};
    data['predicate'] = predicate;
    data['idMileage'] = idMileage;
    const objectToSend: ObjectToSave = new ObjectToSave(data, null);
    return this.callService(HttpMethod.POST, GarageConstant.GET_PROPOSED_OPERATION_WITH_PREDICATE, objectToSend);
  }
}
