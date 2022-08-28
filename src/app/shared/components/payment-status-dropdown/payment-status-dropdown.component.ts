import {Component, OnInit, Output, EventEmitter, Input, ViewChild} from '@angular/core';
import { EnumValues } from 'enum-values';
import { PaymentStatusEnumerator } from '../../../models/enumerators/payment-status.enum';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {ComboBoxComponent} from '@progress/kendo-angular-dropdowns';

@Component({
  selector: 'app-payment-status-dropdown',
  templateUrl: './payment-status-dropdown.component.html',
  styleUrls: ['./payment-status-dropdown.component.scss']
})
export class PaymentStatusDropdownComponent implements OnInit {

  @Input() group: FormGroup;
  @Output() selectedValue = new EventEmitter<number>();
  paymentStatusDataSource = EnumValues.getNamesAndValues(PaymentStatusEnumerator);
  paymentStatusDataSourceFilter = [];
  @ViewChild(ComboBoxComponent) statusComboBoxComponent: ComboBoxComponent;

  constructor(private translateService: TranslateService) { }

  ngOnInit() {
    this.initGridDataSource();
  }

  initGridDataSource() {
    this.paymentStatusDataSource.forEach(element => {
      const elem = element;
      elem.name = this.translateService.instant(elem.name.toUpperCase());
      this.paymentStatusDataSourceFilter.push(elem);
    });
  }

  handleFilter(value) {
    this.paymentStatusDataSourceFilter = this.paymentStatusDataSource.filter((s) =>
      this.translateService.instant(s.name.toUpperCase()).indexOf(value.toLowerCase()) !== -1
    );
  }

  onValueChanged($event) {
    this.selectedValue.emit($event);
  }
}
