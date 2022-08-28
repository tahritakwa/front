import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { PagerSettings } from '@progress/kendo-angular-grid';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { Filter, Operation, Operator, PredicateFormat } from '../../../shared/utils/predicate';
import { State } from '@progress/kendo-data-query';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { BillingSession } from '../../../models/sales/billing-session.model';
import { BillingSessionService } from '../../services/billing-session/billing-session.service';
import { Router } from '@angular/router';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { BillingSessionConstant } from '../../../constant/sales/billing-session.constant';
import { BillingSessionState } from '../../../models/enumerators/BillingSessionState.enum';
import { isNotNullOrUndefinedAndNotEmptyValue } from '../../../stark-permissions/utils/utils';
import { FiltrePredicateModel } from '../../../models/shared/filtrePredicate.model';
import { FieldTypeConstant } from '../../../constant/shared/fieldType.constant';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { SessionService } from '../../../payroll/services/session/session.service';
import { SearchSessionComponent } from '../../../payroll/components/search-session/search-session.component';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';

@Component({
  selector: 'app-list-billing-session',
  templateUrl: './list-billing-session.component.html',
  styleUrls: ['./list-billing-session.component.scss']
})

export class ListBillingSessionComponent implements OnInit, AfterViewInit {
  public filtreFieldsColumns = [];
  public filtreFieldsInputs = [];
  isModal = false;
  // pager settings
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public statusCode = BillingSessionState;
  public predicate: PredicateFormat[] = [];
  @ViewChild(SearchSessionComponent) searchSessionComponent: SearchSessionComponent;
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

  /**
  * flag to identify the searchType
  * advanced search = 0 ,quick search = 1
  */
 public searchType = NumberConstant.ONE;

  public columnsConfig: ColumnSettings[] = [
    {
      field: SharedConstant.CODE,
      title: SharedConstant.CODE_UPPERCASE,
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: SharedConstant.TITLE,
      title: SharedConstant.TITLE_UPPERCASE,
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: SharedConstant.MONTH,
      title: SharedConstant.MONTH_UPPERCASE,
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: SharedConstant.STATE,
      title: SharedConstant.STEP_UPPERCASE,
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED
    }
  ];
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };
  sessionInfos: BillingSession = new BillingSession();
  /**
* advanced search predicate
*/
public predicateAdvancedSearch: PredicateFormat;
/**
  * quick search predicate
  */
public predicateQuickSearch: PredicateFormat;

public state: State = {
  skip: NumberConstant.ZERO,
  take: NumberConstant.NINE,
  // Initial filter descriptor
  filter: {
    logic: SharedConstant.LOGIC_AND,
    filters: []
  }
};


  public hasAddPermission: boolean;
  public hasDeletePermission: boolean;
  public hasShowPermission: boolean;
  public hasUpdatePermission: boolean;

  constructor(public translate: TranslateService, public billingSessionService: BillingSessionService, private swalWarrings: SwalWarring,
    private router: Router, private sessionService: SessionService, private authService: AuthService) {
  }

  ngAfterViewInit(): void {
    this.sessionService.defaultStartEndDateSearchSession = new Observable((observer) => {
      // observable execution
      observer.next([new Date(this.valueStartDate), this.valueEndDate]);
      observer.complete();
    });
  }
  ngOnInit() {
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.ADD_BILLING_SESSION);
    this.hasDeletePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.DELETE_BILLING_SESSION);
    this.hasShowPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.SHOW_BILLING_SESSION);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_BILLING_SESSION);
    this.initSessionFiltreConfig();
    this.initAdvancedSearchPredicate();
    this.initPredicateQuickSearch();
    this.initGridDataSource(true);
   }

   initAdvancedSearchPredicate() {
    this.predicateAdvancedSearch = new PredicateFormat();
    this.predicateAdvancedSearch.Filter = new Array<Filter>();
    this.predicateAdvancedSearch.Filter.push(new Filter(SharedConstant.MONTH, Operation.gte, this.valueStartDate));
    this.predicateAdvancedSearch.Filter.push(new Filter(SharedConstant.MONTH, Operation.lte, this.valueEndDate));
  }

  private initPredicateQuickSearch() {
    this.predicateQuickSearch = new PredicateFormat();
    this.predicateQuickSearch.Filter = new Array<Filter>();
  }

  private initSessionFiltreConfig() {
    this.filtreFieldsColumns.push(new FiltrePredicateModel(this.translate.instant(BillingSessionConstant.MONTH_UPPERCASE),
      FieldTypeConstant.DATE_MONTH_TYPE, SharedConstant.MONTH));
    this.filtreFieldsColumns.push(new FiltrePredicateModel(this.translate.instant(SharedConstant.CODE_UPPERCASE),
      FieldTypeConstant.TEXT_TYPE, SharedConstant.CODE));
    this.filtreFieldsColumns.push(new FiltrePredicateModel(this.translate.instant(SharedConstant.TITLE_UPPERCASE),
      FieldTypeConstant.TEXT_TYPE, SharedConstant.TITLE));
    this.filtreFieldsInputs.push(new FiltrePredicateModel(this.translate.instant(SharedConstant.STATE_UPPERCASE),
      FieldTypeConstant.BILLING_SESSION_DROPDOWN, SharedConstant.STATE));
  }
  public removeHandler(dataItem) {
    this.swalWarrings.CreateSwal().then((result) => {
      if (result.value) {
        this.billingSessionService.remove(dataItem).subscribe(() => {
          this.initGridDataSource();
        });
      }
    });
  }

  /**
   * Init grid with data from the datasource
   */
  initGridDataSource(isQuickSearch?: boolean) {
    this.setPredicateFiltre(isQuickSearch);
    if (isQuickSearch) {
      this.gridSettings.state.skip = NumberConstant.ZERO;
    }
    this.billingSessionService.reloadServerSideDataWithListPredicate(this.gridSettings.state, this.predicate,
      SharedConstant.GET_DATA_WITH_SPECIFIC_FILTER).subscribe((data) => {
      this.gridSettings.gridData = data;
    });
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

  /**
   * Reload grid data when data is changed
   * @param state
   */
  public dataStateChange(state: State): void {
    if (!state.sort[NumberConstant.ZERO] || (state.sort[NumberConstant.ZERO] && !state.sort[NumberConstant.ZERO].dir)) {
      state.sort = [];
    }
    this.gridSettings.state = state;
    this.billingSessionService.reloadServerSideDataWithListPredicate(state, this.predicate,
      SharedConstant.GET_DATA_WITH_SPECIFIC_FILTER).subscribe(data => this.gridSettings.gridData = data);
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
 * case filtre date between : we don't remove the old filtre date value
 * @param filtreFromAdvSearch
 * @private
 */
private prepareFiltreFromAdvancedSearch(filtreFromAdvSearch) {
  this.predicateAdvancedSearch.Filter = this.predicateAdvancedSearch.Filter.filter(value => value.prop !== filtreFromAdvSearch.prop);
  if (filtreFromAdvSearch.isDateFiltreBetween) {
    this.predicateAdvancedSearch.Filter = this.predicateAdvancedSearch.Filter.filter(value => value.prop === filtreFromAdvSearch.prop);
    this.predicateAdvancedSearch.Filter.push(filtreFromAdvSearch.filtres[NumberConstant.ZERO]);
    this.predicateAdvancedSearch.Filter.push(filtreFromAdvSearch.filtres[NumberConstant.ONE]);
  } else if (filtreFromAdvSearch.operation && isNotNullOrUndefinedAndNotEmptyValue(filtreFromAdvSearch.value)
    && !filtreFromAdvSearch.SpecificFiltre) {
    this.predicateAdvancedSearch.Filter.push(filtreFromAdvSearch);
  }
}

  /**
   * Opens the session in the interface corresponding to its state
   * @param id
   */
  public getBillingSession(id: number) {
    this.billingSessionService.getBillingSessionDetailsById(id).subscribe(data => {
      this.sessionInfos = data;
      switch (this.sessionInfos.State) {
        case BillingSessionState.New: {
          this.router.navigateByUrl(BillingSessionConstant.BILLING_SESSION_Update.concat(id.toString(), SharedConstant.SLASH,
            String(this.hasUpdatePermission)), { skipLocationChange: true });
          break;
        }
        case BillingSessionState.Project: {
          this.router.navigateByUrl(BillingSessionConstant.VALIDATE_CRA.concat(id.toString(), SharedConstant.SLASH,
            String(this.hasUpdatePermission)), { skipLocationChange: true });
          break;
        }
        case BillingSessionState.Bills: {
          this.router.navigateByUrl(BillingSessionConstant.DOCUMENT_GENERATED.concat(id.toString(), SharedConstant.SLASH,
            String(this.hasUpdatePermission)), { skipLocationChange: true });
          break;
        }
        default: {
          this.router.navigateByUrl(BillingSessionConstant.DOCUMENT_GENERATED.concat(id.toString(), SharedConstant.SLASH,
            String(this.hasUpdatePermission)), { skipLocationChange: true });
        }
      }
    });
  }

  public receiveData(event: any) {
    this.predicateQuickSearch = event.predicate;
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.initGridDataSource(true);
  }

    /**
 * identify the predicate operator AND|OR
 * @param operator
 */
getOperatorPredicate(operator: Operator) {
  this.predicateAdvancedSearch.Operator = operator;
}

 /**
   * Reset dataGrid
   */
  resetClickEvent() {
    this.predicateQuickSearch.Filter = [];
    this.predicateAdvancedSearch.Filter = [];
    this.searchSessionComponent.sessionString = SharedConstant.EMPTY;
    this.initGridDataSource(true);
  }
}
