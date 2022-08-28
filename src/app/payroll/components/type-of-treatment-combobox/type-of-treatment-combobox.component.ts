import {Component, Input, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {FormControl, FormGroup} from '@angular/forms';
import {PayslipConstant} from '../../../constant/payroll/payslip.constant';

@Component({
  selector: 'app-type-of-treatment-combobox',
  templateUrl: './type-of-treatment-combobox.component.html',
  styleUrls: ['./type-of-treatment-combobox.component.scss']
})
export class TypeOfTreatmentComboboxComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() allowCustom;
  public selectedItem;
  // Status List
  public type = [{'Id': 1, 'Name': 'MONTHLY'}];

  constructor(public translate: TranslateService) {
    this.type.forEach(obj => {
      translate.get(obj.Name).subscribe(tr => obj.Name = tr);
    });
  }

  get IdBonusType(): FormControl {
    return this.form.get(PayslipConstant.TYPE_OF_TREATMET) as FormControl;
  }

  ngOnInit() {
  }

}
