import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DataStateChangeEvent, GridDataResult, PageChangeEvent, PagerSettings } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { Observable } from 'rxjs/Observable';
import { CompanyService } from '../../../../administration/services/company/company.service';
import { ReportingConstant } from '../../../../constant/accounting/reporting.constant';
import { SharedConstant } from '../../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../../constant/utility/number.constant';
import { ReducedCurrency } from '../../../../models/administration/reduced-currency.model';
import { GridSettings } from '../../../../shared/utils/grid-settings.interface';
import { ReportingService } from '../../../services/reporting/reporting.service';
import NumberFormatOptions = Intl.NumberFormatOptions;
@Component({
  selector: 'app-detail-journal-centralisation-by-month',
  templateUrl: './detail-journal-centralisation-by-month.component.html',
  styleUrls: ['./detail-journal-centralisation-by-month.component.scss']
})
export class DetailJournalCentralisationByMonthComponent implements OnInit {

  public formatDate = this.translate.instant(SharedConstant.DATE_FORMAT);
  @Input() public journal: any;
  @Input() public journalDetails: any;
  public totalDebitAmount=0;
  public totalCreditAmount=0;

  public view: Observable<GridDataResult>;
  public pageSize = SharedConstant.DEFAULT_ITEMS_NUMBER;
  public currentPage = NumberConstant.ZERO;
  public currencyCode: string;

  public gridState: State = {
    skip: NumberConstant.ZERO,
    take: this.pageSize,
    filter: {
      logic: 'and',
      filters: []
    }
  };
  public formatNumberOptions: NumberFormatOptions;

  public gridSettings: GridSettings = {
    state: this.gridState
  };


  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;

  constructor(private reportingService: ReportingService, private companyService: CompanyService, private translate: TranslateService) { }
  private setSelectedCurrency(currency: ReducedCurrency) {
    this.formatNumberOptions = {
      style: 'decimal',
      maximumFractionDigits: currency.Precision,
      minimumFractionDigits: currency.Precision
    };
  }
  public ngOnInit(): void {
    this.companyService.getDefaultCurrencyDetails().subscribe((currency: ReducedCurrency)=> {
      this.setSelectedCurrency(currency);
      this.currencyCode = currency.Code;
    });
    this.LoadAccountDetailsOnSearch();
  }

  private LoadAccountDetailsOnSearch() {
    this.totalDebitAmount = this.journalDetails.debitAmount;
    this.totalCreditAmount = this.journalDetails.creditAmount;
    this.reportingService.getJavaGenericService().getEntityList(ReportingConstant.CENTRALIZING_OF_JOURNALS_DETAILS_BY_MONTH +
      `?&breakingAccount=${this.journal.breakingAccount}&breakingCustomerAccount=${this.journal.breakingCustomerAccount}` +
      `&breakingSupplierAccount=${this.journal.breakingSupplierAccount}&endDate=${this.journal.endDate}` +
      `&journalId=${this.journal.journalId}&page=${this.currentPage}&size=${this.pageSize}&startDate=${this.journal.startDate}` +
      `&month=${this.journalDetails.month}`)
      .subscribe((journalDetails: any) => {

        this.gridSettings.gridData = { data: journalDetails.content, total: journalDetails.totalElements};
      });
  }

  public dataStateChange(state: DataStateChangeEvent): void {
    this.gridSettings.state = state;
  }

  onPageChange(event: PageChangeEvent) {
    this.currentPage = (event.skip) / this.pageSize;
    this.pageSize = event.take;
    this.LoadAccountDetailsOnSearch();
  }
}

