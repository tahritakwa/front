import {Inject, Injectable} from '@angular/core';
import {ResourceServiceJava} from '../../../shared/services/resource/resource.serviceJava';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../../../../COM/config/app.config';
import {Observable} from 'rxjs/Observable';
import {Operation} from '../../../../COM/Models/operations';
import {ActionConstant} from '../../../constant/crm/action.constant';

@Injectable()
export class EventService extends ResourceServiceJava {

  constructor(@Inject(HttpClient) httpClient, private httpClients: HttpClient, @Inject(AppConfig) appConfigCrm) {
    super(httpClient, appConfigCrm, 'crm', 'event');
  }
  public getAllAddress(lat: number , lng: number): Observable<any> {
    const url = 'https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=' + lat + '&lon=' + lng;
    return this.http.get(url);
  }

  public getEvntsByCommercial(commercialId, isArchived): Observable<any> {
    return this.callService(Operation.GET, ActionConstant.CALANDER_URL +
      ActionConstant.COMMERCIAL_ID + commercialId + ActionConstant.IS_ARCHIVED + isArchived);
  }

}
