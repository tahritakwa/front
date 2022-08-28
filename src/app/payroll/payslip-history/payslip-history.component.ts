import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { PagerSettings } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { Subscription } from 'rxjs/Subscription';
import { ContractConstant } from '../../constant/payroll/Contract.constant';
import { PayslipConstant } from '../../constant/payroll/payslip.constant';
import { SessionConstant } from '../../constant/payroll/session.constant';
import { SharedConstant } from '../../constant/shared/shared.constant';
import { NumberConstant } from '../../constant/utility/number.constant';
import { AuthService } from '../../login/Authentification/services/auth.service';
import { LocalStorageService } from '../../login/Authentification/services/local-storage-service';
import { PayslipStatus } from '../../models/enumerators/payslip-status.enum';
import { Payslip } from '../../models/payroll/payslip.model';
import { FileService } from '../../shared/services/file/file-service.service';
import { ColumnSettings } from '../../shared/utils/column-settings.interface';
import { GridSettings } from '../../shared/utils/grid-settings.interface';
import { Filter, Operation, OrderBy, OrderByDirection, PredicateFormat, Relation } from '../../shared/utils/predicate';
import { PermissionConstant } from '../../Structure/permission-constant';
import { EmployeeService } from '../services/employee/employee.service';
import { PayslipService } from '../services/payslip/payslip.service';

@Component({
  selector: 'app-payslip-history',
  templateUrl: './payslip-history.component.html',
  styleUrls: ['./payslip-history.component.scss']
})
export class PayslipHistoryComponent implements OnInit, OnDestroy {

  payslipFormGroup: FormGroup;
  StartDate = new Date(new Date().getFullYear(), NumberConstant.ZERO, NumberConstant.ONE);
  EndDate = new Date(new Date().getFullYear(), NumberConstant.ELEVEN, NumberConstant.ONE);
  connectedEmployeeId: number;
  showGrid = false;
  showButton = false;
  datePipe = new DatePipe('en-US');
  predicate: PredicateFormat;
  public canUpdatePays = false;
  private subscriptions: Subscription[] = [];
  // pager settings
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  gridState: State = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.TWENTY,
    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: []
    }
  };
  payslipsStatus = PayslipStatus;
  columnsConfig: ColumnSettings[] = [
    {
      field: ContractConstant.CONTRACT_TYPE_NAVIGATION_CODE,
      title: ContractConstant.CONTRACT_TYPE_UPPERCASE,
      filterable: false
    },
    {
      field: PayslipConstant.FULL_NAME_FROM_EMPLOYEE_NAVIGATION,
      title: PayslipConstant.EMPLOYEE,
      filterable: false
    },
    {
      field: PayslipConstant.SESSION_NAME,
      title: PayslipConstant.SESSION_TITLE,
      filterable: false
    },
    {
      field: SharedConstant.START_DATE,
      title: SessionConstant.MONTH_UPPERCASE,
      filterable: false,
    },
    {
      field: PayslipConstant.STATUS,
      title: PayslipConstant.STATUS_UPPERCASE,
      filterable: false
    }
  ];
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };
  public hasListPayslipPermission: boolean;

  constructor(private fb: FormBuilder, private payslipService: PayslipService,
              public authService: AuthService, private localStorageService: LocalStorageService, public employeeService: EmployeeService,
      private translate: TranslateService, private fileServiceService: FileService) {
  }

  ngOnInit() {
    this.hasListPayslipPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.LIST_PAYSLIPHISTORY);
    this.employeeService.getConnectedEmployee().subscribe(connectedEmployee =>{
      this.connectedEmployeeId = connectedEmployee.Id;
    });
    this.createAddForm();
    this.preparePredicate();
  }

  preparePredicate(): void {
    this.predicate = new PredicateFormat();
    this.predicate.Filter = new Array<Filter>();
    this.predicate.Relation = new Array<Relation>();
    this.predicate.OrderBy = new Array<OrderBy>();
    this.predicate.Filter.push(new Filter(SharedConstant.ID_EMPLOYEE, Operation.eq, this.connectedEmployeeId));
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(PayslipConstant.EMPLOYEE_NAVIGATION)]);
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(PayslipConstant.CONTRACT_NAVIGATION)]);
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(PayslipConstant.CONTRACT_TYPE_NAVIGATION)]);
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(PayslipConstant.SESSION_NAVIGATION)]);
    this.predicate.OrderBy.push(new OrderBy(SharedConstant.START_DATE, OrderByDirection.asc));
  }

  initGridDataSource(predicate?: PredicateFormat) {
    this.predicate = predicate ? predicate : this.predicate;
    this.subscriptions.push(this.payslipService.getPayslipHistory(this.gridSettings.state, this.predicate, this.StartDate, this.EndDate).subscribe(result => {
      this.gridSettings.gridData = result;
      if (result.total > NumberConstant.ZERO) {
        this.showButton = true;
      } else {
        this.showButton = false;
      }
    }));
  }

  /**
   * Reload grid data when data is changed
   * @param state
   */
  dataStateChange(state: State): void {
    this.gridSettings.state = state;
    this.prepareEmployeeFilter(this.connectedEmployeeId);
    this.initGridDataSource();
  }

  /**
   * set the endDate value to the startDate if the startDate > endDate
   * @param selectedDate
   */
  public startDateValueChange(selectedDate: Date) {
    if (selectedDate) {
      if (selectedDate > this.EndDate) {
        this.EndDate = selectedDate;
      }
    }
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.initGridDataSource();
  }

  /**
   * set the startDate value to the endDate if the endDate < startDate
   * @param selectedDate
   */
  public endDateValueChange(selectedDate: Date) {
    if (selectedDate) {
      if (selectedDate < this.StartDate) {
        this.StartDate = selectedDate;
      }
    }
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.initGridDataSource();
  }

  // Get the id of the selected employee
  onSelect(event) {
    this.showGrid = false;
    this.connectedEmployeeId = this.payslipFormGroup.get(SharedConstant.ID_EMPLOYEE).value;
    this.prepareEmployeeFilter(this.connectedEmployeeId);
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.initGridDataSource();
  }

  prepareEmployeeFilter(employeeId: number) {
    this.predicate.Filter = new Array<Filter>();
    if (employeeId === undefined) {
      this.connectedEmployeeId = this.connectedEmployeeId;
      this.payslipFormGroup.controls[SharedConstant.ID_EMPLOYEE].setValue(this.connectedEmployeeId);
    }
    this.predicate.Filter.push(new Filter(SharedConstant.ID_EMPLOYEE, Operation.eq, this.connectedEmployeeId));
  }

  // Show grid
  onShowGrid() {
    this.initGridDataSource();
    this.showGrid = true;
  }

  /**
   * Prepare payslip report parameters
   * @param id
   */
  public downloadPayslip(dataItem: Payslip): void {
    const params = {
      idPayslip: dataItem.Id
    };
    const documentName = this.translate.instant(PayslipConstant.PAYSLIP_UPPERCASE)
      .concat(SharedConstant.UNDERSCORE).concat(dataItem.IdEmployeeNavigation.FirstName)
      .concat(SharedConstant.UNDERSCORE).concat(dataItem.IdEmployeeNavigation.LastName)
      .concat(SharedConstant.UNDERSCORE).concat(this.translate.instant(this.datePipe.transform(new Date(dataItem.Month), 'MMMM').toUpperCase()))
      .concat(SharedConstant.UNDERSCORE).concat(this.datePipe.transform(new Date(dataItem.Month), 'yyyy'));
    const dataToSend = {
      'Id': dataItem.Id,
      'reportName': PayslipConstant.PAYSLIP_REPORT_NAME,
      'documentName': documentName,
      'reportFormatName': 'pdf',
      'printCopies': 1,
      'reportType': 'pdf',
      'reportparameters': params
    };
    this.subscriptions.push(this.payslipService.downloadJasperReport(dataToSend).subscribe(
      res => {
        this.fileServiceService.downLoadFile(res.objectData);
      }));
  }

  public downloadAllPayslip(): void {
    this.subscriptions.push(this.payslipService.downloadAllPayslipOfSelectedEmployee(this.gridSettings.state, this.predicate,
      this.StartDate, this.EndDate).subscribe(data => {
      this.fileServiceService.downLoadFile(data.objectData);
    }));
  }

  ngOnDestroy(): void {
    if (this.subscriptions !== undefined) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
  }

  private createAddForm() {
    this.payslipFormGroup = this.fb.group({
      IdEmployee: [NumberConstant.ZERO, [Validators.required]]
    });
    this.payslipFormGroup.controls[SharedConstant.ID_EMPLOYEE].setValue(this.connectedEmployeeId);
  }
}
