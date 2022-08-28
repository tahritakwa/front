import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { GridDataResult, PagerSettings, SelectAllCheckboxState } from '@progress/kendo-angular-grid';
import { removeFilter } from '@progress/kendo-angular-grid/dist/es2015/filtering/base-filter-cell.component';
import { DataResult, State } from '@progress/kendo-data-query';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { CompanyService } from '../../../administration/services/company/company.service';
import { BankAccountConstant } from '../../../constant/Administration/bank-account.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { Currency } from '../../../models/administration/currency.model';
import { PaymentSlipStatusEnumerator } from '../../../models/enumerators/payment-slip-status.enum';
import { PaymentStatusEnumerator } from '../../../models/enumerators/payment-status.enum';
import { TiersTypeEnumerator } from '../../../models/enumerators/tiers-type.enum';
import { FileInfo } from '../../../models/shared/objectToSend';
import { Reconciliation } from '../../../models/treasury/reconciliation.model';
import { DeadLineDocumentService } from '../../../sales/services/dead-line-document/dead-line-document.service';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { ReconciliationService } from '../../../treasury/services/reconciliation/reconciliation.service';
import { LanguageService } from '../../services/language/language.service';
import { UserCurrentInformationsService } from '../../services/utility/user-current-informations.service';
import { ValidationService } from '../../services/validation/validation.service';
import { ColumnSettings } from '../../utils/column-settings.interface';
import { GridSettings } from '../../utils/grid-settings.interface';
import {LocalStorageService} from '../../../login/Authentification/services/local-storage-service';

@Component({
  selector: 'app-bank-reconciliation',
  templateUrl: './bank-reconciliation.component.html',
  styleUrls: ['./bank-reconciliation.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BankReconciliationComponent implements OnInit {

  @Input() id: number;
  @Output() refreshBanAccountSoldEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  allSettlementIds: number[] = [];
  selectedSettlementIds: number[] = [];
  unreconciledRegulationsValue = true;
  reconciledRegulationsValue = false;
  dateFormat: string = this.translate.instant(SharedConstant.DATE_FORMAT);
  BankReceiptAttachmentFile: Array<FileInfo> = new Array<FileInfo>();
  paymentStatusEnumerator = PaymentStatusEnumerator;
  paymentSlipStatusEnumerator = PaymentSlipStatusEnumerator;
  reconciledFormGroup: FormGroup;
  language: string;
  currentBalance = 0;
  forecastBalance = 0;
  cumulOfUnreconciledRegulation = 0;
  tiersTypeEnum = TiersTypeEnumerator;
  selectableSettings = {
    checkboxOnly: true,
    mode: 'multiple'
  };

  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  selectAllState: SelectAllCheckboxState = SharedConstant.UNCHECKED as SelectAllCheckboxState;
  gridState: State = {
    skip: 0,
    take: 10,
    // Initial filter descriptor
    filter: {
      logic: SharedConstant.LOGIC_AND,
      filters: []
    }
  };
  gridData: GridDataResult = new Object() as DataResult;
  columnsConfig: ColumnSettings[] = [
    {
      title: BankAccountConstant.CODE_SETTLEMENT_TITLE,
      field: BankAccountConstant.CODE,
      tooltip: BankAccountConstant.CODE_SETTLEMENT_TITLE,
      filterable: true
    },
    {
      title: BankAccountConstant.SETTLEMENT_DATE_TITLE,
      field: BankAccountConstant.SETTLEMENT_DATE,
      tooltip: BankAccountConstant.SETTLEMENT_DATE_TITLE,
      filterable: true,
      format: this.dateFormat
    },
    {
      title: BankAccountConstant.REFERENCE_PAYMENT_SLIP_TITLE,
      field: BankAccountConstant.REFERENCE_PAYMENT_SLIP,
      tooltip: BankAccountConstant.REFERENCE_PAYMENT_SLIP_TITLE,
      filterable: true
    },
    {
      title: BankAccountConstant.RECONCILIATION_DATE_TITLE,
      field: BankAccountConstant.RECONCILIATION_DATE,
      tooltip: BankAccountConstant.RECONCILIATION_DATE_TITLE,
      filterable: true,
      format: this.dateFormat
    },
    {
      title: BankAccountConstant.DEBIT_TITLE,
      field: BankAccountConstant.DEBIT,
      tooltip: BankAccountConstant.DEBIT_TITLE,
      filterable: true
    },
    {
      title: BankAccountConstant.CREDIT_TITLE,
      field: BankAccountConstant.CREDIT,
      tooltip: BankAccountConstant.CREDIT_TITLE,
      filterable: true
    },
    {
      title: BankAccountConstant.PAYMENT_STATUS,
      field: BankAccountConstant.ID_PAYMENT_STATUS,
      tooltip: BankAccountConstant.PAYMENT_STATUS,
      filterable: true
    }
  ];

  gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
    gridData: this.gridData
  };
  // Permissions
  public hasValidateRegulationsPermission: boolean;

  constructor(private settlementService: DeadLineDocumentService, private formBuilder: FormBuilder,
    private reconciliationService: ReconciliationService, private validateService: ValidationService, private authService: AuthService,
    private translate: TranslateService, private growlService: GrowlService, private localStorageService : LocalStorageService) {
    this.language = this.localStorageService.getLanguage();
  }

  ngOnInit() {
    this.hasValidateRegulationsPermission = this.authService.hasAuthority(PermissionConstant.TreasuryPermissions.VALIDATION_TREASURY_BANK_ACCOUNT);
    this.createAddFormGroup();
    this.initGridDataSource();
  }

  initGridDataSource() {
    this.settlementService.getBankAccountReconciliationSettlement(this.gridSettings.state, this.id,
      this.unreconciledRegulationsValue, this.reconciledRegulationsValue).subscribe((result) => {
        this.gridSettings.gridData = new Object() as DataResult;
        this.gridSettings.gridData.data = result.Data;
        this.gridSettings.gridData.total = result.Total;
        this.allSettlementIds = result.AllSettlementIds;
        let verifySelectedIds = this.selectedSettlementIds.filter((x) => this.allSettlementIds.includes(x));
        this.selectedSettlementIds = verifySelectedIds;
        this.onSelectedKeysChange();
      });
  }

  createAddFormGroup(idPaymentStatus?: number) {
    this.reconciledFormGroup = this.formBuilder.group({
      IdPaymentStatus: [idPaymentStatus],
      ReconciliationDate: ['', Validators.required]
    });
  }

  validate() {
    if (this.reconciledFormGroup.valid) {
      let reconciliation: Reconciliation = new Reconciliation();
      reconciliation.IdBankAccount = this.id;
      reconciliation.ReconciliationDate = this.reconciledFormGroup.controls.ReconciliationDate.value;
      reconciliation.ObservationsFilesInfo = this.BankReceiptAttachmentFile;
      // cahs settllement when only the unreconciled checkbox is checked
      if (this.selectedSettlementIds && this.selectedSettlementIds.length > NumberConstant.ZERO) {
        if (this.unreconciledRegulationsValue && !this.reconciledRegulationsValue) {
          reconciliation.Id = NumberConstant.ZERO;
          this.reconciliationService.cashSettlements(reconciliation, this.selectedSettlementIds).subscribe((data) => {
            this.BankReceiptAttachmentFile = new Array<FileInfo>();
            this.createAddFormGroup(this.reconciledFormGroup.controls.IdPaymentStatus.value);
            this.allSettlementIds = [];
            this.selectedSettlementIds = [];
            this.selectAllState = SharedConstant.UNCHECKED as SelectAllCheckboxState;
            this.initGridDataSource();
            this.refreshBanAccountSoldEvent.emit(true);
          });
        }
      } else {
        this.growlService.warningNotification(this.translate.instant(BankAccountConstant.NO_SETTLEMENT_SELLECTED_ALERT_INFO));
      }
    } else {
      this.validateService.validateAllFormFields(this.reconciledFormGroup);
    }
  }

  dataStateChange($event: State) {
    this.gridSettings.state = $event;
    this.initGridDataSource();
  }

  onSelectedKeysChange() {
    if (this.selectedSettlementIds.length === 0) {
      this.selectAllState = SharedConstant.UNCHECKED as SelectAllCheckboxState;
    } else if (this.selectedSettlementIds.length > 0 && this.selectedSettlementIds.length < this.allSettlementIds.length) {
      this.selectAllState = SharedConstant.INDETERMINATE as SelectAllCheckboxState;
    } else {
      this.selectAllState = SharedConstant.CHECKED as SelectAllCheckboxState;
    }
  }

  onSelectAllChange(checkedState: SelectAllCheckboxState) {
    if (checkedState === SharedConstant.CHECKED as SelectAllCheckboxState) {
      this.selectAllState = SharedConstant.CHECKED as SelectAllCheckboxState;
      this.selectedSettlementIds = Object.assign([], this.allSettlementIds);
    } else {
      this.selectAllState = SharedConstant.UNCHECKED as SelectAllCheckboxState;
      this.selectedSettlementIds = [];
    }
  }

  paymentMethodFilterChange($event) {
    removeFilter(this.gridSettings.state.filter, BankAccountConstant.ID_PAYMENT_STATUS);
    if ($event) {
      this.gridSettings.state.filter.filters.push({ field: BankAccountConstant.ID_PAYMENT_STATUS, operator: 'eq', value: $event });
    }
    this.initGridDataSource();
  }

  checkBoxValueChange() {
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.gridSettings.state.take = NumberConstant.TEN;
    this.initGridDataSource();
  }

}
