import {Component, Input, OnInit} from '@angular/core';
import {DataStateChangeEvent, PagerSettings, SelectableSettings} from '@progress/kendo-angular-grid';
import {SharedConstant} from '../constant/shared/shared.constant';
import {Filter, Operation, Operator, OrderBy, OrderByDirection, PredicateFormat, Relation} from '../shared/utils/predicate';
import {DataSourceRequestState} from '@progress/kendo-data-query';
import {ColumnSettings} from '../shared/utils/column-settings.interface';
import {GridSettings} from '../shared/utils/grid-settings.interface';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {SwalWarring} from '../shared/components/swal/swal-popup';
import {ProvisioningService} from '../purchase/services/order-project/provisioning-service.service';
import {DocumentConstant} from '../constant/sales/document.constant';
import {TiersConstants} from '../constant/purchase/tiers.constant';
import {OrderProjectService} from '../purchase/services/order-project/order-project.service';

import {ProvisionPredicate} from '../models/purchase/provision-predicate.model';
import {GrowlService} from '../../COM/Growl/growl.service';
import {isNullOrEmptyString} from '@progress/kendo-angular-grid/dist/es2015/utils';
import {NumberConstant} from '../constant/utility/number.constant';
import {StockDocumentConstant} from '../constant/inventory/stock-document.constant';
import {isNullOrUndefined} from 'util';
import {isNotNullOrUndefinedAndNotEmptyValue} from '../stark-permissions/utils/utils';
import {FiltrePredicateModel} from '../models/shared/filtrePredicate.model';
import {FieldTypeConstant} from '../constant/shared/fieldType.constant';
import {AccountsConstant} from '../constant/accounting/account.constant';
import {SharedAccountingConstant} from '../constant/accounting/sharedAccounting.constant';
import { AuthService } from '../login/Authentification/services/auth.service';
import { PermissionConstant } from '../Structure/permission-constant';

@Component({
  selector: 'app-provisioning-list',
  templateUrl: './provisioning-list.component.html',
  styleUrls: ['./provisioning-list.component.scss']
})
export class ProvisioningListComponent implements OnInit {
  public selectableSettings: SelectableSettings;
  @Input() isModal: boolean;
  @Input() idProvrision: number;
  @Input() containerRef;
  codeFilter: string;
  public predicate: PredicateFormat;
  public orderProject;
  public haveAddPermission :boolean ;
  public haveShowPermission :boolean;
  public haveDeletePermission :boolean;
  public haveUpdatePermission : boolean;
  // pager settings
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;

  /**
   * predicate Provisionning list
   */
  public predicateProvisionning: PredicateFormat[]= [];;
  /**
   * Grid state
   */
  public gridState: DataSourceRequestState = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.TWENTY,
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
      field: 'Code',
      title: 'Code',
      tooltip: 'Code',
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: 'CreationDate',
      title: this.translate.instant(TiersConstants.DATE),
      tooltip: 'Date',
      filter: 'date',
      filterable: false,
      format: this.translate.instant(SharedConstant.DATE_FORMAT),
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: 'Suppliers',
      title: this.translate.instant(TiersConstants.SUPPLIER),
      filterable: false,
      _width: NumberConstant.THREE_HUNDRED
    }
  ];
  // Grid settings
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig
  };

  provisionPred: ProvisionPredicate = new ProvisionPredicate();
  // Currency dropdown dataSource
  public currencyDataSource;

  public filtreFieldsColumns = [];
  public filtreFieldsInputs = [];

  /**
   * advanced search predicate
   */
  public predicateAdvancedSearch: PredicateFormat;
  /**
   * quick search predicate
   */
  public predicateQuickSearch: PredicateFormat;

  constructor(
    private provisionService: ProvisioningService,
    private router: Router,
    private swalWarrings: SwalWarring,
    private OrderService: OrderProjectService,
    private translate: TranslateService,
    private growlService: GrowlService,
    public authService: AuthService) {
    let predicateAdv = this.preparePredicate();
    let predicateQuick = this.preparePredicate();
    this.predicateAdvancedSearch = predicateAdv;
    this.predicateQuickSearch = predicateQuick;
    this.setSelectableSettings();
  }

  /**
   * ng init
   */
  ngOnInit() {
    this.haveAddPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.ADD_PROVISIONING);
    this.haveShowPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.SHOW_PROVISIONING);
    this.haveDeletePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.DELETE_PROVISIONING);
    this.haveUpdatePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_PROVISIONING);
    this.initTiersFiltreConfig();
    if (this.isModal === true) {
      this.OrderService.SelectedProjects = [];
    }
    this.gridSettings.state.skip = 0;
    this.gridSettings.state.filter.filters = [];
    this.gridSettings.state.sort = [];
    this.gridSettings.gridData = {
      data: [],
      total: 0
    };
    this.predicateProvisionning.push(this.preparePredicate());
    this.initGridDataSource(true);
  }

  /**Selecting row settings */
  public setSelectableSettings(): void {
    this.selectableSettings = {
      checkboxOnly: true,
      mode: 'multiple'
    };
  }

  preparePredicate() {
    this.predicate = new PredicateFormat();
    this.predicate.Relation = new Array<Relation>();
    this.predicate.Filter = new Array<Filter>();
    this.predicate.OrderBy = new Array<OrderBy>();
    if (this.idProvrision > 0) {
      this.predicate.Filter.push(new Filter(DocumentConstant.ID_DOCUMENT, Operation.neq, this.idProvrision));
      this.predicate.OrderBy.push(new OrderBy(DocumentConstant.ID, OrderByDirection.desc));
    }
    if (!isNullOrEmptyString(this.codeFilter)) {
      this.predicate.Filter.push(new Filter(DocumentConstant.CODE, Operation.contains, this.codeFilter.trim()));
    }
    this.predicate.Relation = new Array<Relation>();
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation('TiersProvisioning')]);
    this.predicate.SpecificRelation = new Array<string>();
    this.predicate.SpecificRelation.push('TiersProvisioning.IdTiersNavigation');
    return this.predicate;
  }

  initGridDataSource(isQuickSearch: boolean) {
    this.provisionService.reloadServerSideDataWithListPredicate(this.gridSettings.state, this.predicateProvisionning,
      SharedConstant.GET_DATA_WITH_SPECIFIC_FILTER).subscribe(data => {
      this.gridSettings.gridData.total = data.total;
      this.gridSettings.gridData = data;
    });
  }
  mergefilters() {
    let predicate = new PredicateFormat();
     if (this.predicateAdvancedSearch) {
       this.cloneAdvancedSearchPredicate(predicate);
     }
    if (this.predicateQuickSearch.Filter.length !== NumberConstant.ZERO) {
      predicate.Filter = predicate.Filter.concat(this.predicateQuickSearch.Filter);
    }
    return (predicate);
  }

  public cloneAdvancedSearchPredicate(targetPredicate: PredicateFormat){
    targetPredicate.Filter = this.predicateAdvancedSearch.Filter;
    targetPredicate.IsDefaultPredicate = this.predicateAdvancedSearch.IsDefaultPredicate;
    targetPredicate.Operator = this.predicateAdvancedSearch.Operator;
    targetPredicate.OrderBy = this.predicateAdvancedSearch.OrderBy;
    targetPredicate.Relation = this.predicateAdvancedSearch.Relation;
    targetPredicate.SpecFilter = this.predicateAdvancedSearch.SpecFilter;
    targetPredicate.SpecificRelation = this.predicateAdvancedSearch.SpecificRelation;
    targetPredicate.page = this.predicateAdvancedSearch.page;
    targetPredicate.pageSize = this.predicateAdvancedSearch.pageSize;
    targetPredicate.values = this.predicateAdvancedSearch.values;
  }

  filterChange($event, tiers: boolean) {
    if (tiers) {
      this.provisionPred.IdTiers = $event.selectedValue;
    }
  }

  search() {
    if (this.checkDates()) {
      if (this.provisionPred.EndDate) {

        let endDate = this.provisionPred.EndDate;
        this.provisionPred.EndDate = new Date(Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()));
      }

      if (this.provisionPred.StartDate) {
        let startDate = this.provisionPred.StartDate;
        this.provisionPred.StartDate = new Date(Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()));
      }
      this.gridSettings.state.skip = 0;
      this.initGridDataSource(false);
    }
  }

  checkDates(): boolean {
    if (this.provisionPred.EndDate) {
      if (this.provisionPred.EndDate < this.provisionPred.StartDate) {
        this.growlService.InfoNotification(this.translate.instant('FISCAL_YEAR_DATES_ORDER_INVALID'));
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }

  /**
   * Data changed listener
   * @param state
   */
  public dataStateChange(state: DataStateChangeEvent): void {
    if (!state.sort[NumberConstant.ZERO] || (state.sort[NumberConstant.ZERO] && !state.sort[NumberConstant.ZERO].dir)) {
      state.sort = [];
    }
    this.gridSettings.state = state;
    this.initGridDataSource(false);
  }

  /**
   * Remove handler
   * @param param0
   */
  public removeHandler(dataItem) {
    let swalWarningMessage = `${this.translate.instant(SharedConstant.PROVISIONING_DELETE_TEXT_MESSAGE)}`;
    swalWarningMessage = swalWarningMessage.replace('{code}', dataItem.Code);
    this.swalWarrings.CreateSwal(swalWarningMessage, SharedConstant.PROVISIONING_DELETE_TITLE_MESSAGE).then((result) => {
      if (result.value) {
        this.provisionService.remove(dataItem).subscribe(() => {
          this.initGridDataSource(true);
        });
      }
    });
  }

  /**
   * edit click row event
   * @param dataItem
   */
  public goToAdvancedEdit(dataItem) {
    this.router.navigateByUrl('/main/purchase/orderProject/editProvision/'.concat(dataItem.Id));
  }

  /**Select row in equivalent list */
  selectRow($event) {
    $event.selectedRows.forEach(selected => {
      this.OrderService.SelectedProjects.push(selected.dataItem.Id);
    });
    if ($event.deselectedRows.length > 0) {
      const index = this.OrderService.SelectedProjects.indexOf($event.deselectedRows[0].dataItem.Id);
      this.OrderService.SelectedProjects.splice(index, 1);
    }
  }

  public filter() {
    this.predicateQuickSearch = this.preparePredicate();
    if(this.orderProject !== ""){
      this.predicateQuickSearch.Filter.push(new Filter(SharedConstant.CODE, Operation.contains, this.orderProject, false, true));
    }
    this.predicateProvisionning = [];
    this.predicateProvisionning.push(this.mergefilters());
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.initGridDataSource(true);
  }

  public setPredicateFiltre(isQuickSearch) {
    this.predicateProvisionning = [];
    if (isQuickSearch) {
      this.predicateProvisionning.push(this.predicateQuickSearch);
    } else {
      this.predicateAdvancedSearch.Operator = Operator.and;
      this.gridState.filter.logic = SharedConstant.LOGIC_AND;
      this.gridSettings.state.filter.logic = SharedConstant.LOGIC_AND;
      this.predicateProvisionning.push(this.predicateAdvancedSearch);
    }
  }

  /**
   * Reset dataGrid
   */
  resetClickEvent() {
    this.predicateAdvancedSearch = this.preparePredicate();
    this.orderProject = SharedConstant.EMPTY;
    this.predicateProvisionning = [];
    this.predicateProvisionning.push(this.mergefilters());
    this.predicateProvisionning[NumberConstant.ZERO].Filter = [];
    this.initGridDataSource(true);
  }

  searchClick() {
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.initGridDataSource(false);
  }

  /**
   * identify the predicate operator AND|OR
   * @param operator
   */
  getOperatorPredicate(operator: Operator) {
    this.predicateAdvancedSearch.Operator = operator;
  }

  /**
   * get array<Filtre> from advancedSearchComponenet
   * remove old filter property from the predicate filter list
   * case filtre type date between
   * @param filtre
   */
  getFiltrePredicate(filtre) {
    this.predicateProvisionning = []
    this.prepareSpecificFiltreFromAdvancedSearch(filtre);
    this.prepareFiltreFromAdvancedSearch(filtre);
    this.predicateProvisionning.push(this.mergefilters());
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

  /**
   * load advancedSearch parameters config
   * @private
   */
  private initTiersFiltreConfig() {
    this.filtreFieldsColumns.push(new FiltrePredicateModel(SharedConstant.CODE, FieldTypeConstant.TEXT_TYPE, StockDocumentConstant.CODE));
    this.filtreFieldsColumns.push(new FiltrePredicateModel(this.translate.instant(TiersConstants.DATE), FieldTypeConstant.DATE_TYPE, 'CreationDate'));
    this.filtreFieldsInputs.push(new FiltrePredicateModel(TiersConstants.SUPPLIER, FieldTypeConstant.supplierComponent, StockDocumentConstant.ID_TIERS_FROM_TIERS_PROVISIONING));
  }
}
