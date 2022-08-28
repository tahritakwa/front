import {Inject, Injectable} from '@angular/core';
import {ExternalTrainer} from '../../../models/rh/external-trainer.model';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../../../../COM/config/app.config';
import { ResourceServiceRhPaie } from '../../../shared/services/resource/resource.service.rhpaie';

@Injectable()
export class ExternalTrainerService extends ResourceServiceRhPaie<ExternalTrainer> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(
      httpClient, appConfig,
      'externalTrainer', 'ExternalTrainer', 'RH');
  }

}
