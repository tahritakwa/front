import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { ResourceService } from '../../../shared/services/resource/resource.service';
import { AppConfig } from '../../../../COM/config/app.config';
import { SalesPrice } from '../../../models/sales/sales-price.model';

@Injectable()
export class SalesPriceService extends ResourceService<SalesPrice> {
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig, 'salesPrice', 'SalesPrice', 'Sales');
  }
}
