import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AppConfig } from '../../../../COM/config/app.config';
import { ObjectToSave } from '../../../models/shared/objectToSend';
import { FilterSearchOperation } from '../../../models/treasury/filter-search-operation.model';
import { OperationCash } from '../../../models/treasury/operation.model';
import { ResourceService } from '../../../shared/services/resource/resource.service';
import { Operation } from '../../../../COM/Models/operations';
import { Observable } from 'rxjs';

@Injectable()
export class OperationCashService extends ResourceService<OperationCash>{


  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig, 'operationCash', 'Operation', 'treasury');
  }

  getOperationCash(filterSearchOperation: FilterSearchOperation): Observable<any> {
    const objectToSave: ObjectToSave = new ObjectToSave();
    objectToSave.Model = filterSearchOperation;
    return this.callService(Operation.POST, 'getOperationsCash', objectToSave);
  }
}
