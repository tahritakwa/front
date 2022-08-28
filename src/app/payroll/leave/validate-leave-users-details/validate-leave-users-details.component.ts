import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { State } from '@progress/kendo-data-query';
import { Subscription } from 'rxjs';
import { LeaveRequestConstant } from '../../../constant/payroll/leave.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { Leave } from '../../../models/payroll/leave.model';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { LeaveService } from '../../services/leave/leave.service';

@Component({
  selector: 'app-validate-leave-users-details',
  templateUrl: './validate-leave-users-details.component.html',
  styleUrls: ['./validate-leave-users-details.component.scss']
})
export class ValidateLeaveUsersDetailsComponent implements OnInit, OnDestroy {
  public leaves: number[] = [];
  public listOfLeaves: Leave [];
  public UserPicture: any;
  dateFormat = this.translate.instant(SharedConstant.DATE_FORMAT);
  private subscriptions: Subscription[] = [];


  gridState: State = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.TWENTY,
    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: []
    }
  };
  public gridSettings: GridSettings = {
    state: this.gridState,
  };

  public hasMassiveValidatePermission: boolean;

    constructor(public leaveService: LeaveService, private router: Router, public authService: AuthService, private translate: TranslateService) {
  }

  ngOnInit() {
    this.hasMassiveValidatePermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.MASSIVE_VALIDATE_LEAVE);
    this.subscriptions.push(this.leaveService.getListLeaveIds().subscribe((data: any) => {
      this.leaves = data;
      this.getLeavesFromListId();
    }));
  }

  getLeavesFromListId() {
    this.leaveService.getLeaveFromListId(this.leaves).subscribe(result => {
      this.listOfLeaves = result;
      this.gridSettings.gridData = result;
      for (let i = NumberConstant.ZERO; i < this.listOfLeaves.length; i++) {
        this.leaveService.CalculateLeaveBalance(this.listOfLeaves[i]).subscribe(result => {
          if (this.listOfLeaves[i]) {
            this.listOfLeaves[i].IdLeaveTypeNavigation.MaximumNumberOfDays = result.Day;
          }
        });
      }
    });
  }


  deleteUserFromListUsersId(id: number) {
    this.listOfLeaves = this.listOfLeaves.filter(item => item.Id !== id);
  }

  validateMassiveLeaves(listOfLeave: Leave []) {
    this.subscriptions.push(this.leaveService.validateMassiveLeaves(listOfLeave).subscribe(() => {
      this.router.navigateByUrl(LeaveRequestConstant.LEAVE);
    }));
  }

  ngOnDestroy(): void {
    if (this.subscriptions !== undefined) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
  }
}
