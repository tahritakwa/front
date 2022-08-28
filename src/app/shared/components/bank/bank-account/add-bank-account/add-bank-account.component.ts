import { Component, ComponentRef, EventEmitter, Injector, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { EnumValues } from 'enum-values';
import { IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';
import { ModalDialogInstanceService } from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Operation } from '../../../../../../COM/Models/operations';
import { BankAccountService } from '../../../../../administration/services/bank-account/bank-account.service';
import { BankAccountConstant } from '../../../../../constant/Administration/bank-account.constant';
import { CompanyConstant } from '../../../../../constant/Administration/company.constant';
import { TreasuryConstant } from '../../../../../constant/treasury/treasury.constant';
import { NumberConstant } from '../../../../../constant/utility/number.constant';
import { Country } from '../../../../../models/administration/country.model';
import { BankAccountTypeEnumerator } from '../../../../../models/enumerators/bank-account-type.enum';
import { BankAccount } from '../../../../../models/shared/bank-account.model';
import { StarkRolesService } from '../../../../../stark-permissions/service/roles.service';
import { RoleConfigConstant } from '../../../../../Structure/_roleConfigConstant';
import { unique, ValidationService } from '../../../../services/validation/validation.service';
import { CityDropdownComponent } from '../../../city-dropdown/city-dropdown.component';
import { ModelOfItemComboBoxComponent } from '../../../model-of-item-combo-box/model-of-item-combo-box.component';
import {BankService} from '../../../../../treasury/services/bank.service';
import {isNotNullOrUndefinedAndNotEmptyValue} from '../../../../../stark-permissions/utils/utils';
import {ComponentsConstant} from '../../../../../constant/shared/components.constant';
import {StyleConfigService} from '../../../../services/styleConfig/style-config.service';
import { PermissionConstant } from '../../../../../Structure/permission-constant';
import { AuthService } from '../../../../../login/Authentification/services/auth.service';

@Component({
  selector: 'app-add-bank-account',
  templateUrl: './add-bank-account.component.html',
  styleUrls: ['./add-bank-account.component.scss']
})
export class AddBankAccountComponent implements OnInit, OnChanges {
  @ViewChild(CityDropdownComponent) childListCity;
  @Input() bankAccountToUpdate: BankAccount;
  id: number;
  isUpdateMode: boolean;
  options: Partial<IModalDialogOptions<any>>;
  reference: ComponentRef<IModalDialog>;
  public closeDialogSubject: Subject<any>;
  public data: BankAccount;

  public hasAccount = false;
  public accountingForm = false;
  public bankFormGroupAccounting: FormGroup;
  public bankAccounts = [];

  dataToSendToAccounting = {
    id: null,
    relationEntityId: null,
    accountId: null
  };

  bankAccountFormGroup: FormGroup;
  country: Country;
  listBankAccountType: Array<any> = [];
  selectedBankAccount: any;
  isCountrySelected = false;
  isModal = false;
  isRole = false;
  public hasAddPermission: boolean;
  public hasUpdatePermission: boolean;
  /**
   * attribute to use while verifying the route leave
   */
  private isSaveOperation = false;
  @ViewChild(ModelOfItemComboBoxComponent) modelOfItemChild;
  public listAgencyOfBank = [];
  oldBankId = NumberConstant.ZERO;
  constructor(private bankAccountService: BankAccountService,
    private fb: FormBuilder, private injector: Injector,
    private modalService: ModalDialogInstanceService, private validationService: ValidationService,
    private activatedRoute: ActivatedRoute, private roleService: StarkRolesService, private styleConfigService: StyleConfigService,
    private translate: TranslateService, private router: Router, public bankService: BankService, private authService: AuthService) {
    this.bankAccounts = this.activatedRoute.snapshot.data['accounts'];
    this.id = this.activatedRoute.snapshot.params['id'];
    this.isUpdateMode = this.id && this.id > NumberConstant.ZERO ? true : false ;
  }


  ngOnInit() {
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.ADD_BANKACCOUNT);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.UPDATE_BANKACCOUNT);
    this.getBankAccountTypeList();
    this.creatAddForm();
    this.roleService.hasOnlyRoles([RoleConfigConstant.ACCOUNTING])
    .then(isRole => {
      this.isRole = isRole;
      if (this.isUpdateMode) {
        this.getDataToUpdate();
      }
    });

  }

  private creatAddForm(): void {
    this.bankAccountFormGroup = this.fb.group({
      Id: [0],
      Rib: [undefined,
        {
          validators: [Validators.required, Validators.minLength(NumberConstant.TWO),
            Validators.maxLength(NumberConstant.FIFTY)],
          asyncValidators: unique(CompanyConstant.RIB, this.bankAccountService, this.id ?
            String(this.id) : String(NumberConstant.ZERO)), updateOn: 'blur'
        }],
      Iban: [undefined,
        {
          validators: [Validators.required, Validators.minLength(NumberConstant.TWO),
            Validators.maxLength(NumberConstant.FIFTY)],
          asyncValidators: unique(CompanyConstant.IBAN, this.bankAccountService,
            this.id ? String(this.id) : String(NumberConstant.ZERO)), updateOn: 'blur'
        }],
      Code: [undefined,
        {
          validators: [Validators.minLength(NumberConstant.TWO)],
          asyncValidators: unique(CompanyConstant.CODE, this.bankAccountService, this.id ?
            String(this.id) : String(NumberConstant.ZERO)), updateOn: 'blur'
        }],
      Bic: [undefined, Validators.maxLength(NumberConstant.FIFTY)],
      IdBank: [undefined, Validators.required],
      Agency: [undefined, [Validators.required, Validators.minLength(NumberConstant.TWO),
        Validators.maxLength(NumberConstant.TWO_HUNDRED_FIFTY)]],
      Locality: [undefined, [
        Validators.minLength(NumberConstant.TWO), Validators.maxLength(NumberConstant.TWO_HUNDRED_FIFTY)]],
      Telephone: [undefined, Validators.maxLength(NumberConstant.TWENTY_FIVE)],
      Fax: [undefined, Validators.maxLength(NumberConstant.TWENTY_FIVE)],
      ZipCode: [undefined, [
        Validators.minLength(NumberConstant.TWO), Validators.maxLength(NumberConstant.FIFTY)]],
      Pic: [undefined,
        [Validators.minLength(NumberConstant.TWO), Validators.maxLength(NumberConstant.FIFTY)]],
      IdCurrency: [{value: undefined, disabled: this.isUpdateMode},
        [Validators.required]],
      TypeAccount: [undefined],
      IsDeleted: [false],
      InitialBalance: [undefined,
        [Validators.required, Validators.min(NumberConstant.ZERO)]],
      bankIdAccountingAccount: [''],
    });
  }

  getDataToUpdate() {
    this.bankAccountService.getById(this.id).subscribe((data) => {
      this.bankAccountToUpdate = data;
      this.bankAccountFormGroup.patchValue(this.bankAccountToUpdate);
      this.oldBankId = this.bankAccountToUpdate.IdBank;
      this.bankSelected(null);
      this.getSelectedBankAccountType(this.bankAccountToUpdate);
      if (this.bankAccountToUpdate.IsLinked) {
        this.bankAccountFormGroup.controls.IdBank.disable();
        this.bankAccountFormGroup.controls.Agency.disable();
        this.bankAccountFormGroup.controls.Code.disable();
        this.bankAccountFormGroup.controls.Rib.disable();
        this.bankAccountFormGroup.controls.Bic.disable();
        this.bankAccountFormGroup.controls.Iban.disable();
      }
      if (this.isRole) {
        this.getAccountAllocatedToBank();
      }
      if (!this.hasUpdatePermission) {
         this.bankAccountFormGroup.disable();
      }
    });
  }

  getBankAccountTypeList() {
    const listBankAccount = EnumValues.getNamesAndValues(BankAccountTypeEnumerator);
    listBankAccount.forEach(elem => {
      elem.name = elem.name.toUpperCase();
      this.translate.get(elem.name.toUpperCase()).subscribe(trans => elem.name = trans);
      this.listBankAccountType.push(elem);
    });
  }

  getSelectedBankAccountType(bankaccount: any) {
    this.listBankAccountType.forEach(elem => {
      if (elem.value === bankaccount.TypeAccount) {
        this.selectedBankAccount = elem.name;
      }
    });
  }

  getSelectedBankAccountTypeAndSetCity() {
    this.getSelectedBankAccountType(this.bankAccountToUpdate);
    this.country = new Country();
    this.country.Id = this.bankAccountToUpdate.IdCountry;
    if (this.country.Id) {
      this.childListCity.setCity(this.country);
    } else {
      this.childListCity.setCity(null);
    }
  }

  /**
   * Save
   */
  public save() {
    if (this.bankAccountFormGroup.valid) {
      this.isSaveOperation = true;
      this.bankAccountToUpdate = Object.assign({}, this.bankAccountToUpdate, this.bankAccountFormGroup.getRawValue());
      this.bankAccountToUpdate.CurrentBalance = this.bankAccountToUpdate.InitialBalance;
      this.bankAccountToUpdate.IdBankNavigation = null;
      this.bankAccountToUpdate.IdCurrencyNavigation = null;

      this.bankAccountService.save(this.bankAccountToUpdate, !this.isUpdateMode).subscribe((bankAccount) => {
        if (!this.isModal) {
          this.router.navigateByUrl(TreasuryConstant.BANK_ACCOUNTS_LIST_FROM_SETTINGS_URL);
        }
        if (this.options) {
          this.options.data = bankAccount;
          this.options.onClose();
          this.modalService.closeAnyExistingModalDialog();
        }
        if (this.isRole) {
          this.dataToSendToAccounting.accountId = this.bankAccountFormGroup.getRawValue().bankIdAccountingAccount;
          if (this.isUpdateMode) {
            this.dataToSendToAccounting.relationEntityId = bankAccount.Id;
          }
          if (this.dataToSendToAccounting.accountId) {
            this.allocateBankToAccountingAccount(this.dataToSendToAccounting);
          } else if (this.hasAccount) {
            this.removeAllocatedBankFromAccountingAccount(this.dataToSendToAccounting.relationEntityId);
          }
        }
      });
    } else {
      this.validationService.validateAllFormFields(this.bankAccountFormGroup);
    }
  }

  allocateBankToAccountingAccount(dataToSendToAccounting) {
    const dynamicImportAccountService = require('../../../../../accounting/services/account/account.service');
    const dynamicImportAccountConstant = require('../../../../../constant/accounting/account.constant');
    const dynamicImportAccountRelationTypeEnum = require('../../../../../models/accounting/account-relation-type');
    const accountRelationType = dynamicImportAccountRelationTypeEnum.AccountRelationType.BANK;
    this.injector.get(dynamicImportAccountService.AccountService)
      .getJavaGenericService().callService(Operation.POST, `${dynamicImportAccountConstant.AccountsConstant.ACCOUNT_RELATION_URL}/${accountRelationType}`, dataToSendToAccounting)
      .subscribe();
  }

  removeAllocatedBankFromAccountingAccount(tiersId) {
    const dynamicImportAccountService = require('../../../../../accounting/services/account/account.service');
    const dynamicImportAccountConstant = require('../../../../../constant/accounting/account.constant');
    const dynamicImportAccountRelationTypeEnum = require('../../../../../models/accounting/account-relation-type');
    const accountRelationType = dynamicImportAccountRelationTypeEnum.AccountRelationType.BANK;
    this.injector.get(dynamicImportAccountService.AccountService)
      .getJavaGenericService().deleteEntity(tiersId, `${dynamicImportAccountConstant.AccountsConstant.ACCOUNT_RELATION_URL}/${accountRelationType}`)
      .subscribe();
  }

  private closeModal() {
    this.bankAccountFormGroup.updateValueAndValidity();
    this.options.data = this.bankAccountFormGroup;
    this.options.onClose();
    this.modalService.closeAnyExistingModalDialog();
  }

  getAccountAllocatedToBank(){
    const dynamicImportAccountService = require('../../../../../accounting/services/account/account.service');
    const dynamicImportAccountConstant = require('../../../../../constant/accounting/account.constant');
    const dynamicImportAccountRelationTypeEnum = require('../../../../../models/accounting/account-relation-type');
    const accountRelationType = dynamicImportAccountRelationTypeEnum.AccountRelationType.BANK;
    return this.injector.get(dynamicImportAccountService.AccountService)
      .getJavaGenericService().callService(Operation.GET,
        `${dynamicImportAccountConstant.AccountsConstant.ACCOUNT_RELATION_URL}/${accountRelationType}?id=${this.bankAccountToUpdate.Id}`).subscribe((allocatedAccount) => {
          this.dataToSendToAccounting.accountId = allocatedAccount.account.id;
          this.dataToSendToAccounting.id = allocatedAccount.id;
          this.bankAccountToUpdate.bankIdAccountingAccount = allocatedAccount.account.id;
          this.bankAccountFormGroup.controls['bankIdAccountingAccount'].setValue(allocatedAccount.account.id);
        });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes[BankAccountConstant.BANK_ACCOUNT_TO_UPDATE]) {
      this.bankAccountToUpdate = changes[BankAccountConstant.BANK_ACCOUNT_TO_UPDATE].currentValue;
      if (this.bankAccountFormGroup) {
        this.bankAccountFormGroup.patchValue(this.bankAccountToUpdate);
        this.bankAccountFormGroup.disable();
        this.getSelectedBankAccountType(this.bankAccountToUpdate);
      }
    }
  }

  bankSelected(event) {
    const idBank = this.IdBank.value;
    this.listAgencyOfBank = [];
    if (idBank && this.oldBankId !== idBank) {
      this.oldBankId = idBank;
      this.Agency.setValue(null);
    }
    this.bankService.getById(idBank).subscribe((data) => {
      if (data && data.BankAgency) {
        this.listAgencyOfBank = data.BankAgency;
      }
    });
  }

  goBackToList() {
    this.router.navigateByUrl(TreasuryConstant.BANK_ACCOUNTS_LIST_FROM_SETTINGS_URL);
  }

  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.isModal = true;
    this.options = options;
    this.bankAccountToUpdate = options.data;
    if (this.bankAccountToUpdate) {
      this.isUpdateMode = true;
    } else {
      this.isUpdateMode = false;
    }
    this.closeDialogSubject = options.closeDialogSubject;
  }

  get IdBank(): FormGroup {
    return this.bankAccountFormGroup.get(TreasuryConstant.ID_BANK) as FormGroup;
  }

  /**
   * this method will be called by CanDeactivateGuard service to check the leaving component possibility
   */
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.isSaveOperation) {
      this.isSaveOperation = false;
      return true;
    }
    return this.validationService.handleCanDeactivateToLeaveCurrentComponent(this.isFormGroupChanged.bind(this));
  }

  private isFormGroupChanged(): boolean {
    return this.bankAccountFormGroup.touched;
  }
  checkvalidityAgency() {
    return this.listAgencyOfBank.length > NumberConstant.ZERO;
  }

  getFooterClass(): string {
    return this.styleConfigService.getFooterClassSettingLayoutAddComponent();
  }

  get Agency(): FormGroup {
    return this.bankAccountFormGroup.get(TreasuryConstant.Agency) as FormGroup;
  }
}
