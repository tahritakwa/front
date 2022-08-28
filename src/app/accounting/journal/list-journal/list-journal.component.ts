import {Component, OnInit, ViewChild} from '@angular/core';
import {GridComponent, PagerSettings} from '@progress/kendo-angular-grid';
import {DataSourceRequestState, State} from '@progress/kendo-data-query';
import {FormBuilder, Validators} from '@angular/forms';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {ColumnSettings} from '../../../shared/utils/column-settings.interface';
import {JournalConstants} from '../../../constant/accounting/journal.constant';
import {GridSettings} from '../../../shared/utils/grid-settings.interface';
import {JournalService} from '../../services/journal/journal.service';
import {SwalWarring} from '../../../shared/components/swal/swal-popup';
import {ValidationService} from '../../../shared/services/validation/validation.service';
import {GrowlService} from '../../../../COM/Growl/growl.service';
import {TranslateService} from '@ngx-translate/core';
import {SharedAccountingConstant} from '../../../constant/accounting/sharedAccounting.constant';
import {GenericAccountingService} from '../../services/generic-accounting.service';
import {AccountingConfigurationConstant} from '../../../constant/accounting/accounting-configuration.constant';
import {AccountsConstant} from '../../../constant/accounting/account.constant';
import {Filter} from '../../../models/accounting/Filter';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {ActivatedRoute, Router} from '@angular/router';
import {StarkRolesService} from '../../../stark-permissions/service/roles.service';
import {Filter as predicate, Operator, PredicateFormat} from '../../../shared/utils/predicate';
import {isNullOrUndefined} from 'util';
import {FiltrePredicateModel} from '../../../models/shared/filtrePredicate.model';
import {FieldTypeConstant} from '../../../constant/shared/fieldType.constant';
import { RoleConfigConstant } from '../../../Structure/_roleConfigConstant';
import { PermissionConstant } from '../../../Structure/permission-constant';
import {AuthService} from '../../../login/Authentification/services/auth.service';

@Component({
  selector: 'app-list-journal',
  templateUrl: './list-journal.component.html',
  styleUrls: ['./list-journal.component.scss']
})
export class ListJournalComponent implements OnInit {

  @ViewChild(GridComponent)
  public grid: GridComponent;

  // pager settings
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  private pageSize = SharedConstant.DEFAULT_ITEMS_NUMBER;

  private currentPage = NumberConstant.ZERO;

  public gridState: DataSourceRequestState = {
    skip: NumberConstant.ZERO,
    take: this.pageSize,
    filter: { // Initial filter descriptor
      logic: SharedConstant.LOGIC_AND,
      filters: []
    }
  };
  /**
   * Grid columns
   */
  public columnsConfig: ColumnSettings[] = [
    {
      field: JournalConstants.CODE,
      title: JournalConstants.CODE_JOURNAL,
      tooltip: JournalConstants.CODE_JOURNAL,
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: JournalConstants.LABEL_FIELD,
      title: JournalConstants.LABEL,
      tooltip: JournalConstants.LABEL,
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: JournalConstants.RECONCILABLE,
      title: JournalConstants.IS_RECONCILABLE,
      tooltip: JournalConstants.IS_RECONCILABLE,
      filterable: true,
      filter: 'boolean',
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: JournalConstants.CASH_FLOW,
      title: JournalConstants.IS_CASH_FLOW,
      tooltip: JournalConstants.IS_CASH_FLOW,
      filterable: true,
      filter: 'boolean',
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
  ];

  public sortParams = '';
  // Grid settings
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig
  };

  public showDelay = SharedAccountingConstant.SHOW_TOOLTIP_DELAY;

  public filters = new Array<Filter>();
  titleBtnGrid = JournalConstants.ADD_NEW_JOURNAL;
  /**
   *
   * @param journalService
   * @param swalWarrings
   * @param  fb
   * @param validationService
   * @param growlService
   * @param translate
   * @param genericAccountingService
   */
  public filterFieldsColumns = [];
  public filterFieldsInputs = [];
  /**
   * advanced search predicate
   */
  public predicateAdvancedSearch: PredicateFormat;
  public AccountingPermissions = PermissionConstant.SettingsAccountingPermissions;

  constructor(
    public journalService: JournalService,
    private swalWarrings: SwalWarring,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private validationService: ValidationService,
    private growlService: GrowlService,
    private translate: TranslateService,
    private starkRolesService: StarkRolesService,
    private genericAccountingService: GenericAccountingService,
    private router: Router,
    private authService : AuthService
  ) {
  }

  initGridDataSource() {
    if(this.authService.hasAuthority(this.AccountingPermissions.VIEW_JOURNALS)) {
      this.journalService.getJavaGenericService().sendData(SharedAccountingConstant.FILTER_APIS.GET_JOURNAL_LIST
        + `?page=${this.currentPage}&size=${this.pageSize}${this.sortParams}`, this.filters)
        .subscribe(data => {
          this.gridSettings.gridData = {data: data.content, total: data.totalElements};
        });
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

  public initJournalFormGroup() {
    return this.fb.group({
      id: [null],
      code: ['', [Validators.required, Validators.minLength(AccountingConfigurationConstant.ENTITY_FIELD_MIN_LENGTH),
        Validators.maxLength(AccountingConfigurationConstant.ENTITY_FIELD_MAX_LENGTH)]],
      label: ['', [Validators.required, Validators.minLength(AccountingConfigurationConstant.ENTITY_FIELD_MIN_LENGTH),
        Validators.maxLength(AccountingConfigurationConstant.ENTITY_FIELD_MAX_LENGTH)]],
      reconcilable: [false],
      cashFlow: [false]
    });
  }

  public goToAdvancedEdit(dataItem) {
    this.router.navigateByUrl(JournalConstants.JOURNAL_EDIT_URL + dataItem.id, {queryParams: dataItem, skipLocationChange: true});
  }

  /**
   * identify the predicate operator AND|OR
   * @param operator
   */
  getOperatorPredicate(operator: Operator) {
    this.predicateAdvancedSearch.Operator = operator;
  }

  resetClickEvent() {
    this.initPredicateAdvancedSearch();
    this.initGridDataSource();
  }

  searchClick() {
    this.filters = this.prepareFilter();
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.initGridDataSource();
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

  private prepareFiltreFromAdvancedSearch(filtreFromAdvSearch) {
    this.predicateAdvancedSearch.Filter = this.predicateAdvancedSearch.Filter.filter(value => value.prop !== filtreFromAdvSearch.prop);
    if (filtreFromAdvSearch.operation && !isNullOrUndefined(filtreFromAdvSearch.value) && !filtreFromAdvSearch.SpecificFiltre) {
      this.predicateAdvancedSearch.Filter.push(filtreFromAdvSearch);
    }
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

  /**
   * load advancedSearch parameters config
   * @private
   */
  private initTiersFiltreConfig() {
    this.filterFieldsColumns.push(new FiltrePredicateModel(JournalConstants.CODE_JOURNAL, FieldTypeConstant.TEXT_TYPE, JournalConstants.CODE));
    this.filterFieldsColumns.push(new FiltrePredicateModel(AccountsConstant.CODE_TITLE, FieldTypeConstant.TEXT_TYPE, JournalConstants.LABEL_FIELD));
    this.filterFieldsColumns.push(new FiltrePredicateModel(JournalConstants.IS_RECONCILABLE, FieldTypeConstant.BOOLEAN, JournalConstants.RECONCILABLE));
    this.filterFieldsInputs.push(new FiltrePredicateModel(JournalConstants.IS_CASH_FLOW, FieldTypeConstant.BOOLEAN, JournalConstants.CASH_FLOW));

  }

  initPredicateAdvancedSearch() {
    this.predicateAdvancedSearch = new PredicateFormat();
    this.predicateAdvancedSearch.Filter = new Array<predicate>();
  }

  private async successOperation() {
    this.growlService.successNotification(this.translate.instant(SharedAccountingConstant.SUCCESS_OPERATION));
    await this.initGridDataSource();
  }

  /**
   * Remove handler
   * @param param0
   */
  public removeHandler(dataItem) {
    const swalWarningMessage = `${this.translate.instant(AccountsConstant.ACCOUNTING_SWAL_TEXT)}`;
    this.swalWarrings.CreateSwal(swalWarningMessage, AccountsConstant.ARE_YOU_SURE).then((result) => {
      if (result.value) {
        /**
         * Using generic service from GenericAccountService to delete journal
         *
         */
        this.journalService.getJavaGenericService().deleteEntity(dataItem.id).toPromise().then(async res => {
          if (res) {
            await new Promise(resolve => resolve(
              this.successOperation()
            ));
          }
        });
      }
    });
  }

  ngOnInit() {
    this.initPredicateAdvancedSearch();
    this.initTiersFiltreConfig();
    this.initGridDataSource();
  }

}
