import { Component, OnInit, ViewContainerRef, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { GenericAccountingService } from '../../services/generic-accounting.service';
import { PageFilterService } from '../../services/page-filter-accounting.service';
import { SearchConstant } from '../../../constant/search-item';
import { AccountsConstant } from '../../../constant/accounting/account.constant';
import {ActivatedRoute} from '@angular/router';
import {StarkRolesService} from '../../../stark-permissions/service/roles.service';
import { PermissionConstant } from '../../../Structure/permission-constant';
import {AuthService} from '../../../login/Authentification/services/auth.service';


@Component({
  selector: 'app-filter-by-account',
  templateUrl: './filter-by-account.component.html',
  styleUrls: ['./filter-by-account.component.scss'],
})
export class FilterByAccountComponent implements OnInit {
  public AccountingPermissions = PermissionConstant.SettingsAccountingPermissions;

  @Input() FilterFormGroup: FormGroup;

  public accountFiltredList: any;
  public beginAccountkeyAction: any;
  public endAccountkeyAction: any;
  public pageFilterStatus = true;

  constructor(private genericAccountingService: GenericAccountingService, private pageFilterService: PageFilterService, private route:ActivatedRoute,
    private viewRef: ViewContainerRef, private starkRolesService: StarkRolesService, private authService : AuthService) {
  }

  handleFilterAccount(writtenValue: string) {
    this.accountFiltredList = this.genericAccountingService.handleFilterAccount(writtenValue)
      .filter(element => element.code <= AccountsConstant.GENERAL_LEDGER_TRIAL_BALANCE_MAX_ACCOUNT_CODE);
  }

  initAccountFilteredList() {
    this.genericAccountingService.getAccountList().then((accountList: any) => {
      this.accountFiltredList = accountList.slice(0).filter(element => element.code <= AccountsConstant.GENERAL_LEDGER_TRIAL_BALANCE_MAX_ACCOUNT_CODE);
    });
  }

  handleAddNewElementToAccountDropdown() {
    this.genericAccountingService.getAccountList().then((accountList: any) => {
      this.pageFilterService.setDefaultValueOfAccountDropdownToLastElement(accountList[accountList.length - 1], this.FilterFormGroup);
      this.accountFiltredList = accountList.slice(0);
    });
  }

  onSelectBeginAccount(event) {
    this.genericAccountingService.setCodeOnSelectAccount(event, 'beginAccountCode',
      this.FilterFormGroup);
  }

  onSelectEndAccount(event) {
    this.genericAccountingService.setCodeOnSelectAccount(event, 'endAccountCode',
      this.FilterFormGroup);
  }

  addNewBeginAccount() {
    this.pageFilterService.addNewBeginAccount(this.viewRef, this.handleAddNewElementToAccountDropdown.bind(this));
  }

  addNewEndAccount() {
    this.pageFilterService.addNewEndAccount(this.viewRef, this.handleAddNewElementToAccountDropdown.bind(this));
  }

  handleAccountKeyAction() {
    const inputBeginAccount = document.getElementById('beginAccountInput');
    const inputEndAccount = document.getElementById('endAccountInput');
    this.beginAccountkeyAction = (event) => {
      this.genericAccountingService.handleKeyAction(event, this.FilterFormGroup, 'beginAccountId', 'beginAccountCode');
    };
    this.endAccountkeyAction = (event) => {
      this.genericAccountingService.handleKeyAction(event, this.FilterFormGroup, 'endAccountId', 'endAccountCode');
    };
    inputBeginAccount.addEventListener(SearchConstant.KEY_DOWN, this.beginAccountkeyAction);
    inputEndAccount.addEventListener(SearchConstant.KEY_DOWN, this.endAccountkeyAction);
  }

  selectionChangeAccountDropdown($event) {
    this.genericAccountingService.selectionChangeAccountDropdown($event);
  }

  public ngOnInit(): void {
    this.handleAccountKeyAction();
    this.initAccountFilteredList();
  }

}
