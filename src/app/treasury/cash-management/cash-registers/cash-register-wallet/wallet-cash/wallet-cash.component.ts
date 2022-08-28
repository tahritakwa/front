import { Component, OnInit } from '@angular/core';
import { PaymentMethodEnumerator } from '../../../../../models/enumerators/payment-method.enum';

@Component({
  selector: 'app-wallet-cash',
  templateUrl: './wallet-cash.component.html',
  styleUrls: ['./wallet-cash.component.scss']
})
export class WalletCashComponent implements OnInit {

  walletType = PaymentMethodEnumerator.DraftBank;

  constructor() { }

  ngOnInit() {
  }

}
