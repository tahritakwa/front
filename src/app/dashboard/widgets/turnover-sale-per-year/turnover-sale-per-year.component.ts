import { Component, ElementRef, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DashboardConstant } from '../../../constant/dashboard/dashboard.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { LocalStorageService } from '../../../login/Authentification/services/local-storage-service';
import { PeriodEnumerator } from '../../../models/dashboard/dashboard.model';
import { PurchasesSalesVolume } from '../../../models/dashboard/purchases-sales-volume.model';
import { changeChartSize, lineChartOption, setLabel } from '../../../shared/helpers/chart.helper';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-turnover-sale-per-year',
  templateUrl: './turnover-sale-per-year.component.html',
  styleUrls: ['./turnover-sale-per-year.component.scss']
})
export class TurnoverSalePerYearComponent implements OnInit {

  @ViewChildren('saleChart') chartDiv: QueryList<ElementRef>;

  @Input() dateformat: any;
  @Input() FORMAT_NUMBER: any;
  @Input() currency: any;
  @Input() barChartColors: number;

  turnoverSalesList: Array<PurchasesSalesVolume>;
  turnoverSalesDataLoading: boolean;
  hasturnoverSalesData: boolean;
  turnoverSalesPeriod: string;
  turnoverSalesStartDate: Date;
  turnoverSalesEndDate: Date;
  turnoverSalesChart;
  echarts = require('echarts');
  periodEnum = PeriodEnumerator.CurrentYear;
  operationType = DashboardConstant.OPERATION_TYPE_PURCHASE_SALE;
  purchasesData: any;
  salesData: any;
  userCurrencyCode: any;
  userCurrencySymbole: any;


  constructor(public dashService: DashboardService, private translate: TranslateService, private localStorageService : LocalStorageService) {
    this.userCurrencyCode = this.localStorageService.getCurrencyCode();
    this.userCurrencySymbole = this.localStorageService.getCurrencySymbol();
  }

  ngOnInit() {
    this.ChangeTurnoverSalesChart(this.periodEnum);
  }

  clearTurnoverSalesCharts() {
    this.turnoverSalesList = null;
    this.hasturnoverSalesData = false;
  }

  ChangeTurnoverSalesChart(periodEnum?: number) {
    this.clearTurnoverSalesCharts();
    this.initTurnoverSalesChart(periodEnum);
    this.ngAfterViewInit();
  }

  // tslint:disable-next-line: use-life-cycle-interface
  ngAfterViewInit() {
    if (this.chartDiv) {
      this.chartDiv.changes.subscribe(({ first: elm }) => {
        if (elm && this.salesData) {
          this.turnoverSalesChart = this.echarts.init(elm.nativeElement);
          const turnoverSalesChartOption = lineChartOption(`${this.translate.instant('SALES_TURNOVER')}`,
            this.salesData, this.userCurrencyCode, this.userCurrencySymbole, this.translate);
          this.turnoverSalesChart.setOption(turnoverSalesChartOption);
          setLabel(this.turnoverSalesChart);
          changeChartSize(this.turnoverSalesChart);
        }
      });
    }
  }

  initTurnoverSalesChart(periodEnum) {
    this.turnoverSalesDataLoading = true;
    this.dashService.getKPICummulativeTurnover(DashboardConstant.OPERATION_TYPE_SALE,
       periodEnum, NumberConstant.ONE).subscribe((data) => {
        this.initChart(data);
      });
  }
  initChart(data: any) {
    this.turnoverSalesList = data;
    if (this.turnoverSalesList.length > NumberConstant.ZERO) {
      this.hasturnoverSalesData = true;
      this.turnoverSalesStartDate = this.turnoverSalesList[NumberConstant.ZERO].StartPeriod;
      this.turnoverSalesEndDate = this.turnoverSalesList[NumberConstant.ZERO].EndPeriod;
      this.salesData = this.getTurnoverSalesData(this.turnoverSalesList);
    } else {
      this.clearTurnoverSalesCharts();
    }
    this.turnoverSalesDataLoading = false;
  }


  getTurnoverSalesData(listTurnoverSales: any): any {
    const data: Array<{
      lYTDInvoiceAmountTTC: number, yTDInvoiceAmountTTC: number, month: number, year: number, lastYear: number
    }> = Array();
    const startMonth = new Date(listTurnoverSales[NumberConstant.ZERO].StartPeriod).getMonth() + NumberConstant.ONE;
    const endMonth = new Date(listTurnoverSales[NumberConstant.ZERO].EndPeriod).getMonth() + NumberConstant.ONE;
    const year = listTurnoverSales[NumberConstant.ZERO].Year;
    const lastYear = listTurnoverSales[NumberConstant.ZERO].Year - NumberConstant.ONE;

    for (let currentMonth = startMonth; currentMonth <= endMonth; currentMonth++) {
      const dataOfCurrentMonth = listTurnoverSales.find(x => x && x.Month === currentMonth);

      if (dataOfCurrentMonth) {
        data.push({
          lYTDInvoiceAmountTTC: dataOfCurrentMonth.LYTDInvoiceAmountTTC ? dataOfCurrentMonth.LYTDInvoiceAmountTTC : 0,
          yTDInvoiceAmountTTC: dataOfCurrentMonth.YTDInvoiceAmountTTC ? dataOfCurrentMonth.YTDInvoiceAmountTTC : 0,
          month: dataOfCurrentMonth && dataOfCurrentMonth.Month ?
            dataOfCurrentMonth.Month : null,
          year: year,
          lastYear: lastYear,

        });
      } else {
        data.push({
          lYTDInvoiceAmountTTC: 0,
          yTDInvoiceAmountTTC: 0,
          month: currentMonth,
          year: year,
          lastYear: lastYear,

        });
      }
    }
    return data;
  }

}