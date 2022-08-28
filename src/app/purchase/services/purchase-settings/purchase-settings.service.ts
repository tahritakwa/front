import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../../../COM/config/app.config';
import { ResourceService } from '../../../shared/services/resource/resource.service';
import { PurchaseSettings } from '../../../models/purchase/purchase-settings.model';

@Injectable()
export class PurchaseSettingsService extends ResourceService<PurchaseSettings> {
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig, 'base', 'PurchaseSettings', 'Sales');
  }
}
