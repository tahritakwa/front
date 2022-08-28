import {Inject, Injectable} from '@angular/core';
import {ResourceServiceJava} from "../../../shared/services/resource/resource.serviceJava";
import {HttpClient} from "@angular/common/http";
import {AppConfig} from "../../../../COM/config/app.config";
import {Subject} from "rxjs/Subject";
import {Observable} from "rxjs/Observable";
import {Operation} from "../../../../COM/Models/operations";

@Injectable()
export class DropdownService extends ResourceServiceJava {
  public eventToSendToList: Subject<any> = new Subject<void>();

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfigCrm) {
    super(httpClient, appConfigCrm, 'crm', 'dropdowns');
  }

  sendDataToDropdownList(data: any) {
    this.eventToSendToList.next(data);
  }

  readDataFromDetails() {
    return this.eventToSendToList.asObservable();
  }
  public getAllFiltreByName( filtreName, entityType): Observable<any> {
    return this.callService(Operation.GET, '/byName/' + filtreName +'/'+ entityType);
  }
}
