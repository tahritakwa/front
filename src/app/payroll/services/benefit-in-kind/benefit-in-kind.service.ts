import {Inject, Injectable} from '@angular/core';
import {BenefitInKind} from '../../../models/payroll/benefit-in-kind.model';
import { ResourceServiceRhPaie } from '../../../shared/services/resource/resource.service.rhpaie';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../../../../COM/config/app.config';
import {Observable} from 'rxjs/Observable';
import {BenefitInKindConstant} from '../../../constant/payroll/benefit-in-kind.constant';
import {Operation} from '../../../../COM/Models/operations';

@Injectable()
export class BenefitInKindService extends ResourceServiceRhPaie<BenefitInKind> {
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(
      httpClient, appConfig,
      'benefitInKind', 'BenefitInKind', 'PayRoll');
  }

  /**
   * Check if benefit in kind is associate with any payslips
   */
  public checkIfContractsHasAnyPayslip(model: BenefitInKind): Observable<boolean> {
    return this.callService(Operation.POST,
      BenefitInKindConstant.CHECK_IF_BENEFITINKIND_IS_ASSOCIATE_WITH_ANY_PAYSLIP, model) as Observable<boolean>;
  }
}
