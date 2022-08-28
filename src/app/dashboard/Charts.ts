import { ElementRef } from '@angular/core';
import { Colorset } from './Colorset';
import { DashboardService } from './services/dashboard.service';
import { CookieService } from 'ngx-cookie-service';
export class BarChart {
  constructor(public el: ElementRef, public dashService: DashboardService) {
    let colorset = dashService.costumeColors;
    try {
      colorset = dashService.GetColors();
      this.barChartColors = Colorset.colorsets.cs1.BarChart;
    } catch (error) {
      this.barChartColors = Colorset.colorsets.cs1.BarChart;
    }
  }
  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true,
    scales: {
      yAxes: [{
        ticks: {
          // Include a dollar sign in the ticks
          callback: (value, index, values) => {
            return '$' + value;
          },
        }
      }],
      xAxes: [{
        ticks: {
          // Include a dollar sign in the ticks
          callback: (value, index, values) => {
            return value.split(' ', 2);
          },
          autoSkip: false,
          fontSize: 10
        }
      }],
    },
    tooltips: {
    },
    hover: {
      onHover: (event, active) => {
        hover(this.el, event, active);
      }
    }
  };
  public barChartType = 'bar';
  public barChartLegend = true;
  public barChartLabels: string[];
  public barChartData: any[];
  public barChartColors;
}


export class PieChart {
  constructor(public el: ElementRef, public dashService: DashboardService) {
    let colorset = dashService.costumeColors;
    try {
      colorset = dashService.GetColors();
      this.pieChartColors = colorset.PieChart;
    } catch (error) {
      this.pieChartColors = Colorset.colorsets.cs1.PieChart;
    }
  }
  // Pie
  public pieChartLabels: string[];
  public pieChartData: number[];
  public pieChartType = 'pie';
  public pieChartColors;
  public pieChartOptions: any = {
    legend: {
      position: 'right',
      labels: {
        generateLabels: (chart) => {
          let data = chart.data;
          if (data.labels.length && data.datasets.length) {
            return data.labels.map(function (label, i) {
              let labelTex = label.split(' ', 2);
              return {
                text: labelTex.join('\n'),
                fillStyle: data.datasets[0].backgroundColor[i],
                strokeStyle: data.datasets[0].backgroundColor[i],
                lineWidth: 1,
                index: i
              };
            });
          }
          return [];
        }
      }
    },
    hover: {
      onHover: (event, active) => {
        hover(this.el, event, active);
      }
    }
  };
}


export class BarHorizantalChart {
  constructor(public el: ElementRef, public dashService: DashboardService) {
    let colorset = dashService.costumeColors;
    try {
      colorset = dashService.GetColors();
           this.barChartColors = Colorset.colorsets.cs1.BarHorizantalChart;

    } catch (error) {
      this.barChartColors = Colorset.colorsets.cs1.BarHorizantalChart;
    }
  }
  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true,
    scales: {
      xAxes: [{
        display: false
      }],
      yAxes: [{
        display: true
      }]
    },
    legend: { display: false }
  };
  public barChartType = 'horizontalBar';
  public barChartLegend = true;
  public barChartLabels: string[];
  public barChartData: any[];
  public barChartColors;
}

export function hover(element, event, active) {
  if (active && active.length) {
    element.nativeElement.style.cursor = 'pointer';
  } else {
    element.nativeElement.style.cursor = 'default';
  }
}
