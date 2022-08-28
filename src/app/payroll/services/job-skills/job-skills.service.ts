import {Inject, Injectable} from '@angular/core';
import {JobSkills} from '../../../models/payroll/job-skill.model';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../../../../COM/config/app.config';
import { ResourceServiceRhPaie } from '../../../shared/services/resource/resource.service.rhpaie';


@Injectable()
export class JobSkillsService extends ResourceServiceRhPaie<JobSkills> {

  constructor(@Inject(HttpClient)  httpClient, @Inject(AppConfig) appConfig) {
    super(
      httpClient, appConfig,
      'jobskills', 'JobSkills', 'PayRoll');
  }

}
