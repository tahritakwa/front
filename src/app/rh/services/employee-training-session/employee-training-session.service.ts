import {Inject, Injectable} from '@angular/core';
import {EmployeeTrainingSession} from '../../../models/rh/employee-training-session.model';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../../../../COM/config/app.config';
import { ResourceServiceRhPaie } from '../../../shared/services/resource/resource.service.rhpaie';

@Injectable()
export class EmployeeTrainingSessionService extends ResourceServiceRhPaie<EmployeeTrainingSession> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(
      httpClient, appConfig,
      'base', 'EmployeeTrainingSession', 'RH');
  }

}
