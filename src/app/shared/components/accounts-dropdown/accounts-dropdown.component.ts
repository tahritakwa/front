import {Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewContainerRef} from '@angular/core';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { AccountService } from '../../../accounting/services/account/account.service';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { Account } from '../../../models/shared/account.model';
import { DropDownComponent } from '../../interfaces/drop-down-component.interface';
import { FormGroup } from '@angular/forms';
import { FormModalDialogService } from '../../services/dialog/form-modal-dialog/form-modal-dialog.service';
import { AccountsConstant } from '../../../constant/accounting/account.constant';
import { AddAccountComponent } from '../../../accounting/account/add-account/add-account.component';
import {ComboBoxComponent} from '@progress/kendo-angular-dropdowns';
import {GenericAccountingService} from '../../../accounting/services/generic-accounting.service';
const ACCOUNT_COMBOBOX = 'accountComboBox';

@Component({
  selector: 'app-accounts-dropdown-component',
  templateUrl: './accounts-dropdown.component.html',
  styleUrls: ['./accounts-dropdown.component.scss']
})
export class AccountsDropdownComponent implements OnInit, DropDownComponent {
  @Input() group: FormGroup;
  @Output() Selected = new EventEmitter<boolean>();
  @Input() selectedValue;
  @Input() allowCustom;
  @Input() isInGrid;
  @Input() listAccount;
  @Input() chartsAccountsList;
  @Input() planCode = NumberConstant.ZERO;
  @Input() fieldName;
  @Input() comingFromModal: boolean;
  @Input() accountingConfig;
  @Input() tiersTypeInput;
  @Input() taxType;
  @Input() disabled:boolean;
  public addedAccount: Account;

  public planId = NumberConstant.ZERO;
  public accountsDataSource: Account[];
  public accountsFilteredDataSource: Account[];
  @ViewChild(ACCOUNT_COMBOBOX) public accountComboBox: ComboBoxComponent;

  constructor(private accountService: AccountService,
    private formModalDialogService: FormModalDialogService,
    private viewRef: ViewContainerRef) {}

  initDataSource(): void {
    if (this.tiersTypeInput === NumberConstant.ONE) {
      this.accountService.getJavaGenericService().getData('tiers-accounts').subscribe(data => {
        if (data) {
          this.accountsDataSource = data.customerAccounts;
          this.accountsFilteredDataSource = data.customerAccounts;
        }
      });
    } else if (this.tiersTypeInput === NumberConstant.TWO) {
      this.accountService.getJavaGenericService().getData('tiers-accounts').subscribe(data => {
        this.accountsDataSource = data.supplierAccounts;
        this.accountsFilteredDataSource = data.supplierAccounts;
      });
    } else if(this.taxType){
      this.accountService.getJavaGenericService().getData('tax-accounts').subscribe(data => {
        if (this.taxType === 'taxPurchasesAccounts') {
          this.accountsDataSource = data.taxPurchasesAccounts;
          this.accountsFilteredDataSource = data.taxPurchasesAccounts;
        } else if (this.taxType === 'taxSalesAccounts') {
          this.accountsDataSource = data.taxSalesAccounts;
          this.accountsFilteredDataSource = data.taxSalesAccounts;
        } else if (this.taxType === 'hTaxPurchasesAccounts') {
          this.accountsDataSource = data.hTaxPurchasesAccounts;
          this.accountsFilteredDataSource = data.hTaxPurchasesAccounts;
        } else if (this.taxType === 'htaxSalesAccounts'){
          this.accountsDataSource = data.hTaxSalesAccounts;
          this.accountsFilteredDataSource = data.hTaxSalesAccounts;
        } else if (this.taxType === 'fodecPurchasesAccounts') {
          this.accountsFilteredDataSource = data.fodecPurchasesAccounts;
        } else if (this.taxType === 'fodecSalesAccounts'){
          this.accountsFilteredDataSource = data.fodecSalesAccounts;
        }
      });
    } else {
      if(this.fieldName === 'bankIdAccountingAccount'){
        this.accountService.getJavaGenericService().getData('bank-accounts').subscribe(data => {
          this.accountsDataSource = data;
          this.accountsFilteredDataSource = data;
        });
      } else {
        this.accountService.getJavaGenericService().getData('with-holding-tax-accounts').subscribe(data => {
          this.accountsDataSource = data;
          this.accountsFilteredDataSource = data;
        });
      }
    }
  }

  getAccountListWithParentCode() {
    return new Promise(resolve => {
      this.accountService.getJavaGenericService().getEntityList(AccountsConstant.GET_ACCOUNTS_WITH_PARENT_CODE + `/${this.planCode}`)
        .subscribe((data) => {
          resolve(data);
          this.accountsDataSource = data;
          this.accountsFilteredDataSource = this.accountsDataSource.slice(NumberConstant.ZERO);
        });
    });
  }

  handleAddNewElementToAccountDropdown() {
    this.getAccountListWithParentCode().then((data: any) => {
      if (this.accountsDataSource.length < data.length) {
        this.accountsDataSource = data;
        this.accountsFilteredDataSource = this.accountsDataSource.slice(NumberConstant.ZERO);
        this.addedAccount = data[NumberConstant.ZERO];
        this.accountsDataSource.map(account => {
          if (account.id > this.addedAccount.id) {
            this.addedAccount = account;
          }
        });
        this.group.controls[this.fieldName].setValue(this.addedAccount);
      }
    });
  }

  handleFilter(value: string): void {
    this.accountsFilteredDataSource = this.accountsDataSource.filter((s) =>
      s.label.toLowerCase().includes(value.toLowerCase())
      || s.code.toString().includes(value.toLowerCase()));
  }


  private initCharAccounts() {
    this.accountsDataSource = this.chartsAccountsList;
    this.accountsFilteredDataSource = this.chartsAccountsList;
  }

  private initAccounts() {
    this.accountsDataSource = this.listAccount;
    this.accountsFilteredDataSource = this.listAccount;
  }

  ngOnInit() {
    this.listAccount ? this.initAccounts() :
      this.chartsAccountsList ? this.initCharAccounts() : this.initDataSource();
  }

  public openComboBox() {
    this.accountComboBox.toggle(true);
  }
}
