import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PagerSettings } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { Observable } from 'rxjs/Observable';
import { isNullOrUndefined } from 'util';
import { CnssDeclarationConstant } from '../../../constant/payroll/cnss-declaration.constant';
import { SessionConstant } from '../../../constant/payroll/session.constant';
import { FieldTypeConstant } from '../../../constant/shared/fieldType.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { FiltrePredicateModel } from '../../../models/shared/filtrePredicate.model';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { Filter, Operation, Operator, PredicateFormat, Relation } from '../../../shared/utils/predicate';
import { StarkRolesService } from '../../../stark-permissions/service/roles.service';
import { isNotNullOrUndefinedAndNotEmptyValue, notEmptyValue } from '../../../stark-permissions/utils/utils';
import { CnssDeclarationService } from '../../services/cnss-declaration/cnss-declaration.service';
import { SessionService } from '../../services/session/session.service';
import { SearchSessionComponent } from '../../components/search-session/search-session.component';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';

@Component({
  selector: 'app-list-cnss-declaration',
  templateUrl: './list-cnss-declaration.component.html',
  styleUrls: ['./list-cnss-declaration.component.scss']
})
export class ListCnssDeclarationComponent implements OnInit {
  public filtreFieldsColumns = [];
  public filtreFieldsInputs = [];

  /**
* flag to identify the searchType
* advanced search = 0 ,quick search = 1
*/
  public searchType = NumberConstant.ONE;

  /**
* advanced search predicate
*/
  public predicateAdvancedSearch: PredicateFormat;
  /**
    * quick search predicate
    */
  public predicateQuickSearch: PredicateFormat;
  value = new Date();
  public valueStartDate: Date = new Date(this.value.getFullYear(), NumberConstant.ZERO, NumberConstant.SHIFT_FIRST_DATE);
  public valueEndDate: Date = new Date(this.value.getFullYear(), NumberConstant.TWELVE, NumberConstant.ZERO);
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
  public columnsConfig: ColumnSettings[] = [
    {
      field: SharedConstant.CODE,
      title: SharedConstant.CODE_UPPERCASE,
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: CnssDeclarationConstant.TITLE,
      title: CnssDeclarationConstant.TITLE_UPPERCASE,
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: CnssDeclarationConstant.TRIMESTER,
      title: CnssDeclarationConstant.TRIMESTER_UPPERCASE,
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: CnssDeclarationConstant.YEAR,
      title: CnssDeclarationConstant.YEAR_UPPERCASE,
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: CnssDeclarationConstant.ID_CNSS_NAVIGATION_LABEL,
      title: CnssDeclarationConstant.ID_CNSS_NAVIGATION_LABEL_UPPERCASE,
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: CnssDeclarationConstant.STATE,
      title: CnssDeclarationConstant.STATE_UPPERCASE,
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED
    }
  ];
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };
  public hasAddPermission: boolean;
  public hasShowPermission: boolean;
  public hasDeletePermission: boolean;
  public state: State = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.NINE,
    // Initial filter descriptor
    filter: {
      logic: SharedConstant.LOGIC_AND,
      filters: []
    }
  };

  constructor(public cnssDeclarationService: CnssDeclarationService, private swalWarrings: SwalWarring, public authService: AuthService,
    private roleService: StarkRolesService, private router: Router, private translate: TranslateService, private sessionService: SessionService) { }


  ngAfterViewInit(): void {
    this.sessionService.defaultStartEndDateSearchSession = new Observable((observer) => {
      // observable execution
      observer.next([new Date(this.valueStartDate), this.valueEndDate])
      observer.complete()
    })
  }

  /**
   * Initialise Component
   */
    ngOnInit() {
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.ADD_CNSSDECLARATION);
    this.hasShowPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.SHOW_CNSSDECLARATION);
    this.hasDeletePermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.DELETE_CNSSDECLARATION);
    this.initSessionFilreConfig();
    this.initAdvancedSearchPredicate();
    this.initPredicateQuickSearch();
    this.initGridDataSource(true);
  }
  private initPredicateQuickSearch() {
    this.predicateQuickSearch = new PredicateFormat();
    this.predicateQuickSearch.Filter = new Array<Filter>();
    this.predicateQuickSearch.Filter.push(new Filter(SharedConstant.YEAR, Operation.eq, this.valueStartDate));
    this.predicateQuickSearch.Relation = new Array<Relation>();
    this.predicateQuickSearch.Relation.push.apply(this.predicateQuickSearch.Relation, [new Relation(CnssDeclarationConstant.ID_CNSS_NAVIGATION)]);
  }
  initAdvancedSearchPredicate() {
    this.predicateAdvancedSearch = new PredicateFormat();
    this.predicateAdvancedSearch.Filter = new Array<Filter>();
    this.predicateAdvancedSearch.Filter.push(new Filter(SharedConstant.YEAR, Operation.eq, this.valueStartDate));
    this.predicateAdvancedSearch.Relation = new Array<Relation>();
    this.predicateAdvancedSearch.Relation.push.apply(this.predicateAdvancedSearch.Relation, [new Relation(CnssDeclarationConstant.ID_CNSS_NAVIGATION)]);
  }
  initSessionFilreConfig() {
    this.filtreFieldsColumns.push(new FiltrePredicateModel(this.translate.instant(CnssDeclarationConstant.DATE), FieldTypeConstant.DATE_YEAR_TYPE, SharedConstant.YEAR));
    this.filtreFieldsColumns.push(new FiltrePredicateModel(this.translate.instant(CnssDeclarationConstant.TRIMESTER_UPPERCASE), FieldTypeConstant.trimesterComponent, CnssDeclarationConstant.TRIMESTER));
    this.filtreFieldsColumns.push(new FiltrePredicateModel(SharedConstant.CODE, FieldTypeConstant.TEXT_TYPE, SharedConstant.CODE));
    this.filtreFieldsInputs.push(new FiltrePredicateModel(this.translate.instant(CnssDeclarationConstant.TITLE_UPPERCASE), FieldTypeConstant.TEXT_TYPE, SessionConstant.TITLE));
    this.filtreFieldsInputs.push(new FiltrePredicateModel(this.translate.instant(CnssDeclarationConstant.ID_CNSS_NAVIGATION_LABEL_UPPERCASE), FieldTypeConstant.cnssDropdownComponent, CnssDeclarationConstant.ID_CNSS_NAVIGATION_LABEL));
    this.filtreFieldsInputs.push(new FiltrePredicateModel(this.translate.instant(CnssDeclarationConstant.STATE_UPPERCASE), FieldTypeConstant.transferOderStateComponent, SharedConstant.STATE));
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
      this.predicateAdvancedSearch.Filter.push(filtreFromAdvSearch.filtres[NumberConstant.ZERO]);
      this.predicateAdvancedSearch.Filter.push(filtreFromAdvSearch.filtres[NumberConstant.ONE]);
    } else if (filtreFromAdvSearch.operation && isNotNullOrUndefinedAndNotEmptyValue(filtreFromAdvSearch.value) && !filtreFromAdvSearch.SpecificFiltre) {
      if (filtreFromAdvSearch.prop === "Trimester") {
        filtreFromAdvSearch.value.forEach((trimester) => {
          this.predicateAdvancedSearch.Filter.push(new Filter(CnssDeclarationConstant.TRIMESTER, Operation.eq, trimester, false, true));
        });
      } else {
        this.predicateAdvancedSearch.Filter.push(filtreFromAdvSearch);
      }
    }
  }
  /**
 * identify the predicate operator AND|OR
 * @param operator
 */
  getOperatorPredicate(operator: Operator) {
    this.predicateAdvancedSearch.Operator = operator;
  }

  /**
   * remove a Cnss declaration
   * @param dataItem
   */
  public removeHandler(dataItem): void {
    this.swalWarrings.CreateSwal().then((result) => {
      if (result.value) {
        this.cnssDeclarationService.remove(dataItem).subscribe(() => {
          this.initGridDataSource();
        });
      }
    });
  }

  /**
   * Get the Cnss declaration list from the server
  */
  public initGridDataSource(isQuickSearch?: boolean): void {
    this.setPredicateFiltre(isQuickSearch);
    if (isQuickSearch) {
      this.gridSettings.state.skip = NumberConstant.ZERO;
    }
    this.cnssDeclarationService.reloadServerSideDataWithListPredicate(this.gridSettings.state, this.predicate, SharedConstant.GET_DATA_WITH_SPECIFIC_FILTER)
      .subscribe(data => {
        this.gridSettings.gridData = data;
      });
  }

  private setPredicateFiltre(isQuickSearch) {
    this.predicate = [];
    if (isQuickSearch) {
      this.state.filter.logic = SharedConstant.LOGIC_AND;
      this.gridSettings.state.filter.logic = SharedConstant.LOGIC_AND;
      this.predicate.push(this.predicateQuickSearch);
    } else {
      this.predicateAdvancedSearch.Operator = Operator.and;
      this.state.filter.logic = SharedConstant.LOGIC_AND;
      this.gridSettings.state.filter.logic = SharedConstant.LOGIC_AND;
      this.predicate.push(this.predicateAdvancedSearch);
    }
  }


  /**
   * this method is invoked if the page number or filter has changed
   * @param state
   */
  public dataStateChange(state: State): void {
    this.gridSettings.state = state;
    this.cnssDeclarationService.reloadServerSideDataWithListPredicate(state, this.predicate, SharedConstant.GET_DATA_WITH_SPECIFIC_FILTER).subscribe(
      data => this.gridSettings.gridData = data);
  }

  /**
   * Edit Cnss declaration
   * @param dataItem
   */
  public editHandler(dataItem): void {
    this.router.navigateByUrl(CnssDeclarationConstant.CNSS_DECLARATION_EDIT_URL.concat(dataItem.Id),
      {queryParams: dataItem, skipLocationChange: true});
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
}
