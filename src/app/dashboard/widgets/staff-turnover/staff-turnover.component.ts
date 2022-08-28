import {Component, ElementRef, Input, OnInit, QueryList, SimpleChanges, ViewChildren} from '@angular/core';
import {DashboardConstant} from '../../../constant/dashboard/dashboard.constant';
import {HrDashboardService} from '../../services/hr-dashboard/hr-dashboard.service';
import {LocalStorageService} from '../../../login/Authentification/services/local-storage-service';
import {
  changeChartSize,
  setLabel,
  staffTurnoverHeatmapChartOption
} from '../../../shared/helpers/chart.helper';
import {period} from '../../../constant/shared/services.constant';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {EmployeeTurnoverModel} from '../../../models/dashboard/employee-turnover.model';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-staff-turnover',
  templateUrl: './staff-turnover.component.html',
  styleUrls: ['./staff-turnover.component.scss']
})
export class StaffTurnoverComponent implements OnInit {

  @ViewChildren(DashboardConstant.STAFF_TURNOVER) chartDiv: QueryList<ElementRef>;

  @Input() dateFormat: string;
  @Input() seniorityRange: string[];
  @Input() ageRange: string[];
  @Input() gender: string[];
  @Input() office: string[];
  @Input() teamName: string[];
  @Input() contract: string[];

  staffTurnoverList: Array<EmployeeTurnoverModel>;
  dataLoading: boolean;
  staffTurnoverPeriod: string;
  startDate: Date;
  endDate: Date;
  staffTurnoverChart;
  echarts = require('echarts');

  periodEnum = DashboardConstant.DEFAULT_PERIOD_ENUM;
  staffTurnoverData: any;
  hasStaffTurnoverData: boolean;
  private isFirstChange = true;

  private minVisualMap = NumberConstant.ZERO;
  private maxVisualMap = NumberConstant.ZERO;

  constructor(public dashService: HrDashboardService, private translate: TranslateService,
              private localStorageService: LocalStorageService) {
  }

  ngOnInit() {
    this.changeChart(this.periodEnum);
  }

  changeChart(periodEnum?: number) {
    this.clearCharts();
    this.initStaffTurnoverChart(periodEnum);
    this.ngAfterViewInit();
  }

  private clearCharts() {
    this.staffTurnoverList = null;
    this.hasStaffTurnoverData = false;
  }

  private initStaffTurnoverChart(periodEnum = this.periodEnum) {
    this.dataLoading = true;
    this.periodEnum = periodEnum;
    this.staffTurnoverPeriod = period[periodEnum];
    this.dashService.getKPIFromStaffTurnoverStoredProcedure(periodEnum, this.gender, this.teamName, this.ageRange, this.seniorityRange,
      this.contract, this.office).subscribe((data) => {
      this.initChart(data);
    });
  }

  private initChart(data: any) {
    this.staffTurnoverList = data;
    this.staffTurnoverData = this.getStaffTurnoverData(this.staffTurnoverList);
    if (this.staffTurnoverList.length > NumberConstant.ZERO) {
      this.hasStaffTurnoverData = true;
      this.startDate = this.staffTurnoverList[NumberConstant.ZERO].StartPeriod;
      this.endDate = this.staffTurnoverList[NumberConstant.ZERO].EndPeriod;
    } else {
      this.clearStaffTurnoverCharts();
    }
    this.dataLoading = false;
  }

  private getStaffTurnoverData(staffTurnoverList: EmployeeTurnoverModel[]): any {
    const totalTurnoverRate = [];
    const res = [];
    const months = [];
    if (staffTurnoverList.length) {
      this.verifyAllListFields(totalTurnoverRate, months);
    }
    staffTurnoverList.forEach((x) => {
      totalTurnoverRate[(x.Month - NumberConstant.ONE)] += x.TotalTurnover;
    });
    totalTurnoverRate.forEach((data, index) => {
      if (data > this.maxVisualMap) {
        this.maxVisualMap = data;
      } else if (data < this.minVisualMap) {
        this.minVisualMap = data;
      }
      res[index] = [index, NumberConstant.ZERO, data];
    });
    const dataGlobal = {
      ['res']: res,
      ['month']: months,
      ['min']: Math.round(this.minVisualMap),
      ['max']: Math.ceil(this.maxVisualMap),
    };
    return dataGlobal;
  }


  private verifyAllListFields(totalTurnoverRate: number[], months: number[]) {
    for (let index = new Date(this.staffTurnoverList[NumberConstant.ZERO].StartPeriod).getMonth();
         index <= new Date(this.staffTurnoverList[NumberConstant.ZERO].EndPeriod).getMonth(); index++) {
      totalTurnoverRate[index] = NumberConstant.ZERO;
      months[index] = index;
    }
  }

  private clearStaffTurnoverCharts() {
    this.staffTurnoverList = null;
    this.hasStaffTurnoverData = false;
  }

  // tslint:disable-next-line: use-life-cycle-interface
  ngAfterViewInit() {
    if (this.chartDiv) {
      this.chartDiv.changes.subscribe(({first: elm}) => {
        if (elm) {
          this.staffTurnoverChart = this.echarts.init(elm.nativeElement);
          const staffTurnoverRateChartOption = staffTurnoverHeatmapChartOption(this.staffTurnoverData, this.translate,
            this.localStorageService.getLanguage());
          this.staffTurnoverChart.setOption(staffTurnoverRateChartOption);
          setLabel(this.staffTurnoverChart);
          changeChartSize(this.staffTurnoverChart);
          this.staffTurnoverChart.dispatchAction({
            type: 'selectDataRange',
            selected: [this.minVisualMap, this.maxVisualMap]
          });
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
