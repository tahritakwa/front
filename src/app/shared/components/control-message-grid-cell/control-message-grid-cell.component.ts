import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
import {GammeConstant} from '../../../constant/manufuctoring/gamme.constant';

@Component({
  selector: 'app-control-message-grid-cell',
  templateUrl: './control-message-grid-cell.component.html',
  styleUrls: ['./control-message-grid-cell.component.scss']
})
export class ControlMessageGridCellComponent implements OnInit {

  @Input() group: FormGroup;
  @Input() source: string;
  @Input() controlName: string;
  @Input() anchor: any;
  public entityNameSource = GammeConstant.ENTITY_NAME;
  constructor() { }

  ngOnInit() {
  }
  get touched(): boolean {
    return this.FormControl.touched;
  }
  get dirty(): boolean {
    return this.FormControl.dirty;
  }
  get valid() {
    return this.FormControl.valid;
  }
  get errors() {
    return this.FormControl.errors;
  }
  get FormControl(): FormControl {
    return this.group.get(this.controlName) as FormControl;
  }
  get Control(): AbstractControl {
    return this.group.controls[this.controlName];
  }
}
