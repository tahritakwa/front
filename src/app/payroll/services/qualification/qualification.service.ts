import {Inject, Injectable} from '@angular/core';

import {HttpClient} from '@angular/common/http';
import {Qualification} from '../../../models/payroll/qualification.model';
import {AppConfig} from '../../../../COM/config/app.config';
import { ResourceServiceRhPaie } from '../../../shared/services/resource/resource.service.rhpaie';

@Injectable()
export class QualificationService extends ResourceServiceRhPaie<Qualification> {
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(
      httpClient, appConfig,
      'base', 'Qualification', 'PayRoll');
  }

}
