import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Grade} from '../../../models/payroll/grade.model';
import {AppConfig} from '../../../../COM/config/app.config';
import { ResourceServiceRhPaie } from '../../../shared/services/resource/resource.service.rhpaie';

@Injectable()
export class GradeService extends ResourceServiceRhPaie<Grade> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(
      httpClient, appConfig,
      'grade', 'Grade', 'PayRoll');
  }

}
