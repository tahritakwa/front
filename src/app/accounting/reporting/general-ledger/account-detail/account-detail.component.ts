import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DataStateChangeEvent, PageChangeEvent, PagerSettings} from '@progress/kendo-angular-grid';
import {State} from '@progress/kendo-data-query';
import {GridSettings} from '../../../../shared/utils/grid-settings.interface';
import {ReportingConstant} from '../../../../constant/accounting/reporting.constant';
import {ReportingService} from '../../../services/reporting/reporting.service';
import {NumberConstant} from '../../../../constant/utility/number.constant';
import {SharedConstant} from '../../../../constant/shared/shared.constant';
import {CompanyService} from '../../../../administration/services/company/company.service';
import {Currency} from '../../../../models/administration/currency.model';
import NumberFormatOptions = Intl.NumberFormatOptions;
import {Router} from '@angular/router';
import {DocumentAccountConstant} from '../../../../constant/accounting/document-account.constant';
import {GenericAccountingService} from '../../../services/generic-accounting.service';
import { ReducedCurrency } from '../../../../models/administration/reduced-currency.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-account-detail',
  templateUrl: './account-detail.component.html',
  styleUrls: ['./account-detail.component.scss']
})
export class AccountDetailComponent implements OnInit {
  public formatDate = this.translate.instant(SharedConstant.DATE_FORMAT);
  @Input() public account: any;
  @Input() public beginAmount: any;
  @Input() public endAmount: any;
  @Input() public amount: any;
  @Input() public searchOnDetailsIsEnabled: boolean;
  @Input() public letteringOperationType: any;
  @Input()  field: string;
  @Input()  direction: string;
  @Output() sortParamEmit = new EventEmitter<any>();
  public totalDebit: number;
  public totalCredit: number;
  public totalBalance: number;
  public accountDetails = [];
  public pageSize = SharedConstant.DEFAULT_ITEMS_NUMBER;
  public currentPage = NumberConstant.ZERO;
  public currencyCode: string;
  public sortParams = null;

  public gridState: State = {
    skip: NumberConstant.ZERO,
    take: this.pageSize,
    filter: {
      logic: 'and',
      filters: []
    }
  };
  public formatNumberOptions: NumberFormatOptions;

  constructor(private reportingService: ReportingService, private companyService: CompanyService,
              private genericAccountingService: GenericAccountingService, private router: Router,
              private translate: TranslateService) {
  }

  public gridSettings: GridSettings = {
    state: this.gridState
  };

  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;

  public ngOnInit(): void {
    this.companyService.getDefaultCurrencyDetails().subscribe((currency: ReducedCurrency) => {
      this.setSelectedCurrency(currency);
      this.currencyCode = currency.Code;

    });
    this.initSortDataGrid();
    this.loadAccountDetailsOnSearch();
  }

  private loadAccountDetailsOnSearch() {
    if (this.searchOnDetailsIsEnabled === true) {
      this.totalDebit = this.account.debit;
      this.totalCredit = this.account.credit;
      this.totalBalance = this.account.balance;
      this.accountDetails = [];
      if (!this.genericAccountingService.isNullAndUndefinedAndEmpty(this.amount )) {
        this.beginAmount = this.amount;
        this.endAmount = this.amount;
      }
      this.reportingService.getJavaGenericService().getEntityList(`${ReportingConstant.GENERAL_LEDGER_DETAILS}` +
        `/${this.account.accountId}?page=${this.currentPage}&size=${this.pageSize}&startDate=${this.account.startDate}` +
        `&endDate=${this.account.endDate}` + `&beginAmount=${this.beginAmount}&endAmount=${this.endAmount}` +
        `&letteringOperationType=${this.letteringOperationType}&field=${this.sortParams.field}&direction=${this.sortParams.direction}`)
        .subscribe((accountDetails: any) => {
          accountDetails.content.forEach(element => {
            this.accountDetails.push(element);
          });
          this.gridSettings.gridData = {data: this.accountDetails, total: accountDetails.totalElements};
        });
    }
  }

  public dataStateChange(state: DataStateChangeEvent): void {
    this.gridSettings.state = state;
  }

  onPageChange(event: PageChangeEvent) {
    this.currentPage = (event.skip) / this.pageSize;
    this.pageSize = event.take;
    this.loadAccountDetailsOnSearch();
  }

  redirectTo(dataItem) {
    const url = this.router.serializeUrl(this.router.createUrlTree([DocumentAccountConstant.DOCUMENT_ACCOUNT_EDIT_URL.concat(dataItem.documentAccountId)],
      {queryParams: {id: dataItem.documentAccountLineId}}));
    window.open(url, '_blank');
  }

  private setSelectedCurrency(currency: ReducedCurrency) {
    this.formatNumberOptions = {
      style: 'decimal',
      maximumFractionDigits: currency.Precision,
      minimumFractionDigits: currency.Precision
    };
  }

  public sortChange() {
    this.currentPage = NumberConstant.ZERO;
    this.initSortDataGrid();
    this.loadAccountDetailsOnSearch();
  }

  initSortDataGrid() {
    if (this.gridSettings.state.sort && this.gridSettings.state.sort.length > 0) {
      this.sortParams = {
        field: this.gridSettings.state.sort[NumberConstant.ZERO].field,
        direction: this.gridSettings.state.sort[NumberConstant.ZERO].dir === undefined ? '' : this.gridSettings.state.sort[NumberConstant.ZERO].dir
      };
    } else {
      this.sortParams = {
        field: this.field,
        direction: this.direction
      };
      if (!this.genericAccountingService.isNullAndUndefinedAndEmpty(this.field) &&
        !this.genericAccountingService.isNullAndUndefinedAndEmpty(this.direction)) {
        this.gridSettings.state.sort = [{field: this.field, dir: this.direction === 'acs' ? 'asc' : 'desc'}];
      }
    }
    this.sortParamEmit.emit(this.sortParams);
  }

}

