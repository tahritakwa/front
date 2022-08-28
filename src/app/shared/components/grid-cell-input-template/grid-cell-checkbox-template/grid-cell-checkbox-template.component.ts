import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-grid-cell-checkbox-template',
  templateUrl: './grid-cell-checkbox-template.component.html',
  styleUrls: ['./grid-cell-checkbox-template.component.scss']
})
export class GridCellCheckboxTemplateComponent implements OnInit {

  @Input() group: FormGroup;
  @Input() controlName: string;
  @Input() checkValue: string;

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
  get FormControl(): FormControl {
    return this.group.get(this.controlName) as FormControl;
  }
  get Control(): AbstractControl {
    return this.group.controls[this.controlName];
  }
}
