import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { ResourceService } from '../../../shared/services/resource/resource.service';
import { AppConfig } from '../../../../COM/config/app.config';
import { ItemSalesPrice } from '../../../models/inventory/item-sales-price.model';
import { Observable } from 'rxjs';
import { Operation } from '../../../../COM/Models/operations';

@Injectable()
export class ItemSalesPriceService extends ResourceService<ItemSalesPrice> {
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig, 'itemSalesPrice', 'ItemSalesPrice', 'Sales');
  }
  public saveItemSalesPrice(data:ItemSalesPrice): Observable<any> {
      return this.callService(Operation.POST, 'insert_itemSalesPrice', data);
    
  }
}
