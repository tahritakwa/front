import { Injectable, Inject } from '@angular/core';
import { ResourceService } from '../../../shared/services/resource/resource.service';
import { AppConfig } from '../../../../COM/config/app.config';
import { HttpClient } from '@angular/common/http';
import { Delivery } from '../../../models/ecommerce/delivery.model';

@Injectable()
export class DeliveryService extends ResourceService<Delivery> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(
      httpClient, appConfig,
      'base', 'Delivery', 'Ecommerce');
  }

}
