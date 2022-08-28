import {Component, Injectable, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {FormModalDialogService} from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import {ChartOfAccountAddComponent} from '../chart-of-account-add/chart-of-accounts-add.component';
import {ChartOfAccountsConstant} from '../../../constant/accounting/chart-of-account.constant';
import {SwalWarring} from '../../../shared/components/swal/swal-popup';
import {ChartAccountService} from '../../services/chart-of-accounts/chart-of-account.service';
import {GrowlService} from '../../../../COM/Growl/growl.service';
import {AutoCompleteComponent} from '@progress/kendo-angular-dropdowns';
import {SharedAccountingConstant} from '../../../constant/accounting/sharedAccounting.constant';
import {AccountsConstant} from '../../../constant/accounting/account.constant';
import {StarkRolesService} from '../../../stark-permissions/service/roles.service';
import {GenericAccountingService} from '../../services/generic-accounting.service';
import {isNotNullOrUndefinedAndNotEmptyValue} from '../../../stark-permissions/utils/utils';
import {NumberConstant} from '../../../constant/utility/number.constant';
import { RoleConfigConstant } from '../../../Structure/_roleConfigConstant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';

@Component({
  selector: 'app-chart-of-accounts-show',
  templateUrl: './chart-of-accounts-show.component.html',
  styleUrls: ['./chart-of-accounts-show.component.scss']
})
@Injectable()
export class ShowChartOfAccountsComponent implements OnInit {
  @ViewChild('autocomplete') public autocomplete: AutoCompleteComponent;
  public selectedKeys: any[] = ['0'];
  public selectedItemToOpen: any = [];
  chartOfAccountsForm: FormGroup;
  public data: any[];
  public selectedItemId: number;
  public value: string;
  public chartAccountList = [];
  public searchType = true;
  public listItem = [];
  public listItemFiltred = [];
  public AccountingPermissions = PermissionConstant.SettingsAccountingPermissions;

  constructor(public translate: TranslateService,
              private formModalDialogService: FormModalDialogService, private viewRef: ViewContainerRef,
              private swalWarrings: SwalWarring, private chartAccountService: ChartAccountService,
              private growlService: GrowlService, public authService: AuthService) {
  }

  /**
   * Add new element
   * @param isUpdateMode
   */
  public addNew(isUpdateMode: boolean, isNewClass: boolean) {
    this.selectedItemToOpen['isUpdateMode'] = isUpdateMode;
    this.selectedItemToOpen['isNewClass'] = isNewClass;
    let title;
    if (isUpdateMode) {
      if (this.selectedItemToOpen['item'].parentId === null) {
        title = ChartOfAccountsConstant.EDIT_PARENT_CHART_ACCOUNT;
      } else {
        title = ChartOfAccountsConstant.EDIT_CHART_ACCOUNT;
      }
    } else {
      if (isNewClass) {
        title = ChartOfAccountsConstant.ADD_PARENT_CHART_ACCOUNT;
      } else {
        title = ChartOfAccountsConstant.ADD_NEW_CHART_ACCOUNT;
      }
    }
    // Prepare title by the boolean isUpdateMode
    // Open modal dialog ==> refresh the treeView
    this.formModalDialogService.openDialog(title, ChartOfAccountAddComponent,
      this.viewRef, this.initGridDataSource.bind(this, true), this.selectedItemToOpen);
  }

  /**
   * delete
   */
  public deleteChartOfAccounts() {
    const swalWarningMessage = `${this.translate.instant(AccountsConstant.ACCOUNTING_SWAL_TEXT)}`;
    this.swalWarrings.CreateSwal(swalWarningMessage, AccountsConstant.ARE_YOU_SURE).then((result) => {
      if (result.value) {
        this.chartAccountService.getJavaGenericService().deleteEntity(this.selectedItemId).toPromise().then(async res => {
          if (res) {
            await new Promise(resolve => resolve(
              this.successOperation()
            ));
          }
        });
      }
    });
  }

  private async successOperation() {
    this.growlService.successNotification(this.translate.instant(SharedAccountingConstant.SUCCESS_OPERATION));
    await this.initGridDataSource();
  }

  /**
   * Event on select
   * @param param0
   */
  public handleSelection({index, dataItem}: any): void {
    // Selected key
    this.selectedKeys = [index];
    if (dataItem) {
      this.selectedItemId = dataItem.id;
      this.selectedItemToOpen['item'] = dataItem;
      this.enableButtons();
    } else {
      this.disableButtons();
    }
    this.selectedKeys = this.selectedKeys[NumberConstant.ZERO];
  }

  /**
   * disable buttons
   */
  public disableButtons() {
    this.changeButtonsStyle('disabledDiv');
  }

  /**
   * enable buttons when item selected
   */
  public enableButtons() {
    this.changeButtonsStyle('');
  }

  changeButtonsStyle(className: string): void {
    if (isNotNullOrUndefinedAndNotEmptyValue(this.getElement('divButtonAdd'))) {
      this.setAttributeClass(this.getElement('divButtonAdd'), className);
    }
  }

  getElement(elementId) {
    return document.getElementById(elementId);
  }

  setAttributeClass(element: any, className: string) {
    element.setAttribute('class', className);
    if (document.getElementById('divButtonAdd') !== null) {
      document.getElementById('divButtonAdd').setAttribute('class', className);
    }
  }

  /**
   * Retreive the data from the server
   */
  initGridDataSource() {
    /**
     * Using generic service from GenericAccountService to get list of chartOfAccounts
     *
     */
    if (this.authService.hasAuthority(this.AccountingPermissions.VIEW_CHART_OF_ACCOUNTS)) {
      this.chartAccountService.getJavaGenericService().getEntityList(ChartOfAccountsConstant.BUILD_CHARTS_ACCOUNT).subscribe(res => {
        this.data = res;
        this.chartAccountList = res;
        this.disableButtons();
      });
    } else {
      this.disableButtons();
    }
  }

  /**
   * initialize component
   */
  ngOnInit() {
    this.initGridDataSource();
    this.disableButtons();
  }

  onSearch() {
    if (this.value) {
      this.chartAccountService.getJavaGenericService().getEntityList(
        ChartOfAccountsConstant.SEARCH_BY_LABEL + `?value=${this.value}`).subscribe(data => {
        this.data = data;
      });
    } else {
      this.data = this.chartAccountList;
    }
  }

}
