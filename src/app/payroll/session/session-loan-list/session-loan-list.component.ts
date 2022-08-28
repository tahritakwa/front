import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PagerSettings, RowArgs, SelectAllCheckboxState } from '@progress/kendo-angular-grid';
import { FilterDescriptor, State } from '@progress/kendo-data-query';
import { EnumValues } from 'enum-values';
import { Subscription } from 'rxjs/Subscription';
import { BonusConstant } from '../../../constant/payroll/bonus.constant';
import { ContractConstant } from '../../../constant/payroll/Contract.constant';
import { EmployeeConstant } from '../../../constant/payroll/employee.constant';
import { LoanInstallmentConstant } from '../../../constant/payroll/loan-installment.constant';
import { LoanConstant } from '../../../constant/payroll/loan.constant';
import { PayslipConstant } from '../../../constant/payroll/payslip.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { CreditTypeEnumerator } from '../../../models/enumerators/credit-type.enum';
import { PayrollSessionState } from '../../../models/enumerators/session-state.enum';
import { SessionLoanInstallment } from '../../../models/payroll/session-loan-installment.model';
import { Session } from '../../../models/payroll/session.model';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { Filter, Operation, PredicateFormat } from '../../../shared/utils/predicate';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { SessionService } from '../../services/session/session.service';
const PREVIOUS_URL = 'main/payroll/bonus/';

@Component({
  selector: 'app-session-loan-list',
  templateUrl: './session-loan-list.component.html',
  styleUrls: ['./session-loan-list.component.scss']
})
export class SessionLoanListComponent implements OnInit {
  public isClosed: boolean;
  public idSession: number;
  sessionInfos: Session = new Session();
  sessionLoansList: Array<SessionLoanInstallment> = [];
  public gridData: any;
  public canNotUpdatePays = false;
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public selectedContractIds: any[] = [];
  public selectedSessionLoanIds: number[] = [];
  public selectAllState: SelectAllCheckboxState = SharedConstant.UNCHECKED as SelectAllCheckboxState;
  public AllContractIds: any[] = [];
  public payrollSessionState = PayrollSessionState;
  public gridState: State = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.TEN,
    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: []
    }
  };
  // predicate to prepare call server
  predicate: PredicateFormat;
  // variable to execute or not onSelectionChange method
  public executeSelection = true;
  creditTypeDropdownFormGroup: FormGroup;
  selectedCreditType = false;
  public creditTypeEnumeration = CreditTypeEnumerator;
  public creditTypeEnum = EnumValues.getNamesAndValues(CreditTypeEnumerator);
  validatedCreditType: string;
  public hasUpdatePayrollSessionPermission: boolean;
  public columnsConfig: ColumnSettings[] = [
    {
      field: EmployeeConstant.REGISTRATION_NUMBER,
      title: EmployeeConstant.REGISTRATION_NUMBER_UPPERCASE,
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: EmployeeConstant.FULL_NAME,
      title: EmployeeConstant.EMPLOYEE,
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: ContractConstant.CODE,
      title: ContractConstant.CONTRACT_TYPE_UPPERCASE,
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: LoanConstant.CREDIT_TYPE,
      title: LoanConstant.CREDIT_TYPE_UPPERCASE,
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: LoanConstant.VALUE,
      title: LoanConstant.DEADLINE_ACTION,
      filterable: false,
      _width: NumberConstant.TWO_HUNDRED
    },
  ];
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };
  private subscriptions: Subscription[] = [];

  constructor(private activatedRoute: ActivatedRoute, private sessionService: SessionService,
      private router: Router, private fb: FormBuilder, public authService: AuthService) {
    this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
      this.idSession = params[SharedConstant.ID_LOWERCASE] || NumberConstant.ZERO;
    }));

  }

  get CreditType(): FormControl {
    return this.creditTypeDropdownFormGroup.get(LoanConstant.CREDIT_TYPE) as FormControl;
  }

  public mySelectionKey(context: RowArgs) {
    return context.dataItem.IdLoanInstallment + '_' + context.dataItem.IdContract;
  }

  ngOnInit() {
    this.hasUpdatePayrollSessionPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.UPDATE_SESSION);
    this.preparePredicate();
    this.createCreditTypeDropdownForm();
    this.getLoanInstallmentsFromServer();
    this.getSessionFromServer(this.idSession);
  }

  public preparePredicate() {
    this.predicate = new PredicateFormat();
    this.predicate.Filter = new Array<Filter>();
    this.predicate.pageSize = this.gridSettings.state.take;
    this.predicate.page = this.gridSettings.state.skip / this.gridSettings.state.take + NumberConstant.ONE;
  }

  /**
   * this method will be called to retrieve the session object from the server
   */
  getSessionFromServer(id) {
    this.subscriptions.push(this.sessionService.getById(id).subscribe(data => {
      this.sessionInfos = data;
      this.sessionInfos.Month = new Date(this.sessionInfos.Month);
    }));
  }

  /**
   * this method will be called to get loan installments related to session from the server
   */
  public getLoanInstallmentsFromServer() {
    this.subscriptions.push(this.sessionService.getListOfLoanInstallmentForSession(this.predicate, this.idSession).subscribe(data => {
      this.selectedSessionLoanIds = [];
      data.SessionLoanInstallment.forEach(element => {
        if (element.IdSelected !== NumberConstant.ZERO) {
          this.selectedSessionLoanIds.push(element.IdSelected);
        }
      });
      this.gridSettings.gridData = data.SessionLoanInstallment;
      this.gridSettings.gridData.data = data.SessionLoanInstallment.slice(NumberConstant.ZERO, this.gridSettings.state.take);
      this.gridSettings.gridData.total = data.Total;
      this.setSelectionState();
    }));
  }

  /**
   * this method will be called to navigate to next url
   */
  public onNextClick() {
    this.sessionInfos.State = PayrollSessionState.Loan;
    this.subscriptions.push(this.sessionService.updateSessionStates(this.sessionInfos).subscribe(res => {
      this.router.navigateByUrl(PayslipConstant.PAYSLIP_URL.concat(this.idSession.toString()), {skipLocationChange: true});
    }));
  }

  /// Got to previous state of session
  public onPreviousClik(): void {
    this.router.navigateByUrl(BonusConstant.BONUS_URL.concat(this.idSession.toString()), {skipLocationChange: true});
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
        if (element.field.toString() === EmployeeConstant.REGISTRATION_NUMBER) {
          this.predicate.Filter.push(new Filter(LoanInstallmentConstant.REGISTRATION_NUMBER_LOAN_NAVIGATION, Operation.contains, element.value));
        } else if (element.field.toString() === EmployeeConstant.FULL_NAME) {
          this.predicate.Filter.push(new Filter(LoanInstallmentConstant.FULLNAME_LOAN_NAVIGATION, Operation.contains, element.value));
        } else if (element.field.toString() === LoanConstant.VALUE) {
          this.predicate.Filter.push(new Filter(LoanConstant.AMOUNT, Operation.gte, element.value));
        }
      });
    }
    this.creditTypeFilter();
    this.getLoanInstallmentsFromServer();
  }

  /**
   * this method will be called when selecting one element
   */
  public onSelectionChange(event) {
    if (this.executeSelection) {
      let idContract;
      let idLoanInstallment;
      let idSelected;
      let value;
      if (event.deselectedRows.length !== NumberConstant.ZERO) {
        idContract = event.deselectedRows[NumberConstant.ZERO].dataItem.IdContract;
        idLoanInstallment = event.deselectedRows[NumberConstant.ZERO].dataItem.IdLoanInstallment;
        value = event.deselectedRows[NumberConstant.ZERO].dataItem.Value;
        idSelected = event.deselectedRows[NumberConstant.ZERO].dataItem.IdSelected;
      }
      if (event.selectedRows.length !== NumberConstant.ZERO) {
        idContract = event.selectedRows[NumberConstant.ZERO].dataItem.IdContract;
        idLoanInstallment = event.selectedRows[NumberConstant.ZERO].dataItem.IdLoanInstallment;
        value = event.selectedRows[NumberConstant.ZERO].dataItem.Value;
        idSelected = event.selectedRows[NumberConstant.ZERO].dataItem.IdSelected;
      }
      this.subscriptions.push(this.sessionService.addLoanInstallmentToSession(idContract, this.idSession, idSelected, idLoanInstallment, value).subscribe(data => {
        this.selectedSessionLoanIds = this.selectedSessionLoanIds.filter(element => element !== NumberConstant.ZERO);
        this.getLoanInstallmentsFromServer();
      }));
    }
  }

  public onSelectAllChange(checkedState: SelectAllCheckboxState) {
    this.executeSelection = false;
    let allIds = [];
    let allSelected = checkedState === SharedConstant.CHECKED as SelectAllCheckboxState;
    this.subscriptions.push(this.sessionService.addAllLoanInstallmentToSession(this.predicate, allSelected, this.idSession).subscribe(res => {
      this.executeSelection = true;
      this.getLoanInstallmentsFromServer();
    }));
  }

  /**
   * this method will be called to change the AllSelection state
   */
  public setSelectionState() {
    const selectionLength = this.selectedSessionLoanIds.length;
    if (selectionLength === NumberConstant.ZERO) {
      this.selectAllState = SharedConstant.UNCHECKED as SelectAllCheckboxState;
    } else if (selectionLength === this.gridSettings.gridData.total) {
      this.selectAllState = SharedConstant.CHECKED as SelectAllCheckboxState;
    } else {
      this.selectAllState = SharedConstant.INDETERMINATE as SelectAllCheckboxState;
    }
  }

  activateFilter(creditType: number) {
    this.selectedCreditType = true;
    this.creditTypeEnum.forEach(element => {
      if (element.value === creditType) {
        this.validatedCreditType = element.name;
      }
    });
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.dataStateChange(this.gridSettings.state);
  }

  creditTypeFilter() {
    if (this.CreditType.value >= NumberConstant.ZERO && this.CreditType.value !== '') {
      this.predicate.Filter.push(new Filter(LoanInstallmentConstant.CREDIT_TYPE_LOAN_NAVIGATION, Operation.eq,
        this.CreditType.value));
    } else {
      this.selectedCreditType = false;
    }
  }

  activateContractTypeFilter(idContractType: any) {
    this.predicate.Filter = this.predicate.Filter.filter(element => element.prop !== ContractConstant.CODE);
    if (idContractType) {
      this.predicate.Filter.push(new Filter(ContractConstant.CODE, Operation.eq, idContractType));
    }
    this.getLoanInstallmentsFromServer();
  }

  ngOnDestroy(): void {
    if (this.subscriptions !== undefined) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
  }

  private createCreditTypeDropdownForm(): void {
    this.creditTypeDropdownFormGroup = this.fb.group({
      CreditType: ''
    });
  }
}
