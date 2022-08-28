import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ItemConstant } from '../../../constant/inventory/item.constant';

@Component({
  selector: 'app-oem-item',
  templateUrl: './oem-item.component.html',
  styleUrls: ['./oem-item.component.scss']
})
export class OemItemComponent implements OnInit {

  @Input() oemItemForm: FormGroup;
  @Input() isEnabled;

  constructor() { }

  ngOnInit() {
  }

  get Brand(): FormControl {
    return this.oemItemForm.get(ItemConstant.BRAND_COLUMN) as FormControl;
  }

  get OemNumber(): FormControl {
    return this.oemItemForm.get(ItemConstant.OEM_NUMBER) as FormControl;
  }

}
