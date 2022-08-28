import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@aspnet/signalr';
import { AppConfig } from '../../../../COM/config/app.config';
import { RepairOrderItem } from '../../../models/garage/repair-order-item.model';
import { ResourceServiceGarage } from '../../../shared/services/resource/ressource.service.garage';

@Injectable()
export class RepairOrderItemService extends ResourceServiceGarage<RepairOrderItem> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig, 'base', 'RepairOrderItem');
  }
}
