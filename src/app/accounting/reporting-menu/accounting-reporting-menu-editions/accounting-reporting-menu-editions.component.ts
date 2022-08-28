import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-accounting-reporting-menu-editions',
  templateUrl: './accounting-reporting-menu-editions.component.html',
  styleUrls: ['./accounting-reporting-menu-editions.component.scss']
})
export class AccountingReportingMenuEditionsComponent implements OnInit {

  @Input() currentFiscalYearId:any;
  constructor() { }

  ngOnInit() {
  }

}
