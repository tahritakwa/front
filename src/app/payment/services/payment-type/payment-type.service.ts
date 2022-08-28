import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResourceService } from '../../../shared/services/resource/resource.service';
import { PaymentType } from '../../../models/payment/payement-type.model';
import { AppConfig } from '../../../../COM/config/app.config';

@Injectable()
export class PaymentTypeService extends ResourceService<PaymentType> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig, 'paymentType', 'PaymentType', 'Payment');
  }
}
