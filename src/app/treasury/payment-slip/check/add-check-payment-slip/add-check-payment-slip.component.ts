import { Component, OnInit } from '@angular/core';
import { PaymentMethodEnumerator } from '../../../../models/enumerators/payment-method.enum';

@Component({
  selector: 'app-add-check-payment-slip',
  templateUrl: './add-check-payment-slip.component.html',
  styleUrls: ['./add-check-payment-slip.component.scss']
})
export class AddCheckPaymentSlipComponent implements OnInit {

  paymentEnum = PaymentMethodEnumerator ;

  constructor() { }

  ngOnInit() {
  }

}
