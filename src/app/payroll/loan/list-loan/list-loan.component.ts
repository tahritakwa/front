import { Component, OnDestroy, OnInit, ViewContainerRef, ViewChild } from '@angular/core';
import { PagerSettings } from '@progress/kendo-angular-grid';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { Filter, Operation, Operator, PredicateFormat, Relation } from '../../../shared/utils/predicate';
import { State } from '@progress/kendo-data-query';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { LoanTypeConstant } from '../../../constant/payroll/loan-type.constant';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { LoanService } from '../../services/loan/loan.service';
import { LoanConstant } from '../../../constant/payroll/loan.constant';
import { Router } from '@angular/router';
import { AdministrativeDocumentStatusEnumerator } from '../../../models/enumerators/administrative-document-status.enum';
import { CreditTypeEnumerator } from '../../../models/enumerators/credit-type.enum';
import { StarkRolesService } from '../../../stark-permissions/service/roles.service';
import { isNullOrUndefined } from 'util';
import { isNotNullOrUndefinedAndNotEmptyValue, notEmptyValue } from '../../../stark-permissions/utils/utils';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs/Subscription';
import { FiltrePredicateModel } from '../../../models/shared/filtrePredicate.model';
import { FieldTypeConstant } from '../../../constant/shared/fieldType.constant';
import { SearchSessionComponent } from '../../components/search-session/search-session.component';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';

@Component({
  selector: 'app-list-loan',
  templateUrl: './list-loan.component.html',
  styleUrls: ['./list-loan.component.scss']
})
export class ListLoanComponent implements OnInit {
  public filtreFieldsColumns = [];
  public filtreFieldsInputs = [];
  /**
* advanced search predicate
*/
  public predicateAdvancedSearch: PredicateFormat;
  /**
    * quick search predicate
    */
  public predicateQuickSearch: PredicateFormat;

  public statusCode = AdministrativeDocumentStatusEnumerator;
  public creditTypeEnum = CreditTypeEnumerator;
  public canUpdatePays = false;
  // pager settings
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  @ViewChild(SearchSessionComponent) searchSessionComponent: SearchSessionComponent;
  public predicate: PredicateFormat[] = [];
  public gridState: State = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.TWENTY,
    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: []
    }
  };
  /**
* flag to identify the searchType
* advanced search = 0 ,quick search = 1
*/
  public searchType = NumberConstant.ONE;

  public columnsConfig: ColumnSettings[] = [
    {
      field: LoanConstant.ID_EMPLOYEE_NAVIGATION_FULLNAME,
      title: LoanConstant.EMPLOYEE_UPPERCASE,
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: LoanConstant.TYPE,
      title: LoanConstant.TYPE_UPPERCASE,
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: LoanConstant.AMOUNT,
      title: LoanConstant.AMOUNT_UPPERCASE,
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: LoanConstant.OBTAINING_DATE,
      title: LoanConstant.OBTAINING_DATE_UPPERCASE,
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: LoanConstant.MONTHS_NUMBER,
      title: LoanConstant.MONTHS_NUMBER_UPPERCASE,
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: LoanConstant.STATE,
      title: LoanConstant.STATE_UPPERCASE,
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED
    },
  ];

  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };

  public statusFilter: Array<any> = [
    {id: AdministrativeDocumentStatusEnumerator.AllStatus, name: this.translateService.instant(LoanConstant.ALL)},
    {id: AdministrativeDocumentStatusEnumerator.Waiting, name: this.translateService.instant(LoanConstant.WAITING)},
    {id: AdministrativeDocumentStatusEnumerator.Accepted, name: this.translateService.instant(LoanConstant.ACCEPTED)},
    {id: AdministrativeDocumentStatusEnumerator.Refused, name: this.translateService.instant(LoanConstant.REFUSED)}
  ];
  public defaultStatus = this.statusFilter[NumberConstant.ZERO];
  public creditTypeFilter: Array<any> = [
    {id: AdministrativeDocumentStatusEnumerator.AllStatus, name: this.translateService.instant(LoanConstant.ALL)},
    {id: CreditTypeEnumerator.Advance, name: this.translateService.instant(LoanConstant.ADVANCE)},
    {id: CreditTypeEnumerator.Loan, name: this.translateService.instant(LoanConstant.LOAN)}
  ];
  public defaultCreditType = this.creditTypeFilter[NumberConstant.ZERO];
  public loanFormGroup: FormGroup;
  /**
   * permissions
   */
  public hasAddPermission: boolean;
  public hasShowPermission: boolean;
  public hasDeletePermission: boolean;
  public hasUpdatePermission: boolean;

  private subscriptions: Subscription[] = [];
  public state: State = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.NINE,
    // Initial filter descriptor
    filter: {
      logic: SharedConstant.LOGIC_AND,
      filters: []
    }
  };

  constructor(public loanService: LoanService, private swalWarrings: SwalWarring, private authService: AuthService,
              private viewRef: ViewContainerRef, private router: Router, private fb: FormBuilder, private translateService: TranslateService) {
  }

  /**
   * Initialise Component
   */
  ngOnInit() {
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.ADD_LOAN);
    this.hasShowPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.SHOW_LOAN);
    this.hasDeletePermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.DELETE_LOAN);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.UPDATE_LOAN);

    this.initSessionFilreConfig();
    this.initPredicateQuickSearch();
    this.initAdvancedSearchPredicate();
    this.createSearchLoanFormGroup();
    this.initGridDataSource(true);
  }

    
  private initPredicateQuickSearch() {
    this.predicateQuickSearch = new PredicateFormat();
    this.predicateQuickSearch.Filter = new Array<Filter>();
    this.predicateQuickSearch.Relation = new Array<Relation>();
    this.predicateQuickSearch.Relation.push.apply(this.predicateQuickSearch.Relation, [new Relation(LoanConstant.ID_EMPLOYEE_NAVIGATION)]);
    this.predicateQuickSearch.Relation.push.apply(this.predicateQuickSearch.Relation, [new Relation(LoanConstant.ID_LOAN_TYPE_NAVIGATION)]);
  }
  initAdvancedSearchPredicate() {
    this.predicateAdvancedSearch = new PredicateFormat();
    this.predicateAdvancedSearch.Filter = new Array<Filter>();
    this.predicateAdvancedSearch.Relation = new Array<Relation>();
    this.predicateAdvancedSearch.Relation.push.apply(this.predicateAdvancedSearch.Relation, [new Relation(LoanConstant.ID_EMPLOYEE_NAVIGATION)]);
    this.predicateAdvancedSearch.Relation.push.apply(this.predicateAdvancedSearch.Relation, [new Relation(LoanConstant.ID_LOAN_TYPE_NAVIGATION)]);
  }
  private initSessionFilreConfig() {
    this.filtreFieldsColumns.push(new FiltrePredicateModel(this.translateService.instant(SharedConstant.EMPLOYEE_UPPER), FieldTypeConstant.EMPLOYEE_DROPDOWN_TYPE, LoanConstant.ID_EMPLOYEE));
    this.filtreFieldsColumns.push(new FiltrePredicateModel(this.translateService.instant(LoanConstant.CREDIT_TYPE_UPPERCASE), FieldTypeConstant.CREDIT_TYPE_DROPDOWN, LoanConstant.CREDIT_TYPE));
    this.filtreFieldsColumns.push(new FiltrePredicateModel(this.translateService.instant(LoanConstant.OBTAINING_DATE_UPPERCASE), FieldTypeConstant.DATE_TYPE, LoanConstant.OBTAINING_DATE));
    this.filtreFieldsInputs.push(new FiltrePredicateModel(this.translateService.instant(LoanConstant.DISBURSEMENT_DATE_UPPERCASE), FieldTypeConstant.DATE_TYPE, LoanConstant.DISBURSEMENT_DATE));
    this.filtreFieldsInputs.push(new FiltrePredicateModel(this.translateService.instant(LoanConstant.REFUND_START_DATE_UPPERCASE), FieldTypeConstant.inputTypeRefundStartDate, LoanConstant.REFUND_START_DATE));
    this.filtreFieldsInputs.push(new FiltrePredicateModel(this.translateService.instant(SharedConstant.STATE_UPPERCASE), FieldTypeConstant.loanStateComponent, SharedConstant.STATE));
  }
  /**
  * create search form group
  */
  private createSearchLoanFormGroup(): void {
    this.loanFormGroup = this.fb.group({
      IdEmployee: [undefined],
      CreditType: [AdministrativeDocumentStatusEnumerator.AllStatus],
      ObtainingDate: [],
      DisbursementDate: [],
      RefundStartDate: [],
      State: [AdministrativeDocumentStatusEnumerator.AllStatus],
    });
  }
  
  public removeHandler(dataItem): void {
    this.swalWarrings.CreateSwal().then((result) => {
      if (result.value) {
        this.subscriptions.push(this.loanService.remove(dataItem).subscribe(() => {
          this.initGridDataSource();
        }));
      }
    });
  }

  /**
   * Get the loans list from the server
   */
  public initGridDataSource(isQuickSearch?: boolean): void {
    this.setPredicateFiltre(isQuickSearch);
    if (isQuickSearch) {
      this.gridSettings.state.skip = NumberConstant.ZERO;
    }
    this.subscriptions.push(this.loanService.reloadServerSideDataWithListPredicate(this.gridSettings.state, this.predicate,
      SharedConstant.GET_DATA_WITH_SPECIFIC_FILTER)
      .subscribe(data => {
          this.gridSettings.gridData = data;
        }
      ));
  }
  private setPredicateFiltre(isQuickSearch) {
    this.predicate = [];
    if (isQuickSearch) {
      this.state.filter.logic = SharedConstant.LOGIC_AND;
      this.gridSettings.state.filter.logic = SharedConstant.LOGIC_AND;
      this.predicate.push(this.predicateQuickSearch);
    } else {
      this.predicateAdvancedSearch.Operator = Operator.and;
      this.state.filter.logic = SharedConstant.LOGIC_AND;
      this.gridSettings.state.filter.logic = SharedConstant.LOGIC_AND;
      this.predicate.push(this.predicateAdvancedSearch);
    }
  }


  /**
   * this method fis invoked if the page number or filter has changed
   * @param state
   */
  public dataStateChange(state: State): void {
    this.gridSettings.state = state;
    this.subscriptions.push(this.loanService.reloadServerSideDataWithListPredicate(state, this.predicate, SharedConstant.GET_DATA_WITH_SPECIFIC_FILTER).subscribe(data => this.gridSettings.gridData = data));
  }

  public goToAdvancedEdit(dataItem: { Id: string }) {
    this.router.navigateByUrl(LoanConstant.LOAN_EDIT_URL.concat(dataItem.Id));

  }

  /**
* get array<Filtre> from advancedSearchComponenet
* remove old filter property from the predicate filter list
* case filtre type date between
* @param filtre
*/
  getFiltrePredicate(filtre) {
    this.searchType = NumberConstant.ZERO;
    this.prepareFiltreFromAdvancedSearch(filtre);
  }
  /**
* case filtre date between : we don't remove the old filtre date value
* @param filtreFromAdvSearch
* @private
*/
  private prepareFiltreFromAdvancedSearch(filtreFromAdvSearch) {
    this.predicateAdvancedSearch.Filter = this.predicateAdvancedSearch.Filter.filter(value => value.prop !== filtreFromAdvSearch.prop);
    if (filtreFromAdvSearch.isDateFiltreBetween) {
      this.predicateAdvancedSearch.Filter.push(filtreFromAdvSearch.filtres[NumberConstant.ZERO]);
      this.predicateAdvancedSearch.Filter.push(filtreFromAdvSearch.filtres[NumberConstant.ONE]);
    } else if (filtreFromAdvSearch.value || filtreFromAdvSearch.prop === LoanConstant.DISBURSEMENT_DATE
      || filtreFromAdvSearch.prop === LoanConstant.OBTAINING_DATE) {
      this.predicateAdvancedSearch.Filter = this.predicateAdvancedSearch.Filter.filter(value => value.prop !== filtreFromAdvSearch.prop);
      if (filtreFromAdvSearch.operation && isNotNullOrUndefinedAndNotEmptyValue(filtreFromAdvSearch.value) && !filtreFromAdvSearch.SpecificFiltre) {
        this.predicateAdvancedSearch.Filter.push(filtreFromAdvSearch);
      }
    }
  }
  public receiveData(event: any) {
    this.predicateQuickSearch = event.predicate;
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.initGridDataSource(true);
  }
  /**
 * identify the predicate operator AND|OR
 * @param operator
 */
  getOperatorPredicate(operator: Operator) {
    this.predicateAdvancedSearch.Operator = operator;
  }
  /**
   * Reset dataGrid
   */
  resetClickEvent() {
    this.predicateQuickSearch.Filter = [];
    this.predicateAdvancedSearch.Filter = [];
    this.searchSessionComponent.sessionString = SharedConstant.EMPTY;
    this.initGridDataSource(true);
  }

  ngOnDestroy(): void {
    if (this.subscriptions !== undefined) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
  }


}
