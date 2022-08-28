import {ExitReason} from '../../../models/payroll/exit-reason.model';

import {AppConfig} from '../../../../COM/config/app.config';
import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { ResourceServiceRhPaie } from '../../../shared/services/resource/resource.service.rhpaie';

@Injectable()
export class ExitReasonService extends ResourceServiceRhPaie<ExitReason> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(
      httpClient, appConfig,
      'exitReason', 'ExitReason', 'PayRoll');
  }
}
