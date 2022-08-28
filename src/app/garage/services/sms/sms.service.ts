import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core'; 
import { Observable } from 'rxjs/Observable';
import { AppConfig } from '../../../../COM/config/app.config';
import { Operation } from '../../../../COM/Models/operations';
import { GarageConstant } from '../../../constant/garage/garage.constant';
import { Sms } from '../../../models/garage/sms.model';
import { ObjectToSave } from '../../../models/shared/objectToSend';
import { ResourceServiceGarage } from '../../../shared/services/resource/ressource.service.garage';

@Injectable()
export class SmsService extends ResourceServiceGarage<Sms> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig, 'sms', 'Sms');
  }

  sendAndSaveSmsMessage(model: any): Observable<any> {
    const objectToSave: ObjectToSave = new ObjectToSave();
    objectToSave.Model = model;
    return this.callService(Operation.POST, GarageConstant.SEND_AND_SAVE_SMS_MESSAGE, objectToSave);
  }

}
