import {HttpClient} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {AppConfig} from '../../../../COM/config/app.config';
import {RecruitmentSkills} from '../../../models/rh/recruitment-skills.model';
import { ResourceServiceRhPaie } from '../../../shared/services/resource/resource.service.rhpaie';

@Injectable()
export class RecruitmentSkillsService extends ResourceServiceRhPaie<RecruitmentSkills> {
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig, 'base', 'RecruitmentSkills', 'RH');
  }
}
