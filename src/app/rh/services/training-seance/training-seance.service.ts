import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../../../../COM/config/app.config';
import {TrainingSeance} from '../../../models/rh/training-seance.model';
import {Observable} from 'rxjs/Observable';
import {Operation} from '../../../../COM/Models/operations';
import {TrainingConstant} from '../../../constant/rh/training.constant';
import { ResourceServiceRhPaie } from '../../../shared/services/resource/resource.service.rhpaie';

@Injectable()
export class TrainingSeanceService extends ResourceServiceRhPaie<TrainingSeance> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(
      httpClient, appConfig,
      'trainingSeance', 'TrainingSeance', 'RH');
  }

  public GetTrainingSeanceListInUpdateMode(idTrainingSession: number): Observable<any> {
    return this.callService(Operation.GET, TrainingConstant.GET_TRAINING_SEANCES_LIST_IN_UPDATE_MODE.concat(String(idTrainingSession)));
  }
}
