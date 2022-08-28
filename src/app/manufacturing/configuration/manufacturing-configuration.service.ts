import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ResourceServiceJava} from '../../shared/services/resource/resource.serviceJava';
import {AppConfig} from '../../../COM/config/app.config';

@Injectable()
export class ManufacturingConfigurationService extends ResourceServiceJava {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfigCrm) {
    super(httpClient, appConfigCrm, 'manufacturing', 'configuration');
  }

}
