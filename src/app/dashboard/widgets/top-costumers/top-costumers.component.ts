import { Component, OnInit, Input, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { TopTiers } from '../../../models/dashboard/top-tiers.model';
import { period } from '../../../constant/shared/services.constant';
import { TiersConstants } from '../../../constant/purchase/tiers.constant';
import { DashboardConstant } from '../../../constant/dashboard/dashboard.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { TranslateService } from '@ngx-translate/core';
import { pieChartOption, changeChartSize, setLabel } from '../../../shared/helpers/chart.helper';
import { LocalStorageService } from '../../../login/Authentification/services/local-storage-service';

@Component({
  selector: 'app-top-costumers',
  templateUrl: './top-costumers.component.html',
  styleUrls: ['./top-costumers.component.scss']
})
export class TopCostumersComponent implements OnInit {
  @ViewChildren(TiersConstants.TOP_CUSTOMERS_CHART) chartDiv: QueryList<ElementRef>;
  @Input() dateformat: any;
  @Input() FORMAT_NUMBER: any;
  @Input() currency: any;
  topCustomersList: Array<TopTiers>;
  topCustomersDataLoading: boolean;
  hasTopCustomersData: boolean;
  topCustomerPeriod: string;
  topCustomerStartDate: Date;
  topCustomerEndDate: Date;
  customerChart;
  topCustomersData: any;
  rankCriteria = true; // false : Qty || true : Amnt
  valueApperance = true; // false : Percent || true : Value
  numberOfRows = NumberConstant.FIVE;
  isUpButtonVisible = true;
  isDownButtonVisible = true;
  echarts = require('echarts');
  periodEnum = DashboardConstant.DEFAULT_PERIOD_ENUM;
  lastTap = NumberConstant.ZERO;
  userCurrencyCode: any;
  userCurrencySymbole: any;
  constructor(public dashService: DashboardService, private translate: TranslateService, private localStorageService : LocalStorageService) {
    this.userCurrencyCode = this.localStorageService.getCurrencyCode();
    this.userCurrencySymbole = this.localStorageService.getCurrencySymbol();
  }

  ngOnInit() {
    this.ChangeTopCustomerChart(this.periodEnum);
  }

  clearTopCustomerCharts() {
    this.topCustomersList = null;
    this.hasTopCustomersData = false;
  }

  ChangeTopCustomerChart(periodEnum?: number) {
    this.clearTopCustomerCharts();
    this.initTopCustomerChart(periodEnum);
    this.ngAfterViewInit();
  }

  // tslint:disable-next-line: use-life-cycle-interface
  ngAfterViewInit() {
    if (this.chartDiv) {
      this.chartDiv.changes.subscribe(({ first: elm }) => {
        if (elm) {
          this.customerChart = this.echarts.init(elm.nativeElement);
          const customerChartOption = pieChartOption(`${this.translate.instant('TOPCUSTOMERS')}`, this.topCustomersData,
            this.rankCriteria, this.userCurrencyCode, this.userCurrencySymbole, this.valueApperance, NumberConstant.EIGHTY + '%');
          this.customerChart.setOption(customerChartOption);
          setLabel(this.customerChart);
          changeChartSize(this.customerChart);
          this.customerChart.on('click', function (params) {
            const currentTime = new Date().getTime();
            const tapLength = currentTime - this.lastTap;
            if (tapLength < NumberConstant.FIVE_HUNDRED && tapLength > NumberConstant.ZERO) {
              window.open(TiersConstants.CUSTOMER_ADVANCED_EDIT_URL + params.data.id);
            }
            this.lastTap = currentTime;
          });
        }
      });
    }
  }
  initTopCustomerChart(periodEnum = this.periodEnum) {
    this.topCustomersDataLoading = true;
    this.periodEnum = periodEnum;
    this.topCustomerPeriod = period[periodEnum];
    this.dashService.getKPIFromTopCustomerStoredProcedure( this.rankCriteria,this.numberOfRows, periodEnum).subscribe((data) => {
        this.initChart(data);
      });
  }
  initChart(data: any) {
    this.topCustomersList = data;
    this.topCustomersData = this.getTopCustomerData(this.topCustomersList);
    if (this.topCustomersList.length > NumberConstant.ZERO) {
      this.hasTopCustomersData = true;
      this.topCustomerStartDate = this.topCustomersList[NumberConstant.ZERO].StartPeriod;
      this.topCustomerEndDate = this.topCustomersList[NumberConstant.ZERO].EndPeriod;
    } else {
      this.clearTopCustomerCharts();
    }
    this.topCustomersDataLoading = false;
  }
  getTopCustomerData(listTopCustomers: TopTiers[]): any {
    const data: Array<{ id: number, value: number, name: string, selected: boolean }> = Array();
    listTopCustomers.forEach((customer) => data.push({
      id: customer.IdTiers,
      value: (this.rankCriteria) ? customer.TTCAmount : customer.Quantity,
      name: customer.TiersName,
      selected: (((this.rankCriteria) ? customer.RankByTTCAmount : customer.RankByQuantity) === NumberConstant.ONE) ? true : false
    }));
    return data;
  }

  changeRankCriteria(newRankCriteria: boolean) {
    this.rankCriteria = newRankCriteria;
    this.ChangeTopCustomerChart();
  }
  changeValueApperance(newRankCriteria: boolean) {
    this.valueApperance = newRankCriteria;
    this.ChangeTopCustomerChart();
  }

  ChangeNumberOfRows(newNumber: number) {
    this.numberOfRows = newNumber;
    this.ChangeTopCustomerChart();
  }

}
