import {Inject, Injectable} from '@angular/core';
import {ResourceServiceJava} from '../../../shared/services/resource/resource.serviceJava';
import {HttpClient, HttpHeaders, HttpParams, HttpResponse} from '@angular/common/http';
import {AppConfig} from '../../../../COM/config/app.config';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {Operation} from '../../../../COM/Models/operations';
import {QueryOptions} from '../../../shared/utils/query-options';
import {SharedCrmConstant} from '../../../constant/crm/sharedCrm.constant';
import {sharedStylesheetJitUrl} from '@angular/compiler';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {CrmConstant} from '../../../constant/crm/crm.constant';

@Injectable()
export class FileService extends ResourceServiceJava {
  public addFile: Subject<boolean> = new Subject();

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfigCrm) {
    super(httpClient, appConfigCrm, 'crm', 'file');
  }

  downloadFile(filename: string, directoryName: string): Observable<HttpResponse<string>> {
    return this.callService(Operation.GET, 'download/' + filename + CrmConstant.FILE_SEPARATOR + directoryName, null, null, {
      responseType: 'arraybuffer'
    });
  }
}

