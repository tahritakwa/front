import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SettlementMode } from '../../../models/sales/settlement-mode.model';
import { ResourceService } from '../../../shared/services/resource/resource.service';
import { AppConfig } from '../../../../COM/config/app.config';


@Injectable()
export class SettlementModeService extends ResourceService<SettlementMode> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig, 'settlementMode', 'SettlementMode', 'Sales');
  }
}
