import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AppConfig } from '../../../../COM/config/app.config';
import { OperationKitOperation } from '../../../models/garage/operation-kit-operation.model';
import { ResourceServiceGarage } from '../../../shared/services/resource/ressource.service.garage';

@Injectable()
export class OperationKitOperationService extends ResourceServiceGarage<OperationKitOperation> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig, 'operationKitOperation', 'OperationKitOperation');
  }
}
