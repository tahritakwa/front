import {Component, EventEmitter, OnInit, Output, ViewChild, ViewContainerRef} from '@angular/core';
import {DataSourceRequestState, State} from '@progress/kendo-data-query';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {ColumnSettings} from '../../../shared/utils/column-settings.interface';
import {GridSettings} from '../../../shared/utils/grid-settings.interface';
import {FiscalYearConstant} from '../../../constant/accounting/fiscal-year.constant';
import {ActivatedRoute, Router} from '@angular/router';
import {GrowlService} from '../../../../COM/Growl/growl.service';
import {TranslateService} from '@ngx-translate/core';
import {FiscalYearDetailsService, FiscalYearService} from '../../services/fiscal-year/fiscal-year.service';
import {GridComponent, GridDataResult, PagerSettings} from '@progress/kendo-angular-grid';
import {SharedAccountingConstant} from '../../../constant/accounting/sharedAccounting.constant';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {DatePipe} from '@angular/common';
import {FormModalDialogService} from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import {CloseFiscalYearComponent} from '../close-fiscal-year/close-fiscal-year.component';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {FiscalYearStateEnumerator} from '../../../models/enumerators/fiscal-year-state-enumerator.enum';
import {ClosingAndReopningFiscalYearComponent} from '../closing-and-reopning-fiscal-year/closing-and-reopning-fiscal-year.component';
import {AccountingConfigurationService} from '../../services/configuration/accounting-configuration.service';
import {GenericAccountingService} from '../../services/generic-accounting.service';
import {SwalWarring} from '../../../shared/components/swal/swal-popup';
import {Filter} from '../../../models/accounting/Filter';
import {StarkRolesService} from '../../../stark-permissions/service/roles.service';
import {Filter as predicate, Operator, PredicateFormat} from '../../../shared/utils/predicate';
import {FiltrePredicateModel} from '../../../models/shared/filtrePredicate.model';
import {FieldTypeConstant} from '../../../constant/shared/fieldType.constant';
import {isNullOrUndefined} from 'util';
import {isNotNullOrUndefinedAndNotEmptyValue} from '../../../stark-permissions/utils/utils';
import { RoleConfigConstant } from '../../../Structure/_roleConfigConstant';
import { PermissionConstant } from '../../../Structure/permission-constant';
import {AuthService} from '../../../login/Authentification/services/auth.service';

@Component({
  selector: 'app-list-fiscal-years',
  templateUrl: './list-fiscal-years.component.html',
  styleUrls: ['./list-fiscal-years.component.scss'],
})
export class ListFiscalYearsComponent implements OnInit {

  private pageSize = NumberConstant.TWENTY;
  private currentPage = NumberConstant.ZERO;
  @Output() statusChanged = new EventEmitter<boolean>();
  public gridState: DataSourceRequestState = {
    skip: NumberConstant.ZERO,
    take: this.pageSize,
    filter: { // Initial filter descriptor
      logic: SharedConstant.LOGIC_AND,
      filters: []
    }
  };

  public fiscalYearStateEnumerator = FiscalYearStateEnumerator;
  public fiscalYearsView: BehaviorSubject<GridDataResult>;
  pagerSettings: PagerSettings = {
    buttonCount: NumberConstant.FIVE,
    info: true,
    type: 'numeric',
    pageSizes: [NumberConstant.TEN, NumberConstant.TWENTY, NumberConstant.FIFTY, NumberConstant.ONE_HUNDRED],
    previousNext: true
  };
  public formatDate = this.translate.instant(SharedConstant.DATE_FORMAT);

  public sortParams = SharedAccountingConstant.DEFAULT_SORT_FISCAL_YEAR;

  firstFiscalYearNotConcluded: any;
  public columnsConfig: ColumnSettings[] = [
    {
      field: FiscalYearConstant.FISCAL_YEAR_NAME_FIELD,
      title: FiscalYearConstant.FISCAL_YEAR_NAME_TITLE,
      tooltip: FiscalYearConstant.FISCAL_YEAR_NAME_TITLE,
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: FiscalYearConstant.FISCAL_YEAR_START_DATE_FIELD,
      title: FiscalYearConstant.FISCAL_YEAR_START_DATE_TITLE,
      tooltip: FiscalYearConstant.FISCAL_YEAR_NAME_TITLE,
      filterable: true,
      filter: 'date',
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: FiscalYearConstant.FISCAL_YEAR_END_DATE_FIELD,
      title: FiscalYearConstant.FISCAL_YEAR_END_DATE_TITLE,
      tooltip: FiscalYearConstant.FISCAL_YEAR_END_DATE_TITLE,
      filterable: true,
      filter: 'date',
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: FiscalYearConstant.FISCAL_YEAR_CONCLUSION_DATE_FIELD,
      title: FiscalYearConstant.FISCAL_YEAR_CONCLUSION_DATE_TITLE,
      tooltip: FiscalYearConstant.FISCAL_YEAR_CONCLUSION_DATE_TITLE,
      filterable: true,
      filter: 'date',
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: FiscalYearConstant.FISCAL_YEAR_CLOSING_STATE_FIELD,
      title: 'STATUS',
      tooltip: 'STATUS',
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    }
  ];
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig
  };

  public filters = new Array<Filter>();

  public closingStateList: any;

  public closingStateFilteredList: any;

  public selectedClosingStateInFilter: any;
  public filterFieldsColumns = [];
  public filterFieldsInputs = [];
  /**
   * advanced search predicate
   */
  public predicateAdvancedSearch: PredicateFormat;
  public AccountingPermissions = PermissionConstant.SettingsAccountingPermissions;

  constructor(private fiscalYearService: FiscalYearService,
              private fiscalYearDetailsService: FiscalYearDetailsService,
              private accountingConfigurationService: AccountingConfigurationService,
              private genericAccountingService: GenericAccountingService,
              private router: Router,
              private route: ActivatedRoute,
              private growlService: GrowlService,
              private swalWarrings: SwalWarring,
              private datePipe: DatePipe,
              private formModalDialogService: FormModalDialogService,
              private viewRef: ViewContainerRef,
              private starkRolesService: StarkRolesService,
              private translate: TranslateService, private authService: AuthService) {
  }

  @ViewChild(GridComponent) grid: GridComponent;

  initClosingStateList() {
    this.closingStateList = [{
      value: FiscalYearStateEnumerator.Closed,
      text: this.translate.instant(SharedAccountingConstant.CLOSED),
      disable: true
    },
      {
        value: FiscalYearStateEnumerator.PartiallyClosed,
        text: this.translate.instant(SharedAccountingConstant.PARTIALLY_CLOSED),
        disable: true
      },
      {
        value: FiscalYearStateEnumerator.Open,
        text: this.translate.instant(SharedAccountingConstant.OPEN),
        disable: true
      },
      {
        value: FiscalYearStateEnumerator.Concluded,
        text: this.translate.instant(SharedAccountingConstant.CONCLUDED),
        disable: true
      }];
    this.closingStateFilteredList = this.closingStateList;
  }

  handleFilterClosingState(writtenValue) {
    this.closingStateFilteredList = this.closingStateList.filter((s) =>
      s.text.toLowerCase().includes(writtenValue.toLowerCase())
      || s.text.toLocaleLowerCase().includes(writtenValue.toLowerCase())
    );
  }

  ngOnInit() {
    this.fiscalYearsView = this.fiscalYearDetailsService;
    this.initPredicateAdvancedSearch();
    this.initTiersFiltreConfig();
    this.initGridDataSource();
    this.initClosingStateList();
  }

  initGridDataSource(): void {
    if (this.authService.hasAuthority(this.AccountingPermissions.VIEW_FISCAL_YEARS)) {
      this.fiscalYearService.getJavaGenericService().getEntityList(FiscalYearConstant.FIRST_FISCAL_YEAR_NOT_CONCLUDED)
        .subscribe((fiscalYear) => {
          this.firstFiscalYearNotConcluded = fiscalYear.id;
        });
      this.loadFiscalYearList();
    }
  }

  public loadFiscalYearList() {
    const data = [];
    this.fiscalYearService.getJavaGenericService().sendData(SharedAccountingConstant.FILTER_APIS.GET_FISCAL_YEAR_LIST +
      `?page=${this.currentPage}&size=${this.pageSize}${this.sortParams}`, this.filters)
      .subscribe((fiscalYearsList: any) => {
        fiscalYearsList.content.forEach(fy => {
          data.push({
            'id': fy.id, 'name': fy.name,
            'startDate': fy.startDate, 'endDate': fy.endDate, 'closingState': fy.closingState, 'conclusionDate': fy.conclusionDate
          });
        });
        this.fiscalYearDetailsService.next({
          data,
          total: fiscalYearsList.totalElements
        });
      });
  }

  public isThereAtLeastOneFieldInFilter(): boolean {
    return this.filters.length > 0;
  }

  public goToAdvancedEdit(dataItem) {
    if (this.isThereAtLeastOneFieldInFilter()) {
      const url = this.router.serializeUrl(this.router.createUrlTree([FiscalYearConstant.EDIT_FISCAL_YEARS_URL.concat(dataItem.id)], {queryParams: {id: null}}));
      window.open(url, '_blank');
    } else {
      this.router.navigateByUrl(FiscalYearConstant.EDIT_FISCAL_YEARS_URL.concat(dataItem.id));
    }
  }

  public dataStateChange(state: State): void {
    this.gridSettings.state = state;
    this.currentPage = (state.skip) / this.pageSize;
    this.pageSize = state.take;
    this.sortParams = this.genericAccountingService.getSortParams(state.sort);
  }

  public resetToFirstPage() {
    this.currentPage = 0;
    this.gridSettings.state.skip = this.currentPage;
  }

  public closingStateValueChange() {
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

  openFiscalYearModal(dataItem) {
    this.swalWarrings.CreateSwal(this.translate.instant(FiscalYearConstant.ARE_YOU_SURE_TO_OPEN_FISCAL_YEAR),
      this.translate.instant(FiscalYearConstant.ARE_YOU_SURE),
      this.translate.instant(SharedConstant.YES),
      this.translate.instant(SharedConstant.CANCEL)).then((result) => {
      if (result.value) {
        this.fiscalYearService.getJavaGenericService().deleteEntity(dataItem.id, FiscalYearConstant.FISCAL_YEAR_OPEN_FISCAL_YEAR_CONTROLLER_URL)
          .subscribe(data => {
            this.growlService.successNotification(this.translate.instant(SharedAccountingConstant.SUCCESS_OPERATION));
            this.initGridDataSource();
          }, err => {
            this.growlService.ErrorNotification(this.translate.instant(SharedAccountingConstant.FAILURE_OPERATION));
          });
          this.router.navigateByUrl(FiscalYearConstant.LIST_FISCAL_YEARS_URL);
      }
    });
  }

  openClosingDialog(dataItem) {
    this.formModalDialogService.openDialog('CLOSING_PERIOD', CloseFiscalYearComponent,
      this.viewRef, this.initGridDataSource.bind(this), dataItem);
  }

  closingAndReopeningDialog(dataItem) {
    this.formModalDialogService.openDialog('CLOSING_AND_REOPENING', ClosingAndReopningFiscalYearComponent, this.viewRef, this.initGridDataSource.bind(this),
      dataItem, null, SharedConstant.MODAL_DIALOG_SIZE_M);
  }

  /**
   * identify the predicate operator AND|OR
   * @param operator
   */
  getOperatorPredicate(operator: Operator) {
    this.predicateAdvancedSearch.Operator = operator;
  }

  resetClickEvent() {
    this.filters = [];
    this.initPredicateAdvancedSearch();
    this.initGridDataSource();
  }

  searchClick() {
    this.filters = this.prepareFilter();
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.initGridDataSource();
  }

  initPredicateAdvancedSearch() {
    this.predicateAdvancedSearch = new PredicateFormat();
    this.predicateAdvancedSearch.Filter = new Array<predicate>();
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
    this.filterFieldsColumns.push(new FiltrePredicateModel(FiscalYearConstant.FISCAL_YEAR_NAME_TITLE, FieldTypeConstant.TEXT_TYPE, FiscalYearConstant.FISCAL_YEAR_NAME_FIELD));
    this.filterFieldsColumns.push(new FiltrePredicateModel(FiscalYearConstant.FISCAL_YEAR_START_DATE_TITLE, FieldTypeConstant.DATE_TYPE_ACC, FiscalYearConstant.FISCAL_YEAR_START_DATE_FIELD));
    this.filterFieldsColumns.push(new FiltrePredicateModel(FiscalYearConstant.FISCAL_YEAR_END_DATE_TITLE, FieldTypeConstant.DATE_TYPE_ACC, FiscalYearConstant.FISCAL_YEAR_END_DATE_FIELD));
    this.filterFieldsInputs.push(new FiltrePredicateModel(FiscalYearConstant.FISCAL_YEAR_CONCLUSION_DATE_TITLE, FieldTypeConstant.DATE_TYPE_ACC, FiscalYearConstant.FISCAL_YEAR_CONCLUSION_DATE_FIELD));
    this.filterFieldsInputs.push(new FiltrePredicateModel(FiscalYearConstant.STATUS, FieldTypeConstant.closingStateComponent, FiscalYearConstant.FISCAL_YEAR_CLOSING_STATE_FIELD));
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
    if (filtreFromAdvSearch.isDateFiltreBetween) {
      this.prepareDatesFiltres(filtreFromAdvSearch);
    } else if (filtreFromAdvSearch.operation && !isNullOrUndefined(filtreFromAdvSearch.value) && !filtreFromAdvSearch.SpecificFiltre) {
      this.predicateAdvancedSearch.Filter.push(filtreFromAdvSearch);
    }
  }

  private prepareDatesFiltres(filtreFromAdvSearch) {
    if (isNotNullOrUndefinedAndNotEmptyValue(filtreFromAdvSearch.filtres[NumberConstant.ZERO].value)) {
      this.predicateAdvancedSearch.Filter.push(filtreFromAdvSearch.filtres[NumberConstant.ZERO]);
    }
    if (isNotNullOrUndefinedAndNotEmptyValue(filtreFromAdvSearch.filtres[NumberConstant.ONE].value)) {
      this.predicateAdvancedSearch.Filter.push(filtreFromAdvSearch.filtres[NumberConstant.ONE]);
    }
  }

  public goToHistoric() {
    this.router.navigateByUrl(FiscalYearConstant.FISCAL_YEAR_HISTORY_URL);
  }
}
