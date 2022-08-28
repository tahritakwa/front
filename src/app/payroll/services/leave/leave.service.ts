import {Inject} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../../../../COM/config/app.config';
import {LeaveRequestConstant} from '../../../constant/payroll/leave.constant';
import {Operation} from '../../../../COM/Models/operations';
import {Leave} from '../../../models/payroll/leave.model';
import {PredicateFormat} from '../../../shared/utils/predicate';
import {DataSourceRequestState} from '@progress/kendo-data-query';
import {ObjectToSave} from '../../../models/shared/objectToSend';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {LeaveBalanceRemainingFilter} from '../../../models/payroll/LeaveBalanceRemainingFilter';
import { ResourceServiceRhPaie } from '../../../shared/services/resource/resource.service.rhpaie';


export class LeaveService extends ResourceServiceRhPaie<Leave> {
  public listLeaveId = new BehaviorSubject<any>([]);

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(
      httpClient, appConfig,
      'leave', 'Leave', 'PayRoll');
  }

  public CalculateLeaveBalance(leave): Observable<any> {
    return this.callService(Operation.POST, LeaveRequestConstant.CALCULATE_LEAVE_BALANCE, leave);
  }

  public getLeaveCollaborater(predicate?: PredicateFormat): Observable<any> {
    const data: any = {};
    data['predicate'] = predicate;
    data['isAdmin'] = true;

    const objectToSave: ObjectToSave = new ObjectToSave();
    objectToSave.Model = data;
    return this.callService(Operation.POST, LeaveRequestConstant.GET_LEAVE_REQUESTS_WITH_HIERARCHY, objectToSave);
  }

  public getHoursPeriodOfDate(date: Date): Observable<any> {
    return super.callService(Operation.POST, LeaveRequestConstant.GET_HOURS_PERIOD_OF_DATE, date);
  }

  public getEndTimeOfPeriod(date: Date): Observable<any> {
    return super.callService(Operation.POST, LeaveRequestConstant.GET_END_TIME_OF_PERIOD, date);
  }

  public getStartTimeOfPeriod(date: Date): Observable<any> {
    return super.callService(Operation.POST, LeaveRequestConstant.GET_START_TIME_OF_PERIOD, date);
  }

  public verifyPeriodOfDate(date: Date): Observable<any> {
    return super.callService(Operation.POST, LeaveRequestConstant.VERIFY_PERIOD_OF_DATE, date);
  }

  public getTwoLeavesDecomposedFromNegativeBalanceLeave(leave): Observable<any> {
    return super.callService(Operation.POST, LeaveRequestConstant.GET_TWO_LEAVES_DECOMPOSED_FROM_NEGATIVE_BALANCE_LEAVE, leave);
  }

  public getLeaveRequestsWithHierarchy(state: DataSourceRequestState, predicate?: PredicateFormat,
                                       onlyFirstLevelOfHierarchy?: boolean, hasHighRight?: boolean, month?: Date): Observable<any> {
    super.prepareServerOptions(state, predicate);
    const data: any = {};
    data[SharedConstant.ONLY_FIRST_LEVEL_OF_HIERARCHY] = onlyFirstLevelOfHierarchy;
    data[SharedConstant.IS_ADMIN] = hasHighRight;
    data[SharedConstant.PREDICATE] = predicate;
    data[SharedConstant.MONTH_LOWER] = month;
    const objectToSave: ObjectToSave = new ObjectToSave();
    objectToSave.Model = data;
    return this.callService(Operation.POST, LeaveRequestConstant.GET_LEAVE_REQUESTS_WITH_HIERARCHY, objectToSave);
  }

  /**
   * get list of leaves by ids
   * @param objectToSend
   */
  public getLeaveFromListId(objectToSend: Array<number>): Observable<any> {
    return super.callService(Operation.POST, LeaveRequestConstant.GET_LEAVE_FROM_LIST_ID, objectToSend);
  }

  /**
   * validate many leaves
   * @param objectToSend
   */
  public validateMassiveLeaves(objectToSend: Leave []): Observable<any> {
    return super.callService(Operation.POST, LeaveRequestConstant.VALIDATE_MASSIVE_LEAVES, objectToSend);
  }

  /**
   * deleteMassiveLeave
   * @param objectToSend
   */
  public deleteMassiveLeave(objectToSend: number []): Observable<any> {
    return super.callService(Operation.POST, LeaveRequestConstant.DELETE_MASSIVE_LEAVE, objectToSend);
  }

  /**
   * refuseMassiveLeave
   * @param objectToSend
   */
  public refuseMassiveLeave(objectToSend: number []): Observable<any> {
    return super.callService(Operation.POST, LeaveRequestConstant.REFUSE_MASSIVE_LEAVE, objectToSend);
  }

  /**
   * Add many leaves
   * @param leaves
   */
  public addMassiveLeaves(leaves: Leave []): Observable<any> {
    return super.callService(Operation.POST, LeaveRequestConstant.ADD_MASSIVE_LEAVES, leaves);
  }

  /**
   * Get Leave Ids
   */
  public getListLeaveIds(): Observable<any> {
    return this.listLeaveId.asObservable();
  }

  public validateLeaveRequest(leave: Leave): Observable<any> {
    return super.callService(Operation.POST, LeaveRequestConstant.VALIDATE_LEAVE_REQUEST, leave);
  }

  /**
   * Send leave balance remaining email to all employees
   */
  public sendEmailToAllEmployees(filterSetting: LeaveBalanceRemainingFilter): Observable<any> {
    return this.callService(Operation.POST, LeaveRequestConstant.SEND_MAIL, filterSetting);
  }

}
