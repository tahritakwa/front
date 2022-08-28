import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Operation} from '../../../../COM/Models/operations';
import {AppConfig} from '../../../../COM/config/app.config';
import {QueryOptions} from '../../utils/query-options';
import {GenericServiceJava} from '../../../../COM/config/app-config.serviceJava';
import {StringBuilder} from 'typescript-string-operations';
import {CrmConstant} from '../../../constant/crm/crm.constant';
import {DataTransferShowSpinnerService} from '../spinner/data-transfer-show-spinner.service';
import {Inject} from '@angular/core';
import {StatusConstant} from '../../../constant/crm/status.constant';
import {el} from '@angular/platform-browser/testing/src/browser_util';

/**
 * Resource service : base class of service
 * */
export abstract class ResourceServiceJava {
  private gServiceJava: GenericServiceJava;
  private headers: HttpHeaders;

  /**
   * create new service
   * @param http
   * @param config
   * @param endpoint
   * @param model
   * @param section
   */
  constructor(
    public http: HttpClient,
    private config: AppConfig,
    private section: string,
    private endpoint: string,
  ) {
    this.headers = this.headers || new HttpHeaders();
    this.gServiceJava = new GenericServiceJava(http, config, section, endpoint, this.headers);
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
    queryOptions?: QueryOptions,
    options?: any
  ): Observable<any> | Observable<any[]> | any {
    return this.gServiceJava.callService(action, service, data, queryOptions, options);
  }

  public getJavaGenericService() {
    return this.gServiceJava;
  }

  public getUnicity(property: string, value: any, actionToDo?): Observable<boolean> {
    const data = new StringBuilder(CrmConstant.IS_UNIQUE);
    if (property === StatusConstant.COLOR) {
      let color: string = value;
      color = color.replace(StatusConstant.COLOR_CODE_STARTER, StatusConstant.EMPTY_STRING);
      value = color;
    }
    data.Append('/');
    data.Append(property);
    data.Append('/');
    data.Append(value);
    data.Append('/mode/');
    data.Append(actionToDo);
    if (value) {
      return this.callService(Operation.GET, data.ToString(), null, null) as Observable<boolean>;
    } else {
      return Observable.of(null);
    }
  }
}
