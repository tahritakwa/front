import {ResourceServiceJava} from '../../shared/services/resource/resource.serviceJava';
import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../../../COM/config/app.config';
import {Observable} from 'rxjs/Observable';
import {AuthEnvironment} from '../../login/Authentification/models/auth-environment';

@Injectable()
export class AuthBuildPropertiesService extends ResourceServiceJava {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfigAuth) {
    super(httpClient, appConfigAuth, 'auth', '');
  }

  getAuthBuildProperties() : Observable<AuthEnvironment>{
    return this.getJavaGenericService().getData('build-properties');
  }
}