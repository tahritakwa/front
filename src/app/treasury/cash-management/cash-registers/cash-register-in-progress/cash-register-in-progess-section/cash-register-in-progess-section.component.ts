import { Component, OnInit } from '@angular/core';
import { InProgressDataSet } from '../data';

@Component({
  selector: 'app-cash-register-in-progess-section',
  templateUrl: './cash-register-in-progess-section.component.html',
  styleUrls: ['./cash-register-in-progess-section.component.scss']
})
export class CashRegisterInProgessSectionComponent implements OnInit {
  // data
  salesCashRegisters = InProgressDataSet.salesCashRegisters;
  purchaseCashRegisters = InProgressDataSet.purchaseCashRegisters;
  // UI properties
  hiddenExpenseCratesAmount = false;
  hiddenRecipeCratesAmount = false;
  // filter
  selectedDate = new Date();

  constructor() { }

  ngOnInit() {
  }

}
