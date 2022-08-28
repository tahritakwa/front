import { NgModule } from '@angular/core';
import { PaymentModeService } from '../payment/services/payment-method/payment-mode.service';
import { DeadLineDocumentService } from '../sales/services/dead-line-document/dead-line-document.service';
import { WithholdingTaxService } from '../shared/services/withholding-tax/withholding-tax.service';
import { SharedModule } from '../shared/shared.module';
import { StarkPermissionsGuard } from '../stark-permissions/stark-permissions.module';
import { BankAccountDetailsComponent } from './bank-management/bank-account-details/bank-account-details.component';
import { BankAccountFromSettingComponent } from './bank-management/bank-account-from-setting/bank-account-from-setting.component';
import { BankAccountFromTreasuryComponent } from './bank-management/bank-account-from-treasury/bank-account-from-treasury.component';
import { BankAccountComponent } from './bank-management/bank-account/bank-account.component';
import { AddAdvencedBankComponent } from './bank-management/bank/add-advenced-bank/add-advenced-bank.component';
import { ListBankComponent } from './bank-management/bank/list-bank/list-bank.component';
import { CashRegisterBalanceSectionComponent
 } from './cash-management/cash-registers/cash-register-balance-section/cash-register-balance-section.component';
import { CashRegisterFundsTransferSectionComponent
 } from './cash-management/cash-registers/cash-register-funds-transfer-section/cash-register-funds-transfer-section.component';
import { CashRegisterGeneralSectionComponent
 } from './cash-management/cash-registers/cash-register-general-section/cash-register-general-section.component';
// tslint:disable-next-line:max-line-length
import { CashRegisterInProgessSectionComponent } from './cash-management/cash-registers/cash-register-in-progress/cash-register-in-progess-section/cash-register-in-progess-section.component';
import { GridForInProgessSectionComponent
} from './cash-management/cash-registers/cash-register-in-progress/grid-for-in-progess-section/grid-for-in-progess-section.component';
import { CashRegisterWalletSectionComponent
} from './cash-management/cash-registers/cash-register-wallet/cash-register-wallet-section/cash-register-wallet-section.component';
import { WalletCashComponent } from './cash-management/cash-registers/cash-register-wallet/wallet-cash/wallet-cash.component';
import { WalletCustomerBankCheckComponent
 } from './cash-management/cash-registers/cash-register-wallet/wallet-customer-bank-check/wallet-customer-bank-check.component';
import { WalletCustomerBankDraftComponent
 } from './cash-management/cash-registers/cash-register-wallet/wallet-customer-bank-draft/wallet-customer-bank-draft.component';
import { WalletGridComponent } from './cash-management/cash-registers/cash-register-wallet/wallet-grid/wallet-grid.component';
import { WalletSupplierBankCheckComponent
 } from './cash-management/cash-registers/cash-register-wallet/wallet-supplier-bank-check/wallet-supplier-bank-check.component';
import { WalletSupplierBankDraftComponent
 } from './cash-management/cash-registers/cash-register-wallet/wallet-supplier-bank-draft/wallet-supplier-bank-draft.component';
import { CashRegistersAddComponent } from './cash-management/cash-registers/cash-registers-add/cash-registers-add.component';
import { CashRegistersListComponent } from './cash-management/cash-registers/cash-registers-list/cash-registers-list.component';
import { CloseFundTransfertBankCheckListComponent
 } from './cash-management/funds-tranfer/close-fund-transfert-bank-check-list/close-fund-transfert-bank-check-list.component';
import { CloseFundTransfertBankDraftListComponent
 } from './cash-management/funds-tranfer/close-fund-transfert-bank-draft-list/close-fund-transfert-bank-draft-list.component';
import { CloseFundTransfertCashListComponent
 } from './cash-management/funds-tranfer/close-fund-transfert-cash-list/close-fund-transfert-cash-list.component';
import { CloseFundTransfertGridComponent
 } from './cash-management/funds-tranfer/close-fund-transfert-grid/close-fund-transfert-grid.component';
import { CloseFundTransfertVoucherListComponent } from './cash-management/funds-tranfer/close-fund-transfert-voucher-list/close-fund-transfert-voucher-list.component';
import { FundsTransferAddComponent } from './cash-management/funds-tranfer/funds-transfer-add/funds-transfer-add.component';
import { FundsTransferListComponent } from './cash-management/funds-tranfer/funds-transfer-list/funds-transfer-list.component';
import { AddPaymentSlipComponent } from './components/add-payment-slip/add-payment-slip.component';
import { AddSettlementComponent } from './components/add-settlement/add-settlement.component';
import { AssetFinancialCommitmentNotBilledComponent
 } from './components/asset-financial-commitment-not-billed/asset-financial-commitment-not-billed.component';
import { CardViewBankAccountComponent } from './components/card-view-bank-account/card-view-bank-account.component';
import { CashRegisterDropdownComponent } from './components/cash-register-dropdown/cash-register-dropdown.component';
import { CashRegisterTypeDropdownComponent } from './components/cash-register-type-dropdown/cash-register-type-dropdown.component';
import { CashRegisterZoneComponent } from './components/cash-register-zone/cash-register-zone.component';
import { ConfirmSettlementComponent } from './components/confirm-settlement/confirm-settlement.component';
import { CustomerOutstandingFilterComponent } from './components/customer-outstanding-filter/customer-outstanding-filter.component';
import { DocumentOutstandingTypeDropdownComponent
 } from './components/document-outstanding-type-dropdown/document-outstanding-type-dropdown.component';
import { FinancialCommitmentNotBilledComponent
 } from './components/financial-commitment-not-billed/financial-commitment-not-billed.component';
import { InvoiceCommitmentNotBilledComponent } from './components/invoice-commitment-not-billed/invoice-commitment-not-billed.component';
import { InvoiceDocumentStatusComponent } from './components/invoice-document-status/invoice-document-status.component';
import { InvoiceFinancialCommitmentNotBilledComponent
} from './components/invoice-financial-commitment-not-billed/invoice-financial-commitment-not-billed.component';
import { ListPaymentSlipComponent } from './components/list-payment-Slip/list-payment-slip.component';
import { OutstandingDocumentComponent } from './components/outstanding-document/outstanding-document.component';
import { PagerTreasuryComponent } from './components/pager-treasury/pager-treasury.component';
import { PaymentSlipMenuComponent } from './components/payment-slip-menu/payment-slip-menu.component';
import { PopUpSelectedFinancialCommitmentComponent
 } from './components/pop-up-selected-financial-commitment/pop-up-selected-financial-commitment.component';
import { PopUpSettlementReplacementComponent } from './components/pop-up-settlement-replacement/pop-up-settlement-replacement.component';
import { PopUpSettlementUpdateDisposeComponent
 } from './components/pop-up-settlement-update-dispose/pop-up-settlement-update-dispose.component';
import { SettlementsHistoryComponent } from './components/settlements-history/settlements-history/settlements-history.component';
import { TiersReceivablesComponent } from './components/tiers-receivables/tiers-receivables.component';
import { TransfertFundTypeDropdownComponent } from './components/transfert-fund-type-dropdown/transfert-fund-type-dropdown.component';
import { CustomerOutstandingDocumentComponent
 } from './customer/customer-outstanding/customer-outstanding-document/customer-outstanding-document.component';
import { DeliveryFormNotBilledComponent
} from './customer/customer-outstanding/delivery-form-not-billed/delivery-form-not-billed.component';
import { CustomerPaymentSlipComponent } from './customer/customer-payment-slip/customer-payment-slip.component';
import { CustomerReceivablesComponent } from './customer/customer-receivables/customer-receivables.component';
import { PaymentHistoryComponent } from './customer/payment-history/payment-history.component';
import { AddCashPaymentSlipComponent } from './payment-slip/cash/add-cash-payment-slip/add-cash-payment-slip.component';
import { ListCashPaymentSlipComponent } from './payment-slip/cash/list-cash-payment-slip/list-cash-payment-slip.component';
import { AddCheckPaymentSlipComponent } from './payment-slip/check/add-check-payment-slip/add-check-payment-slip.component';
import { ListCheckPaymentSlipComponent } from './payment-slip/check/list-check-payment-slip/list-check-payment-slip.component';
import { AddDraftPaymentSlipComponent } from './payment-slip/draft/add-draft-payment-slip/add-draft-payment-slip.component';
import { ListDraftPaymentSlipComponent } from './payment-slip/draft/list-draft-payment-slip/list-draft-payment-slip.component';
import { AmountFormatService } from './services/amount-format.service';
import { CustomerOutstandingService } from './services/customer-outstanding.service';
import { DocumentUtilityService } from './services/document-utility.service';
import { PaymentSlipService } from './services/payment-slip.service';
import { ReconciliationService } from './services/reconciliation/reconciliation.service';
import { DisbursementHistoryComponent } from './supplier/disbursement-history/disbursement-history.component';
import { SupplierOutstandingDocumentComponent
 } from './supplier/supplier-outstanding/supplier-outstanding-document/supplier-outstanding-document.component';
import { SupplierOutstandingComponent } from './supplier/supplier-outstanding/supplier-outstanding.component';
import { SupplierReceivablesComponent } from './supplier/supplier-receivables/supplier-receivables.component';
import { TreasuryRoutingModule } from './treasury-routing.module';
import { WithholdingTaxConfigurationComponent } from './withholding-tax-configuration/withholding-tax-configuration.component';
import { ProvisionFundTransfertComponent
 } from './cash-management/funds-tranfer/provision-fund-transfert/provision-fund-transfert.component';
import { Ng2TelInputModule } from 'ng2-tel-input';
import { SearchBankComponent } from './bank-management/bank/search-bank/search-bank.component';
import { BankAgencyComponent } from './bank-management/bank/bank-agency/bank-agency.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AddWithHoldingTaxConfigurationComponent
 } from './withholding-tax-configuration/add-withholding-tax-configuration/add-withholding-tax-configuration.component';
import { CashRegisterService } from './services/cash-register/cash-register.service';
import { FundsTransferService } from './services/funds-transfer/funds-transfer.service';
import { EditAgencyComponent } from './bank-management/bank/edit-agency/edit-agency.component';
import { WithHoldingTaxTypeComponent } from './components/with-holding-tax-type/with-holding-tax-type.component';
import { TicketService } from './services/ticket/ticket.service';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { CashRegisterSessionComponent } from './cash-management/cash-registers/cash-register-session/cash-register-session.component';
import { SessionCashService } from './services/session-cash/session-cash.service';
import { OpenCashRegisterSessionComponent } from './cash-management/cash-registers/open-cash-register-session/open-cash-register-session.component';
import { CashRegisterTicketComponent } from './cash-management/cash-registers/cash-register-ticket/cash-register-ticket.component';
import { CloseCashRegisterSessionComponent } from './cash-management/cash-registers/close-cash-register-session/close-cash-register-session.component';
import { TicketListComponent } from './components/ticket-list/ticket-list.component';
import { OperationListComponent } from './cash-management/cash-registers/operation-list/operation-list.component';
import { OperationCashService } from './services/operation-cash/operation-cash.service';
import { CashRegisterSettlementComponent } from './cash-management/cash-registers/cash-register-settlement/cash-register-settlement.component';
@NgModule({
  imports: [
    SharedModule.forRoot(),
    LayoutModule,
    TreasuryRoutingModule,
    Ng2TelInputModule,
    NgMultiSelectDropDownModule.forRoot()
  ],
  declarations: [
    SupplierOutstandingComponent,
    CustomerOutstandingFilterComponent,
    DocumentOutstandingTypeDropdownComponent,
    DeliveryFormNotBilledComponent,
    FinancialCommitmentNotBilledComponent,
    AddSettlementComponent,
    PaymentHistoryComponent,
    CustomerReceivablesComponent,
    DisbursementHistoryComponent,
    SettlementsHistoryComponent,
    SupplierReceivablesComponent,
    TiersReceivablesComponent,
    PagerTreasuryComponent,
    BankAccountComponent,
    TiersReceivablesComponent,
    AddAdvencedBankComponent,
    ListBankComponent,
    OutstandingDocumentComponent,
    InvoiceFinancialCommitmentNotBilledComponent,
    AssetFinancialCommitmentNotBilledComponent,
    PopUpSettlementReplacementComponent,
    InvoiceDocumentStatusComponent,
    SupplierOutstandingDocumentComponent,
    CustomerOutstandingDocumentComponent,
    InvoiceCommitmentNotBilledComponent,
    ListPaymentSlipComponent,
    ListCheckPaymentSlipComponent,
    ListDraftPaymentSlipComponent,
    AddCheckPaymentSlipComponent,
    AddDraftPaymentSlipComponent,
    PopUpSelectedFinancialCommitmentComponent,
    PopUpSettlementUpdateDisposeComponent,
    BankAccountDetailsComponent,
    CardViewBankAccountComponent,
    AddCashPaymentSlipComponent,
    PaymentSlipMenuComponent,
    CustomerPaymentSlipComponent,
    ListCashPaymentSlipComponent,
    AddPaymentSlipComponent,
    BankAccountFromTreasuryComponent,
    BankAccountFromSettingComponent,
    CashRegistersListComponent,
    CashRegistersAddComponent,
    FundsTransferListComponent,
    FundsTransferAddComponent,
    CashRegisterGeneralSectionComponent,
    CashRegisterWalletSectionComponent,
    WalletCustomerBankCheckComponent,
    WalletSupplierBankCheckComponent,
    WalletSupplierBankDraftComponent,
    WalletCustomerBankDraftComponent,
    WalletCashComponent,
    WalletGridComponent,
    CashRegisterInProgessSectionComponent,
    GridForInProgessSectionComponent,
    CashRegisterFundsTransferSectionComponent,
    CashRegisterBalanceSectionComponent,
    ConfirmSettlementComponent,
    CashRegisterTypeDropdownComponent,
    CashRegisterZoneComponent,
    TransfertFundTypeDropdownComponent,
    WithholdingTaxConfigurationComponent,
    CloseFundTransfertCashListComponent,
    CloseFundTransfertBankCheckListComponent,
    CloseFundTransfertBankDraftListComponent,
    CloseFundTransfertVoucherListComponent,
    CloseFundTransfertGridComponent,
    ProvisionFundTransfertComponent,
    SearchBankComponent,
    BankAgencyComponent,
    AddWithHoldingTaxConfigurationComponent,
    EditAgencyComponent,
    CashRegisterDropdownComponent,
    WithHoldingTaxTypeComponent,
    CashRegisterSessionComponent,
    OpenCashRegisterSessionComponent,
    CashRegisterTicketComponent,
    CloseCashRegisterSessionComponent,
    TicketListComponent,
    OperationListComponent,
    CashRegisterSettlementComponent
  ],
  providers: [
    StarkPermissionsGuard,
    CustomerOutstandingService,
    DeadLineDocumentService,
    PaymentModeService,
    PaymentSlipService,
    DocumentUtilityService,
    AmountFormatService,
    ReconciliationService,
    WithholdingTaxService,
    CashRegisterService,
    FundsTransferService,
    TicketService,
    SessionCashService,
    OperationCashService
  ],
  entryComponents: [
    AddSettlementComponent,
    PopUpSelectedFinancialCommitmentComponent,
    PopUpSettlementUpdateDisposeComponent,
    ConfirmSettlementComponent,
    CashRegistersAddComponent,
    FundsTransferAddComponent,
    EditAgencyComponent,
    OpenCashRegisterSessionComponent,
    CloseCashRegisterSessionComponent,
    CashRegisterTicketComponent
  ]
})
export class TreasuryModule { }
