import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { PagerSettings } from '@progress/kendo-angular-grid';
import { Filter, Operation, Operator, PredicateFormat, Relation } from '../../../shared/utils/predicate';
import { State } from '@progress/kendo-data-query';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { TransferOrderService } from '../../services/transfer-order/transfer-order.service';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { Router } from '@angular/router';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { TransferOrderConstant } from '../../../constant/payroll/transfer-order.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { isNullOrUndefined } from 'util';
import { isNotNullOrUndefinedAndNotEmptyValue, notEmptyValue } from '../../../stark-permissions/utils/utils';
import { StarkRolesService } from '../../../stark-permissions/service/roles.service';
import { TransferOrderStatus } from '../../../models/enumerators/transfero-order-status.enum';
import { FiltrePredicateModel } from '../../../models/shared/filtrePredicate.model';
import { TranslateService } from '@ngx-translate/core';
import { SessionConstant } from '../../../constant/payroll/session.constant';
import { FieldTypeConstant } from '../../../constant/shared/fieldType.constant';
import { SessionService } from '../../services/session/session.service';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { SearchSessionComponent } from '../../components/search-session/search-session.component';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';

@Component({
  selector: 'app-list-transfer-order',
  templateUrl: './list-transfer-order.component.html',
  styleUrls: ['./list-transfer-order.component.scss']
})
export class ListTransferOrderComponent implements OnInit {
  public filtreFieldsColumns = [];
  public filtreFieldsInputs = [];

  // pager settings
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public canUpdatePays = false;
  /**
* advanced search predicate
*/
  public predicateAdvancedSearch: PredicateFormat;
    /**
    * quick search predicate
    */
   public predicateQuickSearch: PredicateFormat;
   @ViewChild(SearchSessionComponent) searchSessionComponent: SearchSessionComponent;

  /**
  * flag to identify the searchType
  * advanced search = 0 ,quick search = 1
  */
 public searchType = NumberConstant.ONE;
 public predicate: PredicateFormat[] = [];
  public gridState: State = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.TWENTY,
    // Initial filter descriptor
    filter: {
      logic: SharedConstant.LOGIC_AND,
      filters: []
    }
  };
  value = new Date();
  public valueStartDate: Date = new Date(this.value.getFullYear(), NumberConstant.ZERO, NumberConstant.SHIFT_FIRST_DATE);
  public valueEndDate: Date = new Date(this.value.getFullYear(), NumberConstant.TWELVE, NumberConstant.ZERO);

  public columnsConfig: ColumnSettings[] = [
    {
      field: TransferOrderConstant.TRANSFERORDER_CODE,
      title: TransferOrderConstant.TRANSFERORDER_CODE_UPPERCASE,
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: TransferOrderConstant.TITLE,
      title: TransferOrderConstant.TITLE_UPPERCASE,
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: TransferOrderConstant.MONTH,
      title: TransferOrderConstant.MONTH_UPPERCASE,
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: TransferOrderConstant.BANK_NAME,
      title: TransferOrderConstant.BANK_UPPERCASE,
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: TransferOrderConstant.STATE,
      title: TransferOrderConstant.STATE_UPPERCASE,
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED
    }
  ];
  public transferOrderStatus = TransferOrderStatus;

  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };
  public state: State = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.NINE,
    // Initial filter descriptor
    filter: {
      logic: SharedConstant.LOGIC_AND,
      filters: []
    }
  };
  constructor(public translate: TranslateService, public transferOrderService: TransferOrderService,
      private swalWarrings: SwalWarring, private router: Router, public authService: AuthService,
     private sessionService: SessionService) { }
  /**
   * permissions
   */
  public hasAddPermission: boolean;
  public hasShowPermission: boolean;
  public hasDeletePermission: boolean;
  private subscriptions: Subscription[] = [];

  /**
   * Initialise Component
   */
  ngOnInit() {
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.ADD_TRANSFERORDER);
    this.hasShowPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.SHOW_TRANSFER_ORDER);
    this.hasDeletePermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.DELETE_TRANSFERORDER);
    this.initSessionFilreConfig();
    this.initPredicateQuickSearch();
    this.initAdvancedSearchPredicate();
    this.initGridDataSource(true);

  }
  private initPredicateQuickSearch() {
    this.predicateQuickSearch = new PredicateFormat();
    this.predicateQuickSearch.Filter = new Array<Filter>();
    this.predicateQuickSearch.Relation = new Array<Relation>();
    this.predicateQuickSearch.Relation.push.apply(this.predicateQuickSearch.Relation, [new Relation(TransferOrderConstant.ID_BANK_NAVIGATION)]);
    this.predicateQuickSearch.Relation.push.apply(this.predicateQuickSearch.Relation,
      [new Relation(TransferOrderConstant.ID_BANK_ACCOUNT_NAVIGATION_ID_BANK_NAVIGATION)]);
  }

  initAdvancedSearchPredicate() {
    this.predicateAdvancedSearch = new PredicateFormat();    
    this.predicateAdvancedSearch.Filter = new Array<Filter>();
    this.predicateAdvancedSearch.Filter.push(new Filter(SharedConstant.MONTH, Operation.gte, this.valueStartDate));
    this.predicateAdvancedSearch.Filter.push(new Filter(SharedConstant.MONTH, Operation.lte, this.valueEndDate));
    this.predicateAdvancedSearch.Relation = new Array<Relation>();
    this.predicateAdvancedSearch.Relation.push.apply(this.predicateAdvancedSearch.Relation, [new Relation(TransferOrderConstant.ID_BANK_NAVIGATION)]);
    this.predicateAdvancedSearch.Relation.push.apply(this.predicateAdvancedSearch.Relation,
      [new Relation(TransferOrderConstant.ID_BANK_ACCOUNT_NAVIGATION_ID_BANK_NAVIGATION)]);
  }

  private setPredicateFiltre(isQuickSearch) {
    this.predicate = [];
    if (isQuickSearch) {
      this.state.filter.logic = SharedConstant.LOGIC_AND;
      this.gridSettings.state.filter.logic = SharedConstant.LOGIC_AND;
      this.predicateQuickSearch.Filter.push(new Filter(SharedConstant.MONTH, Operation.gte, this.valueStartDate));
      this.predicateQuickSearch.Filter.push(new Filter(SharedConstant.MONTH, Operation.lte, this.valueEndDate));
      this.predicate.push(this.predicateQuickSearch);
    } else {
      this.predicateAdvancedSearch.Operator = Operator.and;
      this.state.filter.logic = SharedConstant.LOGIC_AND;
      this.gridSettings.state.filter.logic = SharedConstant.LOGIC_AND;
      this.predicate.push(this.predicateAdvancedSearch);
    }
  }
  ngAfterViewInit(): void {
    this.sessionService.defaultStartEndDateSearchSession = new Observable((observer) => {
      // observable execution
      observer.next([new Date(this.valueStartDate), this.valueEndDate])
      observer.complete()
    })
  }
  
  /**
 * get array<Filtre> from advancedSearchComponenet
 * remove old filter property from the predicate filter list
 * case filtre type date between
 * @param filtre
 */
getFiltrePredicate(filtre) {
  this.searchType = NumberConstant.ZERO;
  this.prepareFiltreFromAdvancedSearch(filtre);
}

  /**
 * identify the predicate operator AND|OR
 * @param operator
 */
getOperatorPredicate(operator: Operator) {
  this.predicateAdvancedSearch.Operator = operator;
}
  /**
 * case filtre date between : we don't remove the old filtre date value
 * @param filtreFromAdvSearch
 * @private
 */
  private prepareFiltreFromAdvancedSearch(filtreFromAdvSearch) {
    this.predicateAdvancedSearch.Filter = this.predicateAdvancedSearch.Filter.filter(value => value.prop !== filtreFromAdvSearch.prop);
    if (filtreFromAdvSearch.isDateFiltreBetween) {
      this.predicateAdvancedSearch.Filter = this.predicateAdvancedSearch.Filter.filter(value => value.prop == filtreFromAdvSearch.prop);
      this.predicateAdvancedSearch.Filter.push(filtreFromAdvSearch.filtres[NumberConstant.ZERO]);
      this.predicateAdvancedSearch.Filter.push(filtreFromAdvSearch.filtres[NumberConstant.ONE]);
    } else if (filtreFromAdvSearch.operation && isNotNullOrUndefinedAndNotEmptyValue(filtreFromAdvSearch.value) && !filtreFromAdvSearch.SpecificFiltre) {
      this.predicateAdvancedSearch.Filter.push(filtreFromAdvSearch);
    }
  }


  private initSessionFilreConfig() {
    this.filtreFieldsColumns.push(new FiltrePredicateModel(this.translate.instant(SessionConstant.DATE), FieldTypeConstant.DATE_MONTH_TYPE, SharedConstant.MONTH));
    this.filtreFieldsColumns.push(new FiltrePredicateModel(SharedConstant.CODE, FieldTypeConstant.TEXT_TYPE, SharedConstant.CODE));
    this.filtreFieldsColumns.push(new FiltrePredicateModel(this.translate.instant(SessionConstant.TITLE), FieldTypeConstant.TEXT_TYPE, SessionConstant.TITLE));
    this.filtreFieldsInputs.push(new FiltrePredicateModel(this.translate.instant(SharedConstant.STATE_UPPERCASE), FieldTypeConstant.transferOderStateComponent, SharedConstant.STATE));
  }

   
  public removeHandler(dataItem): void {
    this.swalWarrings.CreateSwal().then((result) => {
      if (result.value) {
        this.subscriptions.push(this.transferOrderService.remove(dataItem).subscribe(() => {
          this.initGridDataSource();
        }));
      }
    });
  }

  public initGridDataSource(isQuickSearch?: boolean): void {
    this.setPredicateFiltre(isQuickSearch);
    if (isQuickSearch) {
      this.gridSettings.state.skip = NumberConstant.ZERO;
    }
      this.subscriptions.push(this.transferOrderService.reloadServerSideDataWithListPredicate(this.gridSettings.state, this.predicate, SharedConstant.GET_DATA_WITH_SPECIFIC_FILTER)
      .subscribe(data => {
        this.gridSettings.gridData = data;
      }));      
  }

  public dataStateChange(state: State): void {
    this.gridSettings.state = state;
      this.subscriptions.push(this.transferOrderService.reloadServerSideDataWithListPredicate(state, this.predicate, 
      SharedConstant.GET_DATA_WITH_SPECIFIC_FILTER).subscribe(data => this.gridSettings.gridData = data));
  }



  public editHandler(dataItem): void {
    this.router.navigateByUrl(TransferOrderConstant.TRANSFER_ORDER_GENERATION.concat(dataItem.Id.toString()), { skipLocationChange: true });
    this.router.navigateByUrl(TransferOrderConstant.TRANSFER_ORDER_GENERATION.concat(dataItem.Id.toString()), { skipLocationChange: true });
  }

  public receiveData(event: any) {
    this.predicateQuickSearch = event.predicate;
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.initGridDataSource(true);
  }

  resetClickEvent() {
    this.predicateQuickSearch.Filter = [];
    this.predicateAdvancedSearch.Filter = [];
    this.searchSessionComponent.sessionString = SharedConstant.EMPTY;
    this.initGridDataSource(true);
  }

  ngOnDestroy(): void {
    if (this.subscriptions !== undefined) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
  }
}
