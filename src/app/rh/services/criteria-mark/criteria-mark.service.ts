import {Inject, Injectable} from '@angular/core';
import {AppConfig} from '../../../../COM/config/app.config';
import {HttpClient} from '@angular/common/http';
import {CriteriaMark} from '../../../models/rh/criteria-mark.model';
import { ResourceServiceRhPaie } from '../../../shared/services/resource/resource.service.rhpaie';


@Injectable()
export class CriteriaMarkService extends ResourceServiceRhPaie<CriteriaMark> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(
      httpClient, appConfig,
      'base', 'CriteriaMark', 'RH');
  }

}
