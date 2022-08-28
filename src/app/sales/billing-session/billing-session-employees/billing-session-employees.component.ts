import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { BillingSession } from '../../../models/sales/billing-session.model';
import { State, DataSourceRequestState } from '@progress/kendo-data-query';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { EmployeeConstant } from '../../../constant/payroll/employee.constant';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { Employee } from '../../../models/payroll/employee.model';
import { PagerSettings, SelectAllCheckboxState } from '@progress/kendo-angular-grid';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { process } from '@progress/kendo-data-query';
import { Router, ActivatedRoute } from '@angular/router';
import { BillingSessionConstant } from '../../../constant/sales/billing-session.constant';
import { EmployeeProjectService } from '../../services/employee-project/employee-project.service';
import { SessionConstant } from '../../../constant/payroll/session.constant';
import { PredicateFormat, Filter, Operation } from '../../../shared/utils/predicate';
import { ProjectConstant } from '../../../constant/rh/project.constant';
import { BillingSessionService } from '../../services/billing-session/billing-session.service';
import { BillingSessionState } from '../../../models/enumerators/BillingSessionState.enum';
import { ValidationService } from '../../../shared/services/validation/validation.service';
import { BillingEmployee } from '../../../models/sales/billing-employee.model';
import { isUndefined } from 'util';
import { TimeSheetService } from '../../../rh/services/timesheet/timesheet.service';
import { TimeSheetStatusEnumerator } from '../../../models/enumerators/timeSheet-status-enumerator.enum';
import { TimeSheetConstant } from '../../../constant/rh/timesheet.constant';
import { EmployeeService } from '../../../payroll/services/employee/employee.service';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { TranslateService } from '@ngx-translate/core';
import { TimesheetValidationService } from '../../../rh/services/timesheet-validation/timesheet-validation.service';
import { RoleConfigConstant } from '../../../Structure/_roleConfigConstant';
import { documentStatusCode } from '../../../models/enumerators/document.enum';
import { UserCurrentInformationsService } from '../../../shared/services/utility/user-current-informations.service';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';

@Component({
  selector: 'app-billing-session-employees',
  templateUrl: './billing-session-employees.component.html',
  styleUrls: ['./billing-session-employees.component.scss']
})
export class BillingSessionEmployeesComponent implements OnInit {
  billingSession: BillingSession;
  billingSessionPerMonth = new BillingSession();
  public idBillingSession: number;
  // session Form Group
  sessionFormGroup: FormGroup;
  month: Date;
  public max: Date;
  predicate: PredicateFormat;
  selectedProject: number;
  selectedTiers: number;
  // If there is not selected lines in the grid => showError = true
  public showErrorMessage = false;
  public statusCode = TimeSheetStatusEnumerator;
  hasRightToValidate = false;
  public RoleConfigConstant: RoleConfigConstant;
  // Enum of document status
  public statusCodeDocument = documentStatusCode;
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;

  /**
   * Connected employee hierarchy
   */
  employeeHierarchy: number[] = [];
  // For validate session number unicity
  public showSessionUniqueErrorMessage = false;
  public gridState = this.initializeState();
  public columnsConfig: ColumnSettings[] = [
    {
      field: EmployeeConstant.REGISTRATION_NUMBER,
      title: EmployeeConstant.REGISTRATION_NUMBER_UPPERCASE,
      filterable: true
    },
    {
      field: EmployeeConstant.FIRST_NAME,
      title: EmployeeConstant.FIRST_NAME_UPPERCASE,
      filterable: true
    },
    {
      field: EmployeeConstant.LAST_NAME,
      title: EmployeeConstant.LAST_NAME_UPPERCASE,
      filterable: true
    },
    {
      field: EmployeeConstant.CRA_STATUS,
      title: EmployeeConstant.CRA_STATUS_UPPERCASE,
      filterable: false
    }
  ];
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };

  // The whole employee send by server side
  public AllEmployeesList: Employee[] = [];
  public AllBillingEmployeesList: BillingEmployee[] = [];
  public AllEmployeesIds: number[] = [];
  public selectAllState: SelectAllCheckboxState = SharedConstant.UNCHECKED as SelectAllCheckboxState;

  // The list of selected employee in the grid
  public employeesIdsSelectedInGrid: number[] = [];
  public isClosed = false;
  isEnabled: boolean;
  states = BillingSessionState;
  public hasShorOrUpdateEmployeePermission: boolean;
  public initializeState(): DataSourceRequestState {
    return {
      skip: 0,
      take: 10,
      filter: { // Initial filter descriptor
        logic: 'and',
        filters: []
      }
    };
  }
  constructor(private fb: FormBuilder, private router: Router,
    private employeeProjectService: EmployeeProjectService, private activatedRoute: ActivatedRoute,
    private billingSessionService: BillingSessionService, private validationService: ValidationService,
    public timeSheetService: TimeSheetService,
    private employeeService: EmployeeService,
    private growlService: GrowlService,
    private translate: TranslateService,
    private timesheetValidationService: TimesheetValidationService,
    private userCurrentInformationsService: UserCurrentInformationsService, private authService: AuthService) {
      // check if update case
      this.activatedRoute.params.subscribe(params => {
        this.idBillingSession = params[SharedConstant.ID_LOWERCASE] || NumberConstant.ZERO;
        this.isEnabled = params[SharedConstant.IS_ENABLED] === SharedConstant.TRUE;
      });
    }

  ngOnInit() {
    this.hasShorOrUpdateEmployeePermission = this.authService.hasAuthorities([
      PermissionConstant.RHAndPaiePermissions.SHOW_EMPLOYEE, PermissionConstant.RHAndPaiePermissions.UPDATE_EMPLOYEE]);
    this.billingSession = new BillingSession();
    // Iniatalise Month with the current month
    const date = new Date();
    // Intialise Month limit
    const month = date.getMonth();
    const year = date.getFullYear();
    this.max = new Date(year, month , NumberConstant.ONE);
    // Create Form
    this.createAddSessionForm();
    this.Month.setValue(this.max);
    this.month = this.max;
    // Prepare data
    if (this.idBillingSession) {
      // retrieve Employees from server: Prepare data Grid
      this.getBillingSession(this.idBillingSession);
    } else {
      this.isEnabled = true;
      // Initialise FirstDate and EndDate
      this.getAllEmployeesFromServer();
    }
    this.employeeService.getEmployeesHierarchicalList(true, false).subscribe(data => {
      this.employeeHierarchy = data.map(x => x.Id);
      this.userCurrentInformationsService.getConnectedEmployeeId().subscribe(idEmployee => {
        this.isInEmployeesHierarchy(idEmployee);
        this.checkIfConnectedUserHasRightToValidate();
      });
    });
  }
  /**
   *  prepare the form to create a new session
   */
  private createAddSessionForm(): void {
    this.sessionFormGroup = this.fb.group({
      Code: new FormControl(''),
      Title: new FormControl('', [Validators.required]),
      Month: new FormControl('', [Validators.required]),
      IdProject: [],
      IdTiers: []
    });
  }

  // Intialise the start and the end dates after changing the month
  onClickInitialiseDate() {
    if ((this.sessionFormGroup.value.Month != null)) {
      this.employeesIdsSelectedInGrid = [];
      if (this.billingSession.Month !== new Date(this.Month.value)) {
        this.selectAllState = SharedConstant.UNCHECKED as SelectAllCheckboxState;
      }
      this.billingSession.Month = new Date(this.Month.value);
      this.month = this.Month.value;
      this.selectedProject = NumberConstant.ZERO;
      this.selectedTiers = NumberConstant.ZERO;
      this.Idproject.patchValue(NumberConstant.ZERO);
      this.Idtiers.patchValue(NumberConstant.ZERO);
      this.getAllEmployeesFromServer();
    }
  }
  /**
   *  this method is called when the page number change or when the filter change
   */
  public dataStateChange(state: State): void {
    this.gridSettings.state = state;
    const listEmployees = Object.assign([], this.AllBillingEmployeesList);
    this.gridSettings.gridData = process(listEmployees, state);
  }

  /**
* check the state of the select all checkbox in the kendo grid
*/
  public onSelectedKeysChange(e) {
    this.gridSettings.gridData.data.forEach(element => {
      this.employeesIdsSelectedInGrid.forEach(item => {
        if (element.IdEmployee === item) {
          if (element.IdTimeSheetNavigation.Id === NumberConstant.ZERO ||
              element.IdTimeSheetNavigation.Status !== TimeSheetStatusEnumerator.Validated) {
            this.employeesIdsSelectedInGrid.splice(this.employeesIdsSelectedInGrid.indexOf(item), NumberConstant.ONE);
            if (element.IdTimeSheetNavigation.Status === TimeSheetStatusEnumerator.Sended) {
              this.growlService.warningNotification(this.translate.instant(TimeSheetConstant.CRA_NON_VALID));
            } else {
              this.growlService.warningNotification(this.translate.instant(TimeSheetConstant.CRA_NOT_SUBMITTED));
            }
          }
        }
      });
    });
    const gridLength = this.employeesIdsSelectedInGrid.length;
    if (gridLength === NumberConstant.ZERO) {
      this.selectAllState = SharedConstant.UNCHECKED as SelectAllCheckboxState;
      this.showErrorMessage = true;
    } else if (gridLength > NumberConstant.ZERO && gridLength < this.AllEmployeesIds.length) {
      this.selectAllState = SharedConstant.INDETERMINATE as SelectAllCheckboxState;
      this.showErrorMessage = false;
    } else {
      this.selectAllState = SharedConstant.CHECKED as SelectAllCheckboxState;
      this.showErrorMessage = false;
    }
  }

  /**
   * this method aims to select all elements of the grid or deselect it
   */
  public onSelectAllChange(checkedState: SelectAllCheckboxState) {
    if (checkedState === SharedConstant.CHECKED as SelectAllCheckboxState) {
      this.employeesIdsSelectedInGrid = Object.assign([], this.AllEmployeesIds);
      this.selectAllState = SharedConstant.CHECKED as SelectAllCheckboxState;
    } else {
      this.employeesIdsSelectedInGrid = [];
      this.selectAllState = SharedConstant.UNCHECKED as SelectAllCheckboxState;
    }
  }

  /**
   * Get employees list affected to a projects in the selected month
   */
  getAllEmployeesFromServer() {
    // Intialise the state
    this.gridSettings.state = this.initializeState();
    this.preparePredicate();
    this.AllEmployeesIds = [];
    this.employeeProjectService.getEmployeesAffectedToBillableProject(this.Month.value, this.predicate).subscribe((res) => {
        if (res.data) {
          this.AllBillingEmployeesList = res.data;
          // Retreive the Employees Id for the select all case
          res.data.forEach(element => {
            if (element.IdTimeSheetNavigation && element.IdTimeSheetNavigation.Id !== NumberConstant.ZERO
               && element.IdTimeSheetNavigation.Status === this.statusCode.Validated) {
              this.AllEmployeesIds.push(element.IdEmployee);
            }
          });
          // save the employees list in the grid
          this.gridSettings.gridData = res;
          res.data.forEach(element => {
            this.AllEmployeesList.push(element.IdEmployeeNavigation);
          });
          this.gridSettings.gridData.total = res.data.length;
          this.gridSettings.gridData.data = res.data.slice(this.gridState.skip, this.gridState.take);
          this.selectAllState = this.employeesIdsSelectedInGrid.length > NumberConstant.ZERO &&
          this.employeesIdsSelectedInGrid.length === this.AllEmployeesIds.length ?
            SharedConstant.CHECKED as SelectAllCheckboxState : this.employeesIdsSelectedInGrid.length > NumberConstant.ZERO ?
            SharedConstant.INDETERMINATE as SelectAllCheckboxState : SharedConstant.UNCHECKED as SelectAllCheckboxState;
        }
      });
  }

  // go to the next step
  onAddSessionClick() {
    if (isUndefined(this.billingSession.State) || this.billingSession.State !== BillingSessionState.Closed) {
      if (this.sessionFormGroup.valid && this.employeesIdsSelectedInGrid.length > NumberConstant.ZERO
        && this.showSessionUniqueErrorMessage === false) {
        let session: BillingSession;
        const billingSessionEmployeesList = new Array<BillingEmployee>();
        if (!this.idBillingSession) {
          // Add Case
          session = new BillingSession();
          // change the status of the session object to indicate that it is the first interface of the wizard
          session.State = BillingSessionState.New;
        } else {
          // Update Case
          session = this.billingSession;
        }
        // get all ids of the selected employees and build billingSessionEmployee objects from the retrieved id
        this.employeesIdsSelectedInGrid.forEach(element => {
          const sessionEmployee = new BillingEmployee();
          sessionEmployee.IdEmployee = element;
          sessionEmployee.IdTimeSheet =
            this.AllBillingEmployeesList.filter(x => x.IdEmployee === element)[NumberConstant.ZERO].IdTimeSheetNavigation.Id;
          billingSessionEmployeesList.push(sessionEmployee);
        });
        session.Title = this.Title.value;
        session.Month = this.Month.value;
        session.BillingEmployee = billingSessionEmployeesList;
        this.billingSessionService.save(session, true)
          .subscribe((res) => {
            const CourantSession = Object.assign({}, new BillingSession(), res);
            if (!isUndefined(this.billingSession.State)) {
              CourantSession.Id = this.billingSession.Id;
            }
            this.router.navigateByUrl(BillingSessionConstant.VALIDATE_CRA.concat(CourantSession.Id.toString(),
              SharedConstant.SLASH, String(this.isEnabled)), { skipLocationChange: true });
          });
      } else {
        this.validationService.validateAllFormFields(this.sessionFormGroup);
        if (this.employeesIdsSelectedInGrid.length <= NumberConstant.ZERO) {
          this.showErrorMessage = true;
        } else {
          this.showErrorMessage = false;
        }
      }
    } else {
      this.router.navigateByUrl(BillingSessionConstant.VALIDATE_CRA.concat(this.billingSession.Id.toString(),
        SharedConstant.SLASH, String(this.isEnabled)), { skipLocationChange: true });
    }
  }
  get Code(): FormControl {
    return this.sessionFormGroup.get(SharedConstant.CODE) as FormControl;
  }
  get Title(): FormControl {
    return this.sessionFormGroup.get(SharedConstant.TITLE) as FormControl;
  }
  get Month(): FormControl {
    return this.sessionFormGroup.get(SharedConstant.MONTH) as FormControl;
  }
  get Idproject(): FormControl {
    return this.sessionFormGroup.get(ProjectConstant.ID_PROJECT) as FormControl;
  }
  get Idtiers(): FormControl {
    return this.sessionFormGroup.get(ProjectConstant.ID_TIERS) as FormControl;
  }

  preparePredicate() {
    this.predicate = new PredicateFormat();
    this.predicate.Filter = new Array<Filter>();
    if (this.idBillingSession > NumberConstant.ZERO) {
      this.predicate.Filter.push(new Filter(SessionConstant.ID_BILLING_SESSION, Operation.eq, this.idBillingSession));
    }
    if (this.selectedTiers && (this.selectedTiers > NumberConstant.ZERO)) {
      this.predicate.Filter.push(new Filter(SessionConstant.ID_PROJECT_NAVIGATION_TO_TIERS, Operation.eq, this.selectedTiers));
    }
    if (this.selectedProject && (this.selectedProject > NumberConstant.ZERO)) {
      this.predicate.Filter.push(new Filter(SessionConstant.ID_PROJECT, Operation.eq, this.selectedProject));
    }
  }

  projectValueChange($event) {
    this.selectedProject = $event;
    this.getAllEmployeesFromServer();
  }

  supplierValueChange($event) {
    this.selectedTiers = $event.IdTiers.value;
    this.getAllEmployeesFromServer();
  }
  getBillingSession(id: number) {
    this.employeesIdsSelectedInGrid = [];
    this.billingSessionService.getBillingSessionDetailsById(id)
      .subscribe(
        data => {
          this.billingSession = data;
          this.isClosed = this.billingSession.State === BillingSessionState.Closed;
          // Bind the form with data received
          this.billingSession.Month = new Date(this.billingSession.Month);
          this.sessionFormGroup.patchValue(this.billingSession);
          this.Month.setValue(new Date(this.billingSession.Month.getFullYear(), this.billingSession.Month.getMonth() , NumberConstant.ONE));
          // Prepare Selected List
          this.employeesIdsSelectedInGrid = this.billingSession.BillingEmployee.map(element => element.IdEmployee);
          // Get The list of the employees
          this.getAllEmployeesFromServer();
          if (this.isClosed) {
            this.sessionFormGroup.disable();
          }
        }
      );
  }

  /**
  * Get employee hierrarchy list
  */
  public getEmployeesHierarchicalList() {
    this.employeeService.getEmployeesHierarchicalList().subscribe(data => { this.employeeHierarchy = data.map(x => x.Id); });
  }

  public SendMail(id: number) {
    this.timesheetValidationService.SendMail(id, this.Month.value);
  }

  /**
   * Check if connect user has validation permission
   */
  public checkIfConnectedUserHasRightToValidate() {
    this.timesheetValidationService.checkIfConnectedUserHasRightToValidate().subscribe(x => { this.hasRightToValidate = x; });
  }

  /**
   * Check if employee with id is in connected employee hierrarchy
   * @param id
   */
  public isInEmployeesHierarchy(id: number): boolean {
    return this.timesheetValidationService.isInEmployeesHierarchy(id, this.employeeHierarchy);
  }
  public validateCRA(dataItem) {
    this.timesheetValidationService.validateCRA(dataItem, this.AllEmployeesIds);
  }

  public goNext() {
    if ((!this.isEnabled && (this.billingSession.State === BillingSessionState.Bills ||
          this.billingSession.State === BillingSessionState.Project)) || this.billingSession.State === BillingSessionState.Closed) {
        this.router.navigateByUrl(BillingSessionConstant.VALIDATE_CRA.concat(this.billingSession.Id.toString(),
          SharedConstant.SLASH, String(this.isEnabled)), { skipLocationChange: true });
    }
  }

  public onEmployeeClik(idEmployee: number): void {
    window.open(EmployeeConstant.EMPLOYEE_EDIT_URL + idEmployee.toString());
  }
}
