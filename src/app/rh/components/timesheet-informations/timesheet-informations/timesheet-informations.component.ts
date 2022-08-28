import {Component, ComponentRef, OnInit} from '@angular/core';
import {IModalDialog, IModalDialogOptions} from 'ngx-modal-dialog';
import {TimeSheet} from '../../../../models/rh/timesheet.model';

@Component({
  selector: 'app-timesheet-informations',
  templateUrl: './timesheet-informations.component.html',
  styleUrls: ['./timesheet-informations.component.scss']
})
export class TimesheetInformationsComponent implements OnInit {

  public isModal = false;
  dialogOptions: Partial<IModalDialogOptions<any>>;
  timesheet: TimeSheet;

  constructor() {
  }

  ngOnInit() {
  }

  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.dialogOptions = options;
    this.isModal = true;
    if (this.dialogOptions.data) {
      this.timesheet = this.dialogOptions.data;
    }
  }
}
