import {Training} from '../../../models/rh/training.model';
import {TrainingConstant} from '../../../constant/rh/training.constant';
import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../../../../COM/config/app.config';
import {Operation} from '../../../../COM/Models/operations';
import {PredicateFormat} from '../../../shared/utils/predicate';
import {DataSourceRequestState} from '@progress/kendo-data-query';
import { ResourceServiceRhPaie } from '../../../shared/services/resource/resource.service.rhpaie';


@Injectable()
export class TrainingService extends ResourceServiceRhPaie<Training> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(
      httpClient, appConfig,
      'training', 'Training', 'RH');
  }

  public getCatalog(state: DataSourceRequestState, predicate: PredicateFormat): Observable<any> {
    super.prepareServerOptions(state, predicate);
    return this.callService(Operation.POST, TrainingConstant.GET_CATALOG, predicate);
  }


}
