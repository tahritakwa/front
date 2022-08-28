import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@aspnet/signalr';
import { AppConfig } from '../../../../COM/config/app.config';
import { RepairOrderOperationKit } from '../../../models/garage/repair-order-operation-kit.model';
import { ResourceServiceGarage } from '../../../shared/services/resource/ressource.service.garage';

@Injectable()
export class RepairOrderOperationKitService extends ResourceServiceGarage<RepairOrderOperationKit> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig, 'base', 'RepairOrderOperationKit');
  }
}
