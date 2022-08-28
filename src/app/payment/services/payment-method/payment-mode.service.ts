import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AppConfig } from '../../../../COM/config/app.config';
import { PaymentMethod } from '../../../models/payment-method/payment-method.model';
import { ResourceService } from '../../../shared/services/resource/resource.service';
import { DataTransferShowSpinnerService } from '../../../shared/services/spinner/data-transfer-show-spinner.service';

@Injectable()
export class PaymentModeService extends ResourceService<PaymentMethod> {
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig,
  @Inject(DataTransferShowSpinnerService) dataTransferShowSpinnerService) {
    super(httpClient, appConfig, 'paymentMethod', 'PaymentMethod', 'Payment', dataTransferShowSpinnerService);
  }
}
