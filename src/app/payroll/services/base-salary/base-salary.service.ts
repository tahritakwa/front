import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { ResourceServiceRhPaie } from '../../../shared/services/resource/resource.service.rhpaie';
import {BaseSalary} from '../../../models/payroll/base-salary.model';
import {AppConfig} from '../../../../COM/config/app.config';

@Injectable()
export class BaseSalaryService extends ResourceServiceRhPaie<BaseSalary> {
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(
      httpClient, appConfig,
      'base', 'BaseSalary', 'PayRoll');
  }

}
