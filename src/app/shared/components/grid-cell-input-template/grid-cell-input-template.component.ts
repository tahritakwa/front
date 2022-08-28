import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, AbstractControl, FormControl, Validators } from '@angular/forms';
import { ActiveConstant } from '../../../constant/immobilization/active.constant';

@Component({
  selector: 'app-grid-cell-input-template',
  templateUrl: './grid-cell-input-template.component.html',
  styleUrls: ['./grid-cell-input-template.component.scss']
})
export class GridCellInputTemplateComponent implements OnInit {
  @ViewChild('input') inputOne: ElementRef;
  @Input() group: FormGroup;
  @Input() controlName: string;
  @Input() inputType: string;
  @Input() readOnly: Boolean;
  @Input() stopInputCounter: boolean;
  // @Output() setFocused = new EventEmitter();
  @Input() tabIndex = 1;
  @Input() min: number;
  @Input() max: number;
  @Input() disabled = false;
  @Input() enableQty = false;
  @Input() editCode = true;
  @Input() updatePrice : boolean;
  @Output() writeIsDone = new EventEmitter<any>();
  @Output() valueIsChanged = new EventEmitter<any>();
  @Output() inputFocusOut = new EventEmitter<any>();
  @Output() valueChange = new EventEmitter<any>();
  @Output() afterValueChanged = new EventEmitter<any>();
  @Input() isFromCategory = false;
  constructor() { }

  ngOnInit() {
    if(this.enableQty){
      this.disabled = false;
      this.FormControl.enable();
    }
    if (this.disabled) {
      this.disable();
    }
    if ( !this.editCode ) {
      this.group.get(this.controlName).disable();
    }
    if(this.updatePrice && !this.disabled){
      this.FormControl.enable();
    }
    if(this.isFromCategory){
      this.FormControl.setValidators([Validators.required, Validators.maxLength(ActiveConstant.MAX_LENGTH_CODE)]);
    }

  }
  public focusoutEvent(){
    this.inputFocusOut.emit(true);
  }
  public afterValueChangedEvent(){
    this.afterValueChanged.emit(true);
  }

  public valueChangeEvent(){
    this.valueChange.emit(true);
  }
  public onLeaveInput() {
    this.writeIsDone.emit(true);
  }
  public onValueChange() {
    this.valueIsChanged.emit(true);
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
  get FormControl(): FormControl {
    return this.group.get(this.controlName) as FormControl;
  }
  get Control(): AbstractControl {
    return this.group.controls[this.controlName];
  }

  disable() {
    this.FormControl.disable();
  }

  public selectAndFocusElement($event) {
    const inputElem = <HTMLInputElement>this.inputOne.nativeElement;
    inputElem.focus();
    inputElem.select();
    // const input = document.getElementsByName($event.target.name)[0] as any;
    // if (input) {
    //   input.focus();
    //   input.select();
    // }
  }
}
