import { Component, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PagerSettings } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { Subscription } from 'rxjs/Subscription';
import { AdministrativeDocumentConstant } from '../../../constant/payroll/administrative-document-constant';
import { SharedDocumentConstant } from '../../../constant/payroll/shared-document.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { TranslationKeysConstant } from '../../../constant/shared/translation-keys.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { Employee } from '../../../models/payroll/employee.model';
import { EmployeeService } from '../../../payroll/services/employee/employee.service';
import { FormModalDialogService } from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { Filter, Operation, PredicateFormat, Relation, OrderBy, Operator } from '../../../shared/utils/predicate';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { SharedDocumentService } from '../../services/shared-document/shared-document.service';
import { AddSharedDocumentComponent } from '../add-shared-document/add-shared-document.component';
import { FiltrePredicateModel } from '../../../models/shared/filtrePredicate.model';
import { isNotNullOrUndefinedAndNotEmptyValue } from '../../../stark-permissions/utils/utils';
import { FieldTypeConstant } from '../../../constant/shared/fieldType.constant';

@Component({
  selector: 'app-list-shared-document',
  templateUrl: './list-shared-document.component.html',
  styleUrls: ['./list-shared-document.component.scss']
})
export class ListSharedDocumentComponent implements OnInit, OnDestroy {
  // connected User
  public connectedUser;
  public connectedEmployee: Employee;
  public hasListOwnedSharedDocumentRight = false;
  // pager settings
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public hasAddDocumentPermission = false;
  public gridState: State = this.initState();

  public statusList = AdministrativeDocumentConstant.LEAVE_STATUS;

  public columnsConfig: ColumnSettings[] = [
    {
      field: SharedDocumentConstant.FULLNAME_ID_EMPLOYEE_NAVIGATION,
      title: SharedDocumentConstant.EMPLOYEE_UPPERCASE,
      _width: NumberConstant.TWO_HUNDRED_FIFTY,
      filterable: false
    },
    {
      field: SharedDocumentConstant.LABEL_FROM_ID_TYPE_NAVIGATION,
      title: SharedDocumentConstant.TYPE_UPPERCASE,
      _width: NumberConstant.THREE_HUNDRED,
      filterable: false
    },
    {
      field: SharedDocumentConstant.SUBMISSION_DATE,
      title: SharedDocumentConstant.SUBMISSION_DATE_UPPERCASE,
      _width: NumberConstant.THREE_HUNDRED,
      format: this.translate.instant(SharedConstant.DATE_FORMAT),
      filterable: false
    },
    {
      field: SharedDocumentConstant.TRANSACTION_USER_FULLNAME,
      title: SharedDocumentConstant.SENDER_TITLE,
      _width: NumberConstant.TWO_HUNDRED_FIFTY,
      filterable: false
    },
    {
      field: SharedDocumentConstant.FILES_INFOS,
      title: SharedDocumentConstant.FILES_UPPERCASE,
      _width: NumberConstant.SIX_HUNDRED,
      filterable: false
    }
  ];
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };
  startDate: Date;
  endDate: Date;
  private subscriptions: Subscription[] = [];
  /**
   * advanced search predicate
   */
  public predicateAdvancedSearch: PredicateFormat;
  public quickSearchPredicate: PredicateFormat;
  public initialColumnsForFilter: FiltrePredicateModel[] = [];
  public columnsToBeAddForFilter: FiltrePredicateModel[] = [];
  public predicate: PredicateFormat[] = [];
  public hasAddPermission: boolean;
  constructor(public sharedDocumentService: SharedDocumentService,
              private employeeService: EmployeeService, private translate: TranslateService,
              private viewRef: ViewContainerRef, private formModalDialogService: FormModalDialogService,
              public authService: AuthService) {
  }

  ngOnInit() {
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.ADD_SHAREDDOCUMENT);
    const dataUser = localStorage.getItem(SharedConstant.USER);
    this.connectedUser = JSON.parse(dataUser);
    this.prepareColumnsForFilter();
    this.prepareInitialPredicate();
    this.initGridDataSource();
  }

  initializeData(event) {
    Object.assign(this.predicate, event);
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.initGridDataSource();
  }
  getFilterPredicate(filter) {
    this.predicate = [];
    this.prepareFilterFromAdvancedSearch(filter);
    this.predicate.push(this.mergefilters());
  }
   /**
   * case filtre date between : we don't remove the old filtre date value
   * @param filtre
   * @private
   */
  private prepareFilterFromAdvancedSearch(filtre) {
    this.predicateAdvancedSearch.Filter =
      this.predicateAdvancedSearch.Filter.filter(value => value.prop !== filtre.prop);
    if (filtre.isDateFiltreBetween && filtre.filtres) {
      this.predicateAdvancedSearch.Filter.push(filtre.filtres[NumberConstant.ZERO]);
      this.predicateAdvancedSearch.Filter.push(filtre.filtres[NumberConstant.ONE]);
    } else if (filtre.operation && isNotNullOrUndefinedAndNotEmptyValue(filtre.value) && !filtre.SpecificFiltre) {
      this.predicateAdvancedSearch.Filter.push(filtre);
    }
    if (filtre.prop === SharedConstant.EMPLOYEE) {
      this.predicateAdvancedSearch.Filter =
       this.predicateAdvancedSearch.Filter.filter(value => value.prop !== AdministrativeDocumentConstant.EMPLOYEE_ID);
      const employees  = filtre.value;
      if (employees && employees.length >  NumberConstant.ZERO) {
        employees.forEach(id => {
          this.predicateAdvancedSearch.Filter.push(new Filter(AdministrativeDocumentConstant.EMPLOYEE_ID, Operation.eq, id, false, true));
        });
      }
    }
  }
  mergefilters() {
    let predicate = new PredicateFormat();
     if (this.predicateAdvancedSearch) {
       this.cloneAdvancedSearchPredicate(predicate);
     }
    if (this.quickSearchPredicate.Filter.length !== NumberConstant.ZERO) {
      predicate.Filter = predicate.Filter.concat(this.quickSearchPredicate.Filter);
    }
    return (predicate);
  }
  public cloneAdvancedSearchPredicate(targetPredicate: PredicateFormat){
    targetPredicate.Filter = this.predicateAdvancedSearch.Filter;
    targetPredicate.IsDefaultPredicate = this.predicateAdvancedSearch.IsDefaultPredicate;
    targetPredicate.Operator = this.predicateAdvancedSearch.Operator;
    targetPredicate.OrderBy = this.predicateAdvancedSearch.OrderBy;
    targetPredicate.Relation = this.predicateAdvancedSearch.Relation;
    targetPredicate.SpecFilter = this.predicateAdvancedSearch.SpecFilter;
    targetPredicate.SpecificRelation = this.predicateAdvancedSearch.SpecificRelation;
    targetPredicate.page = this.predicateAdvancedSearch.page;
    targetPredicate.pageSize = this.predicateAdvancedSearch.pageSize;
    targetPredicate.values = this.predicateAdvancedSearch.values;
  }
  private prepareInitialPredicate() {
    const predicate = this.preparePredicate();
    this.predicate.push(predicate);
    const predicateAdv = this.preparePredicate();
    const predicateQuick = this.preparePredicate();
    this.predicateAdvancedSearch = predicateAdv;
    this.quickSearchPredicate = predicateQuick;
  }
  /**
   * Prepare Predicate
   */
  public preparePredicate() {
    const predicate = new PredicateFormat();
    predicate.Relation = new Array<Relation>();
    predicate.OrderBy = new Array<OrderBy>();
    predicate.Filter = new Array<Filter>();
    predicate.Relation.push.apply(predicate.Relation, [new Relation(SharedDocumentConstant.ID_TYPE_NAVIGATION)]);
    predicate.Relation.push.apply(predicate.Relation, [new Relation(SharedDocumentConstant.ID_EMPLOYEE_NAVIGATION)]);
    predicate.Relation.push.apply(predicate.Relation, [new Relation(SharedDocumentConstant.TRANSACTION_USER_NAVIGATION)]);
    return predicate;
  }

  public initState(): State {
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
   /**
 * identify the predicate operator AND|OR
 * @param operator
 */
getOperatorPredicate(operator: Operator) {
  this.predicateAdvancedSearch.Operator = operator;
}
/**
   * To prepare for advanced search
   */
  public prepareColumnsForFilter() {
    this.initialColumnsForFilter.push(new FiltrePredicateModel(SharedConstant.BY_TYPE,
       FieldTypeConstant.DOCUMENT_REQUEST_TYPE_DROPDOWN_COMPONENT,
      SharedDocumentConstant.ID_TYPE));
      this.initialColumnsForFilter.push(new FiltrePredicateModel(SharedConstant.EMPLOYEE_FULL_NAME_TITLE,
        FieldTypeConstant.EMPLOYEE_MULTISELECT_COMPONENT, SharedConstant.EMPLOYEE));
      this.initialColumnsForFilter.push(new FiltrePredicateModel(SharedConstant.SUBMISSION_DATE, FieldTypeConstant.DAY_DATE_TYPE,
        SharedDocumentConstant.SUBMISSION_DATE));
  }

  public initGridDataSource() {
    this.employeeService.getConnectedEmployee().subscribe(dataResult => {
      this.connectedEmployee = dataResult;
      this.hasListOwnedSharedDocumentRight =
      this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.LIST_OWNED_SHARED_DOCUMENT);
      if (this.hasListOwnedSharedDocumentRight) {
        this.predicate[0].Filter.push(new Filter(SharedDocumentConstant.ID_EMPLOYEE, Operation.eq, this.connectedEmployee.Id));
      }
      this.subscriptions.push(this.sharedDocumentService.reloadServerSideDataWithListPredicate(this.gridSettings.state,
         this.predicate, SharedConstant.GET_DATA_WITH_SPECIFIC_FILTER)
      .subscribe( res => {
        this.gridSettings.gridData = res;
      }));
    });
  }
  /**
   * this method is invoked if the page number or filter has changed
   * @param state
   */
  public dataStateChange(state: State): void {
    this.gridSettings.state = state;
    this.initGridDataSource();
  }
  resetClickEvent() {
    this.predicate = [];
    this.predicate.push(this.mergefilters());
    this.predicate[NumberConstant.ZERO].Filter = [];
    this.initGridDataSource();
  }
  addNewDocument() {
    const TITLE = TranslationKeysConstant.SHARE_DOCUMENT;
    this.formModalDialogService.openDialog(TITLE, AddSharedDocumentComponent,
      this.viewRef, this.initGridDataSource.bind(this), null, true, SharedConstant.MODAL_DIALOG_CLASS_M);
  }

  ngOnDestroy(): void {
    if (this.subscriptions !== undefined) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
  }
}
