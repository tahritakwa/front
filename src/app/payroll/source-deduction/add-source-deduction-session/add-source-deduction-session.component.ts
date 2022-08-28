import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectAllCheckboxState } from '@progress/kendo-angular-grid';
import { process, State } from '@progress/kendo-data-query';
import { Subscription } from 'rxjs/Subscription';
import { SourceDeductionConstant } from '../../../constant/payroll/source-deduction.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PayrollSessionState } from '../../../models/enumerators/session-state.enum';
import { Employee } from '../../../models/payroll/employee.model';
import { SourceDeductionSessionEmployee } from '../../../models/payroll/source-deduction-session-employee.model';
import { SourceDeductionSession } from '../../../models/payroll/source-deduction-session.model';
import { DataTransferShowSpinnerService } from '../../../shared/services/spinner/data-transfer-show-spinner.service';
import { ValidationService } from '../../../shared/services/validation/validation.service';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { EmployeeService } from '../../services/employee/employee.service';
import { SourceDeductionSessionService } from '../../services/source-deduction-session/source-deduction-session.service';

@Component({
  selector: 'app-add-source-deduction',
  templateUrl: './add-source-deduction-session.component.html',
  styleUrls: ['./add-source-deduction-session.component.scss']
})
export class AddSourceDeductionSessionComponent implements OnInit, OnDestroy {
  public isUpdateMode = false;
  public isModal = false;
  public canNotUpdatePays = false;
  public sourceDeductionSessionFormGroup: FormGroup;
  public showErrorMessage = false;
  // For validate session number unicity
  public showSessionUniqueErrorMessage = false;
  public sourceDeductionSessionInfos = new SourceDeductionSession();

  // The list of selected employee in the grid
  public employeesIdsSelected: number[] = [];
  // The whole employee send by server side
  public AllEmployeesList: Employee[] = [];
  public AllEmployeesIds: number[] = [];
  public selectAllState: SelectAllCheckboxState = SharedConstant.UNCHECKED as SelectAllCheckboxState;
  public idSourceDeduction: number;
  isClosed = false;
  /**
   * permissions
   */
  public hasUpdatePermission: boolean;
  public hasAddPermission: boolean;
  public hasShowPermission: boolean;
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
      field: SourceDeductionConstant.REGISTRATION_NUMBER,
      title: SourceDeductionConstant.REGISTRATION_NUMBER_UPPERCASE,
      filterable: true
    },
    {
      field: SourceDeductionConstant.FIRST_NAME,
      title: SourceDeductionConstant.FIRST_NAME_UPPERCASE,
      filterable: true
    },
    {
      field: SourceDeductionConstant.LAST_NAME,
      title: SourceDeductionConstant.LAST_NAME_UPPERCASE,
      filterable: true
    }
  ];
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };
  private subscriptions: Subscription[] = [];

  constructor(private fb: FormBuilder, private sourceDeductionSessionService: SourceDeductionSessionService,
              private employeeService: EmployeeService, private router: Router, private validationService: ValidationService,
              private dataTransferShowSpinnerService: DataTransferShowSpinnerService, private activatedRoute: ActivatedRoute, private authService: AuthService) {

  }

  /**
   * get title formcontrol
   */
  get Title(): FormControl {
    return this.sourceDeductionSessionFormGroup.get(SourceDeductionConstant.TITLE) as FormControl;
  }

  get Code(): FormControl {
    return this.sourceDeductionSessionFormGroup.get(SharedConstant.CODE) as FormControl;
  }

  /**
   * get year formcontrol
   */
  get Year(): FormControl {
    return this.sourceDeductionSessionFormGroup.get(SourceDeductionConstant.YEAR) as FormControl;
  }

  /**
   * get year as number from the formcontrol
   */
  get YearAsNumber(): number {
    return (this.Year.value as Date).getFullYear();
  }

  ngOnInit() {
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.UPDATE_SOURCEDEDUCTIONSESSION);
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.ADD_SOURCEDEDUCTIONSESSION);
    this.hasShowPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.SHOW_SOURCEDEDUCTIONSESSION);
    this.sourceDeductionSessionInfos = new SourceDeductionSession();
    // check if it is an update case
    this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
      this.idSourceDeduction = params[SharedConstant.ID_LOWERCASE] || NumberConstant.ZERO;
      this.isUpdateMode = this.idSourceDeduction !== NumberConstant.ZERO ? true : false;
    }));
    this.createAddSessionForm();
    if (this.idSourceDeduction) {
      this.getSourceDeductionSession(this.idSourceDeduction);
    } else {
      this.Year.setValue(new Date());
      this.getAllEmployeesFromServer();
    }
  }


  /**
   * This method will be called to retrieve the source deduction session object from the server
   */
  getSourceDeductionSession(id: number) {
    this.employeesIdsSelected = [];
    this.subscriptions.push(this.sourceDeductionSessionService.getByIdWithRelation(id)
      .subscribe(
        result => {
          this.sourceDeductionSessionInfos = result;
          this.isClosed = this.sourceDeductionSessionInfos.State === PayrollSessionState.Closed;
          this.Code.setValue(this.sourceDeductionSessionInfos.Code);
          this.Title.setValue(this.sourceDeductionSessionInfos.Title);
          this.Year.setValue(new Date(this.sourceDeductionSessionInfos.Year, new Date().getMonth(), new Date().getDay()));
          this.getAllEmployeesFromServer();
          this.employeesIdsSelected = this.sourceDeductionSessionInfos.SourceDeductionSessionEmployee.map(element => element.IdEmployee);
          this.checkSelectedState();
          if (this.isClosed) {
            this.sourceDeductionSessionFormGroup.disable();
          }
        }
      ));
  }

  /**
   * Check if the session number chosen is unique according to the month of the session
   */
  validateSessionNumber(): void {
    this.dataTransferShowSpinnerService.setShowSpinnerValue(true);
    this.sourceDeductionSessionInfos.Year = this.Year.value ? this.YearAsNumber : NumberConstant.ZERO;
    this.sourceDeductionSessionService.getUnicitySourceDeductionSessionPerYear(this.sourceDeductionSessionInfos).toPromise().then(res => {
      if (res === true) {
        this.showSessionUniqueErrorMessage = true;
      } else {
        this.showSessionUniqueErrorMessage = false;
      }
    });
  }

  /**
   * This method is executed when the value of the year input change
   */
  onClickInitialiseDate() {
    if ((this.Year.value != null)) {
      this.employeesIdsSelected = [];
    }
    this.validateSessionNumber();
    this.getAllEmployeesFromServer();
  }

  /**
   *  retrieve the list of all employees
   */
  getAllEmployeesFromServer() {
    this.AllEmployeesIds = [];
    const year = this.Year.value ? this.YearAsNumber : NumberConstant.ZERO;
    this.subscriptions.push(this.employeeService.GetEmployeesHasPayslip(year).subscribe((res) => {
        // Retreive the Employees Id for the select all case
        res.listData.forEach(element => {
          this.AllEmployeesIds.push(element.Id);
        });
        // save the employees list in the grid
        this.gridSettings.gridData = res;
        this.AllEmployeesList = res.listData;
        this.gridSettings.gridData.data = res.listData.slice(this.gridState.skip, this.gridState.take);
      }
    ));
  }

  /**
   * Check if the selection state
   */
  checkSelectedState() {
    // check if sate= checked if update mode
    if (this.employeesIdsSelected.length === this.AllEmployeesIds.length) {
      this.selectAllState = SharedConstant.CHECKED as SelectAllCheckboxState;
    } else {
      if (this.employeesIdsSelected.length > NumberConstant.ZERO) {
        this.selectAllState = SharedConstant.INDETERMINATE as SelectAllCheckboxState;
      } else {
        this.selectAllState = SharedConstant.UNCHECKED as SelectAllCheckboxState;
      }
    }
  }

  /**
   *  this method is called when the page number change or when the filter change
   */
  public dataStateChange(state: State): void {
    this.gridSettings.state = state;
    const listEmployees = Object.assign([], this.AllEmployeesList);
    this.gridSettings.gridData = process(listEmployees, state);
  }

  /**
   * check the state of the select all checkbox in the kendo grid
   */
  public onSelectedKeysChange(e) {
    const len = this.employeesIdsSelected.length;
    if (len === NumberConstant.ZERO) {
      this.selectAllState = SharedConstant.UNCHECKED as SelectAllCheckboxState;
    } else if (len > NumberConstant.ZERO && len < this.AllEmployeesIds.length) {
      this.selectAllState = SharedConstant.INDETERMINATE as SelectAllCheckboxState;
    } else {
      this.selectAllState = SharedConstant.CHECKED as SelectAllCheckboxState;
    }
  }

  /**
   * this method aims to select all elements of the grid or deselect it
   */
  public onSelectAllChange(checkedState: SelectAllCheckboxState) {
    if (checkedState === SharedConstant.CHECKED as SelectAllCheckboxState) {
      this.employeesIdsSelected = Object.assign([], this.AllEmployeesIds);
      this.selectAllState = SharedConstant.CHECKED as SelectAllCheckboxState;
    } else {
      this.employeesIdsSelected = [];
      this.selectAllState = SharedConstant.UNCHECKED as SelectAllCheckboxState;
    }
  }

  public onAddSessionClick(): void {
    if (!this.isClosed && this.hasAddPermission) {
      if (this.sourceDeductionSessionFormGroup.valid && this.employeesIdsSelected.length > NumberConstant.ZERO
        && this.showSessionUniqueErrorMessage === false) {
        let sourceDeductionSession: SourceDeductionSession;
        const sessionEmployeesList = new Array<SourceDeductionSessionEmployee>();
        if (!this.sourceDeductionSessionInfos.Id) {
          // Add Case
          sourceDeductionSession = new SourceDeductionSession();
          // change the status of the session object to indicate that it is the first interface of the wizard
          sourceDeductionSession.State = PayrollSessionState.New;
        } else {
          // Update Case
          sourceDeductionSession = this.sourceDeductionSessionInfos;
        }
        // Bind form information to the session
        sourceDeductionSession.Title = this.Title.value;
        sourceDeductionSession.Year = this.YearAsNumber;
        // get all ids of the selected employees and build sourceDeductionSessionEmployee objects from the retrieved id
        this.employeesIdsSelected = this.employeesIdsSelected.filter((n, i) => this.employeesIdsSelected.indexOf(n) === i);
        // get all ids of the selected employees and build sessionEmployee objects from the retrieved id
        this.employeesIdsSelected.forEach(element => {
          const sourceDeductionSessionEmployee = new SourceDeductionSessionEmployee();
          sourceDeductionSessionEmployee.IdEmployee = element;
          sessionEmployeesList.push(sourceDeductionSessionEmployee);
        });
        sourceDeductionSession.SourceDeductionSessionEmployee = sessionEmployeesList;
        const isUpdate = this.idSourceDeduction !== NumberConstant.ZERO;
        this.subscriptions.push(this.sourceDeductionSessionService.save(sourceDeductionSession, !isUpdate)
          .subscribe(
            res => {
              if (!isUpdate) {
                const CourantSession = Object.assign({}, new SourceDeductionSession(), res);
                this.idSourceDeduction = CourantSession.Id;
              }
              if (this.hasShowPermission || this.hasUpdatePermission) {
                this.router.navigateByUrl(SourceDeductionConstant.SOURCE_DEDUCTION_URL.concat(this.idSourceDeduction.toString()));
              }
              else {
                this.router.navigateByUrl(SourceDeductionConstant.SOURCE_DEDUCTION_SESSION_URL);
              }
              
            }
          ));
      } else {
        this.validationService.validateAllFormFields(this.sourceDeductionSessionFormGroup);
        this.employeesIdsSelected.length <= NumberConstant.ZERO ? this.showErrorMessage = true : this.showErrorMessage = false;
      }
    } else {
      this.router.navigateByUrl(SourceDeductionConstant.SOURCE_DEDUCTION_URL.concat(this.idSourceDeduction.toString()));
    }
  }

  ngOnDestroy(): void {
    if (this.subscriptions !== undefined) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
  }

  /**
   *  prepare the form to create a new session
   */
  private createAddSessionForm(): void {
    this.sourceDeductionSessionFormGroup = this.fb.group({
      Code: new FormControl(''),
      Title: [{value: '', disabled: this.isUpdateMode && !this.hasUpdatePermission}, Validators.required],
      Year: [{value: '', disabled: this.isUpdateMode && !this.hasUpdatePermission}, Validators.required]
    });
  }
}
