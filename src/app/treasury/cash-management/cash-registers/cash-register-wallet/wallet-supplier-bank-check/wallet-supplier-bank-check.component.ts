import { Component, OnInit } from '@angular/core';
import { PaymentMethodEnumerator } from '../../../../../models/enumerators/payment-method.enum';
import { TiersTypeEnumerator } from '../../../../../models/enumerators/tiers-type.enum';

@Component({
  selector: 'app-wallet-supplier-bank-check',
  templateUrl: './wallet-supplier-bank-check.component.html',
  styleUrls: ['./wallet-supplier-bank-check.component.scss']
})
export class WalletSupplierBankCheckComponent implements OnInit {

  walletType = PaymentMethodEnumerator.BankCheck;
  typeTiers = TiersTypeEnumerator.Supplier;
  constructor() { }

  ngOnInit() {
  }

}
