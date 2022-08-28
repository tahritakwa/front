import {ResourceServiceJava} from '../../../shared/services/resource/resource.serviceJava';
import {Injectable, Inject} from '@angular/core';
import {AppConfig} from '../../../../COM/config/app.config';
import {HttpClient} from '@angular/common/http';
import {AccountingConfigurationConstant} from '../../../constant/accounting/accounting-configuration.constant';

@Injectable()
export class AccountingConfigurationService extends ResourceServiceJava {
  constructor(@Inject(HttpClient) http, @Inject(AppConfig) appConfigAccounting) {
    super(http, appConfigAccounting, 'accounting', AccountingConfigurationConstant.END_POINT);
  }
}
