import { Component, OnInit, ComponentRef } from '@angular/core';
import { IModalDialogOptions, IModalDialog } from 'ngx-modal-dialog';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { Attendance } from '../../../models/payroll/attendance.model';
import { ContractStateEnumerator } from '../../../models/enumerators/contractStateEnumerator.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-attendance-informations',
  templateUrl: './attendance-informations.component.html',
  styleUrls: ['./attendance-informations.component.scss']
})
export class AttendanceInformationsComponent implements OnInit {

  dialogOptions: Partial<IModalDialogOptions<any>>;
  dateFormat = this.translate.instant(SharedConstant.DATE_FORMAT);
  attendance: any;
  contractState = ContractStateEnumerator;
  constructor(private translate: TranslateService) { }

  ngOnInit() {
  }
  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.dialogOptions = options;
    if (this.dialogOptions.data) {
      this.attendance = this.dialogOptions.data;
    }
  }
}
