import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AppConfig } from '../../../../COM/config/app.config';
import { SmsTiers } from '../../../models/garage/sms-tiers.model';
import { ResourceServiceGarage } from '../../../shared/services/resource/ressource.service.garage';

@Injectable()
export class SmsTiersService extends ResourceServiceGarage<SmsTiers> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig, 'smsTiers', 'SmsTiers');
  }

}
