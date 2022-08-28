import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { PagerSettings } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { Filter, Operation, OrderBy, PredicateFormat, Relation, SpecFilter, Operator } from '../../../shared/utils/predicate';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { PricesService } from '../../services/prices/prices.service';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { PricesConstant } from '../../../constant/sales/prices.constant';
import { Router } from '@angular/router';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { FormModalDialogService } from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { PriceItemsCardListComponent } from '../../components/price-items-card-list/price-items-card-list.component';
import { PriceCustomersCardListComponent } from '../../components/price-customers-card-list/price-customers-card-list.component';
import { FiltrePredicateModel } from '../../../models/shared/filtrePredicate.model';
import { FieldTypeConstant } from '../../../constant/shared/fieldType.constant';
import { isNotNullOrUndefinedAndNotEmptyValue } from '../../../stark-permissions/utils/utils';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';

const LOGIC_AND = 'and';
@Component({
  selector: 'app-price-list',
  templateUrl: './price-list.component.html',
  styleUrls: ['./price-list.component.scss']
})
export class PriceListComponent implements OnInit {
  discountFilter: string;
  predicateList: PredicateFormat[];
  // pager settings
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public gridState: State = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.TWENTY,
    // Initial filter descriptor
    filter: {
      logic: LOGIC_AND,
      filters: []
    }
  };
  /**
   * advanced search predicate
   */
   public predicateAdvancedSearch: PredicateFormat;
   public quickSearchPredicate: PredicateFormat;

   public initialColumnsForFilter: FiltrePredicateModel[] = [];
   public columnsToBeAddForFilter: FiltrePredicateModel[] = [];
   public predicate: PredicateFormat[] = [];
   public priceTypePredicate: PredicateFormat;
   public hasAddPricePermission: boolean;
   public hasUpdatePricePermission: boolean;
   public hasDeletePricePermission: boolean;
   public hasShowPricePermission: boolean;
  public columnsConfig: ColumnSettings[] = [
    {
      field: PricesConstant.CODE_PRICES,
      title: PricesConstant.CODE_UPPERCASE,
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED
    },
    {
      field: PricesConstant.TYPES_LABELS,
      title: PricesConstant.TYPE_TITLE,
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: SharedConstant.IS_ACTIF,
      title: SharedConstant.STATE_UPPERCASE,
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED
    }
  ];
  public excelColumnsConfig: ColumnSettings[] = [
    {
      field: PricesConstant.CODE_PRICES,
      title: PricesConstant.CODE_UPPERCASE,
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: "ListTypesLabels",
      title: PricesConstant.TYPE_TITLE,
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED_TWENTY
    },
    {
      field: "State",
      title: SharedConstant.STATE_UPPERCASE,
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED
    }
  ];
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };
  public excelGridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.excelColumnsConfig,
  };
  public api = PricesConstant.GET_PRICES_LIST;
  constructor(public pricesService: PricesService, private swalWarrings: SwalWarring, private router: Router,
              private authService: AuthService,
              private formModalDialogService: FormModalDialogService,
              private viewRef: ViewContainerRef) { }

  ngOnInit() {
    this.hasAddPricePermission = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.ADD_PRICES);
    this.hasUpdatePricePermission = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.UPDATE_PRICES);
    this.hasDeletePricePermission = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.DELETE_PRICES);
    this.hasShowPricePermission = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.SHOW_PRICES);
    this.prepareColumnsForFilter();
    this.prepareColumnsForFilterToBeAdd();
    this.prepareInitialPredicate();
    this.initGridDataSource(false);
  }
  private prepareInitialPredicate() {
    this.priceTypePredicate = this.preparePredicate();
    //this.predicate.push(predicate);
    const specificPredicate = this.prepareSpecificPredicate();
    this.predicate.push(specificPredicate);
    this.predicateAdvancedSearch = this.prepareSpecificPredicate();
    this.quickSearchPredicate = this.prepareSpecificPredicate();
  }
  prepareSpecificPredicate(): PredicateFormat {
      const myPredicate = new PredicateFormat();
      myPredicate.Filter = new Array<Filter>();
      myPredicate.SpecFilter = new Array<SpecFilter>();
      myPredicate.SpecificRelation = new Array<string>();
      myPredicate.OrderBy = new Array<OrderBy>();
      myPredicate.Relation = new Array<Relation>();
      myPredicate.SpecificRelation.push(PricesConstant.ITEM_PRICES_ID_ITEM,PricesConstant.TIERS_PRICES_ID_TIERS)
      return myPredicate;
  }
  getOperatorPredicate(operator: Operator) {
    this.predicateAdvancedSearch.Operator = operator;
  }
  /**
   * prepare filters and relationships
   */
  preparePredicate() : PredicateFormat {
    const initialPredicate = new PredicateFormat();
    initialPredicate.IsDefaultPredicate = true;
    initialPredicate.Filter = new Array<Filter>();
    initialPredicate.Filter.push(new Filter(PricesConstant.CODE_PRICES, Operation.contains, this.discountFilter, false, true));
    initialPredicate.Filter.push(new Filter(PricesConstant.TYPES_LABELS, Operation.contains, this.discountFilter, false, true));
    initialPredicate.Filter.push(new Filter(SharedConstant.IS_ACTIF, Operation.eq, this.discountFilter, false, true));
    initialPredicate.Relation = new Array<Relation>();
    initialPredicate.Relation.push( new Relation(PricesConstant.PRICE_DETAILS));
    return initialPredicate;
  }

  /**
   * Init grid with data from the datasource
   */
  initGridDataSource(isAdvancedSearch) {
    this.setPredicateFiltre(isAdvancedSearch);
    this.pricesService.getPricesList(this.gridSettings.state, this.predicate)
      .subscribe(data => {
        this.gridSettings.gridData = data.listData;
      });
  }

  /**
   * Reload grid data when data is changed
   * @param state
   */
  public dataStateChange(state: State): void {
    if (!state.sort[NumberConstant.ZERO] || (state.sort[NumberConstant.ZERO] && !state.sort[NumberConstant.ZERO].dir)) {
      state.sort = [];
    }
    this.gridSettings.state = state;
    this.initGridDataSource(false);
  }

  /**
   * Delete Price
   * @param param0
   */
  public removeHandler(dataItem) {
    this.swalWarrings.CreateDeleteSwal(PricesConstant.DISCOUNT, SharedConstant.CETTE).then((result) => {
      if (result.value) {
        this.pricesService.remove(dataItem).subscribe(() => {
          this.initGridDataSource(false);
        });
      }
    });
  }

  /**
   * Go the Update Price page
   * @param $event
   */
  editHandler(dataItem) {
    this.router.navigateByUrl(PricesConstant.PRICES_EDIT_URL.concat(dataItem.Id));
  }


  public filter() {
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.quickSearchPredicate = this.prepareSpecificPredicate();
    this.priceTypePredicate = this.preparePredicate();
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.initGridDataSource(false);
   }


  expandItems(dataItem) {
    this.formModalDialogService.openDialog(SharedConstant.ARTICLE_LIST_TITLE,
      PriceItemsCardListComponent, this.viewRef, null,
      { idPrice: dataItem.Id, isReadOnly: true }, false, SharedConstant.MODAL_DIALOG_SIZE_ML);
  }
  expandCustomers(dataItem) {
    this.formModalDialogService.openDialog(SharedConstant.CUSTOMER_LIST_TITLE,
      PriceCustomersCardListComponent, this.viewRef, null,
      { idPrice: dataItem.Id, isReadOnly: true }, false, SharedConstant.MODAL_DIALOG_SIZE_ML);

  }
  /**
   * To prepare for advanced search
   */
   public prepareColumnsForFilter() {
    this.initialColumnsForFilter.push(new FiltrePredicateModel(PricesConstant.CODE_UPPERCASE, FieldTypeConstant.TEXT_TYPE,
      PricesConstant.CODE_PRICES));
    this.initialColumnsForFilter.push(new FiltrePredicateModel(PricesConstant.CLIENT_TITLE, FieldTypeConstant.customerComponent,
      PricesConstant.IdTiers));
    this.initialColumnsForFilter.push(new FiltrePredicateModel(PricesConstant.ITEM_TITLE, FieldTypeConstant.itemDropDownComponent,
        PricesConstant.ITEM_UPPERCASE,true,PricesConstant.INVENTORY_MODULE,PricesConstant.ITEM_PRICES,PricesConstant.ID_PRICES,PricesConstant.IdItem));
    }
   public prepareColumnsForFilterToBeAdd() {
    this.columnsToBeAddForFilter.push(new FiltrePredicateModel(PricesConstant.TYPE_UPPERCASE, FieldTypeConstant.priceType,
      PricesConstant.LIST_TYPE_LABEL));
    this.columnsToBeAddForFilter.push(new FiltrePredicateModel(SharedConstant.STATE_UPPERCASE, FieldTypeConstant.priceState,
      SharedConstant.IS_ACTIF));
  }
  getFilterPredicate(filtre) {
    this.prepareSpecificFiltreFromAdvancedSearch(filtre);
    this.prepareFiltreFromAdvancedSearch(filtre);
  }
  private prepareFiltreFromAdvancedSearch(filtreFromAdvSearch) {
      this.predicateAdvancedSearch.Filter = this.predicateAdvancedSearch.Filter.filter(value => value.prop !== filtreFromAdvSearch.prop);
    if (filtreFromAdvSearch.isDateFiltreBetween) {
      this.predicateAdvancedSearch.Filter.push(filtreFromAdvSearch.filtres[NumberConstant.ZERO]);
      this.predicateAdvancedSearch.Filter.push(filtreFromAdvSearch.filtres[NumberConstant.ONE]);
    } else if (filtreFromAdvSearch.operation && isNotNullOrUndefinedAndNotEmptyValue(filtreFromAdvSearch.value) && !filtreFromAdvSearch.SpecificFiltre) {
      this.predicateAdvancedSearch.Filter.push(filtreFromAdvSearch);
    }
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
   * Reset dataGrid
   */
   resetClickEvent() {
    this.predicateAdvancedSearch = new PredicateFormat();
    this.predicate = [];
    this.prepareInitialPredicate();
    this.initGridDataSource(true);
  }
  private setPredicateFiltre(isAdvancedSearch) {
    this.predicate = [];
    this.predicate.push(this.priceTypePredicate);
    if (isAdvancedSearch || this.predicateAdvancedSearch.Filter.length !== NumberConstant.ZERO) {
      this.gridState.filter.logic = SharedConstant.LOGIC_AND;
      this.predicate.push(this.predicateAdvancedSearch);
    } else {
      if(this.quickSearchPredicate.Filter.length !== NumberConstant.ZERO){
        this.gridState.filter.logic = SharedConstant.LOGIC_OR;
      this.predicate.push(this.quickSearchPredicate);
      }
      else {
        this.predicate.push(this.prepareSpecificPredicate());
      }
    }
  }
}
