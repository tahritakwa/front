import {SalaryStructureValidityPeriod} from '../../../models/payroll/salary-structure-validity-period';
import {Inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../../../../COM/config/app.config';
import { ResourceServiceRhPaie } from '../../../shared/services/resource/resource.service.rhpaie';

export class SalaryStructureValidityPeriodService extends ResourceServiceRhPaie<SalaryStructureValidityPeriod> {
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(
      httpClient, appConfig,
      'base', 'SalaryStructureValidityPeriod', 'PayRoll');
  }

}
