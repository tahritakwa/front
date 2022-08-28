import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResourceService } from '../../../shared/services/resource/resource.service';
import { AppConfig } from '../../../../COM/config/app.config';
import { PaymentMode } from '../../../models/payment/payment-mode';

@Injectable()
export class PaymentMethodService extends ResourceService<PaymentMode> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig, 'base', 'PaymentMethod', 'Payment');
  }
}
