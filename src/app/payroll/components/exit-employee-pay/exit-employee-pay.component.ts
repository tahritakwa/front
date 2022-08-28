import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {ExitEmployeeConstant} from '../../../constant/payroll/exit-employee.constant';
import {ExitEmployeePayServiceService} from '../../services/exit-employee-pay/exit-employee-pay-service.service';
import {State} from '@progress/kendo-data-query';
import {PredicateFormat} from '../../../shared/utils/predicate';
import {GridSettings} from '../../../shared/utils/grid-settings.interface';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {ExitEmployeePayEnumerator} from '../../../models/enumerators/exit-employee-pay-state-enum';
import {AdministrativeDocumentStatusEnumerator} from '../../../models/enumerators/administrative-document-status.enum';
import {ExitEmployeeLeaveService} from '../../services/exit-employee-leave/exit-employee-leave.service';
import {ExitEmployee} from '../../../models/payroll/exit-employee.model';
import {TranslateService} from '@ngx-translate/core';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {DatePipe} from '@angular/common';
import {FileService} from '../../../shared/services/file/file-service.service';
import {ExitEmployeeService} from '../../services/exit-employee/exit-employee.service';
import {DetailsPayExitEmployeeComponent} from '../details-pay-exit-employee/details-pay-exit-employee.component';
import {DetailsLeaveExitEmployeeComponent} from '../details-leave-exit-employee/details-leave-exit-employee.component';

@Component({
  selector: 'app-exit-employee-pay',
  templateUrl: './exit-employee-pay.component.html',
  styleUrls: ['./exit-employee-pay.component.scss']
})
export class ExitEmployeePayComponent implements OnInit {

  @ViewChild('detailsPayExitEmployee') detailsPayExitEmployee: DetailsPayExitEmployeeComponent;
  @ViewChild('detailsLeaveExitEmployee') detailsLeaveExitEmployee: DetailsLeaveExitEmployeeComponent;
  @Input() employeeExit: ExitEmployee;
  public predicate: PredicateFormat = new PredicateFormat();
  exitEmployeePayEnumerator = ExitEmployeePayEnumerator;
  listOfData: any;
  public statusCode = AdministrativeDocumentStatusEnumerator;
  public hideSalaryPayDetails = true;
  public hideLeavebalanceDetails = true;
  datePipe = new DatePipe('en-US');
  public gridState: State = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.TEN,
    // Initial filter descriptor
  };
  public gridSettings: GridSettings = {
    state: this.gridState
  };

  constructor(private router: Router,
              public exitEmployeePayService: ExitEmployeePayServiceService,
              public exitEmployeeLeaveService: ExitEmployeeLeaveService,
              private translate: TranslateService,
              private fileServiceService: FileService, public exitEmployeeService: ExitEmployeeService
  ) {
  }

  ngOnInit() {
  }

  public calculatePayBalance() {
    this.exitEmployeePayService.GeneratePayBalanceForExitEmployee(this.employeeExit.Id).subscribe(() => {
      this.employeeExit.StatePay = this.exitEmployeePayEnumerator.Calculate;
      this.detailsPayExitEmployee.ngOnInit();
    });
  }

  /**
   * recover payslip details for exit employee
   */
  getPaySlipForExitEmployee() {
    this.router.navigateByUrl(ExitEmployeeConstant.URL_DETAILS_PAY_EXIT_EMPLOYEE.concat(this.employeeExit.Id.toString()));
  }

  public calculateLeaveBalance() {
    this.exitEmployeeLeaveService.GenerateLeaveBalanceExitEmployee(this.employeeExit.Id).subscribe(() => {
      this.employeeExit.StateLeave = this.exitEmployeePayEnumerator.Calculate;
      this.detailsLeaveExitEmployee.ngOnInit();
    });
  }

  /**
   * recover leave resume for exit employee
   */
  getLeaveForExitEmployee() {
    this.router.navigateByUrl(ExitEmployeeConstant.URL_DETAILS_LEAVE_EXIT_EMPLOYEE.concat(this.employeeExit.Id.toString()));
  }

  /**
   * download leave resume  report for exit employee
   */
  DownloadLeaveReportForExitEmployee() {
    this.exitEmployeeLeaveService.downloadAllLeaveResume(this.employeeExit.Id).subscribe(
      res => {
        this.fileServiceService.downLoadFile(res.objectData);
      });
  }

  /**
   * Download salary summary report
   */
  public downloadSalarySummary() {
    const params = {
      idExitEmployee: this.employeeExit.Id
    };
    const documentName = this.translate.instant(ExitEmployeeConstant.SALARY_SUMMARY_UPPERCASE)
      .concat(SharedConstant.UNDERSCORE).concat(this.employeeExit.IdEmployeeNavigation.FirstName)
      .concat(SharedConstant.UNDERSCORE).concat(this.employeeExit.IdEmployeeNavigation.LastName);
    const dataToSend = {
      'Id': this.employeeExit.Id,
      'reportName': ExitEmployeeConstant.SALARY_SUMMARY_REPORT_NAME,
      'documentName': documentName,
      'reportFormatName': 'pdf',
      'printCopies': 1,
      'reportType': 'pdf',
      'reportparameters': params
    };
    this.exitEmployeePayService.downloadJasperReport(dataToSend).subscribe(
      res => {
        this.fileServiceService.downLoadFile(res.objectData);
      });
  }

  updateExitEmployee() {
    this.exitEmployeeService.getById(this.employeeExit.Id).subscribe((result) => {
      this.employeeExit = result;
    });
  }
}
