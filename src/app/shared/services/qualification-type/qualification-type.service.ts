import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {QualificationType} from '../../../models/payroll/qualification-type.model';
import {AppConfig} from '../../../../COM/config/app.config';
import { ResourceServiceRhPaie } from '../resource/resource.service.rhpaie';


@Injectable()
export class QualificationTypeService extends ResourceServiceRhPaie<QualificationType> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super( httpClient, appConfig, 'qualificationType', 'QualificationType', 'PayRoll');
  }

}
