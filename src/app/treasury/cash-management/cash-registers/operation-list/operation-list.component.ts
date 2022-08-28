import { Component, Input, OnInit, SimpleChanges, ViewContainerRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DataStateChangeEvent, PagerSettings } from '@progress/kendo-angular-grid';
import { DataResult, DataSourceRequestState } from '@progress/kendo-data-query';
import { CompanyService } from '../../../../administration/services/company/company.service';
import { SharedConstant } from '../../../../constant/shared/shared.constant';
import { OperationCashConstant } from '../../../../constant/treasury/operation-cash.constant';
import { NumberConstant } from '../../../../constant/utility/number.constant';
import { LocalStorageService } from '../../../../login/Authentification/services/local-storage-service';
import { Currency } from '../../../../models/administration/currency.model';
import { OperationCashTypeEnumerator } from '../../../../models/enumerators/operation-cash-type.enum';
import { CashRegister } from '../../../../models/treasury/cash-register.model';
import { FilterSearchOperation } from '../../../../models/treasury/filter-search-operation.model';
import { ColumnSettings } from '../../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../../shared/utils/grid-settings.interface';
import { OrderBy, OrderByDirection } from '../../../../shared/utils/predicate';
import { OperationCashService } from '../../../services/operation-cash/operation-cash.service';
import { SessionCashService } from '../../../services/session-cash/session-cash.service';

@Component({
  selector: 'app-operation-list',
  templateUrl: './operation-list.component.html',
  styleUrls: ['./operation-list.component.scss']
})
export class OperationListComponent implements OnInit {

  @Input() selectedcashRegister: CashRegister;

  public columnsConfig: ColumnSettings[] = [
    {
      field: OperationCashConstant.SESSION,
      title: OperationCashConstant.SESSION_TITLE,
      filterable: true,
      _width: 100
    },
    {
      field: OperationCashConstant.AGENT,
      title: OperationCashConstant.AGENT_TITLE,
      filterable: true,
      _width: 100
    },
    {
      field: OperationCashConstant.TYPE,
      title: OperationCashConstant.TYPE_TITLE,
      filterable: true,
      _width: 100
    },
    {
      field: OperationCashConstant.DATE,
      title: OperationCashConstant.DATE_TITLE,
      format: this.translate.instant("DATE_AND_TIME_FORMAT"),
      filterable: true,
      _width: 100
    },
    {
      field: OperationCashConstant.AMOUNT,
      title: OperationCashConstant.AMOUNT_TITLE,
      filterable: true,
      _width: 150
    }
  ];

  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
   /* Grid state
  */
   public gridState: DataSourceRequestState = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.TWENTY,
    filter: { // Initial filter descriptor
      logic: 'and',
      filters: []
    }
  };

  // Grid settings
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig
  };
  language: string;
  public companyCurrency: Currency;
  // Enumerators
  public operationCashTypeEnum = OperationCashTypeEnumerator;

  public filterSearchOperation: FilterSearchOperation;

  constructor(private operationCashService: OperationCashService,private viewContainerRef: ViewContainerRef,
     private translate: TranslateService, private companyService: CompanyService, private localStorageService: LocalStorageService) { }

  ngOnInit() {
    this.language = this.localStorageService.getLanguage();
    this.companyService.getCurrentCompany().subscribe(data =>{
      this.companyCurrency = data.IdCurrencyNavigation;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedcashRegister.currentValue) {
      this.filterSearchOperation = this.preparePredicate();
      this.initGridDataSource();
    }
  }

  /**
   * Data changed listener
   * @param state
   */
   public dataStateChange(state:any): void {
    if (!state.sort[NumberConstant.ZERO] || (state.sort[NumberConstant.ZERO] && !state.sort[NumberConstant.ZERO].dir)) {
      state.sort = [];
      this.filterSearchOperation.OrderBy = new Array<OrderBy>();
      this.filterSearchOperation.OrderBy.push(new OrderBy(OperationCashConstant.DATE, OrderByDirection.desc));
    }
    this.gridSettings.state = state;
    if (state.sort.length > 0){
      const dir = state.sort[NumberConstant.ZERO].dir;
      const field = state.sort[NumberConstant.ZERO].field;
      this.filterSearchOperation.OrderBy = new Array<OrderBy>();
      this.filterSearchOperation.OrderBy.push(new OrderBy(field,dir));
    }
    this.initGridDataSource();
  }

  public initGridDataSource() {
    if(this.selectedcashRegister){
      this.operationCashService.getOperationCash(this.filterSearchOperation)
      .subscribe(data => {
        this.gridSettings.gridData = new Object() as DataResult;
        this.gridSettings.gridData.data = data.listData;
        this.gridSettings.gridData.total = data.total;
      });
    }

  }
  preparePredicate(): FilterSearchOperation {
    const filterSearch = new FilterSearchOperation();
    if(this.selectedcashRegister){

      filterSearch.IdCashRegister =  this.selectedcashRegister.Id;
    }

    filterSearch.page = this.gridState.skip;
    filterSearch.pageSize = this.gridState.take;
    filterSearch.OrderBy = new Array<OrderBy>();
    filterSearch.OrderBy.push(new OrderBy(OperationCashConstant.DATE, OrderByDirection.desc));
    return filterSearch;
  }
}
