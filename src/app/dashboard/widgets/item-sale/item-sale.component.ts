import { DashboardConstant } from './../../../constant/dashboard/dashboard.constant';
import { PurchaseSaleItem } from './../../../models/dashboard/purchase-sale-item.model';
import { NumberConstant } from './../../../constant/utility/number.constant';
import { Component, OnInit, Input, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { period } from '../../../constant/shared/services.constant';
import { TranslateService } from '@ngx-translate/core';
import { setLabel, changeChartSize, familyBarChartOption } from '../../../shared/helpers/chart.helper';
import { LocalStorageService } from '../../../login/Authentification/services/local-storage-service';


@Component({
  selector: 'app-item-sale',
  templateUrl: './item-sale.component.html',
  styleUrls: ['./item-sale.component.scss']
})
export class ItemSaleComponent implements OnInit {

  @ViewChildren(DashboardConstant.ITEM_SALE_CHART) chartDiv: QueryList<ElementRef>;
  @Input() currency: any;
  @Input() dateformat: any;
  @Input() FORMAT_NUMBER: any;

  public itemSaleList: Array<PurchaseSaleItem>;
  public itemSaleDataLoading: boolean;
  public hasItemSaleData: boolean;
  public itemSalePeriod: string;
  public itemSaleStartDate: Date;
  public itemSaleEndDate: Date;
  public itemSaleChart;
  rankCriteria = true; // false : Qty || true : Amnt
  numberOfRows = NumberConstant.FIVE;
  isUpButtonVisible = true;
  isDownButtonVisible = true;
  echarts = require('echarts');
  periodEnum = DashboardConstant.DEFAULT_PERIOD_ENUM;
  operationType = DashboardConstant.OPERATION_TYPE_SALE;
  itemSaleData: any;
  userCurrencyCode: any;
  userCurrencySymbole: any;


  constructor(public dashService: DashboardService, private translate: TranslateService, private localStorageService : LocalStorageService) {
    this.userCurrencyCode = this.localStorageService.getCurrencyCode();
    this.userCurrencySymbole = this.localStorageService.getCurrencySymbol();
  }

  ngOnInit() {
    this.ChangeItemSaleChart(this.periodEnum);
  }

  ChangeItemSaleChart(periodEnum?: number) {
    this.clearItemSalesVolumeCharts();
    this.initItemSalesVolumeChart(periodEnum);
    this.ngAfterViewInit();
  }

  // tslint:disable-next-line: use-life-cycle-interface
  ngAfterViewInit() {
    if (this.chartDiv ) {
      this.chartDiv.changes.subscribe(({ first: elm }) => {
        if (elm && this.itemSaleData) {
          this.itemSaleChart = this.echarts.init(elm.nativeElement);
          const itemSaleChartOption = familyBarChartOption(`${this.translate.instant('ITEM_SALE')}`, this.itemSaleData,
            this.itemSaleList ? this.itemSaleList.length : this.numberOfRows, this.rankCriteria, this.userCurrencyCode, this.userCurrencySymbole, this.translate);
          this.itemSaleChart.setOption(itemSaleChartOption);
          setLabel(this.itemSaleChart);
          changeChartSize(this.itemSaleChart);
        }
      });
    }
  }

  clearItemSalesVolumeCharts() {
    this.itemSaleList = null;
    this.hasItemSaleData = false;
  }


  ChangeNumberOfRows(newNumber: number) {
    this.numberOfRows = newNumber;
    this.ChangeItemSaleChart();
  }

  changeRankCriteria(newRankCriteria: boolean) {
    this.rankCriteria = newRankCriteria;
    this.ChangeItemSaleChart();
  }
  initItemSalesVolumeChart(periodEnum = this.periodEnum) {
    this.itemSaleDataLoading = true;
    this.periodEnum = periodEnum;
    this.itemSalePeriod = period[periodEnum];
    this.dashService.getKPIFromItemSaleStoredProcedure(this.rankCriteria, this.numberOfRows, periodEnum).subscribe((data) => {
        this.initChart(data);
      });
  }
  initChart(data: any) {
    this.itemSaleList = data;
    if (this.itemSaleList.length > NumberConstant.ZERO) {
      this.hasItemSaleData = true;
      this.itemSaleStartDate = this.itemSaleList[NumberConstant.ZERO].StartPeriod;
      this.itemSaleEndDate = this.itemSaleList[NumberConstant.ZERO].EndPeriod;
      this.itemSaleData = this.getItemSaleData(this.itemSaleList);
    } else {
      this.clearItemSalesVolumeCharts();
    }
    this.itemSaleDataLoading = false;
  }
  getItemSaleData(itemSaleList: PurchaseSaleItem[]): any {
    const data: Array<{ value: number, description: string, code: string, familyName: string, familyIndex: number }> = Array();
    let familyData = Array();
    itemSaleList.sort((a: PurchaseSaleItem, b: PurchaseSaleItem) =>
      (a.LabelItemFamily > b.LabelItemFamily) ? NumberConstant.ONE : NumberConstant.MINUS_ONE);

    itemSaleList.forEach(item => {
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
