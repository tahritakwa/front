import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { BarChart, BarHorizantalChart } from '../../Charts';
import { CompanyService } from '../../../administration/services/company/company.service';

@Component({
  selector: 'app-employee-by-office',
  templateUrl: './employee-by-office.component.html',
  styleUrls: ['./employee-by-office.component.scss']
})
export class EmployeeByOfficeComponent implements OnInit {

  @Input() dateformat: any;
  @Input() FORMAT_NUMBER: any;
  @Input() currency: any;
  @Input() barChartColors: number;

  EmployeeByOfficeList: Array<any>;
  EmployeeByOfficeLoading: boolean;
  hasEmployeeByOfficeData: boolean;
  EmployeeByOfficeChart: BarChart;
  constructor(public dashService: DashboardService, public el: ElementRef,
    public companyService: CompanyService) {
    this.getSelectedCurrency();
  }

  ngOnInit() {
    this.ChangeEmployeeByOfficeChart();
  }

  getSelectedCurrency() {
    this.currency = this.dashService.currency;
  }

  clearEmployeeByOfficeCharts() {
    this.EmployeeByOfficeList = null;
    this.EmployeeByOfficeLoading = true;
    this.hasEmployeeByOfficeData = false;
  }

  ChangeEmployeeByOfficeChart() {
    this.clearEmployeeByOfficeCharts();
    this.initChart();
  }

  initChart() {
    this.EmployeeByOfficeLoading = false;
    this.hasEmployeeByOfficeData = true;
    this.EmployeeByOfficeChart = new BarHorizantalChart(this.el, this.dashService);
    this.EmployeeByOfficeChart.barChartType = 'horizontalBar';
    this.EmployeeByOfficeChart.barChartLabels = ['Tunis', 'France', 'Sfax', 'Londres', 'Belgique'];
    this.EmployeeByOfficeChart.barChartData = [
      {
        data: [20, 18, 19, 17, 19],
      }];
  }



}
