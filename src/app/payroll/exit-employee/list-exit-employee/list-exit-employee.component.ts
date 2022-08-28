import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PagerSettings } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { Subscription } from 'rxjs/Subscription';
import { EmployeeConstant } from '../../../constant/payroll/employee.constant';
import { ExitEmployeeConstant } from '../../../constant/payroll/exit-employee.constant';
import { FieldTypeConstant } from '../../../constant/shared/fieldType.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { TypeConstant } from '../../../constant/utility/Type.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { ExitEmployeeStatusEnum } from '../../../models/enumerators/exit-employee-status-enum';
import { FiltrePredicateModel } from '../../../models/shared/filtrePredicate.model';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { Filter, Operation, Operator, PredicateFormat, Relation } from '../../../shared/utils/predicate';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { ExitEmployeeService } from '../../services/exit-employee/exit-employee.service';

@Component({
  selector: 'app-list-exit-employee',
  templateUrl: './list-exit-employee.component.html',
  styleUrls: ['./list-exit-employee.component.scss']
})
export class ListExitEmployeeComponent implements OnInit, OnDestroy {
  /**
   * Page setting
   */
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  /**
   * Predicate
   */
  public predicate: PredicateFormat;
  // Enum  wainting , Accepted , Refused, canceled
  public statusCode = ExitEmployeeStatusEnum;
  /**FormatDate */
  formatDate = this.translateService.instant(SharedConstant.DATE_FORMAT);

  public gridState: State = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.TWENTY,
    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: []
    }
  };
  /***
   * Grid ExitEmployee columns
   */
  public columnsConfig: ColumnSettings[] = [
    {
      field: ExitEmployeeConstant.FULL_NAME_FROM_EMPLOYEE_NAVIGATION,
      title: EmployeeConstant.EMPLOYEE_UPPERCASE,
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: ExitEmployeeConstant.EXIT_DEPOSIT_DATE,
      title: ExitEmployeeConstant.EXIT_DEPOSIT_DATE_TITLE,
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: ExitEmployeeConstant.NAME_FROM_EXITREASON_NAVIGATION,
      title: ExitEmployeeConstant.EXIT_REASON_TITLE,
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: ExitEmployeeConstant.RELEASE_DATE,
      title: ExitEmployeeConstant.RELEASE_DATE_TITLE,
      filterable: true,
      filter: 'date',
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: ExitEmployeeConstant.PHYSICAL_EXIT_DATE,
      title: ExitEmployeeConstant.PHYSICAL_EXIT_DATE_TITLE,
      filterable: true,
      filter: 'date',
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: ExitEmployeeConstant.STATUS,
      title: ExitEmployeeConstant.STATE_TITLE,
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: ExitEmployeeConstant.CREATION_DATE,
      title: ExitEmployeeConstant.CREATION_DATE_TITLE,
      filterable: true,
      filter: 'date',
      _width: NumberConstant.TWO_HUNDRED
    }
  ];
  /**
   * Grid  ExitEmployee settings
   */
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };


  // Permission attributes
  public hasAddPermission: boolean;
  public hasUpdatePermission: boolean;
  public hasDeletePermission: boolean;
  public hasShowPermission: boolean;

  private subscriptions: Subscription[] = [];
  public filtreFieldsColumns = [];
  public filtreFieldsInputs = [];

  constructor(public exitEmployeeService: ExitEmployeeService,
              private router: Router,
              private swalWarrings: SwalWarring,
              private fb: FormBuilder,
              private translateService: TranslateService,
              public authService: AuthService) {
  }

  ngOnInit() {
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.ADD_EXITEMPLOYEE);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.UPDATE_EXITEMPLOYEE);
    this.hasDeletePermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.DELETE_EXITEMPLOYEE);
    this.hasShowPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.SHOW_EXITEMPLOYEE);
    this.preparePredicate();
    this.initExitEmployeeFiltreConfig();
    this.initGridDataSource();
  }

  initGridDataSource() {
    this.subscriptions.push(this.exitEmployeeService.reloadServerSideData(this.gridSettings.state, this.predicate)
      .subscribe(data => {
          this.gridSettings.gridData = data;
        }
      ));
  }

  dataStateChange(state: State) {
    this.gridSettings.state = state;
    this.initGridDataSource();
  }

  public goToAdvancedEdit(id) {
    this.router.navigateByUrl(ExitEmployeeConstant.URL_CONTRACT_EDIT.concat(id), {skipLocationChange: true});
  }

  /**
   *
   * @param param0
   */
  public removeHandler(dataItem) {
    this.swalWarrings.CreateSwal().then((result) => {
      if (result.value) {
        this.subscriptions.push(this.exitEmployeeService.remove(dataItem).subscribe(() => {
          this.initGridDataSource();
        }));
      }
    });
  }

  /* filter implementation */

  ngOnDestroy(): void {
    if (this.subscriptions !== undefined) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
  }

  /**
   * prepare predicate
   */
  private preparePredicate() {
    this.predicate = new PredicateFormat();
    this.predicate.Relation = new Array<Relation>();
    this.predicate.Filter = new Array<Filter>();
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(ExitEmployeeConstant.ID_EMPLOYEE_NAVIGATION)]);
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(ExitEmployeeConstant.ID_EXIT_REASON_NAVIGATION)]);
  }

  private initExitEmployeeFiltreConfig() {
    this.filtreFieldsColumns.push(new FiltrePredicateModel(SharedConstant.EMPLOYEE_FULL_NAME_TITLE,
      FieldTypeConstant.EMPLOYEE_DROPDOWN_TYPE, SharedConstant.ID_EMPLOYEE));
    this.filtreFieldsColumns.push(new FiltrePredicateModel(ExitEmployeeConstant.RELEASE_DATE_TITLE,
      FieldTypeConstant.DATE_TYPE, ExitEmployeeConstant.RELEASE_DATE));
    this.filtreFieldsColumns.push(new FiltrePredicateModel(ExitEmployeeConstant.EXIT_REASON_TITLE,
      FieldTypeConstant.EXIT_REASON_DROPDOWN_COMPONENT, ExitEmployeeConstant.ID_exit_REASON));
    this.filtreFieldsInputs.push(new FiltrePredicateModel(ExitEmployeeConstant.EXIT_DEPOSIT_DATE_TITLE, FieldTypeConstant.DATE_TYPE,
      ExitEmployeeConstant.EXIT_DEPOSIT_DATE));
    this.filtreFieldsInputs.push(new FiltrePredicateModel(ExitEmployeeConstant.PHYSICAL_EXIT_DATE_TITLE, FieldTypeConstant.DATE_TYPE,
      ExitEmployeeConstant.PHYSICAL_EXIT_DATE));
    this.filtreFieldsInputs.push(new FiltrePredicateModel(SharedConstant.STATE_UPPERCASE, FieldTypeConstant.EXIT_EMPLOYEE_STATUS_COMPONENT,
      SharedConstant.STATUS));
  }

  getFiltrePredicate(filtre) {
    this.gridSettings.state.skip = NumberConstant.ZERO;
    if (!this.predicate.Filter || (this.predicate.Filter && this.predicate.Filter.length === NumberConstant.ZERO)) {
      this.predicate.Filter = new Array<Filter>();
    }
    this.prepareFiltreFromAdvancedSearch(filtre);
  }

  private prepareFiltreFromAdvancedSearch(filtre) {
    this.predicate.Filter = this.predicate.Filter.filter(value => value.prop !== filtre.prop);
    if (filtre.isDateFiltreBetween && filtre.filtres) {
      const  firstDate = filtre.filtres[NumberConstant.ZERO].value;
      const  secondDate = filtre.filtres[NumberConstant.ONE].value;
      filtre.filtres[NumberConstant.ZERO].value = new Date(Date.UTC(firstDate.getFullYear(), firstDate.getMonth(), firstDate.getDate()));
      filtre.filtres[NumberConstant.ONE].value = new Date(Date.UTC(secondDate.getFullYear(), secondDate.getMonth(), secondDate.getDate()));
      this.predicate.Filter.push(filtre.filtres[NumberConstant.ZERO]);
      this.predicate.Filter.push(filtre.filtres[NumberConstant.ONE]);
    }
    if (filtre.operation && filtre.value && !filtre.SpecificFiltre) {
      if (filtre.type === TypeConstant.date) {
        filtre.value = new Date (filtre.value.getFullYear(), filtre.value.getMonth(), filtre.value.getDate());
      }
      this.predicate.Filter.push(filtre);
    } else if (filtre.prop == ExitEmployeeConstant.STATUS && filtre.value == NumberConstant.ZERO){
      this.predicate.Filter.push(filtre);
    } 
  }
  /**
   * identify the predicate operator AND|OR
   * @param operator
   */
   getOperatorPredicate(operator: Operator) {
    this.predicate.Operator = operator;
  }

  /**
   * Reset dataGrid
   */
   resetClickEvent() {
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.preparePredicate();
    this.initGridDataSource();
  }
}
