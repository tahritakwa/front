import { Injectable, Inject } from '@angular/core';
import { ResourceService } from '../resource/resource.service';
import { AppConfig } from '../../../../COM/config/app.config';
import { Entityhistory } from '../../../models/shared/entity-history.model';
import { ComponentsConstant } from '../../../constant/shared/components.constant';
import { GenericServiceJava } from '../../../../COM/config/app-config.serviceJava';
import { GenericService } from '../../../../COM/config/app-config.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export class EntityHistoryService  {
  genericServicejava: GenericServiceJava;
  genericService: GenericService<Entityhistory>;
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig, endpoint: string, section: string) {

    if (section === ComponentsConstant.CRM_SECTION) {
      //java endPoint
      this.genericServicejava = new GenericServiceJava(httpClient, appConfig, section, endpoint, new HttpHeaders);
    } else {
      // .Net endPoint
      this.genericService = new GenericService(httpClient, appConfig, new HttpHeaders, endpoint);
    }
  }

  getGenericService() {
    return this.genericServicejava;
  }
}
