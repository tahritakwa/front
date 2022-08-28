import { Component, OnInit } from '@angular/core';
import { TiersTypeEnumerator } from '../../../models/enumerators/tiers-type.enum';

@Component({
  selector: 'app-customer-payment-slip',
  templateUrl: './customer-payment-slip.component.html',
  styleUrls: ['./customer-payment-slip.component.scss']
})
export class CustomerPaymentSlipComponent implements OnInit {
  tiersTypeEnum = TiersTypeEnumerator;
  constructor() { }

  ngOnInit() {
  }

}
