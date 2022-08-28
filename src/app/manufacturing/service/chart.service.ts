import {Inject, Injectable} from '@angular/core';
import {ResourceServiceJava} from '../../shared/services/resource/resource.serviceJava';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../../../COM/config/app.config';
import {ChartConstant} from '../../constant/manufuctoring/chart.constant';

@Injectable()
export class ChartService extends ResourceServiceJava {
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfigManufactoring) {
    super(httpClient, appConfigManufactoring, ChartConstant.MANUFACTURING, ChartConstant.ENTITY_NAME);
  }

}
