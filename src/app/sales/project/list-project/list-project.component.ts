import { Component, OnInit } from '@angular/core';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { ProjectConstant } from '../../../constant/rh/project.constant';
import { State } from '@progress/kendo-data-query';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { PredicateFormat, Filter, Operation, Relation, OrderBy, OrderByDirection, Operator } from '../../../shared/utils/predicate';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { PagerSettings, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { Router } from '@angular/router';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { ProjectService } from '../../services/project/project.service';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ProjectType } from '../../../models/enumerators/project-type.enum';
import { FiltrePredicateModel } from '../../../models/shared/filtrePredicate.model';
import { FieldTypeConstant } from '../../../constant/shared/fieldType.constant';
import { TranslateService } from '@ngx-translate/core';
import { isNotNullOrUndefinedAndNotEmptyValue } from '../../../stark-permissions/utils/utils';
import { Observable } from 'rxjs/Observable';
import { PermissionConstant } from '../../../Structure/permission-constant';
import {AuthService} from '../../../login/Authentification/services/auth.service';

@Component({
  selector: 'app-list-project',
  templateUrl: './list-project.component.html',
  styleUrls: ['./list-project.component.scss']
})
export class ListProjectComponent implements OnInit {
  public searchFormGroup: FormGroup;
  public startDate: Date;
  public endDate: Date;
  // pager settings
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public predicate: PredicateFormat[] = [];
  public formatDate = this.translate.instant(SharedConstant.DATE_FORMAT);
  public projectType: number;
  public idTiers: number;
  public projectTypeEnum = ProjectType;
  public gridState: State = {
    skip: 0,
    take: 10,
    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: []
    }
  };
  public filtreFieldsColumns = [];
  value = new Date();
  public valueStartDate: Date = new Date(this.value.getFullYear(), NumberConstant.ZERO, NumberConstant.SHIFT_FIRST_DATE);
  public valueEndDate: Date = new Date(this.value.getFullYear(), NumberConstant.TWELVE, NumberConstant.ZERO);

   /**
* advanced search predicate
*/
public predicateAdvancedSearch: PredicateFormat;

  public columnsConfig: ColumnSettings[] = [
    {
      field: ProjectConstant.NAME,
      title: ProjectConstant.NAME_UPPERCASE,
      filterable: true
    },
    {
      field: ProjectConstant.PROJECT_TYPE,
      title: ProjectConstant.CONTRACT_TYPE_UPPERCASE,
      filterable: true
    },
    {
      field: ProjectConstant.TIERS_NAME,
      title: ProjectConstant.ID_TIERS_NAVIGATION_UPPERCASE,
      filterable: false
    },
    {
      field: ProjectConstant.START_DATE,
      title: ProjectConstant.START_DATE_UPPERCASE,
      filterable: true
    },
    {
      field: ProjectConstant.EXPECTED_END_DATE,
      title: ProjectConstant.END_DATE_UPPERCASE,
      filterable: true
    },
    {
      field: ProjectConstant.IS_BILLABLE,
      title: ProjectConstant.IS_BILLABLE_UPPERCASE,
      filterable: true
    }
  ];
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };
  forSearch = true;
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
public haveAddPermission : boolean;
public haveUpdatePermission : boolean;
public haveDeletePermission : boolean;
public haveShowPermission : boolean;
  constructor(public translate: TranslateService,
    private fb: FormBuilder, public projectService: ProjectService, private router: Router, private swalWarrings: SwalWarring,
    private authService: AuthService) { }

  ngOnInit() {
    this.haveAddPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.ADD_SERVICES_CONTRACT);
    this.haveUpdatePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_SERVICES_CONTRACT);
    this.haveDeletePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.DELETE_SERVICES_CONTRACT);
    this.haveShowPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.SHOW_SERVICES_CONTRACT);
    this.initProjectFiltreConfig();
    this.initAdvancedSearchPredicate();
    this.createSearchForm();
    this.initGridDataSource(false);
  }

  private createSearchForm(): void {
    this.searchFormGroup = this.fb.group({
      IdTiers: [],
      StartDate: [],
      EndDate: [],
      ProjectType: []
    });
  }

  initGridDataSource(isQuickSearch?: boolean) {
    this.setPredicateFiltre(isQuickSearch);
    this.projectService.getFiltredProjectList(this.gridSettings.state, this.predicate[NumberConstant.ZERO], this.startDate, this.endDate)
      .subscribe(data => {
        this.gridSettings.gridData = data;
      });
  }

  /**
   * Data changed listener
   * @param state
   */
  public dataStateChange(state: DataStateChangeEvent): void {
    if (!state.sort[NumberConstant.ZERO] || (state.sort[NumberConstant.ZERO] && !state.sort[NumberConstant.ZERO].dir)) {
      state.sort = [];
      this.predicate[NumberConstant.ZERO].OrderBy = null;
    }
    this.gridSettings.state = state;
    this.initGridDataSource();
  }

  preparePredicate(): PredicateFormat  {
    this.predicate[NumberConstant.ZERO] = new PredicateFormat();
    this.predicate[NumberConstant.ZERO].Filter = new Array<Filter>();
    this.predicate[NumberConstant.ZERO].Relation = new Array<Relation>();
    this.predicate[NumberConstant.ZERO].Relation.push(new Relation(ProjectConstant.ID_TIERS_NAVIGATION));
    this.predicate[NumberConstant.ZERO].OrderBy = new Array<OrderBy>();
    this.predicate[NumberConstant.ZERO].OrderBy.push.apply(this.predicate[NumberConstant.ZERO].OrderBy,
      [new OrderBy(SharedConstant.CREATION_DATE, OrderByDirection.desc)]);
      return this.predicate[NumberConstant.ZERO];
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
      this.predicateAdvancedSearch.Relation = new Array<Relation>();
      this.predicateAdvancedSearch.Relation.push(new Relation(ProjectConstant.ID_TIERS_NAVIGATION));
      this.predicateAdvancedSearch.Operator = Operator.and;
      this.state.filter.logic = SharedConstant.LOGIC_AND;
      this.gridSettings.state.filter.logic = SharedConstant.LOGIC_AND;
      this.predicate.push(this.predicateAdvancedSearch);
    }
  }


  goToAdvancedEdit(id: number) {
    this.router.navigateByUrl(ProjectConstant.PROJECT_EDIT_URL.concat(String(id)), { skipLocationChange: true });
  }

  /**
   * Remove an item of Cnss type
   * @param param
   */
  public removeHandler(dataItem) {
    this.swalWarrings.CreateSwal(ProjectConstant.DELETE_CONTRACT).then((result) => {
      if (result.value) {
        this.projectService.remove(dataItem).subscribe(() => {
          this.initGridDataSource(false);
        });
      }
    });
  }

  // Check if start date is greater than end date
  public changeStartDate() {
    if (this.StartDate.value && this.EndDate.value && this.StartDate.value > this.EndDate.value) {
      this.EndDate.setValue(this.StartDate.value);
      this.endDate =  this.EndDate.value;
    }
    this.startDate = this.StartDate.value;
    this.initGridDataSource();
  }

  // Check if end date is less than start date
  public changeEndDate() {
    if (this.StartDate.value && this.EndDate.value && this.EndDate.value < this.StartDate.value) {
      this.StartDate.setValue(this.EndDate.value);
      this.startDate = this.StartDate.value;
    }
    this.endDate = this.EndDate.value;
    this.initGridDataSource();
  }

  get StartDate(): FormControl {
    return this.searchFormGroup.get(ProjectConstant.START_DATE) as FormControl;
  }
  get EndDate(): FormControl {
    return this.searchFormGroup.get(ProjectConstant.END_DATE) as FormControl;
  }
  get ProjectType(): FormControl {
    return this.searchFormGroup.get(ProjectConstant.PROJECT_TYPE) as FormControl;
  }
  get IdTiers(): FormControl {
    return this.searchFormGroup.get(ProjectConstant.ID_TIERS) as FormControl;
  }
  clickSearch() {
    this.initGridDataSource();
  }

  ClientSelected() {
    this.idTiers = this.IdTiers.value;
    this.initGridDataSource();
  }

  TypeSelected(event) {
    this.projectType = event;
    this.prepareAndSendPredicate();
  }

  prepareAndSendPredicate() {
    this.initGridDataSource();
  }
   /**
 * get array<Filtre> from advancedSearchComponenet
 * remove old filter property from the predicate filter list
 * case filtre type date between
 * @param filtre
 */
getFiltrePredicate(filtre) {
  this.prepareFiltreFromAdvancedSearch(filtre);
}
  private initProjectFiltreConfig() {
    this.filtreFieldsColumns.push(new FiltrePredicateModel(this.translate.instant(ProjectConstant.DATE_UPPERCASE), FieldTypeConstant.DATE_TYPE, SharedConstant.DATE));
    this.filtreFieldsColumns.push(new FiltrePredicateModel(this.translate.instant(ProjectConstant.CONTRACT_TYPE_UPPERCASE), FieldTypeConstant.PROJECT_DROPDOWN_COMPONENT, 'ProjectType'));
    this.filtreFieldsColumns.push(new FiltrePredicateModel(this.translate.instant(ProjectConstant.CLIENT_TITLE), FieldTypeConstant.customerComponent, 'IdTiers'));
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
 /**
 * identify the predicate operator AND|OR
 * @param operator
 */
  getOperatorPredicate(operator: Operator) {
    this.predicateAdvancedSearch.Operator = operator;
  }
  initAdvancedSearchPredicate() {
    this.predicateAdvancedSearch = new PredicateFormat();
    this.predicateAdvancedSearch.Filter = new Array<Filter>();
    this.predicateAdvancedSearch.Filter.push(new Filter(SharedConstant.MONTH, Operation.gte, this.valueStartDate));
    this.predicateAdvancedSearch.Filter.push(new Filter(SharedConstant.MONTH, Operation.lte, this.valueEndDate));
  }
  ngAfterViewInit(): void {
    this.projectService.defaultStartEndDateSearchSession = new Observable((observer) => {
      // observable execution
      observer.next([new Date(this.valueStartDate), this.valueEndDate])
      observer.complete()
    })
  }
  /**
   * Reset dataGrid
   */
   resetClickEvent() {
    this.predicateAdvancedSearch = this.preparePredicate();
    this.initGridDataSource(false);
  }

}
