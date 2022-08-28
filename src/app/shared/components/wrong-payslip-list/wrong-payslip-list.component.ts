import { Component, ComponentRef, OnInit } from '@angular/core';
import { PagerSettings } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';
import { PayslipConstant } from '../../../constant/payroll/payslip.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { PayslipStatus } from '../../../models/enumerators/payslip-status.enum';
import { ColumnSettings } from '../../utils/column-settings.interface';
import { GridSettings } from '../../utils/grid-settings.interface';
import { process } from '@progress/kendo-data-query';
import { ModalDialogInstanceService } from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import { WrongPayslipActionEnumerator } from '../../../models/enumerators/wrong-payslip-action.enum';
import { TimeSheetConstant } from '../../../constant/rh/timesheet.constant';
import { TimeSheetStatusEnumerator } from '../../../models/enumerators/timeSheet-status-enumerator.enum';
import { documentStatusCode } from '../../../models/enumerators/document.enum';

@Component({
  selector: 'app-wrong-payslip-list',
  templateUrl: './wrong-payslip-list.component.html',
  styleUrls: ['./wrong-payslip-list.component.scss']
})
export class WrongPayslipListComponent implements OnInit {

  dialogOptions: Partial<IModalDialogOptions<any>>;
  wrongPayslips;
  wrongTimeSheets;
  public payslipsStatus = PayslipStatus;
  public timeSheetStatus = TimeSheetStatusEnumerator;
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public actionEnum = WrongPayslipActionEnumerator;
  public statusCodeDocument = documentStatusCode;
  showEmployee = false;
  public gridState: State = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.TWENTY,
    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: []
    }
  };
  public timeSheetsGridState: State = {
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
      field: PayslipConstant.SESSION_NAME,
      title: PayslipConstant.SESSION_TITLE,
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: PayslipConstant.SESSION_CODE,
      title: SharedConstant.CODE_UPPERCASE,
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: PayslipConstant.SESSION_MONTH,
      title: SharedConstant.MONTH_UPPERCASE,
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: PayslipConstant.STATUS,
      title: PayslipConstant.PAYSLIP_STATE_TITLE,
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: PayslipConstant.FULL_NAME_FROM_EMPLOYEE_NAVIGATION,
      title: PayslipConstant.EMPLOYEE,
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED
    }
  ];

  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };

  public timeSheetsColumnsConfig: ColumnSettings[] = [
    {
      field: TimeSheetConstant.MONTH,
      title: SharedConstant.MONTH_UPPERCASE,
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: TimeSheetConstant.STATUS,
      title: SharedConstant.STATE_UPPERCASE,
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: PayslipConstant.FULL_NAME_FROM_EMPLOYEE_NAVIGATION,
      title: PayslipConstant.EMPLOYEE,
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: TimeSheetConstant.ASSOCIATED_INVOICES,
      title: TimeSheetConstant.ASSOCIATED_INVOICES,
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED
    }
  ];

  public timeSheetsGridSettings: GridSettings = {
    state: this.timeSheetsGridState,
    columnsConfig: this.timeSheetsColumnsConfig,
  };
  constructor(private modalService: ModalDialogInstanceService) { }

  ngOnInit() {
    if (this.wrongPayslips) {
      this.gridSettings.gridData = this.wrongPayslips;
      this.gridSettings.gridData.data = this.wrongPayslips.slice(this.gridState.skip, this.gridState.take);
      this.gridSettings.gridData.total = this.wrongPayslips.length;
    }
    if (this.wrongTimeSheets) {
    this.timeSheetsGridSettings.gridData = this.wrongTimeSheets;
    this.timeSheetsGridSettings.gridData.data = this.wrongTimeSheets.slice(this.timeSheetsGridState.skip, this.timeSheetsGridState.take);
    this.timeSheetsGridSettings.gridData.total = this.wrongTimeSheets.length;
    }
  }

  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.dialogOptions = options;
    if (this.dialogOptions.data.Payslip || this.dialogOptions.data.TimeSheet) {
      this.wrongPayslips = this.dialogOptions.data.Payslip;
      this.wrongTimeSheets = this.dialogOptions.data.TimeSheet;
      this.showEmployee = this.wrongPayslips.length > NumberConstant.ZERO && this.wrongPayslips[NumberConstant.ZERO].IdEmployeeNavigation ? true : false ||
        this.wrongTimeSheets.length > NumberConstant.ZERO && this.wrongTimeSheets[NumberConstant.ZERO].IdEmployeeNavigation ? true : false ;
    } else {
      this.wrongPayslips = this.dialogOptions.data;
      this.showEmployee = true;
    }
  }

  public dataStateChange(state: State): void {
    this.gridSettings.state = state;
    const result  = process(this.wrongPayslips, this.gridSettings.state);
    if (result) {
      this.gridSettings.gridData.data = result.data;
    }
  }

  public timeSheetsdataStateChange(state: State): void {
    this.timeSheetsGridSettings.state = state;
    const result  = process(this.wrongTimeSheets, this.timeSheetsGridSettings.state);
    if (result) {
      this.timeSheetsGridSettings.gridData.data = result.data;
    }
  }
  save(action: any) {
    this.dialogOptions.data = action;
    this.dialogOptions.onClose();
    this.dialogOptions.closeDialogSubject.next();
  }
}
