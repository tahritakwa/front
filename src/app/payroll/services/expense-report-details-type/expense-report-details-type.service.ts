import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../../../../COM/config/app.config';
import {ExpenseReportDetailsType} from '../../../models/payroll/expense-report-details-type.model';
import { ResourceServiceRhPaie } from '../../../shared/services/resource/resource.service.rhpaie';

@Injectable()
export class ExpenseReportDetailsTypeService extends ResourceServiceRhPaie<ExpenseReportDetailsType> {
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig,
      'expenseReportDetailsType', 'ExpenseReportDetailsType', 'PayRoll');
  }

}
