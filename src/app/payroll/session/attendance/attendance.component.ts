import { Component, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PagerSettings, RowArgs } from '@progress/kendo-angular-grid';
import { FilterDescriptor, State } from '@progress/kendo-data-query';
import 'rxjs/add/observable/of';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { AttendanceConstant } from '../../../constant/payroll/attendance.constant';
import { BonusConstant } from '../../../constant/payroll/bonus.constant';
import { ContractConstant } from '../../../constant/payroll/Contract.constant';
import { EmployeeConstant } from '../../../constant/payroll/employee.constant';
import { SessionConstant } from '../../../constant/payroll/session.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PayrollSessionState } from '../../../models/enumerators/session-state.enum';
import { Attendance } from '../../../models/payroll/attendance.model';
import { Session } from '../../../models/payroll/session.model';
import { FormModalDialogService } from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { Filter, Operation, PredicateFormat } from '../../../shared/utils/predicate';
import { StarkPermissionsService, StarkRolesService } from '../../../stark-permissions/stark-permissions.module';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { AttendanceInformationsComponent } from '../../components/attendance-informations/attendance-informations.component';
import { AttendanceService } from '../../services/attendance/attendance.service';
import { SessionService } from '../../services/session/session.service';
// statement of constants
const PREVIOUS_URL = 'main/payroll/session/add/';

const LOGIC_AND = 'and';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss'],
})

export class AttendanceComponent implements OnInit, OnDestroy {

  public BlockTheAdd = false;
  public idSession: number;
  public view: Observable<Attendance[]>;
  public rowsHasError: any[] = [];
  public gridData: any;
  public isClosed = false;
  /*
   * permissions
   */
  public hasUpdateAttendancePermission: boolean;
  public canUpdatePays = false; 
  public attendanceToUpdate : Attendance;
  private subscriptions: Subscription[]= [];
  public gridState: State = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.TEN,
    // Initial filter descriptor
    filter: {
      logic: LOGIC_AND,
      filters: []
    },
    sort: [
      {
        'field':  AttendanceConstant.REGISTRATION_NUMBER_FROM_CONTRACT_NAVIGATION,
        'dir' : 'desc'
      }
    ],
    group: []
  };
  public columnsConfig: ColumnSettings[] = [
    {
      field: AttendanceConstant.ID_SESSION,
      title: AttendanceConstant.ID_SESSION,
      filterable: true
    },
    {
      field: AttendanceConstant.REGISTRATION_NUMBER_FROM_CONTRACT_NAVIGATION,
      title: EmployeeConstant.REGISTRATION_NUMBER_UPPERCASE,
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: AttendanceConstant.FULL_NAME_FROM_CONTRACT_NAVIGATION,
      title: EmployeeConstant.EMPLOYEE,
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: AttendanceConstant.CONTRACT_TYPE_CODE,
      title: ContractConstant.CONTRACT_TYPE_UPPERCASE,
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: AttendanceConstant.NUMBER_DAYS_WORKED,
      title: AttendanceConstant.NUMBER_PAYED_DAYS_WORK_UPPERCASE,
      tooltip: AttendanceConstant.NUMBER_DAYS_WORKED_TOOLTIP,
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: AttendanceConstant.NUMBER_DAYS_PAID_LEAVE,
      title: AttendanceConstant.NUMBER_DAYS_PAID_LEAVE_UPPERCASE,
      tooltip: AttendanceConstant.NUMBER_DAYS_PAID_LEAVE_TOOLTIP,
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: AttendanceConstant.NUMBER_DAYS_NON_PAID_LEAVE,
      title: AttendanceConstant.NUMBER_DAYS_NON_PAID_LEAVE_UPPERCASE,
      tooltip: AttendanceConstant.NUMBER_DAYS_NON_PAID_LEAVE_TOOLTIP,
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: AttendanceConstant.ADDITIONAL_HOUR_1,
      title: AttendanceConstant.HSUP_1,
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: AttendanceConstant.ADDITIONAL_HOUR_2,
      title: AttendanceConstant.HSUP_2,
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: AttendanceConstant.ADDITIONAL_HOUR_3,
      title: AttendanceConstant.HSUP_3,
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: AttendanceConstant.ADDITIONAL_HOUR_4,
      title: AttendanceConstant.HSUP_4,
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    }
  ];
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };
  attendancesList: Array<Attendance> = [];
  sessionInfos: Session = new Session();
  sessionFormGroup: FormGroup;
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  predicate: PredicateFormat = new PredicateFormat();

  constructor(private fb: FormBuilder, private router: Router, private activatedRoute: ActivatedRoute,
              private sessionService: SessionService, private attendanceService: AttendanceService,
              private formModalDialogService: FormModalDialogService, private viewContainerRef: ViewContainerRef,
              public authService: AuthService) {
    this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
      this.idSession = params[SharedConstant.ID_LOWERCASE] || NumberConstant.ZERO;
    }));
    this.preparePredicate();
    this.getAttendances();
    if (this.sessionInfos === undefined || this.sessionInfos === null) {
      this.router.navigate([SessionConstant.SESSION_URL]);
    }
  }

  get NumberDaysWorked(): FormControl {
    return this.sessionFormGroup.get(AttendanceConstant.NUMBER_DAYS_WORKED) as FormControl;
  }

  get NumberDaysPaidLeave(): FormControl {
    return this.sessionFormGroup.get(AttendanceConstant.NUMBER_DAYS_PAID_LEAVE) as FormControl;
  }

  get NumberDaysNonPaidLeave(): FormControl {
    return this.sessionFormGroup.get(AttendanceConstant.NUMBER_DAYS_NON_PAID_LEAVE) as FormControl;
  }

  get AdditionalHourOne(): FormControl {
    return this.sessionFormGroup.get(AttendanceConstant.ADDITIONAL_HOUR_1) as FormControl;
  }

  get AdditionalHourTwo(): FormControl {
    return this.sessionFormGroup.get(AttendanceConstant.ADDITIONAL_HOUR_2) as FormControl;
  }

  get AdditionalHourThree(): FormControl {
    return this.sessionFormGroup.get(AttendanceConstant.ADDITIONAL_HOUR_3) as FormControl;
  }

  get AdditionalHourFour(): FormControl {
    return this.sessionFormGroup.get(AttendanceConstant.ADDITIONAL_HOUR_4) as FormControl;
  }

  public isRowSelected = (e: RowArgs) => this.rowsHasError.indexOf(e.dataItem.IdContract) >= NumberConstant.ZERO;

  /**
   * this method will be called to get attendance related to session
   */
  getAttendances() {
    const pred = this.sessionService.preparePrediacteFormat(this.gridSettings.state, this.predicate);
    this.subscriptions.push(this.sessionService.getListOfAttendances(pred, this.idSession).subscribe(data => {
      this.attendancesList = data.Attendances;
      this.gridData = this.attendancesList;
      this.gridSettings.gridData = this.gridData;
      this.gridSettings.gridData.data = this.attendancesList.slice(NumberConstant.ZERO, this.gridSettings.state.take);
      this.gridSettings.gridData.total = data.Total;
    }));
  }

  preparePredicate() {
    this.predicate.Filter = new Array<Filter>();
    this.predicate.pageSize = this.gridSettings.state.take;
    this.predicate.page = this.gridSettings.state.skip / this.gridSettings.state.take + NumberConstant.ONE;
  }

  public cellClickHandler({sender, rowIndex, column, columnIndex, dataItem, isEdited}) {
      if (!this.isClosed && !isEdited && this.hasUpdateAttendancePermission && !this.isReadOnly(column.field)) {
      this.createAttendanceFormGroup(dataItem);
      sender.editCell(rowIndex, columnIndex, this.sessionFormGroup);
    }
  }

  public cellCloseHandler(args: any) {
    const {formGroup, dataItem} = args;
    if (!formGroup.valid) {
      // prevent closing the edited cell if there are invalid values.
      args.preventDefault();
      this.BlockTheAdd = true;
    } else {
      this.BlockTheAdd = false;
      // Recovery of data from the formGroup and dataItem
      const index = this.attendancesList.indexOf(dataItem);
      this.attendancesList[index].NumberDaysWorked = formGroup.controls[AttendanceConstant.NUMBER_DAYS_WORKED].value;
      this.attendancesList[index].NumberDaysPaidLeave = formGroup.controls[AttendanceConstant.NUMBER_DAYS_PAID_LEAVE].value;
      this.attendancesList[index].NumberDaysNonPaidLeave = formGroup.controls[AttendanceConstant.NUMBER_DAYS_NON_PAID_LEAVE].value;
      this.attendancesList[index].AdditionalHourOne = formGroup.controls[AttendanceConstant.ADDITIONAL_HOUR_1].value;
      this.attendancesList[index].AdditionalHourTwo = formGroup.controls[AttendanceConstant.ADDITIONAL_HOUR_2].value;
      this.attendancesList[index].AdditionalHourThree = formGroup.controls[AttendanceConstant.ADDITIONAL_HOUR_3].value;
      this.attendancesList[index].AdditionalHourFour = formGroup.controls[AttendanceConstant.ADDITIONAL_HOUR_4].value;

      // An automatic calculation of the number of unjustified days of absence
      const NumberOfDaysPaidLeaveCalculated = this.attendancesList[index].MaxNumberOfDaysAllowed
        - this.attendancesList[index].NumberDaysWorked
        - this.attendancesList[index].NumberDaysPaidLeave
        - this.attendancesList[index].NumberDaysNonPaidLeave;
      if (NumberOfDaysPaidLeaveCalculated >= NumberConstant.ZERO) {
        this.attendancesList[index].NumberDaysNonPaidLeave = this.attendancesList[index].NumberDaysNonPaidLeave +
          Number(NumberOfDaysPaidLeaveCalculated.toFixed(2));
      }

      const errorExist = this.rowsHasError.indexOf(dataItem.IdContract);
      // Verification of the respect of the rule
      // NumberDaysWorked + NumberDaysPaidLeave + NumberOfDaysPaidLeave = MaxNumberOfDaysAllowed
      if (Number(formGroup.controls[AttendanceConstant.NUMBER_DAYS_WORKED].value) +
        Number(formGroup.controls[AttendanceConstant.NUMBER_DAYS_PAID_LEAVE].value) +
        (this.attendancesList[index].NumberDaysNonPaidLeave) === this.attendancesList[index].MaxNumberOfDaysAllowed) {
        if (errorExist >= NumberConstant.ZERO) {
          this.rowsHasError.splice(errorExist, NumberConstant.ONE);
        }
      } else {
        if (errorExist < NumberConstant.ZERO) {
          this.rowsHasError.push(dataItem.IdContract);
        }
      }
      this.subscriptions.push(this.attendanceService.getById(dataItem.IdAttendance).subscribe(data => {
        this.attendanceToUpdate = data;
        this.attendanceToUpdate.NumberDaysNonPaidLeave = this.attendancesList[index].NumberDaysNonPaidLeave;
        this.attendanceToUpdate.MaxNumberOfDaysAllowed = this.attendancesList[index].MaxNumberOfDaysAllowed;
        this.attendanceToUpdate.NumberDaysPaidLeave = this.attendancesList[index].NumberDaysPaidLeave;
        this.attendanceToUpdate.NumberDaysWorked = this.attendancesList[index].NumberDaysWorked;
        this.attendanceToUpdate.AdditionalHourOne = this.attendancesList[index].AdditionalHourOne;
        this.attendanceToUpdate.AdditionalHourTwo = this.attendancesList[index].AdditionalHourTwo;
        this.attendanceToUpdate.AdditionalHourThree = this.attendancesList[index].AdditionalHourThree;
        this.attendanceToUpdate.AdditionalHourFour = this.attendancesList[index].AdditionalHourFour;
        this.attendanceService.updateAttendance(this.attendanceToUpdate).subscribe();
      }));
    }
  }

  /**
   * this method will be called when cell is clicked in the grid to create a form group
   */
  public createAttendanceFormGroup(dataItem: any) {
    this.sessionFormGroup = this.fb.group({
      IdContract: dataItem.IdContract,
      ContractReference: dataItem.Code,
      NumberDaysWorked: [dataItem.NumberDaysWorked,
        Validators.compose([Validators.required, Validators.pattern('^[0-9]{1,2}(.[0-9]{1,2})?$'),
          Validators.max(dataItem.MaxNumberOfDaysAllowed)])],
      NumberDaysPaidLeave: [dataItem.NumberDaysPaidLeave,
        Validators.compose([Validators.required, Validators.pattern('^[0-9]{1,2}(.[0-9]{1,2})?$'),
          Validators.max(dataItem.MaxNumberOfDaysAllowed)])],
      NumberDaysNonPaidLeave: [dataItem.NumberDaysNonPaidLeave,
        Validators.compose([Validators.required, Validators.pattern('^[0-9]{1,2}(.[0-9]{1,2})?$'),
          Validators.max(dataItem.MaxNumberOfDaysAllowed)])],
      MaxNumberOfDaysAllowed: dataItem.MaxNumberOfDaysAllowed,
      AdditionalHourOne: [dataItem.AdditionalHourOne, [Validators.pattern('^[0-9]{1,2}(.[0-9]{1,2})?$')]],
      AdditionalHourTwo: [dataItem.AdditionalHourTwo, [Validators.pattern('^[0-9]{1,2}(.[0-9]{1,2})?$')]],
      AdditionalHourThree: [dataItem.AdditionalHourThree, [Validators.pattern('^[0-9]{1,2}(.[0-9]{1,2})?$')]],
      AdditionalHourFour: [dataItem.AdditionalHourFour, [Validators.pattern('^[0-9]{1,2}(.[0-9]{1,2})?$')]]
    });
  }

  ngOnInit() {
    this.hasUpdateAttendancePermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.UPDATE_ATTENDANCE);
    this.getSessionFromServer(this.idSession);
  }

  /**
   * this method will be called to retrieve the session object from the server
   */

  getSessionFromServer(id) {
    this.subscriptions.push(this.sessionService.getById(id)
      .subscribe(
        data => {
          this.sessionInfos = data;
          this.isClosed = this.sessionInfos.State === PayrollSessionState.Closed;
          this.sessionInfos.Month = new Date(this.sessionInfos.Month);
        }
      ));
  }

  /**
   * this method will be called to navigate to next url
   */
  public onNextClick() {
    if (this.sessionInfos.State !== PayrollSessionState.Closed && !this.canUpdatePays) {
      if (this.rowsHasError.length === NumberConstant.ZERO && !this.BlockTheAdd) {
        this.sessionInfos.State = PayrollSessionState.Attendance;
        this.subscriptions.push(this.sessionService.updateSessionStates(this.sessionInfos).subscribe(res => {
          this.router.navigateByUrl(BonusConstant.BONUS_URL.concat(this.idSession.toString()), {skipLocationChange: true});
        }));
      }
    }
  }

  /// Got to previous state of session
  public onPreviousClik(): void {
    this.router.navigateByUrl(PREVIOUS_URL.concat(this.idSession.toString()), {skipLocationChange: true});
  }

  // Called when there is a change in the grid
  public dataStateChange(state: State): void {
    this.gridSettings.state = state;
    this.predicate.pageSize = this.gridSettings.state.take;
    this.predicate.page = this.gridSettings.state.skip / this.gridSettings.state.take + NumberConstant.ONE;
    let filters = state.filter.filters as FilterDescriptor[];
    this.predicate.Filter = new Array<Filter>();
    if (filters.length !== NumberConstant.ZERO) {
      filters.forEach(element => {
        if (element.field.toString() === AttendanceConstant.REGISTRATION_NUMBER) {
          this.predicate.Filter.push(new Filter(AttendanceConstant.REGISTRATION_NUMBER_FROM_CONTRACT_NAVIGATION, Operation.contains, element.value));
        } else if (element.field.toString() === AttendanceConstant.FULLNAME) {
          this.predicate.Filter.push(new Filter(AttendanceConstant.FULL_NAME_FROM_CONTRACT_NAVIGATION, Operation.contains, element.value));
        } else {
          this.predicate.Filter.push(new Filter(element.field.toString(), Operation.gte, element.value));
        }
      });
    }
    this.getAttendances();
  }

  attendanceDetails(attendance) {
    const TITLE = attendance.FullName;
    this.formModalDialogService.openDialog(TITLE,
      AttendanceInformationsComponent,
      this.viewContainerRef, null, attendance, true, SharedConstant.MODAL_DIALOG_SIZE_S);
  }

  activateFilter(idContractType: any) {
    this.predicate.Filter = this.predicate.Filter.filter(element => element.prop !== AttendanceConstant.ID_CONTRACT_TYPE_FROM_CONTRAT_NAVIGATION);
    if (idContractType) {
      this.predicate.Filter.push(new Filter(AttendanceConstant.ID_CONTRACT_TYPE_FROM_CONTRAT_NAVIGATION, Operation.eq, idContractType));
    }
    this.getAttendances();
  }

  ngOnDestroy(): void {
    if (this.subscriptions !== undefined) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
  }

  private isReadOnly(field: string): boolean {
    const readOnlyColumns = [AttendanceConstant.ID_SESSION];
    return readOnlyColumns.indexOf(field) > NumberConstant.MINUS_ONE;
  }
}
