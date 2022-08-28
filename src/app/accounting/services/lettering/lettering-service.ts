import {ResourceServiceJava} from '../../../shared/services/resource/resource.serviceJava';
import {Injectable, Inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../../../../COM/config/app.config';
import { LetteringConstant } from '../../../constant/accounting/lettering.constant';

@Injectable()
export class LetteringService extends ResourceServiceJava {
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfigAccounting) {
    super(httpClient, appConfigAccounting, 'accounting', LetteringConstant.ENTITY_NAME);
  }
}
