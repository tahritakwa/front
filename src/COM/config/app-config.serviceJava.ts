import { Observable } from 'rxjs/Observable';
import { QueryOptions } from '../../app/shared/utils/query-options';
import { AppConfig } from './app.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Operation } from '../Models/operations';
import { ResponseType } from '@angular/http';

const API_CONFIG = 'root_api';

export class GenericServiceJava {
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
  getEndPoint() {
    return this.endpoint;
  }

  /**
   * call service switch action
   */
  public callService(
    action: Operation,
    service: string,
    data?: any,
    queryOptions?: QueryOptions,
    options?: any
  ): Observable<any> | Observable<any[]> | any {
    switch (action) {
      case Operation.POST: {
        return this.http.post(
          `${this.connection}/${this.section}/${this.endpoint}/${service}`, data);
      }
      case Operation.PUT: {
        if (service) {
          return this.http.put(
            `${this.connection}/${this.section}/${this.endpoint}/${service}/${data.id}`, data);
        } else {
          return this.http.put(
            `${this.connection}/${this.section}/${this.endpoint}/${data.id}`, data);
        }
      }
      case Operation.DELETE: {
        if (data) {
          return this.http.delete(
            `${this.connection}/${this.section}/${this.endpoint}/${service}/${data}`);
        } else {
            return this.http.delete(
              `${this.connection}/${this.section}/${this.endpoint}/${service}`);
        }

      }
      case Operation.GET: {
        const qOptions: string = queryOptions
          ? `?${queryOptions.toQueryString()}`
          : '';
        if (data) {
          return this.http.get(
            `${this.connection}/${this.section}/${this.endpoint}/${service}/${data}${qOptions}`);
        } else {
          return this.http.get(
            `${this.connection}/${this.section}/${this.endpoint}/${service}`, options);
        }
      }
      default: {
        return Observable.empty();
      }
    }
  }

  public getEntityList(method?: any, data?: any): Observable<any> {
    method = method || '';
    return this.callService(Operation.GET, method, data);
  }

  public getEntityListHeaders(method?: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/vnd.ms-excel',
      'Accept': 'application/json'
    });

    return this.http.get<Blob>(
      `${this.connection}/${this.section}/${this.endpoint}/${method}`
      , {
        headers: headers,
        responseType: 'blob' as 'json'
      }
    );
  }

  public postEntityListHeaders(method?: any, data?: any): Observable<any> {

    return this.http.post<Blob>(
      `${this.connection}/${this.section}/${this.endpoint}/${method}`
      , data, {
        responseType: 'blob' as 'json'
      }
    );
  }

  public downloadFile(service?: any, data?: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/octet-stream'
    });

    return this.http.post<Blob>(
      `${this.connection}/${this.section}/${this.endpoint}/${service}`
      , data
      , {
        headers: headers,
        responseType: 'blob' as 'json'
      }
    );
  }

  public saveEntity(entity: any, service?: string): Observable<any> {
    service = service || '';
    return this.callService(Operation.POST, service, entity);
  }

  public updateEntity(entity: any, id: number, method?: any): Observable<any> {
    entity.id = id;
    method = method || '';
    return this.callService(Operation.PUT, method, entity);
  }

  public deleteEntity(id: number, method?: any): Observable<any> {
    method = method || '';
    return this.callService(Operation.DELETE, method, id);
  }

  public deleteList(method: any): Observable<any> {
    method = method || '';
    return this.callService(Operation.DELETE, method);
  }

  public getEntityById(id: number, method?: any): Observable<any> {
    method = method || '';
    return this.callService(Operation.GET, method, id);
  }

  public sendData(url: string, data?: any): Observable<any> {
    return this.http.post(`${this.connection}/${this.section}/${this.endpoint}/${url}`, data);
  }

  public getData(method?: any): Observable<any> {
    method = method || '';
    return this.callService(Operation.GET, method);
  }

  public uploadFile(
    service: string,
    data?: any,
    queryOptions?: QueryOptions
  ): Observable<any> | Observable<any[]> | any {
    return this.http.post(
      `${this.connection}/${this.section}/${this.endpoint}/${service}`, data, {responseType: 'text'});
  }
  public checkTitleAndSaveOpportunity(
    service: string,
    data?: any,
    queryOptions?: QueryOptions
  ): Observable<any> | Observable<any[]> | any {
    return this.http.post(
      `${this.connection}/${this.section}/${this.endpoint}/${service}`, data, {responseType: 'text'});
  }
  public checkTitleAndUpdateOpportunity(
    entity: any, id: number
  ): Observable<any> | Observable<any[]> | any {
    entity.id = id;
    return this.http.put(
      `${this.connection}/${this.section}/${this.endpoint}/${entity.id}`, entity, {responseType: 'text'});
  }

  public getFile(
    service: string,
    data?: any,
    queryOptions?: QueryOptions
  ): Observable<any> | Observable<any[]> | any {
    return this.http.get(
      `${this.connection}/${this.section}/${this.endpoint}/${service}`);
  }

  public deleteFile(
    service: string,
    data?: any,
    queryOptions?: QueryOptions
  ): Observable<any> | Observable<any[]> | any {
    return this.http.delete(
      `${this.connection}/${this.section}/${this.endpoint}/${service}`, {params: data});
  }

}
