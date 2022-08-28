import {Observable} from 'rxjs/Observable';
import {QueryOptions} from '../../app/shared/utils/query-options';
import {AppConfig} from './app.config';
import {HttpClient} from '@angular/common/http';
import {Operation} from '../Models/operations';

const API_CONFIG = 'root_api';

export class MasterConfigService {
    private connection: string;

    constructor(
        private http: HttpClient,
        private config: AppConfig,
        private endpoint: string) {
        this.connection = this.config.getConfig(API_CONFIG);
        if (!this.endpoint) {
          this.endpoint = 'authenticate';
        }
      }

   /**
    * call service switch action
   */
    public callService(
        action: Operation,
        service: string,
        data?: any,
        queryOptions?: QueryOptions
      ): Observable<any> | Observable<any[]> {
        switch (action) {
          case Operation.POST: {
            return this.http.post(
              `${this.connection}/${this.endpoint}/${service}`, data);
          }
          default: {
            return Observable.empty();
          }
        }
      }
}
