import {Component, OnDestroy, OnInit, ViewChild, Input} from '@angular/core';
import {DocumentRequestShowComponent} from '../document-request-show/document-request-show.component';
import {AdministrativeDocumentConstant} from '../../../constant/payroll/administrative-document-constant';
import {Filter, PredicateFormat, Operation, Relation, OrderBy, OrderByDirection, Operator} from '../../../shared/utils/predicate';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {StarkRolesService} from '../../../stark-permissions/service/roles.service';
import {isNullOrUndefined} from 'util';
import {notEmptyValue} from '../../../stark-permissions/utils/utils';
import {RoleConfigConstant} from '../../../Structure/_roleConfigConstant';
import {Subscription} from 'rxjs/Subscription';
import { DocumentRequestConstant } from '../../../constant/payroll/document-request.constant';
import { AdministrativeDocumentStatusEnumerator } from '../../../models/enumerators/administrative-document-status.enum';
import { Router } from '@angular/router';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { DocumentRequestService } from '../../services/document-request/document-request.service';
import { EmployeeService } from '../../services/employee/employee.service';
import { TranslateService } from '@ngx-translate/core';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { State } from '@progress/kendo-data-query';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { SelectAllCheckboxState, PagerSettings } from '@progress/kendo-angular-grid';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { Employee } from '../../../models/payroll/employee.model';
import { TypeConstant } from '../../../constant/utility/Type.constant';
import { FiltrePredicateModel } from '../../../models/shared/filtrePredicate.model';
import { FieldTypeConstant } from '../../../constant/shared/fieldType.constant';
import { FileInfo } from '../../../models/shared/objectToSend';
const ALL_DOCUMENT = 'ALL_DOCUMENT';
@Component({
  selector: 'app-document-request-list',
  templateUrl: './document-request-list.component.html',
  styleUrls: ['./document-request-list.component.scss']
})
export class DocumentRequestListComponent implements OnInit, OnDestroy {

  @ViewChild(DocumentRequestShowComponent) documentRequestGrid: DocumentRequestShowComponent;
  public statusList = AdministrativeDocumentConstant.DOCUMENT_STATUS;
  canValidate = false;
  showFilter = false;
  searchPredicate: PredicateFormat;

  public hasAddPermission: boolean;
  public hasDeletePermission: boolean;
  public hasUpdatePermission: boolean;
  public hasShowPermission: boolean;
  private subscriptions: Subscription[] = [];
  // If true then the list must contains only requests related to the connected user
  @Input() myDocument;

  @Input() addButton;

  @Input() onlyWaiting;

  @Input() onlyFirstLevelOfHierarchy;

  @Input() showAllEmployee;
  public listOfAction = DocumentRequestConstant.DOCUMENT_REQUEST_ACTION;
  public ButtonAction;
  // Id of the connected User
  connectedEmployee = 0;

  // Enum  wainting , Accepted , Refused, canceled
  public statusCode = AdministrativeDocumentStatusEnumerator;

  // choosenFilter name proprety  => zero = get all requests
  public noFilter = NumberConstant.ZERO;
  choosenFilterNumber = this.noFilter;
  choosenFilter = this.translate.instant(ALL_DOCUMENT);

  // pager settings
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;

  // predicate Related To the grid
  public predicate: PredicateFormat;

  // entete Filter
  headerFilter: Filter[];

  // Date format from local storage
  private dateFormat = this.translate.instant(SharedConstant.DATE_FORMAT);

  // Get status from column filter
  statusSearchDropdownFormGroup: FormGroup;

  documentType: number;

  // month from filter
  month: Date;
  public documentIdsSelected: number[] = [];
  public showErrorMessage = false;
  public selectAllState: SelectAllCheckboxState = SharedConstant.UNCHECKED as SelectAllCheckboxState;
  public AllDocumentsIds: number[] = [];
  public hasUpdateDocumentPermission = false;
  public filtreFieldsColumns = [];
  public filtreFieldsInputs = [];
  // Grid columns
  public columnsConfig: ColumnSettings[] = [
    {
      field: DocumentRequestConstant.EMPLOYEE_NAME_FROM_ID_EMPLOYEE_NAVIGATION,
      title: DocumentRequestConstant.EMPLOYEE,
      _width: 180,
      filterable: false
    },
    {
      field: DocumentRequestConstant.ID_DOCUMENT_REQUEST_TYPE_NAVIGATION_LABEL,
      title: DocumentRequestConstant.TYPE_TITLE,
      _width: 160,
      filterable: false
    },
    {
      field: DocumentRequestConstant.SUBMISSION_DATE,
      title: DocumentRequestConstant.SUBMISSION_DATE_UPPERCASE,
      _width: 160,
      format: this.dateFormat,
      filterable: false
    },
    {
      field: DocumentRequestConstant.DEADLINE,
      title: DocumentRequestConstant.DEADLINE_TITLE,
      _width: 160,
      format: this.dateFormat,
      filterable: false
    },
    {
      field: DocumentRequestConstant.TREATED_BY,
      title: DocumentRequestConstant.TREATED_BY_UPPERCASE,
      _width: 190,
      filterable: false
    },
    {
      field: DocumentRequestConstant.TREATMENT_DATE,
      title: DocumentRequestConstant.TREATMENT_DATE_UPPERCASE,
      _width: 160,
      format: this.dateFormat,
      filterable: false
    },
    {
      field: DocumentRequestConstant.STATUS,
      title: DocumentRequestConstant.STATUS_TITLE,
      _width: 160,
      filterable: false
    }
  ];
  public gridSettings: GridSettings = {
    state: this.initializeState(),
    columnsConfig: this.columnsConfig,
  };
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

  constructor(private router: Router, private swalWarrings: SwalWarring,
    public documentRequestService: DocumentRequestService,
    public employeeService: EmployeeService,
    private translate: TranslateService,
    private growlService: GrowlService,
    private fb: FormBuilder, public authService: AuthService) {
  }

  ngOnInit() {
    this.searchPredicate = new PredicateFormat();
    this.searchPredicate.Filter = new Array<Filter>();
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.ADD_DOCUMENTREQUEST);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.UPDATE_DOCUMENTREQUEST);
    this.hasDeletePermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.DELETE_DOCUMENTREQUEST);
    this.hasShowPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.SHOW_DOCUMENTREQUEST);

    this.createStatusSearchDropdownForm();
    this.subscriptions.push(this.employeeService.getConnectedEmployee().subscribe(
      (res: Employee) => {
        this.connectedEmployee = res.Id;
        this.preparePredicate();
        this.initLeaveFiltreConfig();
        this.initGridDataSource();
        this.hasUpdateDocumentPermission = true;
      }));
  }

  public onSelectedKeysChange(e) {
    const selectionLength = this.documentIdsSelected.length;
    selectionLength === NumberConstant.ZERO ? this.showErrorMessage = true : this.showErrorMessage = false;
    if (selectionLength === NumberConstant.ZERO) {
      this.selectAllState = SharedConstant.UNCHECKED as SelectAllCheckboxState;
    } else if (selectionLength > NumberConstant.ZERO && selectionLength < this.AllDocumentsIds.length) {
      this.selectAllState = SharedConstant.INDETERMINATE as SelectAllCheckboxState;
    } else {
      this.selectAllState = SharedConstant.CHECKED as SelectAllCheckboxState;
    }
  }
  public openValidatedocumentsdetails(): void {
    this.router.navigate([DocumentRequestConstant.VAIDATE_DOCUMENT_URL_LIST], {queryParams: { listId: this.documentIdsSelected },
      skipLocationChange: true });
  }
  /**
   * Initialize Data
   */
  public initGridDataSource() {
    this.documentRequestService.getDocumentRequestsWithHierarchy(this.gridSettings.state,
      this.predicate, this.onlyFirstLevelOfHierarchy, this.month)
      .subscribe(data => {
        this.gridSettings.gridData = data;
        if (this.hasUpdateDocumentPermission) {
          this.AllDocumentsIds = data.data.map(element => element.Id);
        }
      });
  }
  /**
   * Prepare Predicate
   */
  public preparePredicate(): void {
    this.predicate = new PredicateFormat();
    this.predicate.Relation = new Array<Relation>();
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(DocumentRequestConstant.DOCUMENT_REQUEST_TYPE_NAVIGATION),
      new Relation(DocumentRequestConstant.ID_EMPLOYEE_NAVIGATION), new Relation(DocumentRequestConstant.TREATED_BY_NAVIGATION)]);
    this.initializeFilter();
    this.predicate.OrderBy = new Array<OrderBy>();
    this.predicate.OrderBy.push(new OrderBy(DocumentRequestConstant.ID, OrderByDirection.desc));
  }
  public initializeFilter() {
    this.predicate.Filter = new Array<Filter>();
    if (this.connectedEmployee) {
      if (this.myDocument) {
        this.predicate.Filter.push(new Filter(DocumentRequestConstant.ID_EMPLOYEE, Operation.eq, this.connectedEmployee));
      } else {
        if (this.onlyWaiting) {
          this.predicate.Filter.push(new Filter(DocumentRequestConstant.ID_EMPLOYEE, Operation.neq, this.connectedEmployee));
          this.predicate.Filter.push(new Filter(DocumentRequestConstant.STATUS, Operation.eq, this.statusCode.Waiting));
        }
      }
    }
    if (this.choosenFilterNumber !== 0) {
      this.predicate.Filter.push(new Filter(DocumentRequestConstant.STATUS, Operation.eq, this.choosenFilterNumber));
    }
  }
  /**
   * Remove line
   * @param param0
   */
  public removeHandler({ dataItem }) {
    this.swalWarrings.CreateSwal().then((result) => {
      if (result.value) {
        this.subscriptions.push(this.documentRequestService.remove(dataItem).subscribe(() => {
          this.initGridDataSource();
        }));
      }
    });
  }
  /**
   * Navigate to the next page
   * @param dataItem
   */
  public goToAdvancedEdit(dataItem) {
    this.router.navigateByUrl(DocumentRequestConstant.DOCUMENT_REQUEST_EDIT_URL.concat(dataItem.Id));
  }
  /**
   * Data changed listener
   * @param state
   */
  public dataStateChange(state: State): void {
    this.gridSettings.state = state;
    this.preparePredicate();
    if (this.searchPredicate && this.searchPredicate.Filter && this.searchPredicate.Filter.length > NumberConstant.ZERO) {
      this.searchPredicate.Filter.forEach(searchFilter => {
        this.predicate.Filter.push(searchFilter);
      });
    }
    this.statusFilter();
    if (this.documentType) {
      this.predicate.Filter.push(new Filter(DocumentRequestConstant.ID_DOCUMENT_REQUEST_TYPE, Operation.eq, this.documentType));
    }
    this.initGridDataSource();
  }

  /**
   * onChange Status PurchaseOrder
   */
  public onChangeStatus(status: number) {
    if (status === this.noFilter) {
      this.choosenFilter = this.translate.instant(ALL_DOCUMENT);
    } else {
      this.choosenFilter = this.translate.instant(this.statusCode[status].toUpperCase());
    }
    this.choosenFilterNumber = status;
    this.preparePredicate();
    this.initGridDataSource();
  }

  public doSearch(predicate) {
    if (predicate) {
      Object.assign(this.predicate, predicate);
      this.gridSettings.state.skip = NumberConstant.ZERO;
      this.initGridDataSource();
    }
  }

  private createStatusSearchDropdownForm(): void {
    this.statusSearchDropdownFormGroup = this.fb.group({
      Status: '',
      IdDocumentRequestType: [NumberConstant.ZERO]
    });
  }

  statusFilter() {
    if (this.Status.value >= NumberConstant.ZERO && this.Status.value !== '') {
      if (this.Status.value !== NumberConstant.FIVE) {
        this.predicate.Filter.push(new Filter(DocumentRequestConstant.STATUS, Operation.eq, this.Status.value));
      }
    }
  }

  statusGridFilter(event) {
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.dataStateChange(this.gridSettings.state);
  }

  documentTypeFilter(documentType: number) {
    this.documentType = documentType;
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.dataStateChange(this.gridSettings.state);
  }

  get Status(): FormControl {
    return this.statusSearchDropdownFormGroup.get(DocumentRequestConstant.STATUS) as FormControl;
  }
  public deleteMassiveDocumentRequest() {
    this.swalWarrings.CreateSwal(DocumentRequestConstant.DELETE_DOCUMENT_REQUEST_ALERT, undefined, SharedConstant.YES, SharedConstant.NO)
      .then((result) => {
        if (result.value) {
          this.subscriptions.push(this.documentRequestService.deleteMassiveDocumentRequest(this.documentIdsSelected).subscribe(() => {
            this.initGridDataSource();
          }));
        }
      });
  }
  public refuseMassiveDocumentRequest() {
    this.swalWarrings.CreateSwal(DocumentRequestConstant.REFUS_DOCUMENT_REQUEST_ALERT, undefined, SharedConstant.YES, SharedConstant.NO)
      .then((result) => {
        if (result.value) {
          this.subscriptions.push(this.documentRequestService.refuseMassiveDocumentRequest(this.documentIdsSelected).subscribe(() => {
            this.initGridDataSource();
          }));
        }
      });
  }
  public selectedFunction() {
    switch (this.ButtonAction) {
      case this.translate.instant(SharedConstant.VALIDATE):
      {
        this.openValidatedocumentsdetails();
        break;
      }
      case this.translate.instant(SharedConstant.DELETE):
      {
        this.deleteMassiveDocumentRequest();
        break;
      }
      case this.translate.instant(SharedConstant.REFUSE):
      {
        this.refuseMassiveDocumentRequest();
        break;
      }
    }
  }
  selectedAction(action: string) {
    this.ButtonAction = action;
    if (this.documentIdsSelected.length > NumberConstant.ZERO) {
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
 
 /**
  * Method is use to download files.
  * @param fileInfo
 */
  downLoadFile(fileInfo: FileInfo) {
    let byteArray: any;
    let i = NumberConstant.ZERO;
    while (fileInfo[i]) {
      if (fileInfo[i].FileData) {
        byteArray = new Buffer(fileInfo[i].FileData, 'base64');
      } else {
        byteArray = new Buffer(fileInfo[i].Data.toString(), 'base64');
      }
      const downloadLink = document.createElement('a');
      downloadLink.href = window.URL.createObjectURL(new Blob([byteArray], { type: 'application/octet-stream' }));
      downloadLink.download = fileInfo[i].Name;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      i++;
    }
  }
}
