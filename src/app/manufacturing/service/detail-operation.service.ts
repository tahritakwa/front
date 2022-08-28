import {Inject, Injectable} from '@angular/core';
import {ResourceServiceJava} from '../../shared/services/resource/resource.serviceJava';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../../../COM/config/app.config';
import {DetailOperationConstant} from '../../constant/manufuctoring/detailOperation.constant';

@Injectable()
export class DetailOperationService extends ResourceServiceJava {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfigManufactoring) {
    super(httpClient, appConfigManufactoring, 'manufacturing', DetailOperationConstant.ENTITY_NAME);
  }


}
