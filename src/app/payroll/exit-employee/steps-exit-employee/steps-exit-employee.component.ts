import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { ExitEmployeeConstant } from '../../../constant/payroll/exit-employee.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { ExitEmployeeStatusEnum } from '../../../models/enumerators/exit-employee-status-enum';
import { ExitEmployee } from '../../../models/payroll/exit-employee.model';
import { dateValueGT, ValidationService } from '../../../shared/services/validation/validation.service';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { ExitEmployeeSteperComponent } from '../../components/exit-employee-steper/exit-employee-steper/exit-employee-steper.component';
import { EmployeeService } from '../../services/employee/employee.service';
import { ExitEmployeeService } from '../../services/exit-employee/exit-employee.service';
import { AddExitEmployeeComponent } from '../add-exit-employee/add-exit-employee.component';

@Component({
  selector: 'app-steps-exit-employee',
  templateUrl: './steps-exit-employee.component.html',
  styleUrls: ['./steps-exit-employee.component.scss']
})
export class StepsExitEmployeeComponent implements OnInit, OnDestroy {
  @ViewChild(AddExitEmployeeComponent) exitEmployeeAddViewChild;
  @ViewChild(ExitEmployeeSteperComponent) exitEmployeeSteperViewChild;
  hideCardBody = false;
  exitEmployeeId = 0;
  employeeExit: ExitEmployee;
  isExitEmployeeReady = false;
  public isUpdateMode = false;
  public EmployeeHierarchy: boolean;
  public statusCode = ExitEmployeeStatusEnum;
  public showStepperBool = false;
  /**
   * True if connected employee can validate
   */
  public canValidate: any;
  public canRefuse = false;
  private isSaveOperation = false;
  private subscriptions: Subscription[] = [];
  constructor(private employeeService: EmployeeService, private router: Router,
              private activatedRoute: ActivatedRoute,
              private exitEmployeeService: ExitEmployeeService,
              private validationService: ValidationService, public authService: AuthService) {
    this.activatedRoute.params.subscribe(params => {
      this.exitEmployeeId = params[SharedConstant.ID_LOWERCASE] || NumberConstant.ZERO;
    });
  }

  ngOnInit() {
    this.isUpdateMode = this.exitEmployeeId > NumberConstant.ZERO ? true : false;
    this.exitEmployeeService.getById(this.exitEmployeeId).subscribe((data) => {
      this.employeeExit = data;
      this.canValidate = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.VALIDATE_EXITEMPLOYEE);
      this.canRefuse = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.REFUSE_EXITEMPLOYEE);
      this.employeeService.IsUserInSuperHierarchicalEmployeeList(this.employeeExit.IdEmployeeNavigation).subscribe(res => {
        this.EmployeeHierarchy = res;
      });
    });
  }
  changeEmployeeExit($event) {
    this.employeeExit = $event;
  }

  // # end method region
  save() {
    if ((this.exitEmployeeAddViewChild.LeaveEmployeeFormGroup.valid && this.exitEmployeeSteperViewChild.rhInformationViewChild.
      LeaveEmployeeRhFormGroup.valid)) {
      this.isSaveOperation = true;
      let obj: ExitEmployee = Object.assign({}, this.employeeExit, this.exitEmployeeAddViewChild.GetLeaveEmployeeFormGroup().getRawValue());
      obj = Object.assign(obj, this.exitEmployeeSteperViewChild.rhInformationViewChild.GetLeaveEmployeeRhFormGroup().getRawValue());
      obj.ListIdEmployeeMultiselect = this.exitEmployeeSteperViewChild.rhInformationViewChild.GetListCurrentSelectedIds();
      this.subscriptions.push(this.exitEmployeeService.save(obj, !this.isUpdateMode).subscribe(() => {
        this.router.navigate([ExitEmployeeConstant.LIST_URL]);
      }));
    }
  }

  public validateRequest() {
    this.exitEmployeeSteperViewChild.rhInformationViewChild.LeaveEmployeeRhFormGroup.controls.ExitPhysicalDate.setValidators([Validators.required,
      dateValueGT(new Observable(o => o.next(this.employeeExit.IdEmployeeNavigation.HiringDate)))]);
    if ((this.exitEmployeeAddViewChild.LeaveEmployeeFormGroup.valid || this.exitEmployeeSteperViewChild.rhInformationViewChild.
      LeaveEmployeeRhFormGroup.valid)) {
      this.employeeExit = Object.assign({}, this.employeeExit, this.exitEmployeeAddViewChild.GetLeaveEmployeeFormGroup().getRawValue());
      this.employeeExit = Object.assign(this.employeeExit,
        this.exitEmployeeSteperViewChild.rhInformationViewChild.GetLeaveEmployeeRhFormGroup().getRawValue());
      this.employeeExit.ListIdEmployeeMultiselect = this.exitEmployeeSteperViewChild.rhInformationViewChild.GetListCurrentSelectedIds();
      this.exitEmployeeAddViewChild.setRequestState(this.statusCode.Accepted);
      this.isSaveOperation = true;
    }
  }
  public refuseRequest() {
    this.isSaveOperation = true;
    this.exitEmployeeAddViewChild.setRequestState(this.statusCode.Refused);
  }

  public showStepper($event) {
    this.showStepperBool = this.employeeExit.Status !== this.statusCode.Draft || $event;
    this.subscriptions.push(this.exitEmployeeService.getById(this.exitEmployeeId).subscribe((data) => {
      this.employeeExit = data;
    }));
  }

  isFormChanged(): boolean {
    if (this.exitEmployeeAddViewChild && this.exitEmployeeAddViewChild.LeaveEmployeeFormGroup.touched ||
      this.exitEmployeeSteperViewChild && this.exitEmployeeSteperViewChild.rhInformationViewChild.
        LeaveEmployeeRhFormGroup.touched) {
      return true;
    }
    return false;
  }
  /**
   * this method will be called by CanDeactivateGuard service to check the leaving component possibility
   */
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.isSaveOperation) {
      this.isSaveOperation = false;
      return true;
    }
    return this.validationService.handleCanDeactivateToLeaveCurrentComponent(this.isFormChanged.bind(this));
  }

  ngOnDestroy(): void {
    if (this.subscriptions !== undefined) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
  }
}
