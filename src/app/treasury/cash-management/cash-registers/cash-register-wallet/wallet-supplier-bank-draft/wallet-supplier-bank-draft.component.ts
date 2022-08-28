import { Component, OnInit } from '@angular/core';
import { PaymentMethodEnumerator } from '../../../../../models/enumerators/payment-method.enum';
import { TiersTypeEnumerator } from '../../../../../models/enumerators/tiers-type.enum';

@Component({
  selector: 'app-wallet-supplier-bank-draft',
  templateUrl: './wallet-supplier-bank-draft.component.html',
  styleUrls: ['./wallet-supplier-bank-draft.component.scss']
})
export class WalletSupplierBankDraftComponent implements OnInit {

  walletType = PaymentMethodEnumerator.DraftBank;
  typeTiers = TiersTypeEnumerator.Supplier;

  constructor() { }

  ngOnInit() {
  }

}
