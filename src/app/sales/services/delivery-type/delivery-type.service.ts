import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResourceService } from '../../../shared/services/resource/resource.service';
import { DeliveryType } from '../../../models/shared/deliveryType.model';
import { AppConfig } from '../../../../COM/config/app.config';

@Injectable()
export class DeliveryTypeService extends ResourceService<DeliveryType> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(
      httpClient, appConfig,
      'deliveryType', 'DeliveryType', 'Sales');
  }
}
