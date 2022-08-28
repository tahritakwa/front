import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Active } from '../../../models/immobilization/active.model';
import { AppConfig } from '../../../../COM/config/app.config';
import { ResourceService } from '../../../shared/services/resource/resource.service';

@Injectable()
export class ActiveService extends ResourceService<Active> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig, 'active', 'Active', 'Immobilisation');
  }
}
