import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../../../../COM/config/app.config';
import {Observable} from 'rxjs/Observable';
import {Operation} from '../../../../COM/Models/operations';
import {Session} from '../../../models/payroll/session.model';
import {SessionConstant} from '../../../constant/payroll/session.constant';
import {ObjectToSave} from '../../../models/shared/objectToSend';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {SessionResumeFilter} from '../../../models/payroll/session-resume-filter.model';
import {PredicateFormat} from '../../../shared/utils/predicate';
import { ResourceServiceRhPaie } from '../../../shared/services/resource/resource.service.rhpaie';

@Injectable()
export class SessionService extends ResourceServiceRhPaie<Session> {

  public defaultStartEndDateSearchSession = new Observable<Date[]>();


  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(
      httpClient, appConfig,
      'session', 'Session', 'PayRoll');
  }

  public getByIdWithRelation(id: number): Observable<any> {
    return super.callService(Operation.GET, SessionConstant.SESSION_DETAILS.concat(id.toString()));
  }

  public getSessionBonusOrderedByBonusId(id: number): Observable<any> {
    return super.callService(Operation.GET, SessionConstant.SESSION_BONUS.concat(id.toString()));
  }

  public getSessionResume(id: number): Observable<any> {
    return this.callService(Operation.GET, SessionConstant.GET_SESSION_RESUME.concat(id.toString()));
  }

  /**
   * Get session of the trimester
   * @param trimester
   */
  public getSessionOfTrimester(predicate: PredicateFormat, date: Date): Observable<any> {
    const data: any = {};
    data[SharedConstant.DATE] = date;
    data['predicate'] = predicate;
    const objectToSave: ObjectToSave = new ObjectToSave();
    objectToSave.Model = data;
    return this.callService(Operation.POST, SessionConstant.GET_SESSION_OF_TRIMESTER, objectToSave);
  }

  public getAvailableSalaryRules(idSession: number): Observable<any> {
    return this.callService(Operation.GET, SessionConstant.GET_AVAILABLE_SALARYRULES_FOR_RESUME.concat('/').concat(idSession.toString()));
  }

  public getSessionResumeLines(sessionResumeFilter: SessionResumeFilter): Observable<any> {
    return this.callService(Operation.POST, SessionConstant.GET_SESSION_RESUME, sessionResumeFilter);
  }

  public sessionsWithEmployeesWithTransferPaymentType(month: Date): Observable<any> {
    return this.callService(Operation.POST, SessionConstant.SESSION_WITH_EMPLOYEES_WITH_TRANSFER_PAYMENT_TYPE, month);
  }

  public getListOfAvailableEmployeesByContracts(predicate: PredicateFormat, idSession: number): Observable<any> {
    const data: any = {};
    data['idSession'] = idSession;
    data['predicate'] = predicate;
    const objectToSave: ObjectToSave = new ObjectToSave();
    objectToSave.Model = data;
    return this.callService(Operation.POST, SessionConstant.GET_LIST_OF_AVAILABLE_EMPLOYEES_CONTRACTS, objectToSave);
  }

  public addContractToSession(id: number, idSession: number, idSelected: number, idTimeSheet: number): Observable<any> {
    const data: any = {};
    data['id'] = id;
    data['idSession'] = idSession;
    data['idSelected'] = idSelected;
    data['idTimeSheet'] = idTimeSheet;
    const objectToSave: ObjectToSave = new ObjectToSave();
    objectToSave.Model = data;
    return this.callService(Operation.POST, SessionConstant.ADD_CONTRACT_TO_SESSION, objectToSave);
  }

  public addAllContractsToSession(predicate: PredicateFormat, allSelected: boolean, idSession: number): Observable<any> {
    const data: any = {};
    data['allSelected'] = allSelected;
    data['idSession'] = idSession;
    data['predicate'] = predicate;
    const objectToSave: ObjectToSave = new ObjectToSave();
    objectToSave.Model = data;
    return this.callService(Operation.POST, SessionConstant.ADD_ALL_CONTRACTS_TO_SESSION, objectToSave);
  }

  public getListOfAttendances(predicate: PredicateFormat, idSession: number): Observable<any> {
    const data: any = {};
    data['idSession'] = idSession;
    data['predicate'] = predicate;
    const objectToSave: ObjectToSave = new ObjectToSave();
    objectToSave.Model = data;
    return this.callService(Operation.POST, SessionConstant.GET_LIST_OF_ATTENDANCES, objectToSave);
  }

  public getListOfBonusesForSession(predicate: PredicateFormat, idSession: number): Observable<any> {
    const data: any = {};
    data['idSession'] = idSession;
    data['predicate'] = predicate;
    const objectToSave: ObjectToSave = new ObjectToSave();
    objectToSave.Model = data;
    return this.callService(Operation.POST, SessionConstant.GET_LIST_OF_BONUSES_FOR_SESSION, objectToSave);
  }

  public addBonusToAllContracts(predicate: PredicateFormat, allSelected: boolean, idSession: number, idBonus: number, value: number): Observable<any> {
    const data: any = {};
    data['allSelected'] = allSelected;
    data['idSession'] = idSession;
    data['idBonus'] = idBonus;
    data['value'] = value;
    data['predicate'] = predicate;
    const objectToSave: ObjectToSave = new ObjectToSave();
    objectToSave.Model = data;
    return this.callService(Operation.POST, SessionConstant.ADD_BONUS_TO_ALL_CONTRACTS, objectToSave);
  }


  public addBonusToContract(id: number, idSession: number, idSelected: number, idBonus: number, value: number): Observable<any> {
    const data: any = {};
    data['id'] = id;
    data['idSession'] = idSession;
    data['idSelected'] = idSelected;
    data['idBonus'] = idBonus;
    data['value'] = value;
    const objectToSave: ObjectToSave = new ObjectToSave();
    objectToSave.Model = data;
    return this.callService(Operation.POST, SessionConstant.ADD_BONUS_TO_CONTRACT, objectToSave);
  }

  public updateBonusType(idSession: number, idBonus: number, idOldBonus: number): Observable<any> {
    const data: any = {};
    data['idOldBonus'] = idOldBonus;
    data['idSession'] = idSession;
    data['idBonus'] = idBonus;
    const objectToSave: ObjectToSave = new ObjectToSave();
    objectToSave.Model = data;
    return this.callService(Operation.POST, SessionConstant.UPDATE_BONUS_TYPE, objectToSave);
  }

  public checkBonusExistanceInSession(idSession: number, idBonus: number): Observable<any> {
    const data: any = {};
    data['idSession'] = idSession;
    data['idBonus'] = idBonus;
    const objectToSave: ObjectToSave = new ObjectToSave();
    objectToSave.Model = data;
    return this.callService(Operation.POST, SessionConstant.CHECK_BONUS_EXISTANCE_IN_SESSION, objectToSave);
  }

  public deleteBonusFromSession(idSession: number, idBonus: number): Observable<any> {
    const data: any = {};
    data['idSession'] = idSession;
    data['idBonus'] = idBonus;
    const objectToSave: ObjectToSave = new ObjectToSave();
    objectToSave.Model = data;
    return this.callService(Operation.POST, SessionConstant.DELETE_BONUS_FROM_SESSION, objectToSave);
  }

  public getListOfLoanInstallmentForSession(predicate: PredicateFormat, idSession: number): Observable<any> {
    const data: any = {};
    data['idSession'] = idSession;
    data['predicate'] = predicate;
    const objectToSave: ObjectToSave = new ObjectToSave();
    objectToSave.Model = data;
    return this.callService(Operation.POST, SessionConstant.GET_LIST_OF_LOAN_INSTALLMENT_FOR_SESSION, objectToSave);
  }

  public addLoanInstallmentToSession(id: number, idSession: number, idSelected: number, idLoanInstallment: number, value: number): Observable<any> {
    const data: any = {};
    data['id'] = id;
    data['idSession'] = idSession;
    data['idSelected'] = idSelected;
    data['idLoanInstallment'] = idLoanInstallment;
    data['value'] = value;
    const objectToSave: ObjectToSave = new ObjectToSave();
    objectToSave.Model = data;
    return this.callService(Operation.POST, SessionConstant.ADD_LOAN_INSTALLMENT_TO_SESSION, objectToSave);
  }

  public addAllLoanInstallmentToSession(predicate: PredicateFormat, allSelected: boolean, idSession: number): Observable<any> {
    const data: any = {};
    data['allSelected'] = allSelected;
    data['idSession'] = idSession;
    data['predicate'] = predicate;
    const objectToSave: ObjectToSave = new ObjectToSave();
    objectToSave.Model = data;
    return this.callService(Operation.POST, SessionConstant.ADD_ALL_LOAN_INSTALLMENT_TO_SESSION, objectToSave);
  }

  public updateSessionStates(session: Session): Observable<any> {
    const data: any = {};
    data['session'] = session;
    const objectToSave: ObjectToSave = new ObjectToSave();
    objectToSave.Model = data;
    return this.callService(Operation.POST, SessionConstant.UPDATE_SESSION_STATES, objectToSave);
  }

  public updateAllBonusValues(idSession: number, idBonus: number, value: number): Observable<any> {
    const data: any = {};
    data['value'] = value;
    data['idSession'] = idSession;
    data['idBonus'] = idBonus;
    const objectToSave: ObjectToSave = new ObjectToSave();
    objectToSave.Model = data;
    return this.callService(Operation.POST, SessionConstant.UPDATE_ALL_BONUS, objectToSave);
  }

  public startSession(session: Session): Observable<any> {
    const data: any = {};
    data['session'] = session;
    const objectToSave: ObjectToSave = new ObjectToSave();
    objectToSave.Model = data;
    return this.callService(Operation.POST, SessionConstant.START_SESSION, objectToSave);
  }

  public closeSession(session: Session): Observable<any> {
    const data: any = {};
    data['session'] = session;
    const objectToSave: ObjectToSave = new ObjectToSave();
    objectToSave.Model = data;
    return this.callService(Operation.POST, SessionConstant.CLOSE_SESSION_URL, objectToSave);
  }
}

