import { Component, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PagerSettings, SelectAllCheckboxState } from '@progress/kendo-angular-grid';
import { FilterDescriptor, State } from '@progress/kendo-data-query';
import { EnumValues } from 'enum-values';
import { Subscription } from 'rxjs/Subscription';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { AdministrativeDocumentConstant } from '../../../constant/payroll/administrative-document-constant';
import { EmployeeConstant } from '../../../constant/payroll/employee.constant';
import { TimeSheetConstant } from '../../../constant/rh/timesheet.constant';
import { FieldTypeConstant } from '../../../constant/shared/fieldType.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { TypeConstant } from '../../../constant/utility/Type.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { TimeSheetStatusEnumerator } from '../../../models/enumerators/timeSheet-status-enumerator.enum';
import { Employee } from '../../../models/payroll/employee.model';
import { TimeSheet } from '../../../models/rh/timesheet.model';
import { FiltrePredicateModel } from '../../../models/shared/filtrePredicate.model';
import { EmployeeService } from '../../../payroll/services/employee/employee.service';
import { SearchSectionComponent } from '../../../shared/components/search-section/search-section.component';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { FormModalDialogService } from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { Filter, Operation, Operator, PredicateFormat, Relation } from '../../../shared/utils/predicate';
import { PermissionConstant } from '../../../Structure/permission-constant';
import {
  TimesheetInformationsComponent
} from '../../components/timesheet-informations/timesheet-informations/timesheet-informations.component';
import { TimeSheetService } from '../../services/timesheet/timesheet.service';
const SEPARATOR = '/';

@Component({
  selector: 'app-grid-timesheet',
  templateUrl: './grid-timesheet.component.html',
  styleUrls: ['./grid-timesheet.component.scss']
})
export class GridTimesheetComponent implements OnInit, OnDestroy {

  public statusEnum = EnumValues.getNamesAndValues(TimeSheetStatusEnumerator);
  public statusEnumDraft = TimeSheetStatusEnumerator.Draft;
  public showFilter = false;
  public selectAllState: SelectAllCheckboxState = SharedConstant.UNCHECKED as SelectAllCheckboxState;
  public timesheetIdsSelected: number[] = [];
  public showErrorMessage = false;
  public AllTimesheetIds: number[] = [];

  // Timesheet permissions
  public hasDeletePermission: boolean;
  public hasShowPermission: boolean;
  public hasAddPermission: boolean;
  public hasValidatePermission: boolean;
  public hasMassiveFixPermission: boolean;
  public hasMassiveValidatePermission: boolean;
  public hasEmailSendingPermission: boolean;
   public isUpperHierrarchyOrTeamManager = false;
  public isMasterUsersList = false;
  // Id of the connected User
  connectedEmployee = 0;
  // pager settings
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public predicate: PredicateFormat;
  // Timesheet status values
  public statusCode = TimeSheetStatusEnumerator;
  /**
   * Initially, the current date gets the system date
   */
  public date = new Date();
  // Massive actions
  public listOfAction = TimeSheetConstant.CRA_ACTION;
  validatedStatus: string;
  selectedStatus = false;
  selectionLength = NumberConstant.ZERO;
  // Max date is current date
  public maxDate = new Date();
  public hasReadTimeSheetPermission = false;
  public gridState: State = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.TWENTY,
    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: []
    }
  };

  hideCardBody = false;
  @ViewChild(SearchSectionComponent) searchSection;
  public ButtonAction;
  // month from filter
  month: Date;
  filterDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  statusSearchDropdownFormGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  public filtreFieldsColumns = [];
  public filtreFieldsInputs = [];
  public columnsConfig: ColumnSettings[] = [
    {
      field: TimeSheetConstant.EMPLOYEE,
      title: EmployeeConstant.EMPLOYEE_UPPERCASE,
      filterable: false,
      _width: NumberConstant.ONE_HUNDRED_SIXTY
    },
    {
      field: TimeSheetConstant.EMAIL,
      title: EmployeeConstant.EMAIL_UPPERCASE,
      filterable: false,
      _width: NumberConstant.ONE_HUNDRED_SIXTY
    },
    {
      field: TimeSheetConstant.MONTH,
      title: TimeSheetConstant.MONTH.toUpperCase(),
      filterable: false,
      _width: NumberConstant.ONE_HUNDRED_TWENTY
    },
    {
      field: TimeSheetConstant.TREATED_BY,
      title: TimeSheetConstant.TREATED_BY_UPPERCASE,
      filterable: false,
      _width: NumberConstant.ONE_HUNDRED_SIXTY
    },
    {
      field: TimeSheetConstant.TREATMENT_DATE,
      title: TimeSheetConstant.TREATMENT_DATE_UPPERCASE,
      filterable: false,
      _width: NumberConstant.ONE_HUNDRED_SIXTY,
      format: this.translate.instant(SharedConstant.DATE_FORMAT)
    },
    {
      field: TimeSheetConstant.STATUS,
      title: TimeSheetConstant.STATUS.toUpperCase(),
      filterable: false,
      _width: NumberConstant.ONE_HUNDRED_SIXTY
    }
  ];

  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };
  /**
  * formatDate
  * */
  public formatDate = this.translate.instant(SharedConstant.DATE_FORMAT);

  constructor(public timeSheetService: TimeSheetService,
    private swalWarrings: SwalWarring, private router: Router,
    private employeeService: EmployeeService, private translate: TranslateService,
    private fb: FormBuilder, private growlService: GrowlService,
    private formModalDialogService: FormModalDialogService, private viewContainerRef: ViewContainerRef, public authService: AuthService) { }

  ngOnInit() {
    this.hasDeletePermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.DELETE_TIMESHEET);
    this.hasShowPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.SHOW_TIMESHEET);
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.ADD_TIMESHEET);
    this.hasValidatePermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.VALIDATE_TIMESHEET);
    this.hasMassiveFixPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.MASSIVE_FIX_TIMESHEET);
    this.hasMassiveValidatePermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.MASSIVE_VALIDATE_TIMESHEET);
    this.hasEmailSendingPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.SEND_REMINDER_EMAIL_TIMESHEET);

    this.createStatusSearchDropdownForm();
    this.subscriptions.push(this.employeeService.getConnectedEmployee().subscribe((res: Employee) => {
      this.connectedEmployee = res.Id;
      this.preparePredicate();
      this.initTimesheetFiltreConfig();
      const firstDayOfCurrentMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      this.predicate.Filter.push(new Filter(TimeSheetConstant.MONTH, Operation.eq, firstDayOfCurrentMonth));
      this.initGridDataSource();

    }));
  }

  /**
   * Prepare Predicate
   */
  public preparePredicate(): void {
    this.predicate = new PredicateFormat();
    this.predicate.Relation = new Array<Relation>();
    this.predicate.Filter = new Array<Filter>();
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(TimeSheetConstant.ID_EMPLOYEE_NAVIGATION)]);
    const firstDayOfCurrentMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    this.predicate.Filter.push(new Filter(TimeSheetConstant.MONTH, Operation.eq, firstDayOfCurrentMonth));
  }

  /**
   * Get salary rule list from the server
   */
  public initGridDataSource(): void {
    this.subscriptions.push(this.timeSheetService.getTimeSheetRequestsWithHierarchy(this.gridSettings.state,
      this.predicate, false).subscribe(res => {
        this.AllTimesheetIds = [];
        this.gridSettings.gridData = res;
        const existingTimesheetsIds = res.data.filter(x => x.Id !== NumberConstant.ZERO);
        if (this.hasValidatePermission) {
          this.AllTimesheetIds = existingTimesheetsIds.map(element => element.Id);
        }
      }));
  }

  /**
   * this method fis invoked if the page number or filter has changed
   * @param state
   */
  public dataStateChange(state: State): void {
    this.preparePredicate();
    this.searchSection.preparePredicate();
    Object.assign(this.predicate, this.searchSection.predicate);
    const stateFilters = state.filter.filters as FilterDescriptor[];
    if (stateFilters.filter(x => x.field === TimeSheetConstant.MONTH).length > NumberConstant.ZERO) {
      const dateFilters = this.predicate.Filter.filter((x => x.prop === TimeSheetConstant.MONTH));
      const index = this.predicate.Filter.indexOf(dateFilters[NumberConstant.ZERO]);
      this.predicate.Filter.splice(index, NumberConstant.ONE);
    }
    this.statusFilter();
    this.gridSettings.state = state;
    this.initGridDataSource();
  }

  /**
   * Delete timesheet
   * @param timeSheet
   */
  public deleteTimeSheet(timeSheet) {
    this.swalWarrings.CreateSwal().then((result) => {
      if (result.value) {
        this.subscriptions.push(this.timeSheetService.remove(timeSheet.dataItem).subscribe(() => {
          this.initGridDataSource();
        }));
      }
    });
  }

  /**
   * Open the timesheet corresponding to its Id if it exists, otherwise open the timesheet corresponding to the employee,
   * the corresponding month and year selected.
   * @param dataItem
   */
  public goToAdvancedEdit(dataItem) {
    if (dataItem.Id !== NumberConstant.ZERO) {
      this.router.navigateByUrl(TimeSheetConstant.EDIT_URL.concat(dataItem.Id.toString()), {skipLocationChange: true});
    } else {
      const date = new Date(dataItem.Month);
      this.router.navigateByUrl(TimeSheetConstant.EDIT_URL
        .concat(dataItem.IdEmployee.toString())
        .concat('/')
        .concat((+date.getMonth() + NumberConstant.ONE).toString())
        .concat('/')
        .concat(date.getFullYear().toString()), {skipLocationChange: true});
    }
  }

  /**
   * Validate timesheet
   * @param dataItem
   */
  public validateTimesheet(timeSheet: TimeSheet) {
    this.swalWarrings.CreateSwal(SharedConstant.ARE_YOU_SURE_TO_CONTINUE,
      TimeSheetConstant.TITLE_SWAL_WARRING_VALIDATE_TIMESHEET, SharedConstant.VALIDATE, SharedConstant.NO).then((result) => {
      if (result.value) {
        this.subscriptions.push(this.timeSheetService.definitiveValidate(this.connectedEmployee, timeSheet.Id).subscribe(() => {
          this.initGridDataSource();
        }));
      }
    });
  }

  /*
  * condition for validation
  */
  public showValidate(timeSheet: TimeSheet) {
    const validStatusList = [TimeSheetStatusEnumerator.Draft, TimeSheetStatusEnumerator.Sended,
      TimeSheetStatusEnumerator.PartiallyValidated];
    return ((validStatusList.includes(timeSheet.Status)) &&
      /* condition to test and is not my time sheet */
      (timeSheet.IdEmployee !== this.connectedEmployee));
  }

  public initializeState(): State {
    return {
      skip: NumberConstant.ZERO,
      take: NumberConstant.TWENTY,
      // Initial filter descriptor
      filter: {
        logic: 'and',
        filters: []
      }
    };
  }

  public Search(predicate: PredicateFormat) {
    this.preparePredicate();
    if (predicate.Filter.length > NumberConstant.ZERO) {
      Object.assign(this.predicate, predicate);
    }
    this.statusSearchDropdownFormGroup.get(TimeSheetConstant.STATUS).setValue(undefined);
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.initGridDataSource();
  }

  public SendMail(dataItem: TimeSheet) {
    this.subscriptions.push(this.timeSheetService.sendMail(dataItem.IdEmployee,
      dataItem.Month
    ).subscribe(res => {
    }));
  }

  /**
   * this method aims to select all elements of the grid or deselect it
   */
  public onSelectAllChange(checkedState: SelectAllCheckboxState) {
    if (checkedState === SharedConstant.CHECKED as SelectAllCheckboxState) {
      this.timesheetIdsSelected = Object.assign([], this.AllTimesheetIds);
      this.selectAllState = SharedConstant.CHECKED as SelectAllCheckboxState;
    } else {
      this.timesheetIdsSelected = [];
      this.selectAllState = SharedConstant.UNCHECKED as SelectAllCheckboxState;
    }
  }

  onSelectedKeysChange(e) {
    this.gridSettings.gridData.data.forEach(element => {
      this.timesheetIdsSelected.forEach(item => {
        if (element.Id === item) {
          if (element.Id === NumberConstant.ZERO || (element.Status !== TimeSheetStatusEnumerator.Sended &&
            element.Status !== TimeSheetStatusEnumerator.Validated)) {
            this.timesheetIdsSelected.splice(this.timesheetIdsSelected.indexOf(item), NumberConstant.ONE);
            this.growlService.warningNotification(this.translate.instant(TimeSheetConstant.CRA_NOT_SUBMITTED));
          }
        }
      });
    });
    this.selectionLength = this.timesheetIdsSelected.length;
    this.selectionLength === NumberConstant.ZERO ? this.showErrorMessage = true : this.showErrorMessage = false;
    if (this.selectionLength === NumberConstant.ZERO) {
      this.selectAllState = SharedConstant.UNCHECKED as SelectAllCheckboxState;
    } else if (this.selectionLength > NumberConstant.ZERO && this.selectionLength < this.AllTimesheetIds.length) {
      this.selectAllState = SharedConstant.INDETERMINATE as SelectAllCheckboxState;
    } else {
      this.selectAllState = SharedConstant.CHECKED as SelectAllCheckboxState;
    }
  }

  public openValidateCradetails(): void {
    this.timeSheetService.listTimesheetId.next(this.timesheetIdsSelected);
    this.router.navigateByUrl(TimeSheetConstant.VAIDATE_CRA_USER_URL_LIST);
  }

  statusFilter() {
    if (this.statusSearchDropdownFormGroup.get(TimeSheetConstant.STATUS).value >= NumberConstant.ZERO
      && this.statusSearchDropdownFormGroup.get(TimeSheetConstant.STATUS).value !== '') {
      if (this.statusSearchDropdownFormGroup.get(TimeSheetConstant.STATUS).value !== NumberConstant.SIX) {
        this.predicate.Filter.push(new Filter(AdministrativeDocumentConstant.STATUS, Operation.eq,
          this.statusSearchDropdownFormGroup.get(TimeSheetConstant.STATUS).value));
      }
    } else {
      this.selectedStatus = false;
    }
  }

  statusGridFilte(status: number) {
    this.selectedStatus = true;
    this.statusEnum.forEach(element => {
      if (element.value === status) {
        this.validatedStatus = element.name;
      }
    });
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.dataStateChange(this.gridSettings.state);
  }

  filterChange(event) {
    this.statusFilter();
  }

  filterSelected(predicate: PredicateFormat) {
    this.statusSearchDropdownFormGroup.get(TimeSheetConstant.STATUS).setValue(undefined);
    Object.assign(this.predicate, predicate);
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.initGridDataSource();
  }

  infoTimesheet(dataItem) {
    const TITLE = dataItem.IdEmployeeNavigation.FullName;
    this.formModalDialogService.openDialog(TITLE,
      TimesheetInformationsComponent,
      this.viewContainerRef, null, dataItem, true, SharedConstant.MODAL_DIALOG_SIZE_S);
  }

  public onTimeSheetFixRequestClick() {
    this.swalWarrings.CreateSwal(TimeSheetConstant.MAKE_FIX_REQUEST, undefined, SharedConstant.YES, SharedConstant.NO).then((result) => {
      if (result.value) {
        this.subscriptions.push(this.timeSheetService.timeSheetMassiveFixRequest(this.timesheetIdsSelected).subscribe(() => {
          this.initGridDataSource();
          this.timesheetIdsSelected = [];
          this.selectAllState = SharedConstant.UNCHECKED as SelectAllCheckboxState;
        }));
      }
    });
  }

  public fonction(action: string) {
    switch (action) {
      case this.translate.instant(SharedConstant.VALIDATE): {
        this.openValidateCradetails();
        break;
      }
      case this.translate.instant(SharedConstant.FIX_REQUEST): {
        this.onTimeSheetFixRequestClick();
        break;
      }
    }
  }

  selectedAction(action: string) {
    this.fonction(action);
  }

  translateToday() {
    const todayElement = document.getElementsByClassName(SharedConstant.TODAY_CLASS)[NumberConstant.ZERO];
    if (todayElement) {
      todayElement.innerHTML = this.translate.instant(SharedConstant.TODAY);
    }
  }

  ngOnDestroy(): void {
    if (this.subscriptions !== undefined) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
  }

  private createStatusSearchDropdownForm(): void {
    this.statusSearchDropdownFormGroup = this.fb.group({
      Status: ''
    });
  }
  private initTimesheetFiltreConfig() {
    this.filtreFieldsColumns.push(new FiltrePredicateModel(SharedConstant.MONTH_UPPERCASE,
      FieldTypeConstant.MONTH, SharedConstant.MONTH));
    this.filtreFieldsColumns.push(new FiltrePredicateModel(SharedConstant.TEAM_TITLE,
      FieldTypeConstant.TEAM_MULTISELECT_COMPONENT, SharedConstant.TEAM_FIELD));
    this.filtreFieldsColumns.push(new FiltrePredicateModel(SharedConstant.EMPLOYEE_FULL_NAME_TITLE,
      FieldTypeConstant.EMPLOYEE_MULTISELECT_COMPONENT, SharedConstant.EMPLOYEE));
  }

  getFiltrePredicate(filtre) {
    this.gridSettings.state.skip = NumberConstant.ZERO;
    if (!this.predicate.Filter || (this.predicate.Filter && this.predicate.Filter.length === NumberConstant.ZERO)) {
      this.predicate.Filter = new Array<Filter>();
    }
    this.prepareFiltreFromAdvancedSearch(filtre);
  }

  private prepareFiltreFromAdvancedSearch(filtre) {
    if (filtre.prop === SharedConstant.MONTH) {
      this.month = filtre.value;
    }
    if (filtre.prop === SharedConstant.TEAM_FIELD) {
      this.predicate.Filter = this.predicate.Filter.filter(value => value.prop !== AdministrativeDocumentConstant.ID_TEAM);
      const selectedTeams = filtre.value;
      if (selectedTeams && selectedTeams.length > NumberConstant.ZERO) {
        selectedTeams.forEach(Id => {
          this.predicate.Filter.push(new Filter(AdministrativeDocumentConstant.ID_TEAM, Operation.eq, Id, false, true));
        });
      }
    } else if (filtre.prop === SharedConstant.EMPLOYEE) {
      this.predicate.Filter = this.predicate.Filter.filter(value => value.prop !== AdministrativeDocumentConstant.EMPLOYEE_ID);
      const employees  = filtre.value;
      if (employees && employees.length >  NumberConstant.ZERO) {
        employees.forEach(id => {
          this.predicate.Filter.push(new Filter(AdministrativeDocumentConstant.EMPLOYEE_ID, Operation.eq, id, false, true));
        });
      }
    } else {
      if (filtre.type === TypeConstant.date) {
        this.predicate.Filter = this.predicate.Filter.filter(value => value.prop === filtre.prop && value.operation !== filtre.operation);
      } else {
        this.predicate.Filter = this.predicate.Filter.filter(value => value.prop !== filtre.prop);
      }
      if (filtre.operation && filtre.value && !filtre.SpecificFiltre) {
        this.predicate.Filter.push(filtre);
      }
    }
  }
  /**
   * identify the predicate operator AND|OR
   * @param operator
   */
   getOperatorPredicate(operator: Operator) {
    this.predicate.Operator = operator;
  }

  /**
   * Reset dataGrid
   */
   resetClickEvent() {
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.preparePredicate();
    this.initGridDataSource();
  }
}
