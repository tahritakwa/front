import { Injectable, ViewContainerRef } from '@angular/core';
import { AccountService } from './account/account.service';
import { AccountsConstant } from '../../constant/accounting/account.constant';
import { SharedConstant } from '../../constant/shared/shared.constant';
import { FormModalDialogService } from '../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { TranslateService } from '@ngx-translate/core';
import { ChartAccountService } from './chart-of-accounts/chart-of-account.service';
import { ChartOfAccountsConstant } from '../../constant/accounting/chart-of-account.constant';
import { JournalConstants } from '../../constant/accounting/journal.constant';
import { JournalService } from './journal/journal.service';
import { TemplateAccountingConstant } from '../../constant/accounting/template.constant';
import { TemplateAccountingService } from './template/template.service';
import { AddJournalComponent } from '../journal/add-journal/add-journal.component';
import { GrowlService } from '../../../COM/Growl/growl.service';
import { SwalWarring } from '../../shared/components/swal/swal-popup';
import { NumberConstant } from '../../constant/utility/number.constant';
import { KeyboardConst } from '../../constant/keyboard/keyboard.constant';
import { FormGroup } from '@angular/forms';
import { Filter } from '../../models/accounting/Filter';
import { GridSettings } from '../../shared/utils/grid-settings.interface';
import { DatePipe } from '@angular/common';
import { SharedAccountingConstant } from '../../constant/accounting/sharedAccounting.constant';
import {NumberFormatOptions} from '@telerik/kendo-intl';
import {RoleConfigConstant} from '../../Structure/_roleConfigConstant';
import {FieldTypeConstant} from '../../constant/shared/fieldType.constant';
import {
  Filter as predicate, OperationTypeDateAcc,
  OperationTypeDropDown,
  OperationTypeNumber,
  OperationTypeString
} from '../../shared/utils/predicate';
import {EnumValues} from 'enum-values';
import {SharedCrmConstant} from '../../constant/crm/sharedCrm.constant';
import {orderBy} from 'lodash';
import {isNotNullOrUndefinedAndNotEmptyValue} from '../../stark-permissions/utils/utils';

@Injectable()
export class GenericAccountingService {

  public accountList: any;
  public chartOfAccountList: any;
  public journalList: any;
  public templateAccountingList: any;
  public writtenValueInAccountDropDown: any;
  public accountDropDownListHasASelectedValue: any;


  constructor(private accountService: AccountService, private chartOfAccountService: ChartAccountService,
    private journalService: JournalService, private templateAccountingService: TemplateAccountingService,
    private translate: TranslateService, private formModalDialogService: FormModalDialogService,
    private swalWarrings: SwalWarring, private growlService: GrowlService, public datePipe: DatePipe) {
  }

  getListPlan() {
    return new Promise(resolve => {
      this.chartOfAccountService.getJavaGenericService().getEntityList(ChartOfAccountsConstant.GET_ALL_CHARTS)
        .subscribe((data) => {
          this.chartOfAccountList = data;
          resolve(this.chartOfAccountList);
        });
    });
  }
  public static isAccountingReadWriteInPermissions(permissions:any):boolean{
    for(let permission of permissions){
      if(RoleConfigConstant.ACCOUNTING_READ_WRITE === permission.Code.trim().toUpperCase()){
        return true;
      }
    }
    return false;
  }
  public static hasAccountingReadWritePermission():boolean{
    return localStorage.getItem(SharedAccountingConstant.ACCOUNTING_HAS_READ_WRITE_PERMISSION)==='true';
  }
  openModalToConfirmSwitchingToAnotherOperationType(): any {
    const swalWarningMessage = `${this.translate.instant(AccountsConstant.CURRENT_OPERATION_HAS_NOT_BEEN_COMPLETED_YET)}`;
    return this.swalWarrings.CreateSwal(swalWarningMessage, AccountsConstant.ARE_YOU_SURE_TO_LEAVE_THE_OPERATION_WITHOUT_BEING_COMPLETED,
      SharedConstant.YES, SharedConstant.NO);
  }

  getModalResponseToLeaveCurrentComponent(): Promise<boolean> {
    return new Promise(resolve => {
      let canDeactivate = false;
      this.openModalToConfirmSwitchingToAnotherOperationType().then((result) => {
        if (result.value) {
          canDeactivate = true;
        }
        resolve(canDeactivate);
      });
    });
  }

  handleCanDeactivateToLeaveCurrentComponent(checkIfFormGroupComponentHasChanged: Function) {
    if (this.isOperationInProgress(checkIfFormGroupComponentHasChanged)) {
      return this.getModalResponseToLeaveCurrentComponent();
    }
    return true;
  }

  isOperationInProgress(checkIfFormGroupComponentHasChanged: Function): boolean {
    return this.isFormGroupDataChanged(checkIfFormGroupComponentHasChanged);
  }

  private isFormGroupDataChanged(isFormGroupDataChanged: Function): boolean {
    return isFormGroupDataChanged();
  }

  getChartOfAccountFilteredListByWrittenValue(writtenValue: string, chartAccountList: Array<any>) {
    return chartAccountList.filter((s) =>
      s.label.toLowerCase().includes(writtenValue.toLowerCase())
      || s.label.toLocaleLowerCase().includes(writtenValue.toLowerCase())
      || s.code.toString().startsWith(writtenValue));
  }

  getTemplateAccountingList() {
    return new Promise(resolve => {
      this.templateAccountingService.getJavaGenericService().getEntityList(TemplateAccountingConstant.GET_TEMPLATES)
        .subscribe((data) => {
          this.templateAccountingList = data;
          resolve(this.templateAccountingList);
        });
    });
  }

  getAccountList() {
    return new Promise(resolve => {
      this.accountService.getJavaGenericService().getEntityList(AccountsConstant.GET_ACCOUNTS_URL)
        .subscribe((data) => {
          this.accountList = data;
          resolve(this.accountList);
        });
    });
  }

  getAccountFilteredListByWrittenValue(writtenValue: string) {
    return this.accountList.filter((s) =>
      s.label.toLowerCase().includes(writtenValue.toLowerCase())
      || s.label.toLocaleLowerCase().includes(writtenValue.toLowerCase())
      || s.code.toString().startsWith(writtenValue));
  }

  setLabelOnSelectAccount(accountEvent: number, formControl: string, formGroup: FormGroup) {
    if (accountEvent) {
      const currentBeginAccount = this.accountList.find(account => account.id === accountEvent);
      formGroup.controls[formControl].setValue(currentBeginAccount.label);
    } else {
      formGroup.controls[formControl].setValue(null);
    }
  }
   setAccountIdOnSelectAccount(accountEvent: number, formControl: string, formGroup: FormGroup) {
      if (accountEvent) {
        const currentBeginAccount = this.accountList.find(account => account.id === accountEvent);
        formGroup.controls[formControl].setValue(currentBeginAccount.id);
      } else {
        formGroup.controls[formControl].setValue(null);
      }
    }
  setCodeOnSelectAccount(accountEvent: number, formControl: string, formGroup: FormGroup) {
    if (accountEvent) {
      const currentBeginAccount = this.accountList.find(account => account.id === accountEvent);
      formGroup.controls[formControl].setValue(currentBeginAccount.code);
    } else {
      formGroup.controls[formControl].setValue(null);
    }
  }

  getJournalList() {
    return new Promise(resolve => {
      this.journalService.getJavaGenericService().getEntityList(JournalConstants.FIND_ALL_METHOD_URL)
        .subscribe((data) => {
          this.journalList = data;
          resolve(this.journalList);
        });
    });
  }

  getJournalFilteredListByWrittenValue(writtenValue: string): any {
    return this.journalList.filter((s) =>
      s.label.toLowerCase().includes(writtenValue.toLowerCase())
      || s.label.toLocaleLowerCase().includes(writtenValue.toLowerCase())
    );
  }

  openAddJournalModal(viewRef: ViewContainerRef, onCloseModal: Function) {
    const modalTitle = this.translate.instant(JournalConstants.ADD_NEW_JOURNAL);
    this.formModalDialogService.openDialog(modalTitle, AddJournalComponent, viewRef, onCloseModal,
      null, null, SharedConstant.MODAL_DIALOG_SIZE_M);
  }

  getAccountByCode(code: any) {
    return this.accountService.getJavaGenericService().getEntityList(AccountsConstant.SEARCH_BY_CODE + `?code=${code}`);
  }

  getMinAccountByCode(code: any) {
    return this.accountService.getJavaGenericService().getEntityList(AccountsConstant.SEARCH_ACCOUNT + `?code=${code}&extremum=${AccountsConstant.MIN}`);
  }

  getMaxAccountByCode(code: any) {
    return this.accountService.getJavaGenericService().getEntityList(AccountsConstant.SEARCH_ACCOUNT + `?code=${code}&extremum=${AccountsConstant.MAX}`);
  }

  getChartOfAccountByCode(code: any) {
    return this.chartOfAccountService.getJavaGenericService().getEntityList(ChartOfAccountsConstant.SEARCH_BY_CODE + `?code=${code}`);
  }

  getChartOfAccountByCodeIteration(code: any) {
    return this.chartOfAccountService.getJavaGenericService().getEntityList(ChartOfAccountsConstant.SEARCH_BY_CODE_ITERATION + `?code=${code}`);
  }

  doAsyncTaskUsingPromiseAndSetTimeOut(time: number) {
    return new Promise(resolve => {
      setTimeout(function () {
        resolve();
      }, time);
    });
  }

  handleKeyAction(event: any, formGroup: FormGroup, accountId: string, accountCode: string) {
    const keyName = event.key;
    if (keyName === KeyboardConst.ENTER && this.writtenValueInAccountDropDown !== undefined && !this.accountDropDownListHasASelectedValue) {
      formGroup.controls[accountId].setValue(undefined);
      if (this.isInteger(this.writtenValueInAccountDropDown)) {
        const planCode = this.writtenValueInAccountDropDown;
        if (accountId === 'beginAccountId') {
          this.getMinAccountByCode(planCode).subscribe((accountData) => {
            if (accountData.id) {
              formGroup.controls[accountId].setValue(accountData.id);
              formGroup.controls[accountCode].setValue(accountData.code);
            }
          });
        } else {
          this.getMaxAccountByCode(planCode).subscribe((accountData) => {
            if (accountData.id) {
              formGroup.controls[accountId].setValue(accountData.id);
              formGroup.controls[accountCode].setValue(accountData.code);
            }
          });
        }
      } else {
        this.growlService.ErrorNotification(this.translate.instant(ChartOfAccountsConstant.ACCOUNT_TO_BE_CHOSEN_MUST_BE_PREFIXED_BY_NUMBER));
      }
    }
  }

  selectionChangeAccountDropdown($event) {
    this.doAsyncTaskUsingPromiseAndSetTimeOut(NumberConstant.ONE_HUNDRED).then(() => {
      if ($event) {
        this.accountDropDownListHasASelectedValue = true;
      }
    });
  }

  handleFilterAccount(writtenValue) {
    this.accountDropDownListHasASelectedValue = false;
    if (writtenValue === '') {
      this.doAsyncTaskUsingPromiseAndSetTimeOut(NumberConstant.ONE_HUNDRED).then(() => {
        this.writtenValueInAccountDropDown = undefined;
      });
    } else {
      this.writtenValueInAccountDropDown = writtenValue;
    }
    return this.getAccountFilteredListByWrittenValue(writtenValue);
  }

  isInteger(str: string) {
    const n = Math.floor(Number(str));
    return n !== Infinity && String(n) === str && n >= 0;
  }

  getSortParams(sort) {
    if (sort.length === 0) {
      return '';
    } else {
      return '&sort=' + sort[0].field + ',' + (sort[0].dir === undefined ? '' : sort[0].dir);
    }
  }

  public setCompanyInfo(dataToSend: any, company: any) {
    const now = new Date();
    dataToSend.company = company.Name;
    dataToSend.companyCode = company.Code;
    dataToSend.companyAdressInfo = `${company.Name}, Adress: ` ;
    if (company.Address.length > NumberConstant.ZERO && !this.isNullAndUndefinedAndEmpty(company.Address[0])) {
      dataToSend.companyAdressInfo += ` ${company.Address[0].PrincipalAddress}-${company.Address[0].IdZipCodeNavigation ? company.Address[0].IdZipCodeNavigation.Code : ''}${company.Address[0].IdCityNavigation ? company.Address[0].IdCityNavigation.Label : ''} ${company.Address[0].IdCountryNavigation ? company.Address[0].IdCountryNavigation.NameFr : ''}`;
    }
    dataToSend.companyAdressInfo += ` -RC: ${company.CommercialRegister}\n`
    dataToSend.companyAdressInfo += `MF:${company.MatriculeFisc}, Mail: ${company.Email} -Site: ${company.WebSite} -Tél:${company.Tel1}`;
    dataToSend.generationDate = this.datePipe.transform(now, SharedAccountingConstant.YYYY_MM_DD_HH_MM_SS);
  }

  public setCompanyInfos(dataToSend: any, company: any) {
    const now = new Date();
    dataToSend.company = company.Name;
    // dataToSend.logo = company.Logo;
    dataToSend.companyCode = company.Code;
    dataToSend.companyAdressInfo = `${company.Name}, Adress: ` ;
    if (company.Address.length > NumberConstant.ZERO && !this.isNullAndUndefinedAndEmpty(company.Address[0])) {
      dataToSend.companyAdressInfo += ` ${company.Address[0].PrincipalAddress}-${company.Address[0].IdZipCodeNavigation ? company.Address[0].IdZipCodeNavigation.Code : ''}${company.Address[0].IdCityNavigation ? company.Address[0].IdCityNavigation.Label : ''} ${company.Address[0].IdCountryNavigation ? company.Address[0].IdCountryNavigation.NameFr : ''}`;
    }
    dataToSend.commercialRegister = company.CommercialRegister;
    dataToSend.matriculeFisc = company.MatriculeFisc;
    dataToSend.mail = company.Email;
    dataToSend.webSite = company.WebSite;
    dataToSend.tel = company.Tel1;
    dataToSend.generationDate = this.datePipe.transform(now, SharedAccountingConstant.YYYY_MM_DD_HH_MM_SS);
  }
  isNullAndUndefinedAndEmpty(value) {
    if (value === null || value === undefined || value === '') {
      return true;
    }
  }

  public downloadPDFFile(resultdata: any, fileName: string) {
    if (resultdata.name) {
      const downloadLink = document.createElement('a');
      const linkSource = `data:${SharedAccountingConstant.PDF_MIME_TYPE};base64,${resultdata.base64Content}`;
      downloadLink.href = linkSource;
      downloadLink.download = fileName.concat(SharedAccountingConstant.PDF);
      document.body.appendChild(downloadLink);
      downloadLink.click();
    }
  }
  public downloadExcelFile(data: any, title: string ) {
    if (data.name) {
      const linkSource = `data:${SharedAccountingConstant.EXCEL_MIME_TYPE};base64,${data.base64Content}`;
      const downloadLink = document.createElement('a');
      const fileName = title.concat(SharedAccountingConstant.XLSX) ;
      downloadLink.href = linkSource;
      downloadLink.download = fileName;
      downloadLink.click();
    }
  }
  public buildFilters(gridSettings: GridSettings, numberFormatOptions?: NumberFormatOptions): Array<Filter> {
    let filters = new Array<Filter>();
    gridSettings.state.filter.filters.forEach(filter => {
      let type = SharedAccountingConstant.FILTER_TYPES.STRING;
      let relatedColumnsConfig = gridSettings.columnsConfig.filter(column => column.field === filter[SharedAccountingConstant.FILTER_FIELDS.FIELD])[0];
      if (relatedColumnsConfig.hasOwnProperty(SharedAccountingConstant.FILTER_KEY)) {
        type = relatedColumnsConfig.filter;
      }
      let value = filter[SharedAccountingConstant.FILTER_FIELDS.VALUE];
      if (type === SharedAccountingConstant.FILTER_TYPES.DATE) {
        value = this.datePipe.transform(new Date(filter[SharedAccountingConstant.FILTER_FIELDS.VALUE]), SharedConstant.PIPE_FORMAT_DATE);
      } else if (type === SharedAccountingConstant.FILTER_TYPES.NUMERIC) {
        type = SharedAccountingConstant.FILTER_TYPES.STRING;
        value = Number.parseFloat(value).toFixed(numberFormatOptions.minimumFractionDigits);
      }
      filters.push(new Filter(type, filter[SharedAccountingConstant.FILTER_FIELDS.OPERATOR], filter[SharedAccountingConstant.FILTER_FIELDS.FIELD], value));
    });
    return filters;
  }

  public getFilterType(type: string) {
    if (type === FieldTypeConstant.TEXT_TYPE || type === FieldTypeConstant.numerictexbox_type) {
      return SharedAccountingConstant.FILTER_TYPES.STRING;
    } else if (type === FieldTypeConstant.planCodeComponent ||
      type === FieldTypeConstant.closingStateComponent ||
    type === FieldTypeConstant.journalComponent) {
      return SharedAccountingConstant.FILTER_TYPES.DROP_DOWN_LIST;
    } if (type === FieldTypeConstant.DATE_TYPE_ACC) {
      return  SharedAccountingConstant.FILTER_TYPES.DATE;
    }    else {
      return type;
    }
  }
  public getOperation(filter: predicate, filterFieldsColumns, filterFieldsInputs ) {
    const type = this.getType(filter, filterFieldsColumns, filterFieldsInputs);
    let operationTypeEnum ;
    if (type === FieldTypeConstant.TEXT_TYPE) {
      operationTypeEnum = OperationTypeString;
    } else if (type === FieldTypeConstant.DATE_TYPE_ACC ) {
      operationTypeEnum = OperationTypeDateAcc;
    } else if (type === FieldTypeConstant.numerictexbox_type) {
      operationTypeEnum = OperationTypeNumber;
    } else  {
      operationTypeEnum = OperationTypeDropDown;
    }
    return (EnumValues.getNameFromValue(operationTypeEnum, filter.operation));
  }

  public getType(filter, filterFieldsColumns: any, filterFieldsInputs: any) {
    const filterFieldsColumn = filterFieldsColumns.filter(filterField => filterField.columnName === filter.prop);
    const filterFieldsInput = filterFieldsInputs.filter(filterField => filterField.columnName === filter.prop);
    if (filterFieldsColumn.length === NumberConstant.ONE) {
      return filterFieldsColumn[NumberConstant.ZERO].type;
    } else if (filterFieldsInput.length === NumberConstant.ONE) {
      return filterFieldsInput[NumberConstant.ZERO].type;
    }
  }
  public sortListByColumnAndOrder(list: any[], order: any, column: string = ''): any[] {
    if (!list || order === '' || !order) {
      return list;
    }
    if (list.length <= 1) {
      return list;
    }
    if (!column || column === SharedCrmConstant.EMPTY_STRING) {
      if (order === SharedCrmConstant.ASC_SORT.toLowerCase()) {
        return list.sort();
      } else {
        return list.sort().reverse();
      }
    }
    return orderBy(list, [column], [order]);
  }
  public getValue(value: any, numberFormatOptions?: NumberFormatOptions) {
    if (isNotNullOrUndefinedAndNotEmptyValue(numberFormatOptions)) {
      value = Number.parseFloat(value).toFixed(numberFormatOptions.minimumFractionDigits);
    }
    return value;
  }
}
