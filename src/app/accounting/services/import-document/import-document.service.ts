import { Injectable, Inject } from '@angular/core';
import { ResourceServiceJava } from '../../../shared/services/resource/resource.serviceJava';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../../../COM/config/app.config';
import { ImportDocumentConstants } from '../../../constant/accounting/import-document.constant';

@Injectable()
export class ImportDocumentService extends ResourceServiceJava {
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfigAccounting) {
    super(httpClient, appConfigAccounting, 'accounting', ImportDocumentConstants.ENTITY_NAME);
  }

}
