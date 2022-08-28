import {Inject, Injectable} from '@angular/core';
import {JobsParameters} from '../../../models/shared/jobs-parameters.model';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../../../../COM/config/app.config';
import { ResourceServiceRhPaie } from '../../../shared/services/resource/resource.service.rhpaie';

@Injectable()
export class JobsParametersService extends ResourceServiceRhPaie<JobsParameters> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(
      httpClient, appConfig,
      'jobsParameters', 'JobsParameters', 'Shared');
  }

}
