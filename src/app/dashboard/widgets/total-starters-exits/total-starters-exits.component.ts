import {Component, ElementRef, Input, OnInit, QueryList, SimpleChanges, ViewChildren} from '@angular/core';
import {DashboardConstant} from '../../../constant/dashboard/dashboard.constant';
import {Candidacy} from '../../../models/dashboard/candidacy.model';
import {FormBuilder} from '@angular/forms';
import {HrDashboardService} from '../../services/hr-dashboard/hr-dashboard.service';
import {TranslateService} from '@ngx-translate/core';
import {period} from '../../../constant/shared/services.constant';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {changeChartSize, setLabel, startersExitsBarChartOption, InitLabels} from '../../../shared/helpers/chart.helper';
import {LocalStorageService} from '../../../login/Authentification/services/local-storage-service';

@Component({
  selector: 'app-total-starters-exits',
  templateUrl: './total-starters-exits.component.html',
  styleUrls: ['./total-starters-exits.component.scss']
})
export class TotalStartersExitsComponent implements OnInit {

  @ViewChildren(DashboardConstant.TOTAL_STARTERS_EXITS) chartDiv: QueryList<ElementRef>;

  @Input() dateFormat: string;
  @Input() seniorityRange: string[];
  @Input() ageRange: string[];
  @Input() gender: string[];
  @Input() office: string[];
  @Input() teamName: string[];
  @Input() contract: string[];

  totalStartersExitsList: Array<Candidacy>;
  dataLoading: boolean;
  totalStartersExitsPeriod: string;
  startDate: Date;
  endDate: Date;
  totalStartersExitsChart;
  echarts = require('echarts');

  periodEnum = DashboardConstant.CURRENT_YEAR_PERIOD_ENUM;
  totalStartersExitsData: any;
  hasTotalStartersExitsData: boolean;
  labels: any;
  private isFirstChange = true;

  constructor(public dashService: HrDashboardService, private localStorageService: LocalStorageService) {
  }

  ngOnInit() {
    this.changeChart(this.periodEnum);
  }

  changeChart(periodEnum?: number) {
    this.clearCharts();
    this.initTotalStartersExitsChart(periodEnum);
    this.ngAfterViewInit();
  }

  private clearCharts() {
    this.totalStartersExitsList = null;
    this.hasTotalStartersExitsData = false;
  }

  private initTotalStartersExitsChart(periodEnum = this.periodEnum) {
    this.dataLoading = true;
    this.labels = InitLabels(this.localStorageService.getLanguage());
    this.periodEnum = periodEnum;
    this.totalStartersExitsPeriod = period[periodEnum];
    this.dashService.getKPIFromTotalStartersExitsStoredProcedure(periodEnum, this.gender, this.teamName, this.ageRange, this.seniorityRange,
      this.contract, this.office)
      .subscribe((data) => {
        this.initChart(data);
      });

  }

  private initChart(data: any) {
    this.totalStartersExitsList = data;
    this.totalStartersExitsData = this.getTotalStartersExitsData(this.totalStartersExitsList);
    if (this.totalStartersExitsList.length > NumberConstant.ZERO) {
      this.hasTotalStartersExitsData = true;
      this.startDate = this.totalStartersExitsList[NumberConstant.ZERO].StartPeriod;
      this.endDate = this.totalStartersExitsList[NumberConstant.ZERO].EndPeriod;
    } else {
      this.clearTotalStartersExitsCharts();
    }
    this.dataLoading = false;
  }

  private getTotalStartersExitsData(totalStartersExitsList: Candidacy[]): any {
    const starters = [];
    const exits = [];
    const months = [];
    if (totalStartersExitsList.length) {
      this.verifyAllListFields(starters, exits, months);
    }
    totalStartersExitsList.forEach((x) => {
      if (x.Label === 'Hiring') {
        starters[(x.Month - NumberConstant.ONE)] += x.TotalNumber;
      } else {
        exits[(x.Month - NumberConstant.ONE)] += x.TotalNumber;
      }
    });

    const dataGlobal = {
      ['starters']: starters,
      ['exits']: exits,
      ['month']: months,
    };
    return dataGlobal;
  }

  private verifyAllListFields(starters: number[], exits: number[], months: number[]) {
    for (let index = new Date(this.totalStartersExitsList[NumberConstant.ZERO].StartPeriod).getMonth();
         index <= new Date(this.totalStartersExitsList[NumberConstant.ZERO].EndPeriod).getMonth(); index++) {
      starters[index] = NumberConstant.ZERO;
      exits[index] = NumberConstant.ZERO;
      months[index] = index;
    }
  }

  private clearTotalStartersExitsCharts() {
    this.totalStartersExitsList = null;
    this.hasTotalStartersExitsData = false;
  }

  // tslint:disable-next-line: use-life-cycle-interface
  ngAfterViewInit() {
    if (this.chartDiv) {
      this.chartDiv.changes.subscribe(({first: elm}) => {
        if (elm) {
          this.totalStartersExitsChart = this.echarts.init(elm.nativeElement);
          const totalStartersExitsChartOption = startersExitsBarChartOption(this.totalStartersExitsData, this.labels.starters_exits_labels,
            this.localStorageService.getLanguage());
          this.totalStartersExitsChart.setOption(totalStartersExitsChartOption);
          setLabel(this.totalStartersExitsChart);
          changeChartSize(this.totalStartersExitsChart);
        }
      });
    }
  }


  // tslint:disable-next-line:use-life-cycle-interface
  ngOnChanges(changes: SimpleChanges): void {
    if (this.isFirstChange) {
      this.isFirstChange = false;
    } else {
      this.changeChart(this.periodEnum);
    }
  }
}
