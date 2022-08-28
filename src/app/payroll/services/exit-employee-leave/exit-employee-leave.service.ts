import {Inject, Injectable} from '@angular/core';
import {ExitEmployeeLeaveLine} from '../../../models/payroll/exitEmployeeLeaveLine.model';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../../../../COM/config/app.config';
import {Operation} from '../../../../COM/Models/operations';
import {PredicateFormat} from '../../../shared/utils/predicate';
import {Observable} from 'rxjs/Observable';
import {ExitEmployeeConstant} from '../../../constant/payroll/exit-employee.constant';
import { ResourceServiceRhPaie } from '../../../shared/services/resource/resource.service.rhpaie';

@Injectable()
export class ExitEmployeeLeaveService extends ResourceServiceRhPaie<ExitEmployeeLeaveLine> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(
      httpClient, appConfig,
      'exitEmployeeLeaveLine', 'ExitEmployeeLeaveLine', 'PayRoll');
  }

  public GenerateLeaveBalanceExitEmployee(idEmployeeExit: number): Observable<any> {
    return super.callService(Operation.GET,
      ExitEmployeeConstant.GENERATE_LEAVE_BALANCE_FOR_EXIT_EMPLOYEE.concat(idEmployeeExit.toString()));
  }

  public GetListOfLeave(predicate: PredicateFormat): Observable<any> {
    return super.callService(Operation.POST, ExitEmployeeConstant.GET_LIST_OF_LEAVE, predicate);
  }

  public downloadAllLeaveResume(idExitEmployee: number): Observable<any> {
    return super.callService(Operation.GET, `${'downloadAllLeaveResume/'}${idExitEmployee}`);
  }
}
