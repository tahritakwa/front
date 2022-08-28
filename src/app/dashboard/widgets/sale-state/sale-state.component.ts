import { Component, ElementRef, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Chart } from 'chart.js';
import { DashboardConstant } from '../../../constant/dashboard/dashboard.constant';
import { period } from '../../../constant/shared/services.constant';
import { SaleState } from '../../../models/dashboard/sale-state.model';
import { fromMonthNumberToMonthName, InitLabels } from '../../../shared/helpers/chart.helper';
import { DashboardService } from '../../services/dashboard.service';
import { NumberConstant } from './../../../constant/utility/number.constant';
import {LocalStorageService} from '../../../login/Authentification/services/local-storage-service';


const FORMAT_DATE = 'format_date';

@Component({
  selector: 'app-sale-state',
  templateUrl: './sale-state.component.html',
  styleUrls: ['./sale-state.component.scss']
})
export class SaleStateComponent implements OnInit {
  @ViewChildren(DashboardConstant.SALE_STATE_CHART) chartDiv: QueryList<ElementRef>;
  @Input() dateformat: any;
  @Input() FORMAT_NUMBER: any;
  @Input() currency: any;
  @Input() barChartColors: number;
  @Input() type: string;

  public saleStateChart;
  public hasSaleStateData: boolean;
  public saleStateList: Array<SaleState>;
  public saleStateStartDate: Date;
  public saleStateEndDate: Date;
  public saleStatePeriod: string;
  public SaleStateLoading: boolean;
  public labels: any;
  echarts = require('echarts');
  periodEnum = DashboardConstant.DEFAULT_PERIOD_ENUM;
  purchaseType = DashboardConstant.OPERATION_TYPE_PURCHASE;
  salesType = DashboardConstant.OPERATION_TYPE_SALE;
  operationType: any;
  saleStateData: any[];
  salePurchaseChart: any;

  constructor(public dashService: DashboardService, private translate: TranslateService, private localStorageService : LocalStorageService) {
    this.getSelectedCurrency();
  }

  ngOnInit() {
    this.ChangeSaleStateChart(this.periodEnum);
    this.operationType = this.type;
  }

  clearSaleStateCharts() {
    this.saleStateList = null;
    this.hasSaleStateData = false;
  }

  ChangeSaleStateChart(periodEnum = this.periodEnum) {
    this.clearSaleStateCharts();
    this.initSaleStateChart(periodEnum);
  }


  initSaleStateChart(periodEnum = this.periodEnum) {
    this.SaleStateLoading = true;
    this.periodEnum = periodEnum;
    this.labels = InitLabels(this.localStorageService.getLanguage());
    this.saleStatePeriod = period[periodEnum];
    this.dashService.getKPIFromSalePurchaseStateStoredProcedure( this.type, periodEnum, NumberConstant.ONE).subscribe((data) => {
        this.initChart(data);
      });
  }
  initChart(data: any) {
    this.saleStateList = data;
    if (this.saleStateList.length > NumberConstant.ZERO) {
      this.hasSaleStateData = true;
      this.saleStateStartDate = this.saleStateList[NumberConstant.ZERO].StartPeriod;
      this.saleStateEndDate = this.saleStateList[NumberConstant.ZERO].EndPeriod;
      this.saleStateData = this.getSalesStateData(this.saleStateList);
      if (this.salePurchaseChart != null) {
        this.salePurchaseChart.destroy();
      }
      if (this.type === this.salesType) {
        const ctx = document.getElementById('SaleState');
        this.lineChartMethod(ctx, this.saleStateData, '#4DC2F1'
          , 'rgb(77, 194, 241, 0.45)',
          '#F8B84A', 'rgb(248, 184, 74,0.45)');
      }
      if (this.type === this.purchaseType) {
        const ctx = document.getElementById('PurchaseState');
        this.lineChartMethod(ctx, this.saleStateData, '#4DC2F1'
          , 'rgb(77, 194, 241, 0.45)',
          '#F8B84A', 'rgb(248, 184, 74,0.45)');
      }
    } else {
      this.clearSaleStateCharts();
    }
    this.SaleStateLoading = false;
  }
  getSalesStateData(saleStateList: SaleState[]): any {
    const data: Array<{ invoiceAmount: number, remainingAmount: number, month: number }> = Array();
    const startDate = new Date(this.saleStateStartDate);
    const endDate = new Date(this.saleStateEndDate);

    while (startDate < endDate) {
      const currentMonth = startDate.getMonth() + NumberConstant.ONE;
      const dataOfCurrentMonth = saleStateList.find(x => x && x.Month === currentMonth);
      if (dataOfCurrentMonth) {
        data.push({
          invoiceAmount: dataOfCurrentMonth && dataOfCurrentMonth.InvoiceAmountTTC ?
            dataOfCurrentMonth.InvoiceAmountTTC : 0,
          remainingAmount: dataOfCurrentMonth && dataOfCurrentMonth.InvoiceRemainingAmount ?
            dataOfCurrentMonth.InvoiceRemainingAmount : 0,
          month: dataOfCurrentMonth && dataOfCurrentMonth.Month ?
            dataOfCurrentMonth.Month : 0
        });
      } else {
        data.push({
          invoiceAmount: 0,
          remainingAmount: 0,
          month: currentMonth
        });
      }
      startDate.setMonth(startDate.getMonth() + NumberConstant.ONE);
    }

    return data;

  }



  getSelectedCurrency() {
    this.currency = this.dashService.currency;
  }

  lineChartMethod(ctx, data, firstColor, firstBackgroudColor, secondColor, secondBackgroundColor) {
    const symbole = this.currency;
    this.salePurchaseChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: fromMonthNumberToMonthName(data.map(x => {
          return { 'month': x.month };
        }), this.localStorageService.getLanguage()),
        datasets: [{
          label: this.labels.sale_state_labels[NumberConstant.ZERO],
          data: data.map(x => x.invoiceAmount),
          borderColor: firstColor,
          backgroundColor: firstBackgroudColor,
          borderWidth: 0,
          pointBackgroundColor: firstColor,
          pointRadius: 7,
          pointBorderWidth: 3,
          pointBorderColor: '#fff',
          pointHoverRadius: 7,
          pointHoverBackgroundColor: firstColor,
          pointHoverBorderColor: firstColor,
          pointHoverBorderWidth: 2,
          pointHitRadius: 7,
          fill: true,
        },
        {
          label: this.labels.sale_state_labels[NumberConstant.ONE],
          data: data.map(x => x.remainingAmount),
          borderColor: secondColor,
          backgroundColor: secondBackgroundColor,
          borderWidth: 0,
          pointBackgroundColor: secondColor,
          pointRadius: 7,
          pointBorderWidth: 3,
          pointBorderColor: '#fff',
          pointHoverRadius: 7,
          pointHoverBackgroundColor: secondColor,
          pointHoverBorderColor: secondColor,
          pointHoverBorderWidth: 2,
          pointHitRadius: 7,
          fill: true,
        },

        ]
      },
      options: {
        legend: { position: 'top', padding: 5 },
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          xAxes: [{
            gridLines: {
              display: true
            },
            ticks: {
              display: true
            }
          }],
          yAxes: [{
            gridLines: {
              display: true
            },
            ticks: {
              callback: function (label, index, labels) {
                return label / 1000 + 'k';
              }
            },

          }]
        },
        tooltips: {
          enabled: true,
          mode: 'label',
          callbacks: {
            label: function (tooltipItem, chart) {
              var label = chart.datasets[tooltipItem.datasetIndex].label || '';
              if (label) {
                label += ': ';
              }
              label += tooltipItem.yLabel ? Number(tooltipItem.yLabel).toLocaleString('fr-FR').concat(' ', symbole) :
                NumberConstant.ZERO.toLocaleString('fr-FR').concat(' ', symbole);
              return label;
            }

          }
        }
      }
    });

  }

}
