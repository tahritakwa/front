import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AppConfig } from '../../../../COM/config/app.config';
import { DocumentType } from '../../../models/sales/document-type.model';
import { ResourceService } from '../resource/resource.service';

@Injectable()
export class DocumentTypeService extends ResourceService<DocumentType>{

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig,
      'base', 'DocumentType', 'Sales');
  }

}
