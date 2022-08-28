import { Injectable, Inject } from '@angular/core';
import { Office } from '../../../models/shared/office.model';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../../../COM/config/app.config';
import { ResourceServiceRhPaie } from '../../../shared/services/resource/resource.service.rhpaie';


@Injectable()
export class OfficeService extends ResourceServiceRhPaie<Office> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(
      httpClient, appConfig,
      'office', 'Office', 'Shared');
   }

}
