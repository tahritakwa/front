import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { ResourceService } from '../../../shared/services/resource/resource.service';
import { AppConfig } from '../../../../COM/config/app.config';
import { SubModel } from '../../../models/inventory/sub-model.model';
import { Subject, Observable } from 'rxjs';
import { DataSourceRequestState } from '@progress/kendo-data-query';
import { PredicateFormat } from '../../../shared/utils/predicate';
import { Operation } from '../../../../COM/Models/operations';

@Injectable()
export class SubModelService extends ResourceService<SubModel> {
  public isCardMode = new Subject<any>();

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig, 'subModel', 'SubModel', 'Inventory');
  }
  show(data: any) {
    this.isCardMode.next({value: true, data: data});

  }
  getResult(): Observable<any> {

    return this.isCardMode.asObservable();
  }
  public getSubModelList(state: DataSourceRequestState, predicate: PredicateFormat): Observable<any> {
    const pred = this.preparePrediacteFormat(state, predicate);
    return this.callService(Operation.POST, 'getSubModelList', pred);
  }
}
