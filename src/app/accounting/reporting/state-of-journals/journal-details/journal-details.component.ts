import { Component, Input, OnInit } from '@angular/core';
import { SharedConstant } from '../../../../constant/shared/shared.constant';
import { Observable } from 'rxjs/Observable';
import { DataStateChangeEvent, GridDataResult, PageChangeEvent, PagerSettings } from '@progress/kendo-angular-grid';
import { NumberConstant } from '../../../../constant/utility/number.constant';
import { State } from '@progress/kendo-data-query';
import { GridSettings } from '../../../../shared/utils/grid-settings.interface';
import { ReportingConstant } from '../../../../constant/accounting/reporting.constant';
import { ReportingService } from '../../../services/reporting/reporting.service';
import {CompanyService} from '../../../../administration/services/company/company.service';
import {Currency} from '../../../../models/administration/currency.model';
import NumberFormatOptions = Intl.NumberFormatOptions;
import {GenericAccountingService} from '../../../services/generic-accounting.service';
import { ReducedCurrency } from '../../../../models/administration/reduced-currency.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-state-of-journals-journal-details',
  templateUrl: './journal-details.component.html',
  styleUrls: ['./journal-details.component.scss']
})
export class StateOfJournalsJournalDetailsComponent implements OnInit {

  public formatDate = this.translate.instant(SharedConstant.DATE_FORMAT);
  @Input() public journal: any;
  public totalAmount: number;
  public journalDetails: any;

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

  public sortParams = '';
  public spinner=false;
  constructor(private reportingService: ReportingService, private companyService: CompanyService,
    private genericAccountingService: GenericAccountingService, private translate: TranslateService) { }

  private setSelectedCurrency(currency: ReducedCurrency) {
    this.formatNumberOptions = {
      style: 'decimal',
      maximumFractionDigits: currency.Precision,
      minimumFractionDigits: currency.Precision
    };
  }
  public ngOnInit(): void {
    this.companyService.getDefaultCurrencyDetails().subscribe((currency: ReducedCurrency) => {
      this.setSelectedCurrency(currency);
      this.currencyCode = currency.Code;
    });
    this.LoadAccountDetailsOnSearch();
  }

  public sortChange() {
    this.currentPage = 0;
    this.gridSettings.state.skip = this.currentPage;
    this.LoadAccountDetailsOnSearch();
  }
  private LoadAccountDetailsOnSearch() {
    this.spinner = true;
    this.totalAmount = this.journal.totalAmount;
    this.journalDetails = [];
    this.reportingService.getJavaGenericService().getEntityList(ReportingConstant.STATE_OF_JOURNALS_DETAILS +
      `/${this.journal.journalId}?page=${this.currentPage}&size=${this.pageSize}${this.sortParams}&startDate=${this.journal.startDate}&endDate=${this.journal.endDate}`)
      .subscribe((accountDetails: any) => {
        this.spinner = true;
        accountDetails.content.forEach(element => {
          this.journalDetails.push(element);
        });
        this.gridSettings.gridData = { data: this.journalDetails, total: accountDetails.totalElements };
      }, () => {}, () => {
        this.spinner = false;
      });
  }

  public dataStateChange(state: DataStateChangeEvent): void {
    this.gridSettings.state = state;
    this.currentPage = (state.skip) / this.pageSize;
    this.pageSize = state.take;
    this.sortParams = this.genericAccountingService.getSortParams(state.sort);
  }

  onPageChange(event: PageChangeEvent) {
    this.currentPage = (event.skip) / this.pageSize;
    this.pageSize = event.take;
    this.LoadAccountDetailsOnSearch();
  }
}
