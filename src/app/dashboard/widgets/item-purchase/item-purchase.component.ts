import { DashboardConstant } from './../../../constant/dashboard/dashboard.constant';
import { PurchaseSaleItem } from './../../../models/dashboard/purchase-sale-item.model';
import { NumberConstant } from './../../../constant/utility/number.constant';
import { Component, OnInit, Input, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { period } from '../../../constant/shared/services.constant';
import { TranslateService } from '@ngx-translate/core';
import { setLabel, changeChartSize, familyHorizontalBarChartOption, familyBarChartOption } from '../../../shared/helpers/chart.helper';
import { LocalStorageService } from '../../../login/Authentification/services/local-storage-service';

@Component({
  selector: 'app-item-purchase',
  templateUrl: './item-purchase.component.html',
  styleUrls: ['./item-purchase.component.scss']
})
export class ItemPurchaseComponent implements OnInit {

  @ViewChildren(DashboardConstant.ITEM_PURCHASE_CHART) chartDiv: QueryList<ElementRef>;
  @Input() currency: any;
  @Input() dateformat: any;
  @Input() FORMAT_NUMBER: any;

  public itemPurchaseList: Array<PurchaseSaleItem>;
  public itemPurchaseDataLoading: boolean;
  public hasItemPurchaseData: boolean;
  public itemPurchasePeriod: string;
  public itemPurchaseStartDate: Date;
  public itemPurchaseEndDate: Date;
  public itemPurchaseChart;
  rankCriteria = true; // false : Qty || true : Amnt
  numberOfRows = NumberConstant.FIVE;
  isUpButtonVisible = true;
  isDownButtonVisible = true;
  echarts = require('echarts');
  periodEnum = DashboardConstant.DEFAULT_PERIOD_ENUM;
  operationType = DashboardConstant.OPERATION_TYPE_PURCHASE;
  itemPurchaseData: any;
  userCurrencyCode: any;
  userCurrencySymbole: any;



  constructor(public dashService: DashboardService, private translate: TranslateService, private localStorageService : LocalStorageService) {
    this.userCurrencyCode = this.localStorageService.getCurrencyCode();
    this.userCurrencySymbole = this.localStorageService.getCurrencySymbol();
  }

  ngOnInit() {
    this.ChangeItemPurchaseChart(this.periodEnum);
  }

  ChangeItemPurchaseChart(periodEnum?: number) {
    this.clearItemSalesVolumeCharts();
    this.initItemSalesVolumeChart(periodEnum);
    this.ngAfterViewInit();
  }


  // tslint:disable-next-line: use-life-cycle-interface
  ngAfterViewInit() {
    if (this.chartDiv) {
      this.chartDiv.changes.subscribe(({ first: elm }) => {
        if (elm && this.itemPurchaseData) {
          this.itemPurchaseChart = this.echarts.init(elm.nativeElement);
          const itemPurchaseChartOption = familyBarChartOption(`${this.translate.instant('ITEM_PURCHASE')}`,
            this.itemPurchaseData, this.itemPurchaseList ?
            this.itemPurchaseList.length : this.numberOfRows, this.rankCriteria, this.userCurrencyCode, this.userCurrencySymbole, this.translate);
          this.itemPurchaseChart.setOption(itemPurchaseChartOption);
          setLabel(this.itemPurchaseChart);
          changeChartSize(this.itemPurchaseChart);
        }
      });
    }
  }
  clearItemSalesVolumeCharts() {
    this.itemPurchaseList = null;
    this.hasItemPurchaseData = false;
  }

  changeRankCriteria(newRankCriteria: boolean) {
    this.rankCriteria = newRankCriteria;
    this.ChangeItemPurchaseChart();
  }
  ChangeNumberOfRows(newNumber: number) {
    this.numberOfRows = newNumber;
    this.ChangeItemPurchaseChart();
  }
  initItemSalesVolumeChart(periodEnum = this.periodEnum) {
    this.itemPurchaseDataLoading = true;
    this.periodEnum = periodEnum;
    this.itemPurchasePeriod = period[periodEnum];
    this.dashService.getKPIFromItemPurchaseStoredProcedure(this.rankCriteria, this.numberOfRows, periodEnum).subscribe((data) => {
        this.initChart(data);
      });
  }
  initChart(data: any) {
    this.itemPurchaseList = data;
    if (this.itemPurchaseList.length > NumberConstant.ZERO) {
      this.hasItemPurchaseData = true;
      this.itemPurchaseStartDate = this.itemPurchaseList[NumberConstant.ZERO].StartPeriod;
      this.itemPurchaseEndDate = this.itemPurchaseList[NumberConstant.ZERO].EndPeriod;
      this.itemPurchaseData = this.getItemPurchaseData(this.itemPurchaseList);
    } else {
      this.clearItemSalesVolumeCharts();
    }
    this.itemPurchaseDataLoading = false;
  }
  getItemPurchaseData(itemPurchaseList: PurchaseSaleItem[]): any {
    const data: Array<{ value: number, description: string, code: string, familyName: string, familyIndex: number }> = Array();
    let familyData = Array();
    itemPurchaseList.sort((a: PurchaseSaleItem, b: PurchaseSaleItem) =>
      (a.LabelItemFamily > b.LabelItemFamily) ? NumberConstant.ONE : NumberConstant.MINUS_ONE);

    itemPurchaseList.forEach(item => {
      const family = {
        name: item.LabelItemFamily,
        value: (this.rankCriteria) ? item.HtTotalPerItemFamily : item.QuantityPerItemFamily,
        items: (this.rankCriteria) ? item.RankByFamilyPerAmount : item.RankByFamilyPerQuantity,
      };
      const found = familyData.some(el => el.name === family.name);
      if (!found) {
        familyData.push(family);
      } else {
        familyData = familyData.map(u => u.name !== family.name ? u : (u.items > family.items) ? u : family);
      }

      data.push({
        value: (this.rankCriteria) ? item.HtTotalPerItem : item.QuantityPerItem,
        description: item.ItemDescription,
        code: item.ItemCode,
        familyName: item.LabelItemFamily,
        familyIndex: familyData.length,
      });
    });

    const dataGlobal = {
      ['data']: data,
      ['familyData']: familyData
    };
    return dataGlobal;
  }
}
