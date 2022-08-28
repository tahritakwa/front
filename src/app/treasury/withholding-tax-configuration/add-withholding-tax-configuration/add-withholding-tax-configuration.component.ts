import {AfterViewInit, Component, ComponentRef, ElementRef, Injector, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {isNumeric, isNumericWithPrecision, unique, ValidationService} from '../../../shared/services/validation/validation.service';
import {GrowlService} from '../../../../COM/Growl/growl.service';
import {IModalDialog, IModalDialogOptions} from 'ngx-modal-dialog';
import {ModalDialogInstanceService} from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {SharedAccountingConstant} from '../../../constant/accounting/sharedAccounting.constant';
import {Account} from '../../../models/shared/account.model';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {AccountsConstant} from '../../../constant/accounting/account.constant';
import {Observable} from 'rxjs/Observable';
import {AccountingConfigurationConstant} from '../../../constant/accounting/accounting-configuration.constant';

import {SwalWarring} from '../../../shared/components/swal/swal-popup';
import NumberFormatOptions = Intl.NumberFormatOptions;
import {ComboBoxComponent} from '@progress/kendo-angular-dropdowns';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { WithholdingTax } from '../../../models/payment/withholding-tax.model';
import { WithholdingTaxService } from '../../../shared/services/withholding-tax/withholding-tax.service';
import { WithholdingTaxConstant } from '../../../constant/payment/withholding_tax_constant';
import { PredicateFormat } from '../../../shared/utils/predicate';
import { StarkRolesService } from '../../../stark-permissions/service/roles.service';
import { RoleConfigConstant } from '../../../Structure/_roleConfigConstant';
import { Operation } from '../../../../COM/Models/operations';
import { StyleConfigService } from '../../../shared/services/styleConfig/style-config.service';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';

const LIST_ACCOUNT = 'main/accounting/account';

@Component({
  selector: 'app-add-withholding-tax-configuration',
  templateUrl: './add-withholding-tax-configuration.component.html',
  styleUrls: ['./add-withholding-tax-configuration.component.scss']
})
export class AddWithHoldingTaxConfigurationComponent implements OnInit {

  @ViewChild('labelInput') labelInput: ElementRef;
  @ViewChild('planParentInput') planParenInput: ComboBoxComponent;


  /*
   * dialog subject
   */
  dialogOptions: Partial<IModalDialogOptions<any>>;
  /*
   * is updateMode
   */
  public isUpdateMode: boolean;
  public withholdingTaxFormGroup: FormGroup;

  public predicate: PredicateFormat;
  private id: number;
  public isRole = false;
  public hasAccount = false;
  private withHoldingTaxToUpdate: WithholdingTax;
  public hasAddWithHoldingTaxPermission: boolean;
  public hasUpdateWithHoldingTaxPermission: boolean;
  dataToSendToAccounting = {
    id: null,
    relationEntityId: null,
    accountId: null
  };
  public urlList = "/main/settings/treasury/withholdingTaxConfiguration";
  public isSaveOperation;
  constructor(private fb: FormBuilder, private activatedRoute: ActivatedRoute, private router: Router,
    private translate: TranslateService, private growlService: GrowlService,
    private modalService: ModalDialogInstanceService, public validationService: ValidationService,
    public withholdingTaxService: WithholdingTaxService, private swalWarrings: SwalWarring,
    private roleService: StarkRolesService, private injector: Injector,
    private authService: AuthService,
    private styleConfigService: StyleConfigService) {}


  /*
   * Prepare Add form component
   */
  private createAddForm(): void {
    this.withholdingTaxFormGroup = this.fb.group({
      Id: [NumberConstant.ZERO],
      Designation: [SharedConstant.EMPTY, {validators: [Validators.required, Validators.maxLength(250)]}],
      Percentage: [SharedConstant.EMPTY, [Validators.required,  Validators.min(0), Validators.max(100),
        Validators.maxLength(10), isNumericWithPrecision()]],
      IdAccountingAccountWithHoldingTax: [''],
      Type : ['']
    });
  }

  private setForm(withholdingTax): void {
    this.withholdingTaxFormGroup.patchValue(withholdingTax);
  }

  initData() {
    if (this.isUpdateMode) {
      this.getDataToUpdate();
    }
  }

  getDataToUpdate() {
  this.withholdingTaxService.getById(this.id)
    .subscribe(data => {
      this.withHoldingTaxToUpdate = data;
      this.withHoldingTaxToUpdate.IdAccountingAccountWithHoldingTax = null;
      this.dataToSendToAccounting.relationEntityId = this.id;
      if (this.isRole) {
        this.hasAccount = true;
        this.getAccountAllocatedToWithHoldingTax().subscribe((allocatedAccount) => {
          this.dataToSendToAccounting.accountId = allocatedAccount.account.id;
          this.dataToSendToAccounting.id = allocatedAccount.id;
          this.withHoldingTaxToUpdate.IdAccountingAccountWithHoldingTax = allocatedAccount.account.id;
          this.withholdingTaxFormGroup.controls['IdAccountingAccountWithHoldingTax'].setValue(allocatedAccount.account.id);
        });
      }
      if (!this.hasUpdateWithHoldingTaxPermission) {
        this.withholdingTaxFormGroup.disable();
      }
      this.setForm(data);
    });
  }
  getAccountAllocatedToWithHoldingTax(): Observable<any> {
      const dynamicImportAccountService = require('../../../accounting/services/account/account.service');
      const dynamicImportAccountConstant = require('../../../constant/accounting/account.constant');
      const dynamicImportAccountRelationTypeEnum = require('../../../models/accounting/account-relation-type');
      let accountRelationType;
        accountRelationType = dynamicImportAccountRelationTypeEnum.AccountRelationType.WITH_HOLDING_TAX;
      return this.injector.get(dynamicImportAccountService.AccountService)
        .getJavaGenericService().callService(Operation.GET, `${dynamicImportAccountConstant.AccountsConstant.ACCOUNT_RELATION_URL}/${accountRelationType}?id=${this.dataToSendToAccounting.relationEntityId}`);
  }

  allocateWithHoldingTaxToAccountingAccount(dataToSendToAccounting) {
    const dynamicImportAccountService = require('../../../accounting/services/account/account.service');
    const dynamicImportAccountConstant = require('../../../constant/accounting/account.constant');
    const dynamicImportAccountRelationTypeEnum = require('../../../models/accounting/account-relation-type');
    let accountRelationType;
    accountRelationType = dynamicImportAccountRelationTypeEnum.AccountRelationType.WITH_HOLDING_TAX;
    this.injector.get(dynamicImportAccountService.AccountService)
      .getJavaGenericService().callService(Operation.POST, `${dynamicImportAccountConstant.AccountsConstant.ACCOUNT_RELATION_URL}/${accountRelationType}`, dataToSendToAccounting)
      .subscribe();
  }

  removeAllocatedWithHoldingTaxFromAccountingAccount(tiersId) {
    const dynamicImportAccountService = require('../../../accounting/services/account/account.service');
    const dynamicImportAccountConstant = require('../../../constant/accounting/account.constant');
    const dynamicImportAccountRelationTypeEnum = require('../../../models/accounting/account-relation-type');
    let accountRelationType;
    accountRelationType = dynamicImportAccountRelationTypeEnum.AccountRelationType.WITH_HOLDING_TAX;
    this.injector.get(dynamicImportAccountService.AccountService)
      .getJavaGenericService().deleteEntity(tiersId, `${dynamicImportAccountConstant.AccountsConstant.ACCOUNT_RELATION_URL}/${accountRelationType}`)
      .subscribe();
  }

  public onAddWithHoldingTax(): void {
    if (this.withholdingTaxFormGroup.valid) {
      this.isSaveOperation = true;
      this.dataToSendToAccounting.accountId = this.withholdingTaxFormGroup.getRawValue().IdAccountingAccountWithHoldingTax;
      this.withholdingTaxService.save(this.withholdingTaxFormGroup.value, !this.isUpdateMode, this.predicate).subscribe(data => {
        if (this.isRole) {
          if (this.dataToSendToAccounting.accountId) {
            this.allocateWithHoldingTaxToAccountingAccount(this.dataToSendToAccounting);
          } else if (this.hasAccount) {
            this.removeAllocatedWithHoldingTaxFromAccountingAccount(this.dataToSendToAccounting.relationEntityId);
          }
        }
        this.router.navigateByUrl(this.urlList);
      });
    } else {
      this.validationService.validateAllFormFields(this.withholdingTaxFormGroup);
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

 ngOnInit() {
  this.hasAddWithHoldingTaxPermission =
   this.authService.hasAuthority(PermissionConstant.SettingsTreasuryPermissions.ADD_WITHHOLDING_TAX_TREASURY);
  this.hasUpdateWithHoldingTaxPermission =
  this.authService.hasAuthority(PermissionConstant.SettingsTreasuryPermissions.UPDATE_WITHHOLDING_TAX_TREASURY);
  if (!this.isOpenDialogMode()) {
    this.createAddForm();
  }

  this.roleService.hasOnlyRoles([RoleConfigConstant.ACCOUNTING])
  .then(isRole => {
    this.isRole = isRole;
  if (this.activatedRoute.component === AddWithHoldingTaxConfigurationComponent) {
    this.activatedRoute.params.subscribe(params => {
      this.id = +params[SharedConstant.ID_LOWERCASE] || 0;
    });
  }

  this.isUpdateMode = this.id > NumberConstant.ZERO;
  this.initData();
});
}
getFooterClass(): string {
  return this.styleConfigService.getFooterClassSettingLayoutAddComponent();
}

public canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
  if (this.isSaveOperation) {
    this.isSaveOperation = false;
    return true;
  }
  return this.withholdingTaxService.handleCanDeactivateToLeaveCurrentComponent(this.isWithholdingTaxFormChanged.bind(this));
}
public isWithholdingTaxFormChanged(): boolean {
  return this.withholdingTaxFormGroup.touched;
}
}
