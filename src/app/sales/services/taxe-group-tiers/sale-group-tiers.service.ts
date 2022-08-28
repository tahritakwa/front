import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../../../COM/config/app.config';
import { ResourceService } from '../../../shared/services/resource/resource.service';
import { TaxeGroupTiers } from '../../../models/administration/taxe-group-tiers.model';

@Injectable()
export class TaxeGroupTiersService extends ResourceService<TaxeGroupTiers> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig, 'taxeGroupTiers', 'TaxeGroupTiers', 'Sales');
  }
}
