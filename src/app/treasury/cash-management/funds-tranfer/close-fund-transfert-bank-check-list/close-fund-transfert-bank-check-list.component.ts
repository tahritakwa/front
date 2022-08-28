import { Component, OnInit } from '@angular/core';
import { CashSettlementType } from '../../../../models/enumerators/cash-managment-hierarchy-test-data.enum';

@Component({
  selector: 'app-close-fund-transfert-bank-check-list',
  templateUrl: './close-fund-transfert-bank-check-list.component.html',
  styleUrls: ['./close-fund-transfert-bank-check-list.component.scss']
})
export class CloseFundTransfertBankCheckListComponent implements OnInit {
  cashSettlementType = CashSettlementType;
  constructor() { }

  ngOnInit() {
  }

}
