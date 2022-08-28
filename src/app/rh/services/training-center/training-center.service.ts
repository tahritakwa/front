import {Inject, Injectable} from '@angular/core';
import {TrainingCenter} from '../../../models/rh/training-center.model';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../../../../COM/config/app.config';
import { ResourceServiceRhPaie } from '../../../shared/services/resource/resource.service.rhpaie';

@Injectable()
export class TrainingCenterService extends ResourceServiceRhPaie<TrainingCenter> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(
      httpClient, appConfig,
      'trainingCenter', 'TrainingCenter', 'RH');
  }

}
