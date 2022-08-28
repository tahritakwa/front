import { Injectable, Inject } from '@angular/core';
import { ResourceService } from '../../../shared/services/resource/resource.service';
import { ZipCode } from '../../../models/shared/zip-code';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../../../COM/config/app.config';

@Injectable()
export class ZipCodeService extends ResourceService<ZipCode> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(
      httpClient, appConfig,
      'base', 'ZipCode', 'Shared');
  }
}
