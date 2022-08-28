import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { PaymentType } from '../../../models/payment/payement-type.model';
import { PaymentTypeService } from '../../../payment/services/payment-type/payment-type.service';
import { DropDownComponent } from '../../interfaces/drop-down-component.interface';
import { OrderBy, OrderByDirection, PredicateFormat } from '../../utils/predicate';
@Component({
  selector: 'app-payment-type-dropdown',
  templateUrl: './payment-type-dropdown.component.html',
  styleUrls: ['./payment-type-dropdown.component.scss']
})
export class PaymentTypeDropdownComponent implements OnInit, DropDownComponent {
  @Input() allowCustom;
  @Input() group: FormGroup;
  @Output() Selected = new EventEmitter<number>();
  @Output() SelectedItem = new EventEmitter<PaymentType>();
  @Input() showAddButton: boolean;
  @Input() selectedPaymentType;
  @Input() disabled: boolean;
  @Input() isValidated: boolean;

  public paymentTypeDataSource: PaymentType[];
  public paymentTypeFilterdDataSource: PaymentType[];
  public predicate: PredicateFormat;

  constructor(private paymentTypeService: PaymentTypeService) { }

  ngOnInit() {
    this.initDataSource();
  }

  initDataSource(): void {
    this.preparePredicate();
    this.paymentTypeService.listdropdownWithPerdicate(this.predicate).subscribe((data: any) => {
      this.paymentTypeDataSource = data.listData;
      this.paymentTypeFilterdDataSource = this.paymentTypeDataSource.slice(0);
      if(this.isValidated) {
        const item = this.paymentTypeDataSource.filter(x => x.Label === 'Espèce')[0];
        this.valueChange(item.Id);
      }
    });
  }
  public preparePredicate() {
    this.predicate = new PredicateFormat();
    this.predicate.OrderBy = new Array<OrderBy>();
    this.predicate.OrderBy.push(new OrderBy(SharedConstant.LABEL, OrderByDirection.asc));
  }
  /**
   * filter by label
   * @param value
   */
  handleFilter(value: string): void {
    this.paymentTypeFilterdDataSource = this.paymentTypeDataSource.filter((s) =>
      s.Label.toLowerCase().includes(value.toLowerCase()));
  }
  addNew(): void {
    throw new Error('Method not implemented.');
  }
  public valueChange($event): void {
    this.Selected.emit($event);
    const item = this.paymentTypeFilterdDataSource.filter(x => x.Id === $event)[0];
    this.SelectedItem.emit(item);
  }
}
