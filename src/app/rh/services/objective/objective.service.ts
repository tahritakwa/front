import {Inject, Injectable} from '@angular/core';
import {AppConfig} from '../../../../COM/config/app.config';
import {HttpClient} from '@angular/common/http';
import {Objective} from '../../../models/rh/objective.model';
import {Operation} from '../../../../COM/Models/operations';
import {Observable} from 'rxjs/Observable';
import {ReviewConstant} from '../../../constant/rh/review.constant';
import { ResourceServiceRhPaie } from '../../../shared/services/resource/resource.service.rhpaie';

@Injectable()
export class ObjectiveService extends ResourceServiceRhPaie<Objective> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(
      httpClient, appConfig,
      'objective', 'Objective', 'RH');
  }

  public deleteObjectiveModel(hasRight: boolean, objective: Objective): Observable<any> {
    return super.callService(Operation.DELETE,
      ReviewConstant.DELETE_OBJECTIVE_MODEL.concat(String(hasRight)), objective);
  }
}
