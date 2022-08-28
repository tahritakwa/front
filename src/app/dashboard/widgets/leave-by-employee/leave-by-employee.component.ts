import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {DashboardService} from '../../services/dashboard.service';
import {PurchasesSalesVolume} from '../../../models/dashboard/purchases-sales-volume.model';
import {period} from '../../../constant/shared/services.constant';
import {BarChart} from '../../Charts';
import {DashboardConstant} from '../../../constant/dashboard/dashboard.constant';
import {CompanyService} from '../../../administration/services/company/company.service';

@Component({
  selector: 'app-leave-by-employee',
  templateUrl: './leave-by-employee.component.html',
  styleUrls: ['./leave-by-employee.component.scss']
})
export class LeaveByEmployeeComponent implements OnInit {

  @Input() dateformat: any;
  @Input() FORMAT_NUMBER: any;
  @Input() currency: any;
  @Input() barChartColors: number;

  purchasesSalesVolumeList: Array<PurchasesSalesVolume>;
  PurchasesSalesVolumeDataLoading: boolean;
  hasPurchasesSalesVolumeData: boolean;
  salePurchasesSalesVolumePeriod: string;
  purchasesSalesVolumeStartDate: Date;
  purchasesSalesVolumeEndDate: Date;
  salesAndPurchaseChart: BarChart;
  constructor(public dashService: DashboardService, public el: ElementRef,
    public companyService: CompanyService) {
    this.getSelectedCurrency();
  }

  ngOnInit() {
    this.ChangePurchasesSalesVolumeChart();
  }

  getSelectedCurrency() {
    this.currency = this.dashService.currency;
  }

  clearPurchasesSalesVolumeCharts() {
    this.purchasesSalesVolumeList = null;
    this.PurchasesSalesVolumeDataLoading = true;
    this.hasPurchasesSalesVolumeData = false;
  }

  ChangePurchasesSalesVolumeChart(periodEnum?: number) {
    this.clearPurchasesSalesVolumeCharts();
    this.initPurchasesSalesVolumeChart(periodEnum);
  }

  initPurchasesSalesVolumeChart(periodEnum = DashboardConstant.DEFAULT_PERIOD_ENUM) {
    const purchasesSalesVolume = new PurchasesSalesVolume();
    this.salePurchasesSalesVolumePeriod = period[periodEnum];
    purchasesSalesVolume.PeriodEnum = periodEnum;
    this.PurchasesSalesVolumeDataLoading = false;
    this.hasPurchasesSalesVolumeData = true;
        this.purchasesSalesVolumeStartDate =  new Date('08/01/2020');
        this.purchasesSalesVolumeEndDate = new Date('01/31/2021');
        this.salesAndPurchaseChart = new BarChart(this.el, this.dashService);
        const currentContext = this;
        this.salesAndPurchaseChart.barChartOptions.scales.yAxes = [{
          ticks: {
            // Include a dollar sign in the ticks
            callback(value, index, values, context = currentContext) {
              return Number(value).toLocaleString('fr-FR').concat(' ', '');
            }
          }
        }];
        this.salesAndPurchaseChart.barChartOptions.tooltips = {
          callbacks: {

            label(tooltipItem, ChartData, context = currentContext) {
              return Number(ChartData.datasets[tooltipItem.datasetIndex]['data'][tooltipItem['index']])
                .toLocaleString('fr-FR').concat(' ', '');
            }
          }
        };
        this.salesAndPurchaseChart.barChartLabels =  ['Youssef MIMOUN', 'Saber NAJAR', 'Brahim BELKACEM','Amine KLIFA', 'Sarah AYED'];;
        this.salesAndPurchaseChart.barChartData = [
          {
            data: [134,120,100,130,110],
            label: 'Jours de travail'
          },
          {
            data: [10,20,44,14,24],
            label: 'Jours de congé'
          }];
  }



}
