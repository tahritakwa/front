import {SkillsFamily} from '../../../models/payroll/skills-family.model';
import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../../../../COM/config/app.config';
import { ResourceServiceRhPaie } from '../../../shared/services/resource/resource.service.rhpaie';

@Injectable()
export class SkillsFamilyService extends ResourceServiceRhPaie<SkillsFamily> {
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(
      httpClient, appConfig,
      'skillsFamily', 'SkillsFamily', 'PayRoll');
  }
}
