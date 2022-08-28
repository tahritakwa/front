import { Component, ElementRef, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DashboardConstant } from '../../../constant/dashboard/dashboard.constant';
import { period } from '../../../constant/shared/services.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { OrderState } from '../../../models/dashboard/order-state.model';
import { barChartOptions, changeChartSize, InitLabels, setLabel } from '../../../shared/helpers/chart.helper';
import { DashboardService } from '../../services/dashboard.service';
import {LocalStorageService} from '../../../login/Authentification/services/local-storage-service';

@Component({
  selector: 'app-order-state',
  templateUrl: './order-state.component.html',
  styleUrls: ['./order-state.component.scss']
})
export class OrderStateComponent implements OnInit {


  @ViewChildren(DashboardConstant.ORDER_STATE_CHART) chartDiv: QueryList<ElementRef>;
  @Input() currency: any;
  @Input() dateformat: any;
  @Input() FORMAT_NUMBER: any;

  public orderStateList: Array<OrderState>;
  public orderStateDataLoading: boolean;
  public hasOrderStateData: boolean;
  public orderStatePeriod: string;
  public orderStateStartDate: Date;
  public orderStateEndDate: Date;
  public orderStateChart;
  numberOfRows = NumberConstant.FIVE;
  isUpButtonVisible = true;
  isDownButtonVisible = true;
  echarts = require('echarts');
  periodEnum = DashboardConstant.DEFAULT_PERIOD_ENUM;
  operationType = DashboardConstant.OPERATION_TYPE_PURCHASE;
  itemSaleData: any;
  labels: any;
  userCurrencyCode: any;
  userCurrencySymbole: any;





  constructor(public dashService: DashboardService, private translate: TranslateService,
    public el: ElementRef, private localStorageService : LocalStorageService) {
    this.userCurrencyCode = this.localStorageService.getCurrencyCode();
    this.userCurrencySymbole = this.localStorageService.getCurrencySymbol();
  }

  ngOnInit() {
    this.ChangeOrderStateChart(this.periodEnum);
  }

  ChangeOrderStateChart(periodEnum?: number) {
    this.clearOrderStateCharts();
    this.initOrderStateVolumeChart(periodEnum);
    this.ngAfterViewInit();
  }

  // tslint:disable-next-line: use-life-cycle-interface
  ngAfterViewInit() {
    if (this.chartDiv) {
      this.chartDiv.changes.subscribe(({ first: elm }) => {
        if (elm && this.orderStateList) {
          this.orderStateChart = this.echarts.init(elm.nativeElement);
          const orderStateChartOption = barChartOptions(`${this.translate.instant('ORDERSTATUS')}`,
           null, this.orderStateList, this.userCurrencyCode, this.userCurrencySymbole, this.labels.sale_purchase_labels);
          this.orderStateChart.setOption(orderStateChartOption);
          setLabel(this.orderStateChart);
          changeChartSize(this.orderStateChart);
        }
      });
    }
  }

  clearOrderStateCharts() {
    this.orderStateList = null;
    this.hasOrderStateData = false;
  }


  ChangeNumberOfRows(newNumber: number) {
    this.numberOfRows = newNumber;
    this.ChangeOrderStateChart();
  }


  initOrderStateVolumeChart(periodEnum = this.periodEnum) {
    this.orderStateDataLoading = true;
    this.labels = InitLabels(this.localStorageService.getLanguage());

    this.periodEnum = periodEnum;
    this.orderStatePeriod = period[periodEnum];
    this.dashService.getKPIFromOrderStateStoredProcedure(DashboardConstant.GetKPIOrderStatus, this.operationType,
      this.numberOfRows, periodEnum).subscribe((data) => {
        this.initChart(data);
      });
  }
  initChart(data: any) {
    this.orderStateList = data;
    if (this.orderStateList.length > NumberConstant.ZERO) {
      this.hasOrderStateData = true;
      this.orderStateStartDate = this.orderStateList[NumberConstant.ZERO].StartPeriod;
      this.orderStateEndDate = this.orderStateList[NumberConstant.ZERO].EndPeriod;
    } else {
      this.clearOrderStateCharts();
    }
    this.orderStateDataLoading = false;
  }

}
