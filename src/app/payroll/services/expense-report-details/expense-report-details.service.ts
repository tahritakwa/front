import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../../../../COM/config/app.config';
import {ExpenseReportDetails} from '../../../models/payroll/expense-report-details.model';
import { ResourceServiceRhPaie } from '../../../shared/services/resource/resource.service.rhpaie';

@Injectable()
export class ExpenseReportDetailsService extends ResourceServiceRhPaie<ExpenseReportDetails> {
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig,
      'base', 'ExpenseReportDeatils', 'PayRoll');
  }

}
