import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../../../../COM/config/app.config';
import {Observable} from 'rxjs/Observable';
import {Operation} from '../../../../COM/Models/operations';
import {ExitEmployeeConstant} from '../../../constant/payroll/exit-employee.constant';
import {ObjectToSave} from '../../../models/shared/objectToSend';
import {ExitEmployee} from '../../../models/payroll/exit-employee.model';
import { ResourceServiceRhPaie } from '../../../shared/services/resource/resource.service.rhpaie';

@Injectable()

export class ExitEmployeeService extends ResourceServiceRhPaie<ExitEmployee> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(
      httpClient, appConfig,
      'exitEmployee', 'ExitEmployee', 'PayRoll');
  }

  public ValidateExitEmployee(data): Observable<any> {
    return this.callService(Operation.POST, ExitEmployeeConstant.VALIDATE_API_URL, data);
  }

  public GetEmployeeHistory(idEmployee: number): Observable<any> {
    return this.callService(Operation.GET, ExitEmployeeConstant.GET_EMPLOYEE_HISTORY.concat(idEmployee.toString()));
  }

  public ChooseMethodAccordingToAction(IdExitAction: number, employeeExit: ExitEmployee): Observable<any> {
    const data: any = {};
    data['IdExitAction'] = IdExitAction;
    data['employeeExit'] = employeeExit;
    const objectToSave: ObjectToSave = new ObjectToSave();
    objectToSave.Model = data;
    return super.callService(Operation.POST, ExitEmployeeConstant.CHOOSE_METHOD_ACCORDING_TO_ACTION, objectToSave);
  }

  public validateAllExitEmployeePayline(idExitEmployee: number): Observable<any> {
    return this.callService(Operation.GET, ExitEmployeeConstant.VALIDATE_ALL_EXIT_EMPLOYEE_PAY_LINE.concat(idExitEmployee.toString()));
  }
}
