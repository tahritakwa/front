import {Inject, Injectable} from '@angular/core';
import {TrainingSession} from '../../../models/rh/training-session.model';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../../../../COM/config/app.config';
import {TrainingRequest} from '../../../models/rh/training-request.model';
import {Observable} from 'rxjs/Observable';
import {TrainingConstant} from '../../../constant/rh/training.constant';
import {ObjectToSave} from '../../../models/shared/objectToSend';
import {Operation} from '../../../../COM/Models/operations';
import {DataSourceRequestState} from '@progress/kendo-data-query';
import {PredicateFormat} from '../../../shared/utils/predicate';
import {TrainingSeanceDay} from '../../../models/rh/training-seance-day.model';
import {TrainingSeance} from '../../../models/rh/training-seance.model';
import {ExternalTraining} from '../../../models/rh/external-training.model';
import { ResourceServiceRhPaie } from '../../../shared/services/resource/resource.service.rhpaie';

@Injectable()
export class TrainingSessionService extends ResourceServiceRhPaie<TrainingSession> {
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(
      httpClient, appConfig,
      'trainingSession', 'TrainingSession', 'RH');
  }

  public addExternalTrainingWithTrainingSession(trainingSession: TrainingSession, idRoom: number, idSelectedEmployee: number[]):
    Observable<any> {
    const data: any = {};
    data[TrainingConstant.TRAINING_SESSION] = trainingSession;
    data[TrainingConstant.ID_ROOM] = idRoom;
    data[TrainingConstant.ID_SELECTED_EMPLOYEE] = idSelectedEmployee;
    const objectToSave: ObjectToSave = new ObjectToSave();
    objectToSave.Model = data;
    return this.callService(Operation.POST, TrainingConstant.ADD_EXTERNAL_TRAINING_WITH_TRAINING_SESSION, objectToSave);
  }

  public updateExternalTrainingWithTrainingSession(trainingSession: TrainingSession, idRoom: number,
                                                   externalTraining: ExternalTraining, idSelectedEmployee: number[]): Observable<any> {
    const data: any = {};
    data[TrainingConstant.TRAINING_SESSION] = trainingSession;
    data[TrainingConstant.ID_ROOM] = idRoom;
    data[TrainingConstant.EXTERNAL_TRAINING] = externalTraining;
    data[TrainingConstant.ID_SELECTED_EMPLOYEE] = idSelectedEmployee;
    const objectToSave: ObjectToSave = new ObjectToSave();
    objectToSave.Model = data;
    return this.callService(Operation.POST, TrainingConstant.UPDATE_EXTERNAL_TRAINING_WITH_TRAINING_SESSION, objectToSave);
  }

  public updateTrainingSeancesWithTrainingSession(trainingSession: TrainingSession, traningSeancesPerDate: Array<TrainingSeance>,
                                                  trainingSeancesFrequently: Array<TrainingSeanceDay>): Observable<any> {
    const data: any = {};
    data[TrainingConstant.TRAINING_SESSION] = trainingSession;
    data[TrainingConstant.TRAINING_SEANCES_PER_DATE] = traningSeancesPerDate;
    data[TrainingConstant.TRAINING_SEANCES_FREQUENTLY] = trainingSeancesFrequently;
    const objectToSave: ObjectToSave = new ObjectToSave();
    objectToSave.Model = data;
    return this.callService(Operation.POST, TrainingConstant.UPDATE_TRAINING_SEANCES_WITH_TRAINING_SESSION, objectToSave);
  }

  public addTrainingSeancesWithTrainingSession(idTraining: number, traningSeancesPerDate: Array<TrainingSeance>,
                                               trainingSeancesFrequently: Array<TrainingSeanceDay>): Observable<any> {
    const data: any = {};
    data[TrainingConstant.ID_TRAINING] = idTraining;
    data[TrainingConstant.TRAINING_SEANCES_PER_DATE] = traningSeancesPerDate;
    data[TrainingConstant.TRAINING_SEANCES_FREQUENTLY] = trainingSeancesFrequently;
    const objectToSave: ObjectToSave = new ObjectToSave();
    objectToSave.Model = data;
    return this.callService(Operation.POST, TrainingConstant.ADD_TRAINING_SEANCES_WITH_TRAINING_SESSION, objectToSave);
  }

  public addTrainingRequestsWithTrainingSession(idTraining: number, trainingRequestList: Array<TrainingRequest>): Observable<any> {
    const data: any = {};
    data[TrainingConstant.ID_TRAINING] = idTraining;
    data[TrainingConstant.TRAINING_REQUEST_LIST] = trainingRequestList;
    const objectToSave: ObjectToSave = new ObjectToSave();
    objectToSave.Model = data;
    return this.callService(Operation.POST, TrainingConstant.ADD_TRAINING_REQUESTS_WITH_TRAINING_SESSION, objectToSave);
  }

  public updateTrainingRequestsWithTrainingSession(idTrainingSession: number, newTrainingRequestSelectedList: Array<TrainingRequest>,
                                                   trainingRequestSelectedToUnSelectedList: Array<TrainingRequest>): Observable<any> {
    const data: any = {};
    data[TrainingConstant.ID_TRAINING_SESSION] = idTrainingSession;
    data[TrainingConstant.NEWT_RAINING_REQUEST_SELECTED_LIST] = newTrainingRequestSelectedList;
    data[TrainingConstant.TRAINING_REQUEST_SELECTED_TO_UNSELECTED_LIST] = trainingRequestSelectedToUnSelectedList;
    const objectToSave: ObjectToSave = new ObjectToSave();
    objectToSave.Model = data;
    return this.callService(Operation.POST, TrainingConstant.UPDATE_TRAINING_REQUESTS_WITH_TRAINING_SESSION, objectToSave);
  }

  public getTrainingSessionList(state: DataSourceRequestState, predicate: PredicateFormat): Observable<any> {
    super.prepareServerOptions(state, predicate);
    return this.callService(Operation.POST, TrainingConstant.GET_TRAINING_SESSION_LIST, predicate);
  }
}

