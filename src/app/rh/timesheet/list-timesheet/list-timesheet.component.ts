import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { isNullOrUndefined } from 'util';
import { TimeSheetConstant } from '../../../constant/rh/timesheet.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { EmployeeState } from '../../../models/enumerators/employee-state.enum';
import { TimeSheetStatusEnumerator } from '../../../models/enumerators/timeSheet-status-enumerator.enum';
import { Employee } from '../../../models/payroll/employee.model';
import { TimeSheet } from '../../../models/rh/timesheet.model';
import { EmployeeService } from '../../../payroll/services/employee/employee.service';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { TimeSheetService } from '../../services/timesheet/timesheet.service';
@Component({
  selector: 'app-list-timesheet',
  templateUrl: './list-timesheet.component.html',
  styleUrls: ['./list-timesheet.component.scss']
})
export class ListTimesheetComponent implements OnInit, OnDestroy {
  /**
   * Enum  wainting , Accepted , Refused, canceled
   */
  public statusCode = TimeSheetStatusEnumerator;
  /**
   * Id of the connected user
   */
  public selectedEmployee = NumberConstant.ZERO;
  /**
   * List of ids of employees that has the connected user as super hierarchical
   */
  public listTimeSheetFormGroup: FormGroup;
  /**
   * List of timesheet
   */
  public TimeSheetList: TimeSheet[] = [];
  /**
  * The sys date
  */
 public currentDate = new Date();
 /**
  * The Employee object
  */
 public currentEmployee: Employee;
 /**
  * Is my timesheet or not
  */
 public myTimeSheet = true;
 /**
  * True if the connected user has the right to update or to validate the request
  */
 public isUpperHierrarchyOrTeamManager = false;
 private subscriptions: Subscription[] = [];
 public hasShowPermission: boolean;
 public hasAddPermission: boolean;
 public hasValidatePermission: boolean;
 public hasDeletePermission: boolean;
  /**
   * Constructor
   * @param timeSheetService
   * @param employeeService
   * @param fb
   * @param swalWarrings
   * @param router
   */
  constructor(public timeSheetService: TimeSheetService, private fb: FormBuilder, private swalWarrings: SwalWarring,
    private router: Router, public authService: AuthService, private employeeService: EmployeeService) {
  }

  /**
   * Id employee getter
   */
  get IdEmployee(): FormControl {
    return this.listTimeSheetFormGroup.get(TimeSheetConstant.ID_EMPLOYEE) as FormControl;
  }

  /**
   * Year getter
   */
  get Year(): FormControl {
    return this.listTimeSheetFormGroup.get(TimeSheetConstant.YEAR) as FormControl;
  }

  /**
   * Ng on init
   */
  ngOnInit() {
    this.hasShowPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.SHOW_TIMESHEET);
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.ADD_TIMESHEET);
    this.hasValidatePermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.VALIDATE_TIMESHEET);
    this.hasDeletePermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.DELETE_TIMESHEET);
    this.createSearchForm();
    this.getConnectedEmployee();
  }

  /**
   * Create list filter form
   */
  private createSearchForm() {
    this.listTimeSheetFormGroup = this.fb.group({
      IdEmployee: [NumberConstant.ZERO, Validators.required],
      Year: ['', Validators.required]
    });
  }

  private isConnectedEmployeeTimesheet() {
    this.myTimeSheet = this.IdEmployee.value === this.selectedEmployee ? true : false;
  }

  /**
   * Get connected employee
   */
  private getConnectedEmployee(): void {
    this.subscriptions.push(this.employeeService.getConnectedEmployee().subscribe((res: Employee) => {
      this.selectedEmployee = res.Id;
      this.currentEmployee = res;
      this.IdEmployee.setValue(this.selectedEmployee);
      this.currentDate = this.currentEmployee && this.currentEmployee.Status === EmployeeState.Resigned ?
        new Date(this.currentEmployee.ResignationDate) : new Date();
      this.Year.setValue(this.currentDate);
      this.initTimeSheetDataSource();
    }));
  }

  /**
   * When date change
   */
  public onChangeDate() {
    // Set date formcontrol value with systeme date if the specified date is invalid
    if (this.Year.value === null || this.Year.value === undefined) {
      this.listTimeSheetFormGroup.controls[TimeSheetConstant.YEAR].setValue(new Date());
    }
    // If form group is valid, init the datasource
    if (this.listTimeSheetFormGroup.valid) {
      this.initTimeSheetDataSource();
    }
  }

  /**
   * When selected employee is change
   * @param $event
   */
  public changeEmployeeDropdownValue($event) {
    // Set IdEmplpyee formcontrol value with connected user id if the specified value is invalid
    if (this.IdEmployee.value === 0 || this.IdEmployee.value === null || this.IdEmployee.value === undefined) {
      this.listTimeSheetFormGroup.controls[TimeSheetConstant.ID_EMPLOYEE].setValue(this.selectedEmployee);
    }
    if (!isNullOrUndefined($event)) {
      this.currentEmployee = $event.employeeFiltredDataSource
        .filter(x => x.Id === this.listTimeSheetFormGroup.controls[TimeSheetConstant.ID_EMPLOYEE].value)[0];
      this.currentDate = this.currentEmployee && this.currentEmployee.Status === EmployeeState.Resigned ?
        new Date(this.currentEmployee.ResignationDate) : new Date();
      if (this.currentDate !== new Date()) {
        this.Year.setValue(this.currentDate);
      }
      this.initTimeSheetDataSource();
    }
  }

  /**
   * Init the list of employee current year Timesheet
   */
  initTimeSheetDataSource() {
    this.subscriptions.push(this.timeSheetService.getYearTimeSheet(this.IdEmployee.value, new Date(this.Year.value)).subscribe(data => {
      this.TimeSheetList = data;
      this.isUpperHierrarchyOrTeamManager = this.TimeSheetList[NumberConstant.ZERO].IsConnectedUserInHierarchy;
      this.isConnectedEmployeeTimesheet();
    }));
  }

  /**
   * Open the timesheet corresponding to its Id if it exists, otherwise open the timesheet corresponding to the employee,
   * the corresponding month and year selected.
   * @param dataItem
   */
  public goToAdvancedEdit(timeSheet: TimeSheet) {
    if (timeSheet.Id !== NumberConstant.ZERO) {
      this.router.navigateByUrl(TimeSheetConstant.EDIT_URL.concat(timeSheet.Id.toString()), {skipLocationChange: true});
    } else {
      const date = new Date(timeSheet.Month);
      this.router.navigateByUrl(TimeSheetConstant.EDIT_URL
        .concat(this.IdEmployee.value.toString())
        .concat('/')
        .concat((+date.getMonth() + NumberConstant.ONE).toString())
        .concat('/')
        .concat(date.getFullYear().toString()), {skipLocationChange: true});
    }
  }

  /**
   * Validate timesheet
   * @param dataItem
   */
  public validateTimesheet(timeSheet: TimeSheet) {
    this.swalWarrings.CreateSwal(SharedConstant.ARE_YOU_SURE_TO_CONTINUE,
      TimeSheetConstant.TITLE_SWAL_WARRING_VALIDATE_TIMESHEET, SharedConstant.VALIDATE, SharedConstant.NO).then((result) => {
      if (result.value) {
        this.subscriptions.push(this.timeSheetService.definitiveValidate(this.IdEmployee.value, timeSheet.Id).subscribe(() => {
          this.initTimeSheetDataSource();
        }));
      }
    });
  }

  /**
   * Delete timesheet
   * @param timeSheet
   */
  public deleteTimeSheet(timeSheet: TimeSheet) {
    this.swalWarrings.CreateSwal().then((result) => {
      if (result.value) {
        this.subscriptions.push(this.timeSheetService.remove(timeSheet).subscribe(() => {
          this.initTimeSheetDataSource();
        }));
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscriptions !== undefined) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
  }

}
