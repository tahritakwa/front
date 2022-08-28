
import { ResourceService } from '../../../shared/services/resource/resource.service';
import { Injectable, Inject } from '@angular/core';
import { AppConfig } from '../../../../COM/config/app.config';
import { HttpClient } from '@angular/common/http';
import { PriceRequestDetail } from '../../../models/purchase/price-request-detail.model';

export const linesToAdd = [];
@Injectable()
export class PriceRequestDetailService extends ResourceService<PriceRequestDetail> {
  public lineData: any[] = linesToAdd;
  public counter: number = linesToAdd.length;
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig, 'base', 'PriceRequestDetail', 'Sales');
  }
  public LinesToAdd(): any[] {
    return this.lineData;
  }
}
