import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../../../../COM/config/app.config';
import {SalaryRule} from '../../../models/payroll/salary-rule.model';
import {Observable} from 'rxjs/Observable';
import {Operation} from '../../../../COM/Models/operations';
import {SalaryRuleConstant} from '../../../constant/payroll/salary-rule.constant';
import { ResourceServiceRhPaie } from '../../../shared/services/resource/resource.service.rhpaie';

@Injectable()
export class SalaryRuleService extends ResourceServiceRhPaie<SalaryRule> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig,
      'salaryRule', 'SalaryRule', 'PayRoll');
  }

  public getSalaryRuleOrderedByApplicabilityThenByOrder(): Observable<any> {
    return this.callService(Operation.GET, SalaryRuleConstant.GET_ORDERED_RULES);
  }

  /**
   * Check if salaryRule is associate with any payslips
   */
  public checkIfSalaryRulesHasAnyPayslip(model: SalaryRule): Observable<any> {
    return this.callService(Operation.POST,
      SalaryRuleConstant.CHECK_IF_SALARYRULE_IS_ASSOCIATE_WITH_ANY_PAYSLIP, model);
  }
}
