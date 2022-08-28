import { Component, ComponentRef, EventEmitter, OnInit, Output } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { IModalDialog, IModalDialogOptions } from "ngx-modal-dialog";
import { ModalDialogInstanceService } from "ngx-modal-dialog/src/modal-dialog-instance.service";
import { BankAccountConstant } from "../../../../constant/Administration/bank-account.constant";

@Component({
    selector: 'app-edit-agency',
    templateUrl: './edit-agency.component.html',
    styleUrls: ['./edit-agency.component.scss']
  })
  
  export class EditAgencyComponent implements OnInit {
    @Output() labelToSend = new EventEmitter();
    dialogOptions: Partial<IModalDialogOptions<any>>;
    public label : string;
    public Id : number;
    public formGroup : FormGroup;
    
    constructor(private fb: FormBuilder, private modalService: ModalDialogInstanceService,) { }

    ngOnInit() {
        this.formGroup = this.fb.group({
            Label: [''],
            Id : ['']
        });
    }

    dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
        this.dialogOptions = options;
        if (this.dialogOptions.data) {
            this.label = this.dialogOptions.data.Label;
            this.Id = this.dialogOptions.data.Id;
        }
    }

    editBankLabel(){
      this.dialogOptions.data.Label = this.formGroup.controls[BankAccountConstant.LABEL].value;
      this.dialogOptions.data.Id = this.Id;
      this.dialogOptions.onClose();
      this.modalService.closeAnyExistingModalDialog();
    }
  }