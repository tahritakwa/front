import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DataStateChangeEvent, GridDataResult, PagerSettings } from '@progress/kendo-angular-grid';
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
  selector: 'app-detail-journal-centralisation',
  templateUrl: './detail-journal-centralisation.component.html',
  styleUrls: ['./detail-journal-centralisation.component.scss']
})
export class DetailJournalCentralisationComponent implements OnInit {

  public formatDate = this.translate.instant(SharedConstant.DATE_FORMAT);
  @Input() public journal: any;
  public totalAmount: number;
  public totalDebitAmount=0;
  public totalCreditAmount=0;

  public view: Observable<GridDataResult>;
  public currencyCode: string;

  public gridState: State = {
    skip: NumberConstant.ZERO,
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
    this.companyService.getDefaultCurrencyDetails().subscribe((currency: ReducedCurrency) => {
      this.setSelectedCurrency(currency);
      this.currencyCode = currency.Code;
    });
    this.LoadAccountDetailsOnSearch();
  }

  private LoadAccountDetailsOnSearch() {
    this.totalAmount = this.journal.totalAmount;
    this.totalDebitAmount = this.journal.debitJournal;
    this.totalCreditAmount = this.journal.creditJournal;
    this.reportingService.getJavaGenericService().getEntityList(ReportingConstant.CENTRALIZING_OF_JOURNALS_DETAILS +
      `?&breakingAccount=${this.journal.breakingAccount}&breakingCustomerAccount=${this.journal.breakingCustomerAccount}` +
      `&breakingSupplierAccount=${this.journal.breakingSupplierAccount}&endDate=${this.journal.endDate}` +
      `&journalId=${this.journal.journalId}&startDate=${this.journal.startDate}`)
      .subscribe((journalDetails: any) => {
        this.gridSettings.gridData = { data: journalDetails, total: journalDetails.length };
      });
  }

  public dataStateChange(state: DataStateChangeEvent): void {
    this.gridSettings.state = state;
  }

}
