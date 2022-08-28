import {ResourceServiceJava} from '../../../shared/services/resource/resource.serviceJava';
import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../../../../COM/config/app.config';

@Injectable()
export class ModuleServiceJava extends ResourceServiceJava {
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfigAccounting) {
    super(httpClient, appConfigAccounting, 'auth', 'module');
  }
}
