import {EventEmitter, Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../../../../COM/config/app.config';
import {OpportunityConstant} from '../../../constant/crm/opportunityConstant';
import {ResourceServiceJava} from '../../../shared/services/resource/resource.serviceJava';

@Injectable()
export class FeedBackService extends ResourceServiceJava {


  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfigCrm) {
    super(httpClient, appConfigCrm, 'crm', 'feedback');
  }
}
