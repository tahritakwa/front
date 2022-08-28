import {HttpClient} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {AppConfig} from '../../../../COM/config/app.config';
import {RecruitmentLanguage} from '../../../models/rh/recruitment-language.model';
import { ResourceServiceRhPaie } from '../../../shared/services/resource/resource.service.rhpaie';

@Injectable()
export class RecruitmentLanguageService extends ResourceServiceRhPaie<RecruitmentLanguage> {
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig, 'recruitmentLanguage', 'RecruitmentLanguage', 'RH');
  }
}
