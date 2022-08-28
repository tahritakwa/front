import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../../../../COM/config/app.config';
import {ResourceServiceJava} from '../../../shared/services/resource/resource.serviceJava';
import {CrmConstant} from '../../../constant/crm/crm.constant';
import {Observable} from 'rxjs/Observable';
import {Operation} from '../../../../COM/Models/operations';
import {HistoryConstant} from '../../../constant/crm/history.constant';



@Injectable()
export class HistoryService extends ResourceServiceJava {
  constructor(@Inject(HttpClient) httpClient, private httpClients: HttpClient, @Inject(AppConfig) appConfigCrm) {
    super(httpClient, appConfigCrm, CrmConstant.CRM, HistoryConstant.HISTORY);
  }

  public getEntityHistoriesPage(entity, entityId, page, size): Observable<any> {
    return this.callService(Operation.GET, '/entity/' + entity + '?entityId=' + entityId + '&page=' + page + '&size=' + size);
  }

}
