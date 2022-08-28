import {Component, OnInit} from '@angular/core';
import {ColumnSettings} from '../../../shared/utils/column-settings.interface';
import {GridSettings} from '../../../shared/utils/grid-settings.interface';
import {State} from '@progress/kendo-data-query';
import {ActivatedRoute, Router} from '@angular/router';
import {SwalWarring} from '../../../shared/components/swal/swal-popup';
import {PagerSettings} from '@progress/kendo-angular-grid';
import {TranslateService} from '@ngx-translate/core';
import {AccountService} from '../../services/account/account.service';
import {ValidationService} from '../../../shared/services/validation/validation.service';
import {GrowlService} from '../../../../COM/Growl/growl.service';
import {AccountsConstant} from '../../../constant/accounting/account.constant';
import {SharedAccountingConstant} from '../../../constant/accounting/sharedAccounting.constant';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {GenericAccountingService} from '../../services/generic-accounting.service';
import {ChartOfAccountsConstant} from '../../../constant/accounting/chart-of-account.constant';
import {ChartAccountService} from '../../services/chart-of-accounts/chart-of-account.service';
import {Filter} from '../../../models/accounting/Filter';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {StarkRolesService} from '../../../stark-permissions/service/roles.service';
import {FiltrePredicateModel} from '../../../models/shared/filtrePredicate.model';
import {FieldTypeConstant} from '../../../constant/shared/fieldType.constant';
import {isNullOrUndefined} from 'util';
import {Operator, PredicateFormat, Filter as predicate} from '../../../shared/utils/predicate';
import { PermissionConstant } from '../../../Structure/permission-constant';
import {AuthService} from '../../../login/Authentification/services/auth.service';

@Component({
  selector: 'app-list-account',
  templateUrl: './list-account.component.html',
  styleUrls: ['./list-account.component.scss']
})
export class ListAccountComponent implements OnInit {


  private currentPage = NumberConstant.ZERO;

  public selectedPlanInFilter: any;

  // pager settings
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;

  /**
   * size of pagination => 10 items per page
   */
  private pageSize = SharedConstant.DEFAULT_ITEMS_NUMBER;

  public gridState: State = {
    skip: NumberConstant.ZERO,
    take: this.pageSize,    // Initial filter descriptor
    filter: {
      logic: SharedConstant.LOGIC_AND,
      filters: []
    }
  };

  public columnsConfig: ColumnSettings[] = [
    {
      field: AccountsConstant.CODE,
      title: AccountsConstant.CODE_TITLE,
      tooltip: AccountsConstant.CODE_TITLE,
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: AccountsConstant.LABEL,
      title: AccountsConstant.LABEL_TITLE,
      tooltip: AccountsConstant.LABEL_TITLE,
      filterable: true,
      _width: NumberConstant.THREE_HUNDRED
    },
    {
      field: AccountsConstant.PLAN_PARENT,
      title: AccountsConstant.PLAN_PARENT_TITLE,
      tooltip: AccountsConstant.PLAN_PARENT_TITLE,
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: AccountsConstant.LITERABLE_FIELD,
      title: AccountsConstant.LITERABLE_TITLE,
      tooltip: AccountsConstant.LITERABLE_TITLE,
      filterable: true,
      filter: 'boolean',
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: AccountsConstant.RECONCILABLE_FIELD,
      title: AccountsConstant.RECONCILABLE_TITLE,
      tooltip: AccountsConstant.RECONCILABLE_TITLE,
      filterable: true,
      filter: 'boolean',
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
  ];

  public sortParams = SharedConstant.EMPTY;

  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };

  public showDelay = SharedAccountingConstant.SHOW_TOOLTIP_DELAY;

  public chartAccountsFilteredList = [];
  public chartAccountsList = [];

  public filters = new Array<Filter>();

  public titleBtnGrid = AccountsConstant.TITLE_BTN_GRID;
  public filterFieldsColumns = [];
  public filterFieldsInputs = [];
  /**
   * advanced search predicate
   */
  public predicateAdvancedSearch: PredicateFormat;
  public AccountingPermissions = PermissionConstant.SettingsAccountingPermissions;

  constructor(private accountService: AccountService,
              private router: Router,
              private route: ActivatedRoute,
              private swalWarrings: SwalWarring,
              private translate: TranslateService,
              private starkRolesService: StarkRolesService,
              private growlService: GrowlService,
              private genericAccountingService: GenericAccountingService,
              private chartOfAccountService: ChartAccountService,
              public validationService: ValidationService, private authService: AuthService) {
    if (this.authService.hasAuthority(this.AccountingPermissions.VIEW_ACCOUNTING_ACCOUNTS)) {
      this.chartOfAccountService.getJavaGenericService().getEntityList(ChartOfAccountsConstant.GET_ALL_CHARTS)
        .subscribe(data => {
          this.chartAccountsFilteredList = data;
          this.chartAccountsList = this.chartAccountsFilteredList.slice();
        });
    }
  }

  ngOnInit() {
    if (this.authService.hasAuthority(this.AccountingPermissions.VIEW_ACCOUNTING_ACCOUNTS)) {
      this.initPredicateAdvancedSearch();
      this.initTiersFiltreConfig();
      this.initGridDataSource();
    }
  }

  public dataStateChange(state: State): void {
    this.gridSettings.state = state;
    this.currentPage = (state.skip) / this.pageSize;
    this.pageSize = state.take;
    this.sortParams = this.genericAccountingService.getSortParams(state.sort);
  }

  public resetToFirstPage() {
    this.currentPage = NumberConstant.ZERO;
    this.gridSettings.state.skip = this.currentPage;
  }

  public planValueChange() {
    this.resetToFirstPage();
    this.initGridDataSource();
  }

  public onPageChange() {
    this.initGridDataSource();
  }

  public filterChange() {
    this.initGridDataSource();
  }

  public sortChange() {
    this.resetToFirstPage();
    this.initGridDataSource();
  }

  public removeHandler(event) {
    const swalWarningMessage = `${this.translate.instant(AccountsConstant.ACCOUNTING_SWAL_TEXT)}`;
    this.swalWarrings.CreateSwal(swalWarningMessage, AccountsConstant.ARE_YOU_SURE).then((result) => {
      if (result.value) {
        this.accountService.getJavaGenericService()
          .deleteEntity(event.id).subscribe(() => {
          this.growlService.successNotification(this.translate.instant(SharedAccountingConstant.SUCCESS_OPERATION));
          this.initGridDataSource();
        }, err => {
          this.growlService.ErrorNotification(this.translate.instant(SharedAccountingConstant.FAILURE_OPERATION));
        });
      }
    });
  }

  initGridDataSource() {
    if (this.authService.hasAuthority(this.AccountingPermissions.VIEW_ACCOUNTING_ACCOUNTS)) {
      this.accountService.getJavaGenericService().sendData(SharedAccountingConstant.FILTER_APIS.GET_ACCOUNT_LIST +
        `?page=${this.currentPage}&size=${this.pageSize}${this.sortParams}`, this.filters)
        .subscribe(data => {
          this.gridSettings.gridData = {data: data.content, total: data.totalElements};
        });
    }

  }

  public isThereAtLeastOneFieldInFilter(): boolean {
    return this.filters.length > NumberConstant.ZERO;
  }

  public goToAdvancedEdit(dataItem) {
    if (this.isThereAtLeastOneFieldInFilter()) {
      const url = this.router.serializeUrl(this.router.createUrlTree(
        [AccountsConstant.ACCOUNT_EDIT_URL.concat(dataItem.id)],
        {queryParams: {id: null}}));
      window.open(url, '_blank');
    } else {
      this.router.navigateByUrl(AccountsConstant.ACCOUNT_EDIT_URL.concat(dataItem.id));
    }
  }

  handleFilterChartAccount(value) {
    if (this.genericAccountingService.isNullAndUndefinedAndEmpty(value)) {
      this.chartAccountsFilteredList = this.chartAccountsList;
    } else {
      this.chartAccountsFilteredList = this.genericAccountingService.getChartOfAccountFilteredListByWrittenValue(value, this.chartAccountsList);
    }
  }

  initPredicateAdvancedSearch() {
    this.predicateAdvancedSearch = new PredicateFormat();
    this.predicateAdvancedSearch.Filter = new Array<predicate>();
  }

  /**
   * load advancedSearch parameters config
   * @private
   */
  private initTiersFiltreConfig() {
    this.filterFieldsColumns.push(new FiltrePredicateModel(AccountsConstant.CODE_TITLE, FieldTypeConstant.TEXT_TYPE, AccountsConstant.CODE));
    this.filterFieldsColumns.push(new FiltrePredicateModel(AccountsConstant.LABEL_TITLE, FieldTypeConstant.TEXT_TYPE, AccountsConstant.LABEL));
    this.filterFieldsColumns.push(new FiltrePredicateModel(AccountsConstant.PLAN_PARENT_TITLE, FieldTypeConstant.planCodeComponent, SharedAccountingConstant.FILTER_DROP_DOWN_BY.PLAN));
    this.filterFieldsInputs.push(new FiltrePredicateModel(AccountsConstant.LITERABLE_TITLE, FieldTypeConstant.BOOLEAN, AccountsConstant.LITERABLE_FIELD));
    this.filterFieldsInputs.push(new FiltrePredicateModel(AccountsConstant.RECONCILABLE_TITLE, FieldTypeConstant.BOOLEAN, AccountsConstant.RECONCILABLE_FIELD));

  }


  getFilterPredicate(filtre) {
    this.prepareSpecificFiltreFromAdvancedSearch(filtre);
    this.prepareFiltreFromAdvancedSearch(filtre);
  }

  private prepareSpecificFiltreFromAdvancedSearch(filtre) {
    if (filtre.SpecificFiltre && !filtre.SpecificFiltreToDelete) {
      this.predicateAdvancedSearch.SpecFilter = this.predicateAdvancedSearch.SpecFilter.filter(value => value.Prop !== filtre.SpecificFiltre.Prop);
      this.predicateAdvancedSearch.SpecFilter.push(filtre.SpecificFiltre);
    } else if (filtre.SpecificFiltreToDelete) {
      this.predicateAdvancedSearch.SpecFilter = this.predicateAdvancedSearch.SpecFilter.filter(value => value.Prop !== filtre.SpecificFiltre.Prop);
    }
  }

  /**
   * case filtre date between : we don't remove the old filtre date value
   * @param filtre
   * @private
   */
  private prepareFiltreFromAdvancedSearch(filtreFromAdvSearch) {
    this.predicateAdvancedSearch.Filter = this.predicateAdvancedSearch.Filter.filter(value => value.prop !== filtreFromAdvSearch.prop);
    if (filtreFromAdvSearch.operation && !isNullOrUndefined(filtreFromAdvSearch.value) && !filtreFromAdvSearch.SpecificFiltre) {
      this.predicateAdvancedSearch.Filter.push(filtreFromAdvSearch);
    }
  }

  /**
   * identify the predicate operator AND|OR
   * @param operator
   */
  getOperatorPredicate(operator: Operator) {
    this.predicateAdvancedSearch.Operator = operator;
  }

  searchClick() {
    this.filters = this.prepareFilter();
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.initGridDataSource();
  }

  resetClickEvent() {
    this.filters=new Array<Filter>();
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.initPredicateAdvancedSearch();
    this.initGridDataSource();
  }

  prepareFilter() {
    const filters = new Array<Filter>();
    this.predicateAdvancedSearch.Filter.forEach(filter => {
      filters.push(new Filter(this.getFieldType(filter), this.getOperation(filter), filter.prop, filter.value));
    });
    return filters;
  }

  getFieldType(filter: predicate): string {
    const type = this.genericAccountingService.getType(filter, this.filterFieldsColumns, this.filterFieldsInputs);
    return this.genericAccountingService.getFilterType(type);
  }

  getOperation(filter: predicate): string {
    return this.genericAccountingService.getOperation(filter, this.filterFieldsColumns, this.filterFieldsInputs);
  }
}
