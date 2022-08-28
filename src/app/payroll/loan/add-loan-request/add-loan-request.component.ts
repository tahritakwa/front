import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { isNullOrUndefined } from 'util';
import { AdministrativeDocumentConstant } from '../../../constant/payroll/administrative-document-constant';
import { EmployeeConstant } from '../../../constant/payroll/employee.constant';
import { LoanConstant } from '../../../constant/payroll/loan.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { AdministrativeDocumentStatusEnumerator } from '../../../models/enumerators/administrative-document-status.enum';
import { CreditTypeEnumerator } from '../../../models/enumerators/credit-type.enum';
import { Employee } from '../../../models/payroll/employee.model';
import { Loan } from '../../../models/payroll/loan.model';
import { ObjectToSend } from '../../../models/sales/object-to-save.model';
import { FileInfo } from '../../../models/shared/objectToSend';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { UserCurrentInformationsService } from '../../../shared/services/utility/user-current-informations.service';
import {
  companyCurrencyPrecision,
  dateValueGT,
  equalValue,
  isNumericWithPrecision,
  ValidationService
} from '../../../shared/services/validation/validation.service';
import { StarkPermissionsService, StarkRolesService } from '../../../stark-permissions/stark-permissions.module';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { LoanService } from '../../services/loan/loan.service';


@Component({
  selector: 'app-add-loan-request',
  templateUrl: './add-loan-request.component.html',
  styleUrls: ['./add-loan-request.component.scss']
})
export class AddLoanRequestComponent implements OnInit, OnDestroy {

  /**
 * Format Date
 */
  public formatDate: string = this.translate.instant(SharedConstant.DATE_FORMAT);
  /**
   * Loan Form Group
   */
  public loanAddFormGroup: FormGroup;
  // Enum  wainting , Accepted , Refused, canceled
  public statusCode = AdministrativeDocumentStatusEnumerator;
  loanRequestToUpdate: Loan;
  public currentEmployee: Employee;
  isUpdateMode = false;
  verifyNetTpPay = false;
  // List of ids of employees that has the connected user as super hierarchical
  public EmployeeHierarchy: number[] = [];
  // The Id of th connected Empployee
  public selectedEmployee = 0;
  /**
   * permissions
   */
  public hasValidatePermission: boolean;
  public hasRefusePermission: boolean;
  public hasUpdatePermission: boolean;
  public hasAddPermission: boolean;
  public hasShowPermission: boolean;

  public loanAttachementFileInfo: Array<FileInfo> = new Array<FileInfo>();
  public isUploadFile = false;
  public loanInstallmentFormGroupTouched = false;
  public netToPay: number;
  public creditTypeFilter: Array<any> = [
    {
      id: CreditTypeEnumerator.Loan,
      name: this.translate.instant(LoanConstant.LOAN)
    },
    {
      id: CreditTypeEnumerator.Advance,
      name: this.translate.instant(LoanConstant.ADVANCE)
    }
  ];
  private id: number;
  private isSaveOperation = false;
  private subscriptions: Subscription[] = [];

  constructor(public loanService: LoanService, private fb: FormBuilder,
              private activatedRoute: ActivatedRoute, private router: Router,
              private validationService: ValidationService,
              private swalWarrings: SwalWarring,
              public authService: AuthService,
      public translate: TranslateService) {
    this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
      this.id = +params[EmployeeConstant.PARAM_ID] || NumberConstant.ZERO;
    }));
  }

  get Reason(): FormControl {
    return this.loanAddFormGroup.get(LoanConstant.REASON) as FormControl;
  }

  get IdEmployee(): FormControl {
    return this.loanAddFormGroup.get(EmployeeConstant.ID_EMPLOYEE) as FormControl;
  }

  get ObtainingDate(): FormControl {
    return this.loanAddFormGroup.get(LoanConstant.OBTAINING_DATE) as FormControl;
  }

  get Amount(): FormControl {
    return this.loanAddFormGroup.get(LoanConstant.AMOUNT) as FormControl;
  }

  get DisbursementDate(): FormControl {
    return this.loanAddFormGroup.get(LoanConstant.DISBURSEMENT_DATE) as FormControl;
  }

  get MonthsNumber(): FormControl {
    return this.loanAddFormGroup.get(LoanConstant.MONTHS_NUMBER) as FormControl;
  }

  get RefundStartDate(): FormControl {
    return this.loanAddFormGroup.get(LoanConstant.REFUND_START_DATE) as FormControl;
  }

  get CreditType(): FormControl {
    return this.loanAddFormGroup.get(LoanConstant.CREDIT_TYPE) as FormControl;
  }

  ngOnInit() {
    this.hasValidatePermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.VALIDATE_LOAN);
    this.hasRefusePermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.REFUSE_LOAN);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.UPDATE_LOAN);
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.ADD_LOAN);
    this.hasShowPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.SHOW_LOAN);
    this.isUpdateMode = this.id > NumberConstant.ZERO;
    this.createAddForm();
    if (this.isUpdateMode) {
      this.getDataToUpdate();
      this.loanAttachementFileInfo = new Array<FileInfo>();
    }
  }

  public createAddForm(loanToUpdate?: Loan) {
    this.loanAddFormGroup = this.fb.group({
      Id: [loanToUpdate ? loanToUpdate.Id : NumberConstant.ZERO],
      Reason: [loanToUpdate ? loanToUpdate.Reason : '', [Validators.required, Validators.maxLength(NumberConstant.FIVE_HUNDRED)]],
      IdEmployee: [{value: loanToUpdate ? loanToUpdate.IdEmployee : undefined, disabled: this.isUpdateMode}, Validators.required],
      CreditType: [loanToUpdate ? loanToUpdate.CreditType : '', [Validators.required]],
      ObtainingDate: [loanToUpdate ? new Date(loanToUpdate.ObtainingDate) : undefined, Validators.required],
      Amount: [{ value: loanToUpdate ? loanToUpdate.Amount : '',
          disabled: loanToUpdate ? loanToUpdate.State === this.statusCode.Accepted : false
        }, { validators: [Validators.required, isNumericWithPrecision(), Validators.min(NumberConstant.ZERO),
          Validators.max(Number.MAX_VALUE)], asyncValidators: companyCurrencyPrecision(this.loanService),
          updateOn: 'blur' }],
      DisbursementDate: [loanToUpdate && loanToUpdate.DisbursementDate ? new Date(loanToUpdate.DisbursementDate) : undefined],
      MonthsNumber: [{
        value: loanToUpdate ? loanToUpdate.MonthsNumber : NumberConstant.ZERO,
        disabled: loanToUpdate ? loanToUpdate.State === this.statusCode.Accepted : false
      }],
      RefundStartDate: [loanToUpdate && loanToUpdate.RefundStartDate ? new Date(loanToUpdate.RefundStartDate) : undefined]
    });
  }

  changeEmployeeDropdownValue($event) {
    if (!isNullOrUndefined($event)) {
      this.currentEmployee = $event.employeeFiltredDataSource
        .filter(x => x.Id === this.loanAddFormGroup.controls[LoanConstant.ID_EMPLOYEE].value)[0];
      this.currentEmployee && this.currentEmployee.HiringDate ? this.ObtainingDate.setValidators([Validators.required,
        dateValueGT(new Observable(o => o.next(this.currentEmployee.HiringDate)))]) : dateValueGT(Observable.of(null));
    }
    this.getNetToPay();
  }

  save() {
    if (this.isUpdateMode) {
      this.disableAcceptedValidators();
    }
    if (this.loanAddFormGroup.valid && (!this.netToPay || (this.netToPay && this.Amount.value <= this.netToPay))) {
      const loanRequestAssign: Loan = Object.assign({}, this.loanRequestToUpdate, this.loanAddFormGroup.value);
      if (this.loanAttachementFileInfo.length !== NumberConstant.ZERO) {
        loanRequestAssign.LoanFileInfo = this.loanAttachementFileInfo;
      }
      this.isSaveOperation = true;
      this.subscriptions.push(this.loanService.save(loanRequestAssign, !this.isUpdateMode).subscribe(() => {
        this.router.navigateByUrl(LoanConstant.LOAN_LIST_URL);
      }));
    } else {
      this.validationService.validateAllFormFields(this.loanAddFormGroup);
    }
  }

  /**
   * Accept or reject request
   * @param state
   */
  public setRequestState(state) {
    if (state === AdministrativeDocumentStatusEnumerator.Accepted) {
      this.setAcceptedValidators();
    } else {
      this.disableAcceptedValidators();
    }
    if (this.loanAddFormGroup.valid && (state === AdministrativeDocumentStatusEnumerator.Refused
      || (state === AdministrativeDocumentStatusEnumerator.Accepted
        && (!this.netToPay || (this.netToPay && this.Amount.value <= this.netToPay))))) {
      this.swalWarrings.CreateSwal(this.getSwalText(state), null, AdministrativeDocumentConstant.OKAY).then(result => {
        if (result.value) {
          const requestToSave: Loan = Object.assign({}, this.loanRequestToUpdate, this.loanAddFormGroup.getRawValue());
          requestToSave.State = state;
          const objectToSave = new ObjectToSend(requestToSave);
          this.subscriptions.push(this.loanService.validateRequest(objectToSave).subscribe(() => {
            this.loanRequestToUpdate.State = state;
            this.netToPay = null;
          }));
        } else if (!result.value && state === AdministrativeDocumentStatusEnumerator.Accepted) {
          this.disableAcceptedValidators();
        }
      });
    } else {
      this.validationService.validateAllFormFields(this.loanAddFormGroup);
    }
  }

  setAcceptedValidators() {
    this.MonthsNumber.setValidators([
      Validators.required,
      Validators.min(NumberConstant.ONE),
      Validators.max(NumberConstant.SIXTY)
    ]);
    this.DisbursementDate.setValidators([
      Validators.required,
      dateValueGT(new Observable(o => o.next(this.ObtainingDate.value)))
    ]);
    this.RefundStartDate.setValidators([
      Validators.required,
      dateValueGT(new Observable(o => o.next(this.getYearMonthFromDisbursementDate())))
    ]);
    this.MonthsNumber.updateValueAndValidity();
    this.DisbursementDate.updateValueAndValidity();
    this.RefundStartDate.updateValueAndValidity();
  }

  disableAcceptedValidators() {
    this.MonthsNumber.clearValidators();
    this.DisbursementDate.clearValidators();
    this.DisbursementDate.clearAsyncValidators();
    this.RefundStartDate.clearValidators();
    this.RefundStartDate.clearAsyncValidators();
    this.MonthsNumber.updateValueAndValidity();
    this.DisbursementDate.updateValueAndValidity();
    this.RefundStartDate.updateValueAndValidity();
  }

  disbursementDateChange(event) {
    if (event !== null) {
      this.DisbursementDate.setValidators([
        dateValueGT(new Observable(o => o.next(this.ObtainingDate.value)))
      ]);
    } else {
      this.DisbursementDate.clearAsyncValidators();
    }
    this.DisbursementDate.updateValueAndValidity();
    this.RefundStartDate.updateValueAndValidity();
  }

  obtainingDateChange() {
    this.DisbursementDate.updateValueAndValidity();
    this.getNetToPay();
  }

  getYearMonthFromDisbursementDate() {
    if (this.DisbursementDate.value) {
      return new Date(this.DisbursementDate.value.getFullYear(), this.DisbursementDate.value.getMonth(), NumberConstant.ONE,
        NumberConstant.ZERO, NumberConstant.ZERO, NumberConstant.ZERO);
    }
  }

  refundStartDate(event) {
    if (event !== null) {
      this.RefundStartDate.setValidators([
        dateValueGT(new Observable(o => o.next(this.getYearMonthFromDisbursementDate())))
      ]);
    } else {
      this.RefundStartDate.clearAsyncValidators();
    }
    this.RefundStartDate.updateValueAndValidity();
  }

  getSwalText(state): string {
    if (state === this.statusCode.Accepted) {
      return LoanConstant.VALIDATE_CREDIT_REQUEST_ALERT;
    }
    if (state === this.statusCode.Refused) {
      return LoanConstant.REFUSE_CREDIT_REQUEST_ALERT;
    }
  }

  

  /**
   * control the number of months in the advance
   */
  controlNumberOfMonths(event) {
    if (this.isUpdateMode) {
      if (event === NumberConstant.TWO) {
        this.MonthsNumber.setValidators([
          Validators.required,
          equalValue(NumberConstant.ONE)
        ]);
      } else {
        this.MonthsNumber.setValidators([
          Validators.required
        ]);
      }
    }
    this.getNetToPay();
  }

  isLoanInstallmentFormChanged($event) {
    this.loanInstallmentFormGroupTouched = $event;
  }

  uploadFile($event) {
      if ($event) {
        this.isUploadFile = true;
    }
  }

  isFormChanged(): boolean {
    return this.loanAddFormGroup.touched || this.isUploadFile || this.loanInstallmentFormGroupTouched;
  }

  /**
   * this method will be called by CanDeactivateGuard service to check the leaving component possibility
   */
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.isSaveOperation) {
      this.isSaveOperation = false;
      return true;
    }
    return this.validationService.handleCanDeactivateToLeaveCurrentComponent(this.isFormChanged.bind(this));
  }

  getNetToPay() {
    this.netToPay = null;
    if (this.IdEmployee.value && this.ObtainingDate.value && this.CreditType.value
      && this.CreditType.value === CreditTypeEnumerator.Advance) {
      const loan: Loan = this.loanAddFormGroup.getRawValue();
      loan.Amount = Number(loan.Amount);
      const requestToSave: Loan = Object.assign({}, loan, this.loanAddFormGroup.getRawValue());
      const objectToSave = new ObjectToSend(requestToSave);
      this.subscriptions.push(this.loanService.getNetToPay(objectToSave).subscribe(res => {
        this.netToPay = res;
      }));
    }
  }

  ngOnDestroy(): void {
    if (this.subscriptions !== undefined) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
  }

  private getDataToUpdate() {
    this.subscriptions.push(this.loanService.getById(this.id).subscribe(data => {
      this.loanRequestToUpdate = data;
      this.createAddForm(this.loanRequestToUpdate);
      if (this.hasUpdatePermission && this.isUpdateMode) {
        if (this.CreditType.value === CreditTypeEnumerator.Advance) {
          this.MonthsNumber.setValidators([
            Validators.required,
            equalValue(NumberConstant.ONE)
          ]);
        }
      }
      if (this.loanRequestToUpdate.LoanFileInfo) {
        this.loanAttachementFileInfo = this.loanRequestToUpdate.LoanFileInfo;
      }
      if (this.loanRequestToUpdate.State === AdministrativeDocumentStatusEnumerator.Waiting) {
        this.getNetToPay();
      }
    }));
  }
}
