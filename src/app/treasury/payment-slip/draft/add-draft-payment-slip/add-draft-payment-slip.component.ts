import { Component, OnInit } from '@angular/core';
import { PaymentMethodEnumerator } from '../../../../models/enumerators/payment-method.enum';
@Component({
  selector: 'app-add-draft-payment-slip',
  templateUrl: './add-draft-payment-slip.component.html',
  styleUrls: ['./add-draft-payment-slip.component.scss']
})
export class AddDraftPaymentSlipComponent implements OnInit {

  paymentEnum = PaymentMethodEnumerator ;

  constructor() { }

  ngOnInit() {
  }

}
