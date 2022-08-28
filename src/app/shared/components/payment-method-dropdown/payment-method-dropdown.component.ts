import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Currency } from '../../../models/administration/currency.model';
import { CurrencyService } from '../../../administration/services/currency/currency.service';
import { ReducedCurrency } from '../../../models/administration/reduced-currency.model';


@Component({
  selector: 'app-payment-method-dropdown',
  templateUrl: './payment-method-dropdown.component.html',
  styleUrls: ['./payment-method-dropdown.component.scss']
})
export class PaymentMethodDropdownComponent implements OnInit {
  @Input() allowCustom;
  @Input() group: FormGroup;
  @Output() Selected = new EventEmitter<boolean>();
  // Currency List
  private currencyDataSource: ReducedCurrency[];
  public currencyFiltredDataSource: ReducedCurrency[];
  constructor(private currencyService: CurrencyService) {
  }
  ngOnInit() {
    this.initDataSource();
  }
  public onSelect(event): void {
    this.Selected.emit(event);
  }
  initDataSource(): void {
    this.currencyService.listdropdown().subscribe((data: any) => {
      this.currencyDataSource = data.listData;
      this.currencyFiltredDataSource = this.currencyDataSource.slice(0);
    });
  }
}
