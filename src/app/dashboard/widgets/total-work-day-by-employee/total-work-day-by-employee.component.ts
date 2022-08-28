import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { BarChart } from '../../Charts';
import { DashboardConstant } from '../../../constant/dashboard/dashboard.constant';
import { CompanyService } from '../../../administration/services/company/company.service';
import { TeamService } from '../../../payroll/services/team/team.service';
import { ReducedTeam } from '../../../models/payroll/reduced-team.model';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { data } from 'jquery';

@Component({
  selector: 'app-total-work-day-by-employee',
  templateUrl: './total-work-day-by-employee.component.html',
  styleUrls: ['./total-work-day-by-employee.component.scss']
})
export class TotalWorkDayByEmployeeComponent implements OnInit {

  @Input() dateformat: any;
  @Input() FORMAT_NUMBER: any;
  @Input() currency: any;
  @Input() barChartColors: number;
  public teamData: ReducedTeam[];

  TotalWorkedDaysList: Array<any>;
  TotalWorkedDaysDataLoading: boolean;
  hasTotalWorkedData: boolean;
  purchasesSalesVolumeStartDate: Date;
  purchasesSalesVolumeEndDate: Date;
  TotalWorkDayChart: BarChart;
  constructor(public dashService: DashboardService, public el: ElementRef,
    public companyService: CompanyService, private teamService: TeamService) {
    this.getSelectedCurrency();
  }

  ngOnInit() {
    this.teamService.listdropdown().subscribe((data: any) => {
      this.teamData = data.listData;
    });
    this.ChangeTotalWorkedDayChart();
  }

  getSelectedCurrency() {
    this.currency = this.dashService.currency;
  }

  clearTotalWorkedDaysCharts() {
    this.TotalWorkedDaysList = null;
    this.TotalWorkedDaysDataLoading = true;
    this.hasTotalWorkedData = false;
  }

  ChangeTotalWorkedDayChart(teamName?: string) {
    this.clearTotalWorkedDaysCharts();
    this.initTotalWorkedDaysChart(teamName);
  }

  initTotalWorkedDaysChart(teamName = 'STARK') {
    this.TotalWorkedDaysDataLoading = true;
    const date = new Date();
    const year = date.getFullYear();
    const lastMonth = date.getMonth();
    // this.dashService.getKPIFromTotalWorkDaysStoredProcedure(DashboardConstant.GetKPITotalWorkDays, lastMonth,
    //   year, teamName).subscribe((data) => {
    //     this.initChart(data);
    //   });
  }
  initChart(data?: any) {
    this.TotalWorkedDaysDataLoading = false;
    if (data.length > NumberConstant.ZERO) {
      this.hasTotalWorkedData = true;
      this.TotalWorkDayChart = new BarChart(this.el, this.dashService);
      const currentContext = this;
    this.TotalWorkDayChart.barChartOptions.scales.yAxes = [{
      ticks: {
        // Include a dollar sign in the ticks
        callback(value, index, values, context = currentContext) {
          return Number(value).toLocaleString('fr-FR').concat(' ', '');
        }
      }
    }];
      this.TotalWorkDayChart.barChartLabels = data.map(x => x.EmployeeName);
      this.TotalWorkDayChart.barChartData = [
        {
          data: data.map(x => x.TotalWorkDays),
          label: 'Jours travaillés',
          fill: 'true'
        },
        {
          data: data.map(x => x.TotalDayOff),
          label: 'Jours non travaillés',
          fill: 'true',
        }];
    }
  }

}
