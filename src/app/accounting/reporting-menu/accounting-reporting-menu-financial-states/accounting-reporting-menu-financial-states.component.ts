import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-accounting-reporting-menu-financial-states',
  templateUrl: './accounting-reporting-menu-financial-states.component.html',
  styleUrls: ['./accounting-reporting-menu-financial-states.component.scss']
})
export class AccountingReportingMenuFinancialStatesComponent implements OnInit {

  @Input() currentFiscalYearId;
  @Input() fiscalYears;
  constructor() { }

  ngOnInit() {
  }

}
