import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ComboBoxComponent } from '@progress/kendo-angular-dropdowns';
import { SalesPrice } from '../../../models/sales/sales-price.model';
import { SalesPriceService } from '../../../sales/services/sales-price/sales-price.service';

@Component({
  selector: 'app-sales-price-dropdown',
  templateUrl: './sales-price-dropdown.component.html',
  styleUrls: ['./sales-price-dropdown.component.scss']
})
export class SalesPriceDropdownComponent implements OnInit {


  @Input() selectedValue;
  @Input() formGroup: FormGroup;
  @Output() selected = new EventEmitter<boolean>();
  @Output() selectedSalesPrice = new EventEmitter<any>();
  @ViewChild('salesPriceComboBox') public salesPriceComboBox: ComboBoxComponent;
  public salesPriceDataSource: SalesPrice[];
  public salesPriceFiltredDataSource: SalesPrice[];

  constructor(private salesPriceService: SalesPriceService) {
  }

  ngOnInit() {
    this.initDataSource();
  }


  public onSelect($event): void {
    this.selected.emit($event);
    if($event){
    const selectedSalesPrice: SalesPrice = this.salesPriceDataSource.find(x => x.Id === $event.Id);
    this.selectedSalesPrice.emit(selectedSalesPrice);
    }
  }

  initDataSource(): void {
    this.salesPriceService.listdropdown().subscribe((data: any) => {
      this.salesPriceDataSource = data.listData;
      this.salesPriceFiltredDataSource = this.salesPriceDataSource.slice(0);
    });
  }
  /**
   * filter by code and label
   * @param value
   */
  handleFilter(value: string): void {
    this.salesPriceFiltredDataSource = this.salesPriceDataSource.filter((s) =>
      s.Code.toLowerCase().includes(value.toLowerCase())
      || s.Label.toLowerCase().includes(value.toLowerCase()));
  }
  public openComboBox() {
    this.salesPriceComboBox.toggle(true);
  }

}
