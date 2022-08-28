import {ComboBoxComponent} from '@progress/kendo-angular-dropdowns';

import {Component, OnInit, Input, ViewChild} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup } from '@angular/forms';
const TYPE_COMBOBOX = 'type';

@Component({
  selector: 'app-taxe-type',
  templateUrl: './taxe-type.component.html',
  styleUrls: ['./taxe-type.component.scss']
})
export class TaxeTypeComponent implements OnInit {
  @Input() allowCustom;
  @Input() form: FormGroup;

  @ViewChild(TYPE_COMBOBOX) public typeComboBox: ComboBoxComponent;
  @Input() taxFormGroupAccounting: FormGroup;

  // Status List
  public taxe = [{ 'id': 1, 'name': 'TVA' }, { 'id': 2, 'name': 'BASEHT' }];
  constructor(public translate: TranslateService) {
    this.taxe.forEach(obj => {

      translate.get(obj.name).subscribe(tr => obj.name = tr);
    });
  }

  onSelectTaxeType(value){
    this.taxFormGroupAccounting.controls['taxSalesAccount'].setValue('');
    this.taxFormGroupAccounting.controls['taxPurchasesAccount'].setValue('');
    this.taxFormGroupAccounting.controls['fodecSalesAccount'].setValue('');
    this.taxFormGroupAccounting.controls['fodecPurchasesAccount'].setValue('');
    this.form.controls['TaxeType'].setValue(value);
    if(value === 1){
      this.taxFormGroupAccounting.controls['taxSalesAccount'].enable();
      this.taxFormGroupAccounting.controls['taxPurchasesAccount'].enable();
      this.taxFormGroupAccounting.controls['fodecSalesAccount'].disable();
      this.taxFormGroupAccounting.controls['fodecPurchasesAccount'].disable();
    } else {
      this.taxFormGroupAccounting.controls['taxSalesAccount'].disable();
      this.taxFormGroupAccounting.controls['taxPurchasesAccount'].disable();
      this.taxFormGroupAccounting.controls['fodecSalesAccount'].enable();
      this.taxFormGroupAccounting.controls['fodecPurchasesAccount'].enable();
    }
  }

  ngOnInit() {
  }

  public openComboBox() {
    this.typeComboBox.toggle(true);
  }
}
