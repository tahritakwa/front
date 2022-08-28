import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PagerSettings } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { SourceDeductionConstant } from '../../../constant/payroll/source-deduction.constant';
import { FieldTypeConstant } from '../../../constant/shared/fieldType.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PayrollSessionState } from '../../../models/enumerators/session-state.enum';
import { SourceDeductionSession } from '../../../models/payroll/source-deduction-session.model';
import { FiltrePredicateModel } from '../../../models/shared/filtrePredicate.model';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { Filter, Operation, Operator, PredicateFormat } from '../../../shared/utils/predicate';
import { isNotNullOrUndefinedAndNotEmptyValue } from '../../../stark-permissions/utils/utils';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { SearchSessionComponent } from '../../components/search-session/search-session.component';
import { SessionService } from '../../services/session/session.service';
import { SourceDeductionSessionService } from '../../services/source-deduction-session/source-deduction-session.service';
@Component({
  selector: 'app-list-source-deduction-session',
  templateUrl: './list-source-deduction-session.component.html',
  styleUrls: ['./list-source-deduction-session.component.scss']
})
export class ListSourceDeductionSessionComponent implements OnInit {
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

  value = new Date();
  public valueStartYear: Date = new Date(this.value.getFullYear(), NumberConstant.ZERO, NumberConstant.SHIFT_FIRST_DATE);
  public valueEndYear: Date = new Date(this.value.getFullYear(), NumberConstant.TWELVE, NumberConstant.ZERO);

  public isModal = false;
  public sourceDeductionSessionInfos = new SourceDeductionSession();
  @ViewChild(SearchSessionComponent) searchSessionComponent: SearchSessionComponent;
  // pager settings
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
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

  public state: State = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.NINE,
    // Initial filter descriptor
    filter: {
      logic: SharedConstant.LOGIC_AND,
      filters: []
    }
  };

  public columnsConfig: ColumnSettings[] = [
    {
      field: SourceDeductionConstant.CODE,
      title: SourceDeductionConstant.CODE,
      filterable: true
    },
    {
      field: SourceDeductionConstant.TITLE,
      title: SourceDeductionConstant.TITLE_UPPERCASE,
      filterable: true
    },
    {
      field: SourceDeductionConstant.YEAR,
      title: SourceDeductionConstant.YEAR_UPPERCASE,
      filterable: true,
    }
  ];
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };
    /**
  * flag to identify the searchType
  * advanced search = 0 ,quick search = 1
  */
 public searchType = NumberConstant.ONE;

  sessionState = PayrollSessionState;
  /*
  * permissions
  */
  public hasAddPermission: boolean;
  public hasShowPermission: boolean;
  public hasDeletePermission: boolean;
  public hasUpdatePermission: boolean;

  private subscriptions: Subscription[] = [];

  constructor(public sourceDeductionSessionService: SourceDeductionSessionService,
    public sessionService: SessionService,
      private swalWarrings: SwalWarring, private router: Router, public translate: TranslateService, private authService: AuthService) {
  }
  
  ngAfterViewInit(): void {
    this.sessionService.defaultStartEndDateSearchSession = new Observable((observer) => {
      // observable execution
      observer.next([new Date(this.valueStartYear), this.valueEndYear])
      observer.complete()
    })
  }

  ngOnInit() {
    this.initSourceDeductionFiltre();
    this.initAdvancedSearchPredicate();
    this.initPredicateQuickSearch();
    this.initGridDataSource(true);
      this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.ADD_SOURCEDEDUCTIONSESSION);
      this.hasShowPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.SHOW_SOURCEDEDUCTIONSESSION);
      this.hasDeletePermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.DELETE_SOURCEDEDUCTIONSESSION);
      this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.UPDATE_SOURCEDEDUCTIONSESSION);
    }
  initAdvancedSearchPredicate() {    
    this.predicateAdvancedSearch = new PredicateFormat();
    this.predicateAdvancedSearch.Filter = new Array<Filter>();
    this.predicateAdvancedSearch.Filter.push(new Filter(SharedConstant.YEAR, Operation.gte, this.valueStartYear.getFullYear()));
    this.predicateAdvancedSearch.Filter.push(new Filter(SharedConstant.YEAR, Operation.lte, this.valueEndYear.getFullYear()));
  }
  
  private initPredicateQuickSearch() {
    this.predicateQuickSearch = new PredicateFormat();
    this.predicateQuickSearch.Filter = new Array<Filter>();
  }
  /**
 * identify the predicate operator AND|OR
 * @param operator
 */
  getOperatorPredicate(operator: Operator) {
    this.predicateAdvancedSearch.Operator = operator;
  }

  initSourceDeductionFiltre() {
    this.filtreFieldsColumns.push(new FiltrePredicateModel(this.translate.instant(SourceDeductionConstant.DATE_UPPERCASE), FieldTypeConstant.DATE_YEAR_SOURCEDEDUCTION_TYPE, SharedConstant.YEAR));
    this.filtreFieldsColumns.push(new FiltrePredicateModel(SharedConstant.CODE, FieldTypeConstant.TEXT_TYPE, SourceDeductionConstant.CODE));
    this.filtreFieldsColumns.push(new FiltrePredicateModel(this.translate.instant(SourceDeductionConstant.TITLE_UPPERCASE), FieldTypeConstant.TEXT_TYPE, SourceDeductionConstant.TITLE));
  }
  
   

  /**
   * Init grid with data from the datasource
   */
  initGridDataSource(isQuickSearch?: boolean) {
    this.setPredicateFiltre(isQuickSearch);
    if (isQuickSearch) {
      this.gridSettings.state.skip = NumberConstant.ZERO;
    }
    this.subscriptions.push(this.sourceDeductionSessionService.reloadServerSideDataWithListPredicate(this.gridSettings.state, this.predicate,
       SharedConstant.GET_DATA_WITH_SPECIFIC_FILTER).
      subscribe(result =>
        this.gridSettings.gridData = result
      ));
  }

  private setPredicateFiltre(isQuickSearch) {
    this.predicate = [];
    if (isQuickSearch) {
      this.state.filter.logic = SharedConstant.LOGIC_AND;
      this.gridSettings.state.filter.logic = SharedConstant.LOGIC_AND;
      this.predicateQuickSearch.Filter.push(new Filter(SharedConstant.YEAR, Operation.gte, this.valueStartYear.getFullYear()));
      this.predicateQuickSearch.Filter.push(new Filter(SharedConstant.YEAR, Operation.lte, this.valueEndYear.getFullYear()));
      this.predicate.push(this.predicateQuickSearch);
    } else {
      this.predicateAdvancedSearch.Operator = Operator.and;
      this.state.filter.logic = SharedConstant.LOGIC_AND;
      this.gridSettings.state.filter.logic = SharedConstant.LOGIC_AND;
      this.predicate.push(this.predicateAdvancedSearch);
    }
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
    this.predicateAdvancedSearch.Filter = this.predicateAdvancedSearch.Filter.filter(value => value.prop == filtreFromAdvSearch.prop);
    filtreFromAdvSearch.filtres[NumberConstant.ZERO].value = filtreFromAdvSearch.filtres[NumberConstant.ZERO].value.getFullYear();
    filtreFromAdvSearch.filtres[NumberConstant.ONE].value = filtreFromAdvSearch.filtres[NumberConstant.ONE].value.getFullYear();
    this.predicateAdvancedSearch.Filter.push(filtreFromAdvSearch.filtres[NumberConstant.ZERO]);
    this.predicateAdvancedSearch.Filter.push(filtreFromAdvSearch.filtres[NumberConstant.ONE]);
  } else if (filtreFromAdvSearch.operation && isNotNullOrUndefinedAndNotEmptyValue(filtreFromAdvSearch.value) && !filtreFromAdvSearch.SpecificFiltre) {
    this.predicateAdvancedSearch.Filter.push(filtreFromAdvSearch);
  }
}
  /**
   * remove item from grid
   */
  public removeHandler({dataItem}) {
    this.swalWarrings.CreateSwal().then((result) => {
      if (result.value) {
        this.subscriptions.push(this.sourceDeductionSessionService.remove(dataItem).subscribe(() => {
          this.initGridDataSource();
        }));
      }
    });
  }

  /**
   * Reload grid data when data is changed
   * @param state
   */
  public dataStateChange(state: State): void {
    this.gridSettings.state = state;
    this.subscriptions.push(this.sourceDeductionSessionService.reloadServerSideDataWithListPredicate(state, this.predicate, 
      SharedConstant.GET_DATA_WITH_SPECIFIC_FILTER).subscribe(data => this.gridSettings.gridData = data));
  }

  /**
   * Opens the session in the interface corresponding to its state
   * @param id
   */
  public getSession(id: number) {
    this.subscriptions.push(this.sourceDeductionSessionService.getByIdWithRelation(id).subscribe(data => {
      this.sourceDeductionSessionInfos = data;
      if (this.sourceDeductionSessionInfos.State === PayrollSessionState.New) {
        this.router.navigateByUrl(SourceDeductionConstant.SOURCE_DEDUCTION_URL.concat(this.sourceDeductionSessionInfos.Id.toString()));
      } else {
        this.router.navigateByUrl(SourceDeductionConstant.SOURCE_DEDUCTION_URL.concat(this.sourceDeductionSessionInfos.Id.toString()), {skipLocationChange: true});
      }
    }));
  }

  public receiveData(event: any) {
    this.predicateQuickSearch = event.predicate;
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.initGridDataSource(true);
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
  ngOnDestroy(): void {
    if (this.subscriptions !== undefined) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
  }
}
