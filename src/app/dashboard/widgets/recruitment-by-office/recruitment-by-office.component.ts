import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {period} from '../../../constant/shared/services.constant';
import {TopTiers} from '../../../models/dashboard/top-tiers.model';
import {DashboardService} from '../../services/dashboard.service';
import {PieChart} from '../../Charts';
import {DashboardConstant} from '../../../constant/dashboard/dashboard.constant';
import {CompanyService} from '../../../administration/services/company/company.service';

const FORMAT_DATE = 'format_date';

@Component({
  selector: 'app-recruitment-by-office',
  templateUrl: './recruitment-by-office.component.html',
  styleUrls: ['./recruitment-by-office.component.scss']
})
export class RecruitmentByOfficeComponent implements OnInit {


  @Input() dateformat: any;
  @Input() FORMAT_NUMBER: any;
  @Input() currency: any;
  @Input() pieChartColors: number;
  topSuppliersList: Array<TopTiers>;
  labels: Array<string>;
  numbers: Array<number>;
  topSupplierLoading: boolean;
  hasTopSuppliersData: boolean;
  topSuppliersPeriod: string;
  topSuppliersStartDate: Date;
  topSuppliersEndDate: Date;
  supplier: PieChart;


  constructor(public dashService: DashboardService, public el: ElementRef,
    public companyService: CompanyService) {
    this.getSelectedCurrency();
  }

  ngOnInit() {
    this.ChangeTopSupplierChart(DashboardConstant.DEFAULT_PERIOD_ENUM);
  }
  clearTopSupplierChart() {
    this.topSuppliersList = null;
    this.topSupplierLoading = true;
    this.hasTopSuppliersData = false;
  }

  ChangeTopSupplierChart(periodEnum?: number) {
    this.clearTopSupplierChart();
    this.initTopSupplierChart(periodEnum);
  }

  initTopSupplierChart(periodEnum = DashboardConstant.DEFAULT_PERIOD_ENUM) {
    const topSupplier = new TopTiers();
    this.topSuppliersPeriod = period[periodEnum];
    topSupplier.PeriodEnum = periodEnum;
    this.labels = ["PARIS","LONDON","SFAX","TUNIS"];
    this.numbers = [10,30,45,15];

    this.supplier = new PieChart(this.el, this.dashService);
    this.supplier.pieChartLabels =  this.labels;
    this.supplier.pieChartData = this.numbers;


    this.hasTopSuppliersData = true;
    this.topSuppliersStartDate = new Date('08/01/2020');
    this.topSuppliersEndDate = new Date('01/31/2021');

    const currentContext = this;
      this.supplier.pieChartOptions.tooltips = {
        callbacks: {
          label(tooltipItem, ChartData, context = currentContext) {
            return ChartData.labels[tooltipItem.index].concat(': ',
              Number(ChartData.datasets[tooltipItem.datasetIndex]['data'][tooltipItem['index']])
                .toLocaleString('fr-FR'), ' ', "%");
          }
        }
      };
      this.topSupplierLoading = false;

  }
  getSelectedCurrency() {
    this.currency = this.dashService.currency;
  }
  public TopSupplierChartClicked(e: any): void {

  }

}


