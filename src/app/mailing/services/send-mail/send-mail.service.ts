import {Inject, Injectable} from '@angular/core';
import {ResourceServiceJava} from '../../../shared/services/resource/resource.serviceJava';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../../../../COM/config/app.config';

@Injectable()
export class SendMailService  extends ResourceServiceJava {
  constructor(private httpClient: HttpClient, @Inject(AppConfig) appConfigMailing) {
    super(httpClient, appConfigMailing, 'mailing', 'sendMail');
  }

}
