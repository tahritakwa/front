import {Component, OnInit} from '@angular/core';
import 'rxjs/add/operator/map';
import {ChartService} from '../service/chart.service';
import {Color} from 'ng2-charts';
import {ChartConstant} from '../../constant/manufuctoring/chart.constant';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})
export class ChartsComponent implements OnInit {
  ClickedClass = 'card h-100';
  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
    scales : {
      yAxes: [{
        ticks: {
          beginAtZero: true,
          stepValue: 10,
          steps: 0,
          max : 20,
        }
      }]
    }
  };
  public barChartLabels = [];
  public barChartType = 'bar';
  public barChartLegend = true;
  public barChartData = [
    {data: [], label: ChartConstant.LABEL_NBR_FAB_GAMME}
  ];

  public doughnutChartLabels: string[] = [];
  public doughnutChartData: number[] = [];
  chartDoughnutOptions = {
    responsive: true
  };
  public doughnutChartColors: Color[] = [
    { backgroundColor: [
        'rgba(181,25,28,0.38)',
        'rgba(66,181,49,0.38)',
        'rgba(26,96,175,0.38)',
        'rgba(107,181,255,0.38)'
      ] }];

  public chartLineType = 'line';
  public chartLineData =  [{
    data: [],
    label: 'Anthracnose',
    fill: false
  }];
  public chartLineLabels = [];
  public chartLineColors = [{
    backgroundColor: 'rgba(151,36,241,0.46)',
    borderColor: 'rgba(98,136,116,0.24)'
  }];
  public chartLineOptions = {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
          stepSize: 1
        }
      }]
    },
    annotation: {
      drawTime: 'beforeDatasetsDraw',
      annotations: [{
        type: 'box',
        id: 'a-box-1',
        yScaleID: 'y-axis-0',
        yMin: 0,
        yMax: 1,
        backgroundColor: '#4cf03b'
      }, {
        type: 'box',
        id: 'a-box-2',
        yScaleID: 'y-axis-0',
        yMin: 1,
        yMax: 2.7,
        backgroundColor: '#fefe32'
      }, {
        type: 'box',
        id: 'a-box-3',
        yScaleID: 'y-axis-0',
        yMin: 2.7,
        yMax: 5,
        backgroundColor: '#fe3232'
      }]
    }
  };

  constructor(private chartService: ChartService) {
  }

  async ngOnInit() {
    this.prepareDoughnutChartParams();
    await this.prepareBarChartParams();
    this.prepareLineChartParams();
  }

   async prepareBarChartParams () {
    await this.chartService.getJavaGenericService().getEntityList(ChartConstant.URL_NBR_FAB_GAMME)
      .toPromise().then( async data => {
        const self = this;
        await Object.keys(data).forEach(function (key) {
          self.barChartData[0].data.push( data[key]);
          self.barChartLabels.push( key);
        });
      });
  }

  private prepareDoughnutChartParams() {
    this.chartService.getJavaGenericService().getEntityList(ChartConstant.URL_NBR_FAB_STATE)
      .subscribe(data => {
        const self = this;
        Object.keys(  data).forEach(function (key) {
          self.doughnutChartData.push( data[key]);
          self.doughnutChartLabels.push( key);
        });
      });
  }

  private prepareLineChartParams() {
    this.chartService.getJavaGenericService().getEntityList(ChartConstant.URL_FINISHED_FAB_MOTH)
      .subscribe(data => {
        const self = this;
        Object.keys(data).forEach(function (key) {
          self.chartLineData[0].data.push(data[key]);
          self.chartLineLabels.push( key);
        });
      });
  }
}
