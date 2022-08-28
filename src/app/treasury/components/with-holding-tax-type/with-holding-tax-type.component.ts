import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ComboBoxComponent } from '@progress/kendo-angular-dropdowns';
import { EnumValues } from 'enum-values';
import { WithHoldingTaxTypeEnumerator } from '../../../models/enumerators/withHoldingTax-type.enum';

@Component({
  selector: 'app-with-holding-tax-type',
  templateUrl: './with-holding-tax-type.component.html',
  styleUrls: ['./with-holding-tax-type.component.scss']
})
export class WithHoldingTaxTypeComponent implements OnInit {
  @ViewChild(ComboBoxComponent) public withHoldingTaxTypeComboBox: ComboBoxComponent;
  @Input() group: FormGroup;
  @Output() valueSelected: EventEmitter<any> = new EventEmitter<any>();
  withHoldingTaxTypeDataSource: any[] = EnumValues.getNamesAndValues(WithHoldingTaxTypeEnumerator);
  withHoldingTaxTypeFiltredDataSource: any[];
  constructor(private translateService: TranslateService) { }


  ngOnInit() {
    this.initGridDataSource();
  }

  initGridDataSource() {
    this.withHoldingTaxTypeDataSource.forEach((element) => {
      element.name = this.translateService.instant(String(element.name).toUpperCase());
    });
    this.withHoldingTaxTypeFiltredDataSource = this.withHoldingTaxTypeDataSource.slice(0);
  }

  handleFilter(value) {
    this.withHoldingTaxTypeFiltredDataSource = this.withHoldingTaxTypeDataSource.filter((s) =>
      s.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  onValueChanged($event) {
    const selectedValue = this.withHoldingTaxTypeDataSource.find(x => x.value === $event);
    this.valueSelected.emit(selectedValue);
  }

  public resetInterventionOrderStateComboBox(){
    this.withHoldingTaxTypeComboBox.reset();
    this.withHoldingTaxTypeFiltredDataSource = this.withHoldingTaxTypeDataSource.slice(0);
  }

}
