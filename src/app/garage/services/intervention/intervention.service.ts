import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { DataCollection } from '@progress/kendo-angular-grid/dist/es2015/data/data.collection';
import { DataSourceRequestState } from '@progress/kendo-data-query';
import { Observable } from 'rxjs/Observable';
import { AppConfig } from '../../../../COM/config/app.config';
import { Operation } from '../../../../COM/Models/operations';
import { GarageConstant } from '../../../constant/garage/garage.constant';
import { Intervention } from '../../../models/garage/intervention.model';
import { ObjectToSend } from '../../../models/sales/object-to-save.model';
import { ObjectToSave } from '../../../models/shared/objectToSend';
import { ResourceServiceGarage } from '../../../shared/services/resource/ressource.service.garage';
import { PredicateFormat } from '../../../shared/utils/predicate';
@Injectable()
export class InterventionService extends ResourceServiceGarage<Intervention> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig, 'intervention', 'Intervention');
  }

  getInterventionByCondiction(idIntervention: number): Observable<any> {
    const data: any = {};
    data['idIntervention'] = idIntervention;
    const objectToSend: ObjectToSend = new ObjectToSend(data, null);
    return this.callService(Operation.POST, GarageConstant.GET_INTERVENTION_BY_CONDICTION, objectToSend);
  }

  addIntervention(model: any): Observable<any> {
    const objectToSave: ObjectToSave = new ObjectToSave();
    objectToSave.Model = model;
    return this.callService(Operation.POST, GarageConstant.ADD_INTERVENTION_API, objectToSave);
  }

  addInterventionToTheEvent(model: any, idEvent: number): Observable<any> {
    const data = {};
    data['intervention'] = model;
    data['idEvent'] = idEvent;
    const objectToSend: ObjectToSend = new ObjectToSend(data, null);
    return this.callService(Operation.POST, GarageConstant.ADD_INTERVENTION_API_TO_THE_EVENT, objectToSend);
  }

  updateIntervention(model: any): Observable<any> {
    const objectToSave: ObjectToSave = new ObjectToSave();
    objectToSave.Model = model;
    return this.callService(Operation.POST, GarageConstant.UPDATE_INTERVENTION_API, objectToSave);
  }

  startIntervention(model: any): Observable<any> {
    const objectToSave: ObjectToSave = new ObjectToSave();
    objectToSave.Model = model;
    return this.callService(Operation.POST, GarageConstant.START_INTERVENTION_API, objectToSave);
  }

  finishIntervention(model: any): Observable<any> {
    const objectToSave: ObjectToSave = new ObjectToSave();
    objectToSave.Model = model;
    return this.callService(Operation.POST, GarageConstant.FINISH_INTERVENTION_API, objectToSave);
  }

  getSparePartsPriceForInterventionItem(idGarage: number, idItem: number, quantity: number, discount?: number): Observable<any> {
    const data: any = {};
    data['idGarage'] = idGarage;
    data['idItem'] = idItem;
    data['quantity'] = quantity;
    data['discount'] = discount;
    const objectToSend: ObjectToSend = new ObjectToSend(data, null);
    return this.callService(Operation.POST, GarageConstant.GET_SPARE_PART_SPRICE_FOR_INTERVENTION_ITEM, objectToSend);
  }

  getItemsRemaningQuantityForWarehouse(itemsQuantities, idWarehouse): Observable<any> {
    const data: any = {};
    data['idWarehouse'] = idWarehouse;
    data['itemsQuantities'] = itemsQuantities;
    return this.callService(Operation.POST, GarageConstant.GET_ITEMS_REMAINING_QUANTITY_FOR_WAREHOUSE, data);
  }

  getLoanVehicleHistory(state: DataSourceRequestState, predicate: PredicateFormat, idVehicle: number): Observable<any> {
    super.prepareServerOptions(state, predicate);
    const data: any = {};
    data['predicate'] = predicate;
    data['idVehicle'] = idVehicle;
    const objectToSend: ObjectToSend = new ObjectToSend(data, null);
    return this.callService(Operation.POST, GarageConstant.GET_LOAN_VEHICLE_HISTORY, objectToSend);
  }
  getCustomerVehicleHistory(state: DataSourceRequestState, predicate: PredicateFormat, idVehicle: number): Observable<any> {
    super.prepareServerOptions(state, predicate);
    const data: any = {};
    data['predicate'] = predicate;
    data['idVehicle'] = idVehicle;
    const objectToSend: ObjectToSend = new ObjectToSend(data, null);
    return this.callService(Operation.POST, GarageConstant.GET_CUSTOMER_VEHICLE_HISTORY, objectToSend);
  }
}
