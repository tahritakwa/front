import {ResourceServiceJava} from '../../../shared/services/resource/resource.serviceJava';
import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../../../../COM/config/app.config';
import {JournalConstants} from '../../../constant/accounting/journal.constant';

@Injectable()
export class JournalService extends ResourceServiceJava {
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfigAccounting) {
    super(httpClient, appConfigAccounting, 'accounting', JournalConstants.ENTITY_NAME);
  }
}
