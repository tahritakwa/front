import {Inject, Injectable} from '@angular/core';
import {ExternalTrainerSkills} from '../../../models/rh/external-trainer-skills.model';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../../../../COM/config/app.config';
import { ResourceServiceRhPaie } from '../../../shared/services/resource/resource.service.rhpaie';

@Injectable()
export class ExternalTrainerSkillsService extends ResourceServiceRhPaie<ExternalTrainerSkills> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(
      httpClient, appConfig,
      'base', 'ExternalTrainerSkills', 'RH');
  }

}
