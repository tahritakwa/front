import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../../../../COM/config/app.config';
import {DocumentRequestType} from '../../../models/payroll/document-request-type.model';
import { ResourceServiceRhPaie } from '../../../shared/services/resource/resource.service.rhpaie';

@Injectable()
export class DocumentRequestTypeService extends ResourceServiceRhPaie<DocumentRequestType> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(
      httpClient, appConfig,
      'documentRequestType', 'DocumentRequestType', 'PayRoll');
  }

}
