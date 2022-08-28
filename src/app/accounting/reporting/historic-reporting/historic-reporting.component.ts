import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HistoryService} from '../../services/history/history.service';
import {State} from '@progress/kendo-data-query';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {GridSettings} from '../../../shared/utils/grid-settings.interface';
import {ColumnSettings} from '../../../shared/utils/column-settings.interface';
import {ReportingConstant} from '../../../constant/accounting/reporting.constant';
import NumberFormatOptions = Intl.NumberFormatOptions;
import {CompanyService} from '../../../administration/services/company/company.service';
import {TranslateService} from '@ngx-translate/core';
import { ReducedCurrency } from '../../../models/administration/reduced-currency.model';
import {StyleConfigService} from '../../../shared/services/styleConfig/style-config.service';
import {AuthService} from '../../../login/Authentification/services/auth.service';

@Component({
  selector: 'app-historic-reporting',
  templateUrl: './historic-reporting.component.html',
  styleUrls: ['./historic-reporting.component.scss']
})
export class HistoricReportingComponent implements OnInit {

  public reportType;
  private pageSize = NumberConstant.TEN;
  public formatNumberOptions: NumberFormatOptions;
  public previousFiscalYearLabel = '-';
  public currentFiscalYearLabel = '-';
  public reportListUrl = ReportingConstant.REPORT_LIST_URL;
  public gridState: State = {
    skip: NumberConstant.ZERO,
    take: this.pageSize,
    filter: {
      logic: 'and',
      filters: []
    }
  };
  public columnsConfig: ColumnSettings[] = ReportingConstant.REPORTS_DEFAULT_COLUMNS_CONFIG;
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };
  constructor(private historyService: HistoryService, private activatedRoute: ActivatedRoute,
              private companyService: CompanyService,  private translate: TranslateService,
              private styleConfigService: StyleConfigService, private router: Router) { }
  ngOnInit() {
    this.reportType = this.activatedRoute.snapshot.params.reportType;
    this.setFormatNumberOptions();
    this.initGridData(this.gridState.skip);
  }
  private setFormatNumberOptions() {
    this.companyService.getDefaultCurrencyDetails().subscribe((currency: ReducedCurrency) => {
      this.formatNumberOptions = {
        style: 'decimal',
        maximumFractionDigits: currency.Precision,
        minimumFractionDigits: currency.Precision
      };
     // this.currencyCode = currency.Code;
    });
  }
  public initGridData(page: number) {
    this.historyService.getJavaGenericService().getData(`historic-line-report-type` +
      '?reportType=' + this.reportType + '&page=' + page + '&size=' + NumberConstant.TEN
    ).subscribe(
      (data) => {
        if (data) {
          this.assignDataToGrid(data);
        }
      });
  }

  assignDataToGrid(data) {
    data.map(reportLine => {
      const signValues = [{ negative: false, status: `${this.translate.instant(ReportingConstant.POSITIVE)}` },
        { negative: true, status: `${this.translate.instant(ReportingConstant.NEGATIVE)}` }];

      if (reportLine.negative === true) {
        reportLine.negative = signValues[1].status;
      } else if (reportLine.negative === false) {
        reportLine.negative = signValues[0].status;
      }
    });

    this.gridSettings.gridData = data;
    this.previousFiscalYearLabel = data[0].previousFiscalYear;
    this.currentFiscalYearLabel = data[0].fiscalYear.name;
  }

  getFooterClass(): string {
    return this.styleConfigService.getFooterClassSettingLayoutAddComponent();
  }

  public goToList() {
    this.router.navigateByUrl(this.reportListUrl);
  }
}
