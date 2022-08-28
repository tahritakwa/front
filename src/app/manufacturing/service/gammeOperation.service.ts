import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../../../COM/config/app.config';
import {GammeConstant} from '../../constant/manufuctoring/gamme.constant';
import {ResourceServiceJava} from '../../shared/services/resource/resource.serviceJava';
import {Operation} from '../../../COM/Models/operations';
import {Observable} from 'rxjs';

@Injectable()
export class GammeOperationService extends ResourceServiceJava {
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfigManufactoring) {
    super(httpClient, appConfigManufactoring, GammeConstant.MANUFACTURING, GammeConstant.ENTITY);
  }

  public getGammeOpByGamme(idGamme: Number):  Observable<any> {
    return this.callService(Operation.GET, 'list-gamme-operations-by-gamme-id?idGamme='+idGamme);
  }
}