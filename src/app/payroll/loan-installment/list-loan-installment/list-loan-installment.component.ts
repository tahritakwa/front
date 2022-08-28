import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PagerSettings} from '@progress/kendo-angular-grid';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {DataSourceRequestState, State} from '@progress/kendo-data-query';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {ColumnSettings} from '../../../shared/utils/column-settings.interface';
import {LoanInstallmentConstant} from '../../../constant/payroll/loan-installment.constant';
import {LoanConstant} from '../../../constant/payroll/loan.constant';
import {GridSettings} from '../../../shared/utils/grid-settings.interface';
import {LoanInstallmentService} from '../../services/loan-installment/loan-installment.service';
import {LoanInstallment} from '../../../models/payroll/loan-installment.models';
import {Filter, Operation, PredicateFormat, Relation} from '../../../shared/utils/predicate';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {SwalWarring} from '../../../shared/components/swal/swal-popup';
import {ValidationService} from '../../../shared/services/validation/validation.service';
import {LoanInstallmentEnumerator} from '../../../models/enumerators/loan-installment.enum';
import {CreditTypeEnumerator} from '../../../models/enumerators/credit-type.enum';
import {Subscription} from 'rxjs/Subscription';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';

@Component({
  selector: 'app-list-loan-installment',
  templateUrl: './list-loan-installment.component.html',
  styleUrls: ['./list-loan-installment.component.scss']
})
export class ListLoanInstallmentComponent implements OnInit {

  @Output() isTouched = new EventEmitter<boolean>();
  @Input() idLoan: number;

  loanInstallmentList: Array<LoanInstallment>;
  loanInstallmentPredicate: PredicateFormat;
  // # gridSettings
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public statusCode = LoanInstallmentEnumerator;
  public isUpdateMode: boolean;
  public formGroup: FormGroup;
  public creditTypeEnum = CreditTypeEnumerator;
  /**
   * permissions
   */
  public hasUpdateLoanInstallmentPermission: boolean;
  public gridState: State = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.TWENTY,
    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: []
    }
  };
  public columnsConfig: ColumnSettings[] = [
    {
      field: LoanInstallmentConstant.MONTH,
      title: LoanInstallmentConstant.MONTH_UPPERCASE,
      filterable: true,
      _width: NumberConstant.THREE_HUNDRED
    },
    {
      field: LoanConstant.AMOUNT,
      title: LoanConstant.AMOUNT_UPPERCASE,
      filterable: true,
      _width: NumberConstant.THREE_HUNDRED
    },
    {
      field: LoanConstant.STATE,
      title: LoanConstant.STATE_UPPERCASE,
      filterable: true,
      editable: false,
      _width: NumberConstant.THREE_HUNDRED
    }
  ];
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };
  private editedRowIndex: number;
  private subscriptions: Subscription[] = [];
 
  constructor(public loanInstallmentService: LoanInstallmentService,
      private swalWarrings: SwalWarring, private validationService: ValidationService, public authService: AuthService) {
    this.preparePredicate();
  }

  get Month(): FormControl {
    return this.formGroup.get(LoanInstallmentConstant.MONTH) as FormControl;
  }

  ngOnInit() {
    this.hasUpdateLoanInstallmentPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.UPDATE_LOANINSTALLMENT);
    this.initLoanInstallmentList();
  }

  public dataStateChange(state: State): void {
    this.gridSettings.state = state;
    this.initLoanInstallmentList();
  }

  public initializeState(): DataSourceRequestState {
    return {
      skip: NumberConstant.ZERO,
      take: NumberConstant.TEN,
      filter: { // Initial filter descriptor
        logic: 'and',
        filters: []
      },
    };
  }

  public formatDate(): string {
    return localStorage.getItem(SharedConstant.FORMAT_DATE);
  }

  /**
   * Edit the column on which the user clicked
   * @param param
   */
  public editHandler({sender, rowIndex, dataItem}) {
    this.isUpdateMode = true;
    this.closeEditor(sender);
    this.formGroup = new FormGroup({
      Id: new FormControl(dataItem.Id),
      State: new FormControl(dataItem.State, Validators.required),
      Month: new FormControl(dataItem.Month, Validators.required),
      Amount: new FormControl(dataItem.Amount, Validators.required),
      IdLoan: new FormControl(dataItem.IdLoan),
    });
    this.editedRowIndex = rowIndex;
    this.isTouched.emit(true);
    sender.editRow(rowIndex, this.formGroup);
    this.receivePaymentStatus(dataItem.State);
  }

  /**
   * Save the new LoanInstallment
   * @param param
   */
  public saveHandler({sender, rowIndex, formGroup, isNew}) {
    if ((formGroup as FormGroup).valid) {
      const loanInstallment: LoanInstallment = formGroup.value;
      this.subscriptions.push(this.loanInstallmentService.save(loanInstallment, isNew, this.loanInstallmentPredicate).subscribe(() => {
        this.initLoanInstallmentList();
      }));
      sender.closeRow(rowIndex);
      this.isTouched.emit(false);
    } else {
      this.validationService.validateAllFormFields(formGroup as FormGroup);
    }
  }

  /**
   * Cancel the add or update of new LoanInstallment
   * @param param0
   */
  public cancelHandler({sender, rowIndex}) {
    this.receivePaymentStatus(1);
    this.closeEditor(sender, rowIndex);
  }

  receivePaymentStatus($event) {
    if ($event !== undefined) {
      this.formGroup.value.State = $event;
    }
  }

  /**
   * Remove an item of LoanInstallment
   * @param param
   */
  public removeHandler({dataItem}) {
    this.swalWarrings.CreateSwal().then((result) => {
      if (result.value) {
        this.subscriptions.push(this.loanInstallmentService.remove(dataItem).subscribe(() => {
          this.initLoanInstallmentList();
        }));
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscriptions !== undefined) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
  }

  private initLoanInstallmentList() {
    this.loanInstallmentList = new Array<LoanInstallment>();
    this.preparePredicate();
    this.subscriptions.push(this.loanInstallmentService.reloadServerSideData(this.gridSettings.state, this.loanInstallmentPredicate).subscribe(res => {
      if (res) {
        res.data.sort((a, b) => a.Month.localeCompare(b.Month));
        res.data.forEach(item => item.Month = new Date(item.Month));
        this.gridSettings.gridData = res;
        this.loanInstallmentList = res.data;
      }
    }));
  }

  private preparePredicate() {
    this.loanInstallmentPredicate = new PredicateFormat();
    this.loanInstallmentPredicate.Filter = new Array<Filter>();
    this.loanInstallmentPredicate.Relation = new Array<Relation>();
    if (this.idLoan !== NumberConstant.ZERO) {
      this.loanInstallmentPredicate.Filter.push(new Filter
      (LoanConstant.ID_LOAN, Operation.eq, this.idLoan, false, false));
      this.loanInstallmentPredicate.Relation.push(new Relation
      (LoanConstant.ID_LOAN_NAVIGATION));
    }
  }

  /**
   * Close the editor
   * @param grid
   * @param rowIndex
   */
  private closeEditor(grid, rowIndex = this.editedRowIndex) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
    this.formGroup = undefined;
    this.isTouched.emit(false);
  }
}
