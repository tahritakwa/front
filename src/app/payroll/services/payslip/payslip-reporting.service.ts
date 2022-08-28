import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Payslip} from '../../../models/payroll/payslip.model';
import {AppConfig} from '../../../../COM/config/app.config';
import { ResourceServiceRhPaie } from '../../../shared/services/resource/resource.service.rhpaie';

@Injectable()
export class PayslipReportingService extends ResourceServiceRhPaie<Payslip> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(
      httpClient, appConfig,
      'payRollReporting', 'Payslip', 'PayRoll');
  }


}
