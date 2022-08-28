import { Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
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
  selector: 'app-intervention-garage',
  templateUrl: './intervention-garage.component.html',
  styleUrls: ['./intervention-garage.component.scss']
})
export class InterventionGarageComponent implements OnInit {
  @ViewChildren(DashboardConstant.INTERVENTION_PER_GARAGE) chartDiv: QueryList<ElementRef>;
  @Input() dateformat: any;
  @Input() FORMAT_NUMBER: any;
  @Input() currency: any;
  @Output() hasOneGarage = new EventEmitter<any>();

  interventionPerGarageList: Array<ChartGarage>;
  interventionPerGarageLoading: boolean;
  hasInterventionPerGarageData: boolean;
  interventionPerGaragePeriod: string;
  interventionPerGarageStartDate: Date;
  interventionPerGarageEndDate: Date;
  totalInterventionGarageChart;
  interventionPerGarageData: any;
  valueApperance = true; // false : Percent | true : Value
  numberOfRows = NumberConstant.FIVE;
  isUpButtonVisible = true;
  isDownButtonVisible = true;
  echarts = require('echarts');
  periodEnum = DashboardConstant.DEFAULT_PERIOD_ENUM;
  public userCurrencyCode: any;
  public userCurrencySymbole: any;

  constructor(public dashService: DashboardService, private translate: TranslateService, public dashGarageService: GarageDashboardService,
    private localStorageService : LocalStorageService) {
    this.userCurrencyCode = this.localStorageService.getCurrencyCode();
    this.userCurrencySymbole = this.localStorageService.getCurrencySymbol();
  }

  ngOnInit() {
    this.ChangeInterventionGarageChart(this.periodEnum);
  }
  // tslint:disable-next-line: use-life-cycle-interface
  ngAfterViewInit() {
    if (this.chartDiv) {
      this.chartDiv.changes.subscribe(({ first: elm }) => {
        if (elm) {
          this.totalInterventionGarageChart = this.echarts.init(elm.nativeElement);
          const InterventionChartOption = pieChartOption(`${this.translate.instant('TOTAL_TURNOVER_PER_GARAGE')}`,
            this.interventionPerGarageData, false, this.userCurrencyCode, this.userCurrencySymbole, this.valueApperance, NumberConstant.EIGHTY + '%');
          this.totalInterventionGarageChart.setOption(InterventionChartOption);
          setLabel(this.totalInterventionGarageChart);
          changeChartSize(this.totalInterventionGarageChart);
        }
      });
    }
  }

  ChangeNumberOfRows(newNumber: number) {
    this.numberOfRows = newNumber;
    this.ChangeInterventionGarageChart();
  }
  ChangeInterventionGarageChart(periodEnum?: number) {
    this.clearInterventionGarageChart();
    this.initTurnoverPerGarageChart(periodEnum);
    this.ngAfterViewInit();
  }

  clearInterventionGarageChart() {
    this.interventionPerGarageList = null;
    this.hasInterventionPerGarageData = false;
  }

  changeValueApperance(newRankCriteria: boolean) {
    this.valueApperance = newRankCriteria;
    this.ChangeInterventionGarageChart();
  }

  initTurnoverPerGarageChart(periodEnum = this.periodEnum) {
    this.interventionPerGarageLoading = true;
    this.periodEnum = periodEnum;
    this.interventionPerGaragePeriod = period[periodEnum];
    this.dashGarageService.getKPIFromTotalInterventionPerGarageStoredProcedure(this.periodEnum).subscribe((data) => {
        if (data) {
          this.hasOneGarage.emit(data[NumberConstant.ZERO].HasOneGarage);
        }
        this.initChart(data);
      });
  }

  initChart(data) {
    this.interventionPerGarageList = data;
    this.interventionPerGarageData = this.getTotalInterventionPerGarageData(this.interventionPerGarageList);
    if (this.interventionPerGarageList.length > NumberConstant.ZERO) {
      this.hasInterventionPerGarageData = true;
      this.interventionPerGarageStartDate = this.interventionPerGarageList[NumberConstant.ZERO].StartPeriod;
      this.interventionPerGarageEndDate = this.interventionPerGarageList[NumberConstant.ZERO].EndPeriod;
    } else {
      this.clearInterventionGarageChart();
    }
    this.interventionPerGarageLoading = false;
  }

  getTotalInterventionPerGarageData(listInterventionGarage: Array<ChartGarage>): any {
    const data: Array<{ id: number, value: number, name: string }> = Array();
    listInterventionGarage.forEach((intervention) => data.push({
      id: intervention.IdGarage,
      value: intervention.TotalIntervention,
      name: intervention.GarageName
    }));
    return data;
  }
}


