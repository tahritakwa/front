import { Injectable, ViewContainerRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AbstractControl, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { SharedAccountingConstant } from '../../constant/accounting/sharedAccounting.constant';
import { NumberConstant } from '../../constant/utility/number.constant';
import { AccountsConstant } from '../../constant/accounting/account.constant';
import { AddAccountComponent } from '../account/add-account/add-account.component';
import { SharedConstant } from '../../constant/shared/shared.constant';
import { TranslateService } from '@ngx-translate/core';
import { FormModalDialogService } from '../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { isDateValidAccounting } from '../../shared/services/validation/validation.service';

@Injectable()
export class PageFilterService {

  public beginAccountIsSelected: boolean;

  constructor(private datePipe: DatePipe, private formBuilder: FormBuilder,
    private translate: TranslateService, private formModalDialogService: FormModalDialogService) {
  }

  handlePageFilterStatus(formGroup: any) {
    let filterStatus = false;
    if (formGroup.valid) {
      filterStatus = true;
    }
    return filterStatus;
  }

  getStartDateToUseInPageFilter(formGroup: any) {
    const date = new Date(formGroup.value.startDate);
    const startDateYear = date.getFullYear();
    const startDateMonth = date.getMonth();
    const startDateDay = date.getDate();
    return this.datePipe.transform(new Date(startDateYear, startDateMonth, startDateDay, NumberConstant.ZERO,
      NumberConstant.ZERO, NumberConstant.ZERO), SharedAccountingConstant.YYYY_MM_DD_HH_MM_SS);
  }

  getEndDateToUseInPageFilter(formGroup: any) {
    const date = new Date(formGroup.value.endDate);
    const endDateYear = date.getFullYear();
    const endDateMonth = date.getMonth();
    const endDateDay = date.getDate();
    return this.datePipe.transform(new Date(endDateYear, endDateMonth, endDateDay, NumberConstant.TWENTY_THREE,
      NumberConstant.FIFTY_NINE, NumberConstant.FIFTY_NINE), SharedAccountingConstant.YYYY_MM_DD_HH_MM_SS);
  }

  initPageFilterFormGroup() {
    return this.formBuilder.group({
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      beginAccountId: null,
      beginAccountCode: null,
      endAccountId: null,
      endAccountCode: null,
      beginAmount: ['', Validators.pattern(/^\d+(\.\d{0,3})?$/)],
      endAmount: ['', Validators.pattern(/^\d+(\.\d{0,3})?$/)],
      amount: ['', Validators.pattern(/^\d+(\.\d{0,3})?$/)],
      accountType: [{ value: SharedAccountingConstant.ALL, text: this.translate.instant(SharedAccountingConstant.ALL) }],
      letteringOperationType: [{ value: SharedAccountingConstant.ALL, text: this.translate.instant(SharedAccountingConstant.ALL) }]
    }, { validator: this.beginAmountGratterThanEndAmount });
  }

  initDataToSendToTelerikReport(reportName: any, url: any, formGroup: any, provisionalEdition: boolean) {
    return {
      'accountingUrl': url.url,
      'reportName': reportName,
      'provisionalEdition': provisionalEdition,
      'startDate': this.getStartDateToUseInPageFilter(formGroup),
      'endDate': this.getEndDateToUseInPageFilter(formGroup),
      'beginAccountCode': formGroup.value.beginAccountCode,
      'endAccountCode': formGroup.value.endAccountCode,
      'company': '',
      'companyAdressInfo': '',
      'companyCode': '',
    };
  }

  isTrueIfStartDateIsLowerThanEndDate(formGroup: any) {
    return (formGroup.value.startDate <= formGroup.value.endDate);
  }

  isTrueIfBeginAccountCodeIsLowerThanEndAccountCode(formGroup: any) {
    let beginAccountCodeIsLowerThanEndAccountCode = true;
    if (formGroup.value.beginAccountCode === null || formGroup.value.endAccountCode === null) {
      return true;
    } else if (formGroup.value.beginAccountCode > formGroup.value.endAccountCode) {
      beginAccountCodeIsLowerThanEndAccountCode = false;
    }
    return beginAccountCodeIsLowerThanEndAccountCode;
  }

  addNewBeginAccount(viewRef: ViewContainerRef, onCloseModal: Function) {
    this.beginAccountIsSelected = true;
    const modalTitle = this.translate.instant(AccountsConstant.ADD_NEW_ACCOUNT);
    this.formModalDialogService.openDialog(modalTitle, AddAccountComponent, viewRef, onCloseModal,
      { 'planCode': undefined }, null, SharedConstant.MODAL_DIALOG_SIZE_L);
  }

  addNewEndAccount(viewRef: ViewContainerRef, onCloseModal: Function) {
    this.beginAccountIsSelected = false;
    const modalTitle = this.translate.instant(AccountsConstant.ADD_NEW_ACCOUNT);
    this.formModalDialogService.openDialog(modalTitle, AddAccountComponent, viewRef, onCloseModal,
      { 'planCode': undefined }, null, SharedConstant.MODAL_DIALOG_SIZE_L);
  }

  setDefaultValueOfAccountDropdownToLastElement(lastElement: any, formGroup: any) {
    if (this.beginAccountIsSelected) {
      formGroup.controls['beginAccountId'].setValue(lastElement.id);
      formGroup.controls['beginAccountCode'].setValue(lastElement.code);
    } else {
      formGroup.controls['endAccountId'].setValue(lastElement.id);
      formGroup.controls['endAccountCode'].setValue(lastElement.code);
    }
  }

  beginAmountGratterThanEndAmount(control: AbstractControl): { [key: string]: boolean } | null {
    if (control.get('beginAmount').value && control.get('endAmount').value) {
      const beginAmount = control.get('beginAmount').value.toString().replace(',', '.');
      const endAmount = control.get('endAmount').value.toString().replace(',', '.');
      if (Number(beginAmount) > Number(endAmount)) {
        return { 'beginAmountGratterThanEndAmount': true };
      }
    }
    return;
  }

  initFormDatesThroughCurrentFiscalYear(formGroup: FormGroup, initList: Function, startDateField: any, endDateField: any, currentFiscalYear: any) {
    const startDate = new Date(currentFiscalYear.startDate);
    const endDate = new Date(currentFiscalYear.endDate);
    formGroup.controls[startDateField].setValue(startDate);
    formGroup.controls[endDateField].setValue(endDate);
    formGroup.controls[startDateField].setValidators(isDateValidAccounting(startDate, endDate));
    formGroup.controls[endDateField].setValidators(isDateValidAccounting(startDate, endDate));
    initList();
  }

}
