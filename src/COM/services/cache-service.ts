import {Inject, Injectable} from '@angular/core';
import {ResourceServiceJava} from '../../app/shared/services/resource/resource.serviceJava';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../config/app.config';
import {Observable} from 'rxjs/Observable';
import {Operation} from '../Models/operations';

@Injectable()
export class CacheService extends ResourceServiceJava{
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfigAuth) {
    super(httpClient, appConfigAuth, 'auth', 'caches');
  }

  public clearCache() : Observable<any>{
    return this.getJavaGenericService().callService(Operation.GET,'clear-all-caches');
  }

}
