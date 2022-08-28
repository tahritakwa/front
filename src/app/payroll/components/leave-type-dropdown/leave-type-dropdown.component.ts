import {Component, EventEmitter, Input, OnInit, Output, ViewContainerRef} from '@angular/core';
import {DropDownComponent} from '../../../shared/interfaces/drop-down-component.interface';
import {LeaveTypeService} from '../../services/leave-type/leave-type.service';
import {LeaveTypeConstant} from '../../../constant/payroll/leave-type.constant';
import {AddLeaveTypeComponent} from '../../leave-type/add-leave-type/add-leave-type.component';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {FormModalDialogService} from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import {ReducedLeaveType} from '../../../models/payroll/reduced-leave-type.model';
import {isNullOrUndefined} from 'util';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {Filter, Operation, OrderBy, OrderByDirection, PredicateFormat} from '../../../shared/utils/predicate';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';

@Component({
  selector: 'app-leave-type-dropdown',
  templateUrl: './leave-type-dropdown.component.html',
  styleUrls: ['./leave-type-dropdown.component.scss']
})
export class LeaveTypeDropdownComponent implements OnInit, DropDownComponent {
  @Input() group;
  public leaveTypeDataSource: ReducedLeaveType[];
  public leaveTypeFiltredDataSource: ReducedLeaveType[];
  public leaveType: ReducedLeaveType;
  public hasAddPermission = false;
  @Output() Selected = new EventEmitter<any>();
  @Input() InGrid;
  @Input() LeaveBalanceRemainingListByIdEmployee;
  @Input() DaysHoursRemaining;
  @Output() Required = new EventEmitter<any>();
  @Input() leaveTypeExcludedId: number;
  predicate: PredicateFormat;

  constructor(public leaveTypeService: LeaveTypeService, private viewRef: ViewContainerRef,
              private formModalDialogService: FormModalDialogService, private authService: AuthService) {
  }

  ngOnInit() {
    this.initDataSource();
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.ADD_LEAVE);
  }

  preparePredicate() {
    this.predicate = new PredicateFormat();
    if (this.leaveTypeExcludedId) {
      this.predicate.Filter = new Array<Filter>();
      this.predicate.Filter.push(new Filter(SharedConstant.ID, Operation.neq, this.leaveTypeExcludedId));
    }
    this.predicate.OrderBy = new Array<OrderBy>();
    this.predicate.OrderBy.push(new OrderBy(SharedConstant.LABEL, OrderByDirection.asc));
  }

  initDataSource(): void {
    this.preparePredicate();
    if (this.leaveTypeExcludedId) {
      this.leaveTypeService.listdropdownWithPerdicate(this.predicate).subscribe((result: any) => {
        if (Math.abs(this.DaysHoursRemaining) && !isNullOrUndefined(this.LeaveBalanceRemainingListByIdEmployee)
          && this.LeaveBalanceRemainingListByIdEmployee.length !== NumberConstant.ZERO) {
          this.leaveTypeDataSource = result.listData.map(x => {
            return {
              Id: x.Id,
              Code: x.Code,
              Label: x.Label,
              Paid: x.Paid,
              RequiredDocument: x.RequiredDocument,
              MaximumNumberOfDays: this.LeaveBalanceRemainingListByIdEmployee.length !== NumberConstant.ZERO
                ? this.LeaveBalanceRemainingListByIdEmployee.filter(y => y.IdLeaveType === x.Id)[NumberConstant.ZERO] !== null
                  ? this.LeaveBalanceRemainingListByIdEmployee.filter(y => y.IdLeaveType === x.Id)[NumberConstant.ZERO] &&
                  this.LeaveBalanceRemainingListByIdEmployee.filter(y => y.IdLeaveType === x.Id)[NumberConstant.ZERO].RemainingBalanceDay :
                  x.MaximumNumberOfDays : x.MaximumNumberOfDays,
              Description: x.Description
            };
          }).filter((w) => w.MaximumNumberOfDays >= Math.abs(this.DaysHoursRemaining));
        } else {
          this.leaveTypeDataSource = result.listData;
        }
        this.leaveTypeFiltredDataSource = this.leaveTypeDataSource.slice(NumberConstant.ZERO);
      });
    } else {
      this.leaveTypeService.listdropdownWithPerdicate(this.predicate).subscribe((result: any) => {
        this.leaveTypeDataSource = result.listData;
        this.leaveTypeFiltredDataSource = this.leaveTypeDataSource.slice(NumberConstant.ZERO);
      });
    }
  }

  /**
   * filter by code and label
   * @param value
   */
  handleFilter(value: string): void {
    this.leaveTypeDataSource = this.leaveTypeFiltredDataSource.filter((s) => s.Label.toLowerCase().indexOf(value.toLowerCase()) !== -1);
  }

  addNew(): void {
    this.formModalDialogService.openDialog(LeaveTypeConstant.ADD_LEAVE_TYPE, AddLeaveTypeComponent,
      this.viewRef, this.initDataSource.bind(this), true, true, SharedConstant.MODAL_DIALOG_SIZE_L);
  }

  onSelect(event) {
    this.Selected.emit(event);
    const isRequired = event ? this.leaveTypeDataSource.filter(x => x.Id === event)[NumberConstant.ZERO].RequiredDocument : false;
    this.Required.emit(isRequired);
  }
}
