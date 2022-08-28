import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Contract} from '../../../models/payroll/contract.model';
import {AppConfig} from '../../../../COM/config/app.config';
import {Observable} from 'rxjs/Observable';
import {Operation} from '../../../../COM/Models/operations';
import {ContractConstant} from '../../../constant/payroll/Contract.constant';
import {ObjectToSave} from '../../../models/shared/objectToSend';
import { ResourceServiceRhPaie } from '../../../shared/services/resource/resource.service.rhpaie';

@Injectable()
export class ContractService extends ResourceServiceRhPaie<Contract> {
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(
      httpClient, appConfig,
      'contract', 'Contract', 'PayRoll');
  }

  /**
   * Check if contracts is updates and has any payslips
   */
  public checkBeforeUpdateIfContractsHaveAnyPayslipOrTimesheet(contracts: Contract[], isFromContract: boolean): Observable<any> {
    const data: any = {};
    data[ContractConstant.CONTRACTS] = contracts;
    data[ContractConstant.IS_FROM_CONTRACT] = isFromContract;
    const objectToSave: ObjectToSave = new ObjectToSave();
    objectToSave.Model = data;
    return this.callService(Operation.POST, ContractConstant.CHECK_BEFORE_UPDATE_IF_CONTRACTS_HAVE_ANY_PAYSLIP_OR_TIMESHEET,
      objectToSave);
  }
  public GetLastBaseSalary(idEmployee: number): Observable<any> {
    return this.callService(Operation.GET, ContractConstant.GET_LAST_BASE_SALARY.concat(idEmployee.toString()));
  }
}
