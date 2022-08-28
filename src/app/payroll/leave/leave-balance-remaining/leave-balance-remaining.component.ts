import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { DataStateChangeEvent, PagerSettings } from '@progress/kendo-angular-grid';
import { DataResult, DataSourceRequestState, SortDescriptor, State } from '@progress/kendo-data-query';
import { Subscription } from 'rxjs/Subscription';
import swal from 'sweetalert2';
import { isNullOrUndefined } from 'util';
import { LeaveBalanceRemainingConstant } from '../../../constant/payroll/leave-balance-remaining.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { ProgressBarState } from '../../../models/enumerators/progress-bar-state.enum';
import { LeaveBalanceRemainingFilter } from '../../../models/payroll/LeaveBalanceRemainingFilter';
import { ProgressBar } from '../../../models/payroll/progress-bar.model';
import { ProgressService } from '../../../shared/services/signalr/progress/progress.service';
import { DataTransferShowSpinnerService } from '../../../shared/services/spinner/data-transfer-show-spinner.service';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { OrderBy, PredicateFormat } from '../../../shared/utils/predicate';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { LeaveBalanceRemainingService } from '../../services/leave-balance-remaining/leave-balance-remaining.service';
import { LeaveTypeService } from '../../services/leave-type/leave-type.service';
import { LeaveService } from '../../services/leave/leave.service';

@Component({
  selector: 'app-leave-balance-remaining',
  templateUrl: './leave-balance-remaining.component.html',
  styleUrls: ['./leave-balance-remaining.component.scss']
})
export class LeaveBalanceRemainingComponent implements OnInit, OnDestroy {
  public predicate: PredicateFormat;
  // pager settings
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
//  Grid columns
  leaveBalanceRemainingFilter: LeaveBalanceRemainingFilter;
// grid setting
  gridData: DataResult;
  public gridState: DataSourceRequestState;
  public hasSendLeaveBalanceRemainingPermission = false;
  public hasCalculatePermission = false;
  public generiqueColumnConfig = [
    {
      field: LeaveBalanceRemainingConstant.LEAVE_TYPE_NAME,
      title: LeaveBalanceRemainingConstant.LEAVE_TYPE,
      _width: 200,
      filterable: true
    },
    {
      field: LeaveBalanceRemainingConstant.EMPLOYEE_FULL_NAME,
      title: LeaveBalanceRemainingConstant.EMPLOYEE,
      _width: 250,
      filterable: true,
    }
  ];
  public columnsTypeLeaveConfig: any[] = [];
  public columnsConfig: ColumnSettings[] = [
    {
      field: LeaveBalanceRemainingConstant.CUMULATIVE_ACQUIRED,
      title: LeaveBalanceRemainingConstant.CUMULATIVE_ACQUIRED_SHORT,
      tooltip: LeaveBalanceRemainingConstant.CUMULATIVE_ACQUIRED_TITLE,
      _width: 150,
      filterable: true
    },
    {
      field: LeaveBalanceRemainingConstant.CUMULATIVE_TAKEN,
      title: LeaveBalanceRemainingConstant.CUMULATIVE_TAKEN_TITLE_SHORT,
      tooltip: LeaveBalanceRemainingConstant.CUMULATIVE_TAKEN_TITLE,
      _width: 150,
      filterable: true
    },
    {
      field: LeaveBalanceRemainingConstant.REMAINING_BALANCE,
      title: LeaveBalanceRemainingConstant.REMAINING_BALANCE_UPPER_SHORT,
      tooltip: LeaveBalanceRemainingConstant.REMAINING_BALANCE_UPPER,
      _width: 150,
      filterable: true
    }
  ];

  // Leave type in grid
  leaveType: number;
  // Get status from column filter
  statusSearchDropdownFormGroup: FormGroup;
  selectedEmployees: any[] = [];
  selectedLeaveType = NumberConstant.ZERO;
  progression: ProgressBar;
  public showProgress = false;
  subscription: Subscription;
  public gridSettings: GridSettings = {
    state: this.initializeState(),
    columnsConfig: this.columnsConfig,
  };
  public sort: SortDescriptor[] = [{
    field: '',
    dir: 'asc'
  }];
  private subscriptions: Subscription[] = [];

  constructor(public leaveBalanceRemainingService: LeaveBalanceRemainingService, private leaveTypeService: LeaveTypeService,
              private fb: FormBuilder, public authService: AuthService,
              private dataTransferShowSpinnerService: DataTransferShowSpinnerService,
              private progressService: ProgressService, private leaveService: LeaveService, private translate: TranslateService) {
  }

  public initializeState(): State {
    return {
      skip: NumberConstant.ZERO,
      take: NumberConstant.TWENTY,
      filter: { // Initial filter descriptor
        logic: 'and',
        filters: []
      }
    };
  }

  ngOnInit() {
    this.hasSendLeaveBalanceRemainingPermission =
      this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.SEND_LEAVE_REMAINING_BALANCE);
    this.hasCalculatePermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.CALCULATE_LEAVE_REMAINING_BALANCE);
    this.progression = new ProgressBar();
    this.progressService.initLeaveBalanceRemainingProgressHubConnection();
    this.progressService.registerOnLeaveBalanceRemainingProgressBarProgressionEvent();
    this.createStatusSearchDropdownForm();
    this.gridState = this.initializeState();
    this.getColumnName();
    this.getLeaveBalance();
    this.subscription = this.progressService.leaveBalanceRemainingProgressionSubject.subscribe((data: ProgressBar) => {
      if (data != null) {
        this.progression = data;
        this.showProgress = this.progression != null ? true : false;
        if (this.progression.State === ProgressBarState.Completed) {
          this.getColumnName();
          this.getLeaveBalance();
          setTimeout(() => {
            this.showProgress = false;
          }, 500);
          this.progressService.destroyLeaveBalanceRemainingProgressHubConnection();
        }
      }
    });
  }

  /**
   * When user choose a specific employees
   * @param $event
   */
  employeeSelected($event) {
    this.selectedEmployees = $event.selectedValueMultiSelect;
    this.gridState = this.initializeState();
    this.getLeaveBalance();
  }

  /**
   * When user choose a specific type Leave
   * @param $event
   */
  leaveTypeSelected($event) {
    this.selectedLeaveType = $event;
    this.gridState = this.initializeState();
    this.getLeaveBalance();
    this.getColumnName(this.selectedLeaveType);
  }

  getColumnName(selectedValue?: any) {
    this.predicate = new PredicateFormat();
    this.predicate.OrderBy = new Array<OrderBy>();
    this.subscriptions.push(this.leaveTypeService.readPredicateData(this.predicate)
      .subscribe(res => {
        if (res && res.length > NumberConstant.ZERO) {
          this.columnsTypeLeaveConfig = [];
          let index = -NumberConstant.ONE;
          if (!isNullOrUndefined(selectedValue)) {
            res = res.filter(c => c.Id === selectedValue);
          }
          res.forEach(element => {
            this.columnsTypeLeaveConfig.push(
              {
                field: element.Id,
                key: isNullOrUndefined(selectedValue) ? index = index + NumberConstant.ONE : NumberConstant.ZERO,
                _width: 90,
                title: element.Label,
                filterable: true,
              }
            );
          });
          this.getLeaveBalance();
        }
      }));
  }

  getLeaveBalance() {
    this.preparePredicate();
    this.subscriptions.push(
      this.leaveBalanceRemainingService.getleaveBalanceRemaining(this.leaveBalanceRemainingFilter).subscribe((res: DataResult) => {
        this.gridSettings.gridData = res;
        if (this.gridSettings.gridData.data[NumberConstant.ZERO].leaveBalanceRemainingList.length > NumberConstant.ZERO) {
          const idsLeaveType = [];
          this.gridSettings.gridData.data[NumberConstant.ZERO].leaveBalanceRemainingList.forEach(l => {
            idsLeaveType.push(l.IdLeaveType);
          });
          this.columnsTypeLeaveConfig = this.columnsTypeLeaveConfig.filter(c => idsLeaveType.includes(c.field));
          for (let i = NumberConstant.ZERO; i < this.columnsTypeLeaveConfig.length; i++) {
            this.columnsTypeLeaveConfig[i].key = i;
          }
        }
        const state = this.initializeState();
        state.skip = 0;
        state.take = this.gridState.take;
        state.filter = this.gridState.filter;
        state.sort = this.gridState.sort;
      }));
  }

  /**
   * prepare Predicate
   * */
  preparePredicate() {
    this.predicate = new PredicateFormat();
    this.leaveBalanceRemainingService.prepareServerOptions(this.gridState, this.predicate);
    this.leaveBalanceRemainingFilter = new LeaveBalanceRemainingFilter();
    this.leaveBalanceRemainingFilter.Page = this.predicate.page;
    this.leaveBalanceRemainingFilter.PageSize = this.predicate.pageSize;
    this.leaveBalanceRemainingFilter.EmployeesId = this.selectedEmployees;
    this.leaveBalanceRemainingFilter.LeaveTypeId = this.selectedLeaveType;

  }

  /**
   * Data changed listener
   * @param state
   */
  public dataStateChange(state: DataStateChangeEvent): void {
    this.gridState = state;
    this.getLeaveBalance();

  }

  public async calculateLeaveBalanceRemaining(): Promise<void> {
    this.preparePredicate();
    this.progression.Progression = NumberConstant.ZERO;
    this.showProgress = true;
    this.dataTransferShowSpinnerService.setShowSpinnerValue(this.showProgress);
    await this.leaveBalanceRemainingService.calculateLeaveBalanceRemaining(this.leaveBalanceRemainingFilter).toPromise();
  }

  ngOnDestroy(): void {
    this.progressService.destroyLeaveBalanceRemainingProgressHubConnection();
    if (this.subscriptions !== undefined) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
  }

  /**
   * Send leave balance remaining email to all employees
   */
  public sendEmailToAllEmployees() {
    this.subscriptions.push(this.leaveService.sendEmailToAllEmployees(this.leaveBalanceRemainingFilter).subscribe(res => {
      const message = this.translate.instant(LeaveBalanceRemainingConstant.SUCCESSFUL_SENDING);
      // swal({
      //   type: 'success',
      //   html: message,
      //   confirmButtonColor: '#4c9aae'
      // });
    }));
  }

  private createStatusSearchDropdownForm(): void {
    this.statusSearchDropdownFormGroup = this.fb.group({
      Status: '',
      IdLeaveType: [NumberConstant.ZERO]
    });
  }

}
