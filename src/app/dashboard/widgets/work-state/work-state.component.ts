import {Component, ElementRef, Input, OnInit, QueryList, ViewChildren} from '@angular/core';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {DashboardConstant} from '../../../constant/dashboard/dashboard.constant';
import {period} from '../../../constant/shared/services.constant';
import {changeChartSize, setLabel, totalWorkDaysAndDaysOffPieChartOption} from '../../../shared/helpers/chart.helper';
import {TranslateService} from '@ngx-translate/core';
import {Absenteeism} from '../../../models/dashboard/absenteeismm.model';
import {HrDashboardService} from '../../services/hr-dashboard/hr-dashboard.service';


@Component({
  selector: 'app-work-state',
  templateUrl: './work-state.component.html',
  styleUrls: ['./work-state.component.scss']
})
export class WorkStateComponent implements OnInit {

  @ViewChildren(DashboardConstant.WORK_STATE_CHART) chartDiv: QueryList<ElementRef>;

  @Input() dateFormat: string;
  @Input() seniorityRange: string[];
  @Input() ageRange: string[];
  @Input() gender: string[];
  @Input() office: string[];
  @Input() teamName: string[];
  @Input() contract: string[];

  workStateList: Array<Absenteeism>;
  dataLoading: boolean;
  workStatePeriod: string;
  startDate: Date;
  endDate: Date;
  workStateChart;
  periodEnum = DashboardConstant.DEFAULT_PERIOD_ENUM;
  workStateData: any;
  hasWorkStateData: boolean;

  echarts = require('echarts');
  employeeList = [];
  employeeFilter = null;
  isNewEmployeeList = true;
  clearEmployeeNameFilter = false;
  private isFirstChange = true;

  constructor(public dashService: HrDashboardService, private translate: TranslateService) {
  }

  ngOnInit() {
    this.changeChart(this.periodEnum);
  }

  changeChart(periodEnum?: number) {
    this.clearCharts();
    this.initWorkStateChart(periodEnum);
    this.ngAfterViewInit();
  }

  private clearCharts() {
    this.workStateList = null;
    this.hasWorkStateData = false;
  }

  private initWorkStateChart(periodEnum = this.periodEnum) {
    this.dataLoading = true;
    this.periodEnum = periodEnum;
    this.workStatePeriod = period[periodEnum];
    this.dashService.getKPIFromWorkStateStoredProcedure(periodEnum, this.gender, this.teamName, this.ageRange, this.seniorityRange,
      this.contract, this.office, this.employeeFilter)
      .subscribe((data) => {
        this.initChart(data);
      });
  }

  private initChart(data: any) {
    this.workStateList = data;
    this.employeeList = this.isNewEmployeeList ? [] : this.employeeList;
    this.workStateData = this.getWorkStateData(this.workStateList);
    if (this.workStateList.length > NumberConstant.ZERO) {
      this.hasWorkStateData = true;
      this.startDate = this.workStateList[NumberConstant.ZERO].StartPeriod;
      this.endDate = this.workStateList[NumberConstant.ZERO].EndPeriod;
    } else {
      this.clearWorkStateCharts();
    }
    this.dataLoading = false;
  }

  private getWorkStateData(workStateList: Absenteeism[]): any {
    const data: Array<{ value: number, name: string, selected: boolean }> = Array();
    data.push(({
      value: 0,
      name: DashboardConstant.TOTAL_DAYS_NOT_WORK,
      selected: false
    }));

    data.push(({
      value: 0,
      name: DashboardConstant.TOTAL_DAYS_WORK,
      selected: false
    }));

    workStateList.forEach((x) => {
      if (x.Label === DashboardConstant.TOTAL_WORKS_DAYS) {
        data[NumberConstant.ONE].value += x.TotalWorkDays;
      } else {
        data[NumberConstant.ZERO].value += x.TotalDayOff;
      }
      if (this.isNewEmployeeList) {
        this.employeeList.push(x.NameEmployee);
      }
    });

    data[NumberConstant.ZERO].selected = data[NumberConstant.ZERO].value >= data[NumberConstant.ONE].value;
    data[NumberConstant.ONE].selected = !data[NumberConstant.ZERO].selected;

    return data;
  }

  private clearWorkStateCharts() {
    this.workStateList = null;
    this.hasWorkStateData = false;
  }

  // tslint:disable-next-line: use-life-cycle-interface
  ngAfterViewInit() {
    if (this.chartDiv) {
      this.chartDiv.changes.subscribe(({first: elm}) => {
        if (elm) {
          this.workStateChart = this.echarts.init(elm.nativeElement);
          const workStateChartOption = totalWorkDaysAndDaysOffPieChartOption(this.workStateData,
            NumberConstant.EIGHTY + '%', this.translate);
          this.workStateChart.setOption(workStateChartOption);
          setLabel(this.workStateChart);
          changeChartSize(this.workStateChart);
        }
      });
    }
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnChanges() {
    if (this.isFirstChange) {
      this.isFirstChange = false;
    } else {
      this.employeeList = [];
      this.employeeFilter = null;
      this.isNewEmployeeList = true;
      this.clearEmployeeNameFilter = !this.clearEmployeeNameFilter;
      this.changeChart(this.periodEnum);
    }
  }

  onSelectEmployee(employeeName: string) {
    this.employeeFilter = employeeName;
    this.isNewEmployeeList = false;
    this.changeChart(this.periodEnum);

  }
}
