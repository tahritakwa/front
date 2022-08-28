import { Injectable, Inject } from '@angular/core';
import { ResourceService } from '../../../shared/services/resource/resource.service';
import { AppConfig } from '../../../../COM/config/app.config';
import { HttpClient } from '@angular/common/http';
import { JobTable } from '../../../models/ecommerce/job-table.model';

@Injectable()
export class JobTableService extends ResourceService<JobTable> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(
      httpClient, appConfig,
      'base', 'JobTable', 'Ecommerce');
  }

}
