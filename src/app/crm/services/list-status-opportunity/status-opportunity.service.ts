import {Injectable, Inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../../../../COM/config/app.config';
import {ResourceServiceJava} from '../../../shared/services/resource/resource.serviceJava';
import { StatusOpportunityConstant } from '../../../constant/crm/status-opportunity.constant';

@Injectable()
export class StatusOpportunityService extends ResourceServiceJava {
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfigCrm) {
    super(httpClient, appConfigCrm, 'crm', StatusOpportunityConstant.ENTITY_NAME);
  }

}

