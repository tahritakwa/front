import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../../../../COM/config/app.config';
import {ExitActionEmployee} from '../../../models/payroll/exit-action-employee.model';
import {Observable} from 'rxjs/Observable';
import {Operation} from '../../../../COM/Models/operations';
import {ExitEmployeeConstant} from '../../../constant/payroll/exit-employee.constant';
import { ResourceServiceRhPaie } from '../../../shared/services/resource/resource.service.rhpaie';

@Injectable()
export class ExitActionEmployeeService extends ResourceServiceRhPaie<ExitActionEmployee> {
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(
      httpClient, appConfig,
      'exitActionEmployee', 'ExitActionEmployee', 'PayRoll');
  }

  public getExitActionEmployeeInformation(exitActionEmployee: ExitActionEmployee): Observable<any> {
    return this.callService(Operation.POST, ExitEmployeeConstant.GET_EXIT_ACTIONS_EMPLOYEE, exitActionEmployee);
  }
}
