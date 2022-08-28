import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DataStateChangeEvent, GridComponent, PagerSettings } from '@progress/kendo-angular-grid';
import { DataResult, State } from '@progress/kendo-data-query';
import { String } from 'typescript-string-operations';
import { GrowlService } from '../../../../../COM/Growl/growl.service';
import { CompanyService } from '../../../../administration/services/company/company.service';
import { SettlementConstant } from '../../../../constant/payment/settlement.constant';
import { SharedConstant } from '../../../../constant/shared/shared.constant';
import { TreasuryConstant } from '../../../../constant/treasury/treasury.constant';
import { NumberConstant } from '../../../../constant/utility/number.constant';
import { Tiers } from '../../../../models/achat/tiers.model';
import { Currency } from '../../../../models/administration/currency.model';
import { TiersTypeEnumerator } from '../../../../models/enumerators/tiers-type.enum';
import { SupplierDropdownComponent } from '../../../../shared/components/supplier-dropdown/supplier-dropdown.component';
import { ColumnSettings } from '../../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../../shared/utils/grid-settings.interface';
import { Filter, Operation, Operator, PredicateFormat } from '../../../../shared/utils/predicate';
import { CustomerOutstandingService } from '../../../services/customer-outstanding.service';
import { DocumentUtilityService } from '../../../services/document-utility.service';
import {LocalStorageService} from '../../../../login/Authentification/services/local-storage-service';

@Component({
  selector: 'app-delivery-form-not-billed',
  templateUrl: './delivery-form-not-billed.component.html',
  styleUrls: ['./delivery-form-not-billed.component.scss']
})
export class DeliveryFormNotBilledComponent implements OnInit, OnChanges {

  @ViewChild(SupplierDropdownComponent) tiersData;
  @Input() selectedTiers;
  @Output() tiersSelectedChange = new EventEmitter();
  @ViewChild('grid') grid: GridComponent;
  @ViewChild('supplierViewChild') supplierViewChild: SupplierDropdownComponent;
  isTiersChangedProvidesFromThisComponent = false;
  // PagerSettings
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  tiersTypeEnum = TiersTypeEnumerator;

  apiForExport = TreasuryConstant.GET_DELIVER_FOR_OUT_STANDING_DOCUMENT_FOR_EXPORT;
  // formatDate
  dateFormat = this.translate.instant(SharedConstant.DATE_FORMAT);

  // Total ttc Amount
  TotalTtcAmount = 0;

  // Total Remaining Amount
  TotalRemainingAmount = 0;

  // selected Tiers
  selectedClientForDeliveryForm: Tiers;

  // grid state
  gridState: State = new Object() as State;

  public predicate: PredicateFormat;
  public columnsConfig: ColumnSettings[] = [
    {
      field: TreasuryConstant.CODE_FIELD,
      title: TreasuryConstant.CODE,
      tooltip: TreasuryConstant.CODE_DELIVERY,
      filterable: true
    },
    {
      field: TreasuryConstant.TIERS_NAME_FIELD,
      title: TreasuryConstant.CLIENT,
      tooltip: TreasuryConstant.CLIENT,
      filterable: true
    },
    {
      field: TreasuryConstant.DOCUMENT_DATE,
      title: TreasuryConstant.DOCUMENT_DATE_TITLE,
      tooltip: TreasuryConstant.DOCUMENT_DATE_TITLE,
      filterable: true
    },
    {
      field: TreasuryConstant.DOCUMENT_TTC_PRICE_WITH_CURRENCY,
      title: TreasuryConstant.TOTAL_AMOUNT_UPPERCASE,
      tooltip: TreasuryConstant.DOCUMENT_DATE_TITLE,
      filterable: true
    },
    {
      field: TreasuryConstant.DOCUMENT_REMAINING_AMOUNT_WITH_CURRENCY,
      title: TreasuryConstant.REMAINING_AMOUNT,
      tooltip: TreasuryConstant.DOCUMENT_REMAINING_AMOUNT_TO_BE_PAID,
      filterable: true
    }
  ];
  // supplier dropdown disabled state
  public supplierDropdownDisabled = false;
  gridData: DataResult = new Object() as DataResult;

  gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
    gridData: this.gridData
  };

  userCurrency: Currency;
  language: String;


  constructor(public growlService: GrowlService, public translate: TranslateService,
    public customerOutstandingService: CustomerOutstandingService,
    private documentUtility: DocumentUtilityService,
    private companyService: CompanyService, private localStorageService : LocalStorageService) {
    this.language = this.localStorageService.getLanguage();
  }

  ngOnInit() {
    this.companyService.getCurrentCompany().subscribe(company => {
      this.userCurrency = company.IdCurrencyNavigation;
    });
    this.intialiseState();
    this.initGridDataSource();
  }

  initGridDataSource() {
    this.grid.loading = true;
    this.customerOutstandingService.processDataForDeliveryForm(this.gridSettings.state, this.predicate)
      .subscribe(res => {
        if (res) {
          this.gridSettings.gridData = new Object() as DataResult;
          this.gridSettings.gridData.data = res.Data;
          this.gridSettings.gridData.total = res.Total;
          this.grid.loading = false;
          this.TotalTtcAmount = res.TotalAmount;
          this.TotalRemainingAmount = res.TotalRemainingAmount;
        }
      });
  }

  dataStateChange(state: DataStateChangeEvent) {
    this.gridSettings.state = state;
    this.initGridDataSource();
  }

  supplierValueChange($event) {
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.predicate = new PredicateFormat();
    this.predicate.Operator = Operator.and;
    this.predicate.Filter = new Array<Filter>();
    if ($event && $event.Id) {
      this.predicate.Filter.push(new Filter(TreasuryConstant.ID_TIERS, Operation.eq, $event.Id));
    }
    this.documentUtility.changeTiersGridFilter($event, this.tiersData, this.gridSettings.state);
    this.initGridDataSource();
  }
  emitSupplier($event) {
    this.selectedTiers = $event.selectedTiers;
    this.isTiersChangedProvidesFromThisComponent = true;
    this.supplierValueChange($event.selectedTiers);
    this.tiersSelectedChange.emit($event.selectedTiers);
  }

  supplierFilterChange($event) {
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.predicate = new PredicateFormat();
    this.predicate.Operator = Operator.and;
    this.predicate.Filter = new Array<Filter>();
    if ($event.selectedValue && ($event.selectedValue > NumberConstant.ZERO)) {
      this.predicate.Filter.push(new Filter(TreasuryConstant.ID_TIERS, Operation.eq, $event.selectedValue));
    }
    this.initGridDataSource();
  }

  intialiseState() {
    this.gridSettings.state = {
      skip: 0,
      take: 20,
      filter: {
        logic: 'and',
        filters: []
      }
    };
  }

  public initialiseComponent() {
    this.selectedTiers = undefined;
    this.supplierDropdownDisabled = false;
    this.predicate = new PredicateFormat();
    this.intialiseState();
    this.initGridDataSource();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes[SettlementConstant.SELECTED_TIERS]) {
      if (this.supplierViewChild) {
        this.supplierViewChild.supplierFiltredDataSource = this.supplierViewChild.supplierDataSource;
      }
      this.selectedTiers = changes[SettlementConstant.SELECTED_TIERS].currentValue;
      const previousTiers: Tiers = changes[SettlementConstant.SELECTED_TIERS].previousValue;
      // Update the data grid if tiers change event not provide from this component
      if (!this.isTiersChangedProvidesFromThisComponent &&
        ((!previousTiers && this.selectedTiers) || (previousTiers && !this.selectedTiers))) {
        this.supplierValueChange(this.selectedTiers);
      } else if (!this.isTiersChangedProvidesFromThisComponent && this.selectedTiers && previousTiers) {
        this.supplierValueChange(this.selectedTiers);
      } else if (this.isTiersChangedProvidesFromThisComponent) {
        this.isTiersChangedProvidesFromThisComponent = false;
      }
    }
  }
}
