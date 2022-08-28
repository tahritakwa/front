import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PagerSettings, SelectAllCheckboxState } from '@progress/kendo-angular-grid';
import { FilterDescriptor, State } from '@progress/kendo-data-query';
import { Subscription } from 'rxjs/Subscription';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { CompanyService } from '../../../administration/services/company/company.service';
import { AttendanceConstant } from '../../../constant/payroll/attendance.constant';
import { ContractConstant } from '../../../constant/payroll/Contract.constant';
import { EmployeeConstant } from '../../../constant/payroll/employee.constant';
import { SessionConstant } from '../../../constant/payroll/session.constant';
import { TimeSheetConstant } from '../../../constant/rh/timesheet.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PayrollSessionState } from '../../../models/enumerators/session-state.enum';
import { TimeSheetStatusEnumerator } from '../../../models/enumerators/timeSheet-status-enumerator.enum';
import { Contract } from '../../../models/payroll/contract.model';
import { SessionContract } from '../../../models/payroll/session-contract.model';
import { Session } from '../../../models/payroll/session.model';
import { TimesheetValidationService } from '../../../rh/services/timesheet-validation/timesheet-validation.service';
import { TimeSheetService } from '../../../rh/services/timesheet/timesheet.service';
import { DataTransferShowSpinnerService } from '../../../shared/services/spinner/data-transfer-show-spinner.service';
import { ValidationService } from '../../../shared/services/validation/validation.service';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { Filter, Operation, PredicateFormat } from '../../../shared/utils/predicate';
import { StarkPermissionsService } from '../../../stark-permissions/stark-permissions.module';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { ContractService } from '../../services/contract/contract.service';
import { EmployeeService } from '../../services/employee/employee.service';
import { SessionService } from '../../services/session/session.service';

@Component({
  selector: 'app-add-session',
  templateUrl: './add-session.component.html',
  styleUrls: ['./add-session.component.scss']
})
export class AddSessionComponent implements OnInit, OnDestroy {
  // Courant Session attributs
  public idSession: number;
  sessionInfos: Session = new Session();
  sessionPerMenth = new Session();
  sessionToSave = new Session();
  sessionContractsList = new Array<SessionContract>();
  // Grid selection
  predicate: PredicateFormat = new PredicateFormat();
  // The list of selected employee in the grid
  public employeesIdsSelected: number[] = [];
  // The whole employee send by server side
  public AllEmployeesList: SessionContract[] = [];
  public AllContractsIds: number[] = [];
  public selectAllState: SelectAllCheckboxState = SharedConstant.UNCHECKED as SelectAllCheckboxState;

  // session Form Group
  sessionFormGroup: FormGroup;
  public isUpdateMode = false;
  /**
   * True if session is closed
   */
  public isClosed = false;
  canNotUpdatePays = false;
  // Boolean Attributes
  public showDates = true;
  public showErrorMessage = false;
  // For validate session number unicity
  public showSessionUniqueErrorMessage = false;
  /**
   * Connected employee hierarchy
   */
  employeeHierarchy: number[] = [];
  /**
   * has right to validate timesheet
   */
  public hasRightToValidate = false;
  public payDependOnTimesheet = false;
  public disableMonth = false;
  public showGrid = false;
  // variable to execute or not onSelectionChange method
  public executeSelection = true;
  public statusCode = TimeSheetStatusEnumerator;
  // variable to control saving new selected session contracts when exiting
  public saveNewSessionContractAttendance = true;
  public gridState: State = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.TWENTY,
    // Initial filter descriptor
    filter: {
      logic: SharedConstant.LOGIC_AND,
      filters: []
    },
    sort: [
      {
        'field':  ContractConstant.REGISTRATION_NUMBER_FROM_EMPLOYEE_NAVIGATION,
        'dir' : 'desc'
      }
    ],
    group: []
  };
  public columnsConfig: ColumnSettings[] = [
    {
      field: ContractConstant.REGISTRATION_NUMBER_FROM_EMPLOYEE_NAVIGATION,
      title: EmployeeConstant.REGISTRATION_NUMBER_UPPERCASE,
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: ContractConstant.FIRST_NAME_FROM_EMPLOYEE_NAVIGATION,
      title: EmployeeConstant.EMPLOYEE,
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: ContractConstant.CONTRACT_TYPE_CODE,
      title: ContractConstant.CONTRACT_TYPE_UPPERCASE,
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: ContractConstant.TIMESHEET_STATUS,
      title: EmployeeConstant.CRA_STATUS_UPPERCASE,
      filterable: false,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    }
  ];
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };
  // pager settings
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  statusSearchDropdownFormGroup: FormGroup;
  status: number;
  private month: number;
  private year: number;
  private endDate: Date;
  private id: number;
  private subscriptions: Subscription[] = [];
  /** Permissions */
  public hasOpenPayrollSessionPermission: boolean;
  public hasUpdatePayrollSessionPermission: boolean;
  public hasShowPayrollSessionPermission: boolean;
  constructor(private fb: FormBuilder, private sessionService: SessionService, private employeeService: EmployeeService,
              private router: Router, private validationService: ValidationService, private activatedRoute: ActivatedRoute,
              private timeSheetService: TimeSheetService, private timesheetValidationService: TimesheetValidationService,
              private growlService: GrowlService, private translate: TranslateService, private contractService: ContractService,
              public authService: AuthService) {
    this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
      this.id = +params['id'] || NumberConstant.ZERO;
      this.isUpdateMode = this.id > NumberConstant.ZERO ? true : false;
    }));
  }

  get Code(): FormControl {
    return this.sessionFormGroup.get(SharedConstant.CODE) as FormControl;
  }

  get Title(): FormControl {
    return this.sessionFormGroup.get(SessionConstant.TITLE) as FormControl;
  }

  get Month(): FormControl {
    return this.sessionFormGroup.get(SharedConstant.MONTH) as FormControl;
  }

  /**
   * Initilialise the component
   */
  ngOnInit(): void {
    this.hasOpenPayrollSessionPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.OPEN_PAYROLL_SESSION);
    this.hasUpdatePayrollSessionPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.UPDATE_SESSION);
    this.hasShowPayrollSessionPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.SHOW_PAYROLL_SESSION);
    this.createStatusSearchDropdownForm();
    this.preparePredicate();
    this.sessionInfos = new Session();
    // Iniatalise Month with the current month
    const date = new Date();
    this.sessionInfos.Month = date;
    this.createAddSessionForm();
    this.sessionFormGroup.controls[SessionConstant.MONTH].setValue(date);
    // check if is an update case
    this.activatedRoute.params.subscribe(params => {
      this.idSession = params[SharedConstant.ID_LOWERCASE] || NumberConstant.ZERO;
    });
    if(this.hasShowPayrollSessionPermission){
      this.getEmployeesHierarchicalList();
      if (this.idSession) {
        // verify if the session's relation already exists to show data 
        this.getSession(this.idSession);
        // Get The list of the employees
        this.getAllContractsFromServer();
        this.showGrid = true;
      } else {
        this.prepareDate(date);
      }
    }
  }

  statusFilter(event) {
    this.status = event;
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.dataStateChange(this.gridSettings.state);
  }

  /**
   *  this method is called when the page number change or when the filter change
   */
  public dataStateChange(state: State): void {
    this.gridSettings.state = state;
    this.predicate.pageSize = this.gridSettings.state.take;
    this.predicate.page = this.gridSettings.state.skip / this.gridSettings.state.take + NumberConstant.ONE;
    let filters = state.filter.filters as FilterDescriptor[];
    this.predicate.Filter = new Array<Filter>();
    if (filters.length !== NumberConstant.ZERO) {
      filters.forEach(element => {
        if (element.field.toString() == ContractConstant.REGISTRATION_NUMBER) {
          this.predicate.Filter.push(new Filter(ContractConstant.REGISTRATION_NUMBER_FROM_EMPLOYEE_NAVIGATION, Operation.contains, element.value));
        } else if (element.field.toString() == EmployeeConstant.FULL_NAME) {
          this.predicate.Filter.push(new Filter(ContractConstant.EMPLOYEE_FULL_NAME, Operation.contains, element.value));
        }
      });
    }
    this.getAllContractsFromServer();
    this.setSelectionState();
  }

  // Set selectAll checkbox state
  setSelectionState() {
    const selectionLength = this.employeesIdsSelected.length;
    this.showErrorMessage = selectionLength === NumberConstant.ZERO ? true : false;
    if (selectionLength === NumberConstant.ZERO) {
      this.selectAllState = SharedConstant.UNCHECKED as SelectAllCheckboxState;
    } else if (selectionLength === this.gridSettings.gridData.total) {
      this.selectAllState = SharedConstant.CHECKED as SelectAllCheckboxState;
    } else {
      this.selectAllState = SharedConstant.INDETERMINATE as SelectAllCheckboxState;
    }
  }
  /**
   *  prepare the form to create a new session
   */
  private createAddSessionForm(): void {
    this.sessionFormGroup = this.fb.group({
      Code: [''],
      Title: [{value: '', disabled: this.hasShowPayrollSessionPermission && !this.hasUpdatePayrollSessionPermission && !this.hasOpenPayrollSessionPermission}, [Validators.required]],
      Month: [{value: '', disabled: this.isUpdateMode}, Validators.required],
    });
  }

  /**
   *  get list of available contracts from server
   */
  getAllContractsFromServer() {
    const pred = this.sessionService.preparePrediacteFormat(this.gridSettings.state, this.predicate);
    this.subscriptions.push(this.sessionService.getListOfAvailableEmployeesByContracts(pred, this.idSession).subscribe((res) => {
      this.payDependOnTimesheet = res.PayDependOnTimesheet;
      if (this.employeesIdsSelected.length === NumberConstant.ZERO) {
        // Retreive selected contracts
        res.SessionContracts.forEach(element => {
          if (element.IdSelected !== NumberConstant.ZERO) {
            this.employeesIdsSelected.push(element.IdContract);
          }
        });
      }
      // save the employees list in the grid
      this.gridSettings.gridData = res.SessionContracts;
      this.AllEmployeesList = res.SessionContracts;
      this.gridSettings.gridData.data = res.SessionContracts.slice(NumberConstant.ZERO, this.gridSettings.state.take);
      this.gridSettings.gridData.total = res.Total;
      this.setSelectionState();
    }));
    this.subscriptions.push(this.sessionService.getById(this.idSession).subscribe(data => {
      this.sessionInfos = data;
    }));
  }

  /**
   *  save session in data base and display all contracts
   */
  startSession() {
    if (this.sessionFormGroup.valid) {
      // Bind form information to the session
      this.sessionToSave.Title = this.Title.value;
      this.sessionToSave.Month = this.Month.value;
      this.subscriptions.push(this.sessionService.save(this.sessionToSave, true).subscribe(res => {
         const CourantSession = Object.assign({}, new Session(), res);
         this.idSession = CourantSession.Id;
         this.disableMonth = true;
         this.showGrid = true;
         if(this.hasShowPayrollSessionPermission || this.hasOpenPayrollSessionPermission){
          this.getAllContractsFromServer();
         }
       }));
    }else {
      this.validationService.validateAllFormFields(this.sessionFormGroup);
    }
  }

  preparePredicate() {
    this.predicate.Filter = new Array<Filter>();
    this.predicate.pageSize = this.gridSettings.state.take;
    this.predicate.page = this.gridSettings.state.skip / this.gridSettings.state.take + NumberConstant.ONE;
  }

  /**
   * This method is executed when the value of the month input change
   */
  onClickInitialiseDate() {
    if ((this.sessionFormGroup.value.Month != null)) {
      this.showDates = true;
      this.sessionInfos.Month = new Date(this.sessionFormGroup.controls[SessionConstant.MONTH].value);
      this.prepareDate(this.sessionInfos.Month);
    } else {
      this.showDates = false;
    }
  }

  /**
   * This method calculate startDate and endDate base only=the month value
   */
  prepareDate(date: Date) {
    this.month = date.getMonth();
    this.year = date.getFullYear();
    this.endDate = new Date(this.year, this.month + 1, NumberConstant.SHIFT_LAST_DATE);
  }

  /**
   * This method is executed when selecting one element
   */
  public onSelectionChange(res: any) {
    if (this.executeSelection) {
      let idContract;
      let idTimeSheet;
      let idSelected;
      if (res.deselectedRows.length !== NumberConstant.ZERO) {
        idContract = res.deselectedRows[NumberConstant.ZERO].dataItem.IdContract;
        idTimeSheet = res.deselectedRows[NumberConstant.ZERO].dataItem.IdTimeSheet;
        this.subscriptions.push(this.sessionService.getListOfAvailableEmployeesByContracts(this.predicate, this.idSession).subscribe(elt => {
          idSelected = elt.SessionContracts.filter(element => element.IdContract === idContract)[NumberConstant.ZERO].IdSelected;
          this.employeesIdsSelected = this.employeesIdsSelected.filter(x => x !== idContract);
          this.setSelectionState();
          this.subscriptions.push(this.sessionService.addContractToSession(idContract, this.idSession, idSelected, idTimeSheet).subscribe());
        }));
      }
      if (res.selectedRows.length !== NumberConstant.ZERO) {
        idContract = res.selectedRows[NumberConstant.ZERO].dataItem.IdContract;
        idTimeSheet = res.selectedRows[NumberConstant.ZERO].dataItem.IdTimeSheet;
        //get list of all contracts to update IdSelected
        this.subscriptions.push(this.sessionService.getListOfAvailableEmployeesByContracts(this.predicate, this.idSession).subscribe(elt => {
          idSelected = elt.SessionContracts.filter(element => element.IdContract === idContract)[NumberConstant.ZERO].IdSelected;
          this.subscriptions.push(this.sessionService.addContractToSession(idContract, this.idSession, idSelected, idTimeSheet).subscribe(data => {
            if (this.payDependOnTimesheet) {
              if (data.model.Status === TimeSheetStatusEnumerator.Sended) {
                this.employeesIdsSelected = this.employeesIdsSelected.filter(id => id !== idContract);
                this.growlService.warningNotification(this.translate.instant(TimeSheetConstant.CRA_NON_VALID));
              } else if (data.model.Status === TimeSheetStatusEnumerator.ToReWork) {
                this.employeesIdsSelected = this.employeesIdsSelected.filter(id => id !== idContract);
                this.growlService.warningNotification(this.translate.instant(TimeSheetConstant.CRA_TO_CORRECT));
              } else if (data.model.Status === TimeSheetStatusEnumerator.ToDo) {
                this.employeesIdsSelected = this.employeesIdsSelected.filter(id => id !== idContract);
                this.growlService.warningNotification(this.translate.instant(TimeSheetConstant.CRA_NOT_SUBMITTED));
              }
            }
            this.setSelectionState();
          }));
        }));
      }
    }
  }

  /**
   * this method aims to select all elements of the grid or deselect it
   */
  public onSelectAllChange(checkedState: SelectAllCheckboxState) {
    this.executeSelection = false;
    let allIds = [];
    let allSelected = checkedState === SharedConstant.CHECKED as SelectAllCheckboxState;
    this.subscriptions.push(this.sessionService.addAllContractsToSession(this.predicate, allSelected, this.idSession,).subscribe(res => {
      allIds = res;
      this.executeSelection = true;
      if (allIds.length === NumberConstant.ZERO) {
        this.selectAllState = SharedConstant.UNCHECKED as SelectAllCheckboxState;
        this.employeesIdsSelected = [];
      } else {
        this.employeesIdsSelected = allIds;
      }
      this.setSelectionState();
    }));
  }

  /**
   * Navigate to next url
   */
  public onNextClick(): void {
    if (this.sessionFormGroup.valid && this.employeesIdsSelected.length > NumberConstant.ZERO) {
      this.sessionInfos.State = PayrollSessionState.New;
      this.sessionInfos.Title = this.Title.value;
      this.subscriptions.push(this.sessionService.updateSessionStates(this.sessionInfos).subscribe(data => {
        if (data) {
          this.saveNewSessionContractAttendance = false;
          this.router.navigateByUrl(AttendanceConstant.ATTENDANCE_URL.concat(this.idSession.toString()), {skipLocationChange: true});
        }
      }));
    } else {
      this.validationService.validateAllFormFields(this.sessionFormGroup);
      this.showErrorMessage = true;
    }

  }

  /**
   * this method will be called to retrieve the session object from the server
   */
  getSession(id: number) {
    this.employeesIdsSelected = [];
    this.subscriptions.push(this.sessionService.getByIdWithRelation(id)
      .subscribe(
        data => {
          this.sessionInfos = data;
          this.isClosed = this.sessionInfos.State === PayrollSessionState.Closed;
          // Bind the form with data received
          this.sessionInfos.Month = new Date(this.sessionInfos.Month);
          this.payDependOnTimesheet = this.sessionInfos.DependOnTimesheet;
          this.sessionFormGroup.patchValue(this.sessionInfos);
          this.prepareDate(this.sessionInfos.Month);
          // Prepare Selected List
          this.employeesIdsSelected = this.sessionInfos.SessionContract.map(element => element.IdContract);
          if (this.isClosed) {
            this.sessionFormGroup.disable();
          }
        }
      ));
  }

  /**
   * Get employee hierrarchy list
   */
  public getEmployeesHierarchicalList() {
    this.subscriptions.push(this.employeeService.getEmployeesHierarchicalList().subscribe(data => {
      this.employeeHierarchy = data.map(x => x.Id);
    }));
  }

  /**
   * Check if employee with id is in connected employee hierrarchy
   * @param id
   */
  public isInEmployeesHierarchy(id: number): boolean {
    return this.timesheetValidationService.isInEmployeesHierarchy(id, this.employeeHierarchy);
  }

  public SendMail(id: number) {
    if (!this.canNotUpdatePays) {
      this.timesheetValidationService.SendMail(id, this.Month.value);
    }
  }

  /**
   * Validate timesheet
   * @param dataItem
   */
  public validateCRA(idContract, idTimeSheet) {
    let contract: Contract;
    this.subscriptions.push(this.contractService.getById(idContract).subscribe(res => {
      contract = res;
      contract.IdTimeSheet = idTimeSheet;
      this.subscriptions.push(this.timeSheetService.getById(idTimeSheet).subscribe(data => {
        contract.IdTimeSheetNavigation = data;
        contract.TimesheetStatus = data.Status;
        this.timesheetValidationService.validateCRA(contract);
      }));
    }));
  }


  ngOnDestroy(): void {
    if (this.saveNewSessionContractAttendance && this.sessionInfos.Id) {
      this.sessionInfos.State = PayrollSessionState.New;
      this.subscriptions.push(this.sessionService.updateSessionStates(this.sessionInfos).subscribe());
    }
    if (this.subscriptions !== undefined) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
  }

  private createStatusSearchDropdownForm(): void {
    this.statusSearchDropdownFormGroup = this.fb.group({
      Status: ''
    });
  }

}
