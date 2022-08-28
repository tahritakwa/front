import { Injectable, Inject } from '@angular/core';
import { DataSourceRequestState, DataResult } from '@progress/kendo-data-query';
import { PredicateFormat } from '../../../shared/utils/predicate';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ResourceService } from '../../../shared/services/resource/resource.service';
import { AppConfig } from '../../../../COM/config/app.config';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { Operation } from '../../../../COM/Models/operations';
import { EcommerceConstant } from '../../../constant/ecommerce/ecommerce.constant';

@Injectable()
export class EcommerceCustomerService extends ResourceService<null> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig, 'ecommerceCustomers', null, 'Ecommerce');
  }

  public getClientList(state: DataSourceRequestState, predicate: PredicateFormat): Observable<DataResult> {
    const pred: PredicateFormat = predicate ? JSON.parse(JSON.stringify(predicate)) : new PredicateFormat();
    this.prepareServerOptions(state, pred);
    return this.callService(Operation.POST, EcommerceConstant.URI_ECOMMERCE_CUSTOMER_LIST, pred).map(
      ({ listData, total }: any) =>
        <GridDataResult>{
          data: listData,
          total: total
        }
    );
  }

  public changePremuimClient(id: any, isPremuim: any): Observable<any> {
    return this.callService(Operation.GET, EcommerceConstant.URI_ECOMMERCE_CUSTOMER_UPDATE.concat(id) + "/".concat(isPremuim));
  }

}
