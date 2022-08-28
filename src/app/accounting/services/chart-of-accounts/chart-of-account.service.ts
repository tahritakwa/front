import {ResourceServiceJava} from '../../../shared/services/resource/resource.serviceJava';
import {Injectable, Inject} from '@angular/core';
import {ChartOfAccountsConstant} from '../../../constant/accounting/chart-of-account.constant';
import {AppConfig} from '../../../../COM/config/app.config';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class ChartAccountService extends ResourceServiceJava {
  constructor(@Inject(HttpClient) http, @Inject(AppConfig) appConfigAccounting) {
    super(http, appConfigAccounting, 'accounting', ChartOfAccountsConstant.ENTITY_NAME);
  }
}
