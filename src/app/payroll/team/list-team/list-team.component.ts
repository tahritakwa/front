import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PagerSettings } from '@progress/kendo-angular-grid';
import { SortDescriptor, State } from '@progress/kendo-data-query';
import { Subscription } from 'rxjs/Subscription';
import { isNullOrUndefined } from 'util';
import { EmployeeConstant } from '../../../constant/payroll/employee.constant';
import { TeamConstant } from '../../../constant/payroll/team.constant';
import { CandidateConstant } from '../../../constant/rh/candidate.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { ActiveTeamEnumerator } from '../../../models/enumerators/active-team.enum';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { Filter, Operation, OrderBy, OrderByDirection, PredicateFormat, Relation } from '../../../shared/utils/predicate';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { TeamService } from '../../services/team/team.service';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { FieldTypeConstant } from '../../../constant/shared/fieldType.constant';
import { FiltrePredicateModel } from '../../../models/shared/filtrePredicate.model';
import { isNotNullOrUndefinedAndNotEmptyValue } from '../../../stark-permissions/utils/utils';
import { SearchTeamComponent } from '../../components/search-team/search-team.component';

@Component({
  selector: 'app-list-team',
  templateUrl: './list-team.component.html',
  styleUrls: ['./list-team.component.scss']
})
export class ListTeamComponent implements OnInit, OnDestroy {

  // pager settings
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public dateFormat = this.translate.instant(SharedConstant.DATE_FORMAT);
  // Enum  Active, Inactive
  public statusCode = ActiveTeamEnumerator;
  searchTeamFormGroup: FormGroup;
  @ViewChild(SearchTeamComponent) searchTeamComponent: SearchTeamComponent;
  /**
   * advanced search predicate
   */
  public predicateAdvancedSearch: PredicateFormat;
  public quickSearchPredicate: PredicateFormat;
  public initialColumnsForFilter: FiltrePredicateModel[] = [];
  public columnsToBeAddForFilter: FiltrePredicateModel[] = [];
  public predicate: PredicateFormat[] = [];
  public gridState: State = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.TWENTY,
    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: []
    }
  };
  public columnsConfig: ColumnSettings[] = [
    {
      field: TeamConstant.NAME,
      title: TeamConstant.TEAM_NAME.toUpperCase(),
      filterable: false,
      _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: TeamConstant.ID_MANAGER_NAVIGATION.concat('.').concat(EmployeeConstant.FULL_NAME),
      title: TeamConstant.TEAM_MANAGER,
      filterable: false,
      _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: TeamConstant.CREATION_DATE,
      title: TeamConstant.CREATION_DATE_UPPER,
      format: this.translate.instant(SharedConstant.DATE_FORMAT),
      filterable: false,
      _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: TeamConstant.ASSIGNED_NUMBER,
      title: TeamConstant.ASSIGNED_NUMBER_UPPER,
      filterable: false,
      _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: TeamConstant.STATE,
      title: TeamConstant.STATE_TITLE,
      filterable: false,
      _width: NumberConstant.TWO_HUNDRED
    }
  ];
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };
  public sort: SortDescriptor[] = [{
    field: CandidateConstant.FIRST_NAME,
    dir: SharedConstant.ASC
  }];
  private subscriptions: Subscription[] = [];
  /** Permissions */
  public hasAddPermission: boolean;
  public hasShowPermission: boolean;
  public hasDeletePermission: boolean;
  public hasUpdatePermission: boolean;
  constructor(public teamService: TeamService, private router: Router,
              private swalWarrings: SwalWarring, private fb: FormBuilder,
      public authService: AuthService, private translate: TranslateService) {
  }

  ngOnInit() {
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.ADD_TEAM);
    this.hasShowPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.SHOW_TEAM);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.UPDATE_TEAM);
    this.hasDeletePermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.DELETE_TEAM);
    this.prepareColumnsForFilter();
    this.prepareInitialPredicate();
    this.initGridDataSource();
  }
  private prepareInitialPredicate() {
    const predicate = this.prepareTeamPredicate();
    this.predicate.push(predicate);
    const predicateAdv = this.prepareTeamPredicate();
    const predicateQuick = this.prepareTeamPredicate();
    this.predicateAdvancedSearch = predicateAdv;
    this.quickSearchPredicate = predicateQuick;
  }

  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.initGridDataSource();
  }
  getPredicateFromQuickSearch(predicate) {
    if (predicate.Filter[NumberConstant.ZERO].value === '') {
      this.quickSearchPredicate = this.prepareTeamPredicate();
    }
    this.predicate = [];
    this.predicate.push(this.mergefilters());
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.initGridDataSource();
  }

  public dataStateChange(state: State): void {
    this.gridSettings.state = state;
    this.initGridDataSource();
  }

  statusGridFilte($event) {
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.dataStateChange(this.gridSettings.state);
  }
/**
   * To prepare for advanced search
   */
  public prepareColumnsForFilter() {
    this.initialColumnsForFilter.push(new FiltrePredicateModel(TeamConstant.TEAM_NAME, FieldTypeConstant.TEXT_TYPE,
      TeamConstant.NAME));
    this.initialColumnsForFilter.push(new FiltrePredicateModel(TeamConstant.TEAM_MANAGER, FieldTypeConstant.employeeDropdownComponent,
      TeamConstant.ID_NAVIGATION_MANAGER));
      this.initialColumnsForFilter.push(new FiltrePredicateModel(TeamConstant.CREATION_DATE_UPPER, FieldTypeConstant.DATE_TYPE,
        TeamConstant.CREATION_DATE));
    this.columnsToBeAddForFilter.push(new FiltrePredicateModel(TeamConstant.STATE_TITLE, FieldTypeConstant.statusTeamCode,
      TeamConstant.STATE));
  }
  initGridDataSource() {
    this.teamService.reloadServerSideDataWithListPredicate(this.gridSettings.state,
      this.predicate, TeamConstant.GET_TEAMS_BY_FILTER).subscribe(data =>
      this.gridSettings.gridData = data
    );
  }

  /**
   * prepare Team Predicate
   * */
  prepareTeamPredicate(): PredicateFormat {
    const predicate = new PredicateFormat();
    predicate.Relation = new Array<Relation>();
    predicate.OrderBy = new Array<OrderBy>();
    predicate.Filter = new Array<Filter>();
    predicate.Relation.push.apply(predicate.Relation, [new Relation(TeamConstant.ID_MANAGER_NAVIGATION)]);
    predicate.OrderBy.push.apply(predicate.OrderBy, [new OrderBy(TeamConstant.ID, OrderByDirection.desc)]);
    return predicate;
  }
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
    } 
    else if (filtre.operation && isNotNullOrUndefinedAndNotEmptyValue(filtre.value) && !filtre.SpecificFiltre) {
      this.predicateAdvancedSearch.Filter.push(filtre);
    }else if (filtre.prop == TeamConstant.STATE && filtre.value == NumberConstant.ZERO){
      this.predicateAdvancedSearch.Filter.push(filtre);
    }
  }
  resetClickEvent() {
    this.predicate = [];
    this.searchTeamComponent.searchValue = SharedConstant.EMPTY;
    this.predicate.push(this.mergefilters());
    this.predicate[NumberConstant.ZERO].Filter = [];
    this.initGridDataSource();
  }
  public removeHandler(dataItem) {
    this.swalWarrings.CreateSwal(TeamConstant.DELETE_TEAM).then((result) => {
      if (result.value) {
        this.subscriptions.push(this.teamService.remove(dataItem).subscribe(() => {
          this.initGridDataSource();
        }));
      }
    });
  }

  public goToAdvancedEdit(id) {
    this.router.navigateByUrl(TeamConstant.TEAM_EDIT_URL.concat(id), {skipLocationChange: true});
  }
  ngOnDestroy(): void {
    if (this.subscriptions !== undefined) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
  }

  private createSearchTeamForm(): void {
    this.searchTeamFormGroup = this.fb.group({
      Name: [undefined],
      IdEmployee: [undefined],
      CreationDate: [undefined],
      Status: [undefined]
    });
  }

  get IdEmployee(): FormControl {
    return this.searchTeamFormGroup.get(TeamConstant.ID_MANAGER) as FormControl;
  }

  get Name(): FormControl {
    return this.searchTeamFormGroup.get(TeamConstant.NAME) as FormControl;
  }

  get CreationDate(): FormControl {
    return this.searchTeamFormGroup.get(TeamConstant.CREATION_DATE) as FormControl;
  }

  get Status(): FormControl {
    return this.searchTeamFormGroup.get(TeamConstant.STATE_TITLE) as FormControl;
  }
}
