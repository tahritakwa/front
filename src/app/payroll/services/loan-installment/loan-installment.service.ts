import {LoanInstallment} from '../../../models/payroll/loan-installment.models';
import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../../../../COM/config/app.config';
import { ResourceServiceRhPaie } from '../../../shared/services/resource/resource.service.rhpaie';


@Injectable()
export class LoanInstallmentService extends ResourceServiceRhPaie<LoanInstallment> {
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(
      httpClient, appConfig,
      'loanInstallment', 'LoanInstallment', 'PayRoll');
  }
}
