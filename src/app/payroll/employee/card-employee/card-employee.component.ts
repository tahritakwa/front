import { Component, ComponentRef, EventEmitter, Input, OnInit, Output, ViewContainerRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PagerSettings } from '@progress/kendo-angular-grid';
import { IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';
import { ModalDialogInstanceService } from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import { Subject } from 'rxjs/Subject';
import { EmployeeConstant } from '../../../constant/payroll/employee.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { FormModalDialogService } from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { ProgressService } from '../../../shared/services/signalr/progress/progress.service';
import { DataTransferShowSpinnerService } from '../../../shared/services/spinner/data-transfer-show-spinner.service';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { EmployeeService } from '../../services/employee/employee.service';
import { LeaveBalanceRemainingService } from '../../services/leave-balance-remaining/leave-balance-remaining.service';
import { ListEmployeeComponent } from '../list-employee/list-employee.component';

@Component({
  selector: 'app-card-employee',
  templateUrl: './card-employee.component.html',
  styleUrls: ['./card-employee.component.scss']
})
export class CardEmployeeComponent extends ListEmployeeComponent implements OnInit {


  @Input() employees: any[] = [];
  @Input() isCardView: any;
  @Output() DoPaginte = new EventEmitter();
  @Input() gridSettings;
  public employeeProfileLink = EmployeeConstant.EMPLOYEE_PROFIL_URL;
/**
   * If modal=true
   */
 public isModal: boolean;
 /*
  * dialog subject
  */
 options: Partial<IModalDialogOptions<any>>;
 reference: ComponentRef<IModalDialog>;
 public closeDialogSubject: Subject<any>;
 public employee: any;
 public leaveBalance: any;
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  defaultPictureUrl = 'assets/image/no-picture.png';
  public pictureSrc: any;
  private imageGrid = [];
  hasShowPermission = false;
  hasUpdatePermission = false;
  hasDeletePermission = false;
  hasLeaveBalanceListPermission = false;
  public formatDate = this.translateService.instant(SharedConstant.DATE_FORMAT);

  constructor(private modalService: ModalDialogInstanceService,
    public employeeService: EmployeeService, public router: Router, public fb: FormBuilder,
    public swalWarrings: SwalWarring, public translateService: TranslateService, private viewRef: ViewContainerRef,
    public leaveBalanceRemainingService: LeaveBalanceRemainingService,
    private formModalDialogService: FormModalDialogService,
    public dataTransferShowSpinnerService: DataTransferShowSpinnerService,
    public progressService: ProgressService,
    public authService: AuthService) {
    super(employeeService, leaveBalanceRemainingService, router, fb, swalWarrings, translateService,
       dataTransferShowSpinnerService, progressService, authService);
  }
  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.isModal = true;
    this.options = options;
    this.closeDialogSubject = options.closeDialogSubject;
    this.employee = options.data.employee;
    this.leaveBalance =  options.data.leaveBalance;
  }
 ngOnInit() {
    this.hasShowPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.SHOW_EMPLOYEE);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.UPDATE_EMPLOYEE);
    this.hasDeletePermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.DELETE_EMPLOYEE);
    this.hasLeaveBalanceListPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.LIST_LEAVEREMAININGBALANCE);
    this.employees.forEach((customer, index) => {
      this.getPictureSrc(customer.UrlPicture, index);
    });
  }
  paginate(event) {
    this.DoPaginte.emit(event);
  }

  /**get picture */
  getPictureSrc(UrlPicture: string, index): any {
    if (UrlPicture) {
    this.employeeService.getPicture(UrlPicture).subscribe((data) => {
      this.pictureSrc = 'data:image/png;base64,' + data;
      this.imageGrid[index] = this.pictureSrc;
     });
    } else {
      this.imageGrid[index] = this.defaultPictureUrl;
    }
 }

  public deleteEmployee(employee) {
    this.swalWarrings.CreateSwal(EmployeeConstant.DELETE_EMPLOYEE).then((result) => {
      if (result.value) {
       this.subscriptions.push(this.employeeService.remove(employee).subscribe(() => {
          this.initGridDataSource();
        }));
      }
    });
  }
 public leaveBalanceRemainingDetails(employee) {
   this.leaveBalanceRemainingService.getLeaveBalanceRemainingListByIdEmployee(employee.Id).subscribe((result) => {
     const data = {};
     data['leaveBalance'] = result.objectData;
     data['employee'] = employee;
  this.formModalDialogService.openDialog(EmployeeConstant.LEAVE_BALANCE,
  CardEmployeeComponent, this.viewRef, null,
    data, true, SharedConstant.MODAL_DIALOG_SIZE_S);
  });
 }
}
