import {Inject, Injectable} from '@angular/core';
import {InterviewEmail} from '../../../models/rh/interview-email.model';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../../../../COM/config/app.config';
import { ResourceServiceRhPaie } from '../../../shared/services/resource/resource.service.rhpaie';

@Injectable()
export class InterviewEmailService extends ResourceServiceRhPaie<InterviewEmail> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(
      httpClient, appConfig,
      'interviewEmail', 'InterviewEmail', 'RH');
  }

}
