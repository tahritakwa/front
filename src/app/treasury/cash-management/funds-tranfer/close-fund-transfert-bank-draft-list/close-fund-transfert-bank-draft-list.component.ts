import { Component, OnInit } from '@angular/core';
import { CashSettlementType } from '../../../../models/enumerators/cash-managment-hierarchy-test-data.enum';

@Component({
  selector: 'app-close-fund-transfert-bank-draft-list',
  templateUrl: './close-fund-transfert-bank-draft-list.component.html',
  styleUrls: ['./close-fund-transfert-bank-draft-list.component.scss']
})
export class CloseFundTransfertBankDraftListComponent implements OnInit {
  cashSettlementType = CashSettlementType;

  constructor() { }

  ngOnInit() {
  }

}
