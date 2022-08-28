import {Inject, Injectable} from '@angular/core';
import {AppConfig} from '../../../../COM/config/app.config';
import {HttpClient} from '@angular/common/http';
import {FormationType} from '../../../models/rh/formation-type.model';
import { ResourceServiceRhPaie } from '../../../shared/services/resource/resource.service.rhpaie';

@Injectable()
export class FormationTypeService extends ResourceServiceRhPaie<FormationType> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(
      httpClient, appConfig,
      'base', 'FormationType', 'RH');
  }

}
