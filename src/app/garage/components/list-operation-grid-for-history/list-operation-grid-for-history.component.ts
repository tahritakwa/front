import { Component, Input, OnInit } from '@angular/core';
import { PagerSettings } from '@progress/kendo-angular-grid';
import { DataResult, process, State } from '@progress/kendo-data-query';
import { GarageConstant } from '../../../constant/garage/garage.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { Currency } from '../../../models/administration/currency.model';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';

@Component({
  selector: 'app-list-operation-grid-for-history',
  templateUrl: './list-operation-grid-for-history.component.html',
  styleUrls: ['./list-operation-grid-for-history.component.scss']
})
export class ListOperationGridForHistoryComponent implements OnInit {
  @Input() currency: Currency;
  @Input() idIntervention: number;

  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;

  gridState: State;
  gridData: DataResult;
  operationList: any[];

  columnsConfig: ColumnSettings[] = [
    {
      field: GarageConstant.OPERATION_NAME,
      title: GarageConstant.OPERATION,
      filterable: true,
    },
    {
      field: GarageConstant.PIECE_NAME,
      title: GarageConstant.PIECE_TITLE,
      filterable: true,
    },
    {
      field: GarageConstant.REFERENCE_NAME,
      title: GarageConstant.REFERENCE_TITLE,
      filterable: true,
    },
    {
      field: GarageConstant.GARAGE_NAME,
      title: GarageConstant.GARAGE,
      filterable: true,
    },
    {
      field: GarageConstant.POSTE_NAME,
      title: GarageConstant.POST,
      filterable: true,
    },
    {
      field: GarageConstant.RESPONSIBLE_NAME,
      title: GarageConstant.RESPONSIBLE_TITLE,
      filterable: true,
    },
    {
      field: GarageConstant.HT_PRICE,
      title: GarageConstant.HT_AMOUNT_TITLE,
      filterable: true,
    },
    {
      field: GarageConstant.TTC_PRICE,
      title: GarageConstant.TTC_AMOUNT_TITLE,
      filterable: true,
    }
  ];

  constructor() { }

  ngOnInit() {
    this.initialiseState();
    this.initGridDataSource();
  }

  initGridDataSource() {
    const list: any[] = JSON.parse(localStorage.getItem(GarageConstant.PLANNED_OPERATION_LIST));
    this.operationList = list ? list.filter(x => x.IdInterventionOrder === this.idIntervention) : [];
    this.gridData = process(this.operationList, this.gridState);
  }

  initialiseState() {
    this.gridState = {
      skip: 0,
      take: NumberConstant.TEN,
      filter: {
        logic: 'and',
        filters: []
      }
    };
  }
  dataStateChange($event: State) {
    this.gridState = $event;
    this.initGridDataSource();
  }
}
