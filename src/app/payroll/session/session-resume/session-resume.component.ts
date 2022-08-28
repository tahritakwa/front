import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormGroup} from '@angular/forms';
import {Session} from '../../../models/payroll/session.model';
import {SessionService} from '../../services/session/session.service';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {SessionConstant} from '../../../constant/payroll/session.constant';
import {ColumnSettings} from '../../../shared/utils/column-settings.interface';
import {EmployeeConstant} from '../../../constant/payroll/employee.constant';
import {ContractConstant} from '../../../constant/payroll/Contract.constant';
import {AttendanceConstant} from '../../../constant/payroll/attendance.constant';
import {GridSettings} from '../../../shared/utils/grid-settings.interface';
import {DataResult, State} from '@progress/kendo-data-query';
import {TranslateService} from '@ngx-translate/core';
import {DatePipe} from '@angular/common';
import {FileService} from '../../../shared/services/file/file-service.service';
import {PredicateFormat} from '../../../shared/utils/predicate';
import {DataStateChangeEvent, PagerSettings} from '@progress/kendo-angular-grid';
import {SessionResumeFilter} from '../../../models/payroll/session-resume-filter.model';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {PermissionConstant} from '../../../Structure/permission-constant';
import {Subscription} from 'rxjs/Subscription';
import { AuthService } from '../../../login/Authentification/services/auth.service';

const PREVIOUS_URL = 'main/payroll/session/payslip/';
const LOGIC_AND = 'and';

@Component({
  selector: 'app-session-resume',
  templateUrl: './session-resume.component.html',
  styleUrls: ['./session-resume.component.scss']
})

export class SessionResumeComponent implements OnInit, OnDestroy {
  public idSession: number;
  public gridHeight = 550;
  sessionInfos: Session = new Session();
  sessionFormGroup: FormGroup;
  datePipe = new DatePipe('en-US');
  columns: Array<string>;
  resume: any[][];
  total: any[][];
  columnsTitles: Array<string> = [];
  public colorPalette = ['rgba(221, 221, 229, 0.25)', '#f0f3f552'];
  public predicate: PredicateFormat;
  sessionResumeFilter: SessionResumeFilter;
  selectedEmployees: any[] = [];  // grid setting
  gridData: DataResult;
  // grid settings
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;

  public gridState: State = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.TWENTY,
    // Initial filter descriptor
    filter: {
      logic: LOGIC_AND,
      filters: []
    }
  };

  public columnsConfig: any[] = [];

  public generiqueColumnConfig: ColumnSettings[] = [
    {
      field: SessionConstant.RESUME_EMPLOYEE_REGISTRATION_NUMBER,
      title: EmployeeConstant.REGISTRATION_NUMBER_UPPERCASE,
      _width: NumberConstant.ONE_HUNDRED,
      locked: true,
      filterable: true
    },
    {
      field: SessionConstant.RESUME_EMPLOYEE_EMPLOYEE_FULL_NAME,
      title: EmployeeConstant.EMPLOYEE_FULL_NAME_UPPERCASE,
      _width: NumberConstant.TWO_HUNDRED_FIFTY,
      locked: true,
      filterable: true
    },
    {
      field: SessionConstant.RESUME_EMPLOYEE_CONTRACT_TYPE,
      title: ContractConstant.CONTRACT_TYPE_UPPERCASE,
      _width: NumberConstant.ONE_HUNDRED_FIFTY,
      filterable: true
    },
    {
      field: SessionConstant.RESUME_EMPLOYEE_NUMBER_DAYS_WORKED,
      title: AttendanceConstant.NUMBER_DAYS_WORKED_UPPERCASE,
      _width: NumberConstant.ONE_HUNDRED_FIFTY,
      filterable: true
    },
    {
      field: SessionConstant.RESUME_EMPLOYEE_NUMBER_DAYS_PAID_LEAVE,
      title: AttendanceConstant.NUMBER_DAYS_PAID_LEAVE_UPPERCASE,
      _width: NumberConstant.ONE_HUNDRED_FIFTY,
      filterable: true
    }
  ];

  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };
  private subscriptions: Subscription[]= [];

  public hasPrintPayrollResumePermission: boolean;
  /**
   * Constructor
   * @param router
   * @param activatedRoute
   * @param sessionService
   * @param salaryRuleService
   */
  constructor(private router: Router, private activatedRoute: ActivatedRoute,
              private sessionService: SessionService, private translate: TranslateService,
              private fileServiceService: FileService, public authService: AuthService) {
    this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
      this.idSession = +params[SharedConstant.ID_LOWERCASE] || NumberConstant.ZERO;
    }));
  }

  /**
   * Ng on Init
   */
  ngOnInit() {
    this.hasPrintPayrollResumePermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.PRINT_PAYROLL_RESUME);
    this.getAvailableSalaryRules();
    this.subscriptions.push(this.sessionService.getById(this.idSession).subscribe(data => {
      this.sessionInfos = data;
      this.sessionInfos.Month = new Date(data.Month);
    }));
  }

  preparePredicate() {
    this.predicate = new PredicateFormat();
    this.sessionService.prepareServerOptions(this.gridState, this.predicate);
    this.sessionResumeFilter = new SessionResumeFilter();
    this.sessionResumeFilter.Page = this.predicate.page;
    this.sessionResumeFilter.PageSize = this.predicate.pageSize;
    this.sessionResumeFilter.IdSession = this.idSession;
    this.sessionResumeFilter.EmployeesId = this.selectedEmployees;
  }

  /**
   * Got to previous state of session
   */
  public onPreviousClik(): void {
    this.router.navigateByUrl(PREVIOUS_URL.concat(this.idSession.toString()));
  }

  /**
   * Print the session resume in modal
   */
  public onPrintSessionResume() {
    const params = {
      idSession: this.idSession
    };
    const documentName = this.translate.instant(SessionConstant.SESSION_RESUME_UPPERCASE.toUpperCase())
      .concat(SharedConstant.UNDERSCORE)
      .concat(this.sessionInfos.Title)
      .concat(SharedConstant.UNDERSCORE)
      .concat(this.translate.instant(this.datePipe.transform(new Date(this.sessionInfos.Month), 'MMMM').toUpperCase()))
      .concat(SharedConstant.UNDERSCORE)
      .concat(this.datePipe.transform(new Date(this.sessionInfos.Month), 'yyyy'));
    const dataToSend = {
      'Id': this.idSession,
      'reportName': SessionConstant.SESSION_RESUME_REPORT_NAME,
      'documentName': documentName,
      'reportFormatName': 'pdf',
      'printCopies': 1,
      'reportType': 'pdf',
      'reportparameters': params
    };
    this.subscriptions.push(this.sessionService.downloadJasperReport(dataToSend).subscribe(
      res => {
        this.fileServiceService.downLoadFile(res.objectData);
      }));
  }

  public getColor(i): string {
    if ((i % 2) === 0) {
      return this.colorPalette[0];
    } else {
      return this.colorPalette[1];
    }
  }

  getResume() {
    this.preparePredicate();
    this.subscriptions.push(this.sessionService.getSessionResumeLines(this.sessionResumeFilter).subscribe((res: DataResult) => {
      this.gridData = res;
      this.gridData.data = res.data;
      this.gridData.total = res.total;
    }));
  }

  /**
   * Data changed listener
   * @param state
   */
  public dataStateChange(state: DataStateChangeEvent): void {
    this.gridState = state;
    this.getResume();
  }

  /**
   * When user choose a specific employees
   * @param $event
   */
  employeeSelected($event) {
    this.selectedEmployees = $event.selectedValueMultiSelect;
    this.gridState.skip = NumberConstant.ZERO,
      this.gridState.take = NumberConstant.TWENTY;
    this.getResume();
  }

  ngOnDestroy(): void {
    if (this.subscriptions !== undefined) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
  }

  private getAvailableSalaryRules() {
    this.subscriptions.push(this.sessionService.getAvailableSalaryRules(this.idSession).subscribe(res => {
      res.forEach(element => {
        this.columnsConfig.push(
          {
            field: 'Resume.' + element.Id,
            _width: 200,
            selector: element.Id,
            title: element.IdRuleUniqueReferenceNavigation.Reference,
            filterable: true,
          }
        );
      });
      this.getResume();
    }));
  }

}
