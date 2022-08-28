import {Inject, Injectable} from '@angular/core';
import {TrainingCenterRoom} from '../../../models/rh/training-center-room.model';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../../../../COM/config/app.config';
import { ResourceServiceRhPaie } from '../../../shared/services/resource/resource.service.rhpaie';

@Injectable()
export class TrainingCenterRoomService extends ResourceServiceRhPaie<TrainingCenterRoom> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(
      httpClient, appConfig,
      'trainingCenterRoom', 'TrainingCenterRoom', 'RH');
  }

}
