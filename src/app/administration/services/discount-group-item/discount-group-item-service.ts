import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResourceService } from '../../../shared/services/resource/resource.service';
import { DiscountGroupItem } from '../../../models/inventory/discount-group-item.model';
import { AppConfig } from '../../../../COM/config/app.config';

@Injectable()
export class DiscountGroupItemService extends ResourceService<DiscountGroupItem>{

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig, 'base', 'DiscountGroupItem', 'Inventory');
  }

}
