import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@aspnet/signalr';
import { AppConfig } from '../../../../COM/config/app.config';
import { RepairOrderOperation } from '../../../models/garage/repair-order-operation.model';
import { ResourceServiceGarage } from '../../../shared/services/resource/ressource.service.garage';

@Injectable()
export class RepairOrderOperationService extends ResourceServiceGarage<RepairOrderOperation> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig, 'base', 'RepairOrderOperation');
  }
}
