import {Component, OnDestroy, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs/Subscription';
import {TranslateService} from '@ngx-translate/core';
import {ValidationService} from '../../../shared/services/validation/validation.service';
import {AccountingConfigurationService} from '../../services/configuration/accounting-configuration.service';
import {GrowlService} from '../../../../COM/Growl/growl.service';
import {AccountsDropdownComponent} from '../../../shared/components/accounts-dropdown/accounts-dropdown.component';
import {SharedAccountingConstant} from '../../../constant/accounting/sharedAccounting.constant';
import {FiscalYearDropdownComponent} from '../../../shared/components/fiscal-year-dropdown/fiscal-year-dropdown.component';
import {Observable} from 'rxjs/Observable';
import {GenericAccountingService} from '../../services/generic-accounting.service';
import {AddJournalComponent} from '../../journal/add-journal/add-journal.component';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {FormModalDialogService} from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import {ShowChartOfAccountsComponent} from '../../chart-of-accounts/chart-of-accounts-show/chart-of-accounts-show.component';
import {ChartAccountService} from '../../services/chart-of-accounts/chart-of-account.service';
import {FiscalYearConstant} from '../../../constant/accounting/fiscal-year.constant';
import {ActivatedRoute, Router, RouterOutlet} from '@angular/router';

import {ChartOfAccountsConstant} from '../../../constant/accounting/chart-of-account.constant';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { AccountingConfigurationConstant } from '../../../constant/accounting/accounting-configuration.constant';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import {StyleConfigService} from '../../../shared/services/styleConfig/style-config.service';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';

@Component({
  selector: 'app-add-accounting-configuration',
  templateUrl: './add-accounting-configuration.component.html',
  styleUrls: ['./add-accounting-configuration.component.scss']
})
export class AddAccountingConfigurationComponent implements OnInit, OnDestroy {

  @ViewChild(RouterOutlet) outlet: RouterOutlet;

  configForm: FormGroup;
  configChartAccountForm: FormGroup;

  public chartAccountToBalanced: any[] = this.activatedRoute.snapshot.data['chartsAccounts'];
  public chartAccountList: any[] = this.activatedRoute.snapshot.data['chartsAccounts'];

  public accounts: any[] = this.activatedRoute.snapshot.data['accounts'];

  public journalFiltredList: any = this.activatedRoute.snapshot.data['journals'];
  public journalSales: any = this.activatedRoute.snapshot.data['journals'];
  public journalPurchases: any = this.activatedRoute.snapshot.data['journals'];
  public journalCoffer: any = this.activatedRoute.snapshot.data['journals'];
  public journalBank: any = this.activatedRoute.snapshot.data['journals'];


  isFinancialAccount: boolean;
  isTiersAccount: boolean;
  isPaymentsAccount: boolean;
  isAmortizationAccount: boolean;
  isJournals: boolean;

  @ViewChild(AccountsDropdownComponent) accountsDropDownComponent;
  @ViewChild(FiscalYearDropdownComponent) fiscalYearDropdownComponent;

  private subscription: Subscription;
  public AccountingPermissions = PermissionConstant.AccountingPermissions;
  public SettingsAccountingPermissions = PermissionConstant.SettingsAccountingPermissions;


  constructor(private fb: FormBuilder,
              private validationService: ValidationService,
              private accountingConfigurationService: AccountingConfigurationService,
              private translate: TranslateService,
              private formModalDialogService: FormModalDialogService,
              private viewRef: ViewContainerRef,
              private growlService: GrowlService,
              public authService: AuthService,
              private chartOfAccountService: ChartAccountService,
              private router: Router,
              private genericAccountingService: GenericAccountingService, private activatedRoute: ActivatedRoute,
              private swalWarrings: SwalWarring,
              private styleConfigService: StyleConfigService
  ) {
  }

  private getDataToUpdate() {
    this.subscription = this.accountingConfigurationService.getJavaGenericService().getEntityList().subscribe(accountingConfig => {
      accountingConfig.id = 0;
      this.configForm.patchValue(accountingConfig);
      if(!this.showSaveOperation()) {
        this.configForm.disable();
      }
    });
    this.chartOfAccountService.getJavaGenericService().getData(ChartOfAccountsConstant.CHART_ACCOUNT_TO_BALANCED).subscribe(data => {
      this.configChartAccountForm.patchValue(data);
      if(!this.showSaveOperation()){
        this.configChartAccountForm.disable();
      }
    });
   }

  public showSpinner() {
    if (this.configForm.value.journalANewId !== '' && this.configChartAccountForm.value.chartAccountsToBalanced !== '') {
      return false;
    }
    return true;
  }


  private initConfigForm() {
    return this.fb.group({
      id: [0],
      cofferIdAccountingAccount: ['', [Validators.required]],
      bankIdAccountingAccount: ['', [Validators.required]],
      intermediateIdAccountingAccount: ['', [Validators.required]],
      taxStampIdAccountingAccountPurchase: ['', [Validators.required]],
      taxStampIdAccountingAccountSales: ['', [Validators.required]],
      discountIdAccountingAccountPurchase: ['', [Validators.required]],
      discountIdAccountingAccountSales: ['', [Validators.required]],
      withHoldingTaxIdAccountingAccount: ['', [Validators.required]],
      customerAccount: ['', [Validators.required]],
      supplierAccount: ['', [Validators.required]],
      taxSalesAccount: ['', [Validators.required]],
      htaxSalesAccount: ['', [Validators.required]],
      taxPurchasesAccount: ['', [Validators.required]],
      htaxPurchasesAccount: ['', [Validators.required]],
      fodecPurchasesAccount: ['', [Validators.required]],
      fodecSalesAccount: ['', [Validators.required]],
      journalANewId: ['', [Validators.required]],
      journalSalesId: ['', [Validators.required]],
      journalPurchasesId: ['', [Validators.required]],
      journalCofferId: ['', [Validators.required]],
      journalBankId: ['', [Validators.required]],
      resultAccount: ['', [Validators.required]],
      tangibleImmobilizationAccount: ['', [Validators.required]],
      tangibleAmortizationAccount: ['', [Validators.required]],
      intangibleImmobilizationAccount: ['', [Validators.required]],
      intangibleAmortizationAccount: ['', [Validators.required]],
      dotationAmortizationAccount:  ['', [Validators.required]],
      startDate: [{value: '', disabled: true}],
      endDate: [{value: '', disabled: true}]
    });
  }

  private initChartAccountForm() {
    return this.fb.group({
      chartAccountsToBalanced: ['', [Validators.required]]
    });
  }

  addNewJournal() {
    this.formModalDialogService.openDialog('ADD_NEW_JOURNAL', AddJournalComponent, this.viewRef, null
      , null, null, SharedConstant.MODAL_DIALOG_SIZE_M);
  }

  receiveTaxStampPurchaseAccounts($event) {
    this.accountsDropDownComponent.initDataSource($event);
  }

  receiveTaxStampSalesAccounts($event) {
    this.accountsDropDownComponent.initDataSource($event);
  }

  receiveDiscountPurchaseAccounts($event) {
    this.accountsDropDownComponent.initDataSource($event);
  }

  receiveDiscountSalesAccounts($event) {
    this.accountsDropDownComponent.initDataSource($event);
  }

  receiveOpeningBalanceAccounts($event) {
    this.accountsDropDownComponent.initDataSource($event);
  }

  receiveClosingBalanceAccounts($event) {
    this.accountsDropDownComponent.initDataSource($event);
  }

  save() {
    if (this.configForm.valid) {
      if(this.isActiveAccountConfigurationFormChanged && this.isAmortizationAccount) {
        this.openModalToConfirmResetDepreciationAssets();
      } else {
        this.subscription = this.accountingConfigurationService.getJavaGenericService().saveEntity(this.configForm.value).subscribe(data => {
          this.growlService.successNotification(this.translate.instant(SharedAccountingConstant.SUCCESS_OPERATION));
        });
      }
    } else {
      this.validationService.validateAllFormFields(this.configForm);
    }
    this.chartOfAccountService.getJavaGenericService().sendData('chart-account-to-balanced', this.configChartAccountForm.value.chartAccountsToBalanced).subscribe();
    this.configForm.markAsUntouched();
    this.configChartAccountForm.markAsUntouched();
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.genericAccountingService.handleCanDeactivateToLeaveCurrentComponent(this.isActiveAccountConfigurationFormChanged.bind(this));
  }

  public isActiveAccountConfigurationFormChanged(): boolean {
    return this.configForm.touched || this.configChartAccountForm.touched;
  }

  handleChartAccountFilter(value: string, listName: string): void {
    this[listName] = this.chartAccountList.filter((s) =>
      s.label.toLowerCase().includes(value.toLowerCase())
      || s.code.toString().includes(value.toLowerCase()));
  }

  addNew(): void {
    this.formModalDialogService.openDialog('ADD_NEW_ACCOUNT', ShowChartOfAccountsComponent, this.viewRef, null, SharedConstant.MODAL_DIALOG_SIZE_L);

  }

  openModalToConfirmResetDepreciationAssets(): any {
    const swalWarningMessage = `${this.translate.instant(SharedAccountingConstant.ACCOUNTING_CONFIGURATION_CATEGORIES_NOT_FOUND)}`;
    return this.swalWarrings.CreateSwal(swalWarningMessage, SharedAccountingConstant.RESET_DEPRECIATION_ASSETS,
      SharedConstant.YES, SharedConstant.NO).then((result) => {
        if (result.value) {
          forkJoin(this.accountingConfigurationService.getJavaGenericService().deleteList(AccountingConfigurationConstant.RESET_DEPRECIATION_ASSETS_CONFIGURATION_URL),
          this.accountingConfigurationService.getJavaGenericService().deleteList(AccountingConfigurationConstant.RESET_DEPRECIATION_ASSETS_URL))
          .subscribe(() => {
            this.accountingConfigurationService.getJavaGenericService().saveEntity(this.configForm.value).subscribe(data => {
            this.growlService.successNotification(this.translate.instant(SharedAccountingConstant.SUCCESS_OPERATION));
            });
          });
        }
      });
  }

  handleFilterChange(value: string, listName: string): void {
    this[listName]= this.journalFiltredList.filter((s) =>
      s.label.toLowerCase().includes(value.toLowerCase())
      || s.code.toString().includes(value.toLowerCase()));
  }
  ngOnInit() {
    this.configForm = this.initConfigForm();
    this.configChartAccountForm = this.initChartAccountForm();
    this.getDataToUpdate();

    this.isFinancialAccount = this.router.url.indexOf('financialAccount') > 0;
    this.isTiersAccount = this.router.url.indexOf('tiersAccount') > 0;
    this.isPaymentsAccount = this.router.url.indexOf('paymentsAccount') > 0;
    this.isAmortizationAccount = this.router.url.indexOf('amortizationAccount') > 0;
    this.isJournals = this.router.url.indexOf('journals') > 0;
  }

  ngOnDestroy(): void {
    if (this.subscription !== undefined) {
      this.subscription.unsubscribe();
    }
  }

  getFooterClass(): string {
    return this.styleConfigService.getFooterClassSettingLayoutAddComponent();
  }

  public showSaveOperation(): boolean {
    return this.isValidPermission(this.isFinancialAccount, this.SettingsAccountingPermissions.UPDATE_FINANCIAL_ACCOUNTS_SETTINGS)
      || this.isValidPermission(this.isTiersAccount, this.SettingsAccountingPermissions.UPDATE_TIERS_ACCOUNTS_SETTINGS)
      || this.isValidPermission(this.isPaymentsAccount, this.SettingsAccountingPermissions.UPDATE_PAYMENTS_ACCOUNTS_SETTINGS)
      || this.isValidPermission(this.isAmortizationAccount, this.SettingsAccountingPermissions.UPDATE_AMORTIZATION_ACCOUNT_SETTINGS)
      || this.isValidPermission(this.isJournals, this.SettingsAccountingPermissions.UPDATE_ACCOUNTING_JOURNAL_SETTINGS);
    }

    isValidPermission(isTypeSetting: boolean, AccountingPermissionsUpdate: string) {
      return isTypeSetting && this.authService.hasAuthority(AccountingPermissionsUpdate);
    }

}
