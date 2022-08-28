import { Injectable, Inject } from '@angular/core';
import { AppConfig } from '../../../COM/config/app.config';
import { HttpClient } from '@angular/common/http';
import { ResourceServiceJava } from '../../shared/services/resource/resource.serviceJava';
import {SectionConstant} from '../../constant/manufuctoring/section.constant';

@Injectable()
export class SectionService extends ResourceServiceJava {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfigManufactoring) {
    super(httpClient, appConfigManufactoring, 'manufacturing', SectionConstant.ENTITY_NAME);
  }

}
