import { Component, OnInit, ViewChild } from '@angular/core';
import { PaymentMethodEnumerator } from '../../../../models/enumerators/payment-method.enum';
import { FormGroup } from '@angular/forms';
import { ListPaymentSlipComponent } from '../../../components/list-payment-Slip/list-payment-slip.component';

@Component({
  selector: 'app-list-cash-payment-slip',
  templateUrl: './list-cash-payment-slip.component.html',
  styleUrls: ['./list-cash-payment-slip.component.scss']
})
export class ListCashPaymentSlipComponent implements OnInit {

  @ViewChild(ListPaymentSlipComponent) childListPaymentSlip;
  paymentEnum = PaymentMethodEnumerator ;
  constructor() { }

  ngOnInit() {
  }

  public setSearchData(searchFormGroup: FormGroup) {
    this.childListPaymentSlip.setSearchData(searchFormGroup);
  }

}
