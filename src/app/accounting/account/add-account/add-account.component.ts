import {AfterViewInit, Component, ComponentRef, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {AccountService} from '../../services/account/account.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {isNumeric, ValidationService} from '../../../shared/services/validation/validation.service';
import {GrowlService} from '../../../../COM/Growl/growl.service';
import {ChartAccountService} from '../../services/chart-of-accounts/chart-of-account.service';
import {ChartOfAccountsConstant} from '../../../constant/accounting/chart-of-account.constant';
import {IModalDialog, IModalDialogOptions} from 'ngx-modal-dialog';
import {ModalDialogInstanceService} from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {SharedAccountingConstant} from '../../../constant/accounting/sharedAccounting.constant';
import {Account} from '../../../models/shared/account.model';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {AccountsConstant} from '../../../constant/accounting/account.constant';
import {GenericAccountingService} from '../../services/generic-accounting.service';
import {Observable} from 'rxjs/Observable';
import {AccountingConfigurationConstant} from '../../../constant/accounting/accounting-configuration.constant';
import {CompanyService} from '../../../administration/services/company/company.service';
import {SwalWarring} from '../../../shared/components/swal/swal-popup';
import {ComboBoxComponent} from '@progress/kendo-angular-dropdowns';
import {forkJoin} from 'rxjs/observable/forkJoin';
import {StyleConfigService} from '../../../shared/services/styleConfig/style-config.service';
import { ReducedCurrency } from '../../../models/administration/reduced-currency.model';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';
import NumberFormatOptions = Intl.NumberFormatOptions;

const LIST_ACCOUNT = 'main/settings/accounting/account';

@Component({
  selector: 'app-add-account',
  templateUrl: './add-account.component.html',
  styleUrls: ['./add-account.component.scss']
})
export class AddAccountComponent implements OnInit, AfterViewInit, IModalDialog {

  @ViewChild('labelInput') labelInput: ElementRef;
  @ViewChild('planParentInput') planParenInput: ComboBoxComponent;

  purchasePrecision: number;

  /*
   * dialog subject
   */
  dialogOptions: Partial<IModalDialogOptions<any>>;
  /*
   * is updateMode
   */
  public isUpdateMode: boolean;
  /**
   * filtering value
   */

  public planId: number;

  private id: number;

  public isModalOption = false;
  public isFilled = false;
  public isSaveOperation: boolean;

  public accountAddFormGroup: FormGroup;
  // number format
  public formatNumberOptions: NumberFormatOptions;
  public formatCodeAccountOptions: NumberFormatOptions;

  public minAmountNumber = 0;
  public maxAmountNumber = AccountingConfigurationConstant.MAX_AMOUNT_NUMBER;
  public minCode: string;
  public maxCode: string;
  public prefixPlanCode: string;
  public invalidCodeAccounting = false;
  public isInvalidMinCode = false;
  public isInvalidMaxCode = false;
  public accountParent: any;
  public chartOfAccountFiltredList: any;
  public chartAccountsList: any;
  public AccountingPermissions = PermissionConstant.SettingsAccountingPermissions;
  hasReadWritePermission = false;
  public isLiterableChecked = false;
  public isReconcilableChecked = false;

  constructor(private fb: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private accountService: AccountService,
              private chartOfAccountService: ChartAccountService,
              private router: Router,
              private translate: TranslateService,
              private growlService: GrowlService,
              private modalService: ModalDialogInstanceService,
              public validationService: ValidationService,
              private genericAccountingService: GenericAccountingService,
              private companyService: CompanyService,
              public authService: AuthService,
              private swalWarrings: SwalWarring,
              private styleConfigService: StyleConfigService) {
    this.hasReadWritePermission = GenericAccountingService.hasAccountingReadWritePermission();
    if (this.activatedRoute.snapshot.data['chartsAccounts']) {
      this.chartOfAccountFiltredList = this.activatedRoute.snapshot.data['chartsAccounts'];
      this.chartAccountsList = this.chartOfAccountFiltredList.slice();
    } else {
      this.chartOfAccountService.getJavaGenericService().getEntityList(ChartOfAccountsConstant.GET_ALL_CHARTS)
        .subscribe(data => {
          this.chartOfAccountFiltredList = data;
          this.chartAccountsList = this.chartOfAccountFiltredList.slice();
        });
    }
  }

  /**
   * Inialise Modal
   * @param reference
   * @param options
   */
  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.dialogOptions = options;
    this.createAddForm();
    const account = new Account();
    this.isModalOption = true;
    this.setLabelInputFocus();
    if (options.data.planId !== undefined) {
      this.isFilled = true;
      if (options.data.planCode) {
        this.loadDataforDialogAccount(options, account);
      }
    }
    if (options.data.id) {
      account.planId = options.data.id;
      account.planCode = options.data.planCode;
      account.code = options.data.code;
      account.creditOpening = options.data.creditOpening;
      account.debitOpening = options.data.debitOpening;
      this.setForm(account);
    }
  }

  loadDataforDialogAccount(options: any, account: any) {
    forkJoin(this.accountService.getJavaGenericService().getEntityList(
      `${AccountsConstant.GENERATE_ACCOUNT_CODE}` +
      `?planId=${options.data.planId ? options.data.planId : this.accountAddFormGroup.value.planId}`),
      this.chartOfAccountService.getJavaGenericService()
        .getEntityList(ChartOfAccountsConstant.SEARCH_BY_CODE + `?code=${options.data.planCode}`)
    ).subscribe((data) => {
      account.code = data[0];
      account.planId = data[1].id;
      account.planCode = data[1].code;
    }, error => {
    }, () => {
      setTimeout(() => {
        this.setForm(account);
      }, NumberConstant.SIX_HUNDRED);
    });
  }

  initData() {
    if (this.isUpdateMode) {
      this.getDataToUpdate();
    }
  }

  getDataToUpdate() {
    this.accountService.getJavaGenericService().getEntityById(this.id)
      .subscribe(data => {
        this.setForm(data);
        this.accountParent = data;
        if (!this.authService.hasAuthorities([this.AccountingPermissions.ADD_ACCOUNTING_ACCOUNTS, this.AccountingPermissions.UPDATE_ACCOUNTING_ACCOUNTS])) {
          this.accountAddFormGroup.disable();
        }
        this.isLiterableChecked = data.literable;
        this.isReconcilableChecked = data.reconcilable;
      });
  }

  /*
   * Prepare Add form component
   */
  private createAddForm(): void {
    const account = new Account();
    this.accountAddFormGroup = this.fb.group({
      id: [account.id, NumberConstant.ZERO],
      code: [account.code,
        Validators.compose([
          Validators.required
        ])],
      label: [account.label, [Validators.required, Validators.minLength(AccountingConfigurationConstant.ENTITY_FIELD_MIN_LENGTH),
        Validators.maxLength(AccountingConfigurationConstant.ENTITY_FIELD_MAX_LENGTH)]],
      planId: [account.planId, Validators.required],
      planCode: [{
        value: account.planCode,
        disabled: true
      }, [Validators.required, Validators.min(AccountingConfigurationConstant.ENTITY_CHAR_ACCOUNT_CODE_MIN_LENGTH),
        Validators.max(AccountingConfigurationConstant.ENTITY_CHAR_ACCOUNT_CODE_MAX_LENGTH), isNumeric()]],
      literable: [account.literable],
      reconcilable: [account.reconcilable],
      debitOpening: [NumberConstant.ZERO],
      creditOpening: [NumberConstant.ZERO]
    });
  }

  private setForm(account): void {
    this.accountAddFormGroup.patchValue(account);
  }

  openModalToConfirmSwitchingToAnotherOperationType(): any {
    const swalWarningMessage = `${this.translate.instant(AccountsConstant.USABLE_ACCOUNT)}`;
    return this.swalWarrings.CreateSwal(swalWarningMessage, AccountsConstant.ARE_YOU_SURE_TO_UPDATE_ACCOUNT,
      SharedConstant.YES, SharedConstant.NO);
  }

  /**
   * Add Account
   */
  public onAddAccount(): void {
    if (this.accountAddFormGroup.valid) {
      this.addAccount();
    } else {
      this.validationService.validateAllFormFields(this.accountAddFormGroup);
    }
  }

  private addAccount() {
    this.checkDebitCreditValue();
    this.isSaveOperation = true;
    if (this.isUpdateMode) {
      this.accountService.getJavaGenericService()
        .updateEntity(this.accountAddFormGroup.getRawValue(), this.id).subscribe(res => {
        this.showSuccessMessage();
      });
    } else {
      this.accountService.getJavaGenericService()
        .saveEntity(this.accountAddFormGroup.getRawValue()).subscribe(res => {
        this.showSuccessMessage();
      });
    }
  }

  isOpenDialogMode() {
    return this.dialogOptions !== undefined;
  }

  showSuccessMessage() {
    this.growlService.successNotification(this.translate.instant(SharedAccountingConstant.SUCCESS_OPERATION));
    if (this.isOpenDialogMode()) {
      this.dialogOptions.onClose();
      this.modalService.closeAnyExistingModalDialog();
    } else {
      this.router.navigateByUrl(LIST_ACCOUNT);
    }
  }

  /**
   * Get accounting plan selected by label
   */
  onSelectPlan(event) {
    if (event) {
      this.accountParent = this.chartOfAccountFiltredList.find(chartOfAccount => chartOfAccount.id === event);
      this.accountAddFormGroup.value.planCode = this.chartOfAccountFiltredList.find(chartOfAccount => chartOfAccount.id === event).code;
      this.accountAddFormGroup.value.planId = this.accountParent.id;
      this.setForm(this.accountAddFormGroup.value);
      this.generateCodeAccount();
      this.invalidCodeAccounting = false;
      this.isInvalidMinCode = false;
      this.isInvalidMaxCode = false;
      this.accountAddFormGroup.controls['code'].setErrors(null);
    }
  }

  /**
   * Search accounting plan selected by label
   */
  handleFilterChartOfAccount(value): void {
    if (this.genericAccountingService.isNullAndUndefinedAndEmpty(value)) {
      this.chartOfAccountFiltredList = this.chartAccountsList;
    } else {
      this.chartOfAccountFiltredList = this.genericAccountingService.getChartOfAccountFilteredListByWrittenValue(value, this.chartAccountsList);
    }
  }


  generateCodeAccount(planId?) {
    this.accountService.getJavaGenericService().getEntityList(
      `${AccountsConstant.GENERATE_ACCOUNT_CODE}` +
      `?planId=${planId ? planId : this.accountAddFormGroup.value.planId}`)
      .subscribe(code => {
        this.accountAddFormGroup.controls['code'].setValue(code);
      });
  }

  public canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.isSaveOperation) {
      this.isSaveOperation = false;
      return true;
    }
    return this.genericAccountingService.handleCanDeactivateToLeaveCurrentComponent(this.isAccountFormChanged.bind(this));
  }

  public isAccountFormChanged(): boolean {
    return this.accountAddFormGroup.touched;
  }

  private setSelectedCurrency(currency: ReducedCurrency) {
    this.purchasePrecision = currency.Precision;
    this.formatNumberOptions = {
      style: 'decimal',
      maximumFractionDigits: currency.Precision,
      minimumFractionDigits: currency.Precision
    };
  }

  loadCodeAccountFormatOptions() {
    this.formatCodeAccountOptions = {
      style: 'decimal',
      maximumFractionDigits: 0,
      useGrouping: false,
      minimumFractionDigits: 0
    };
  }

  ngOnInit() {
    this.companyService.getDefaultCurrencyDetails().subscribe((currency: ReducedCurrency) => {
      this.setSelectedCurrency(currency);
    });
    if (this.activatedRoute.component === AddAccountComponent) {
      this.activatedRoute.params.subscribe(params => {
        this.id = +params[SharedConstant.ID_LOWERCASE] || 0;
      });
    }

    if (!this.isOpenDialogMode()) {
      this.createAddForm();
    }

    this.isUpdateMode = this.id > NumberConstant.ZERO;
    this.initData();
    this.loadCodeAccountFormatOptions();
  }

  public isValidCodeAccount(value: string) {
    if (value !== null || value !== undefined || value.toString().trim().length !== 0) {
      this.checkCodeAccountValid(value);
    }
  }

  private checkCodeAccountValid(value: string) {
    this.prefixPlanCode = this.accountAddFormGroup.controls['planCode'].value.toString().trim();
    this.minCode = this.prefixPlanCode;
    this.maxCode = this.prefixPlanCode;
    if (value.toString().startsWith(this.prefixPlanCode)) {
      this.invalidCodeAccounting = false;
      this.setMinAndMaxAccountCode();
      this.codeAccountLowerThanMinAccountCode(value);
      this.codeAccountGratterThanMaxAccountCode(value);
      this.checkCodeAccountInInterval(value);

    } else {
      this.isInvalidMaxCode = false;
      this.isInvalidMinCode = false;
      this.invalidCodeAccounting = true;
      this.accountAddFormGroup.controls['code'].setErrors(null);

    }
  }

  private setMinAndMaxAccountCode() {
    for (let i = 0; i < (AccountsConstant.ACCOUNT_CODE_LENGH - (+this.prefixPlanCode.length)); i++) {
      this.minCode = this.minCode.concat('0');
      this.maxCode = this.maxCode.concat('9');
    }
  }

  private codeAccountLowerThanMinAccountCode(value: string) {
    if ((+(value) < (+this.minCode)) || ((+(value)) === (+(this.prefixPlanCode)))) {
      this.isInvalidMinCode = true;
      this.isInvalidMaxCode = false;
      this.accountAddFormGroup.controls['code'].setErrors({'incorrect': true});
    }
  }

  private codeAccountGratterThanMaxAccountCode(value: string) {
    if (+(value) > +(this.maxCode)) {
      this.isInvalidMaxCode = true;
      this.isInvalidMinCode = false;
      this.accountAddFormGroup.controls['code'].setErrors({'incorrect': true});
    }
  }

  private checkCodeAccountInInterval(value: string) {
    if (+(value) >= +(this.minCode) && +(value) <= +(this.maxCode)) {
      this.isInvalidMaxCode = false;
      this.isInvalidMinCode = false;
      this.accountAddFormGroup.controls['code'].setErrors(null);

    }
  }

  loadOriginPlanCode(value: number) {
    if (this.accountParent !== undefined) {
      if (!this.isUpdateMode) {
        this.accountAddFormGroup.patchValue({'planCode': this.accountParent.code});
      } else {
        this.accountAddFormGroup.patchValue({'planCode': this.accountParent.planCode});
      }
    }
  }

  private checkDebitCreditValue() {
    if (this.accountAddFormGroup.value.debitOpening === undefined ||
      this.accountAddFormGroup.value.debitOpening === null) {
      this.accountAddFormGroup.controls['debitOpening'].setValue(0);
    }
    if (this.accountAddFormGroup.value.creditOpening === undefined ||
      this.accountAddFormGroup.value.creditOpening === null) {
      this.accountAddFormGroup.controls['creditOpening'].setValue(0);
    }
  }

  private setLabelInputFocus() {
    setTimeout(() => {
      this.labelInput.nativeElement.focus();
    }, NumberConstant.ONE_THOUSAND);
  }

  ngAfterViewInit(): void {
    if (!this.isModalOption) {
      this.planParenInput.focus();
    }
  }

  public checkLiterable() {
    this.isLiterableChecked = !this.isLiterableChecked;
    this.accountAddFormGroup.controls[AccountsConstant.LITERABLE_FIELD].setValue(this.isLiterableChecked);
  }

  public checkReconciliation() {
    this.isReconcilableChecked = !this.isReconcilableChecked;
    this.accountAddFormGroup.controls[AccountsConstant.RECONCILABLE_FIELD].setValue(this.isReconcilableChecked);
  }

  getFooterClass(): string {
    return !this.dialogOptions ? this.styleConfigService.getFooterClassSettingLayoutAddComponent() : SharedConstant.EMPTY;
  }
}
