import { Component, OnInit, ComponentRef, Input } from '@angular/core';
import { IModalDialogOptions, IModalDialog } from 'ngx-modal-dialog';
import { ReportingServiceService } from '../../../services/reporting/reporting-service.service';
import { ActivatedRoute } from '@angular/router';
import { ReportViwerOptions } from '../../../../models/reporting/report-viewer-options.model';

@Component({
  selector: 'app-reporting-in-modal',
  templateUrl: './reporting-in-modal.component.html',
  styleUrls: ['./reporting-in-modal.component.scss']
})
export class ReportingInModalComponent implements OnInit {
  @Input() id: number;
  @Input() reportName: string;
  @Input() documentName: string;
  @Input() parameters: any;
  /*
   * dialog subject
   */
  dialogOptions: Partial<IModalDialogOptions<any>>;
  reportViewerOptions: ReportViwerOptions;

  constructor(private reportingService: ReportingServiceService, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.reportingService.id = this.id;
    this.reportingService.reportName = this.reportName;
    this.reportingService.documentName = this.documentName;
    if (this.reportingService.reportName.indexOf('.trdp') < 0) {
      this.reportingService.reportName = this.reportingService.reportName.concat('.trdp') || '';
    }
    this.reportingService.initReportSource(this.parameters);
    this.reportingService.initReportViewerOptions(this.parameters);
    this.reportViewerOptions = this.reportingService.reportViewerOptions;
  }

  /**
  * Inialise Modal
  * @param reference
  * @param options
  */
  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    if (options) {
      this.dialogOptions = options;
      this.id = this.dialogOptions.data.id;
      this.reportName = (this.dialogOptions.data.reportName as string).concat('.trdp') || '';
      this.documentName = this.dialogOptions.data.documentName ? this.dialogOptions.data.documentName : undefined;
      this.parameters = this.dialogOptions.data;
    }
  }


}
