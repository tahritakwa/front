import {Component, ElementRef, Input, OnInit, QueryList, SimpleChanges, ViewChildren} from '@angular/core';
import {Absenteeism} from '../../../models/dashboard/absenteeismm.model';
import {DashboardConstant} from '../../../constant/dashboard/dashboard.constant';
import {DashboardService} from '../../services/dashboard.service';
import {TranslateService} from '@ngx-translate/core';
import {period} from '../../../constant/shared/services.constant';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {
  changeChartSize,
  setLabel,
  treeChart
} from '../../../shared/helpers/chart.helper';
import {DayOffPerFamilyType} from '../../../models/dashboard/chart-day-off-per-family-type.model';
import {HrDashboardService} from '../../services/hr-dashboard/hr-dashboard.service';

@Component({
  selector: 'app-day-off-per-family-type',
  templateUrl: './day-off-per-family-type.component.html',
  styleUrls: ['./day-off-per-family-type.component.scss']
})
export class DayOffPerFamilyTypeComponent implements OnInit {

  @ViewChildren(DashboardConstant.DAY_OFF_PER_FAMILY_CHART) chartDiv: QueryList<ElementRef>;

  @Input() dateFormat: string;
  @Input() seniorityRange: string[];
  @Input() ageRange: string[];
  @Input() gender: string[];
  @Input() office: string[];
  @Input() teamName: string[];
  @Input() contract: string[];

  dayOffList: Array<Absenteeism>;
  dataLoading: boolean;
  dayOffPeriod: string;
  startDate: Date;
  endDate: Date;
  dayOffChart;
  echarts = require('echarts');

  periodEnum = DashboardConstant.DEFAULT_PERIOD_ENUM;
  dayOffData: any;
  hasDayOffData: boolean;
  private isFirstChange = true;


  constructor(public dashService: HrDashboardService, private translate: TranslateService) {
  }

  ngOnInit() {
    this.changeChart(this.periodEnum);
  }

  changeChart(periodEnum?: number) {
    this.clearCharts();
    this.initDayOffChart(periodEnum);
    this.ngAfterViewInit();
  }

  private clearCharts() {
    this.dayOffList = null;
    this.hasDayOffData = false;
  }

  private initDayOffChart(periodEnum = this.periodEnum) {
    this.dataLoading = true;
    this.periodEnum = periodEnum;
    this.dayOffPeriod = period[periodEnum];
    this.dashService.getKPIFromDayOffPerFamilyTypeStoredProcedure(periodEnum, this.gender, this.teamName, this.ageRange,
      this.seniorityRange, this.contract, this.office).subscribe((data) => {
      this.initChart(data);
    });
  }

  private initChart(data: any) {
    this.dayOffList = data;
    this.dayOffData = this.getDayOffData(this.dayOffList, `${this.translate.instant(DashboardConstant.DAY_OFF)}`);
    if (this.dayOffList.length > NumberConstant.ZERO) {
      this.hasDayOffData = true;
      this.startDate = this.dayOffList[NumberConstant.ZERO].StartPeriod;
      this.endDate = this.dayOffList[NumberConstant.ZERO].EndPeriod;
    } else {
      this.clearDayOffCharts();
    }
    this.dataLoading = false;
  }

  private getDayOffData(dayOffList: Absenteeism[], label: string): any {
    let data: DayOffPerFamilyType;
    const dataByFamily = this.groupByKey(dayOffList, DashboardConstant.FAMILY_DAY_OFF);
    const keys = Object.keys(dataByFamily);
    const lvl1: DayOffPerFamilyType[] = Array();
    keys.forEach(k => lvl1.push({
      name: dataByFamily[k].length === NumberConstant.ONE ? k + '(' + dataByFamily[k][NumberConstant.ZERO].TypeDayOff + ')' : k,
      value: dataByFamily[k].reduce((sum, current) => sum + current.TotalDayOff, NumberConstant.ZERO),
      children: dataByFamily[k].length === NumberConstant.ONE ? null : this.getChildren(dataByFamily[k])
    }));
    data = {
      value: dayOffList.reduce((sum, current) => sum + current.TotalDayOff, NumberConstant.ZERO),
      name: label,
      children: lvl1
    };

    return data;
  }

  private getChildren(list: Absenteeism[]): DayOffPerFamilyType[] {
    const dataByType = this.groupByKey(list, DashboardConstant.TYPE_DAY_OFF);
    const keys = Object.keys(dataByType);
    const lvl2: DayOffPerFamilyType[] = Array();
    keys.forEach(k => lvl2.push({
      name: k,
      value: dataByType[k].reduce((sum, current) => sum + current.TotalDayOff, NumberConstant.ZERO),
      children: null
    }));
    return lvl2;
  }

  private clearDayOffCharts() {
    this.dayOffList = null;
    this.hasDayOffData = false;
  }

  // tslint:disable-next-line: use-life-cycle-interface
  ngAfterViewInit() {
    if (this.chartDiv) {
      this.chartDiv.changes.subscribe(({first: elm}) => {
        if (elm) {
          this.dayOffChart = this.echarts.init(elm.nativeElement);
          const dayOffChartOption = treeChart(this.dayOffData);
          this.dayOffChart.setOption(dayOffChartOption);
          setLabel(this.dayOffChart);
          changeChartSize(this.dayOffChart);
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

  groupByKey(array, key) {
    return array
      .reduce((hash, obj) => {
        if (obj[key] === undefined) {
          return hash;
        }
        return Object.assign(hash, {[obj[key]]: (hash[obj[key]] || []).concat(obj)});
      }, {});
  }

}
