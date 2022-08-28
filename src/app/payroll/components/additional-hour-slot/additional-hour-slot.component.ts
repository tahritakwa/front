import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {AdditionalHourConstant} from '../../../constant/payroll/additional-hour.constant';

@Component({
  selector: 'app-additional-hour-slot',
  templateUrl: './additional-hour-slot.component.html',
  styleUrls: ['./additional-hour-slot.component.scss']
})
export class AdditionalHourSlotComponent implements OnInit {
  @Input() slotFormGroup: FormGroup;

  constructor() {
  }

  get StartTime(): FormControl {
    return this.slotFormGroup.get(AdditionalHourConstant.START_TIME) as FormControl;
  }

  get EndTime(): FormControl {
    return this.slotFormGroup.get(AdditionalHourConstant.END_TIME) as FormControl;
  }

  ngOnInit() {
  }
}
