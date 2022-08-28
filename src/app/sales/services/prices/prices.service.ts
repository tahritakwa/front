import { Injectable, Inject } from '@angular/core';
import { AppConfig } from '../../../../COM/config/app.config';
import { HttpClient } from '@angular/common/http';
import { ResourceService } from '../../../shared/services/resource/resource.service';
import { Prices } from '../../../models/sales/prices.model';
import { Observable } from 'rxjs/Observable';
import { Operation } from '../../../../COM/Models/operations';
import { PricesConstant } from '../../../constant/sales/prices.constant';
import { DataSourceRequestState } from '@progress/kendo-data-query';
import { PredicateFormat } from '../../../shared/utils/predicate';
import { TranslateService } from '@ngx-translate/core';
@Injectable()
export class PricesService extends ResourceService<Prices> {
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig, public translate: TranslateService) {
    super(
      httpClient, appConfig,
      'prices', 'Prices', 'Sales');
  }
  public savePrice(data): Observable<any> {
    return this.callService(Operation.POST, PricesConstant.SAVE, data, null, null, false);
  }
  public updatePrice(data): Observable<any> {
    return this.callService(Operation.PUT, PricesConstant.UPDATE, data, null, null, false);
  }
  public getPriceCustomers(skip: number, take: number, idPrice: any): Observable<any> {
    return this.callService(Operation.POST, PricesConstant.GET_PRICE_CUSTOMERS, { Skip: skip, Take: take, IdPrice: idPrice });
  }
  public getPriceItems(skip: number, take: number, idPrice: any): Observable<any> {
    return this.callService(Operation.POST, PricesConstant.GET_PRICE_ITEMS, { Skip: skip, Take: take, IdPrice: idPrice });
  }
  public affectCustomerToPrice(idPrice: number, idCustomer: number): Observable<any> {
    return this.callService(Operation.POST, PricesConstant.AFFECT_CUSTOMER_TO_PRICE,
      { IdPrices: idPrice, IdTiers: idCustomer });
  }
  public affectItemToPrice(idPrice: number, idItem: number): Observable<any> {
    return this.callService(Operation.POST, PricesConstant.AFFECT_ITEM_TO_PRICE,
      { IdPrices: idPrice, IdItem: idItem });
  }
  public unaffectCustomerFromPrice(idPrice: number, idCustomer: number): Observable<any> {
    return this.callService(Operation.POST, PricesConstant.UNAFFECT_CUSTOMER_FROM_PRICE,
      { IdPrices: idPrice, IdTiers: idCustomer });
  }
  public unaffectItemFromPrice(idPrice: number, idItem: number): Observable<any> {
    return this.callService(Operation.POST, PricesConstant.UNAFFECT_ITEM_FROM_PRICE,
      { IdPrices: idPrice, IdItem: idItem });
  }
  public affectAllCustomersToPrice(predicate: PredicateFormat, idPrice: number): Observable<any> {
    return super.callService(Operation.POST,
      PricesConstant.AFFECT_ALL_CUSTOMERS_TO_PRICE.concat('/', idPrice.toString()),
      predicate);
  }
  public affectAllItemsToPrice(predicate: PredicateFormat, idPrice: number): Observable<any> {
    return super.callService(Operation.POST, PricesConstant.AFFECT_ALL_ITEMS_TO_PRICE.concat('/', idPrice.toString()),
      predicate);
  }
  public unaffectAllCustomersFromPrice(predicate: PredicateFormat, idPrice: number): Observable<any> {
    return super.callService(Operation.POST,
      PricesConstant.UNAFFECT_ALL_CUSTOMERS_FROM_PRICE.concat('/', idPrice.toString()),
      predicate);
  }
  public unaffectAllItemsFromPrice(predicate: PredicateFormat, idPrice: number): Observable<any> {
    return this.callService(Operation.POST, PricesConstant.UNAFFECT_ALL_ITEMS_FROM_PRICE.concat('/', idPrice.toString()),
      predicate);
  }
  public getPricesList(state: DataSourceRequestState, predicate: PredicateFormat[]): Observable<any> {
    predicate = predicate.map(pred => {
      return this.preparePrediacteFormat(state, pred);
    });
    return this.callService(Operation.POST, PricesConstant.GET_PRICES_LIST, predicate);
  }

  public translaiteData(data:any){
    if( data.TypesLabels && data.TypesLabels.length >0){
      data.ListTypesLabels = this.translate.instant(data.TypesLabels[0]);
      for (let i = 1; i < data.TypesLabels.length; i++) {
        data.ListTypesLabels = data.ListTypesLabels + ', ' + this.translate.instant(data.TypesLabels[i])
      }
    }
    if(data.IsActif){
      data.State = this.translate.instant('ACTIVE');
    }else{
      data.State = this.translate.instant('INACTIVE');
    }
  }

}
