import {Inject, Injectable} from '@angular/core';
import {TrainingRequest} from '../../../models/rh/training-request.model';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../../../../COM/config/app.config';
import {TrainingConstant} from '../../../constant/rh/training.constant';
import {Observable} from 'rxjs/Observable';
import {ObjectToSave} from '../../../models/shared/objectToSend';
import {Operation} from '../../../../COM/Models/operations';
import {DataSourceRequestState} from '@progress/kendo-data-query';
import {PredicateFormat} from '../../../shared/utils/predicate';
import { ResourceServiceRhPaie } from '../../../shared/services/resource/resource.service.rhpaie';

@Injectable()
export class TrainingRequestService extends ResourceServiceRhPaie<TrainingRequest> {
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(
      httpClient, appConfig,
      'trainingRequest', 'TrainingRequest', 'RH');
  }

  public getEmployeeListNotIncludedInTrainingSession(idEmployeesList: number[], idTraining: number): Observable<any> {
    const data: any = {};
    data[TrainingConstant.ID_EMPLOYEE_LIST] = idEmployeesList;
    data[TrainingConstant.PARAMS_ID_TRAINING] = idTraining;
    const objectToSave: ObjectToSave = new ObjectToSave();
    objectToSave.Model = data;
    return this.callService(Operation.POST, TrainingConstant.GET_EMPLOYEE_LIST_NOT_IN_TRAINING_SESSION, objectToSave);
  }

  public addSelectedEmployeesToTrainingRequest(
    trainingRequestList: Array<TrainingRequest>): Observable<any> {
    const data: any = {};
    data[TrainingConstant.TRAINING_REQUEST_LIST] = trainingRequestList;
    const objectToSave: ObjectToSave = new ObjectToSave();
    objectToSave.Model = data;
    return this.callService(Operation.POST, TrainingConstant.ADD_SELECTED_EMPLOYEES_TO_TRAINING_REQUEST, objectToSave);
  }

  public addOrUpdateTrainingRequest(trainingRequest: TrainingRequest, isNew: boolean): Observable<any> {
    const data: any = {};
    data[TrainingConstant.TRAINING_REQUEST] = trainingRequest;
    data[TrainingConstant.IS_NEW] = isNew;
    const objectToSave: ObjectToSave = new ObjectToSave();
    objectToSave.Model = data;
    return this.callService(Operation.POST, TrainingConstant.ADD_OR_UPDATE_TRAINING_REQUEST, objectToSave);
  }

  public getTrainingRequestListByHierarchy(state: DataSourceRequestState, predicate: PredicateFormat): Observable<any> {
    super.prepareServerOptions(state, predicate);
    const data: any = {};
    data[TrainingConstant.PREDICATE] = predicate;
    const objectToSave: ObjectToSave = new ObjectToSave();
    objectToSave.Model = data;
    return this.callService(Operation.POST, TrainingConstant.GET_TRAINING_REQUEST_LIST_BY_HIERARCHY, objectToSave);
  }

  public getTrainingRequestListForPanifing(idTraining: number, predicate: PredicateFormat): Observable<any> {
    const data: any = {};
    data[TrainingConstant.ID_TRAINING] = idTraining;
    data[TrainingConstant.PREDICATE] = predicate;
    const objectToSave: ObjectToSave = new ObjectToSave();
    objectToSave.Model = data;
    return this.callService(Operation.POST, TrainingConstant.GET_TRAINING_REQUEST_LIST_FOR_PANIFING, objectToSave);
  }

  public getTrainingRequestListInUpdateMode(idTraining: number, idTrainingSession: number, predicate: PredicateFormat): Observable<any> {
    const data: any = {};
    data[TrainingConstant.ID_TRAINING] = idTraining;
    data[TrainingConstant.ID_TRAINING_SESSION] = idTrainingSession;
    data[TrainingConstant.PREDICATE] = predicate;
    const objectToSave: ObjectToSave = new ObjectToSave();
    objectToSave.Model = data;
    return this.callService(Operation.POST, TrainingConstant.GET_TRAINING_REQUEST_LIST_IN_UPDATE_MODE, objectToSave);
  }
}
