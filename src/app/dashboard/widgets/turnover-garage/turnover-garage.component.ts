import { Component, OnInit, ElementRef, Input, NgZone, ViewChild, AfterViewInit, ViewChildren, QueryList } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DashboardConstant } from '../../../constant/dashboard/dashboard.constant';
import { period } from '../../../constant/shared/services.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { LocalStorageService } from '../../../login/Authentification/services/local-storage-service';
import { ChartGarage } from '../../../models/dashboard/chart-garage.model';
import { changeChartSize, pieChartOption, setLabel } from '../../../shared/helpers/chart.helper';
import { DashboardService } from '../../services/dashboard.service';
import { GarageDashboardService } from '../../services/garage-dashboard/garage-dashboard.service';

@Component({
  selector: 'app-turnover-garage',
  templateUrl: './turnover-garage.component.html',
  styleUrls: ['./turnover-garage.component.scss']
})
export class TurnoverGarageComponent implements OnInit {
  @ViewChildren(DashboardConstant.TURNOVER_PER_GARAGE) chartDiv: QueryList<ElementRef>;
  @Input() dateformat: any;
  @Input() FORMAT_NUMBER: any;
  @Input() currency: any;

  turnoverPerGarageList: Array<ChartGarage>;
  turnoverPerGarageLoading: boolean;
  hasTurnoverPerGarageData: boolean;
  turnoverPerGaragePeriod: string;
  turnoverPerGarageStartDate: Date;
  turnoverPerGarageEndDate: Date;
  turnoverGarageChart;
  turnoverPerGarageData: any;
  valueApperance = false; // false : Percent | true : Value
  numberOfRows = NumberConstant.FIVE;
  isUpButtonVisible = true;
  isDownButtonVisible = true;
  echarts = require('echarts');
  periodEnum = DashboardConstant.DEFAULT_PERIOD_ENUM;
  userCurrencyCode: any;
  userCurrencySymbole: any;

  constructor(public dashService: DashboardService, public dashGarageService: GarageDashboardService, private translate: TranslateService,
    private localStorageService : LocalStorageService) {
    this.userCurrencyCode = this.localStorageService.getCurrencyCode();
    this.userCurrencySymbole = this.localStorageService.getCurrencySymbol();
  }

  ngOnInit() {
    this.ChangeTurnoverGarageChart(this.periodEnum);
  }
  // tslint:disable-next-line: use-life-cycle-interface
  ngAfterViewInit() {
    if (this.chartDiv) {
      this.chartDiv.changes.subscribe(({ first: elm }) => {
        if (elm) {
          this.turnoverGarageChart = this.echarts.init(elm.nativeElement);
          const supplierChartOption = pieChartOption(`${this.translate.instant('TURNOVER_PER_GARAGE')}`, this.turnoverPerGarageData,
            true, this.userCurrencyCode, this.userCurrencySymbole, this.valueApperance, NumberConstant.EIGHTY + '%');
          this.turnoverGarageChart.setOption(supplierChartOption);
          setLabel(this.turnoverGarageChart);
          changeChartSize(this.turnoverGarageChart);
        }
      });
    }
  }

  ChangeNumberOfRows(newNumber: number) {
    this.numberOfRows = newNumber;
    this.ChangeTurnoverGarageChart();
  }
  ChangeTurnoverGarageChart(periodEnum?: number) {
    this.clearTurnoverGarageChart();
    this.initTurnoverPerGarageChart(periodEnum);
    this.ngAfterViewInit();
  }

  clearTurnoverGarageChart() {
    this.turnoverPerGarageList = null;
    this.hasTurnoverPerGarageData = false;
  }

  changeValueApperance(newRankCriteria: boolean) {
    this.valueApperance = newRankCriteria;
    this.ChangeTurnoverGarageChart();
  }

  initTurnoverPerGarageChart(periodEnum = this.periodEnum) {
    this.turnoverPerGarageLoading = true;
    this.periodEnum = periodEnum;
    this.turnoverPerGaragePeriod = period[periodEnum];
    this.dashGarageService.getKPIFromTurnoverPerGarageStoredProcedure(this.periodEnum, NumberConstant.ZERO).subscribe((data) => {
        this.initChart(data);
      });
  }

  initChart(data) {
    this.turnoverPerGarageList = data;
    this.turnoverPerGarageData = this.getInetrventionPerGarageData(this.turnoverPerGarageList);
    if (this.turnoverPerGarageList.length > NumberConstant.ZERO) {
      this.hasTurnoverPerGarageData = true;
      this.turnoverPerGarageStartDate = this.turnoverPerGarageList[NumberConstant.ZERO].StartPeriod;
      this.turnoverPerGarageEndDate = this.turnoverPerGarageList[NumberConstant.ZERO].EndPeriod;
    } else {
      this.clearTurnoverGarageChart();
    }
    this.turnoverPerGarageLoading = false;
  }

  getInetrventionPerGarageData(listTurnoverGarage: Array<ChartGarage>): any {
    const data: Array<{ id: number, value: number, name: string }> = Array();
    listTurnoverGarage.forEach((supplier) => data.push({
      id: supplier.IdGarage,
      value: supplier.TTCAmount,
      name: supplier.GarageName
    }));
    return data;
  }
}
