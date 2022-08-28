import { Observable } from 'rxjs/Observable';
import { QueryOptions } from '../../app/shared/utils/query-options';
import { AppConfig } from './app.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ISerializer, Serializer } from '../../app/shared/utils/serializer';
import { Operation } from '../Models/operations';
import { Resource } from '../../app/models/shared/ressource.model';
import { ObjectToSave, EntityAxisValues } from '../../app/models/shared/objectToSend';


const API_CONFIG = 'root_api';
const BASE_SERVICE = 'base';
const GET_DATA_DROPDOWN = 'getDataDropdown';
const GET_DATA_DROPDOWN_PREDICATE = 'getDataDropdownWithPredicate';

export class GenericService<T extends Resource> extends BehaviorSubject<any[]> {
  private serializer: ISerializer<T>;
  private connection: string;
  constructor(
    private http: HttpClient,
    private config: AppConfig,
    private headers: HttpHeaders,
    private endpoint?: string,
    private apiRoot?: string
  ) {
    super([]);
    const root = apiRoot ? apiRoot : API_CONFIG;
    this.serializer = new Serializer<T>();
    this.connection = this.config.getConfig(root);
    if (!this.endpoint) {
      this.endpoint = BASE_SERVICE;
    }
  }

  public dropdownlist(queryOptions?: QueryOptions): Observable<any[]> {
    return this.callService(Operation.GET, GET_DATA_DROPDOWN, queryOptions);
  }

  public dropdownListWithPredicate(queryOptions): Observable<any[]> {
    return this.callService(Operation.POST, GET_DATA_DROPDOWN_PREDICATE, queryOptions);
  }

  public list(queryOptions?: QueryOptions): Observable<any[]> {
    const qOptions: string = queryOptions
      ? `?${queryOptions.toQueryString()}`
      : '';
    return this.http.get<any[]>(
      `${this.connection}/${this.endpoint}/${Operation.GET}${qOptions}`,
      { headers: this.headers }
    );
  }
  public create(model: any , unicityData?:any, isFromModal?: boolean): Observable<any> {
    const object: ObjectToSave = new ObjectToSave();
    object.Model = model;
    object.EntityAxisValues = Array<EntityAxisValues>();
    object.VerifyUnicity = unicityData;
    object.IsFromModal = isFromModal? true : false;
    return this.http.post<any>(
      `${this.connection}/${this.endpoint}/${Operation.POST}`,
      this.serializer.serializeAny(object, true),
      { headers: this.headers }
    );
  }
  public update(model: any , unicityData?:any): Observable<any> {
    const object: ObjectToSave = new ObjectToSave();
    object.Model = model;
    object.EntityAxisValues = Array<EntityAxisValues>();
    object.VerifyUnicity = unicityData;
    return this.http.put<any>(
      `${this.connection}/${this.endpoint}/${Operation.PUT}`,
      this.serializer.serializeAny(object, true),
      { headers: this.headers }
    );
  }

  public delete(model: any): Observable<any> {
    return this.http.delete<any>(
      `${this.connection}/${this.endpoint}/${Operation.DELETE}/${model.Id}`,
      { headers: this.headers }
    );
  }

  public patch(id: number, data: any): Observable<any> {
    return this.http.patch<any>(
      `${this.connection}/${this.endpoint}/${Operation.PATCH}/${id}`,
      this.serializer.serialize(data, true),
      { headers: this.headers }
    );
  }

  public callService(
    action: Operation,
    service: string,
    data?: any,
    queryOptions?: QueryOptions,
    isWithDateCorrection: boolean = true
  ): Observable<any> | Observable<any[]> {
    switch (action) {
      case Operation.POST: {
        return this.http.post(
          `${this.connection}/${this.endpoint}/${service}`,
          this.serializer.serialize(data, isWithDateCorrection),
          { headers: this.headers }
        );
      }
      case Operation.PUT: {
        return this.http.put(
          `${this.connection}/${this.endpoint}/${service}`,
          this.serializer.serialize(data, isWithDateCorrection),
          { headers: this.headers }
        );
      }
      case Operation.DELETE: {
        return this.http.delete(
          `${this.connection}/${this.endpoint}/${service}/${data.Id}`,
          { headers: this.headers }
        );
      }
      case Operation.GET: {
        const qOptions: string = queryOptions
          ? `?${queryOptions.toQueryString()}`
          : '';
        return this.http.get<any[]>(
          `${this.connection}/${this.endpoint}/${service}${qOptions}`,
          { headers: this.headers }
        );
      }
      default: {
        return Observable.empty();
      }
    }
  }

  public get EndPoint(): string {
    return this.endpoint;
  }

  public set EndPoint(v: string) {
    this.endpoint = v;
  }


}
