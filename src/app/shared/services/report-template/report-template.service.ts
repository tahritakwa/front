import { Injectable, Inject } from '@angular/core';
import { ReportTemplate } from '../../../models/reporting/report-template.model';
import { ResourceService } from '../../../shared/services/resource/resource.service';
import { AppConfig } from '../../../../COM/config/app.config';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ReportTemplateService extends ResourceService<ReportTemplate> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(
      httpClient, appConfig,
      'reportTemplate', 'ReportTemplate', 'ErpSettings');
  }

}
