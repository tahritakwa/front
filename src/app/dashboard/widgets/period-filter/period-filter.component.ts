import { DashboardConstant } from './../../../constant/dashboard/dashboard.constant';
import {Component, OnInit, Output, EventEmitter, Input} from '@angular/core';

@Component({
  selector: 'app-period-filter',
  templateUrl: './period-filter.component.html',
  styleUrls: ['./period-filter.component.scss']
})
export class PeriodFilterComponent implements OnInit {

  @Input() showCurrentMonth = true;
  @Input() showLastMonth = true;
  @Input() showLastSixMonths = true;
  @Input() showCurrentYear = true;
  @Input() showLastYear = true;
  @Input() periodEnum = DashboardConstant.DEFAULT_PERIOD_ENUM;
  @Output() newItemEvent = new EventEmitter<number>();
  constructor() { }

  ngOnInit() {
  }

  changePeriod(period: number) {
    this.periodEnum = period;
    this.newItemEvent.emit(period);
  }

}
