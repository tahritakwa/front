import {Inject, Injectable} from '@angular/core';
import {Candidacy} from '../../../models/rh/candidacy.model';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../../../../COM/config/app.config';
import {Observable} from 'rxjs/Observable';
import {Operation} from '../../../../COM/Models/operations';
import {CandidacyConstant} from '../../../constant/rh/candidacy.constant';
import {PredicateFormat} from '../../../shared/utils/predicate';
import {DataSourceRequestState} from '@progress/kendo-data-query';
import {ObjectToSave} from '../../../models/shared/objectToSend';
import { ResourceServiceRhPaie } from '../../../shared/services/resource/resource.service.rhpaie';

@Injectable()
export class CandidacyService extends ResourceServiceRhPaie<Candidacy> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(
      httpClient, appConfig,
      'candidacy', 'Candidacy', 'RH');
  }

  public presSelectionnedOneCandidacy(candidacy: Candidacy): Observable<any> {
    return this.callService(Operation.PUT, CandidacyConstant.PRE_SELECTION_ONE_CANDIDACY, candidacy);
  }

  public unPresSelectionnedOneCandidacy(candidacy: Candidacy): Observable<any> {
    return this.callService(Operation.PUT, CandidacyConstant.UN_PRE_SELECTION_ONE_CANDIDACY, candidacy);
  }

  public fromPreselectionToNextStep(predicate?: PredicateFormat): Observable<any[]> {
    return this.callService(Operation.POST, CandidacyConstant.FROM_PRE_SELECTION_TO_NEXT_STEP, predicate);
  }

  public fromCandidacyToNextStep(predicate?: PredicateFormat): Observable<any[]> {
    return this.callService(Operation.POST, CandidacyConstant.FROM_CANDIDACY_TO_NEXT_STEP, predicate);
  }

  public selectionnedOneCandidacy(candidacy: Candidacy): Observable<any> {
    return this.callService(Operation.PUT, CandidacyConstant.SELECTION_ONE_CANDIDACY, candidacy);
  }

  public unSelectionnedOneCandidacy(candidacy: Candidacy): Observable<any> {
    return this.callService(Operation.PUT, CandidacyConstant.UN_SELECTION_ONE_CANDIDACY, candidacy);
  }

  public fromSelectionToNextStep(predicate?: PredicateFormat): Observable<any[]> {
    return this.callService(Operation.POST, CandidacyConstant.FROM_SELECTION_TO_NEXT_STEP, predicate);
  }

  public fromOfferToNextStep(predicate?: PredicateFormat): Observable<any[]> {
    return this.callService(Operation.POST, CandidacyConstant.FROM_OFFER_TO_NEXT_STEP, predicate);
  }

  public generateEmployeeFromCandidacy(candidacy: Candidacy): Observable<any> {
    return this.callService(Operation.PUT, CandidacyConstant.GENERATE_EMPLOYEE_FROM_CANDIDACY, candidacy);
  }

  public getCandidacyListInOfferStep(state: DataSourceRequestState, predicate: PredicateFormat): Observable<any> {
    super.prepareServerOptions(state, predicate);
    const data: any = {};
    data[CandidacyConstant.PREDICATE] = predicate;
    const objectToSave: ObjectToSave = new ObjectToSave();
    objectToSave.Model = data;
    return this.callService(Operation.POST, CandidacyConstant.GET_CANDIDACY_LIST_IN_OFFER_STEP, objectToSave);
  }

  public getCandidacyListInDoneStep(state: DataSourceRequestState, predicate: PredicateFormat): Observable<any> {
    super.prepareServerOptions(state, predicate);
    const data: any = {};
    data[CandidacyConstant.PREDICATE] = predicate;
    const objectToSave: ObjectToSave = new ObjectToSave();
    objectToSave.Model = data;
    return this.callService(Operation.POST, CandidacyConstant.GET_CANDIDACY_LIST_IN_DONE_STEP, objectToSave);
  }

  public getCandidacyListInSelectionStep(state: DataSourceRequestState, predicate: PredicateFormat): Observable<any> {
    super.prepareServerOptions(state, predicate);
    const data: any = {};
    data[CandidacyConstant.PREDICATE] = predicate;
    const objectToSave: ObjectToSave = new ObjectToSave();
    objectToSave.Model = data;
    return this.callService(Operation.POST, CandidacyConstant.GET_CANDIDACY_LIST_IN_SELECTION_STEP, objectToSave);
  }

  public generateRejectedmail(candidacy: Candidacy, lang?: string): Observable<any> {
    return super.callService(Operation.POST, CandidacyConstant.GENERATE_REJECTED_EMAIL_BY_CANDIDACY.concat('/').concat(lang), candidacy);
  }
}




