import { Component, OnDestroy, OnInit } from '@angular/core';
import { TimeSheet } from '../../../models/rh/timesheet.model';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { State } from '@progress/kendo-data-query';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { Router } from '@angular/router';
import { TimeSheetService } from '../../services/timesheet/timesheet.service';
import { TimeSheetConstant } from '../../../constant/rh/timesheet.constant';
import { Subscription } from 'rxjs';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../login/Authentification/services/auth.service';

@Component({
  selector: 'app-validate-cra-details',
  templateUrl: './validate-cra-details.component.html',
  styleUrls: ['./validate-cra-details.component.scss']
})
export class ValidateCraDetailsComponent implements OnInit, OnDestroy {
  public Timesheets: number[] = [];
  public listOfTimesheets: TimeSheet [];
  public UserPicture: any;
  dateFormat = this.translate.instant(SharedConstant.DATE_FORMAT);
  private listIdSubscription: Subscription;
  public hasMassiveValidatePermission: boolean;

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
    constructor(private timeSheetService: TimeSheetService, private router: Router, private translate: TranslateService, public authService: AuthService) {
   }

  ngOnInit() {
    this.hasMassiveValidatePermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.MASSIVE_VALIDATE_TIMESHEET);
    this.listIdSubscription = this.timeSheetService.getListTimeSheetIds().subscribe((data: any) => {
      this.Timesheets = data;
      this.getTimesheetsFromListId();
    });
  }

  getTimesheetsFromListId() {
    this.timeSheetService.getTimeSheetFromListId(this.Timesheets).subscribe(result => {
      this.listOfTimesheets = result;
    });
  }

  deleteUserFromListUsersId(id: number) {
    this.listOfTimesheets = this.listOfTimesheets.filter(item => item.Id !== id);
  }

  validateMassiveTimesheets(listOfTimesheets: TimeSheet []) {
    this.timeSheetService.validateMassiveTimeSheet(listOfTimesheets).subscribe(() => {
        this.router.navigateByUrl(TimeSheetConstant.TIMESHEET_LIST);
      }
    );
  }

  ngOnDestroy(): void {
    this.listIdSubscription.unsubscribe();
  }
}
