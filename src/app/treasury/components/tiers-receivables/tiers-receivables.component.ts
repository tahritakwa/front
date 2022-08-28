import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { PagerSettings, DataStateChangeEvent, GridComponent } from '@progress/kendo-angular-grid';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { State, DataResult } from '@progress/kendo-data-query';
import { PredicateFormat, Operation, Filter, Operator } from '../../../shared/utils/predicate';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { TreasuryConstant } from '../../../constant/treasury/treasury.constant';
import { CustomerOutstandingService } from '../../services/customer-outstanding.service';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { Currency } from '../../../models/administration/currency.model';
import { TiersTypeEnumerator } from '../../../models/enumerators/tiers-type.enum';
import { OutstandingDocumentTypeEnumerator } from '../../../models/enumerators/outstanding-document-type.enum';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { CompanyService } from '../../../administration/services/company/company.service';
import { LanguageService } from '../../../shared/services/language/language.service';
import { TranslateService } from '@ngx-translate/core';
import {LocalStorageService} from '../../../login/Authentification/services/local-storage-service';

@Component({
  selector: 'app-tiers-receivables',
  templateUrl: './tiers-receivables.component.html',
  styleUrls: ['./tiers-receivables.component.scss']
})
export class TiersReceivablesComponent implements OnInit {
  @ViewChild('grid') grid: GridComponent;
  @Input() tiersType;
  public placeholderCustomer = SharedConstant.CHOOSE_CUSTOMER_PLACEHOLDER;
  public placeholderSupplier = SharedConstant.CHOOSESUPPLIER;
  public deadlineDate = new Date();
  // FormGroup
  searchFormGroup: FormGroup;
  apiForExport = TreasuryConstant.GET_TIERS_RECEIVABLES_FOR_EXPORT;
  // PagerSettings
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;

  // formatDate
  dateFormat = this.translate.instant(SharedConstant.DATE_FORMAT);

  OverduePaymentstate: State;
  numberOfInvoices = NumberConstant.TEN;
  public expandedDetailKeys: any[] = [];
  private predicate: PredicateFormat;
  public documentType = OutstandingDocumentTypeEnumerator;
  SumOfTotalAmount = 0;
  SumOfTotalOverduePaymentAmount = 0;
  SumOfTurnOver = 0;
  tiersTypeEnum = TiersTypeEnumerator;
  // grid state
  gridState: State = {
    skip: 0,
    take: 20,
    filter: {
      logic: 'and',
      filters: []
    }
  };

  public columnsConfig: ColumnSettings[] = [
    {
      field: TreasuryConstant.CODE_TIERS_FIELD,
      title: TreasuryConstant.CODE,
      tooltip: this.getTiersCode(),
      filterable: true
    },
    {
      field: TreasuryConstant.TIERS_NAME_FIELD,
      title: this.getTiersTitle(),
      tooltip: this.getTiersTitle(),
      filterable: true
    },
    {
      field: TreasuryConstant.TOTAL_AMOUNT_WITH_CURRENCY,
      title: TreasuryConstant.ROYALTYFEE_TITLE,
      tooltip: TreasuryConstant.ROYALTYFEE_TITLE,
      filterable: true
    },
    {
      field: TreasuryConstant.TOTAL_OVERDUE_PAYMENT_AMOUNT_WITH_CURRENCY,
      title: TreasuryConstant.OVERDUE_PAYMENT_TITLE,
      tooltip: TreasuryConstant.TOTAL_OVERDUE_PAYMENT_TITLE,
      filterable: true
    },
    {
      field: TreasuryConstant.TOTAL_TURN_OVER_WITH_CURRENCY,
      title: TreasuryConstant.TURNOVER_TITLE,
      tooltip: TreasuryConstant.TURNOVER_TIERS,
      filterable: true
    }
  ];

  // financial commitement columns settings
  public financialcolumnsConfig: ColumnSettings[] = [
    {
      field: TreasuryConstant.CODE_DOCUMENT,
      title: TreasuryConstant.CODE,
      filterable: false
    },
    {
      field: TreasuryConstant.COMMITMENT_DATE,
      title: TreasuryConstant.COMMITMENT_DATE_TITLE,
      filterable: true
    },
    {
      field: TreasuryConstant.AMOUNT_WITH_CURRENCY,
      title: TreasuryConstant.TOTAL_AMOUNT_UPPERCASE,
      filterable: false
    },
    {
      field: TreasuryConstant.REMAINING_AMOUNT_WITH_CURRENCY,
      title: TreasuryConstant.UNPAID_AMOUNT_TITLE,
      filterable: false
    }
  ];

  gridData: DataResult = new Object() as DataResult;

  gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
    gridData: this.gridData
  };

  userCurrency: Currency;
  language: string;
  predicateForExport: PredicateFormat;
  // Boolean Value
  unpaidFinancialCommitment = true;
  deliveryFormNotBilled = true;

  constructor(private fb: FormBuilder, public customerOutstandingService: CustomerOutstandingService,
    private companyService: CompanyService, private localStorageService : LocalStorageService, private translate: TranslateService) {
    this.language = this.localStorageService.getLanguage();
  }

  ngOnInit() {
    this.companyService.getCurrentCompany().subscribe(company => {
      this.userCurrency = company.IdCurrencyNavigation;
    });
    this.createFormGroup();
    this.initGridDataSource();
    this.preparePredicateForExport();
  }

  getTiersCode(): string {
    return this.tiersType === this.tiersTypeEnum.Customer ? TreasuryConstant.CODE_CLIENT : TreasuryConstant.CODE_SUPPLIER;
  }

  getTiersTitle(): string {
    return this.tiersType === this.tiersTypeEnum.Customer ? TreasuryConstant.CLIENT : TreasuryConstant.SUPPLIER;
  }

  initialiseStateOfFinancialCommitment() {
    this.OverduePaymentstate = {
      skip: 0,
      take: 10,
      filter: {
        logic: 'and',
        filters: []
      }
    };
  }

  public createFormGroup() {
    this.searchFormGroup = this.fb.group({
      IdTiers: [undefined],
      StartDate: [undefined],
      EndDate: [undefined],
    });
  }

  initGridDataSource() {
    this.grid.loading = true;
    const data = this.searchFormGroup.getRawValue();
    const page = (this.gridSettings.state.skip / this.gridSettings.state.take) + NumberConstant.ONE;
    this.customerOutstandingService.getTiersReceivables(data, page, this.gridSettings.state.take, this.tiersType,
      this.deliveryFormNotBilled, this.unpaidFinancialCommitment)
      .subscribe(res => {
        this.gridSettings.gridData = new Object() as DataResult;
        this.gridSettings.gridData.data = res.Data;
        this.gridSettings.gridData.total = res.Total;
        this.SumOfTotalAmount = res.SumOfTotalAmount;
        this.SumOfTotalOverduePaymentAmount = res.SumOfTotalOverduePaymentAmount;
        this.SumOfTurnOver = res.SumOfTurnOver;
        this.grid.loading = false;
      });
  }

  preparePredicateForExport() {
    const formGroupData = this.searchFormGroup.getRawValue();
    this.predicateForExport = new PredicateFormat();
    this.predicateForExport.Filter = new Array<Filter>();
    this.predicateForExport.Filter.push(new Filter(TreasuryConstant.ID_TIERS, Operation.eq, formGroupData.IdTiers));
    this.predicateForExport.Filter.push(new Filter(TreasuryConstant.START_DATE, Operation.eq, formGroupData.StartDate));
    this.predicateForExport.Filter.push(new Filter(TreasuryConstant.END_DATE, Operation.eq, formGroupData.EndDate));
    this.predicateForExport.Filter.push(new Filter(TreasuryConstant.TIERS_TYPE, Operation.eq, this.tiersType));
    this.predicateForExport.Filter.push(new Filter(TreasuryConstant.DELIVERY_FORM_NOT_BILLED, Operation.eq, this.deliveryFormNotBilled));
    this.predicateForExport.Filter.push(new Filter(TreasuryConstant.UN_PAID_FINANCIAL_COMMITMENT,
      Operation.eq, this.unpaidFinancialCommitment));
  }

  // Check if start date is greater than end date
  public changeStartDate() {
    if (this.StartDate.value && this.EndDate.value && this.StartDate.value > this.EndDate.value) {
      this.EndDate.setValue(this.StartDate.value);
    }
  }

  // Check if end date is less than start date
  public changeEndDate() {
    if (this.StartDate.value && this.EndDate.value && this.EndDate.value < this.StartDate.value) {
      this.StartDate.setValue(this.EndDate.value);
    }
  }

  dataStateChange(state: DataStateChangeEvent) {
    this.closeExpandedRows(this.gridSettings);
    this.gridSettings.state = state;
    this.initGridDataSource();
  }

  public doSearch() {
    this.closeExpandedRows(this.gridSettings);
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.initGridDataSource();
    this.preparePredicateForExport();
  }

  showOverDuePaymentFinancialCommitmentPaymentDetails(dataItem, rowIndex) {
    if (this.expandedDetailKeys.indexOf(rowIndex) > -1) {
      this.grid.collapseRow(rowIndex);
      this.expandedDetailKeys.splice(this.expandedDetailKeys.indexOf(rowIndex), NumberConstant.ONE);
    } else {
      this.predicate = new PredicateFormat();
      this.predicate.Operator = Operator.and;
      this.predicate.Filter = new Array<Filter>();
      this.predicate.Filter.push(new Filter(TreasuryConstant.ID_TIERS, Operation.eq, dataItem.IdTiers));
      this.predicate.Filter.push(new Filter(TreasuryConstant.COMMITMENT_DATE, Operation.lt, new Date()));
      this.initialiseStateOfFinancialCommitment();
      this.getoverDueData(dataItem);
      this.grid.expandRow(rowIndex);
      this.expandedDetailKeys.push(rowIndex);
    }
  }


  onCollapseDetail({ dataItem, rowIndex }: any) {
    this.grid.collapseRow(rowIndex);
    this.expandedDetailKeys.splice(this.expandedDetailKeys.indexOf(rowIndex), NumberConstant.ONE);
  }


  OverDuedataStateChange(state: DataStateChangeEvent, dataItem) {
    this.OverduePaymentstate = state;
    this.getoverDueData(dataItem);
  }

  getoverDueData(dataItem) {
    this.customerOutstandingService
      .financialCommitmentInReceivableExpandedRows(this.OverduePaymentstate, this.predicate, this.tiersType, null)
      .subscribe(res => {
        dataItem.outstandingDocument = res.Data;
        dataItem.outstandingDocumentSize = res.Data.length;
      });
  }

  private closeExpandedRows(gridSettings: GridSettings) {
    if (gridSettings.state) {
      gridSettings.gridData.data.forEach((item, idx) => {
        this.grid.collapseRow(gridSettings.state.skip + idx);
      });
    }
  }

  get StartDate(): FormControl {
    return this.searchFormGroup.get(TreasuryConstant.START_DATE) as FormControl;
  }

  get EndDate(): FormControl {
    return this.searchFormGroup.get(TreasuryConstant.END_DATE) as FormControl;
  }
}
