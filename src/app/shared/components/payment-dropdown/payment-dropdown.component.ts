import { Component, OnInit, Input, ViewContainerRef, Output, EventEmitter, ViewChild} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PaymentMethod } from '../../../models/payment-method/payment-method.model';
import { DropDownComponent } from '../../interfaces/drop-down-component.interface';
import { PaymentModeService } from '../../../payment/services/payment-method/payment-mode.service';
import { FormModalDialogService } from '../../services/dialog/form-modal-dialog/form-modal-dialog.service';
import { DataTransferService } from '../../../payment/services/payment-method/data-transfer.service';
import { ReducedPaymentMethod } from '../../../models/payment-method/reduced-payment-method.model';
import { ComboBoxComponent } from '@progress/kendo-angular-dropdowns';

@Component({
  selector: 'app-payment-dropdown',
  templateUrl: './payment-dropdown.component.html',
  styleUrls: ['./payment-dropdown.component.scss']
})
export class PaymentDropdownComponent implements OnInit, DropDownComponent {

  @ViewChild(ComboBoxComponent) public paymentDropdownComponentComboBox: ComboBoxComponent;
  @Input() group: FormGroup;
  @Input() hideAddBtn: boolean;

  @Output() modalOpen = new EventEmitter<boolean>();
  @Input() allowCustom;
  @Output() selectedValue = new EventEmitter<any>();

  public paymentMethodDataSource: ReducedPaymentMethod[];
  public paymentMethodFiltredDataSource: ReducedPaymentMethod[];
  constructor(private paymentMethodService: PaymentModeService,
    private formModalDialogService: FormModalDialogService,
    private viewRef: ViewContainerRef, private dataTransferService: DataTransferService) { }

  ngOnInit() {
    this.initDataSource();
  }
  initDataSource(): void {
    this.paymentMethodService.listdropdown(true).subscribe((data: any) => {
      this.paymentMethodDataSource = data.listData;
      this.paymentMethodFiltredDataSource = this.paymentMethodDataSource.slice(0);
    });
  }
  /**
   * filter by code and description
   * @param value
   */
  handleFilter(value: string): void {
    this.paymentMethodFiltredDataSource = this.paymentMethodDataSource.filter((s) =>
      s.Code.toLowerCase().includes(value.toLowerCase())
      || s.MethodName.toLocaleLowerCase().includes(value.toLowerCase()));
  }
  addNew() {
      this.modalOpen.emit(true);
  }

  open() {
    if (this.dataTransferService.getStateStateModal()) {
      this.ngOnInit();
      this.dataTransferService.setStateStateModal(false);
    }
  }
  onSelect($event) {
    this.selectedValue.emit(this.paymentMethodDataSource.find(x => x.Id === $event));
  }
}
