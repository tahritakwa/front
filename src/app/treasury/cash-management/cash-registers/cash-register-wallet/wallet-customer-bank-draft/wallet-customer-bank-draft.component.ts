import { Component, OnInit } from '@angular/core';
import { PaymentMethodEnumerator } from '../../../../../models/enumerators/payment-method.enum';
import { TiersTypeEnumerator } from '../../../../../models/enumerators/tiers-type.enum';

@Component({
  selector: 'app-wallet-customer-bank-draft',
  templateUrl: './wallet-customer-bank-draft.component.html',
  styleUrls: ['./wallet-customer-bank-draft.component.scss']
})
export class WalletCustomerBankDraftComponent implements OnInit {

  walletType = PaymentMethodEnumerator.DraftBank;
  typeTiers = TiersTypeEnumerator.Customer;

  constructor() { }

  ngOnInit() {
  }

}
