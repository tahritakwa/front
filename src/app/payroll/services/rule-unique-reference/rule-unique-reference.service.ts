import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../../../COM/config/app.config';
import { RuleUniqueReference } from '../../../models/payroll/rule-unique-reference';
import { ResourceServiceRhPaie } from '../../../shared/services/resource/resource.service.rhpaie';

@Injectable()
export class RuleUniqueReferenceService extends ResourceServiceRhPaie<RuleUniqueReference> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig,
      'ruleUniqueReference', 'RuleUniqueReference', 'PayRoll');
  }

}
