import { Component, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { PagerSettings } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { Subscription } from 'rxjs/Subscription';
import { LeaveTypeConstant } from '../../../constant/payroll/leave-type.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { LeaveType } from '../../../models/payroll/leave-type.model';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { FormModalDialogService } from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { PredicateFormat } from '../../../shared/utils/predicate';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { LeaveTypeService } from '../../services/leave-type/leave-type.service';
import { AddLeaveTypeComponent } from '../add-leave-type/add-leave-type.component';

@Component({
  selector: 'app-list-leave-type',
  templateUrl: './list-leave-type.component.html',
  styleUrls: ['./list-leave-type.component.scss']
})
export class ListLeaveTypeComponent implements OnInit, OnDestroy {
  isModal = false;
  // pager settings
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public predicate: PredicateFormat;
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
      field: LeaveTypeConstant.CODE,
      title: LeaveTypeConstant.CODE_UPPERCASE,
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: LeaveTypeConstant.LABEL,
      title: LeaveTypeConstant.LABEL_UPPERCASE,
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: LeaveTypeConstant.MAXIMIM_NUMBER_OF_DAYS,
      title: LeaveTypeConstant.MAXIMIM_NUMBER_OF_DAYS_UPPERCASE,
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: LeaveTypeConstant.PAID,
      title: LeaveTypeConstant.PAID_UPPERCASE,
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: LeaveTypeConstant.REQUIRED_DOCUMENT,
      title: LeaveTypeConstant.REQUIRED_DOCUMENT_UPPERCASE,
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: LeaveTypeConstant.CALENDAR,
      title: LeaveTypeConstant.CALENDAR_UPPERCASE,
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: LeaveTypeConstant.CUMULABLE,
      title: LeaveTypeConstant.CUMULABLE_UPPERCASE,
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: LeaveTypeConstant.WORKED,
      title: LeaveTypeConstant.WORKED_UPPERCASE,
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    }
  ];

  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };
  public hasAddLeaveTypePermission: boolean;
  public hasDeleteLeaveTypePermission: boolean;
  public hasShowLeaveTypePermission: boolean;
  public hasUpdateLeaveTypePermission: boolean;
  private subscriptions: Subscription[] = [];

  constructor(public leaveTypeService: LeaveTypeService, private swalWarrings: SwalWarring, private router: Router,
              private viewRef: ViewContainerRef, private formModalDialogService: FormModalDialogService,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.hasAddLeaveTypePermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.ADD_LEAVETYPE);
    this.hasDeleteLeaveTypePermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.DELETE_LEAVETYPE);
    this.hasShowLeaveTypePermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.SHOW_LEAVETYPE);
    this.hasUpdateLeaveTypePermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.UPDATE_LEAVETYPE);
    this.initGridDataSource();
  }

  public removeHandler({dataItem}) {
    this.swalWarrings.CreateSwal().then((result) => {
      if (result.value) {
        this.subscriptions.push(this.leaveTypeService.remove(dataItem).subscribe(() => {
          this.initGridDataSource();
        }));
      }
    });
  }

  /**
   * Init grid with data from the datasource
   */
  initGridDataSource() {
    this.subscriptions.push(this.leaveTypeService.reloadServerSideData(this.gridSettings.state, this.predicate)
      .subscribe(data => this.gridSettings.gridData = data));
  }

  /**
   * Reload grid data when data is changed
   * @param state
   */
  public dataStateChange(state: State): void {
    this.gridSettings.state = state;
    this.subscriptions.push(this.leaveTypeService.reloadServerSideData(state, this.predicate)
    .subscribe(data => this.gridSettings.gridData = data));
  }

  /**
   * Edit Bonus
   * @param dataItem
   */
  public editHandler({dataItem}): void {
    this.addNewLeaveType(dataItem);
  }

  public goToAdvancedEdit(id) {
    this.router.navigateByUrl(LeaveTypeConstant.URL_LEAVE_TYPE_EDIT.concat(id));
  }

  /**
   * Add New Bonus : load the add bonus component into a modal
   * @param data
   */
  public addNewLeaveType(leaveType?: LeaveType): void {
    const dataToSend = leaveType ? leaveType : undefined;
    const TITLE = leaveType ? LeaveTypeConstant.UPDATE_LEAVE_TYPE : LeaveTypeConstant.ADD_LEAVE_TYPE;
    this.formModalDialogService.openDialog(TITLE, AddLeaveTypeComponent,
      this.viewRef, this.initGridDataSource.bind(this), dataToSend, true, SharedConstant.MODAL_DIALOG_SIZE_M);
  }

  ngOnDestroy(): void {
    if (this.subscriptions !== undefined) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
  }
}
