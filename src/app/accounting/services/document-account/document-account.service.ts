import { Injectable, Inject, ViewContainerRef } from '@angular/core';
import { ResourceServiceJava } from '../../../shared/services/resource/resource.serviceJava';
import { AppConfig } from '../../../../COM/config/app.config';
import { DocumentAccountConstant } from '../../../constant/accounting/document-account.constant';
import { HttpClient } from '@angular/common/http';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { AccountsConstant } from '../../../constant/accounting/account.constant';
import { ChartOfAccountsConstant } from '../../../constant/accounting/chart-of-account.constant';
import { KeyboardConst } from '../../../constant/keyboard/keyboard.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { GenericAccountingService } from '../generic-accounting.service';
import { TranslateService } from '@ngx-translate/core';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { AddAccountComponent } from '../../account/add-account/add-account.component';
import { FormModalDialogService } from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { SharedAccountingConstant } from '../../../constant/accounting/sharedAccounting.constant';

@Injectable()
export class DocumentAccountService extends ResourceServiceJava {
  constructor(@Inject(HttpClient) http, @Inject(AppConfig) appConfigAccounting, private genericAccountingService: GenericAccountingService,
              private translate: TranslateService, private swalWarrings: SwalWarring, private growlService: GrowlService,
              private formModalDialogService: FormModalDialogService
  ) {
    super(http, appConfigAccounting, 'accounting', DocumentAccountConstant.ENTITY_NAME);
  }

  public writtenValueInAccountDropDown: any;
  public accountDropDownListHasASelectedValue: any;

  updateFieldsOfAccountDropDown(formGroup, accountId: number, nameAccount: string) {
    formGroup.controls['accountId'].setValue(accountId);
    formGroup.controls['nameAccount'].setValue(nameAccount);
  }

  isValidWrittenValueInAccountDropDown() {
    return this.isInteger(this.writtenValueInAccountDropDown);
  }

  handleCreateNewAccount(viewRef: ViewContainerRef, handleAddNewElementToAccountDropdown: Function, planCode: string, code: string) {
    this.genericAccountingService.getChartOfAccountByCodeIteration(planCode).subscribe((chartOfAccountData) => {
      if (chartOfAccountData.id) {
        planCode = chartOfAccountData.code;
        let swalWarningMessage = `${this.translate.instant(AccountsConstant.DO_YOU_WANT_TO_ADD_ACCOUNT)}`;
        swalWarningMessage = swalWarningMessage.replace(SharedAccountingConstant.CODE_TO_BE_REPLACED_BY, code);
        this.swalWarrings.CreateSwal(swalWarningMessage, AccountsConstant.ARE_YOU_SURE_TO_CREATE_IT, SharedConstant.YES, SharedConstant.NO).then((result) => {
          if (result.value) {
            const modalTitle = this.translate.instant(AccountsConstant.ADD_NEW_ACCOUNT);
            this.formModalDialogService.openDialog(modalTitle, AddAccountComponent, viewRef, handleAddNewElementToAccountDropdown,
              { 'id': chartOfAccountData.id, 'planCode': planCode, 'code': code }, null, SharedConstant.MODAL_DIALOG_SIZE_L);
          }
        });
      } else {
        let errorMEssage;
        if (planCode.length > NumberConstant.EIGHT) {
          errorMEssage = `${this.translate.instant(AccountsConstant.ACCOUNT_CODE_TO_ADD_MUST_BE_ON_EIGHT_DIGITS)}`;
        } else if (planCode.length === NumberConstant.EIGHT) {
          errorMEssage = `${this.translate.instant(AccountsConstant.ACCOUNT_CODE_DOES_NOT_EXIST)}`;
        } else {
          errorMEssage = `${this.translate.instant(ChartOfAccountsConstant.CHARTS_OF_ACCOUNT_DOES_NOT_EXIST)}`;
        }
        errorMEssage = errorMEssage.replace(SharedAccountingConstant.CODE_TO_BE_REPLACED_BY, planCode);
        this.growlService.ErrorNotification(errorMEssage);
      }
    });
  }

  handleKeyAction(event: any, formGroup: any, viewRef: ViewContainerRef,
                  handleAddNewElementToAccountDropdown: Function, isOpenedModal: boolean) {
    const keyName = event.key;
    if ((keyName === KeyboardConst.ENTER || keyName === KeyboardConst.NUMPAD_ENTER) &&
      this.writtenValueInAccountDropDown !== undefined && !this.accountDropDownListHasASelectedValue) {
      this.updateFieldsOfAccountDropDown(formGroup, undefined, undefined);
      if (this.isValidWrittenValueInAccountDropDown()) {
        const minCode = AccountsConstant.MIN_ACCOUNT_CODE.toString();
        let planCode = this.writtenValueInAccountDropDown;
        if (planCode.length < NumberConstant.TWO) {
          planCode = planCode.concat('0');
        }
        const code = planCode.concat(minCode.substring(planCode.length, minCode.length));
        this.genericAccountingService.getAccountByCode(code).subscribe((accountData) => {
          if (isOpenedModal === true) {
            if (accountData.id) {
              this.updateFieldsOfAccountDropDown(formGroup, accountData.id, accountData.label);
            } else {
              this.handleCreateNewAccount(viewRef, handleAddNewElementToAccountDropdown, planCode, code);
            }
          }

        });
      } else {
        this.growlService.ErrorNotification(this.translate.instant(ChartOfAccountsConstant.ACCOUNT_TO_BE_CHOSEN_MUST_BE_PREFIXED_BY_NUMBER));
      }
    }
  }

  selectionChangeAccountDropdown($event) {
    //if Enter button is pressed wait for 100 ms until handleKeyAction method is completed
    //in case of read accountDropDownListHasASelectedValue to use in handleKeyAction method before set it to true"
    this.genericAccountingService.doAsyncTaskUsingPromiseAndSetTimeOut(NumberConstant.ONE_HUNDRED).then(() => {
      if ($event) {
        this.accountDropDownListHasASelectedValue = true;
      }
    });
  }

  handleFilterAccount(writtenValue) {
    this.accountDropDownListHasASelectedValue = false;
    if (writtenValue === '') {
      //if Enter button is pressed wait for 100 ms until handleKeyAction method is completed
      //in case of read writtenValueInAccountDropDown to use in handleKeyAction method before set it to undefined"
      this.genericAccountingService.doAsyncTaskUsingPromiseAndSetTimeOut(NumberConstant.ONE_HUNDRED).then(() => {
        this.writtenValueInAccountDropDown = undefined;
      });
    } else {
      this.writtenValueInAccountDropDown = writtenValue;
    }
    return this.genericAccountingService.getAccountFilteredListByWrittenValue(writtenValue);
  }

  isInteger(str: string) {
    const n = Math.floor(Number(str));
    return n !== Infinity && String(n) === str && n >= 0;
  }

  setAccountDropDownListHasASelectedValue(state: boolean) {
    this.accountDropDownListHasASelectedValue = state;
  }
}
