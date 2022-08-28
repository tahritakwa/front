import {HttpClient} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {AppConfig} from '../../../../COM/config/app.config';
import {SessionBonus} from '../../../models/payroll/session-bonus.model';
import { ResourceServiceRhPaie } from '../../../shared/services/resource/resource.service.rhpaie';

@Injectable()
export class SessionBonusService extends ResourceServiceRhPaie<SessionBonus> {
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(
      httpClient, appConfig,
      'sessionBonus', 'SessionBonus', 'PayRoll');
  }
}
