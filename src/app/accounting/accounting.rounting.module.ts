import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShowChartOfAccountsComponent } from './chart-of-accounts/chart-of-accounts-show/chart-of-accounts-show.component';
import { ListAccountComponent } from './account/list-account/list-account.component';
import { DocumentAccountListComponent } from './document-account/document-account-list/document-account-list/document-account-list.component';
import { DocumentAccountAddComponent } from './document-account/document-account-add/document-account-add.component';
import { TemplateAccountingListComponent } from './template-accounting/template-accounting-list/template-accounting-list.component';
import { TemplateAccountingAddComponent } from './template-accounting/template-accounting-add/template-accounting-add.component';
import { ListFiscalYearsComponent } from './fiscal-year/list-fiscal-years/list-fiscal-years.component';
import { AddFiscalYearComponent } from './fiscal-year/add-fiscal-year/add-fiscal-year.component';
import { AddAccountComponent } from './account/add-account/add-account.component';
import { GeneralLedgerComponent } from './reporting/general-ledger/general-ledger.component';
import { TrialBalanceComponent } from './reporting/trial-balance/trial-balance.component';
import { AddAccountingConfigurationComponent } from './accounting-configuration/add-accounting-configuration/add-accounting-configuration.component';
import { ImportDocumentComponent } from './import-document/import-document.component';
import { BalanceSheetComponent } from './reporting/balance-sheet/balance-sheet.component';
import { IntermediaryBalanceComponent } from './reporting/intermediary-balance/intermediary-balance.component';
import { StateOfJournalsComponent } from './reporting/state-of-journals/state-of-journals.component';
import { GenerateStateOfIncomeComponent } from './reporting/generate-state-of-income/generate-state-of-income.component';
import { ListJournalComponent } from './journal/list-journal/list-journal.component';
import { AddJournalComponent } from './journal/add-journal/add-journal.component';
import { LetteringComponent } from './lettering/lettering.component';
import { ReconciliationBankComponent } from './reporting/reconciliationBank/reconciliation-bank.component';
import { ListDepreciationAssetsComponent } from './depreciation-assets/list-depreciation-assets/list-depreciation-assets.component';
import { AddDepreciationAssetsComponent } from './depreciation-assets/add-depreciation-assets/add-depreciation-assets.component';
import { ListAmortizationConfigurationComponent } from './amortization-configuration/list-amortization-configuration/list-amortization-configuration.component';
import { CanDeactivateGuard } from './services/can-deactivate-guard.service';
import { AddAssetsComponent } from './depreciation-assets/add-assets/add-assets.component';
import { StandardAccountingReportsComponent } from './accounting-configuration/standard-accounting-reports/standard-accounting-reports.component';
import { ChartsAccountsResolverService } from './resolver/charts-accounts-resolver.service';
import { JournalsResolverService } from './resolver/journals-resolver.service';
import { ReconciliationBankStatementComponent } from './reporting/reconciliationBankStatement/reconciliation-bank-statement.component';

import { CentralisationOfJournalsComponent } from './reporting/centralisation-of-journals/centralisation-of-journals.component';
import { StateOfAuxiliaryJournalsComponent } from './reporting/state-of-auxiliary-journals/state-of-auxiliary-journals.component';
import {AccountingUserConfigurationComponent} from './accounting-configuration/accounting-user-configuration/accounting-user-configuration.component';
import { CurrencyResolverService } from './resolver/currency-resolver.service';

import {DocumentAccountDetailResolverService} from './services/document-account/document-account-detail-resolver.service';
import { CashFlowComponent } from './reporting/cash-flow/cash-flow.component';
import {FiscalYearsResolverService} from './resolver/fiscal-years-resolver.service';
import { AccountResolverService } from './resolver/account-resolver.service';
import { CurrentFiscalYearResolverService } from './resolver/current-fiscal-year-resolver.service';
import { AmortizationAccountsResolverService } from './resolver/amortization-accounts-resolver.service';
import {ResultAccountsResolverService} from './resolver/result-accounts-resolver.service';
import { BankAccountsResolverService } from './resolver/bank-accounts-resolver.service';
import { CofferAccountsResolverService } from './resolver/coffer-accounts-resolver.service';
import {DocumentAccountHistoryComponent} from './document-account/document-account-history/document-account-history.component';
import {HistoricReportingComponent} from './reporting/historic-reporting/historic-reporting.component';
import {HistoricLetteringComponent} from './lettering/historic-lettering/historic-lettering.component';
import {ReconciliationHistoricComponent} from './reporting/reconciliation-historic/reconciliation-historic.component';
import {FiscalYearHistoricComponent} from './fiscal-year/fiscal-year-historic/fiscal-year-historic.component';
import {StarkPermissionsGuard} from '../stark-permissions/router/permissions-guard.service';
import { PermissionConstant } from '../Structure/permission-constant';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'configuration',
        children: [
          {
            path: 'financialAccount',
            component: AddAccountingConfigurationComponent,
            resolve: { accounts: AccountResolverService, chartsAccounts: ChartsAccountsResolverService, journals: JournalsResolverService },
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [PermissionConstant.SettingsAccountingPermissions.VIEW_FINANCIAL_ACCOUNTS_SETTINGS,
                       PermissionConstant.SettingsAccountingPermissions.UPDATE_FINANCIAL_ACCOUNTS_SETTINGS]
              }
            },
          },
          {
            path: 'tiersAccount',
            component: AddAccountingConfigurationComponent,
            resolve: { accounts: AccountResolverService, chartsAccounts: ChartsAccountsResolverService, journals: JournalsResolverService },
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [PermissionConstant.SettingsAccountingPermissions.VIEW_TIERS_ACCOUNTS_SETTINGS,
                  PermissionConstant.SettingsAccountingPermissions.UPDATE_TIERS_ACCOUNTS_SETTINGS]
              }
            },
          },
          {
            path: 'paymentsAccount',
            component: AddAccountingConfigurationComponent,
            resolve: { accounts: AccountResolverService, chartsAccounts: ChartsAccountsResolverService, journals: JournalsResolverService },
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [PermissionConstant.SettingsAccountingPermissions.VIEW_PAYMENTS_ACCOUNTS_SETTINGS,
                  PermissionConstant.SettingsAccountingPermissions.UPDATE_PAYMENTS_ACCOUNTS_SETTINGS]
              }
            },
          },
          {
            path: 'amortizationAccount',
            component: AddAccountingConfigurationComponent,
            resolve: { accounts: AccountResolverService, chartsAccounts: ChartsAccountsResolverService, journals: JournalsResolverService },
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [PermissionConstant.SettingsAccountingPermissions.VIEW_AMORTIZATION_ACCOUNT_SETTINGS,
                  PermissionConstant.SettingsAccountingPermissions.UPDATE_AMORTIZATION_ACCOUNT_SETTINGS]
              }
            },
          },
          {
            path: 'journals',
            component: AddAccountingConfigurationComponent,
            resolve: { accounts: AccountResolverService, chartsAccounts: ChartsAccountsResolverService, journals: JournalsResolverService },
            data: {
              permissions: {
                only: [PermissionConstant.SettingsAccountingPermissions.VIEW_ACCOUNTING_JOURNAL_SETTINGS,
                  PermissionConstant.SettingsAccountingPermissions.UPDATE_ACCOUNTING_JOURNAL_SETTINGS]
              }
            },
          },
          {
            path: 'reports',
            component: StandardAccountingReportsComponent,
            canActivate: [StarkPermissionsGuard],
            data: {
              permissions: {
                only: [PermissionConstant.SettingsAccountingPermissions.UPDATE_ACCOUNTING_STANDARD_REPORTS_FORMULA,
                  PermissionConstant.SettingsAccountingPermissions.VIEW_ACCOUNTING_STANDARD_REPORTS]
              }
            },
            canDeactivate: [CanDeactivateGuard],
          },
          {
            path: 'userConfiguration',
            component: AccountingUserConfigurationComponent,
            resolve: { journals: JournalsResolverService },
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [PermissionConstant.SettingsAccountingPermissions.VIEW_USER_ACCOUNTING_SETTINGS,
                  PermissionConstant.SettingsAccountingPermissions.UPDATE_USER_ACCOUNTING_SETTINGS]
              }
            },
          }
        ]
      },
      {
        path: 'import',
        component: ImportDocumentComponent,
        canDeactivate: [CanDeactivateGuard],
        canActivate: [StarkPermissionsGuard],
        data: {
          permissions: {
            only: [PermissionConstant.AccountingPermissions.GENERATE_DOCUMENT_ACCOUNT_FROM_DOCUMENT]
          }
        },
        resolve: { currentFiscalYear: CurrentFiscalYearResolverService, bankAccounts: BankAccountsResolverService, cofferAccount: CofferAccountsResolverService}
      },
      {
        path: 'chartOfAccounts',
        component: ShowChartOfAccountsComponent,
        canActivate: [StarkPermissionsGuard],
        data: {
          permissions: {
            only: [PermissionConstant.SettingsAccountingPermissions.CHART_OF_ACCOUNTS]
          }
        },
      },
      {
        path: 'journal',
        canActivate: [StarkPermissionsGuard],
        data: {
          permissions: {
            only: [PermissionConstant.SettingsAccountingPermissions.JOURNALS]
          }
        },
        children: [
          {
            path: '',
            component: ListJournalComponent,
            // canDeactivate: [CanDeactivateGuard]
          },
          {
            path: 'add',
            component: AddJournalComponent,
            canActivate: [StarkPermissionsGuard],
            data: {
              permissions: {
                only: [PermissionConstant.SettingsAccountingPermissions.ADD_JOURNALS]
              }
            },
          },
          {
            path: 'edit/:id',
            component: AddJournalComponent
          }
        ]
      },
      {
        path: 'account',
        canActivate: [StarkPermissionsGuard],
        data: {
          permissions: {
            only: [PermissionConstant.SettingsAccountingPermissions.ACCOUNTING_ACCOUNTS]
          }
        },
        children: [
          {
            path: '',
            component: ListAccountComponent
          },
          {
            path: 'add',
            component: AddAccountComponent,
            resolve: { chartsAccounts: ChartsAccountsResolverService },
            data: {
              permissions: {
                only: [PermissionConstant.SettingsAccountingPermissions.ADD_ACCOUNTING_ACCOUNTS]
              }
            },
            canDeactivate: [CanDeactivateGuard]
          },
          {
            path: 'edit/:id',
            component: AddAccountComponent,
            resolve: { chartsAccounts: ChartsAccountsResolverService },
            canDeactivate: [CanDeactivateGuard]
          }
        ]
      },
      {
        path: 'documentAccount',
        resolve: { currentFiscalYear: CurrentFiscalYearResolverService},
        canActivate: [StarkPermissionsGuard],
        data: {
          permissions: {
            only: [PermissionConstant.AccountingPermissions.DOCUMENTS_ACCOUNTS]
          }
        },
        children: [
          {
            path: '',
            component: DocumentAccountListComponent
          },
          {
            path: 'add',
            component: DocumentAccountAddComponent,
            resolve: { currency: CurrencyResolverService },
            canDeactivate: [CanDeactivateGuard],
            canActivate: [StarkPermissionsGuard],
            data: {
              permissions: {
                only: [PermissionConstant.AccountingPermissions.ADD_DOCUMENTS_ACCOUNTS]
              }
            }
          },
          {
            path: 'edit/:id',
            component: DocumentAccountAddComponent,
            resolve: { currency: CurrencyResolverService, documentAccountToBeUpdated: DocumentAccountDetailResolverService },
            canDeactivate: [CanDeactivateGuard]
          },
          {
            path: 'consult/:id',
            component: DocumentAccountAddComponent,
            resolve: { currency: CurrencyResolverService, documentAccountToBeUpdated: DocumentAccountDetailResolverService },
            canDeactivate: [CanDeactivateGuard]
          },
          {
            path: 'history/:id',
            component: DocumentAccountHistoryComponent,
            resolve: { currency: CurrencyResolverService, documentAccountToBeUpdated: DocumentAccountDetailResolverService },
            canDeactivate: [CanDeactivateGuard]
          }
        ]
      },
      {
        path: 'lettering',
        children: [
          {
            path: '',
            resolve: { currentFiscalYear: CurrentFiscalYearResolverService},
            component: LetteringComponent,
            canDeactivate: [CanDeactivateGuard],
            canActivate: [StarkPermissionsGuard],
            data: {
              permissions: {
                only: [PermissionConstant.AccountingPermissions.VIEW_ACCOUNTING_LETTERING]
              }
            }
          },
          {
            path: 'historic/:id',
            component: HistoricLetteringComponent,
            resolve: { currency: CurrencyResolverService},
            canActivate: [StarkPermissionsGuard],
            data: {
              permissions: {
                only: [PermissionConstant.AccountingPermissions.VIEW_ACCOUNTING_LETTERING]
              }
            }
          }
        ]
      },
      {
        path: 'reporting',
        resolve: { currentFiscalYear: CurrentFiscalYearResolverService},
        children: [
          {
            path: 'editions',
            children: [
              {
                path: '',
                redirectTo: 'trialBalance'
              },
              {
                path: 'trialBalance',
                component: TrialBalanceComponent,
                canActivate: [StarkPermissionsGuard],
                data: {
                  permissions: {
                    only: [PermissionConstant.AccountingPermissions.EDITIONS_REPORTS]
                  }
                }
              },
              {
                path: 'generalLedger',
                component: GeneralLedgerComponent,
                canActivate: [StarkPermissionsGuard],
                data: {
                  permissions: {
                    only: [PermissionConstant.AccountingPermissions.EDITIONS_REPORTS]
                  }
                }
              },
            ]
          },
          {
            path: 'financialStates',
            resolve: { fiscalYears: FiscalYearsResolverService },
            children: [
              {
                path: '',
                redirectTo: 'stateOfIncome'
              },
              {
                path: 'stateOfIncome',
                component: GenerateStateOfIncomeComponent,
                canDeactivate: [CanDeactivateGuard],
                canActivate: [StarkPermissionsGuard],
                data: {
                  permissions: {
                    only: [PermissionConstant.AccountingPermissions.FINANCIAL_STATES_REPORTS]
                  }
                }
              },
              {
                path: 'balancesheet',
                component: BalanceSheetComponent,
                canDeactivate: [CanDeactivateGuard],
                canActivate: [StarkPermissionsGuard],
                data: {
                  permissions: {
                    only: [PermissionConstant.AccountingPermissions.FINANCIAL_STATES_REPORTS]
                  }
                }
              },
              {
                path: 'intermediaryBalance',
                component: IntermediaryBalanceComponent,
                canDeactivate: [CanDeactivateGuard],
                canActivate: [StarkPermissionsGuard],
                data: {
                  permissions: {
                    only: [PermissionConstant.AccountingPermissions.FINANCIAL_STATES_REPORTS]
                  }
                }
              },
              {
                path: 'cashFlow',
                component: CashFlowComponent,
                canDeactivate: [CanDeactivateGuard],
                canActivate: [StarkPermissionsGuard],
                data: {
                  permissions: {
                    only: [PermissionConstant.AccountingPermissions.FINANCIAL_STATES_REPORTS]
                  }
                }
              },
              {
                path: 'historic/:reportType',
                component: HistoricReportingComponent,
                canDeactivate: [CanDeactivateGuard],
                canActivate: [StarkPermissionsGuard],
                data: {
                  permissions: {
                    only: [PermissionConstant.AccountingPermissions.FINANCIAL_STATES_REPORTS]
                  }
                }
              },
            ]
          },
          {
            path: 'journals',
            children: [
              {
                path: '',
                redirectTo: 'StateOfAuxiliaryJournals'
              },
              {
                path: 'StateOfAuxiliaryJournals',
                component: StateOfAuxiliaryJournalsComponent,
                resolve: { journals: JournalsResolverService },
                canActivate: [StarkPermissionsGuard],
                data: {
                  permissions: {
                    only: [PermissionConstant.AccountingPermissions.JOURNALS_REPORTS]
                  }
                }
              },
              {
                path: 'centralisationOfJournals',
                component: CentralisationOfJournalsComponent,
                canActivate: [StarkPermissionsGuard],
                data: {
                  permissions: {
                    only: [PermissionConstant.AccountingPermissions.JOURNALS_REPORTS]
                  }
                }
              },
              {
                path: 'stateOfJournals',
                component: StateOfJournalsComponent,
                canActivate: [StarkPermissionsGuard],
                data: {
                  permissions: {
                    only: [PermissionConstant.AccountingPermissions.JOURNALS_REPORTS]
                  }
                }
              }
            ]
          },
        ]
      },
      {
        path: 'template',
        children: [
          {
            path: '',
            component: TemplateAccountingListComponent
          },
          {
            path: 'add',
            component: TemplateAccountingAddComponent,
            canDeactivate: [CanDeactivateGuard]
          },
          {
            path: 'edit/:id',
            component: TemplateAccountingAddComponent,
            canDeactivate: [CanDeactivateGuard]
          }
        ]
      },
      {
        path: 'fiscalyear',
        canActivate: [StarkPermissionsGuard],
        data: {
          permissions: {
            only: [PermissionConstant.SettingsAccountingPermissions.FISCAL_YEARS]
          }
        },
        children: [
          {
            path: '',
            resolve: { resultAccounts: ResultAccountsResolverService},
            component: ListFiscalYearsComponent
          },
          {
            path: 'add',
            component: AddFiscalYearComponent,
            canActivate: [StarkPermissionsGuard],
            data: {
              permissions: {
                only: [PermissionConstant.SettingsAccountingPermissions.ADD_FISCAL_YEARS]
              }
            },
            canDeactivate: [CanDeactivateGuard]
          },
          {
            path: 'edit/:id',
            component: AddFiscalYearComponent,
            canDeactivate: [CanDeactivateGuard]
          },
          {
            path: 'historic',
            component: FiscalYearHistoricComponent
          }
        ]
      },
      {
        path: 'reconciliationBankMenu',
        resolve: { currentFiscalYear: CurrentFiscalYearResolverService},
        canActivate: [StarkPermissionsGuard],
        data: {
          permissions: {
            only: [PermissionConstant.AccountingPermissions.RECONCILIATION_BANK]
          }
        },
        children: [
          {
            path: '',
            redirectTo: 'reconciliationBank',
          },
          {
            path: 'reconciliationBank',
            component: ReconciliationBankComponent
          },
          {
            path: 'reconciliationBankStatement',
            component: ReconciliationBankStatementComponent
          },
          {
            path: 'historic/:id',
            component: ReconciliationHistoricComponent,
            resolve: { currency: CurrencyResolverService}
          }

        ]
      },
      {
        path: 'depreciationAssets',
        canActivate: [StarkPermissionsGuard],
        data: {
          permissions: {
            only: [PermissionConstant.AccountingPermissions.AMORTIZATION_OF_IMMOBILIZATIONS]
          }
        },
        children: [
          {
            path: '',
            resolve: { currentFiscalYear: CurrentFiscalYearResolverService, amortizationAccounts : AmortizationAccountsResolverService},
            component: ListDepreciationAssetsComponent
          },
          {
            path: 'edit/:id',
            resolve:{ currentFiscalYear: CurrentFiscalYearResolverService, accounts: AmortizationAccountsResolverService},
            component: AddDepreciationAssetsComponent
          },
          {
            path: 'AdvancedAdd',
            component: AddAssetsComponent
          }
        ]
      },
      {
        path: 'amortizationConfiguration',
        canActivate: [StarkPermissionsGuard],
        data: {
          permissions: {
            only: [PermissionConstant.SettingsAccountingPermissions.AMORTIZATION_OF_IMMOBILIZATIONS_SETTINGS]
          }
        },
        children: [
          {
            path: '',
            component: ListAmortizationConfigurationComponent,
            resolve: {accounts: AmortizationAccountsResolverService},
            canDeactivate: [CanDeactivateGuard]
          },
          {
            path: 'edit/:idCategory',
            resolve: {accounts: AmortizationAccountsResolverService},
            component: ListAmortizationConfigurationComponent,
            canDeactivate: [CanDeactivateGuard]
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountingRoutingModule {
}
