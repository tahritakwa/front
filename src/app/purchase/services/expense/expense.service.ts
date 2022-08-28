import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../../../COM/config/app.config';
import { ResourceService } from '../../../shared/services/resource/resource.service';
import { Expense } from '../../../models/purchase/expense.model';

@Injectable()
export class ExpenseService extends ResourceService<Expense> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(
      httpClient, appConfig,
      'expense', 'Expense', 'Sales');
  }

}
