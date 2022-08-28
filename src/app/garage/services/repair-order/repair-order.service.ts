import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppConfig } from '../../../../COM/config/app.config';
import { Operation } from '../../../../COM/Models/operations';
import { GarageConstant } from '../../../constant/garage/garage.constant';
import { Currency } from '../../../models/administration/currency.model';
import { RepairOrder } from '../../../models/garage/repair-order.model';
import { Sms } from '../../../models/garage/sms.model';
import { ObjectToSend } from '../../../models/sales/object-to-save.model';
import { ObjectToSave } from '../../../models/shared/objectToSend';
import { ResourceServiceGarage } from '../../../shared/services/resource/ressource.service.garage';

@Injectable()
export class RepairOrderService extends ResourceServiceGarage<RepairOrder> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig, 'repairOrder', 'RepairOrder');
  }

  addRepairOrder(model: any): Observable<any> {
    const objectToSave: ObjectToSave = new ObjectToSave();
    objectToSave.Model = model;
    return this.callService(Operation.POST, GarageConstant.ADD_REPAIR_ORDER_API, objectToSave);
  }

  updateRepairOrderAndQuotation(model: any): Observable<any> {
    const objectToSave: ObjectToSave = new ObjectToSave();
    objectToSave.Model = model;
    return this.callService(Operation.POST, GarageConstant.UPDATE_REPAIR_ORDER_AND_QUOTATION_API, objectToSave);
  }

  UpdateRepairOrder(model: any): Observable<any> {
    const objectToSave: ObjectToSave = new ObjectToSave();
    objectToSave.Model = model;
    return this.callService(Operation.POST, GarageConstant.UPDATE_REPAIR_ORDER, objectToSave);
  }

  generateInterventionFromRepairOrder(model: any): Observable<any> {
    const objectToSave: ObjectToSave = new ObjectToSave();
    objectToSave.Model = model;
    return this.callService(Operation.POST, GarageConstant.GENERATE_INTERVENTION_FROM_REPAIR_ORDER_API, objectToSave);
  }

  getRepairOrderByCondiction(idRepairOrder: number): Observable<any> {
    const data: any = {};
    data['idRepairOrder'] = idRepairOrder;
    const objectToSend: ObjectToSend = new ObjectToSend(data, null);
    return this.callService(Operation.POST, GarageConstant.GET_REPAIR_ORDER_BY_CONDICTION, objectToSend);
  }

  sendQuotationInMail(repairOrder: RepairOrder, companyCurrency: Currency, idTiers: number, language: string): Observable<any> {
    const data: any = {};
    data['repairOrder'] = repairOrder;
    data['idTiers'] = idTiers;
    data['companyCurrency'] = companyCurrency;
    data['language'] = language;
    const objectToSend: ObjectToSend = new ObjectToSend(data, null);
    return this.callService(Operation.POST, GarageConstant.GENERATE_QUOTATION_MAIL, objectToSend);
  }

  sendReminderSmsMessage(smsMessage: Sms, tiersIdList: number[]): Observable<any> {
    const data: any = {};
    data['smsMessage'] = smsMessage;
    data['tiersIdList'] = tiersIdList;
    const objectToSend: ObjectToSend = new ObjectToSend(data, null);
    return this.callService(Operation.POST, GarageConstant.SEND_REMINDER_SMS_MESSAGE, objectToSend);
  }
}
