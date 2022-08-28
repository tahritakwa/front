import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {DashboardService} from '../../services/dashboard.service';
import {PurchasesSalesVolume} from '../../../models/dashboard/purchases-sales-volume.model';
import {period} from '../../../constant/shared/services.constant';
import {BarChart} from '../../Charts';
import {DashboardConstant} from '../../../constant/dashboard/dashboard.constant';
import {CompanyService} from '../../../administration/services/company/company.service';

@Component({
  selector: 'app-gendre-by-month',
  templateUrl: './gendre-by-month.component.html',
  styleUrls: ['./gendre-by-month.component.scss']
})
export class GendreByMonthComponent implements OnInit {

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
        this.salesAndPurchaseChart.barChartLabels =  ['Août', 'Sept', 'Oct', 'Nov', 'Déc'];
        this.salesAndPurchaseChart.barChartData = [
          {
            data: [150,150,160,159,160],
            label: 'Homme'
          },
          {
            data: [145,148,155,161,155],
            label: 'Femme'
          }];
  }



}
