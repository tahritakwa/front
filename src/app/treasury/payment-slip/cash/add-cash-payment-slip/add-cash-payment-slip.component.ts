import { Component, OnInit } from '@angular/core';
import { PaymentMethodEnumerator } from '../../../../models/enumerators/payment-method.enum';

@Component({
  selector: 'app-add-cash-payment-slip',
  templateUrl: './add-cash-payment-slip.component.html',
  styleUrls: ['./add-cash-payment-slip.component.scss']
})
export class AddCashPaymentSlipComponent implements OnInit {

  paymentEnum = PaymentMethodEnumerator ;

  constructor() { }

  ngOnInit() {
  }

}
