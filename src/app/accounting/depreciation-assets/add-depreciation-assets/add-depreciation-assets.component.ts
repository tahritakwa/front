import {Component, OnDestroy, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Depreciation} from '../../../models/accounting/depreciation';
import {ReportingService} from '../../services/reporting/reporting.service';
import {ReportingConstant} from '../../../constant/accounting/reporting.constant';
import {SharedAccountingConstant} from '../../../constant/accounting/sharedAccounting.constant';
import {DatePipe} from '@angular/common';
import {GrowlService} from '../../../../COM/Growl/growl.service';
import {TranslateService} from '@ngx-translate/core';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {CessionDepreciationType} from '../../../models/enumerators/cession-depreciation-type.enum';
import {EnumValues} from 'enum-values';
import {isDateValidAccounting, ValidationService} from '../../../shared/services/validation/validation.service';
import {AccountingConfigurationService} from '../../services/configuration/accounting-configuration.service';
import {AccountingConfigurationConstant} from '../../../constant/accounting/accounting-configuration.constant';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {CompanyService} from '../../../administration/services/company/company.service';
import {Currency} from '../../../models/administration/currency.model';
import { AccountsConstant } from '../../../constant/accounting/account.constant';
import { AccountService } from '../../services/account/account.service';
import { flatMap } from 'rxjs/operators';
import { ChartAccountService } from '../../services/chart-of-accounts/chart-of-account.service';
import { FormModalDialogService } from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { AddAccountComponent } from '../../account/add-account/add-account.component';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import {GenericAccountingService} from '../../services/generic-accounting.service';
import { ReducedCurrency } from '../../../models/administration/reduced-currency.model';
import { RoleConfigConstant } from '../../../Structure/_roleConfigConstant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';

@Component({
  selector: 'app-add-depreciation-assets',
  templateUrl: './add-depreciation-assets.component.html',
  styleUrls: ['./add-depreciation-assets.component.scss']
})
export class AddDepreciationAssetsComponent implements OnInit, OnDestroy {
  public formatDate: string = this.translate.instant(SharedConstant.DATE_FORMAT);
  /*
  * id Subscription
  */
  private idSubscription: Subscription;
  /*
    * update mode
    */
  public isUpdateMode = false;
  public isServiceDateEmpty = true;
  public depreciationFormGroup: FormGroup;
  public amortizationFormGroup: FormGroup;
  public cessionFormGroup: FormGroup;
  public selectedAccountValueImmobilization: number;
  public selectedAccountValueAmortization: number;

  public date: string;
  public cessionEnum = CessionDepreciationType;
  public cessionList: any [];
  public selectedCession: any;
  public cession: any;
  public minDateCession: Date;
  public cessionListFilter: any [];
  // number format
  public formatNumberOptions: any;
  public vcn: number;
  public annuityExercise: number;
  public previousDepreciation: number;
  public acquisitionValue: number;
  public showDelay = SharedAccountingConstant.SHOW_TOOLTIP_DELAY;
  public minAmountCession = NumberConstant.ONE;
  public purchasePrecision: number;
  public immobilizationAccountSelected: any;
  public amortizationAccountSelected: any;
  public idAmortizationAccount: number;
  public isAccounted = false;
  public immobilizationAccountList = [];
  public amortizationAccountList = [];
  public currentFiscalYear:any;
  public selectedImmobilizationValue: any;
  public proposedAmortizationAccount: any;
  public amortizationCodeProposed: number;
  public planCode = NumberConstant.ZERO;
  public planId = NumberConstant.ZERO;
  public addedAccount;
  public AccountingPermissions = PermissionConstant.AccountingPermissions;
  public SettingsAccountingPermissions = PermissionConstant.SettingsAccountingPermissions;

  public accounts = this.activatedRoute.snapshot.data['accounts'];

  /**
   * Contructor
   * @param router
   * @param depreciation
   * @param reportingService
   * @param accountingConfigurationService
   * @param datePipe
   * @param growlService
   * @param translate
   * @param validationService
   *@param companyService
   */

  constructor( private router: Router, private depreciation: Depreciation,
    private  reportingService: ReportingService, private accountingConfigurationService: AccountingConfigurationService,
    private datePipe: DatePipe, private growlService: GrowlService, private translate: TranslateService,
    private validationService: ValidationService, private companyService: CompanyService, public authService: AuthService,
    private activatedRoute: ActivatedRoute, private viewRef: ViewContainerRef, private chartAccountService: ChartAccountService
    ,private formModalDialogService: FormModalDialogService, private swalWarrings: SwalWarring, private accountService: AccountService) {
      if (this.activatedRoute.snapshot.data['currentFiscalYear']) {
        this.currentFiscalYear = this.activatedRoute.snapshot.data['currentFiscalYear'];
      } else {
        this.accountingConfigurationService.getJavaGenericService().getEntityList(
          AccountingConfigurationConstant.CURRENT_FISCAL_YEAR_URL
        ).subscribe(data => {
          this.currentFiscalYear = data;
        });
      }
  }

  initDepreciationAssetsForm() {
    this.depreciationFormGroup = new FormGroup({
      'ImmobilizationAccount': new FormControl(null, Validators.required),
      'depreciationPeriod': new FormControl({value: null, disabled: true}),
      'rate': new FormControl({value: '', disabled: true})
    });
  }

  initCessionAssetsForm() {
    this.cessionFormGroup = new FormGroup({
      'cession': new FormControl({value: ''}, Validators.required),
      'dateCession': new FormControl(),
      'amountCession': new FormControl(),
      'serviceDate': new FormControl({value: '', disabled: true})
    });
  }

  initAmortizationAssetsForm() {
    this.amortizationFormGroup = new FormGroup({
      'AmortizationAccount': new FormControl(null, Validators.required),
      'acquisitionValue': new FormControl({value: '', disabled: true}),
      'previousDepreciation': new FormControl({value: '', disabled: true}),
      'annuityExercise': new FormControl({value: '', disabled: true}),
      'vcn': new FormControl({value: '', disabled: true})
    });

  }

  patchDepreciationAssetsForm(depreciationPeroid ?: number) {
    this.depreciationFormGroup.patchValue({
      'depreciationPeriod': depreciationPeroid,
      'rate': this.getPercentage(depreciationPeroid)
    });
  }

  patchAccountAssetsForm(accountImmobilization: any) {
    this.depreciationFormGroup.patchValue({
      'ImmobilizationAccount': accountImmobilization,
    });
  }

  patchAccountAmortizationForm(accountAmortization: any) {
    this.amortizationFormGroup.patchValue({
      'AmortizationAccount' : accountAmortization,
    });
  }

  patchAmortizationAssetsForm(amortization) {
    this.acquisitionValue = amortization.acquisitionValue;
    this.previousDepreciation = amortization.previousDepreciation;
    this.annuityExercise = amortization.annuityExercise;
    this.vcn = amortization.vcn;
  }

  patchCessionAssetsForm(depreciationAssets ?: any) {
    let dateCession;
    if (depreciationAssets.dateCession != null) {
      dateCession = new Date(this.datePipe.transform(depreciationAssets.dateCession,
        SharedAccountingConstant.YYYY_MM_DD_HH_MM_SS));
    } else {
      dateCession = null;
    }
    const dateOfCommissioning = this.datePipe
      .transform(this.depreciation.depreciationAssets.dateOfCommissioning, SharedAccountingConstant.YYYY_MM_DD_HH_MM_SS);
    const cession = depreciationAssets.cession ? CessionDepreciationType.YES : CessionDepreciationType.NO;
    this.getSelectedCession(cession);
    this.cessionFormGroup.patchValue({
      'serviceDate': new Date(dateOfCommissioning),
      'cession': this.selectedCession,
      'dateCession': dateCession,
      'amountCession': depreciationAssets.amountCession
    });
    this.checkEmptyFieldCessionFormGroup();
  }

  calculAmortization() {
    this.checkEmptyFieldCessionFormGroup();
    if (this.cessionFormGroup.valid) {
      this.setDepreciationAssetsValues();
      this.idSubscription = this.reportingService.getJavaGenericService()
        .sendData(ReportingConstant.CALCULATE_AMORTIZATION, this.depreciation.depreciationAssets)
        .subscribe(data => {
          this.patchAmortizationAssetsForm(data);
        });
    } else {
      this.validationService.validateAllFormFields(this.cessionFormGroup);
    }
  }

  getPercentage(depreciationPeriod: any) {
    const rate = NumberConstant.ONE_HUNDRED / Number(depreciationPeriod);
    return rate.toLocaleString().concat(' %');
  }

  /*convert cessionValue depending on enum value*/
  convertCessionEnum() {
    let value: any;
    if (this.cessionFormGroup.value.cession.value === null) {
      value = this.cessionFormGroup.value.cession;
    } else {
      value = this.cessionFormGroup.value.cession.value;
    }
    switch (value) {
      case CessionDepreciationType.NO :
      case undefined :
        return false;
      case CessionDepreciationType.YES :
        return true;
      default:
        return false;
    }
  }


  setIdImmobilizationAccount(value) {
    if (typeof value === 'string') {
      const accountSelected = this.immobilizationAccountList.find(detail => detail.label === value);
      this.depreciationFormGroup.value.ImmobilizationAccount = accountSelected.id;
    }
  }
  setDateCession() {
    let dateCession;
    if (this.cessionFormGroup.value.dateCession === null) {
      dateCession = null;
    } else {
      dateCession = this.datePipe.transform(new Date(this.cessionFormGroup.value.dateCession),
        SharedAccountingConstant.YYYY_MM_DD_HH_MM_SS);
    }
    return dateCession;
  }

  saveOrUpdateAccount() {
    this.checkEmptyFieldCessionFormGroup();
    if (this.cessionFormGroup.valid && this.depreciationFormGroup.valid && this.amortizationFormGroup.valid) {
      this.setIdImmobilizationAccount(this.depreciationFormGroup.value.ImmobilizationAccount);
      const deprectionAsset = {
        'idAssets': this.depreciation.depreciationAssets.idAssets,
        'idImmobilizationAccount': this.depreciationFormGroup.value.ImmobilizationAccount,
        'idAmortizationAccount': this.amortizationFormGroup.value.AmortizationAccount,
        'cession': this.convertCessionEnum(),
        'dateCession': this.cession ? this.setDateCession() : null,
        'amountCession': this.cession ? this.cessionFormGroup.value.amountCession : null,
        'assetsLabel': this.depreciation.depreciationAssets.assetsLabel,
        'dateOfCommissioning': this.depreciation.depreciationAssets.dateOfCommissioning
      };

        if(this.amortizationFormGroup.value.AmortizationAccount.id) {
        deprectionAsset.idAmortizationAccount = this.amortizationFormGroup.value.AmortizationAccount.id;
        }
        if(this.depreciationFormGroup.value.ImmobilizationAccount.id) {
          deprectionAsset.idImmobilizationAccount = this.depreciationFormGroup.value.ImmobilizationAccount.id;
        }

      this.idSubscription = this.reportingService.getJavaGenericService().sendData(
        ReportingConstant.DEPRECIATION_OF_ASSETS, deprectionAsset)
        .subscribe(() => {
          this.growlService.successNotification(this.translate.instant(SharedAccountingConstant.SUCCESS_OPERATION));
          this.router.navigateByUrl(ReportingConstant.LIST_DEPRECIATION_OF_ASSETS_URL);
        });
    } else {
      this.validationService.validateAllFormFields(this.depreciationFormGroup);
      this.validationService.validateAllFormFields(this.cessionFormGroup);
    }
  }

  loadAccount() {
    this.idSubscription = this.reportingService.getJavaGenericService()
      .getEntityById(this.depreciation.depreciationAssets.idAssets,
        ReportingConstant.DEPRECIATION_OF_ASSETS)
      .subscribe(data => {
        if (data.immobilizationAccount != null) {
          this.selectedAccountValueImmobilization = data.immobilizationAccount;
          this.selectedAccountValueAmortization = data.amortizationAccount;
        }
        this.patchAccountAssetsForm(this.selectedAccountValueImmobilization);
        this.patchAccountAmortizationForm(this.selectedAccountValueAmortization);
        this.patchCessionAssetsForm(data);
        this.setUpdateTrue();
        this.checkCession(data.cession);
      });  
  }

  setUpdateTrue() {
    if (this.selectedAccountValueImmobilization != null) {
      this.isUpdateMode = true;
    }
  }

  /*get all cessionEnum */
  loadCessionEnum() {
    this.cessionList = EnumValues.getNamesAndValues(this.cessionEnum);
    this.cessionList.forEach(value => {
      value.name = `${this.translate.instant(value.value)}`;
    });
  }

  /*onSelect value change  */
  selectionChange($event: any) {
    if ($event === undefined || $event.value === CessionDepreciationType.NO) {
      this.cession = false;
    } else if ($event.value === CessionDepreciationType.YES) {
      this.cession = true;
      this.initCessionDateForm();
      this.cessionFormGroup.controls['dateCession'].setValidators([Validators.required,
        isDateValidAccounting(this.minDateCession)]);
      this.cessionFormGroup.controls['amountCession'].setValidators([Validators.required]);
    }
  }

  checkCession(cession: any) {
    this.cession = cession;
  }

  /*add validtor to cessionormGroup  dynamically  */
  checkEmptyFieldCessionFormGroup() {
    this.isServiceDateEmpty = this.depreciation.depreciationAssets.dateOfCommissioning == null? true: false;
    if (this.cessionFormGroup.value.cession.value === CessionDepreciationType.YES) {
      this.cessionFormGroup.controls['dateCession'].setValidators([Validators.required,
        isDateValidAccounting(this.minDateCession)]);
      this.cessionFormGroup.controls['amountCession'].setValidators([Validators.required]);
    } else if (this.cessionFormGroup.value.cession.value === CessionDepreciationType.NO) {
      this.cessionFormGroup.controls['dateCession'].setErrors(null);
      this.cessionFormGroup.controls['amountCession'].setErrors(null);
      this.cessionFormGroup.controls['dateCession'].clearValidators();
      this.cessionFormGroup.controls['amountCession'].clearValidators();
    }
    this.cessionFormGroup.updateValueAndValidity();
  }

  /*get selected current cession value*/
  getSelectedCession(cession: any) {
    this.cessionList.forEach(cessionEnum => {
      if (cessionEnum.value === cession) {
        this.selectedCession = cessionEnum;
      }
    });
  }

  setDepreciationAssetsValues() {
    this.depreciation.depreciationAssets.cession = this.convertCessionEnum();
    this.depreciation.depreciationAssets.amountCession = this.cessionFormGroup.value.amountCession;
    this.depreciation.depreciationAssets.dateCession = this.datePipe.transform(this.cessionFormGroup.value.dateCession,
      SharedAccountingConstant.YYYY_MM_DD_HH_MM_SS);
    this.depreciation.depreciationAssets.dateOfCommissioning = this.datePipe
      .transform(this.depreciation.depreciationAssets.dateOfCommissioning, SharedAccountingConstant.YYYY_MM_DD_HH_MM_SS);
  }

  initCessionDateForm() {
    this.minDateCession = new Date(this.datePipe.transform(this.depreciation.depreciationAssets.dateOfCommissioning));
    this.minDateCession.setDate(this.minDateCession.getDate() + NumberConstant.ONE);
  }

  unAccountedDeprecitionAssets() {
    this.reportingService.getJavaGenericService().deleteEntity(this.depreciation.depreciationAssets.idAssets , ReportingConstant.DEPRECIATION_OF_ASSETS)
            .subscribe(data => {
              this.growlService.successNotification(this.translate.instant(SharedAccountingConstant.SUCCESS_OPERATION));
              this.router.navigateByUrl(ReportingConstant.LIST_DEPRECIATION_OF_ASSETS_URL);
            }, err => {
              this.growlService.ErrorNotification(this.translate.instant(SharedAccountingConstant.FAILURE_OPERATION));
            });

  }
  loadCategory() {
    this.accountingConfigurationService.getJavaGenericService()
      .getEntityById(this.depreciation.depreciationAssets.idCategory,
        AccountingConfigurationConstant.DEPRECIATION_ASSETS_CONFIGURATION_URL)
      .subscribe(data => {
        this.immobilizationAccountSelected = data.immobilizationAccount.id;
        this.amortizationAccountSelected = data.amortizationAccount;
        this.depreciation.depreciationAssets.nbreOfYears = data.depreciationPeriod;
        this.patchDepreciationAssetsForm(data.depreciationPeriod);
        this.calculAmortization();
        this.loadAccount();
        this.isAccounted = true;
      }, error => {
      }, () => {
        if(!this.isAccounted) {
          this.amortizationFormGroup.controls['AmortizationAccount'].disable();
          this.depreciationFormGroup.controls['ImmobilizationAccount'].disable();
        }
      });
  }

  handleCreateNewAccount(viewRef: ViewContainerRef, handleAddNewElementToAccountDropdown: Function, planCode: string, code: string) {
    let swalWarningMessage = `${this.translate.instant(AccountsConstant.ACCOUNT_NOT_FOUND)}`;
    swalWarningMessage = swalWarningMessage.replace(SharedAccountingConstant.CODE_TO_BE_REPLACED_BY, code);
    this.swalWarrings.CreateSwal(swalWarningMessage, AccountsConstant.ARE_YOU_SURE_TO_CREATE_AMORTIZATION_ACCOUNT, SharedConstant.YES, SharedConstant.NO).then((result) => {
      if (result.value) {
        const modalTitle = this.translate.instant(AccountsConstant.ADD_NEW_ACCOUNT);
        this.formModalDialogService.openDialog(modalTitle, AddAccountComponent, viewRef, handleAddNewElementToAccountDropdown,
          { 'id': this.planId, 'planCode': this.planCode, 'code': code }, null, SharedConstant.MODAL_DIALOG_SIZE_L);
      }
    });
  }

  getDataAmortization() {
    return new Promise(resolve => {
    this.accountingConfigurationService.getJavaGenericService().getEntityList().pipe(flatMap(accountingConfig => {
      return this.chartAccountService.getJavaGenericService().getEntityById(accountingConfig.tangibleAmortizationAccount);
        })).subscribe(account => {
        resolve(account);
        this.planCode = account.code;
        this.planId = account.id;
        });
      });
    }


  handleAddNewElementToAccountDropdown() {
    this.getAccountListWithParentCode().then((data: any) => {
      if (this.amortizationAccountList.length < data.length) {
      this.amortizationAccountList = data;
      this.addedAccount = data[NumberConstant.ZERO];
      this.amortizationAccountList.forEach(account =>  {
        if (account.id > this.addedAccount.id) {
          this.addedAccount = account ;
        }
      });
      this.amortizationAccountSelected = this.addedAccount;
    }
    });
  }

  getAccountListWithParentCode() {
    return new Promise(resolve => {
      this.accountService.getJavaGenericService().getEntityList(AccountsConstant.GET_ACCOUNTS_WITH_PARENT_CODE + `/${this.planCode}`)
        .subscribe((data) => {
          resolve(data);
        });
    });
  }

  amortizationAccountChange() {
      const selectedValueId = this.amortizationFormGroup.value.AmortizationAccount;
      this.selectedAccountValueAmortization = this.amortizationAccountList.find(detail => detail.id === selectedValueId);
      if (!this.selectedAccountValueAmortization) {
        this.amortizationFormGroup.controls['AmortizationAccount'].markAsDirty();
        this.amortizationFormGroup.controls['AmortizationAccount'].setErrors({ 'required': true });
      }
  }

  changeAmortizationValue(event: any) {
  const selectedValueId = this.depreciationFormGroup.value.ImmobilizationAccount;
  this.selectedImmobilizationValue = this.immobilizationAccountList.find(detail => detail.id === selectedValueId);
  if (this.selectedImmobilizationValue && this.selectedImmobilizationValue.planCode !== undefined) {
    this.reportingService.getJavaGenericService().getEntityList(ReportingConstant.AMORTIZATION_CODE + `/${this.selectedImmobilizationValue.planCode}`).subscribe(
      data => {
        this.amortizationCodeProposed = data;
        if (this.amortizationCodeProposed < AccountingConfigurationConstant.MAX_AMOUNT_NUMBER) {
          this.proposedAmortizationAccount = this.amortizationAccountList.find(detail => detail.code === this.amortizationCodeProposed);
          if (this.proposedAmortizationAccount) {
          this.amortizationAccountSelected = this.proposedAmortizationAccount;
        } else {
          this.getDataAmortization();
          this.handleCreateNewAccount(this.viewRef, this.handleAddNewElementToAccountDropdown.bind(this) , '', this.amortizationCodeProposed.toString());
          }
        }
    });
  } else {
    this.depreciationFormGroup.controls['ImmobilizationAccount'].markAsDirty();
    this.depreciationFormGroup.controls['ImmobilizationAccount'].setErrors({ 'required': true });
  }
}
  private setSelectedCurrency(currency: ReducedCurrency) {
    this.formatNumberOptions = {
      style: 'currency',
      currency: currency.Code,
      currencyDisplay: 'symbol',
      maximumFractionDigits: currency.Precision,
      minimumFractionDigits: currency.Precision
    };
  }

  getCurrentCompany() {
    this.companyService.getDefaultCurrencyDetails().subscribe((currency: ReducedCurrency) => {
      this.purchasePrecision = currency.Precision;
      this.setSelectedCurrency(currency);
    });
  }
  handleFilterChange(writtenValue) {
    this.cessionList = this.cessionListFilter.filter((s) =>
      s.name.toLowerCase().includes(writtenValue.toLowerCase())
      || s.name.toLocaleLowerCase().includes(writtenValue.toLowerCase())
    );
  }

  initAccountList() {
    this.immobilizationAccountList = this.accounts.tangibleImmobilizationAccounts.concat(this.accounts.intangibleImmobilizationAccounts);
    this.amortizationAccountList = this.accounts.tangibleAmortizationAccounts.concat(this.accounts.intangibleAmortizationAccounts);
  }

  ngOnInit() {
    this.initDepreciationAssetsForm();
    this.initAmortizationAssetsForm();
    this.initCessionAssetsForm();
    this.initCessionDateForm();
    this.getCurrentCompany();
    this.loadCessionEnum();
    this.loadCategory();
    this.cessionListFilter=this.cessionList;
    this.initAccountList();
  }

  ngOnDestroy() {
    if (this.idSubscription !== undefined) {
      this.idSubscription.unsubscribe();
    }
  }
}
