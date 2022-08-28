import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResourceService } from '../../../shared/services/resource/resource.service';
import { AppConfig } from '../../../../COM/config/app.config';
import { TaxeGroupConfig } from '../../../models/administration/taxe-group-config';
import { TaxeGroup } from '../../../models/administration/taxe-group.model';

@Injectable()
export class TaxeGroupService extends ResourceService<TaxeGroup>{

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig, 'taxeGroupTiers', 'TaxeGroupTiers', 'Sales');
  }

}
