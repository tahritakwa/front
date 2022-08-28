import { Component, ComponentRef, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { IModalDialog, IModalDialogOptions } from "ngx-modal-dialog";
import { SharedConstant } from "../../../constant/shared/shared.constant";
import { OfMPDisponibility } from "../../../models/manufacturing/ofMPDisponibility.model";




@Component({
  selector: 'app-modal-fabrication-arrangement',
  templateUrl: './modal-fabrication-arrangement.component.html',
  styleUrls: ['./modal-fabrication-arrangement.component.scss']
})
// tslint:disable-next-line:component-class-suffix
export class ModalFabricationArrangement implements OnInit {
  @Input() ofProductLineList: any[] = [];
  /**
  * Form Group
  */
  public mpOfsDispo: OfMPDisponibility[] = [];
  public idNomenclatureOnUpdate: number;
  public ModelFormGroup: FormGroup;
  isModal = false;
  dialogOptions: Partial<IModalDialogOptions<any>>;
  data: any;
  idOperation: number;
  public allChildrenProduct: any[] = [];
  constructor() { }



  ngOnInit(): void {
    this.initGridDataSource();
  }

  initGridDataSource() {
    this.mpOfsDispo = this.dialogOptions.data[0] ;
  }


  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.isModal = true;
    this.dialogOptions = options;
    this.data = this.dialogOptions.data;
    this.idOperation = this.data;
  }

  emptyForm(formGroup: FormGroup) {
    formGroup.patchValue({
      article: '',
    });
  }
  createTaskForm() {
    this.ModelFormGroup = new FormGroup({
      article: new FormControl('', Validators.required)
    });
  }


  absoluteValue(value): number {
    return Math.abs(value);
  }
}
