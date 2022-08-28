import { Component, ComponentRef, OnInit } from '@angular/core';
import { IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';
import { Subject } from 'rxjs/Subject';
import { OperationKit } from '../../../models/garage/operation-kit.model';

@Component({
  selector: 'app-operation-kit-selected',
  templateUrl: './operation-kit-selected.component.html',
  styleUrls: ['./operation-kit-selected.component.scss']
})
export class OperationKitSelectedComponent implements OnInit {

  dialogOptions: Partial<IModalDialogOptions<any>>;
  public closeDialogSubject: Subject<any>;
  operationsKit: Array<OperationKit>;
  constructor() { }

  ngOnInit() {
  }

  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.dialogOptions = options;
    this.closeDialogSubject = options.closeDialogSubject;
    this.operationsKit = this.dialogOptions.data;
  }

}
