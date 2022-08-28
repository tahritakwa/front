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
export class EcommerceSalesDeliveryService extends ResourceService<null> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig, 'ecommerceSalesDelivery', null, 'Ecommerce');
  }

  public getFailedSalesDeliveryList(state: DataSourceRequestState, predicate: PredicateFormat): Observable<DataResult> {
    const pred: PredicateFormat = new PredicateFormat();
    this.prepareServerOptions(state, pred);
    return this.callService(Operation.POST, 'getFailedSalesDeliveryList', pred).map(
      ({ listData, total }: any) =>
        <GridDataResult>{
          data: listData,
          total: total
        }
    );
  }

}
