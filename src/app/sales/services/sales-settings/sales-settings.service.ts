import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../../../COM/config/app.config';
import { ResourceService } from '../../../shared/services/resource/resource.service';
import { SaleSettings } from '../../../models/sales/sales-settings.model';


@Injectable()
export class SalesSettingsService extends ResourceService<SaleSettings> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig, 'base', 'SaleSettings', 'Sales');
  }
}
