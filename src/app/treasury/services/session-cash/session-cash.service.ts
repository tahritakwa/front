import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SessionCash } from '../../../models/payment/session-cash.model';
import { ResourceService } from '../../../shared/services/resource/resource.service';
import { AppConfig } from '../../../../COM/config/app.config';
import { Observable } from 'rxjs';
import { Operation } from '../../../../COM/Models/operations';
import { SessionCashConstant } from '../../../constant/treasury/session-cash.constant';
import { State } from '@progress/kendo-data-query';
import { PredicateFormat } from '../../../shared/utils/predicate';
import { ObjectToSend } from '../../../models/sales/object-to-save.model';

@Injectable()
export class SessionCashService extends ResourceService<SessionCash> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig, 'sessionCash', 'SessionCash', 'Payment');
  }


  getUserOpenedSession(email: string): Observable<any> {
    return this.callService(Operation.POST, SessionCashConstant.GET_USER_OPENED_SESSION, email);
  }
  getDataForClosingSession(email: string): Observable<any> {
    return this.callService(Operation.POST, SessionCashConstant.GET_DATA_FOR_CLOSING_SESSION, email);
  }

  public getCashRegisterSessionDetails(state: State, idCashRegister: number): Observable<any> {
    let predicate: PredicateFormat = new PredicateFormat();
    this.prepareServerOptions(state, predicate);
    const dataToSend = {};
    dataToSend['predicate'] = predicate;
    dataToSend['idCashRegister'] = idCashRegister;
    const objectToSend: ObjectToSend  = new ObjectToSend(dataToSend); 
    return this.callService(Operation.POST, SessionCashConstant.GET_CASH_REGISTER_SESSION_DETAILS, objectToSend);
  }

  public getSessionDetailsById(idTicket: number, idDocument: number): Observable<any> {
    const dataToSend = {};
    dataToSend['idTicket'] = idTicket;
    dataToSend['idDocument'] = idDocument;
    const objectToSend: ObjectToSend  = new ObjectToSend(dataToSend); 
    return this.callService(Operation.POST, SessionCashConstant.GET_SESSION_DETAILS_BY_ID,objectToSend);
  }
}
