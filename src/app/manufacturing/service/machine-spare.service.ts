import { Injectable, Inject } from '@angular/core';
import { AppConfig } from '../../../COM/config/app.config';
import { MachineSpareConstant } from '../../constant/manufuctoring/machineSpare.constant';
import { HttpClient } from '@angular/common/http';
import { ResourceServiceJava } from '../../shared/services/resource/resource.serviceJava';

@Injectable()
export class MachineSpareService  extends ResourceServiceJava{
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfigManufactoring) {
    super(httpClient, appConfigManufactoring, MachineSpareConstant.MANUFACTURING, MachineSpareConstant.ENTITY_NAME);
  }
}
