import { Component, OnInit } from '@angular/core';
import { PaymentMethodEnumerator } from '../../../../../models/enumerators/payment-method.enum';
import { TiersTypeEnumerator } from '../../../../../models/enumerators/tiers-type.enum';

@Component({
  selector: 'app-wallet-customer-bank-check',
  templateUrl: './wallet-customer-bank-check.component.html',
  styleUrls: ['./wallet-customer-bank-check.component.scss']
})
export class WalletCustomerBankCheckComponent implements OnInit {

  walletType = PaymentMethodEnumerator.BankCheck;
  typeTiers = TiersTypeEnumerator.Customer;
  constructor() { }

  ngOnInit() {
  }

}
