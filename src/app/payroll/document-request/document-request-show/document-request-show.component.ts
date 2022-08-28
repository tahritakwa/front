import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PagerSettings, SelectAllCheckboxState } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { Subscription } from 'rxjs/Subscription';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { DocumentRequestConstant } from '../../../constant/payroll/document-request.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { AdministrativeDocumentStatusEnumerator } from '../../../models/enumerators/administrative-document-status.enum';
import { Employee } from '../../../models/payroll/employee.model';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { Filter, Operation, OrderBy, OrderByDirection, PredicateFormat, Relation } from '../../../shared/utils/predicate';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { DocumentRequestService } from '../../services/document-request/document-request.service';
import { EmployeeService } from '../../services/employee/employee.service';
const ALL_DOCUMENT = 'ALL_DOCUMENT';
const SEPARATOR = '/';
@Component({
  selector: 'app-document-request-show',
  templateUrl: './document-request-show.component.html',
  styleUrls: ['./document-request-show.component.scss']
})
export class DocumentRequestShowComponent implements OnInit, OnDestroy {

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


  @Input() searchPredicate: PredicateFormat;

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
  // Grid columns
  public columnsConfig: ColumnSettings[] = [
    {
      field: DocumentRequestConstant.EMPLOYEE_NAME_FROM_ID_EMPLOYEE_NAVIGATION,
      title: DocumentRequestConstant.EMPLOYEE,
      _width: 180,
      filterable: true
    },
    {
      field: DocumentRequestConstant.ID_DOCUMENT_REQUEST_TYPE_NAVIGATION_LABEL,
      title: DocumentRequestConstant.TYPE_TITLE,
      _width: 160,
      filterable: true
    },
    {
      field: DocumentRequestConstant.SUBMISSION_DATE,
      title: DocumentRequestConstant.SUBMISSION_DATE_UPPERCASE,
      _width: 160,
      format: this.dateFormat,
      filterable: true
    },
    {
      field: DocumentRequestConstant.DEADLINE,
      title: DocumentRequestConstant.DEADLINE_TITLE,
      _width: 160,
      format: this.dateFormat,
      filterable: true
    },
    {
      field: DocumentRequestConstant.TREATED_BY,
      title: DocumentRequestConstant.TREATED_BY_UPPERCASE,
      _width: 190,
      filterable: true
    },
    {
      field: DocumentRequestConstant.TREATMENT_DATE,
      title: DocumentRequestConstant.TREATMENT_DATE_UPPERCASE,
      _width: 160,
      format: this.dateFormat,
      filterable: true
    },
    {
      field: DocumentRequestConstant.STATUS,
      title: DocumentRequestConstant.STATUS_TITLE,
      _width: 160,
      filterable: true
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

  public hasAddPermission: boolean;
  public hasDeletePermission: boolean;
  public hasUpdatePermission: boolean;
  private subscriptions: Subscription[]= [];

  constructor(private router: Router, private swalWarrings: SwalWarring,
              public documentRequestService: DocumentRequestService,
              public employeeService: EmployeeService,
              private translate: TranslateService,
              private growlService: GrowlService,
              private fb: FormBuilder, public authService: AuthService) { }

  ngOnInit() {
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.ADD_DOCUMENTREQUEST);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.UPDATE_DOCUMENTREQUEST);
    this.hasDeletePermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.DELETE_DOCUMENTREQUEST);
    this.createStatusSearchDropdownForm();
    this.subscriptions.push(this.employeeService.getConnectedEmployee().subscribe(
      (res: Employee) => {
        this.connectedEmployee = res.Id;
        this.preparePredicate();
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
    if(todayElement){
      todayElement.innerHTML = this.translate.instant(SharedConstant.TODAY);
    }
  }

  ngOnDestroy(): void {
    if (this.subscriptions !== undefined) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
  }
}
