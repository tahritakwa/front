import { Component, ComponentRef, Injector, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { TaxeConstant } from '../../../constant/Administration/taxe.constant';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaxeService } from '../../services/taxe/taxe.service';
import { digitsAfterComma, isNumeric, ValidationService } from '../../../shared/services/validation/validation.service';
import { IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';
import { Taxe } from '../../../models/administration/taxe.model';
import { ModalDialogInstanceService } from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import { ModelOfItemComboBoxComponent } from '../../../shared/components/model-of-item-combo-box/model-of-item-combo-box.component';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { flatMap } from 'rxjs/operators';
import { RoleConfigConstant } from '../../../Structure/_roleConfigConstant';
import {Observable} from 'rxjs/Observable';
import {StyleConfigService} from '../../../shared/services/styleConfig/style-config.service';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { GenericAccountingService } from '../../../accounting/services/generic-accounting.service';

@Component({
  selector: 'app-add-taxe',
  templateUrl: './add-taxe.component.html',
  styleUrls: ['./add-taxe.component.scss']
})
export class AddTaxeComponent implements OnInit, IModalDialog {

  /**
   * attribute to use while verifying the route leave
   */
  private isSaveOperation = false;
  public taxPurchasesAccounts;
  public taxSalesAccounts;
  public hTaxPurchasesAccounts;
  public hTaxSalesAccounts;
  public listUrl = TaxeConstant.TAX_LIST_URL;
  public taxData: any;

  private id: number;

  taxFormGroup: FormGroup;

  taxFormGroupAccounting: FormGroup;

  isUpdateMode: boolean;

  public isModal: boolean;

  private idSubscription: Subscription;

  public RoleConfigConstant = RoleConfigConstant;

  @ViewChild(ModelOfItemComboBoxComponent) modelOfItemChild;

  options: Partial<IModalDialogOptions<any>>;
  public accountingForm = false;
  public isRole = false;
  public SettingsAccountingPermissions = PermissionConstant.SettingsAccountingPermissions;
  public AccountingPermissions = PermissionConstant.AccountingPermissions;

  public isCalculable = true;
  public openPaymentAccountsCollapse = true;
  public hasAddTaxePermission: boolean;
  public hasUpdateTaxePermission: boolean;
  constructor(
    private activatedRoute: ActivatedRoute,
    public taxeService: TaxeService,
    private fb: FormBuilder,
    private modalService: ModalDialogInstanceService,
    private validationService: ValidationService,
    private styleConfigService: StyleConfigService,
    private router: Router, private injector: Injector,
    public authService: AuthService) {

    this.idSubscription = this.activatedRoute.params.subscribe(params => {
      this.id = +params[SharedConstant.ID_LOWERCASE] || 0;
    });
    this.isModal = false;
  }

  ngOnInit() {
    this.hasAddTaxePermission = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.ADD_TAX);
    this.hasUpdateTaxePermission = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.UPDATE_TAX);
    this.createAddForm();
    if (this.authService.hasAuthority(this.AccountingPermissions.ACCOUNTING)) {
      this.isRole = true;
      this.getCurrentAccountingSettings();
    } else {
      this.isUpdateMode = this.id > 0;
      if (this.isUpdateMode) {
        this.getDataToUpdate();
      }
    }
  }

  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.isModal = true;
    this.options = options;
  }

  private createAddForm(): void {
    this.taxFormGroup = this.fb.group({
      Id: [0],
      CodeTaxe: ['', Validators.required],
      Label: ['', Validators.required],
      TaxeValue: [null, [Validators.required, Validators.min(NumberConstant.ZERO)
        , Validators.max(NumberConstant.ONE_HUNDRED), digitsAfterComma(NumberConstant.TEN)]],
      TaxeType: [1, Validators.required],
      IsCalculable: [true]
    });
  }

  private createAddFormAccounting(): void {
    this.taxFormGroupAccounting = this.fb.group({
      taxSalesAccount: [''],
      htaxSalesAccount: [''],
      taxPurchasesAccount: [''],
      htaxPurchasesAccount: [''],
      fodecSalesAccount: [{ value: '', disabled: true }],
      fodecPurchasesAccount: [{ value: '', disabled: true }],
      taxId: []
    });
  }

  private getDataToUpdateAccounting() {
    const dynamicImportDocumentService = require('../../../accounting/services/import-document/import-document.service');
    this.taxeService.getById(this.id).pipe(flatMap((data: Taxe) => {
      this.taxData = data;
      this.isCalculable = data.IsCalculable;
      if (this.isCalculable) {
        this.taxFormGroup.controls["TaxeValue"].setValidators([Validators.required, Validators.min(NumberConstant.ZERO), digitsAfterComma(NumberConstant.TEN)
          , Validators.max(NumberConstant.ONE_HUNDRED)]);
      } else {
        this.taxFormGroup.controls["TaxeValue"].setValidators([Validators.min(NumberConstant.ZERO), digitsAfterComma(NumberConstant.TEN)]);
      }
      this.taxFormGroup.controls["TaxeValue"].updateValueAndValidity();
      this.taxFormGroup.patchValue(data);
      if (data.TaxeType !== 1) {
        this.taxFormGroupAccounting.controls['taxSalesAccount'].disable();
        this.taxFormGroupAccounting.controls['taxPurchasesAccount'].disable();
        this.taxFormGroupAccounting.controls['fodecSalesAccount'].enable();
        this.taxFormGroupAccounting.controls['fodecPurchasesAccount'].enable();
      }
      return this.injector.get(dynamicImportDocumentService.ImportDocumentService)
        .getJavaGenericService().getEntityList('tax' + `?taxId=${data.Id}`);
    })).subscribe((data: any) => {
      if (this.taxData.TaxeType !== 1) {
        data.fodecSalesAccount = data.taxSalesAccount;
        data.fodecPurchasesAccount = data.taxPurchasesAccount;
        data.taxSalesAccount = null;
        data.taxPurchasesAccount = null;
      }
      this.taxFormGroupAccounting.patchValue(data);
      if(!this.authService.hasAuthority(this.SettingsAccountingPermissions.ACCOUNTING_ACCOUNTS)){
        this.taxFormGroupAccounting.disable();
      }
    });
  }

  public saveTax(data: Taxe) {
    if (this.isRole) {
      const dynamicImportAccountingImportService = require('../../../accounting/services/import-document/import-document.service');
      this.taxeService.save(data, !this.isUpdateMode).pipe(flatMap((value) => {

        if (this.isUpdateMode) {
          this.taxFormGroupAccounting.value.taxId = this.taxData.Id;
        } else {
          this.taxFormGroupAccounting.value.taxId = value.Id;
        } 
        if (this.taxFormGroup.value.TaxeType !== 1){
          this.taxFormGroupAccounting.value.taxSalesAccount = this.taxFormGroupAccounting.value.fodecSalesAccount;
          this.taxFormGroupAccounting.value.taxPurchasesAccount = this.taxFormGroupAccounting.value.fodecPurchasesAccount;
        }
        return this.injector.get(dynamicImportAccountingImportService.ImportDocumentService)
          .getJavaGenericService().sendData('import-tax', this.taxFormGroupAccounting.value);
      })).subscribe(() => {
        if (!this.isModal) {
          this.router.navigate([TaxeConstant.TAX_LIST_URL]);
        } else {
          this.options.onClose();
          this.modalService.closeAnyExistingModalDialog();
        }
      });
    } else {
      this.taxeService.save(data, !this.isUpdateMode).subscribe((value) => {
        if (!this.isModal) {
          this.router.navigate([TaxeConstant.TAX_LIST_URL]);
        } else {
          this.options.onClose();
          this.modalService.closeAnyExistingModalDialog();
        }
      });
    }
  }

  public onAddTaxClick(): void {
    if (this.taxFormGroup.valid) {
      const data = this.taxFormGroup.getRawValue();
      this.isSaveOperation = true;
      this.saveTax(data);
    } else {
      this.validationService.validateAllFormFields(this.taxFormGroup);
    }
  }

  receiveAccounts($event) {
    if (this.modelOfItemChild) {
      this.modelOfItemChild.initDataSource($event);
    }
  }

  getCurrentAccountingSettings() {
    this.accountingForm = true;
    this.createAddFormAccounting();
    this.isUpdateMode = this.id > 0;

    if (this.isUpdateMode) {
      this.getDataToUpdateAccounting();
    }
  }

  getDataToUpdate() {
    this.taxeService.getById(this.id).subscribe(data => {
      if(data){
      this.isCalculable = data.IsCalculable;
      if (this.isCalculable) {
        this.taxFormGroup.controls["TaxeValue"].setValidators([Validators.required, Validators.min(NumberConstant.ZERO), digitsAfterComma(NumberConstant.TEN)
          , Validators.max(NumberConstant.ONE_HUNDRED)]);
      } else {
        this.taxFormGroup.controls["TaxeValue"].setValidators([Validators.min(NumberConstant.ZERO), digitsAfterComma(NumberConstant.TEN)]);
      }
      this.taxFormGroup.controls["TaxeValue"].updateValueAndValidity();
      this.taxFormGroup.patchValue(data);
      if (!this.hasUpdateTaxePermission || data.CodeTaxe ==  "TVA_Avance0%") {
        this.taxFormGroup.disable();
        if(this.taxFormGroupAccounting){
        this.taxFormGroupAccounting.disable();
        }
      }
    }
    });
  }

  public backToList() {
    this.router.navigateByUrl(SharedConstant.TAXES_LIST_URL);
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
    return this.taxFormGroup.touched;
  }

  getFooterClass(): string {
    return this.styleConfigService.getFooterClassSettingLayoutAddComponent();
  }

  changeTaxeNature() {
    this.isCalculable = !this.isCalculable;
    if (this.isCalculable) {
      this.taxFormGroup.controls["TaxeValue"].setValidators([Validators.required, Validators.maxLength(NumberConstant.FOUR), Validators.min(NumberConstant.ZERO)
        , Validators.max(NumberConstant.ONE_HUNDRED), isNumeric()]);
    } else {
      this.taxFormGroup.controls["TaxeValue"].setValidators([Validators.min(NumberConstant.ZERO), isNumeric()]);
    }
    this.taxFormGroup.controls['TaxeValue'].updateValueAndValidity();
    this.taxFormGroup.controls['IsCalculable'].setValue(this.isCalculable);
  }

  public openAddressDetailCollapse() {

    if (!this.openPaymentAccountsCollapse) {
      this.openPaymentAccountsCollapse = false;
    }
  }
}
