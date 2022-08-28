import { Component, OnInit, ComponentRef, Input } from '@angular/core';
import { IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';
import { ColorPickerService } from 'ngx-color-picker';
import { DashboardService } from '../services/dashboard.service';
import { ModalDialogInstanceService } from 'ngx-modal-dialog/src/modal-dialog-instance.service';

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss']
})
export class ColorPickerComponent implements OnInit {


  public isUpdateMode: boolean;
  /*
   * If modal=true
   */
  public isModal: boolean;
  /*
   * dialog subject
   */
  dialogOptions: Partial<IModalDialogOptions<any>>;
  /*
   * Data input of the modal
   */
  public data: any;

  confirmed = false;

  public arrayColors: any = {
    color1: '#2883e9',
    color2: '#e920e9',
    color3: 'rgb(255,245,0)',
    color4: 'rgb(236,64,64)',
    color5: 'rgba(45,208,45,1)'
  };

  public selectedColor = 'color1';
  public color1: '#2889e9';
  public color2: '#e920e9';
  public color3: '#fff500';
  public color4: 'rgb(236,64,64)';
  public color5: 'rgba(45,208,45,1)';


  constructor(private cpService: ColorPickerService, public dashService: DashboardService,
    public modalService: ModalDialogInstanceService) { }

    SetColor(colorindex: number) {
      this.dashService.SetColor(colorindex);
      this.dashService.refreshwidgets();
    }
  ngOnInit() {
  }

  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.isModal = true;
    this.dialogOptions = options;
    this.data = this.dialogOptions.data;
    if (this.data) {
      this.isUpdateMode = true;
    } else {
      this.isUpdateMode = false;
    }
  }


  onChangeColors(color) {
    this.selectedColor = color;
  }
  confirm() {
    this.dashService.setCostumeColor(this.arrayColors);
    this.confirmed = true;
    this.data = this.arrayColors;
    this.dashService.setCostumeColor(this.arrayColors);
    this.SetColor(-1);
    this.modalService.closeAnyExistingModalDialog();
  }
}
