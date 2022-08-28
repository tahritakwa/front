import { Component, OnInit } from '@angular/core';
import { GarageConstant } from '../../../constant/garage/garage.constant';
import { HistoryIntervention } from '../../../constant/garage/history-intervention';

@Component({
  selector: 'app-history-for-order-intervention',
  templateUrl: './history-for-order-intervention.component.html',
  styleUrls: ['./history-for-order-intervention.component.scss']
})
export class HistoryForOrderInterventionComponent implements OnInit {
  historyInterventionList = [];
  constructor() {
    this.historyInterventionList = HistoryIntervention.interventionsHistoryList;
  }

  ngOnInit() {
  }

}
