import {Inject, Injectable} from '@angular/core';
import {ResourceServiceJava} from '../../../shared/services/resource/resource.serviceJava';
import {AppConfig} from '../../../../COM/config/app.config';
import {NoteConstant} from '../../../constant/crm/note.constant';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class NoteService extends ResourceServiceJava {
  constructor(private httpClient: HttpClient, @Inject(AppConfig) appConfigCrm) {
    super(httpClient, appConfigCrm, NoteConstant.MODULE_NAME, NoteConstant.CRM_URL);
  }
}
