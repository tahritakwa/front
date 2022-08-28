import {Inject, Injectable} from '@angular/core';
import {ResourceServiceJava} from '../../shared/services/resource/resource.serviceJava';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../../../COM/config/app.config';
import {UnitOfMeasureConstant} from '../../constant/manufuctoring/unitOfMeasure.constant';

@Injectable()
export class UnitOfMesureJavaService extends ResourceServiceJava {
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfigManufactoring) {
    super(httpClient, appConfigManufactoring, UnitOfMeasureConstant.MANUFACTURING, UnitOfMeasureConstant.ENTITY_NAME);
  }

}
