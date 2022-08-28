import {Observable} from 'rxjs/Observable';
import {QueryOptions} from '../../app/shared/utils/query-options';
import {AppConfig} from './app.config';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Operation} from '../Models/operations';

const API_CONFIG = 'root_api';

export class GenericServiceManufacturing {
  private connection: string;

  constructor(
    private http: HttpClient,
    private config: AppConfig,
    private section: string,
    private endpoint: string,
    private headers: HttpHeaders) {
    this.connection = this.config.getConfig(API_CONFIG);
  }

  getConnection() {
    return this.connection;
  }

  getSection() {
    return this.section;
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
          `${this.connection}/${this.section}/${this.endpoint}/${service}`, data);
      }
      case Operation.PUT: {
        return this.http.put(
          `${this.connection}/${this.section}/${this.endpoint}/${service}/${data.id}`, data);
      }
      case Operation.DELETE: {
        return this.http.delete(
          `${this.connection}/${this.section}/${this.endpoint}/${service}/${data}`);
      }
      case Operation.GET: {
        const qOptions: string = queryOptions
          ? `?${queryOptions.toQueryString()}`
          : '';
        if (data === 0) {
          return this.http.get(
            `${this.connection}/${this.section}/${this.endpoint}/${service}${qOptions}`);
        } else {
          return this.http.get(
            `${this.connection}/${this.section}/${this.endpoint}/${service}/${data}/${qOptions}`);
        }
      }
      default: {
        return Observable.empty();
      }
    }
  }

  public getEntityList(operation: any, method: any): Observable<any> {
    return this.callService(operation, method, 0);
  }

  public saveEntity(operation: any, method: any, entity: any): Observable<any> {
    return this.callService(operation, method, entity);
  }

  public updateEntity(operation: any, method: any, entity: any, id: number): Observable<any> {
    entity.id = id;
    return this.callService(operation, method, entity);
  }

  public deleteEntity(operation: any, method: any, id: number): Observable<any> {
    return this.callService(operation, method, id);
  }

  getEntityById(operation: any, method: any, id: number): Observable<any> {
    return this.callService(operation, method, id);
  }
}
