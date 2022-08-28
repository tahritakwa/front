import {HttpClient} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {AppConfig} from '../../../../COM/config/app.config';
import {AdditionalHour} from '../../../models/payroll/additional-hour.model';
import { ResourceServiceRhPaie } from '../../../shared/services/resource/resource.service.rhpaie';

@Injectable()
export class AdditionalHourService extends ResourceServiceRhPaie<AdditionalHour> {
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(
      httpClient, appConfig,
      'additionalHour', 'AdditionalHour', 'PayRoll');
  }
}
