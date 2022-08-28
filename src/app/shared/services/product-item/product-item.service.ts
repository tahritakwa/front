import { Injectable, Inject } from '@angular/core';
import { ResourceService } from '../resource/resource.service';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../../../COM/config/app.config';
import { ProductItem } from '../../../models/inventory/product-item.model';

@Injectable()
export class ProductItemService extends ResourceService<ProductItem> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig, 'productItem', 'ProductItem', 'Inventory');
  }

}
