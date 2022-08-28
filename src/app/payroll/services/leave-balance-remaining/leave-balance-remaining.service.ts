import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../../../../COM/config/app.config';
import {LeaveBalanceRemaining} from '../../../models/payroll/LeaveBalanceRemaining.model';
import {Observable} from 'rxjs';
import {Operation} from '../../../../COM/Models/operations';
import {LeaveBalanceRemainingConstant} from '../../../constant/payroll/leave-balance-remaining.constant';
import {LeaveBalanceRemainingFilter} from '../../../models/payroll/LeaveBalanceRemainingFilter';
import { ResourceServiceRhPaie } from '../../../shared/services/resource/resource.service.rhpaie';


@Injectable()
export class LeaveBalanceRemainingService extends ResourceServiceRhPaie<LeaveBalanceRemaining> {

  constructor(@Inject(HttpClient)  httpClient, @Inject(AppConfig) appConfig) {
    super(
      httpClient, appConfig,
      'leaveBalanceRemaining', 'LeaveBalanceRemaining', 'PayRoll');
  }

  public getLeaveBalanceRemainingListByIdEmployee(IdEmployee: number): Observable<any> {
    return this.callService(Operation.POST,
      LeaveBalanceRemainingConstant.GET_LEAVE_BALANCE_REMAINING_LIST_BY_EMPLOYEE.concat(String(IdEmployee)));
  }

  public getleaveBalanceRemaining(filterSetting: LeaveBalanceRemainingFilter): Observable<any> {
    return this.callService(Operation.POST, LeaveBalanceRemainingConstant.GET_LEAVE_BALANCE_REMAINING, filterSetting);
  }

  public calculateLeaveBalanceRemaining(filterSetting?: LeaveBalanceRemainingFilter): Observable<any> {
    return this.callService(Operation.POST, LeaveBalanceRemainingConstant.CALCULATE_LEAVE_BALANCE_REMAINING, filterSetting);
  }
}
