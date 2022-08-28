import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../../../COM/config/app.config';
import { DiscountGroupTiers } from '../../../models/administration/discount-group-tiers.model';
import { ResourceService } from '../../../shared/services/resource/resource.service';

@Injectable()
export class DiscountGroupTiersService extends ResourceService<DiscountGroupTiers> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig, 'base', 'DiscountGroupTiers', 'Sales');
  }
}
