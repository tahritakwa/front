import { Injectable } from '@angular/core';
import { AppConfig } from '../../../../COM/config/app.config';
import { ReportViwerOptions } from '../../../models/reporting/report-viewer-options.model';
const API_CONFIG = 'root_api';
const REPORTING_END_POINT = '/webreports/';

@Injectable()
export class ReportingServiceService {
  id: number;
  reportName: string;
  documentName: string;
  public reportViewerOptions: ReportViwerOptions;
  constructor(private appConfig: AppConfig) {

  }
  public initReportViewerOptions(parameters?: any): void {
    this.reportViewerOptions = {
      id: 'StarkReportApp',
      scale: '1.0' ,
      scaleMode: 'SPECIFIC',
      viewMode: 'PRINT_PREVIEW',
      reportSource: this.initReportSource(parameters),
      serviceUrl: this.serviceUrl,
      containerStyle: {
        position: 'relative',
        width: '100%',
        height: '800px',
        ['font-family']: 'ms sans serif'
      }
    } as ReportViwerOptions;

    //
  }
  get serviceUrl(): string {
    return window.location.origin.concat(this.appConfig.getConfig(API_CONFIG)).concat(REPORTING_END_POINT);
  }
  public initReportSource(parameters?: any): any {
    if (parameters) {
      parameters['Version'] = '2.0';
      return {
        parameters: parameters,
        report: this.stringifyReport(),
      };
    } else {
      return {
        parameters: { Id: this.id, Version: '2.0' },
        report: this.stringifyReport(),
      };
    }
  }
  private stringifyReport(): string {
    const reportSettingsObject: any = {
      ReportName: this.reportName,
      DocumentName: this.documentName
    };
    return JSON.stringify(reportSettingsObject);
  }
}
