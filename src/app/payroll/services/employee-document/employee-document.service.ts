import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {EmployeeDocument} from '../../../models/payroll/employee-document.model';
import {AppConfig} from '../../../../COM/config/app.config';
import { ResourceServiceRhPaie } from '../../../shared/services/resource/resource.service.rhpaie';

@Injectable()
export class EmployeeDocumentService extends ResourceServiceRhPaie<EmployeeDocument> {
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(
      httpClient, appConfig,
      'base', 'EmployeeDocument', 'PayRoll');
  }

}
