import { Component, OnInit } from '@angular/core';
import { CashSettlementType } from '../../../../models/enumerators/cash-managment-hierarchy-test-data.enum';
 
@Component({
  selector: 'app-close-fund-transfert-cash-list',
  templateUrl: './close-fund-transfert-cash-list.component.html',
  styleUrls: ['./close-fund-transfert-cash-list.component.scss']
})
export class CloseFundTransfertCashListComponent implements OnInit {

  cashSettlementType = CashSettlementType;
  constructor() { }

  ngOnInit() {
  }

}
