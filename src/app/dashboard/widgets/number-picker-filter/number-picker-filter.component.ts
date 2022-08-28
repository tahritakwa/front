import { Component, OnInit, Input, Output, EventEmitter, ElementRef, Renderer2 } from '@angular/core';
import { NumberConstant } from '../../../constant/utility/number.constant';

@Component({
  selector: 'app-number-picker-filter',
  templateUrl: './number-picker-filter.component.html',
  styleUrls: ['./number-picker-filter.component.scss']
})
export class NumberPickerFilterComponent implements OnInit {

  @Input() numberOfRows: number;
  @Input() isDownButtonVisible: boolean;
  @Input() isUpButtonVisible: boolean;
  @Output() newItemEvent = new EventEmitter<number>();

  constructor() { }

  ngOnInit() {
  }

  onValueChange(event) {
    if (this.numberOfRows === NumberConstant.THREE) {
      this.isDownButtonVisible = false;
      this.isUpButtonVisible = true;
    } else if (this.numberOfRows === NumberConstant.TEN) {
      this.isUpButtonVisible = false;
      this.isDownButtonVisible = true;
    } else {
      this.isUpButtonVisible = true;
      this.isDownButtonVisible = true;
    }
    if (this.numberOfRows > NumberConstant.TEN) {
      this.numberOfRows = NumberConstant.TEN;
    }
    this.newItemEvent.emit(this.numberOfRows);
  }

  onPickUpStarted(event) {
    if (!this.isDownButtonVisible) {
      this.isDownButtonVisible = true;
    }
  }

  onPickUpStoped(event) {
    if (this.numberOfRows < NumberConstant.THREE) {
      this.numberOfRows = NumberConstant.THREE;
    }
  }

  onPickDownStoped(event) {
    if (!this.isUpButtonVisible) {
      this.isUpButtonVisible = true;
    }
    if (this.numberOfRows > NumberConstant.TEN) {
      this.numberOfRows = NumberConstant.TEN;
    }
  }

}
