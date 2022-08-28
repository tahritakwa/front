import { Component, OnInit, Input } from '@angular/core';
import { SharedConstant } from '../../../../constant/shared/shared.constant';
import { GridSettings } from '../../../../shared/utils/grid-settings.interface';
import { NumberConstant } from '../../../../constant/utility/number.constant';
import { Observable } from 'rxjs';
import { GridDataResult, PageChangeEvent, DataStateChangeEvent, PagerSettings } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { ReportingConstant } from '../../../../constant/accounting/reporting.constant';
import { ReportingService } from '../../../services/reporting/reporting.service';
import { CompanyService } from '../../../../administration/services/company/company.service';
import { NumberFormatOptions } from '@progress/kendo-angular-intl';
import {GenericAccountingService} from '../../../services/generic-accounting.service';
import { ReducedCurrency } from '../../../../models/administration/reduced-currency.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-auxiliary-journal-details',
  templateUrl: './auxiliary-journal-details.component.html',
  styleUrls: ['./auxiliary-journal-details.component.scss']
})
export class AuxiliaryJournalDetailsComponent implements OnInit {

  public formatDate = this.translate.instant(SharedConstant.DATE_FORMAT);
  @Input() public auxiliaryJournal: any;

  public auxiliaryJournalDetails: any;
  public totalCreditAmount: number;
  public totalDebitAmount: number;

  public view: Observable<GridDataResult>;
  public pageSize = SharedConstant.DEFAULT_ITEMS_NUMBER;
  public currentPage = NumberConstant.ZERO;
  public currencyCode: string;
  public formatNumberOptions: NumberFormatOptions;

  public sortParams = '';
  constructor(private reportingService: ReportingService, private companyService: CompanyService,
    private genericAccountingService: GenericAccountingService, private translate: TranslateService) { }

  public gridState: State = {
    skip: NumberConstant.ZERO,
    take: this.pageSize,
    filter: {
      logic: 'and',
      filters: []
    }
  };

  public gridSettings: GridSettings = {
    state: this.gridState
  };

  private setSelectedCurrency(currency: ReducedCurrency) {
    this.formatNumberOptions = {
      style: 'decimal',
      maximumFractionDigits: currency.Precision,
      minimumFractionDigits: currency.Precision
    };
  }

  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;

  public dataStateChange(state: DataStateChangeEvent): void {
    this.gridSettings.state = state;
    this.currentPage = (state.skip) / this.pageSize;
    this.pageSize = state.take;
    this.sortParams = this.genericAccountingService.getSortParams(state.sort);
  }

  loadAuxiliaryJournalDetailsOnSearch() {
    this.totalDebitAmount = this.auxiliaryJournal.totalDebit;
    this.totalCreditAmount = this.auxiliaryJournal.totalCredit;
    this.auxiliaryJournalDetails = [];
    this.reportingService.getJavaGenericService().getEntityList(ReportingConstant.STATE_OF_AUXILIARY_JOURNALS_DETAILS +
      `/${this.auxiliaryJournal.journalId}?page=${this.currentPage}&size=${this.pageSize}${this.sortParams}&startDate=${this.auxiliaryJournal.startDate}&endDate=${this.auxiliaryJournal.endDate}`)
      .subscribe((auxiliaryJournalDetails: any) => {
        auxiliaryJournalDetails.content.forEach(auxiliaryJournalDetail => {
          this.auxiliaryJournalDetails.push(auxiliaryJournalDetail);
        });
        this.gridSettings.gridData = { data: this.auxiliaryJournalDetails, total: auxiliaryJournalDetails.totalElements };
      });
  }

  onPageChange(event: PageChangeEvent) {
    this.currentPage = (event.skip) / this.pageSize;
    this.pageSize = event.take;
    this.loadAuxiliaryJournalDetailsOnSearch();
  }

  public sortChange() {
    this.currentPage = 0;
    this.gridSettings.state.skip = this.currentPage;
    this.loadAuxiliaryJournalDetailsOnSearch();
  }

  ngOnInit() {
    this.companyService.getDefaultCurrencyDetails().subscribe((currency: ReducedCurrency) => {
      this.setSelectedCurrency(currency);
      this.currencyCode = currency.Code;
    });
    this.loadAuxiliaryJournalDetailsOnSearch();
  }

}
