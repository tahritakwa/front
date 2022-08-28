import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResourceService } from '../../../shared/services/resource/resource.service';
import { PaymentMethod } from '../../../models/payment-method/payment-method.model';
import { AppConfig } from '../../../../COM/config/app.config';
import { DetailsPaymentMode } from '../../../models/payment/details-payment-mode';

@Injectable()
export class DetailsSettlementModeService extends ResourceService<DetailsPaymentMode> {
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig, 'detailsSettlementMode', 'DetailsSettlementMode', 'Sales');
  }
}
