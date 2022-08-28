import {Inject, Injectable} from '@angular/core';
import {AppConfig} from '../../../../COM/config/app.config';
import {HttpClient} from '@angular/common/http';
import {EvaluationCriteriaTheme} from '../../../models/rh/evaluation-criteria-theme.model';
import { ResourceServiceRhPaie } from '../../../shared/services/resource/resource.service.rhpaie';

@Injectable()
export class EvaluationCriteriaThemeService extends ResourceServiceRhPaie<EvaluationCriteriaTheme> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(
      httpClient, appConfig,
      'evaluationCriteriaTheme', 'EvaluationCriteriaTheme', 'RH');
  }
}
