import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AppConfig } from '../../../COM/config/app.config';
import { InterventionOperation } from '../../models/garage/intervention-operation.model';
import { ResourceServiceGarage } from '../../shared/services/resource/ressource.service.garage';

@Injectable()
export class InterventionOperationService extends ResourceServiceGarage<InterventionOperation> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig, 'base', 'Intervention');
  }
}
