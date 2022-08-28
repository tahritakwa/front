import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Leave } from '../../../models/payroll/leave.model';
import { FormGroup } from '@angular/forms';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { State } from '@progress/kendo-data-query';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { LeaveRequestConstant } from '../../../constant/payroll/leave.constant';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-leave-balance-detail',
  templateUrl: './leave-balance-detail.component.html',
  styleUrls: ['./leave-balance-detail.component.scss']
})
export class LeaveBalanceDetailComponent implements OnInit, OnChanges {
  @Input()
  group: FormGroup;
  @Input()
  leave: Leave;
  lastYearExpirationDate: Date;
  currentYearExpirationDate: Date;
  public currentYear = new Date().getFullYear();
  public lastYear = new Date().getFullYear() - NumberConstant.ONE;
  /**
   * Format Date
   */
  public formatDate: string = this.translate.instant(SharedConstant.DATE_FORMAT);
  public gridState: State = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.TWENTY,
    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: []
    }
  };
  public columnsConfig: ColumnSettings[] = [
    {
      field: LeaveRequestConstant.TITLE,
      title: LeaveRequestConstant.LEAVE_BALANCE,
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: LeaveRequestConstant.DUREE,
      title: LeaveRequestConstant.DURATION,
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: LeaveRequestConstant.DETAILS_UPPER,
      title: LeaveRequestConstant.PREVIOUS_YEAR_LEAVE_BALANCE,
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: LeaveRequestConstant.DETAILS_UPPER,
      title: LeaveRequestConstant.CURRENT_YEAR_LEAVE_BALANCE,
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED
    }
  ];
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };

  constructor(private translate: TranslateService) {}

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['leave'] && this.leave) {
      if (this.leave.IdLeaveTypeNavigation && this.leave.IdLeaveTypeNavigation.ExpiryDate) {
        const expirationDate = new Date(this.leave.IdLeaveTypeNavigation.ExpiryDate);
        this.lastYearExpirationDate = new Date(this.currentYear, expirationDate.getMonth(), expirationDate.getDate());
        this.currentYearExpirationDate = new Date(this.currentYear + NumberConstant.ONE,
          expirationDate.getMonth(), expirationDate.getDate());
      }
      this.gridSettings.gridData = {
        total: NumberConstant.ZERO,
        data: [
          {
            Title: LeaveRequestConstant.COMMENT_FOR_LEAVE_REQUEST_ADD,
            Data: this.leave.NumberDaysLeave,
            PreviousYearDetails: '',
            CurrentYearDetails: ''
          },
          {
            Title: LeaveRequestConstant.TOTAL_LEAVE_BALANCE_ACQUIRED,
            Data: this.leave.TotalLeaveBalanceAcquired,
            PreviousYearDetails: '',
            CurrentYearDetails: ''
          },
          {
            Title: LeaveRequestConstant.COMMENT_LEAVE_BALANCE,
            Data: this.leave.CurrentBalance,
            PreviousYearDetails: this.leave.PreviousYearLeaveAcquired,
            CurrentYearDetails: this.leave.CurrentYearLeaveAcquired
          },
          {
            Title: LeaveRequestConstant.COMMENT_NEW_LEAVE_BALANCE,
            Data: this.leave.LeaveBalanceRemaining,
            PreviousYearDetails: this.leave.PreviousYearLeaveRemaining,
            CurrentYearDetails: this.leave.CurrentYearLeaveRemaining
          }
        ]
      };
    }
  }
}
