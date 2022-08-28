import {Inject, Injectable} from '@angular/core';
import {AppConfig} from "../../../../COM/config/app.config";
import {HttpClient, HttpEvent, HttpRequest} from "@angular/common/http";
import {ResourceServiceJava} from "../../../shared/services/resource/resource.serviceJava";
import {Observable} from "rxjs/Observable";
import {Http} from "@angular/http";

@Injectable()
export class UploadFileService extends ResourceServiceJava{

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfigCrm,http:HttpClient) {
    super(httpClient, appConfigCrm, 'crm', 'contact');
  }

  pushFileToStorage(input: FormData) {
    return this.http.post(`/dev/crm/contact/uploadpicture`, input).map(resp => {
        return resp;
      });


  }
}
