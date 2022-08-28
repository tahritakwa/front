import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PagerSettings, SelectAllCheckboxState } from '@progress/kendo-angular-grid';
import { SortDescriptor, State } from '@progress/kendo-data-query';
import { Subscription } from 'rxjs/Subscription';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { AdministrativeDocumentConstant } from '../../../constant/payroll/administrative-document-constant';
import { LeaveRequestConstant } from '../../../constant/payroll/leave.constant';
import { FieldTypeConstant } from '../../../constant/shared/fieldType.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { TypeConstant } from '../../../constant/utility/Type.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { AdministrativeDocumentStatusEnumerator } from '../../../models/enumerators/administrative-document-status.enum';
import { Employee } from '../../../models/payroll/employee.model';
import { Leave } from '../../../models/payroll/leave.model';
import { FiltrePredicateModel } from '../../../models/shared/filtrePredicate.model';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { FormModalDialogService } from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { DataTransferShowSpinnerService } from '../../../shared/services/spinner/data-transfer-show-spinner.service';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { Filter, Operation, Operator, OrderBy, OrderByDirection, PredicateFormat, Relation } from '../../../shared/utils/predicate';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { LeaveInformationsComponent } from '../../components/leave-informations/leave-informations/leave-informations.component';
import { EmployeeService } from '../../services/employee/employee.service';
import { LeaveService } from '../../services/leave/leave.service';

const ALL_LEAVE_REQUEST = 'ALL_LEAVE_REQUEST';

@Component({
  selector: 'app-leave-request-list',
  templateUrl: './leave-request-list.component.html',
  styleUrls: ['./leave-request-list.component.scss']
})
export class LeaveRequestListComponent implements OnInit, OnDestroy {

  // If true then the list must contains only requests related to the connected user
  @Input() myLeave;

  @Input() onlyWaiting;

  @Input() onlyFirstLevelOfHierarchy: boolean;

  @Input() searchPredicate: PredicateFormat;
  @Input() showAddButton = true;
  @Output() canValidate = new EventEmitter<any>();

  // Id of the connected User
  connectedEmployee = 0;

  // Enum  wainting , Accepted , Refused, canceled
  public statusCode = AdministrativeDocumentStatusEnumerator;

  // choosenFilter name proprety  => zero = get all requests
  public noFilter = NumberConstant.ZERO;
  choosenFilterNumber = this.noFilter;
  choosenFilter = this.translate.instant(ALL_LEAVE_REQUEST);

  // pager settings
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;

  // predicate Related To the grid
  public predicate: PredicateFormat;
  public predicateLeaveType: PredicateFormat;

  // Get status from column filter
  statusSearchDropdownFormGroup: FormGroup;

  // Leave type in grid
  leaveType: number;

  dateFormat = this.translate.instant(SharedConstant.DATE_FORMAT);
  public listOfAction = LeaveRequestConstant.LEAVE_ACTION;
  public ButtonAction;
  // month from filter
  month: Date;
  public selectAllState: SelectAllCheckboxState = SharedConstant.UNCHECKED as SelectAllCheckboxState;
  public usersIdsSelected: number[] = [];
  public showErrorMessage = false;
  public AllLeavesIds: number[] = [];
  public hasShowPermission = false;
  public hasUpdatePermission = false;
  public hasAddPermission = false;
  public hasDeletePermission = false;
  public hasValidatePermission = false;
  public hasMassiveValidationPermission = false;
  public hasMassiveDeletionPermission = false;
  public hasMassiveRefusalPermission = false;
  //  Grid columns
  public columnsConfig: ColumnSettings[] = [
    {
      field: LeaveRequestConstant.ID_EMPLOYEENAVIGATION_FULL_NAME,
      title: LeaveRequestConstant.EMPLOYEE,
      _width: NumberConstant.TWO_HUNDRED,
      filterable: true,
    },
    {
      field: SharedConstant.START_DATE,
      title: SharedConstant.START_DATE_UPPERCASE,
      _width: NumberConstant.ONE_HUNDRED_FIFTY,
      filterable: true,
      format: this.dateFormat,
    },
    {
      field: SharedConstant.END_DATE,
      title: SharedConstant.END_DATE_UPPERCASE,
      _width: NumberConstant.ONE_HUNDRED_FIFTY,
      filterable: true,
      format: this.dateFormat,
    },
    {
      field: LeaveRequestConstant.ID_LEAVE_TYPE_NAVIGATION_LABEL,
      title: LeaveRequestConstant.TYPE,
      _width: NumberConstant.TWO_HUNDRED,
      filterable: true
    },
    {
      field: LeaveRequestConstant.TREATED_BY_NAVIGATION_FULL_NAME,
      title: LeaveRequestConstant.TREATED_BY_UPPERCASE,
      _width: NumberConstant.TWO_HUNDRED,
      filterable: true
    },
    {
      field: LeaveRequestConstant.TREATMENT_DATE,
      title: LeaveRequestConstant.TREATMENT_DATE_UPPERCASE,
      format: this.dateFormat,
      _width: NumberConstant.ONE_HUNDRED_FIFTY,
      filterable: true
    },
    {
      field: LeaveRequestConstant.STATUS,
      title: LeaveRequestConstant.STATE_TITLE,
      _width: NumberConstant.ONE_HUNDRED_FIFTY,
      filterable: true
    }
  ];
  public gridSettings: GridSettings = {
    state: this.initializeState(),
    columnsConfig: this.columnsConfig,
  };
  public sort: SortDescriptor[] = [{
    field: LeaveRequestConstant.ID_EMPLOYEENAVIGATION_FULL_NAME,
    dir: 'asc'
  }];
  private subscriptions: Subscription[] = [];
  public filtreFieldsColumns = [];
  public filtreFieldsInputs = [];

  constructor(private router: Router, private swalWarrings: SwalWarring,
              public leaveService: LeaveService,
              public employeeService: EmployeeService,
              private translate: TranslateService,
              private dataTransferShowSpinnerService: DataTransferShowSpinnerService,
              private fb: FormBuilder,
              private formModalDialogService: FormModalDialogService,
              private growlService: GrowlService,
              private viewContainerRef: ViewContainerRef,
              public authService: AuthService) { }

  get Status(): FormControl {
    return this.statusSearchDropdownFormGroup.get(LeaveRequestConstant.STATUS) as FormControl;
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

  ngOnInit(): void {
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.ADD_LEAVE);
    this.hasShowPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.SHOW_LEAVE);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.UPDATE_LEAVE);
    this.hasDeletePermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.DELETE_LEAVE);
    this.hasValidatePermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.VALIDATE_LEAVE);
    this.canValidate.emit(this.hasValidatePermission);
    this.hasMassiveValidationPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.MASSIVE_VALIDATE_LEAVE);
    this.hasMassiveDeletionPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.MASSIVE_DELETE_LEAVE);
    this.hasMassiveRefusalPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.MASSIVE_REFUSE_LEAVE);
    this.createStatusSearchDropdownForm();
    this.employeeService.getConnectedEmployee().subscribe((res: Employee) => {
      this.connectedEmployee = res.Id;
      this.preparePredicate();
      this.initLeaveFiltreConfig();
      this.initGridDataSource();
    });
  }

  public onSelectedKeysChange(e) {
    const selectionLength = this.usersIdsSelected.length;
    selectionLength === NumberConstant.ZERO ? this.showErrorMessage = true : this.showErrorMessage = false;
    if (selectionLength === NumberConstant.ZERO) {
      this.selectAllState = SharedConstant.UNCHECKED as SelectAllCheckboxState;
    } else if (selectionLength > NumberConstant.ZERO && selectionLength < this.AllLeavesIds.length) {
      this.selectAllState = SharedConstant.INDETERMINATE as SelectAllCheckboxState;
    } else {
      this.selectAllState = SharedConstant.CHECKED as SelectAllCheckboxState;
    }
  }

  public openValidateusersdetails(): void {
    this.leaveService.listLeaveId.next(this.usersIdsSelected);
    this.router.navigateByUrl(LeaveRequestConstant.VAIDATE_LEAVE_USER_URL_LIST);
  }

  statusFilter() {
    if (this.Status.value >= NumberConstant.ZERO && this.Status.value !== '') {
      if (this.Status.value !== NumberConstant.FIVE) {
        this.predicate.Filter.push(new Filter(AdministrativeDocumentConstant.STATUS, Operation.eq, this.Status.value));
      }
    }
  }

  /**
   * Navigate to the next page
   * @param dataItem
   */
  public goToAdvancedEdit(id) {
    this.router.navigateByUrl(LeaveRequestConstant.EDIT_URL.concat(id), {skipLocationChange: true});
  }

  /**
   * Validate leave
   * @param dataItem
   */
  public validateLeave(dataItem) {
    this.swalWarrings.CreateSwal(LeaveRequestConstant.VALIDATE_LEAVE_REQUEST_ALERT,
      null, AdministrativeDocumentConstant.OKAY).then((result) => {
      if (result.value) {
        const leave = Object.assign({}, dataItem);
        this.subscriptions.push(this.leaveService.validateLeaveRequest(leave).subscribe(() => {
          this.initGridDataSource();
        }));
      }
    });
  }

  /**
   * Initialize Data
   */
  public initGridDataSource(predicate?: PredicateFormat) {
    if (this.myLeave || this.onlyFirstLevelOfHierarchy) {
      this.dataTransferShowSpinnerService.setShowSpinnerValue(true);
    }
    this.subscriptions.push(this.leaveService.getLeaveRequestsWithHierarchy(this.gridSettings.state, this.predicate,
      this.onlyFirstLevelOfHierarchy, false, this.month).subscribe(result => {
      if (result) {
        this.gridSettings.gridData = result;
        if (this.hasMassiveRefusalPermission || this.hasMassiveDeletionPermission || this.hasMassiveRefusalPermission) {
          this.AllLeavesIds = result.data.map(element => element.Id);
        }
      }
    }));
  }


  /**
   * Prepare Predicate
   */
  public preparePredicate(): void {
    this.predicate = new PredicateFormat();
    this.predicate.Relation = new Array<Relation>();
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(LeaveRequestConstant.ID_EMPLOYEE_NAVIGATION),
      new Relation(LeaveRequestConstant.ID_LEAVE_TYPE_NAVIGATION), new Relation(LeaveRequestConstant.TREATED_BY_NAVIGATION)]);
    this.predicate.Filter = new Array<Filter>();
    if (this.connectedEmployee) {
      if (this.myLeave) {
        this.predicate.Filter.push(new Filter(LeaveRequestConstant.ID_EMPLOYEE, Operation.eq, this.connectedEmployee));
      } else {
        if (this.onlyWaiting) {
          this.predicate.Filter.push(new Filter(LeaveRequestConstant.ID_EMPLOYEE, Operation.neq, this.connectedEmployee));
          this.predicate.Filter.push(new Filter(LeaveRequestConstant.STATUS, Operation.eq, this.statusCode.Waiting));
        }
      }
    }
    if (this.choosenFilterNumber !== 0) {
      this.predicate.Filter.push(new Filter(LeaveRequestConstant.STATUS, Operation.eq, this.choosenFilterNumber));
    }
    this.predicate.OrderBy = new Array<OrderBy>();
    this.predicate.OrderBy.push(new OrderBy(LeaveRequestConstant.ID, OrderByDirection.desc));
  }

  /**
   * Remove line
   * @param param0
   */
  public removeHandler(dataItem) {
    this.swalWarrings.CreateSwal().then((result) => {
      if (result.value) {
        this.subscriptions.push(this.leaveService.remove(dataItem).subscribe(() => {
          this.initGridDataSource();
        }));
      }
    });
  }

  /**
   * Data changed listener
   * @param state
   */
  public dataStateChange(state: State): void {
    this.gridSettings.state = state;
    this.preparePredicate();
    if (this.searchPredicate.Filter.length > NumberConstant.ZERO) {
      this.searchPredicate.Filter.forEach(searchFilter => {
        this.predicate.Filter.push(searchFilter);
      });
    }
    this.statusFilter();
    if (this.leaveType) {
      this.predicate.Filter.push(new Filter(LeaveRequestConstant.ID_LEAVE_TYPE, Operation.eq, this.leaveType));
    }
    this.subscriptions.push(this.leaveService.getLeaveRequestsWithHierarchy(state, this.predicate,
      this.onlyFirstLevelOfHierarchy, false, this.month).subscribe(data => this.gridSettings.gridData = data));
  }

  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.initGridDataSource();
  }

  /**
   * onChange Status PurchaseOrder
   */
  public onChangeStatus(status: number) {
    if (status === this.noFilter) {
      this.choosenFilter = this.translate.instant(ALL_LEAVE_REQUEST);
    } else {
      this.choosenFilter = this.translate.instant(this.statusCode[status].toUpperCase());
    }
    this.choosenFilterNumber = status;
    this.preparePredicate();
    this.initGridDataSource();
  }

  public doSearch(predicate) {
    Object.assign(this.predicate, predicate);
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.initGridDataSource();
  }

  statusGridFilter(event) {
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.dataStateChange(this.gridSettings.state);
  }

  leaveTypeFilter(leaveType: number) {
    this.leaveType = leaveType;
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.dataStateChange(this.gridSettings.state);
  }

  leaveDetails(leave: Leave) {
    const TITLE = leave.IdEmployeeNavigation.FullName;
    const data = {};
    data[LeaveRequestConstant.LEAVE_UPPER] = leave;
    this.subscriptions.push(this.leaveService.CalculateLeaveBalance(leave).subscribe(result => {
      this.formModalDialogService.openDialog(TITLE,
        LeaveInformationsComponent,
        this.viewContainerRef, null, result, true, SharedConstant.MODAL_DIALOG_SIZE_S);
    }));
  }

  public deleteMassiveLeave() {
    this.swalWarrings.CreateSwal(LeaveRequestConstant.DELETE_LEAVE_ALERT, undefined, SharedConstant.YES, SharedConstant.NO)
      .then((result) => {
        if (result.value) {
          this.subscriptions.push(this.leaveService.deleteMassiveLeave(this.usersIdsSelected).subscribe(() => {
            this.refreshGrid();
          }));
        }
      });
  }

  public refuseMassiveLeave() {
    this.swalWarrings.CreateSwal(LeaveRequestConstant.REFUS_LEAVE_ALERT, undefined, SharedConstant.YES, SharedConstant.NO)
      .then((result) => {
        if (result.value) {
          this.subscriptions.push(this.leaveService.refuseMassiveLeave(this.usersIdsSelected).subscribe(() => {
            this.refreshGrid();
          }));
        }
      });
  }

  refreshGrid() {
    this.initGridDataSource();
    this.usersIdsSelected = [];
    this.selectAllState = SharedConstant.UNCHECKED as SelectAllCheckboxState;
  }

  public selectedFunction() {
    switch (this.ButtonAction) {
      case this.translate.instant(SharedConstant.VALIDATE): {
        this.openValidateusersdetails();
        break;
      }
      case this.translate.instant(SharedConstant.DELETE): {
        this.deleteMassiveLeave();
        break;
      }
      case this.translate.instant(SharedConstant.REFUSE): {
        this.refuseMassiveLeave();
        break;
      }
    }
  }

  selectedAction(action: string) {
    this.ButtonAction = action;
    if (this.usersIdsSelected.length > NumberConstant.ZERO) {
      this.selectedFunction();
    } else {
      this.growlService.warningNotification(this.translate.instant(SharedConstant.SELECTED_WARNING_MSG));
    }
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
      Status: '',
      IdLeaveType: [NumberConstant.ZERO]
    });
  }

  private initLeaveFiltreConfig() {
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
    this.month = undefined;
    this.preparePredicate();
    this.initGridDataSource();
  }
}
