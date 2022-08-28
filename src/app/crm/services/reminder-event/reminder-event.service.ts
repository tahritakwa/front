import {Inject, Injectable} from '@angular/core';
import {ResourceServiceJava} from '../../../shared/services/resource/resource.serviceJava';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../../../../COM/config/app.config';
import {Observable} from 'rxjs/Observable';
import {Operation} from '../../../../COM/Models/operations';
import {ReminderConstant} from '../../../constant/crm/reminder.constant';

@Injectable()
export class ReminderEventService extends ResourceServiceJava {

  constructor(@Inject(HttpClient) httpClient, private httpClients: HttpClient, @Inject(AppConfig) appConfigCrm) {
    super(httpClient, appConfigCrm, 'crm', 'reminderEvent');
  }

  public getReminderByCommercial(commercialId): Observable<any> {
    return this.callService(Operation.GET, ReminderConstant.COMMERCIAL_ID + commercialId);
  }

}
