import {NgModule} from '@angular/core';
import {GenericAccountingService} from './services/generic-accounting.service';
import {LetteringService} from './services/lettering/lettering-service';
import {SharedModule} from '../shared/shared.module';
import {AccountingRoutingModule} from './accounting.rounting.module';
import {TooltipModule} from 'ng2-tooltip-directive';
import {ShowChartOfAccountsComponent} from './chart-of-accounts/chart-of-accounts-show/chart-of-accounts-show.component';
import {AdministrationModule} from '../administration/administration.module';
import {ChartOfAccountAddComponent} from './chart-of-accounts/chart-of-account-add/chart-of-accounts-add.component';
import {ListAccountComponent} from './account/list-account/list-account.component';
import {AccountService} from './services/account/account.service';
import {ChartAccountService} from './services/chart-of-accounts/chart-of-account.service';
import {DocumentAccountService} from './services/document-account/document-account.service';
import {DocumentAccountListComponent} from './document-account/document-account-list/document-account-list/document-account-list.component';
import {DocumentAccountAddComponent} from './document-account/document-account-add/document-account-add.component';
import {TemplateAccountingListComponent} from './template-accounting/template-accounting-list/template-accounting-list.component';
import {TemplateAccountingAddComponent} from './template-accounting/template-accounting-add/template-accounting-add.component';
import {TemplateAccountingService} from './services/template/template.service';
import {JournalService} from './services/journal/journal.service';
import {ErrorHandlerService} from '../../COM/services/error-handler-service';
import {AddFiscalYearComponent} from './fiscal-year/add-fiscal-year/add-fiscal-year.component';
import {FiscalYearDetailsService} from './services/fiscal-year/fiscal-year.service';
import {ListFiscalYearsComponent} from './fiscal-year/list-fiscal-years/list-fiscal-years.component';
import {TranslateModule} from '@ngx-translate/core';
import {DocumentAccountResolverService} from './resolver/document-account-resolver.service';
import {GeneralLedgerComponent} from './reporting/general-ledger/general-ledger.component';
import {TrialBalanceComponent} from './reporting/trial-balance/trial-balance.component';
import {TreeTableModule} from 'ng-treetable';
import {AccountDetailComponent} from './reporting/general-ledger/account-detail/account-detail.component';
import {TableModule} from 'primeng/table';
import {ReportingService} from './services/reporting/reporting.service';
import {DatePipe} from '@angular/common';
import {AddAccountingConfigurationComponent} from './accounting-configuration/add-accounting-configuration/add-accounting-configuration.component';
import {ImportDocumentComponent} from './import-document/import-document.component';
import {BodyModule, PagerModule, RowFilterModule} from '@progress/kendo-angular-grid';
import {ImportDocumentService} from './services/import-document/import-document.service';
import {GenerateStateOfIncomeComponent} from './reporting/generate-state-of-income/generate-state-of-income.component';
import {BalanceSheetComponent} from './reporting/balance-sheet/balance-sheet.component';
import {IntermediaryBalanceComponent} from './reporting/intermediary-balance/intermediary-balance.component';
import {StateOfJournalsComponent} from './reporting/state-of-journals/state-of-journals.component';
import {StateOfJournalsJournalDetailsComponent} from './reporting/state-of-journals/journal-details/journal-details.component';
import {ListJournalComponent} from './journal/list-journal/list-journal.component';
import {AddJournalComponent} from './journal/add-journal/add-journal.component';
import {BehaviorSubjectService} from './services/reporting/behavior-subject.service';
import {PageFilterService} from './services/page-filter-accounting.service';
import {CloseFiscalYearComponent} from './fiscal-year/close-fiscal-year/close-fiscal-year.component';
import {LetteringComponent} from './lettering/lettering.component';
import {FilterByAccountComponent} from './reporting/filter-by-account/filter-by-account.component';
import {ReconciliationBankComponent} from './reporting/reconciliationBank/reconciliation-bank.component';
import {PickListModule} from 'primeng/picklist';
import {ListDepreciationAssetsComponent} from './depreciation-assets/list-depreciation-assets/list-depreciation-assets.component';
import {AddDepreciationAssetsComponent} from './depreciation-assets/add-depreciation-assets/add-depreciation-assets.component';
import {ImmobilizationModule} from '../immobilization/immobilization.module';
import {AccountingDocumentGridBtnComponent} from './components/accounting-document-grid-btn/accounting-document-grid-btn.component';
import {ListAmortizationConfigurationComponent} from './amortization-configuration/list-amortization-configuration/list-amortization-configuration.component';
import {ClosingAndReopningFiscalYearComponent} from './fiscal-year/closing-and-reopning-fiscal-year/closing-and-reopning-fiscal-year.component';
import {CanDeactivateGuard} from './services/can-deactivate-guard.service';
import {Depreciation} from '../models/accounting/depreciation';
import {AddAssetsComponent} from './depreciation-assets/add-assets/add-assets.component';
import {StandardAccountingReportsComponent} from './accounting-configuration/standard-accounting-reports/standard-accounting-reports.component';
import {ReconcilableCheckBoxComponent} from './components/reconcilable-check-box/reconcilable-check-box.component';
import {LetterableCheckBoxComponent} from './components/letterable-check-box/letterable-check-box.component';
import {DocumentAccountFileStorageService} from './services/document-account/document-account-file-storage.service';
import {ChartAccountsImportBtnComponent} from './components/chart-accounts-import-grid-btn/chart-accounts-import-btn.component';
import {ChartsAccountsResolverService} from './resolver/charts-accounts-resolver.service';
import {JournalsResolverService} from './resolver/journals-resolver.service';
import {CentralisationOfJournalsComponent} from './reporting/centralisation-of-journals/centralisation-of-journals.component';
import {DetailJournalCentralisationComponent} from './reporting/centralisation-of-journals/detail-journal-centralisation/detail-journal-centralisation.component';
import {StateOfAuxiliaryJournalsComponent} from './reporting/state-of-auxiliary-journals/state-of-auxiliary-journals.component';
import {AuxiliaryJournalDetailsComponent} from './reporting/state-of-auxiliary-journals/auxiliary-journal-details/auxiliary-journal-details.component';
import {CurrencyResolverService} from './resolver/currency-resolver.service';
import {DocumentAccountDetailResolverService} from './services/document-account/document-account-detail-resolver.service';
import {CashFlowComponent} from './reporting/cash-flow/cash-flow.component';
import {AmortizationAccountsResolverService} from './resolver/amortization-accounts-resolver.service';
import {FiscalYearsResolverService} from './resolver/fiscal-years-resolver.service';
import {AccountResolverService} from './resolver/account-resolver.service';
import {ReconciliationBankStatementComponent} from './reporting/reconciliationBankStatement/reconciliation-bank-statement.component';
import {GenerateDocumentAccountFromAmortization} from './depreciation-assets/generate-document-account-from-amortization/generate-document-account-from-amortization.component';
import {CurrentFiscalYearResolverService} from './resolver/current-fiscal-year-resolver.service';
import {SelectFinancialAccountComponent} from './import-document/select-financial-account/select-financial-account.component';
import {AccountImportGridBtnComponent} from './components/account-import-grid-btn/account-import-grid-btn.component';
import {AccountingTemplateImportGridBtn} from './components/accounting-template-import-grid-btn/accounting-template-import-grid-btn.component';
import {JournalImportGridBtnComponent} from './components/journal-import-grid-btn/journal-import-grid-btn.component';
import {CofferAccountsResolverService} from './resolver/coffer-accounts-resolver.service';
import {StarkPermissionsModule} from '../stark-permissions/stark-permissions.module';
import {CashFlowCheckBoxComponent} from './components/cash-flow-check-box/cash-flow-check-box.component';
import {DetailJournalCentralisationByMonthComponent} from './reporting/centralisation-of-journals/detail-journal-centralisation-by-month/detail-journal-centralisation-by-month.component';
import {DocumentAccountHistoryComponent} from './document-account/document-account-history/document-account-history.component';
import {HistoryService} from './services/history/history.service';
import {HistoricDetailsDocumentAccountComponent} from './document-account/historic-details-document-account/historic-details-document-account.component';
import {HistoricReportingComponent} from './reporting/historic-reporting/historic-reporting.component';
import {HistoricReportingDetailsComponent} from './reporting/historic-reporting/historic-reporting-details/historic-reporting-details.component';
import {HistoricLetteringComponent} from './lettering/historic-lettering/historic-lettering.component';
import {ReconciliationHistoricComponent} from './reporting/reconciliation-historic/reconciliation-historic.component';
import {NgMultiSelectDropDownModule} from 'ng-multiselect-dropdown';
import { CurrentFiscalYearDropdownComponent } from './components/current-fiscal-year-dropdown/current-fiscal-year-dropdown.component';
import { FiscalYearHistoricComponent } from './fiscal-year/fiscal-year-historic/fiscal-year-historic.component';
import { ResultAccountsResolverService } from './resolver/result-accounts-resolver.service';
import { IntlModule } from "@progress/kendo-angular-intl";
import { ReconciliationBankBehaviorSubjectService } from './services/reconciliation-bank-service/reconciliation-bank-behavior-subject.service';


@NgModule({
  imports: [
    SharedModule.forRoot(),
    TooltipModule,
    AdministrationModule,
    TranslateModule,
    AccountingRoutingModule,
    TreeTableModule,
    TableModule,
    RowFilterModule,
    BodyModule,
    PickListModule,
    ImmobilizationModule,
    PagerModule,
    StarkPermissionsModule,
    NgMultiSelectDropDownModule.forRoot(),
    IntlModule
  ],
  declarations: [
    AddJournalComponent,
    ShowChartOfAccountsComponent,
    ChartOfAccountAddComponent,
    ListJournalComponent,
    ListAccountComponent,
    DocumentAccountAddComponent,
    DocumentAccountListComponent,
    TemplateAccountingListComponent,
    TemplateAccountingAddComponent,
    AddFiscalYearComponent,
    ListFiscalYearsComponent,
    GeneralLedgerComponent,
    TrialBalanceComponent,
    AccountDetailComponent,
    ListFiscalYearsComponent,
    AddAccountingConfigurationComponent,
    ImportDocumentComponent,
    GenerateStateOfIncomeComponent,
    BalanceSheetComponent,
    IntermediaryBalanceComponent,
    LetteringComponent,
    StateOfJournalsComponent,
    StateOfJournalsJournalDetailsComponent,
    CloseFiscalYearComponent,
    FilterByAccountComponent,
    ReconciliationBankComponent,
    ListDepreciationAssetsComponent,
    AddDepreciationAssetsComponent,
    AccountImportGridBtnComponent,
    AccountingDocumentGridBtnComponent,
    ChartAccountsImportBtnComponent,
    JournalImportGridBtnComponent,
    ListAmortizationConfigurationComponent,
    ClosingAndReopningFiscalYearComponent,
    AccountingTemplateImportGridBtn,
    AddAssetsComponent,
    StandardAccountingReportsComponent,
    ReconcilableCheckBoxComponent,
    CashFlowCheckBoxComponent,
    LetterableCheckBoxComponent,
    ReconciliationBankStatementComponent,
    CentralisationOfJournalsComponent,
    DetailJournalCentralisationComponent,
    StateOfAuxiliaryJournalsComponent,
    AuxiliaryJournalDetailsComponent,
    CashFlowComponent,
    GenerateDocumentAccountFromAmortization,
    SelectFinancialAccountComponent,
    DetailJournalCentralisationByMonthComponent,
    DocumentAccountHistoryComponent,
    HistoricDetailsDocumentAccountComponent,
    HistoricReportingComponent,
    HistoricReportingDetailsComponent,
    HistoricLetteringComponent,
    ReconciliationHistoricComponent,
    DetailJournalCentralisationByMonthComponent,
      CurrentFiscalYearDropdownComponent, FiscalYearHistoricComponent
  ],
  providers: [
    DocumentAccountService,
    JournalService,
    AccountService,
    ChartAccountService,
    ErrorHandlerService,
    TemplateAccountingService,
    ReportingService,
    DatePipe,
    DocumentAccountResolverService,
    DocumentAccountDetailResolverService,
    FiscalYearsResolverService,
    ChartsAccountsResolverService,
    ImportDocumentService,
    GenericAccountingService,
    LetteringService,
    BehaviorSubjectService,
    PageFilterService,
    FiscalYearDetailsService,
    DocumentAccountFileStorageService,
    Depreciation,
    CanDeactivateGuard,
    JournalsResolverService,
    CurrencyResolverService,
    AmortizationAccountsResolverService,
    ResultAccountsResolverService,
    AccountResolverService,
    CurrentFiscalYearResolverService,
    CofferAccountsResolverService,
    HistoryService,
    ReconciliationBankBehaviorSubjectService],
  entryComponents: [
    ChartOfAccountAddComponent,
    CloseFiscalYearComponent,
    ClosingAndReopningFiscalYearComponent,
    GenerateDocumentAccountFromAmortization,
    SelectFinancialAccountComponent
  ],
  bootstrap: [LetteringComponent],
  exports: [
    SelectFinancialAccountComponent,
    CurrentFiscalYearDropdownComponent
  ]
})

export class AccountingModule {

  constructor() {
  }
}

