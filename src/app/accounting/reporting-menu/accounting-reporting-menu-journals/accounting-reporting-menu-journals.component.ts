import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-accounting-reporting-menu-journals',
  templateUrl: './accounting-reporting-menu-journals.component.html',
  styleUrls: ['./accounting-reporting-menu-journals.component.scss']
})
export class AccountingReportingMenuJournalsComponent implements OnInit {

  @Input() currentFiscalYearId:any;
  constructor() { }

  ngOnInit() {
  }

}
