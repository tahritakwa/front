import { Component, ComponentRef, OnInit } from '@angular/core';
import { IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';
import { ModalDialogInstanceService } from 'ngx-modal-dialog/src/modal-dialog-instance.service';

@Component({
  selector: 'app-intervention-operation-editor',
  templateUrl: './intervention-operation-editor.component.html',
  styleUrls: ['./intervention-operation-editor.component.scss']
})
export class InterventionOperationEditorComponent implements OnInit {
  options: Partial<IModalDialogOptions<any>>;
  description: any;
  constructor(private modalService: ModalDialogInstanceService) { }

  ngOnInit() {
  }

  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.options = options;
    this.description = this.options.data.description;
  }

  saveEvent() {
    this.options.data.description = this.description;
    this.options.onClose();
    this.modalService.closeAnyExistingModalDialog();
  }

}
