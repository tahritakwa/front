import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PagerSettings } from '@progress/kendo-angular-grid';
import { FilterDescriptor, State } from '@progress/kendo-data-query';
import { Subscription } from 'rxjs/Subscription';
import swal from 'sweetalert2';
import { AttendanceConstant } from '../../../constant/payroll/attendance.constant';
import { ContractConstant } from '../../../constant/payroll/Contract.constant';
import { EmployeeConstant } from '../../../constant/payroll/employee.constant';
import { PayslipConstant } from '../../../constant/payroll/payslip.constant';
import { SessionConstant } from '../../../constant/payroll/session.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PayslipStatus } from '../../../models/enumerators/payslip-status.enum';
import { ProgressBarState } from '../../../models/enumerators/progress-bar-state.enum';
import { PayrollSessionState } from '../../../models/enumerators/session-state.enum';
import { Payslip } from '../../../models/payroll/payslip.model';
import { ProgressBar } from '../../../models/payroll/progress-bar.model';
import { Session } from '../../../models/payroll/session.model';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { FileService } from '../../../shared/services/file/file-service.service';
import { ProgressService } from '../../../shared/services/signalr/progress/progress.service';
import { DataTransferShowSpinnerService } from '../../../shared/services/spinner/data-transfer-show-spinner.service';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { Filter, Operation, OrderBy, OrderByDirection, PredicateFormat, Relation } from '../../../shared/utils/predicate';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { PayslipService } from '../../services/payslip/payslip.service';
import { SessionService } from '../../services/session/session.service';

const MAIN = '/main';

@Component({
  selector: 'app-list-payslip',
  templateUrl: './list-payslip.component.html',
  styleUrls: ['./list-payslip.component.scss']
})

export class ListPayslipComponent implements OnInit, OnDestroy {
  public idSession: number;
  // pager settings
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public showGrid: boolean;
  public showProgress = false;
  public gridData: any[];
  public TypeFormGroup = undefined;
  public counter = 0;
  sessionInfos: Session = new Session();
  datePipe = new DatePipe('en-US');
  public sessionFormGroup: FormGroup;
  progression: ProgressBar;
  public isClosed = false;
  public canUpdatePays = false;
  public predicate: PredicateFormat;
  statusSearchDropdownFormGroup: FormGroup;
  public gridState: State = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.TWENTY,
    // Initial filter descriptor
    filter: {
      logic: SharedConstant.LOGIC_AND,
      filters: []
    }
  };
  // Progress subscription
  subscription: Subscription;
  public payslipsStatus = PayslipStatus;
  status: number;
  public columnsConfig: ColumnSettings[] = [
    {
      field: PayslipConstant.REGISTRATION_NUMBER_FROM_EMPLOYEE_NAVIGATION,
      title: EmployeeConstant.REGISTRATION_NUMBER,
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: PayslipConstant.FULL_NAME_FROM_EMPLOYEE_NAVIGATION,
      title: EmployeeConstant.EMPLOYEE,
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: ContractConstant.CONTRACT_TYPE_NAVIGATION_CODE,
      title: ContractConstant.CONTRACT_TYPE_UPPERCASE,
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: PayslipConstant.STATUS,
      title: PayslipConstant.STATUS_UPPERCASE,
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    }
  ];
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };

  public hasCloseSessionPermission: boolean;
  public hasRegeneratePayslipPermission: boolean;
  public hasBroadcastPayslipPermission: boolean;
  public hasGeneratePayslipPermission: boolean;
  public hasPrintPayslipPermission: boolean;
  private subscriptions: Subscription[] = [];
  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private translate: TranslateService,
              private sessionService: SessionService,
              private payslipService: PayslipService,
              public http: HttpClient,
              private swalWarrings: SwalWarring,
              private progressService: ProgressService,
              private fileServiceService: FileService,
              public authService: AuthService,
              private dataTransferShowSpinnerService: DataTransferShowSpinnerService,
              private fb: FormBuilder) {
    this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
      this.idSession = params[SharedConstant.ID_LOWERCASE] || 0;
    }));
  }

  ngOnInit() {
    this.hasCloseSessionPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.CLOSE_PAYSLIPSESSION);
    this.hasRegeneratePayslipPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.REGENERATE_PAYSLIP);
    this.hasBroadcastPayslipPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.BROADCAST_PAYSLIP);
    this.hasGeneratePayslipPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.GENERATE_PAYSLIP);
    this.hasPrintPayslipPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.PRINT_PAYSLIP);
    this.progression = new ProgressBar();
    this.progressService.initPayslipSessionProgressHubConnection();
    this.progressService.registerOnPayslipSessionProgressBarProgressionEvent();
    this.createStatusSearchDropdownForm();
    this.preparePredicate();
    this.getSession();
    this.initGridDataSource();
    this.subscription = this.progressService.payslipSessionProgressionSubject.subscribe((data: ProgressBar) => {
      if (data != null) {
        this.progression = data;
        this.showProgress = this.progression != null && this.progression.Id === this.sessionInfos.Id ? true : false;
        if (this.progression.State === ProgressBarState.Completed) {
          this.initGridDataSource();
          setTimeout(() => {
            this.showProgress = false;
          }, 500);
          this.progressService.destroyPayslipSessionProgressHubConnection();
        }
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.progressService.destroyPayslipSessionProgressHubConnection();
    if (this.subscriptions !== undefined) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
  }

  statusFilter(event) {
    this.status = event;
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.dataStateChange(this.gridSettings.state);
  }

  /**
   * this method will be called to retrieve the session object from the server
   */
  getSession() {
    this.subscriptions.push(this.sessionService.getByIdWithRelation(this.idSession).subscribe(data => {
      this.sessionInfos = data;
      this.isClosed = this.sessionInfos.State === PayrollSessionState.Closed;
      this.sessionInfos.Month = new Date(this.sessionInfos.Month);
    }));
  }

  /**
   * Prepare Predicate
   */
  public preparePredicate(): void {
    this.predicate = new PredicateFormat();
    this.predicate.Filter = new Array<Filter>();
    this.predicate.Relation = new Array<Relation>();
    this.predicate.OrderBy = new Array<OrderBy>();
    this.predicate.Filter.push(new Filter(SessionConstant.ID_SESSION, Operation.eq, this.idSession));
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(PayslipConstant.EMPLOYEE_NAVIGATION)]);
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(PayslipConstant.CONTRACT_NAVIGATION)]);
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(ContractConstant.CONTRACT_TYPE_FROM_CONTRACT_NAVIGATION)]);
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(PayslipConstant.SALARY_STRUCTURE_NAVIGATION)]);
    this.predicate.OrderBy.push(new OrderBy(PayslipConstant.REGISTRATION_NUMBER_FROM_EMPLOYEE_NAVIGATION, OrderByDirection.desc));
  }

  /**
   * Reload grid data when data is changed
   * @param state
   */
  public dataStateChange(state: State): void {
    let filters = state.filter.filters as FilterDescriptor[];
    filters = filters.filter(x => x.field !== PayslipConstant.STATUS);
    state.filter.filters = filters;
    if (this.status !== undefined) {
      const statusFilter = {
        field: PayslipConstant.STATUS, operator: SharedConstant.EQUAL_OPERATOR,
        value: this.status
      } as FilterDescriptor;
      state.filter.filters.push(statusFilter);
    }
    this.gridSettings.state = state;
    this.subscriptions.push(this.payslipService.reloadServerSideData(state, this.predicate).subscribe(data => {
      this.gridSettings.gridData = data;
    }));
  }

  public regenerateClick(): void {
    if (this.progression.State !== ProgressBarState.Pending) {
      this.showGrid = false;
      this.progressService.initPayslipSessionProgressHubConnection();
      this.progressService.registerOnPayslipSessionProgressBarProgressionEvent();
      this.onGenerateClick();
    } else {
      this.swalWarrings.CreateSwal(SessionConstant.SESSION_GENERATION_PENDING, SessionConstant.GENERATION_PENDING,
        SharedConstant.OKAY, null, true);
    }
  }

  /**
   * this method will be called by clicking on the generate or regenerate button for the generation of payslips
   * the result of the server call will be the payslips generated
   */
  public async onGenerateClick(): Promise<void> {
    this.progression.Progression = NumberConstant.ZERO;
    this.showProgress = true;
    this.dataTransferShowSpinnerService.setShowSpinnerValue(this.showProgress);
    await this.payslipService.generatePayslip(this.sessionInfos.Id, this.sessionInfos.Attendance.length).toPromise();
    this.showProgress = false;
    this.initGridDataSource();
  }

  public closeSessionClick(): void {
    this.swalWarrings.CreateSwal(SessionConstant.CLOSE_SESSION_DETAIL_MESSAGE, SharedConstant.WARNING_TITLE,
      SharedConstant.OKAY, SharedConstant.CANCEL).then((result) => {
      if (result.value) {
        this.sessionInfos.State = PayrollSessionState.Closed;
        this.subscriptions.push(this.sessionService.closeSession(this.sessionInfos).subscribe(() => {
          this.router.navigate([SessionConstant.SESSION_URL]);
        }));
      }
    });
  }

  /**
   * Prepare payslip report parameters
   * @param id
   */
  public downloadPayslip(dataItem: Payslip) {
    const params = {
      idPayslip: dataItem.Id
    };
    const documentName = this.translate.instant(PayslipConstant.PAYSLIP_UPPERCASE)
      .concat(SharedConstant.UNDERSCORE).concat(dataItem.IdEmployeeNavigation.FirstName)
      .concat(SharedConstant.UNDERSCORE).concat(dataItem.IdEmployeeNavigation.LastName)
      .concat(SharedConstant.UNDERSCORE).concat(this.translate.instant(this.datePipe.transform(new Date(this.sessionInfos.Month), 'MMMM').toUpperCase()))
      .concat(SharedConstant.UNDERSCORE).concat(this.datePipe.transform(new Date(this.sessionInfos.Month), 'yyyy'));
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
    this.payslipService.checkAllPayslipIsCorrect(this.idSession).toPromise().then(res => {
      if (res === true) {
        this.swalWarrings.CreateSwal(PayslipConstant.PAYSLIP_WRONG, undefined, SharedConstant.YES, SharedConstant.NO).then((result) => {
          if (result.value) {
            this.subscriptions.push(this.payslipService.downloadAllPayslip(this.idSession).subscribe(data => {
              this.fileServiceService.downLoadFile(data.objectData);
            }));
          }
        });
      } else {
        this.subscriptions.push(this.payslipService.downloadAllPayslip(this.idSession).subscribe(data => {
          this.fileServiceService.downLoadFile(data.objectData);
        }));
      }
    });
  }

  /**
   * Got to previous state of session
   */
  public onPreviousClik(): void {
    this.router.navigateByUrl(SessionConstant.LOAN_SESSION_URL.concat(this.idSession.toString()), {skipLocationChange: true});
  }

  public regenerateOnePayslip(dataItem: Payslip) {
    this.subscriptions.push(this.payslipService.save(dataItem, false).subscribe(() => {
      this.initGridDataSource();
    }));
  }

  public distributePayslips() {
    this.payslipService.checkAllPayslipIsCorrect(this.idSession).toPromise().then(res => {
      if (res === true) {
        this.swalWarrings.CreateSwal(PayslipConstant.PAYSLIP_WRONG, undefined, SharedConstant.YES, SharedConstant.NO).then((result) => {
          if (result.value) {
            this.subscriptions.push(this.payslipService.broadcastPayslips(this.idSession, location.origin.concat(MAIN)).subscribe(() => {
              const message = this.translate.instant(PayslipConstant.BROADCAST_SUCCESSFULLY_COMPLETED);
              swal.fire({
                icon: 'success',
                html: message,
                confirmButtonColor: '#4c9aae'
              });
            }));
          }
        });
      } else {
        this.subscriptions.push(this.payslipService.broadcastPayslips(this.idSession, location.origin.concat(MAIN)).subscribe(() => {
          const message = this.translate.instant(PayslipConstant.BROADCAST_SUCCESSFULLY_COMPLETED);
          swal.fire({
          icon: 'success',
          html: message,
          confirmButtonColor: '#4c9aae'
        }); }));
      }
    });
  }
  public distributePayslip(dataItem: Payslip){
    this.subscriptions.push(this.payslipService.brodcastOnePayslip(location.origin.concat(MAIN),dataItem).subscribe(() => {
    const message = this.translate.instant(PayslipConstant.BROADCAST_SUCCESSFULLY_COMPLETED);
    swal.fire({
      icon: 'success',
      html: message,
      confirmButtonColor: '#4c9aae'
    });
   }));
  }

  public getResume() {
    this.payslipService.checkAllPayslipIsCorrect(this.idSession).toPromise().then(res => {
      if (res === true) {
        this.swalWarrings.CreateSwal(PayslipConstant.PAYSLIP_WRONG, undefined, SharedConstant.YES, SharedConstant.NO).then((result) => {
          if (result.value) {
            this.router.navigateByUrl(PayslipConstant.RESUME_URL.concat(this.idSession.toString()), {skipLocationChange: true});
          }
        });
      } else {
        this.router.navigateByUrl(PayslipConstant.RESUME_URL.concat(this.idSession.toString()), {skipLocationChange: true});
      }
    });
  }

  activateContractTypeFilter(idContractType: any) {
    this.predicate.Filter = this.predicate.Filter.filter(element => element.prop !== AttendanceConstant.ID_CONTRACT_TYPE_FROM_CONTRAT_NAVIGATION);
    if (idContractType) {
      this.predicate.Filter.push(new Filter(AttendanceConstant.ID_CONTRACT_TYPE_FROM_CONTRAT_NAVIGATION, Operation.eq, idContractType));
    }
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.dataStateChange(this.gridSettings.state);
  }

  private createStatusSearchDropdownForm(): void {
    this.statusSearchDropdownFormGroup = this.fb.group({
      Status: ''
    });
  }

  private initGridDataSource(predicate?: PredicateFormat) {
    this.predicate = predicate ? predicate : this.predicate;
    this.subscriptions.push(this.payslipService.reloadServerSideData(this.gridSettings.state, this.predicate).subscribe(data => {
      this.gridSettings.gridData = data;
      this.gridSettings.gridData.data.length > 0 ? this.showGrid = true : this.showGrid = false;
    }));
  }

}
