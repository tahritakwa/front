import { Component, OnInit } from '@angular/core';
import { CashSettlementType } from '../../../../models/enumerators/cash-managment-hierarchy-test-data.enum';

@Component({
  selector: 'app-close-fund-transfert-voucher-list',
  templateUrl: './close-fund-transfert-voucher-list.component.html',
  styleUrls: ['./close-fund-transfert-voucher-list.component.scss']
})
export class CloseFundTransfertVoucherListComponent implements OnInit {
  cashSettlementType = CashSettlementType;

  constructor() { }

  ngOnInit() {
  }

}
