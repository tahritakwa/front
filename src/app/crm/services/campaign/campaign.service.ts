import {Inject, Injectable} from '@angular/core';
import {ResourceServiceJava} from "../../../shared/services/resource/resource.serviceJava";
import {HttpClient} from "@angular/common/http";
import {AppConfig} from "../../../../COM/config/app.config";
import {Observable} from "rxjs/Observable";
import {Operation} from "../../../../COM/Models/operations";

@Injectable()
export class CampaignService  extends ResourceServiceJava  {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfigCrm) {
    super(httpClient, appConfigCrm, 'crm', 'campaign');
  }

  public getCampaignByParam(params: any): Observable<any> {
    return this.getJavaGenericService().sendData('paginatingParams', params);
  }

  public getAllCampaigns(page, size, isArchived, sortParams): Observable<any> {
    return this.callService(Operation.GET, '/allCampaigns/isArchived/' + isArchived + `?page=${page}&size=${size}&sort=${sortParams}`);
  }
}
