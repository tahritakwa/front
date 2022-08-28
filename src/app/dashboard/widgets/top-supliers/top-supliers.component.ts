import { Component, OnInit, ElementRef, Input, NgZone, ViewChild, AfterViewInit, ViewChildren, QueryList } from '@angular/core';
import { period } from '../../../constant/shared/services.constant';
import { TopTiers } from '../../../models/dashboard/top-tiers.model';
import { DashboardService } from '../../services/dashboard.service';
import { TiersConstants } from '../../../constant/purchase/tiers.constant';
import { DashboardConstant } from '../../../constant/dashboard/dashboard.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { TranslateService } from '@ngx-translate/core';
import { pieChartOption, changeChartSize, setLabel } from '../../../shared/helpers/chart.helper';
import { LocalStorageService } from '../../../login/Authentification/services/local-storage-service';



const FORMAT_DATE = 'format_date';

@Component({
  selector: 'app-top-supliers',
  templateUrl: './top-supliers.component.html',
  styleUrls: ['./top-supliers.component.scss']
})
export class TopSupliersComponent implements OnInit, AfterViewInit {
  @ViewChildren(TiersConstants.TOP_SUPPLIERS_CHART) chartDiv: QueryList<ElementRef>;


  @Input() dateformat: any;
  @Input() FORMAT_NUMBER: any;
  @Input() currency: any;

  topSuppliersList: Array<TopTiers>;
  topSupplierLoading: boolean;
  hasTopSuppliersData: boolean;
  topSuppliersPeriod: string;
  topSuppliersStartDate: Date;
  topSuppliersEndDate: Date;
  supplierChart;
  topSupplierData: any;
  rankCriteria = true; // false : Qty | true : Amnt
  valueApperance = true; // false : Percent | true : Value
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
    this.ChangeTopSupplierChart(this.periodEnum);
  }
  // tslint:disable-next-line: use-life-cycle-interface
  ngAfterViewInit() {
    if (this.chartDiv) {
      this.chartDiv.changes.subscribe(({ first: elm }) => {
        if (elm) {
          this.supplierChart = this.echarts.init(elm.nativeElement);
          const supplierChartOption = pieChartOption(`${this.translate.instant('TOPSUPPLIERS')}`, this.topSupplierData,
            this.rankCriteria, this.userCurrencyCode, this.userCurrencySymbole, this.valueApperance, NumberConstant.EIGHTY + '%');
          this.supplierChart.setOption(supplierChartOption);
          setLabel(this.supplierChart);
          changeChartSize(this.supplierChart);
          this.supplierChart.on('click', function (params) {
            const currentTime = new Date().getTime();
            const tapLength = currentTime - this.lastTap;
            if (tapLength < NumberConstant.FIVE_HUNDRED && tapLength > NumberConstant.ZERO) {
              window.open(TiersConstants.SUPPLIER_ADVANCED_EDIT_URL + params.data.id);
            }
            this.lastTap = currentTime;
          });
        }
      });
    }
  }

  ChangeNumberOfRows(newNumber: number) {
    this.numberOfRows = newNumber;
    this.ChangeTopSupplierChart();
  }
  ChangeTopSupplierChart(periodEnum?: number) {
    this.clearTopSupplierChart();
    this.initTopSupplierChart(periodEnum);
    this.ngAfterViewInit();
  }

  clearTopSupplierChart() {
    this.topSuppliersList = null;
    this.hasTopSuppliersData = false;
  }

  changeRankCriteria(newRankCriteria: boolean) {
    this.rankCriteria = newRankCriteria;
    this.ChangeTopSupplierChart();
  }
  changeValueApperance(newRankCriteria: boolean) {
    this.valueApperance = newRankCriteria;
    this.ChangeTopSupplierChart();
  }

  initTopSupplierChart(periodEnum = this.periodEnum) {
    this.topSupplierLoading = true;
    this.periodEnum = periodEnum;
    this.topSuppliersPeriod = period[periodEnum];
    this.dashService.getKPIFromTopSupplierStoredProcedure( this.rankCriteria, this.numberOfRows, this.periodEnum).subscribe((data) => {
        this.initChart(data);
      });
  }

  initChart(data) {
    this.topSuppliersList = data;
    this.topSupplierData = this.getTopSupplierData(this.topSuppliersList);
    if (this.topSuppliersList.length > NumberConstant.ZERO) {
      this.hasTopSuppliersData = true;
      this.topSuppliersStartDate = this.topSuppliersList[NumberConstant.ZERO].StartPeriod;
      this.topSuppliersEndDate = this.topSuppliersList[NumberConstant.ZERO].EndPeriod;
    } else {
      this.clearTopSupplierChart();
    }
    this.topSupplierLoading = false;
  }

  getTopSupplierData(listTopSuppliers: Array<TopTiers>): any {
    const data: Array<{ id: number, value: number, name: string, selected: boolean }> = Array();
    listTopSuppliers.forEach((supplier) => data.push({
      id: supplier.IdTiers,
      value: (this.rankCriteria) ? supplier.TTCAmount : supplier.Quantity,
      name: supplier.TiersName,
      selected: (((this.rankCriteria) ? supplier.RankByTTCAmount : supplier.RankByQuantity) === NumberConstant.ONE) ? true : false
    }));
    return data;
  }

}
