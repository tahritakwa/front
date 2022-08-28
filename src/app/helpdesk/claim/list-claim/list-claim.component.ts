import { Component, OnInit, OnDestroy, Input, ViewChild } from '@angular/core';
import {
  PredicateFormat,
  Filter,
  Operator,
  Operation,
  Relation,
  OrderByDirection,
  OrderBy,
  SpecFilter
} from '../../../shared/utils/predicate';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { DataStateChangeEvent, PagerSettings } from '@progress/kendo-angular-grid';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { FormGroup, FormControl } from '@angular/forms';
import { DataSourceRequestState } from '@progress/kendo-data-query';
import { isNullOrUndefined } from 'util';
import { ClaimService } from '../../services/claim/claim.service';
import { TranslateService } from '@ngx-translate/core';
import { ClaimConstant } from '../../../constant/helpdesk/claim.constant';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { ClaimSearchItemComponent } from '../../components/claim-search-item/claim-search-item.component';
import { Claim } from '../../../models/helpdesk/claim.model';
import { FiltrePredicateModel } from '../../../models/shared/filtrePredicate.model';
import { FieldTypeConstant } from '../../../constant/shared/fieldType.constant';
import { isNotNullOrUndefinedAndNotEmptyValue } from '../../../stark-permissions/utils/utils';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';

export const createLineFormGroup = dataItem => new FormGroup({
  'Id': new FormControl(dataItem.Id),
  'IdLine': new FormControl(isNullOrUndefined(dataItem.IdLine) ? NumberConstant.ZERO : dataItem.IdLine),
  'Code': new FormControl(isNullOrUndefined(dataItem.IdItemNavigation) ? '' : dataItem.IdItemNavigation.Code),
  'Description': new FormControl(isNullOrUndefined(dataItem.IdItemNavigation) ? '' : dataItem.IdItemNavigation.Description),
});

@Component({
  selector: 'app-list-claim',
  templateUrl: './list-claim.component.html',
  styleUrls: ['./list-claim.component.scss']
})
export class ListClaimComponent implements OnInit, OnDestroy {
  @ViewChild('searchComponent') claimSearchComponent: ClaimSearchItemComponent;
  @ViewChild(ClaimSearchItemComponent) claimSearchItemComponent: ClaimSearchItemComponent;
  public pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public filterId: number;
  /**
   * advanced search predicate
   */
  public predicateAdvancedSearch: PredicateFormat;
  public quickSearchPredicate: PredicateFormat;

  public initialColumnsForFilter: FiltrePredicateModel[] = [];
  public columnsToBeAddForFilter: FiltrePredicateModel[] = [];
  public predicate: PredicateFormat[] = [];
  public api = SharedConstant.GET_DATA_WITH_SPECIFIC_FILTER;


  /**
   /* Grid state
   */
  public gridState: DataSourceRequestState = {
    skip: 0,
    take: 10,
    filter: { // Initial filter descriptor
      logic: 'and',
      filters: []
    }
  };
  public excelColumnsConfig: ColumnSettings[] = [
    {
      field: ClaimConstant.CODE_FIELD,
      title: ClaimConstant.CODE_TITLE,
      filterable: true,
      _width: 160
    },
    {
      field: ClaimConstant.DATE_FIELD,
      title: ClaimConstant.DATE_TITLE,
      filterable: true,
      format: this.translate.instant(SharedConstant.DATE_FORMAT),
      _width: 120
    },
    {
      field: ClaimConstant.CLIENT_FIELD,
      title: ClaimConstant.CLIENT_TITLE,
      filterable: true,
      _width: 120
    },
    {
      field: ClaimConstant.ID_ITEM_NAVIGATION_DESIGNATION_FIELD,
      title: ClaimConstant.ITEM_TITLE,
      filterable: true,
      _width: 300
    },
    {
      field: ClaimConstant.ID_WAREHOUSE_FIELD,
      title: ClaimConstant.ID_WAREHOUSE_TITLE,
      filterable: true,
      _width: 120
    },
    {
      field: ClaimConstant.ID_CLAIM_TYPE_FIELD_DESCRIPTION,
      title: ClaimConstant.ID_CLAIM_TYPE_TITLE,
      filterable: true,
      _width: 120
    },
    {
      field: ClaimConstant.ID_CLAIM_STATUS_LABEL_FIELD,
      title: ClaimConstant.ID_CLAIM_STATUS_TITLE,
      filterable: true,
      _width: 180
    },
    {
      field: ClaimConstant.SUPPLIER_FIELD,
      title: ClaimConstant.SUPPLIER_TITLE,
      filterable: true,
      _width: 180
    }
  ];
  public columnsConfig: ColumnSettings[] = [
    {
      field: ClaimConstant.CODE_FIELD,
      title: ClaimConstant.CODE_TITLE,
      filterable: true,
      _width: 160
    },
    {
      field: ClaimConstant.DATE_FIELD,
      title: ClaimConstant.DATE_TITLE,
      filterable: true,
      format: this.translate.instant(SharedConstant.DATE_FORMAT),
      _width: 120
    },
    {
      field: ClaimConstant.CLIENT_FIELD,
      title: ClaimConstant.CLIENT_TITLE,
      filterable: true,
      _width: 120
    },
    {
      field: ClaimConstant.ID_ITEM_NAVIGATION_DESIGNATION_FIELD,
      title: ClaimConstant.ITEM_TITLE,
      filterable: true,
      _width: 300
    },
    {
      field: ClaimConstant.ID_WAREHOUSE_FIELD,
      title: ClaimConstant.ID_WAREHOUSE_TITLE,
      filterable: true,
      _width: 120
    },
    {
      field: ClaimConstant.ID_CLAIM_TYPE_FIELD,
      title: ClaimConstant.ID_CLAIM_TYPE_TITLE,
      filterable: true,
      _width: 120
    },
    {
      field: ClaimConstant.ID_CLAIM_STATUS_LABEL_FIELD,
      title: ClaimConstant.ID_CLAIM_STATUS_TITLE,
      filterable: true,
      _width: 180
    },
    {
      field: ClaimConstant.SUPPLIER_FIELD,
      title: ClaimConstant.SUPPLIER_TITLE,
      filterable: true,
      _width: 180
    }
  ];

  // Grid settings
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig
  };
  public excelGridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.excelColumnsConfig
  };
  public haveAddPermission = false;
  public haveShowPermission = false;
  public haveUpdatePermission = false;
  public haveDeletePermission = false;

  constructor(public claimService: ClaimService, private swalWarrings: SwalWarring,
    private router: Router, public translate: TranslateService, public activatedRoute: ActivatedRoute,
    public authService: AuthService) {

    this.activatedRoute.params.subscribe(params => {
      this.filterId = +params['id'] || 0;
    });
  }


  ngOnInit() {
    this.haveAddPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.ADD_CLAIM_PURCHASE);
    this.haveShowPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.SHOW_CLAIM_PURCHASE);
    this.haveUpdatePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_CLAIM_PURCHASE);
    this.haveDeletePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.DELETE_CLAIM_PURCHASE);
    this.prepareColumnsForFilter();
    this.prepareInitialPredicate();
    this.initGridDataSource();
  }

  private prepareInitialPredicate() {
    const predicate = this.preparePredicate();
    this.predicate.push(predicate);
    let predicateAdv = this.preparePredicate();
    let predicateQuick = this.preparePredicate();
    this.predicateAdvancedSearch = predicateAdv;
    this.quickSearchPredicate = predicateQuick;
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
    this.claimService.getClaimList(state, this.predicateAdvancedSearch).subscribe(
      data => this.gridSettings.gridData = data
    );
  }

  /**
   * Remove handler
   * @param param0
   */
  public removeHandler(claim) {
    this.swalWarrings.CreateSwal(ClaimConstant.CLAIM_DELETE_TEXT_MESSAGE, ClaimConstant.CLAIM_DELETE_TITLE_MESSAGE,
    ).then((result) => {
      if (result.value) {
        this.claimService.remove(claim).subscribe(() => {
          this.initGridDataSource(true);
        });
      }
    });
  }

  public initGridDataSource(withQuickSearch?) {
    this.claimService.reloadServerSideDataWithListPredicate(this.gridSettings.state,
      this.predicate, SharedConstant.GET_DATA_WITH_SPECIFIC_FILTER).subscribe(data =>
        this.gridSettings.gridData = data
      );
  }

  private setPredicateFiltre(isQuickSearch) {
    this.predicate = [];
    if (isQuickSearch) {
      this.gridState.filter.logic = SharedConstant.LOGIC_OR;
      this.gridSettings.state.filter.logic = SharedConstant.LOGIC_OR;
      this.predicate.push(this.quickSearchPredicate);
    } else {
      this.predicateAdvancedSearch.Operator = Operator.and;
      this.gridState.filter.logic = SharedConstant.LOGIC_AND;
      this.gridSettings.state.filter.logic = SharedConstant.LOGIC_AND;
      this.predicate.push(this.predicateAdvancedSearch);
    }
  }

  /**
   * get array<Filtre> from advancedSearchComponenet
   * remove old filter property from the predicate filter list
   * case filtre type date between
   * @param filter
   */
  getFilterPredicate(filter) {
    this.predicate = [];
    this.prepareFilterFromAdvancedSearch(filter);
    this.predicate.push(this.mergefilters());
  }

  mergefilters() {
    let predicate = new PredicateFormat();
    if (this.predicateAdvancedSearch) {
      this.cloneAdvancedSearchPredicate(predicate);
    }
    if (this.quickSearchPredicate.Filter.length !== NumberConstant.ZERO) {
      predicate.Filter = predicate.Filter.concat(this.quickSearchPredicate.Filter);
    }
    return (predicate);
  }

  public cloneAdvancedSearchPredicate(targetPredicate: PredicateFormat) {
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
  getPredicateFromQuickSearch(predicate) {
    if (predicate.Filter[NumberConstant.ZERO].value === "") {
      this.quickSearchPredicate = this.preparePredicate();
    }
    this.predicate = [];
    this.predicate.push(this.mergefilters());
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.initGridDataSource(true);
  }

  /**
   * case filtre date between : we don't remove the old filtre date value
   * @param filtre
   * @private
   */
  private prepareFilterFromAdvancedSearch(filtre) {
    this.predicateAdvancedSearch.Filter =
      this.predicateAdvancedSearch.Filter.filter(value => value.prop !== filtre.prop);
    if (filtre.isDateFiltreBetween && filtre.filtres) {
      this.predicateAdvancedSearch.Filter.push(filtre.filtres[NumberConstant.ZERO]);
      this.predicateAdvancedSearch.Filter.push(filtre.filtres[NumberConstant.ONE]);
    } else if (filtre.operation && isNotNullOrUndefinedAndNotEmptyValue(filtre.value) && !filtre.SpecificFiltre) {
      this.predicateAdvancedSearch.Filter.push(filtre);
    }
  }


  /**
   * Reset dataGrid
   */
  resetClickEvent() {
    this.predicateAdvancedSearch = new PredicateFormat();
    this.quickSearchPredicate.Filter = [];
    this.claimSearchItemComponent.searchValue = SharedConstant.EMPTY;
    this.predicateAdvancedSearch = this.preparePredicate();
    this.predicate[NumberConstant.ZERO].Filter = [];
    this.predicate.push(this.mergefilters());
    this.initGridDataSource(true);
  }


  ngOnDestroy() {
  }

  /**
   *
   * @param claim
   */
  public isClaimAccepted(claim: Claim) {
    return claim.IdClaimStatus === NumberConstant.THREE;
  }

  /***
   * go to edit or show interface
   * @param claim
   */
  public goToAppropriateInterface(claim: Claim) {
    if (!claim.IsTreated || claim.IdClaimStatus <= 2) {
      this.router.navigateByUrl(ClaimConstant.URI_ADVANCED_EDIT.concat(claim.Id.toString()));
    } else if (claim.IdClaimStatus > 2 && claim.IsTreated) {
      this.router.navigateByUrl(ClaimConstant.URI_SHOW_CLAIMS.concat(claim.Id.toString()));
    }
  }

  /**
   * To prepare for advanced search
   */
  public prepareColumnsForFilter() {
    this.initialColumnsForFilter.push(new FiltrePredicateModel(ClaimConstant.ITEM_TITLE, FieldTypeConstant.TEXT_TYPE,
      ClaimConstant.ID_ITEM_NAVIGATION_CODE_FIELD));
    this.initialColumnsForFilter.push(new FiltrePredicateModel(ClaimConstant.ID_CLAIM_TYPE_TITLE, FieldTypeConstant.claim_type_dropdown,
      ClaimConstant.ID_CLAIM_TYPE_FIELD));
    this.initialColumnsForFilter.push(new FiltrePredicateModel(ClaimConstant.SUPPLIER_TITLE, FieldTypeConstant.supplierComponent,
      ClaimConstant.ID_SUPPLIER));
    this.columnsToBeAddForFilter.push(new FiltrePredicateModel(ClaimConstant.CLIENT_TITLE, FieldTypeConstant.customerComponent,
      ClaimConstant.ID_CLIENT));
    this.columnsToBeAddForFilter.push(new FiltrePredicateModel(ClaimConstant.ID_CLAIM_STATUS_TITLE, FieldTypeConstant.claimStatusCode,
      ClaimConstant.ID_CLAIM_STATUS_ID_FIELD));
    this.columnsToBeAddForFilter.push(new FiltrePredicateModel(ClaimConstant.DATE_TITLE, FieldTypeConstant.DATE_TYPE,
      ClaimConstant.DATE_FIELD));
  }

  public preparePredicate(): PredicateFormat {
    const initialPredicate = new PredicateFormat();

    // Instantiate data
    initialPredicate.OrderBy = new Array<OrderBy>();
    initialPredicate.Filter = new Array<Filter>();
    initialPredicate.Relation = new Array<Relation>();
    initialPredicate.SpecFilter = new Array<SpecFilter>();
    initialPredicate.SpecificRelation = new Array<string>();
    // Configure predicate with relations
    initialPredicate.Relation.push(new Relation(ClaimConstant.ID_CLAIM_STATUS_NAVIGATION));
    initialPredicate.Relation.push(new Relation(ClaimConstant.ID_CLAIM_TYPE_NAVIGATION));
    initialPredicate.Relation.push(new Relation(ClaimConstant.ID_WAREHOUSE_NAVIGATION));
    initialPredicate.Relation.push(new Relation(ClaimConstant.ID_CLIENT_NAVIGATION));
    initialPredicate.Relation.push(new Relation(ClaimConstant.ID_SUPPLIER_NAVIGATION));
    initialPredicate.Relation.push(new Relation(ClaimConstant.ID_ITEM_NAVIGATION));
    // Add order by  Id
    initialPredicate.OrderBy.push.apply(initialPredicate.OrderBy, [new OrderBy(ClaimConstant.ATTRIBUT_ID, OrderByDirection.desc)]);
    // Add item filter
    if (this.filterId !== NumberConstant.ZERO) {
      initialPredicate.Filter.push(new Filter(ClaimConstant.ID_ITEM_FIELD, Operation.eq, this.filterId));
    }
    return initialPredicate;
  }
}
