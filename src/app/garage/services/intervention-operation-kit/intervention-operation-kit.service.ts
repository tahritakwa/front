import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AppConfig } from '../../../../COM/config/app.config';
import { InterventionOperationKit } from '../../../models/garage/intervention-operation-kit.model';
import { ResourceServiceGarage } from '../../../shared/services/resource/ressource.service.garage';

@Injectable()
export class InterventionOperationKitService extends ResourceServiceGarage<InterventionOperationKit> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig, 'base', 'InterventionOperationKit');
  }
}
