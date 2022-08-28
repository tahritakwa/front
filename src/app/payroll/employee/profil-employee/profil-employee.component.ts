import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../services/employee/employee.service';
import { EmployeeConstant } from '../../../constant/payroll/employee.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { Employee } from '../../../models/payroll/employee.model';
import { MaritalStatusEnumerator } from '../../../models/enumerators/marital-status-enum';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { TranslateService } from '@ngx-translate/core';
import { LeaveBalanceRemainingService } from '../../services/leave-balance-remaining/leave-balance-remaining.service';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';

@Component({
  selector: 'app-profil-employee',
  templateUrl: './profil-employee.component.html',
  styleUrls: ['./profil-employee.component.scss']
})
export class ProfilEmployeeComponent implements OnInit {
  @ViewChild('BackToList') backToList: ElementRef;
  public maritalStatus = MaritalStatusEnumerator;
  public employeeFormGroup: FormGroup;
  public dateFormat = this.translate.instant(SharedConstant.YEAR_FORMAT);
  /*
  * id Subscription
  */
 public idSubscription: Subscription;
  public employeeTypeInput: any;
  public id: any;
  public employeeToUpdate: Employee;
  public pictureEmployesSrc: any;
  public leaveBalanceRemaining: any;

  public hasShowPermission: boolean;
  public hasUpdatePermission: boolean;

  constructor(private activatedRoute: ActivatedRoute, private  employeeService: EmployeeService, private translate: TranslateService,
    public authService: AuthService, public router: Router, public leaveBalanceRemainingService: LeaveBalanceRemainingService) {
    this.employeeToUpdate = this.activatedRoute.snapshot.data['employeeToUpdate'];
    this.idSubscription = this.activatedRoute.params.subscribe(params => {
      this.id = + params[EmployeeConstant.PARAM_ID] || NumberConstant.ZERO;
    });
   }

  ngOnInit() {
    this.hasShowPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.SHOW_EMPLOYEE);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.UPDATE_EMPLOYEE);
    if (this.employeeToUpdate) {
      this.employeeToUpdate.EmployeeSkills.forEach(x => {
        x.RatePercent = Math.round((x.Rate * NumberConstant.ONE_HUNDRED) / NumberConstant.SIX);
        x.ColorRate = SharedConstant.COLORS[Math.floor(Math.random() * SharedConstant.COLORS.length)];
      });
      if (this.employeeToUpdate.Picture) {
        this.employeeService.getPicture(this.employeeToUpdate.Picture).subscribe((data: any) => {
          this.pictureEmployesSrc = 'data:image/png;base64,' + data;
        });
      }
    }
    this.leaveBalanceRemainingDetails(this.id);
  }

  public goToEditEmployee() {
    this.router.navigateByUrl(EmployeeConstant.EMPLOYEE_EDIT_URL.concat(this.id), {queryParams: this.id, skipLocationChange: true});
  }

  public leaveBalanceRemainingDetails(idEmployee) {
    this.leaveBalanceRemainingService.getLeaveBalanceRemainingListByIdEmployee(idEmployee).subscribe((result) => {
      this.leaveBalanceRemaining = result.objectData;
  });
}
}
