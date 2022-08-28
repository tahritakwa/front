import { Component, ComponentRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';
import {
  ValidationService
} from '../../../shared/services/validation/validation.service';
import { ChartAccountService } from '../../services/chart-of-accounts/chart-of-account.service';
import { ChartOFAccounts } from '../../../models/accounting/chart-of-accounts.model';
import { ModalDialogInstanceService } from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { TranslateService } from '@ngx-translate/core';
import { SharedAccountingConstant } from '../../../constant/accounting/sharedAccounting.constant';
import { AccountingConfigurationConstant } from '../../../constant/accounting/accounting-configuration.constant';
import NumberFormatOptions = Intl.NumberFormatOptions;
import { NumberConstant } from '../../../constant/utility/number.constant';

@Component({
  selector: 'app-chart-of-accounts-add',
  templateUrl: './chart-of-accounts-add.component.html',
  styleUrls: ['./chart-of-accounts-add.component.scss']
})
export class ChartOfAccountAddComponent implements OnInit, IModalDialog {
  /*
 * Form Group
 */
  accountFormGroup: FormGroup;
  /*
   * is updateMode
   */
  public isUpdateMode: boolean;
  public optionDialog: Partial<IModalDialogOptions<any>>;
  public parentId: number;
  public isNewClass: boolean;
  public minCode: number;
  public maxCode: number;
  public formatCodeAccountOptions: NumberFormatOptions;
  constructor(private formBuilder: FormBuilder, private validationService: ValidationService,
    public chartOfAccountsService: ChartAccountService, private modalService: ModalDialogInstanceService,
    private growlService: GrowlService, public translate: TranslateService) {

  }

  /**
   * initialize dialog
   * @param reference
   * @param options
   */
  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.optionDialog = options;
  }
  loadCodeAccountFormatOptions() {
    this.formatCodeAccountOptions = {
      style: 'decimal',
      maximumFractionDigits: 0,
      minimumFractionDigits: 0
    };
  }
  public setRange(parentId?: any) {
    if (parentId === undefined || parentId === null) {
      this.minCode = NumberConstant.ZERO;
      this.maxCode = NumberConstant.NINE;
    } else {
      this.chartOfAccountsService.getJavaGenericService().getEntityById(parentId).subscribe(data => {
        this.minCode = data.code * NumberConstant.TEN;
        this.maxCode = data.code * NumberConstant.TEN + NumberConstant.NINE;
      });
    }
  }

  /**
   * save
   */
  save() {
    if (this.accountFormGroup.valid) {
      if (!this.isUpdateMode) {
        const parentCode = this.accountFormGroup.getRawValue().parentCode ? this.accountFormGroup.getRawValue().parentCode : '';
        const valueToSend = JSON.parse(JSON.stringify(this.accountFormGroup.value));
        valueToSend.code = String(parentCode).concat(this.accountFormGroup.value.code);
        /**
         * Using generic service from GenericAccountService to save chartOfAccount
         *
         */
        this.chartOfAccountsService.getJavaGenericService().saveEntity(valueToSend).toPromise().then(res => {
          if (res) {
            this.successOperation();
          }
        });
      } else {
        const valueToSend = this.accountFormGroup.value as ChartOFAccounts;
        /**
         * Using generic service from GenericAccountService to update chartOfAccount
         *
         */
        this.chartOfAccountsService.getJavaGenericService()
          .updateEntity(valueToSend, valueToSend.id).toPromise().then(res => {
            if (res) {
              this.successOperation();
            }
          });
      }
    } else {
      this.validationService.validateAllFormFields(this.accountFormGroup);
    }
  }

  private successOperation(): void {
    this.optionDialog.onClose();
    this.modalService.closeAnyExistingModalDialog();
    this.growlService.successNotification(this.translate.instant(SharedAccountingConstant.SUCCESS_OPERATION));
  }

  /**
   * show message for request
   */
  public showSuccessMessage() {
    this.growlService.successNotification(this.translate.instant(SharedAccountingConstant.SUCCESS_OPERATION));
  }


  /**
   * Create chart of accounts form for new class
   * @param item
   */
  private createAddChartAccountFormForNewClass(): void {
    this.accountFormGroup = this.formBuilder.group({
      code: ['', [Validators.required]],
      label: ['', [Validators.required, Validators.minLength(AccountingConfigurationConstant.ENTITY_FIELD_MIN_LENGTH),
      Validators.maxLength(AccountingConfigurationConstant.ENTITY_FIELD_MAX_LENGTH)]],
      parentCode: [null],
      parentId: [null]
    });
    this.minCode = NumberConstant.ONE;
    this.maxCode = NumberConstant.NINE;
  }

  /**
   * Create chart of accounts form
   * @param item
   */
  private createAddChartAccountForm(item: ChartOFAccounts): void {

    this.accountFormGroup = this.formBuilder.group({
      code: ['', [Validators.required]],
      label: ['', [Validators.required, Validators.minLength(AccountingConfigurationConstant.ENTITY_FIELD_MIN_LENGTH),
      Validators.maxLength(AccountingConfigurationConstant.ENTITY_FIELD_MAX_LENGTH)]],
      parentCode: [{ value: item.code ? item.code : null, disabled: true }],
      parentId: [this.parentId ? this.parentId : null]
    });
    this.setRange();
  }


  /**
   * Create chart of accounts update form
   * @param item
   */
  private createEditChartAccountForm(item: ChartOFAccounts): void {
    this.accountFormGroup = this.formBuilder.group({
      id: [item.id],
      code: [item.code, [Validators.required]],
      label: [item.label, [Validators.required, Validators.minLength(AccountingConfigurationConstant.ENTITY_FIELD_MIN_LENGTH),
      Validators.maxLength(AccountingConfigurationConstant.ENTITY_FIELD_MAX_LENGTH)]],
      parentId: [item.parentId]
    });
    this.setRange(item.parentId);
  }

  /**
   * initialize component
   */
  ngOnInit() {
    this.loadCodeAccountFormatOptions();
    if (this.optionDialog.data) {
      if (this.optionDialog.data['isUpdateMode']) {
        this.isUpdateMode = true;
        this.isNewClass = false;
        this.createEditChartAccountForm(this.optionDialog.data['item']);
      } else {
        this.isUpdateMode = false;
        if (this.optionDialog.data['item'] && !this.optionDialog.data['isNewClass']) {
          this.isNewClass = false;
          this.parentId = this.optionDialog.data['item'].id;
          this.createAddChartAccountForm(this.optionDialog.data['item']);
        } else {
          this.isNewClass = true;
          this.createAddChartAccountFormForNewClass();
        }
      }
    }

  }

}
