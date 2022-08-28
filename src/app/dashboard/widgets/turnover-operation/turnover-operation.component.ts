import { AfterViewInit, Component, ElementRef, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Chart } from 'chart.js';
import * as ChartDataLabels from 'chartjs-plugin-datalabels';
import { DashboardConstant } from '../../../constant/dashboard/dashboard.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { LocalStorageService } from '../../../login/Authentification/services/local-storage-service';
import { changeChartSize, pieChartOption, setLabel } from '../../../shared/helpers/chart.helper';
import { Colorset } from '../../Colorset';
import { GarageDashboardService } from '../../services/garage-dashboard/garage-dashboard.service';

@Component({
  selector: 'app-turnover-operation',
  templateUrl: './turnover-operation.component.html',
  styleUrls: ['./turnover-operation.component.scss']
})
export class TurnoverOperationComponent implements OnInit {
  @ViewChildren('turnoverOperation') chartDiv: QueryList<ElementRef>;
  @Input() dateformat: any;
  @Input() FORMAT_NUMBER: any;
  @Input() currency: any;
  periodEnum = DashboardConstant.DEFAULT_PERIOD_ENUM;
  turnoverPerOperationByMonthStartDate: Date;
  turnocerPerOperationByMonthEndDate: Date;
  turnoverPerOperationList: Array<any>;
  turnoverPerOperationLoading: boolean;
  hasTurnoverPerOperationData: boolean;
  totalTurnoverPerOperationChart;
  valueApperance = true; // false : Percent | true : Value
  echarts = require('echarts');
  turnoverPerOperationData: any;
  userCurrencyCode: any;
  userCurrencySymbole: any;
  constructor(public dashGarageService: GarageDashboardService, public translate: TranslateService, private localStorageService : LocalStorageService) { }

  ngOnInit() {
    this.ChangeTurnoverOperationChart();
    this.userCurrencyCode = this.localStorageService.getCurrencyCode();
    this.userCurrencySymbole = this.localStorageService.getCurrencySymbol();
  }
  ChangeTurnoverOperationChart(periodEnum = this.periodEnum) {
    this.clearTurnoverOperationChart();
    this.initTurnoverPerOperationChart(periodEnum);
    this.ngAfterViewInit();
  }

  initTurnoverPerOperationChart(periodEnum?: number) {
    this.turnoverPerOperationLoading = true;
    this.periodEnum = periodEnum;
    this.dashGarageService.getKPIFromTurnoverPerOperationStoredProcedure(this.periodEnum, NumberConstant.ZERO).subscribe((data) => {
        this.initChart(data);
      });
  }

  // tslint:disable-next-line: use-life-cycle-interface
  ngAfterViewInit() {
    if (this.chartDiv) {
      this.chartDiv.changes.subscribe(({ first: elm }) => {
        if (elm) {
          this.totalTurnoverPerOperationChart = this.echarts.init(elm.nativeElement);
          const InterventionChartOption = pieChartOption(`${this.translate.instant('TURNOVER_PER_OPERATION')}`,
            this.turnoverPerOperationData, true, this.userCurrencyCode, this.userCurrencySymbole, this.valueApperance,  ['40%', '70%']);
          this.totalTurnoverPerOperationChart.setOption(InterventionChartOption);
          setLabel(this.totalTurnoverPerOperationChart);
          changeChartSize(this.totalTurnoverPerOperationChart);
        }
      });
    }
  }

  initChart(data) {
    this.turnoverPerOperationList = data;

    if (this.turnoverPerOperationList.length > NumberConstant.ZERO) {
      this.hasTurnoverPerOperationData = true;
      this.turnoverPerOperationData = this.getTurnoverOperationData(this.turnoverPerOperationList);
      this.turnoverPerOperationByMonthStartDate = data[NumberConstant.ZERO].StartPeriod;
      this.turnocerPerOperationByMonthEndDate = data[NumberConstant.ZERO].EndPeriod;
      if (this.turnoverPerOperationList.length > NumberConstant.THREE) {
        const operation = this.turnoverPerOperationData[this.turnoverPerOperationList.length - NumberConstant.ONE].OperationName;
        this.turnoverPerOperationData[this.turnoverPerOperationList.length - NumberConstant.ONE].OperationName =
          this.translate.instant('OTHERS');
      }
    } else {
      this.clearTurnoverOperationChart();
    }
    this.turnoverPerOperationLoading = false;
  }

  getTurnoverOperationData(turnoverPerOperationList: Array<any>): any {
    const data: Array<{ id: number, value: number, name: string }> = Array();
    turnoverPerOperationList.forEach((operation) => data.push({
      id: operation.IdOperation,
      value: operation.TTCAmount ,
      name: operation.OperationName,
    }));
    return data;
  }

  clearTurnoverOperationChart() {
    this.turnoverPerOperationList = null;
    this.hasTurnoverPerOperationData = false;
  }


}
