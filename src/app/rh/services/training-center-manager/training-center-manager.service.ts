import {Inject, Injectable} from '@angular/core';
import {TrainingCenterManager} from '../../../models/rh/training-center-manager.model';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../../../../COM/config/app.config';
import { ResourceServiceRhPaie } from '../../../shared/services/resource/resource.service.rhpaie';

@Injectable()
export class TrainingCenterManagerService extends ResourceServiceRhPaie<TrainingCenterManager> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(
      httpClient, appConfig,
      'base', 'TrainingCenterManager', 'RH');
  }

}
