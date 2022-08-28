import {Inject, Injectable} from '@angular/core';
import {Variable} from '../../../models/payroll/variable.model';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../../../../COM/config/app.config';
import {VariableConstant} from '../../../constant/payroll/variable.constant';
import {Observable} from 'rxjs/Observable';
import {Operation} from '../../../../COM/Models/operations';
import { ResourceServiceRhPaie } from '../../../shared/services/resource/resource.service.rhpaie';

@Injectable()
export class VariableService extends ResourceServiceRhPaie<Variable> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig,
      'variable', 'Variable', 'PayRoll');
  }

  /**
   * Check if variable is used in any rule associate with any payslips
   */
  public checkIFVariableIsUsedInAnyRuleUsedInAnyPayslip(model: Variable): Observable<any> {
    return this.callService(Operation.POST,
      VariableConstant.CHECK_IF_VARIABLE_IS_USED_IN_ANY_RULE_USED_IN_ANY_PAYSLIP, model);
  }
}
