import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReportingServiceService } from '../../../services/reporting/reporting-service.service';
import { ReportViwerOptions } from '../../../../models/reporting/report-viewer-options.model';
const ID = 'id';
const REPORT_NAME = 'reportname';
@Component({
  selector: 'app-reporting-in-url',
  templateUrl: './reporting-in-url.component.html',
  styleUrls: ['./reporting-in-url.component.scss']
})
export class ReportingInUrlComponent implements OnInit {
  id: number;
  reportName: string;
  documentName: string;
  reportViewerOptions: ReportViwerOptions;
  constructor(private reportingService: ReportingServiceService, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.subscribe(params => {
      this.id = +params[ID] || 0;
      this.reportName = (params[REPORT_NAME] as string).concat('.trdp') || '';
    });
  }

  ngOnInit() {
    this.reportingService.id = this.id;
    this.reportingService.reportName = this.reportName;
    this.reportingService.documentName = this.documentName ? this.documentName : undefined;
    this.reportingService.initReportSource();
    this.reportingService.initReportViewerOptions();
    this.reportViewerOptions = this.reportingService.reportViewerOptions;
  }



}
