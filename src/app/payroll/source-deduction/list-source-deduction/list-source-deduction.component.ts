import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PagerSettings } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { Subscription } from 'rxjs/Subscription';
import swal from 'sweetalert2';
import { EmployeeConstant } from '../../../constant/payroll/employee.constant';
import { PayslipConstant } from '../../../constant/payroll/payslip.constant';
import { SessionConstant } from '../../../constant/payroll/session.constant';
import { SourceDeductionConstant } from '../../../constant/payroll/source-deduction.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PayslipStatus } from '../../../models/enumerators/payslip-status.enum';
import { ProgressBarState } from '../../../models/enumerators/progress-bar-state.enum';
import { PayrollSessionState } from '../../../models/enumerators/session-state.enum';
import { ProgressBar } from '../../../models/payroll/progress-bar.model';
import { SourceDeductionSession } from '../../../models/payroll/source-deduction-session.model';
import { SourceDeduction } from '../../../models/payroll/source-deduction.model';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { FileService } from '../../../shared/services/file/file-service.service';
import { ProgressService } from '../../../shared/services/signalr/progress/progress.service';
import { DataTransferShowSpinnerService } from '../../../shared/services/spinner/data-transfer-show-spinner.service';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { Filter, Operation, OrderBy, OrderByDirection, PredicateFormat, Relation } from '../../../shared/utils/predicate';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { SourceDeductionSessionService } from '../../services/source-deduction-session/source-deduction-session.service';
import { SourceDeductionService } from '../../services/source-deduction/source-deduction.service';
const PREVIOUS_URL = 'main/payroll/sourcedeductionsession/edit/';
const MAIN = '/main';

@Component({
  selector: 'app-list-source-deduction',
  templateUrl: './list-source-deduction.component.html',
  styleUrls: ['./list-source-deduction.component.scss']
})
export class ListSourceDeductionComponent implements OnInit, OnDestroy {

  public sourceDeductionSessionInfos = new SourceDeductionSession();
  public sessionYear: Date;
  public isClosed = false;
  public showGrid: boolean;
  public showProgress = false;
  /**
   * permissions
   */
  public hasGeneratePermission: boolean;
  public hasPrintPermission: boolean;
  public hasRegeneratePermission: boolean;
  public hasBroadcastPermission: boolean;
  public hasClosePermission: boolean;
  progression: ProgressBar;
  // Progress subscription
  subscription: Subscription;
  nonGeneratedCounter: number;
  public sourceDeductionStatus = PayslipStatus;
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
      field: SourceDeductionConstant.REGISTRATION_NUMBER_FROM_EMPLOYEE_NAVIGATION,
      title: EmployeeConstant.REGISTRATION_NUMBER,
      filterable: true
    },
    {
      field: SourceDeductionConstant.LAST_NAME_FROM_EMPLOYEE_NAVIGATION,
      title: EmployeeConstant.LAST_NAME_UPPERCASE,
      filterable: true
    },
    {
      field: SourceDeductionConstant.FIRST_NAME_FROM_EMPLOYEE_NAVIGATION,
      title: EmployeeConstant.FIRST_NAME_UPPERCASE,
      filterable: true
    },
    {
      field: SourceDeductionConstant.STATUS,
      title: SourceDeductionConstant.STATUS_UPPERCASE,
      filterable: true
    }
  ];
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };
  private idSession: number;
  private subscriptions: Subscription[] = [];

  constructor(private sourceDeductionSessionService: SourceDeductionSessionService, private sourceDeductionService: SourceDeductionService,
              private activatedRoute: ActivatedRoute, private router: Router,
              private translate: TranslateService, private fileServiceService: FileService,
              private swalWarrings: SwalWarring,
              private progressService: ProgressService,
              private dataTransferShowSpinnerService: DataTransferShowSpinnerService, private authService: AuthService) {
    this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
      this.idSession = params[SharedConstant.ID_LOWERCASE] || NumberConstant.ZERO;
    }));
  }

  ngOnInit() {
    this.hasGeneratePermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.GENERATE_SOURCEDEDUCTION);
    this.hasPrintPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.PRINT_SOURCEDEDUCTION);
    this.hasRegeneratePermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.REGENERATE_SOURCEDEDUCTION);
    this.hasBroadcastPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.BROADCAST_SOURCEDEDUCTION);
    this.hasClosePermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.CLOSE_SOURCEDEDUCTIONSESSION);
    this.progression = new ProgressBar();
    this.progressService.initSourceDeductionSessionProgressHubConnection();
    this.progressService.registerOnSourceDeductionSessionProgressBarProgressionEvent();
    this.getSession();
    this.preparePredicate();
    this.initGridDataSource();
    this.subscription = this.progressService.sourceDeductionSessionProgressionSubject.subscribe((data: ProgressBar) => {
      if (data != null) {
        this.progression = data;
        this.showProgress = this.progression != null && this.progression.Id === this.sourceDeductionSessionInfos.Id ? true : false;
        if (this.progression.State === ProgressBarState.Completed) {
          this.initGridDataSource();
          setTimeout(() => {
            this.showProgress = false;
          }, 500);
          this.progressService.destroySourceDeductionProgressHubConnection();
        }
      }
    });
  }

  /**
   * this method will be called to retrieve the session object from the server
   */
  getSession() {
    this.subscriptions.push(this.sourceDeductionSessionService.getByIdWithRelation(this.idSession).subscribe(data => {
      this.sourceDeductionSessionInfos = data;
      this.isClosed = this.sourceDeductionSessionInfos.State === PayrollSessionState.Closed;
      this.sessionYear = new Date(this.sourceDeductionSessionInfos.Year.toString());
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
    this.predicate.Filter.push(new Filter(SourceDeductionConstant.ID_SOURCE_DEDUCTION_SESSION,
      Operation.eq, this.idSession));
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(SourceDeductionConstant.EMPLOYEE_NAVIGATION)]);
    this.predicate.OrderBy.push(new OrderBy(SourceDeductionConstant.LAST_NAME_FROM_EMPLOYEE_NAVIGATION, OrderByDirection.asc));
  }

  /**
   * Reload grid data when data is changed
   * @param state
   */
  public dataStateChange(state: State): void {
    this.gridSettings.state = state;
    this.subscriptions.push(this.sourceDeductionService.reloadServerSideData(state, this.predicate).subscribe(data => {
      this.gridSettings.gridData = data;
    }));
  }

  /**
   * this method will be called by clicking on the generate or regenerate button for the generation of source deductions
   * the result of the server call will be the source deductions generated
   */
  public async onGenerateClick(): Promise<void> {
    this.progression.Progression = NumberConstant.ZERO;
    this.showProgress = true;
    this.dataTransferShowSpinnerService.setShowSpinnerValue(this.showProgress);
    await this.sourceDeductionService.generateSourceDeduction(this.sourceDeductionSessionInfos.Id, this.sourceDeductionSessionInfos.SourceDeductionSessionEmployee.length).toPromise();
  }

  /**
   * this method will be called by clicking regenerate
   */
  public regenerateClick(): void {
    if (this.progression.State !== ProgressBarState.Pending) {
      this.showGrid = false;
      this.progressService.initSourceDeductionSessionProgressHubConnection();
      this.progressService.registerOnSourceDeductionSessionProgressBarProgressionEvent();
      this.onGenerateClick();
    } else {
      this.swalWarrings.CreateSwal(SessionConstant.SESSION_GENERATION_PENDING, SessionConstant.GENERATION_PENDING,
        SharedConstant.OKAY, null, true);
    }
  }

  /**
   * this method will be called by clicking on generate in a specefic item in the list
   */
  public regenerateOneSourceDeduction(dataItem: SourceDeduction) {
    this.subscriptions.push(this.sourceDeductionService.regenerateOneSourceDeduction(dataItem).subscribe(() => {
      this.initGridDataSource();
    }));
  }

  /**
   * Prepare source deduction report parameters
   * @param idSourceDeduction
   */
  public downloadPayslip(dataItem: SourceDeduction) {
    const params = {
      idSourceDeduction: dataItem.Id
    };
    const documentName = this.translate.instant(SourceDeductionConstant.SOURCE_DEDUCTION_UPPERCASE)
      .concat(SharedConstant.UNDERSCORE).concat(dataItem.IdEmployeeNavigation.FirstName)
      .concat(SharedConstant.UNDERSCORE).concat(dataItem.IdEmployeeNavigation.LastName)
      .concat(SharedConstant.UNDERSCORE).concat(this.sourceDeductionSessionInfos.Year.toString());
    const dataToSend = {
      'Id': dataItem.Id,
      'reportName': SourceDeductionConstant.SOURCE_DEDUCTION_REPORT_NAME,
      'documentName': documentName,
      'reportFormatName': 'pdf',
      'printCopies': 1,
      'reportType': 'pdf',
      'reportparameters': params
    };
    this.subscriptions.push(this.sourceDeductionService.downloadJasperReport(dataToSend).subscribe(
      res => {
        this.fileServiceService.downLoadFile(res.objectData);
      }));
  }

  /**
   * this method will be called by clicking on close sesscion button
   */
  public closeSessionClick(): void {
    this.sourceDeductionSessionService.checkSourceDeductionSessionBeforeClosing(this.sourceDeductionSessionInfos).toPromise().then(res => {
      if (res) {
        this.swalWarrings.CreateSwal(SourceDeductionConstant.CLOSE_SESSION_DETAIL_MESSAGE, SharedConstant.WARNING,
          SharedConstant.OKAY, SharedConstant.CANCEL).then((result) => {
          if (result.value) {
            this.sourceDeductionSessionInfos.State = PayrollSessionState.Closed;
            this.sourceDeductionSessionService.closeSourceDeduction(this.sourceDeductionSessionInfos).subscribe(() => {
              this.router.navigate([SourceDeductionConstant.SOURCE_DEDUCTION_SESSION_URL]);
            });
          }
        });
      }
    });
  }

  // Return to source deduction source
  onPreviousClik() {
    this.router.navigateByUrl(PREVIOUS_URL.concat(this.idSession.toString()));
  }

  public downloadAllSourceDeduction(): void {
    this.sourceDeductionService.checkAllSourceDeductionIsCorrect(this.idSession).toPromise().then(res => {
      if (res === true) {
        this.swalWarrings.CreateSwal(SourceDeductionConstant.SOURCE_DEDUCTION_WRONG, undefined,
          SharedConstant.YES, SharedConstant.NO).then((result) => {
          if (result.value) {
            this.subscriptions.push(this.sourceDeductionService.downloadAllSourceDeduction(this.idSession).subscribe(data => {
              this.fileServiceService.downLoadFile(data.objectData);
            }));
          }
        });
      } else {
        this.subscriptions.push(this.sourceDeductionService.downloadAllSourceDeduction(this.idSession).subscribe(data => {
          this.fileServiceService.downLoadFile(data.objectData);
        }));
      }
    });
  }

  public distributeSourceDeduction() {
    this.sourceDeductionService.checkAllSourceDeductionIsCorrect(this.idSession).toPromise().then(res => {
      if (res === true) {
        this.swalWarrings.CreateSwal(SourceDeductionConstant.SOURCE_DEDUCTION_WRONG, undefined,
          SharedConstant.YES, SharedConstant.NO).then((result) => {
          if (result.value) {
            this.subscriptions.push(this.sourceDeductionService.broadcastSourceDeduction(this.idSession, location.origin.concat(MAIN)).subscribe(() => {
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
        this.subscriptions.push(this.sourceDeductionService.broadcastSourceDeduction(this.idSession, location.origin.concat(MAIN)).subscribe(() => {
          const message = this.translate.instant(PayslipConstant.BROADCAST_SUCCESSFULLY_COMPLETED);
          swal.fire({
            icon: 'success',
            html: message,
            confirmButtonColor: '#4c9aae'
          });
        }));
      }
    });
  }

  public distributeOneSourceDeduction(dataItem: SourceDeduction) {
    this.subscriptions.push(this.sourceDeductionService.broadcastOneSourceDeduction(location.origin.concat(MAIN), dataItem, this.idSession).subscribe(() => {
      const message = this.translate.instant(PayslipConstant.BROADCAST_SUCCESSFULLY_COMPLETED);
      swal.fire({
        icon: 'success',
        html: message,
        confirmButtonColor: '#4c9aae'
      });
    }));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    if (this.subscriptions !== undefined) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
  }

  private initGridDataSource(predicate?: PredicateFormat) {
    this.predicate = predicate ? predicate : this.predicate;
    this.subscriptions.push(this.sourceDeductionService.reloadServerSideData(this.gridSettings.state, this.predicate).subscribe(data => {
      this.gridSettings.gridData = data;
      this.gridSettings.gridData.data.length > NumberConstant.ZERO ? this.showGrid = true : this.showGrid = false;
    }));
  }


}
