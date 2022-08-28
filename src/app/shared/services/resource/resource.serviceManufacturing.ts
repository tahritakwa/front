import {HttpClient, HttpHeaders} from '@angular/common/http';

import {Observable} from 'rxjs/Observable';

import 'rxjs/add/operator/map';

import {Operation} from '../../../../COM/Models/operations';

import {AppConfig} from '../../../../COM/config/app.config';

import {QueryOptions} from '../../utils/query-options';

import {GenericServiceManufacturing} from '../../../../COM/config/app-config.serviceManufactruring';
import { DataTransferShowSpinnerService } from '../spinner/data-transfer-show-spinner.service';
 

/**

 * Resource service : base class of service

 * */

export abstract class ResourceServiceManufacturing {

 private gserviceManufacturing: GenericServiceManufacturing;

 private headers: HttpHeaders;
 dataTransferShowSpinnerService: DataTransferShowSpinnerService;
 

 /**

 * create new service

 * @param http

 * @param config

 * @param endpoint

 * @param model

 * @param section

 */

 constructor(

 private http: HttpClient,

 private config: AppConfig,

 private section: string,

 private endpoint: string,

 ) {

 this.headers = this.headers || new HttpHeaders();

 this.gserviceManufacturing = new GenericServiceManufacturing(http, config, section, endpoint, this.headers);

 }
 

 /**

 * Call http service

 * @param action

 * @param service

 * @param data

 * @param queryOptions

 * @returns Observable

 */

 public callService(

 action: Operation,

 service: string,

 data?: any,

 queryOptions?: QueryOptions

 ): Observable<any> | Observable<any[]> {

 return this.gserviceManufacturing.callService(action, service, data, queryOptions);

 }
 

 public getGenericManufacturingService() {

 return this.gserviceManufacturing;

 }

   /**
   * HttpGet element by Id, return
   * @param id
   * @returns Observable
   */
  
   getEntityById(operation: any, method: any, id: number): Observable<any> {
    return this.callService(operation, method, id);
  }

}
