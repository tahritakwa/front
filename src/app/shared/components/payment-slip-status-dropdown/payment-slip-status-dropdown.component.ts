import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {TreasuryConstant} from '../../../constant/treasury/treasury.constant';
import {PaymentSlipStatusEnumerator} from '../../../models/enumerators/payment-slip-status.enum';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {TranslateService} from '@ngx-translate/core';
import {FormGroup} from '@angular/forms';
import {ComboBoxComponent} from '@progress/kendo-angular-dropdowns';

@Component({
  selector: 'app-payment-slip-status-dropdown',
  templateUrl: './payment-slip-status-dropdown.component.html',
  styleUrls: ['./payment-slip-status-dropdown.component.scss']
})
export class PaymentSlipStatusDropdownComponent implements OnInit {
  @Input() form: FormGroup;
  @Output() Selected = new EventEmitter<any>();
  paymentSlipStatusEnumerator = PaymentSlipStatusEnumerator;
  paymentSlipStatusDataSource = [
    {
      Id: this.paymentSlipStatusEnumerator.Provisional,
      Value: this.translateService.instant(TreasuryConstant.PROVISIONAL)
    },
    {
      Id: this.paymentSlipStatusEnumerator.Valid,
      Value: this.translateService.instant(TreasuryConstant.VALID)
    },
    {
      Id: this.paymentSlipStatusEnumerator.PaymentSlipIssued,
      Value: this.translateService.instant(TreasuryConstant.ISSUED)
    },
    {
      Id: this.paymentSlipStatusEnumerator.PaymentSlipBankFeedBack,
      Value: this.translateService.instant(TreasuryConstant.IN_BANK)
    },
  ];

  @ViewChild(ComboBoxComponent) statusSlipComboBoxComponent: ComboBoxComponent;
  constructor(private translateService: TranslateService) {
  }

  ngOnInit() {
    this.Selected.emit();
  }

  public onchange(event): void {
    const selected = this.paymentSlipStatusDataSource.filter(status => status.Id === event.Id)[NumberConstant.ZERO].Id;
    this.Selected.emit(selected);
  }

}
