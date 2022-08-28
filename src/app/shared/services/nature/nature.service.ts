import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { Nature } from '../../../models/administration/nature.model';
import { ResourceService } from '../resource/resource.service';
import { AppConfig } from '../../../../COM/config/app.config';

@Injectable()
export class NatureService extends ResourceService<Nature> {
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig, 'nature', 'Nature', 'Inventory');
  }
}
