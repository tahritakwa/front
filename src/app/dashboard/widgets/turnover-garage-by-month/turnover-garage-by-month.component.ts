import { Component, Input, OnInit } from '@angular/core';
import { DashboardConstant } from '../../../constant/dashboard/dashboard.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { fromMonthNumberToMonthName } from '../../../shared/helpers/chart.helper';
import { DashboardService } from '../../services/dashboard.service';
import { Chart } from 'chart.js';
import { GarageDashboardService } from '../../services/garage-dashboard/garage-dashboard.service';
import { PredicateFormat } from '../../../shared/utils/predicate';
import { GarageService } from '../../../garage/services/garage/garage.service';
import { Colorset } from '../../Colorset';
import {LocalStorageService} from '../../../login/Authentification/services/local-storage-service';
@Component({
  selector: 'app-turnover-garage-by-month',
  templateUrl: './turnover-garage-by-month.component.html',
  styleUrls: ['./turnover-garage-by-month.component.scss']
})
export class TurnoverGarageByMonthComponent implements OnInit {
  periodEnum = DashboardConstant.DEFAULT_PERIOD_ENUM;
  turnoverPerGarageByMonthStartDate: Date;
  turnocerPerGarageByMonthEndDate: Date;
  turnoverPerGarageList: Array<any>;
  turnoverPerGarageLoading: boolean;
  hasTurnoverPerGarageData: boolean;
  turnoverGarageChart: any;
  language: string;

  @Input() dateformat: any;
  @Input() FORMAT_NUMBER: any;
  @Input() currencySymbole: any;


  constructor(public dashService: DashboardService, public dashGarageService: GarageDashboardService,
    public garageService: GarageService, private localStorageService : LocalStorageService) {
       this.language = this.localStorageService.getLanguage();
     }

  ngOnInit() {
    this.ChangeTurnoverGarageChart();
  }

  ChangeTurnoverGarageChart(periodEnum = this.periodEnum) {
    this.clearTurnoverGarageChart();
    this.initTurnoverPerGarageChart(periodEnum);
  }
  clearTurnoverGarageChart() {
    this.turnoverPerGarageList = null;
    this.hasTurnoverPerGarageData = false;
  }

  initTurnoverPerGarageChart(periodEnum?: number) {
    this.turnoverPerGarageLoading = true;
    this.periodEnum = periodEnum;
    this.dashGarageService.getKPIFromTurnoverPerGarageStoredProcedure(this.periodEnum, NumberConstant.ONE).subscribe((data) => {
        this.initChart(data);
      });
  }

  initChart(data) {
    this.turnoverPerGarageList = data;
    if (this.turnoverPerGarageList.length > NumberConstant.ZERO) {
      if (this.turnoverGarageChart != null) {
        this.turnoverGarageChart.destroy();
      }
      const TurnoverGaragePerMonth = document.getElementById('TurnoverGaragePerMonth');
      this.lineChartMethod(TurnoverGaragePerMonth, data, Colorset.colorsets.cs4.allChart, Colorset.colorsets.cs4.allChartshadaw);
      this.hasTurnoverPerGarageData = true;
      this.turnoverPerGarageByMonthStartDate = data[NumberConstant.ZERO].StartPeriod;
      this.turnocerPerGarageByMonthEndDate = data[NumberConstant.ZERO].EndPeriod;
    } else {
      this.clearTurnoverGarageChart();
    }
    this.turnoverPerGarageLoading = false;
  }

  lineChartMethod(ctx, data, color, backgroundColor) {
    const symbole = this.currencySymbole;
    const datasets = [];
    data.forEach((element, index) => {
      datasets.push({
        label: element.GarageName,
        data: element.ListAmount,
        borderColor: color[index],
        backgroundColor: backgroundColor[index],
        borderWidth: 0,
        pointBackgroundColor: color[index],
        pointRadius: 7,
        pointBorderWidth: 3,
        pointBorderColor: '#fff',
        pointHoverRadius: 7,
        pointHoverBackgroundColor: color[index],
        pointHoverBorderColor: color[index],
        pointHoverBorderWidth: 2,
        pointHitRadius: 7,
        fill: true,
      });
    });

    this.turnoverGarageChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: fromMonthNumberToMonthName(data[0].ListMonth.map(x => {
          return { 'month': x };
        }), this.language),
        datasets: datasets
      },
      options: {
        legend: { position: 'top', padding: 5 },
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
              display: true
            }
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
