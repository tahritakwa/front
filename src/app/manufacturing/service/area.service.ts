import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../../COM/config/app.config';
import { AreaConstant } from '../../constant/manufuctoring/area.constant';
import { ResourceServiceJava } from '../../shared/services/resource/resource.serviceJava';

@Injectable()
export class AreaService extends ResourceServiceJava {
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfigManufactoring) {
    super(httpClient, appConfigManufactoring, AreaConstant.MANUFACTURING, AreaConstant.ENTITY_NAME);
  }

}
