import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { State } from '@progress/kendo-data-query';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { Router } from '@angular/router';
import { ExpenseReportService } from '../../services/expense-report/expense-report.service';
import { PagerSettings, SelectAllCheckboxState } from '@progress/kendo-angular-grid';
import { PredicateFormat, Relation, Operation, Filter, OrderBy, OrderByDirection, Operator } from '../../../shared/utils/predicate';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { ExpenseReportConstant } from '../../../constant/payroll/expense-resport.constant';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { EmployeeService } from '../../services/employee/employee.service';
import { TranslateService } from '@ngx-translate/core';
import { AdministrativeDocumentStatusEnumerator } from '../../../models/enumerators/administrative-document-status.enum';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { User } from '../../../models/administration/user.model';
import { FormGroup, FormControl } from '@angular/forms';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { FileService } from '../../../shared/services/file/file-service.service';
import { Subscription } from 'rxjs/Subscription';
import { LocalStorageService } from '../../../login/Authentification/services/local-storage-service';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { Employee } from '../../../models/payroll/employee.model';
import { TypeConstant } from '../../../constant/utility/Type.constant';
import { AdministrativeDocumentConstant } from '../../../constant/payroll/administrative-document-constant';
import { FiltrePredicateModel } from '../../../models/shared/filtrePredicate.model';
import { FieldTypeConstant } from '../../../constant/shared/fieldType.constant';
const ALL_EXPENSE_REPORTS = 'ALL_EXPENSE_REPORTS';

@Component({
  selector: 'app-expense-report-request-list',
  templateUrl: './expense-report-request-list.component.html',
  styleUrls: ['./expense-report-request-list.component.scss']
})
export class ExpenseReportRequestListComponent implements OnInit, OnDestroy {
  // Id of the connected User
  connectedEmployee = 0;

  // entete Filter
  headerFilter: Filter[];

  // Enum  wainting , Accepted , Refused
  public statusCode = AdministrativeDocumentStatusEnumerator;

  // choosenFilter name proprety => zero = get all requests
  public noFilter = NumberConstant.ZERO;
  choosenFilterNumber = this.noFilter;
  choosenFilter = this.translate.instant(ALL_EXPENSE_REPORTS);

  // pager settings
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public listOfAction = ExpenseReportConstant.EXPENSE_REPORT_ACTION;
  public ButtonAction;
  // predicate Related To the grid
  public predicate: PredicateFormat;

  // connected User
  public connectedUser: User;

  // Get status from column filter
  statusSearchDropdownFormGroup: FormGroup;

  @Input() searchPredicate: PredicateFormat;

  // Get user currency
  userCurrencySymbol: any;

  dateFormat = this.translate.instant(SharedConstant.DATE_FORMAT);
  employeeSearchDropdownFormGroup: FormGroup;

  // month from filter
  month: Date;
  public expenseIdsSelected: number[] = [];
  public showErrorMessage = false;
  public selectAllState: SelectAllCheckboxState = SharedConstant.UNCHECKED as SelectAllCheckboxState;
  public AllExpensesIds: number[] = [];
  public hasUpdateExpenseReportPermission = false;
  public columnsConfig: ColumnSettings[] = [
    {
      field: ExpenseReportConstant.EMPLOYEE_NAME_FROM_ID_EMPLOYEE_NAVIGATION,
      title: ExpenseReportConstant.EMPLOYEE,
      _width: NumberConstant.TWO_HUNDRED,
      filterable: true
    },
    {
      field: ExpenseReportConstant.SUBMISSION_DATE,
      title: ExpenseReportConstant.SUBMISSION_DATE_UPPERCASE,
      _width: NumberConstant.TWO_HUNDRED,
      format: this.translate.instant(SharedConstant.DATE_FORMAT),
      filterable: true
    },
    {
      field: ExpenseReportConstant.TOTAL_AMOUNT,
      title: ExpenseReportConstant.TOTAL_EXPENSE,
      _width: NumberConstant.TWO_HUNDRED,
      filterable: true
    },
    {
      field: ExpenseReportConstant.TREATMENT_DATE,
      title: ExpenseReportConstant.TREATMENT_DATE_UPPERCASE,
      format: this.translate.instant(SharedConstant.DATE_FORMAT),
      _width: NumberConstant.TWO_HUNDRED,
      filterable: true
    },
    {
      field: ExpenseReportConstant.TREATED_BY,
      title: ExpenseReportConstant.TREATED_BY_UPPERCASE,
      _width: NumberConstant.TWO_HUNDRED,
      filterable: true
    },
    {
      field: ExpenseReportConstant.STATUS,
      title: ExpenseReportConstant.STATUS_UPPERCASE,
      _width: NumberConstant.TWO_HUNDRED,
      filterable: true
    }
  ];
  public gridSettings: GridSettings = {
    state: this.initializeState(),
    columnsConfig: this.columnsConfig,
  };
  public hasDeletePermission: boolean;
  public hasUpdatePermission: boolean;
  public hasAddPermission: boolean;
  public hasShowPermission: boolean;
  private subscriptions: Subscription[] = [];

  public filtreFieldsColumns = [];
  public filtreFieldsInputs = [];

  constructor(private router: Router, private swalWarrings: SwalWarring,
    public expenseReportService: ExpenseReportService,
    public employeeService: EmployeeService,
    private translate: TranslateService,
    private growlService: GrowlService, private fileServiceService: FileService,
    private authService: AuthService, private localStorageService: LocalStorageService) {
  }

  get Status(): FormControl {
    return this.statusSearchDropdownFormGroup.get(ExpenseReportConstant.STATUS) as FormControl;
  }

  get EmployeeId(): FormControl {
    return this.employeeSearchDropdownFormGroup.get(ExpenseReportConstant.ID_EMPLOYEE) as FormControl;
  }

  public initializeState(): State {
    return {
      skip: NumberConstant.ZERO,
      take: NumberConstant.TEN,
      // Initial filter descriptor
      filter: {
        logic: 'and',
        filters: []
      }
    };
  }

  ngOnInit(): void {
    this.hasDeletePermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.DELETE_EXPENSEREPORT);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.UPDATE_EXPENSEREPORT);
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.ADD_EXPENSEREPORT);
    this.hasShowPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.SHOW_EXPENSEREPORT);
    this.userCurrencySymbol = this.localStorageService.getCurrencySymbol();
    this.initExpenseReportFiltreConfig();
    this.subscriptions.push(this.employeeService.getConnectedEmployee().subscribe(
      (res: Employee) => {
        this.connectedEmployee = res.Id;
        this.preparePredicate();
        this.initGridDataSource();
      }));
  }

  /**
   * Navigate to the next page
   * @param dataItem
   */
  public goToAdvancedEdit(dataItem) {
    this.router.navigateByUrl(ExpenseReportConstant.EXPENSE_REPORT_EDIT_URL.concat(dataItem.Id));
  }

  /**
   * Initialize Data
   */
  public initGridDataSource(predicate?: PredicateFormat) {
    this.subscriptions.push(
      this.expenseReportService.getExpenseReportsRequestsWithHierarchy(this.gridSettings.state,
        this.predicate, false, this.month).subscribe(data => {
        this.gridSettings.gridData = data;
        if (this.hasUpdateExpenseReportPermission) {
          this.AllExpensesIds = data.data.map(element => element.Id);
        }
      })
    );
  }

  public onSelectedKeysChange(e) {
    const selectionLength = this.expenseIdsSelected.length;
    selectionLength === NumberConstant.ZERO ? this.showErrorMessage = true : this.showErrorMessage = false;
    if (selectionLength === NumberConstant.ZERO) {
      this.selectAllState = SharedConstant.UNCHECKED as SelectAllCheckboxState;
    } else if (selectionLength > NumberConstant.ZERO && selectionLength < this.AllExpensesIds.length) {
      this.selectAllState = SharedConstant.INDETERMINATE as SelectAllCheckboxState;
    } else {
      this.selectAllState = SharedConstant.CHECKED as SelectAllCheckboxState;
    }
  }

  public openValidateexpensesdetails(): void {
    this.router.navigate([ExpenseReportConstant.VAIDATE_EXPENSE_USER_URL_LIST], {
      queryParams: {listId: this.expenseIdsSelected},
      skipLocationChange: true
    });
  }

  /**
   * Prepare Predicate
   */
  public preparePredicate(): void {
    this.predicate = new PredicateFormat();
    this.predicate.Relation = new Array<Relation>();
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(ExpenseReportConstant.ID_EMPLOYEE_NAVIGATION),
      new Relation(ExpenseReportConstant.TREATED_BY_NAVIGATION)]);
    this.predicate.OrderBy = new Array<OrderBy>();
    this.predicate.OrderBy.push(new OrderBy(ExpenseReportConstant.ID, OrderByDirection.desc));
  }


  /**
   * Remove line
   * @param param0
   */
  public removeHandler(dataItem) {
    this.swalWarrings.CreateSwal().then((result) => {
      if (result.value) {
        this.subscriptions.push(this.expenseReportService.remove(dataItem).subscribe(() => {
          this.initGridDataSource();
        }));
      }
    });
  }

  /**
   * Data changed listener
   * @param state
   */
  public dataStateChange(state: State): void {
    this.gridSettings.state = state;
    this.subscriptions.push(this.expenseReportService.getExpenseReportsRequestsWithHierarchy(this.gridSettings.state, this.predicate,
      false, this.month).subscribe(data => {
      this.gridSettings.gridData = data;
    }));
  }


  public deleteMassiveexpenses() {
    this.swalWarrings.CreateSwal(ExpenseReportConstant.DELETE_EXPENSE_REPORT_ALERT, undefined, SharedConstant.YES, SharedConstant.NO)
      .then((result) => {
        if (result.value) {
          this.subscriptions.push(this.expenseReportService.deleteMassiveexpenseReport(this.expenseIdsSelected).subscribe(() => {
            this.initGridDataSource();
          }));
        }
      });
  }

  public refuseMassiveexpenses() {
    this.swalWarrings.CreateSwal(ExpenseReportConstant.REFUS_EXPENSE_REPORT_ALERT, undefined, SharedConstant.YES, SharedConstant.NO)
      .then((result) => {
        if (result.value) {
          this.subscriptions.push(this.expenseReportService.refuseMassiveexpenseReport(this.expenseIdsSelected).subscribe(() => {
            this.initGridDataSource();
          }));
        }
      });
  }

  public selectedFunction() {
    switch (this.ButtonAction) {
      case this.translate.instant(SharedConstant.VALIDATE): {
        this.openValidateexpensesdetails();
        break;
      }
      case this.translate.instant(SharedConstant.DELETE): {
        this.deleteMassiveexpenses();
        break;
      }
      case this.translate.instant(SharedConstant.REFUSE): {
        this.refuseMassiveexpenses();
        break;
      }
    }
  }

  selectedAction(action: string) {
    this.ButtonAction = action;
    if (this.expenseIdsSelected.length > NumberConstant.ZERO) {
      this.selectedFunction();
    } else {
      this.growlService.warningNotification(this.translate.instant(SharedConstant.SELECTED_WARNING_MSG));
    }
  }

  DownloadExpenseReportDocumentsWar(idExpenseReport: number) {
    this.subscriptions.push(this.expenseReportService.DownloadExpenseReportDocumentsWar(idExpenseReport).subscribe(data => {
      this.fileServiceService.downLoadFile(data.objectData);
    }));
  }

  translateToday() {
    const todayElement = document.getElementsByClassName(SharedConstant.TODAY_CLASS)[NumberConstant.ZERO];
    if (todayElement) {
      todayElement.innerHTML = this.translate.instant(SharedConstant.TODAY);
    }
  }

  ngOnDestroy(): void {
    if (this.subscriptions !== undefined) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
  }

  private initExpenseReportFiltreConfig() {
    this.filtreFieldsColumns.push(new FiltrePredicateModel(SharedConstant.MONTH_UPPERCASE,
      FieldTypeConstant.MONTH, SharedConstant.MONTH));
    this.filtreFieldsColumns.push(new FiltrePredicateModel(SharedConstant.TEAM_TITLE,
      FieldTypeConstant.TEAM_MULTISELECT_COMPONENT, SharedConstant.TEAM_FIELD));
    this.filtreFieldsColumns.push(new FiltrePredicateModel(SharedConstant.EMPLOYEE_FULL_NAME_TITLE,
      FieldTypeConstant.EMPLOYEE_MULTISELECT_COMPONENT, SharedConstant.EMPLOYEE));
  }

  getFiltrePredicate(filtre) {
    this.gridSettings.state.skip = NumberConstant.ZERO;
    if (!this.predicate.Filter || (this.predicate.Filter && this.predicate.Filter.length === NumberConstant.ZERO)) {
      this.predicate.Filter = new Array<Filter>();
    }
    this.prepareFiltreFromAdvancedSearch(filtre);
  }

  private prepareFiltreFromAdvancedSearch(filtre) {
    if (filtre.prop === SharedConstant.MONTH) {
      this.month = filtre.value;
    }
    if (filtre.prop === SharedConstant.TEAM_FIELD) {
      this.predicate.Filter = this.predicate.Filter.filter(value => value.prop !== AdministrativeDocumentConstant.ID_TEAM);
      const selectedTeams = filtre.value;
      if (selectedTeams && selectedTeams.length > NumberConstant.ZERO) {
        selectedTeams.forEach(Id => {
          this.predicate.Filter.push(new Filter(AdministrativeDocumentConstant.ID_TEAM, Operation.eq, Id, false, true));
        });
      }
    } else if (filtre.prop === SharedConstant.EMPLOYEE) {
      this.predicate.Filter = this.predicate.Filter.filter(value => value.prop !== AdministrativeDocumentConstant.EMPLOYEE_ID);
      const employees  = filtre.value;
      if (employees && employees.length >  NumberConstant.ZERO) {
        employees.forEach(id => {
          this.predicate.Filter.push(new Filter(AdministrativeDocumentConstant.EMPLOYEE_ID, Operation.eq, id, false, true));
        });
      }
    } else {
      if (filtre.type === TypeConstant.date) {
        this.predicate.Filter = this.predicate.Filter.filter(value => value.prop === filtre.prop && value.operation !== filtre.operation);
      } else {
        this.predicate.Filter = this.predicate.Filter.filter(value => value.prop !== filtre.prop);
      }
      if (filtre.operation && filtre.value && !filtre.SpecificFiltre) {
        this.predicate.Filter.push(filtre);
      }
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
    this.month = undefined;
    this.preparePredicate();
    this.initGridDataSource();
  }
}
