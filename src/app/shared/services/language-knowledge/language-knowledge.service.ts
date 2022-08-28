import {Inject, Injectable} from '@angular/core';
import {AppConfig} from '../../../../COM/config/app.config';
import {HttpClient} from '@angular/common/http';
import {Language} from '../../../models/shared/Language.model';
import { ResourceServiceRhPaie } from '../resource/resource.service.rhpaie';

@Injectable()
export class LanguageKnowledgeService extends ResourceServiceRhPaie<Language> {
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig, 'language', 'Language', 'Shared');
  }
}
