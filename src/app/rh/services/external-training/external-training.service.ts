import {Inject, Injectable} from '@angular/core';
import {ExternalTraining} from '../../../models/rh/external-training.model';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../../../../COM/config/app.config';
import { ResourceServiceRhPaie } from '../../../shared/services/resource/resource.service.rhpaie';

@Injectable()
export class ExternalTrainingService extends ResourceServiceRhPaie<ExternalTraining> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(
      httpClient, appConfig,
      'externalTrainer', 'ExternalTraining', 'RH');
  }

}
