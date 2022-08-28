import {Inject, Injectable} from '@angular/core';
import {ExitEmployeePayLine} from '../../../models/payroll/ExitEmployeePayLine.model';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../../../../COM/config/app.config';
import {Observable} from 'rxjs/Observable';
import {Operation} from '../../../../COM/Models/operations';
import {PredicateFormat} from '../../../shared/utils/predicate';
import {ObjectToSave} from '../../../models/shared/objectToSend';
import {ExitEmployeeConstant} from '../../../constant/payroll/exit-employee.constant';
import { ResourceServiceRhPaie } from '../../../shared/services/resource/resource.service.rhpaie';

@Injectable()
export class ExitEmployeePayServiceService extends ResourceServiceRhPaie<ExitEmployeePayLine> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(
      httpClient, appConfig,
      'exitEmployeePayLine', 'ExitEmployeePayLine', 'PayRoll');
  }

  public GeneratePayBalanceForExitEmployee(idEmployeeExit: number): Observable<any> {
    return super.callService(Operation.GET, ExitEmployeeConstant.GENERATE_PAY_BALANCE_FOR_EXIT_EMPLOYEE.concat(idEmployeeExit.toString()));
  }

  public GetListOfPayForExitEmployee(predicate: PredicateFormat, idEmployeeExit: number): Observable<any> {
    const data: any = {};
    data['idEmployeeExit'] = idEmployeeExit;
    data['predicate'] = predicate;
    const objectToSave: ObjectToSave = new ObjectToSave();
    objectToSave.Model = data;
    return super.callService(Operation.POST, ExitEmployeeConstant.GET_LIST_OF_PAY_For_EXIT_EMPLOYEE, objectToSave);
  }
}
