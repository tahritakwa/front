import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ConfirmationModalSettings } from '../confirmation-modal-settings.model';
import { settings } from 'cluster';
import { SharedConstant } from '../../../constant/shared/shared.constant';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent implements OnInit {
  @ViewChild('myModal') public myModal: ModalDirective;
  @Output() confirmation = new EventEmitter<any>();
  @Input () settings: ConfirmationModalSettings;

  constructor() { }

  ngOnInit() {
    if (this.settings === undefined) {
      this.settings = new ConfirmationModalSettings(SharedConstant.EMPTY,
        SharedConstant.EMPTY,
        SharedConstant.EMPTY,
        SharedConstant.YES,
        SharedConstant.NO);
    }
  }

  public showModal() {
    this.myModal.show();
  }

  public hideModal() {
    this.myModal.hide();
  }
  public confirm() {
    this.confirmation.emit(this.settings.Action);
  }

}
