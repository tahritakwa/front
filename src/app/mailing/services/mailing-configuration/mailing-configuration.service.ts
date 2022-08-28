import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../../../../COM/config/app.config';
import {ResourceServiceJava} from '../../../shared/services/resource/resource.serviceJava';

@Injectable()
export class MailingConfigurationService extends ResourceServiceJava {
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfigMailing) {
    super(httpClient, appConfigMailing, 'mailing', 'configuration');
  }

}
