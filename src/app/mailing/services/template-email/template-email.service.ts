import {Inject, Injectable} from '@angular/core';
import {ResourceServiceJava} from '../../../shared/services/resource/resource.serviceJava';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../../../../COM/config/app.config';
import {MailingConstant} from '../../../constant/mailing/mailing.constant';

@Injectable()
export class TemplateEmailService extends ResourceServiceJava {
  constructor(private httpClient: HttpClient, @Inject(AppConfig) appConfigMailing) {
    super(httpClient, appConfigMailing, MailingConstant.MODULE_NAME, MailingConstant.MAILING_URL);
  }

}
