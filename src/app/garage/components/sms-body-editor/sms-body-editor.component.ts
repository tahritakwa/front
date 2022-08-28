import { Component, ComponentRef, OnInit } from '@angular/core';
import { IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';
import { ModalDialogInstanceService } from 'ngx-modal-dialog/src/modal-dialog-instance.service';

@Component({
  selector: 'app-sms-body-editor',
  templateUrl: './sms-body-editor.component.html',
  styleUrls: ['./sms-body-editor.component.scss']
})
export class SmsBodyEditorComponent implements OnInit {

  options: Partial<IModalDialogOptions<any>>;
  smsBody: any;
  constructor(private modalService: ModalDialogInstanceService) { }

  ngOnInit() {
  }

  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.options = options;
    this.smsBody = this.options.data.body;
  }

}
