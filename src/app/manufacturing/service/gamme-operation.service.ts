import {Inject, Injectable} from '@angular/core';
import {ResourceServiceJava} from '../../shared/services/resource/resource.serviceJava';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../../../COM/config/app.config';
import {GammeOperationConstant} from '../../constant/manufuctoring/gamme-operation.constant';
import {Operation} from '../../../COM/Models/operations';
import {Observable} from 'rxjs';

@Injectable()
export class GammeOperationService extends ResourceServiceJava {
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfigManufactoring) {
    super(httpClient, appConfigManufactoring, GammeOperationConstant.MANUFACTURING, GammeOperationConstant.ENTITY_NAME);
  }
  public getGammeOpByGamme(idGamme: Number, page, size):  Observable<any> {
    return this.callService(Operation.GET, 'list-gamme-operations-by-gamme-id?idGamme='+idGamme + `?page=${page}&size=${size}`);
  }
}
