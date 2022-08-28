import { Component, OnInit, Input } from '@angular/core';
import { ColumnSettings } from '../../../../../shared/utils/column-settings.interface';
import { CashRegisterConstant } from '../../../../../constant/treasury/cash-register.constant';

@Component({
  selector: 'app-grid-for-in-progess-section',
  templateUrl: './grid-for-in-progess-section.component.html',
  styleUrls: ['./grid-for-in-progess-section.component.scss']
})
export class GridForInProgessSectionComponent implements OnInit {
  @Input() data: any;
  public gridData = [];
  public columnsConfig: ColumnSettings[] = [
    {
      field: CashRegisterConstant.CODE,
      title: CashRegisterConstant.CASH_REGISTER_CODE,
      filterable: true
    },
    {
      field: CashRegisterConstant.NAME,
      title: CashRegisterConstant.CASH_REGISTER_NAME,
      filterable: true
    },
    {
      field: CashRegisterConstant.OPENING_BALANCE,
      title: CashRegisterConstant.OPENING_BALANCE_TITLE,
      filterable: true
    },
    {
      field: CashRegisterConstant.REAL_BALANCE,
      title: CashRegisterConstant.CASH_REGISTER_CURRENT_BALANCE,
      filterable: true
    },
    {
      field: CashRegisterConstant.CLOSING_BALANCE,
      title: CashRegisterConstant.CLOSING_BALANCE_TITLE,
      filterable: true
    },
    {
      field: CashRegisterConstant.STATE,
      title: CashRegisterConstant.STATUS_TITLE,
      filterable: true
    }
    ];

  constructor() { }

  ngOnInit() {
    this.gridData = this.data;
  }

}
