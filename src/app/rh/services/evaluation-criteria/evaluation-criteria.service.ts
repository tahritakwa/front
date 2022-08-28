import {Inject, Injectable} from '@angular/core';
import {AppConfig} from '../../../../COM/config/app.config';
import {HttpClient} from '@angular/common/http';
import {EvaluationCriteria} from '../../../models/rh/evaluation-criteria.model';
import { ResourceServiceRhPaie } from '../../../shared/services/resource/resource.service.rhpaie';

@Injectable()
export class EvaluationCriteriaService extends ResourceServiceRhPaie<EvaluationCriteria> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(
      httpClient, appConfig,
      'base', 'EvaluationCriteria', 'RH');
  }
}
