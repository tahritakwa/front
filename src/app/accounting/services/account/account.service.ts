import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../../../COM/config/app.config';
import { AccountsConstant } from '../../../constant/accounting/account.constant';
import { ResourceServiceJava } from '../../../shared/services/resource/resource.serviceJava';

@Injectable()
export class AccountService extends ResourceServiceJava {
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfigAccounting) {
    super(httpClient, appConfigAccounting, 'accounting', AccountsConstant.ENTITY_NAME);
  }

}

