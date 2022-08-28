import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AppConfig } from '../../../../COM/config/app.config';
import { OperationKitItem } from '../../../models/garage/operation-kit-item.model';
import { ResourceServiceGarage } from '../../../shared/services/resource/ressource.service.garage';

@Injectable()
export class OperationKitItemService extends ResourceServiceGarage<OperationKitItem> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig, 'operationKitItem', 'OperationKitItem');
  }
}
