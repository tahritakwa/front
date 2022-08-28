import { NumberConstant } from './../../../constant/utility/number.constant';
import { DashboardConstant } from './../../../constant/dashboard/dashboard.constant';
import { Component, OnInit, Input, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { PurchasesSalesVolume } from '../../../models/dashboard/purchases-sales-volume.model';
import { period } from '../../../constant/shared/services.constant';
import { TranslateService } from '@ngx-translate/core';
import { barChartOption, changeChartSize, setLabel, InitLabels } from '../../../shared/helpers/chart.helper';
import {LocalStorageService} from '../../../login/Authentification/services/local-storage-service';

@Component({
  selector: 'app-sales-purchases-volume',
  templateUrl: './sales-purchases-volume.component.html',
  styleUrls: ['./sales-purchases-volume.component.scss']
})
export class SalesPurchasesVolumeComponent implements OnInit {


  @ViewChildren(DashboardConstant.SALE_PURCHASE_CHART) chartDiv: QueryList<ElementRef>;

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
  salesAndPurchaseChart;
  echarts = require('echarts');
  periodEnum = DashboardConstant.DEFAULT_PERIOD_ENUM;
  operationType = DashboardConstant.OPERATION_TYPE_PURCHASE_SALE;
  purchasesData: any;
  salesData: any;
  checkTaxType = false; // false : HT Amount | true : TTC Amount
  labels: any;
  userCurrencyCode: any;
  userCurrencySymbole: any;


  constructor(public dashService: DashboardService, private translate: TranslateService, private localStorageService : LocalStorageService, ) {
    this.getSelectedCurrency();
    this.userCurrencyCode = this.localStorageService.getCurrencyCode();
    this.userCurrencySymbole = this.localStorageService.getCurrencySymbol();
  }

  ngOnInit() {
    this.ChangePurchasesSalesVolumeChart(this.periodEnum);
  }

  getSelectedCurrency() {
    this.currency = this.dashService.currency;
  }

  clearPurchasesSalesVolumeCharts() {
    this.purchasesSalesVolumeList = null;
    this.hasPurchasesSalesVolumeData = false;
  }

  ChangePurchasesSalesVolumeChart(periodEnum?: number) {
    this.clearPurchasesSalesVolumeCharts();
    this.initPurchasesSalesVolumeChart(periodEnum);
    this.ngAfterViewInit();
  }

  // tslint:disable-next-line: use-life-cycle-interface
  ngAfterViewInit() {
    if (this.chartDiv) {
      this.chartDiv.changes.subscribe(({ first: elm }) => {
        if (elm && this.salesData) {
          this.salesAndPurchaseChart = this.echarts.init(elm.nativeElement);
          const salesAndPurchaseChartOption = barChartOption(`${this.translate.instant('SALESANDPURCHASE')}`,
            this.purchasesData, this.salesData, this.userCurrencyCode, this.userCurrencySymbole, this.labels.sale_purchase_labels, this.localStorageService.getLanguage());
            this.salesAndPurchaseChart.setOption(salesAndPurchaseChartOption);
            setLabel(this.salesAndPurchaseChart);
            changeChartSize(this.salesAndPurchaseChart);

        }
      });
    }
  }

  initPurchasesSalesVolumeChart(periodEnum = this.periodEnum) {
    this.PurchasesSalesVolumeDataLoading = true;
    this.labels = InitLabels(this.localStorageService.getLanguage());
    this.periodEnum = periodEnum;
    this.salePurchasesSalesVolumePeriod = period[periodEnum];
    this.dashService.getKPIFromPurchasesSalesStoredProcedure(this.operationType, periodEnum, NumberConstant.ONE).subscribe((data) => {
        this.initChart(data);
      });
  }
  initChart(data: any) {
    this.purchasesSalesVolumeList = data;
    if (this.purchasesSalesVolumeList.length > NumberConstant.ZERO) {
      this.hasPurchasesSalesVolumeData = true;
      this.purchasesSalesVolumeStartDate = this.purchasesSalesVolumeList[NumberConstant.ZERO].StartPeriod;
      this.purchasesSalesVolumeEndDate = this.purchasesSalesVolumeList[NumberConstant.ZERO].EndPeriod;
      this.purchasesData = this.getPurchasesSalesVolumeData(this.purchasesSalesVolumeList, DashboardConstant.OPERATION_TYPE_PURCHASE);
      this.salesData = this.getPurchasesSalesVolumeData(this.purchasesSalesVolumeList, DashboardConstant.OPERATION_TYPE_SALE);
    } else {
      this.clearPurchasesSalesVolumeCharts();
    }
    this.PurchasesSalesVolumeDataLoading = false;
  }


  changeTaxType(newTaxType: any) {
    this.checkTaxType = newTaxType;
    this.ChangePurchasesSalesVolumeChart();
  }

  getPurchasesSalesVolumeData(listPurchasesSales: PurchasesSalesVolume[], operation: string): any {
    const data: Array<{ invoiceAmount: number, month: number }> = Array();
    const startDate = new Date(listPurchasesSales[NumberConstant.ZERO].StartPeriod);
    const endDate = new Date(listPurchasesSales[NumberConstant.ZERO].EndPeriod);
    const tempList = listPurchasesSales.map(u => u.Type === operation ? u : null);

    while (startDate < endDate) {
      const currentMonth = startDate.getMonth() + NumberConstant.ONE;
      const dataOfCurrentMonth = tempList.find(x => x && x.Month === currentMonth);
      if (dataOfCurrentMonth) {
        data.push({
          invoiceAmount: (this.checkTaxType) ?
            dataOfCurrentMonth.InvoiceAmountTTC ? dataOfCurrentMonth.InvoiceAmountTTC : null :
            dataOfCurrentMonth.InvoiceAmountHT ? dataOfCurrentMonth.InvoiceAmountHT : null,
          month: dataOfCurrentMonth && dataOfCurrentMonth.Month ?
            dataOfCurrentMonth.Month : null
        });
      } else {
        data.push({
          invoiceAmount: null,
          month: currentMonth
        });
      }
      startDate.setMonth(startDate.getMonth() + NumberConstant.ONE);
    }

    return data;

  }
}
