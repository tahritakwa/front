import { Component, ComponentRef, OnInit, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';
import { ModalDialogInstanceService } from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import { Subject } from 'rxjs/Subject';
import { FileInfo } from '../../../models/shared/objectToSend';

@Component({
  selector: 'app-image-drawing-vehicule-for-order-intervention-pop-up',
  templateUrl: './image-drawing-vehicule-for-order-intervention-pop-up.component.html',
  styleUrls: ['./image-drawing-vehicule-for-order-intervention-pop-up.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ImageDrawingVehiculeForOrderInterventionPopUpComponent implements OnInit {
  public optionDialog: Partial<IModalDialogOptions<any>>;
  public closeDialogSubject: Subject<any>;
  imageUpdated = new FileInfo();
  constructor(private modalService: ModalDialogInstanceService, public translateService: TranslateService) { }

  /**
   * initialize dialog
   * @param reference
   * @param options
   */
  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.optionDialog = options;
    this.closeDialogSubject = options.closeDialogSubject;
  }

  ngOnInit() {
  }

  save($event) {
    this.imageUpdated = $event;
    this.optionDialog.data = this.imageUpdated;
    this.onCloseModal();
  }

  private onCloseModal(): void {
    this.optionDialog.onClose();
    this.modalService.closeAnyExistingModalDialog();
  }

  cancel() {
    this.onCloseModal();
  }
}
