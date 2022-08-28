import {Injectable, Inject} from '@angular/core';
import {ResourceServiceJava} from '../../../shared/services/resource/resource.serviceJava';
import {AppConfig} from '../../../../COM/config/app.config';
import {TemplateAccountingConstant} from '../../../constant/accounting/template.constant';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class TemplateAccountingService extends ResourceServiceJava {
  constructor(@Inject(HttpClient) http, @Inject(AppConfig) appConfigAccounting) {
    super(http, appConfigAccounting, 'accounting', TemplateAccountingConstant.ENTITY_NAME);
  }
}
