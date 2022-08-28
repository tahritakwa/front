import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SalaryStructure} from '../../../models/payroll/salary-structure.model';
import {AppConfig} from '../../../../COM/config/app.config';
import {SalaryStructureConstant} from '../../../constant/payroll/salary-structure.constant';
import {Operation} from '../../../../COM/Models/operations';
import {Observable} from 'rxjs/Observable';
import { ResourceServiceRhPaie } from '../../../shared/services/resource/resource.service.rhpaie';

@Injectable()
export class SalaryStructureService extends ResourceServiceRhPaie<SalaryStructure> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(
      httpClient, appConfig,
      'salaryStructure', 'SalaryStructure', 'PayRoll');
  }

  public getSalaryStructureWithSalaryRules(idSalaryStructure: number): Observable<any> {
    return this.callService(Operation.POST, SalaryStructureConstant.GET_SALARY_STRUCTURE_WITH_SALARY_RULES, idSalaryStructure);
  }

  /**
   * Check if salaryStructure is associate with any payslip contracts
   */
  public checkIfSalaryStructureIsAssociatedWithAnyPayslip(model: SalaryStructure): Observable<boolean> {
    return this.callService(Operation.POST,
      SalaryStructureConstant.CHECK_IF_SALARY_STRUCTURE_IS_ASSOCIATED_WITH_ANY_PAYSLIP, model) as Observable<boolean>;
  }
}
