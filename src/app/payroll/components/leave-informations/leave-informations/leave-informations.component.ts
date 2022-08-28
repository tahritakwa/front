import { Component, OnInit, ComponentRef } from '@angular/core';
import { IModalDialogOptions, IModalDialog } from 'ngx-modal-dialog';
import { Leave } from '../../../../models/payroll/leave.model';
import { SharedConstant } from '../../../../constant/shared/shared.constant';
import { LeaveService } from '../../../services/leave/leave.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-leave-informations',
  templateUrl: './leave-informations.component.html',
  styleUrls: ['./leave-informations.component.scss']
})
export class LeaveInformationsComponent implements OnInit {

  public isModal = false;
  dialogOptions: Partial<IModalDialogOptions<any>>;
  leave: Leave;
  dateFormat = this.translate.instant(SharedConstant.DATE_FORMAT);


  constructor(public leaveService: LeaveService, private translate: TranslateService) { }

  ngOnInit() {
  }

  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.dialogOptions = options;
    this.isModal = true;
    if (this.dialogOptions.data) {
      this.leave = this.dialogOptions.data;
    }
  }
}
