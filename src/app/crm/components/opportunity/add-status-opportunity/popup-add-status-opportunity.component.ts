import {Component, ComponentRef, OnInit} from '@angular/core';
import {IModalDialog, IModalDialogOptions} from 'ngx-modal-dialog';
import {ModalDialogInstanceService} from 'ngx-modal-dialog/src/modal-dialog-instance.service';

@Component({
    selector: 'app-popup-add-status-opportunity',
    templateUrl: './popup-add-status-opportunity.component.html',
    styleUrls: ['./popup-add-status-opportunity.component.scss']
})
export class PopupAddStatusOpportunityComponent implements OnInit, IModalDialog {
    public optionDialog: Partial<IModalDialogOptions<any>>;
    constructor( private modalService: ModalDialogInstanceService) { }


    dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
        this.optionDialog = options;
    }

    ngOnInit() {
    }

}
