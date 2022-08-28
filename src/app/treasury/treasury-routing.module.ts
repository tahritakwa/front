import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddBankAccountComponent } from '../shared/components/bank/bank-account/add-bank-account/add-bank-account.component';
import { StarkPermissionsGuard } from '../stark-permissions/stark-permissions.module';
import { RoleConfigConstant } from '../Structure/_roleConfigConstant';
import { BankAccountDetailsComponent } from './bank-management/bank-account-details/bank-account-details.component';
import { BankAccountFromSettingComponent } from './bank-management/bank-account-from-setting/bank-account-from-setting.component';
import { BankAccountFromTreasuryComponent } from './bank-management/bank-account-from-treasury/bank-account-from-treasury.component';
import { AddAdvencedBankComponent } from './bank-management/bank/add-advenced-bank/add-advenced-bank.component';
import { ListBankComponent } from './bank-management/bank/list-bank/list-bank.component';
import { CashRegistersListComponent } from './cash-management/cash-registers/cash-registers-list/cash-registers-list.component';
import { FundsTransferListComponent } from './cash-management/funds-tranfer/funds-transfer-list/funds-transfer-list.component';
import { PaymentSlipMenuComponent } from './components/payment-slip-menu/payment-slip-menu.component';
import { CustomerOutstandingDocumentComponent } from './customer/customer-outstanding/customer-outstanding-document/customer-outstanding-document.component';
import { DeliveryFormNotBilledComponent } from './customer/customer-outstanding/delivery-form-not-billed/delivery-form-not-billed.component';
import { CustomerReceivablesComponent } from './customer/customer-receivables/customer-receivables.component';
import { PaymentHistoryComponent } from './customer/payment-history/payment-history.component';
import { AddCashPaymentSlipComponent } from './payment-slip/cash/add-cash-payment-slip/add-cash-payment-slip.component';
import { ListCashPaymentSlipComponent } from './payment-slip/cash/list-cash-payment-slip/list-cash-payment-slip.component';
import { AddCheckPaymentSlipComponent } from './payment-slip/check/add-check-payment-slip/add-check-payment-slip.component';
import { ListCheckPaymentSlipComponent } from './payment-slip/check/list-check-payment-slip/list-check-payment-slip.component';
import { AddDraftPaymentSlipComponent } from './payment-slip/draft/add-draft-payment-slip/add-draft-payment-slip.component';
import { ListDraftPaymentSlipComponent } from './payment-slip/draft/list-draft-payment-slip/list-draft-payment-slip.component';
import { DisbursementHistoryComponent } from './supplier/disbursement-history/disbursement-history.component';
import { SupplierOutstandingDocumentComponent } from './supplier/supplier-outstanding/supplier-outstanding-document/supplier-outstanding-document.component';
import { SupplierReceivablesComponent } from './supplier/supplier-receivables/supplier-receivables.component';
import { AddWithHoldingTaxConfigurationComponent } from './withholding-tax-configuration/add-withholding-tax-configuration/add-withholding-tax-configuration.component';
import { WithholdingTaxConfigurationComponent } from './withholding-tax-configuration/withholding-tax-configuration.component';
import { CanDeactivateGuard} from '../shared/services/can-deactivate-guard.service';
import { PermissionConstant } from '../Structure/permission-constant';
import { FundsTransferAddComponent } from './cash-management/funds-tranfer/funds-transfer-add/funds-transfer-add.component';

const routes: Routes = [
  {
    path: '',
    canActivateChild: [StarkPermissionsGuard],
    children: [
      {
        path: 'customer',
        data: {
          permissions: {
            only: [PermissionConstant.TreasuryPermissions.LIST_CUSTOMER_RECEIVABLES_STATE,
              PermissionConstant.TreasuryPermissions.LIST_CUSTOMER_OUTSTANDING_DOCUMENT,
              PermissionConstant.TreasuryPermissions.LIST_CUSTOMER_PAYMENT_HISTORY,
              PermissionConstant.TreasuryPermissions.READONLY_CUSTOMER_PAYMENT_HISTORY]
          }
        },
        children: [
          {
            path: 'outstanding',
            children: [
              {
                path: 'outstandingDocument',
                component: CustomerOutstandingDocumentComponent,
                data: {
                  permissions: {
                    only: [PermissionConstant.TreasuryPermissions.LIST_CUSTOMER_OUTSTANDING_DOCUMENT]
                  }
                }
              },
              {
                path: 'salesDeliveryForm',
                component: DeliveryFormNotBilledComponent,
                data: {
                  permissions: {
                    only: [PermissionConstant.TreasuryPermissions.LIST_CUSTOMER_OUTSTANDING_DOCUMENT]
                  }
                }
              }
            ]
          },
          {
            path: 'receivables',
            component: CustomerReceivablesComponent,
            data: {
              permissions: {
                only: [PermissionConstant.TreasuryPermissions.LIST_CUSTOMER_RECEIVABLES_STATE]
              }
            }
          },
          {
            path: 'paymentHistory',
            component: PaymentHistoryComponent,
            data: {
              permissions: {
                only: [PermissionConstant.TreasuryPermissions.LIST_CUSTOMER_PAYMENT_HISTORY,
                  PermissionConstant.TreasuryPermissions.READONLY_CUSTOMER_PAYMENT_HISTORY]
              }
            }
          }
        ]
      },
      {
        path: 'supplier',
        data: {
          permissions: {
            only: [
              PermissionConstant.TreasuryPermissions.LIST_SUPPLIER_OUTSTANDING_DOCUMENT,
              PermissionConstant.TreasuryPermissions.READONLY_SUPPLIER_PAYMENT_HISTORY,
              PermissionConstant.TreasuryPermissions.LIST_SUPPLIER_PAYMENT_HISTORY,
              PermissionConstant.TreasuryPermissions.LIST_SUPPLIER_RECEIVABLES_STATE]
          }
        },
        children: [
          {
            path: 'outstanding',
            component: SupplierOutstandingDocumentComponent,
            data: {
              permissions: {
                only: [PermissionConstant.TreasuryPermissions.LIST_SUPPLIER_OUTSTANDING_DOCUMENT]
              }
            }
          },
          {
            path: 'salesDeliveryForm',
            component: DeliveryFormNotBilledComponent,
            data: {
              permissions: {
                only: [PermissionConstant.TreasuryPermissions.LIST_SUPPLIER_OUTSTANDING_DOCUMENT]
              }
            }
          },
          {
            path: 'receivables',
            component: SupplierReceivablesComponent,
            data: {
              permissions: {
                only: [PermissionConstant.TreasuryPermissions.LIST_SUPPLIER_RECEIVABLES_STATE]
              }
            }
          },
          {
            path: 'disbursmentHistory',
            component: DisbursementHistoryComponent,
            data: {
              permissions: {
                only: [PermissionConstant.TreasuryPermissions.LIST_SUPPLIER_PAYMENT_HISTORY,
                  PermissionConstant.TreasuryPermissions.READONLY_SUPPLIER_PAYMENT_HISTORY]
              }
            }
          }
        ]
      },
      {
        path: 'CashManagement',
        data: {
          permissions: {
            only: [PermissionConstant.TreasuryPermissions.LIST_CASH_MANAGEMENT,
              PermissionConstant.TreasuryPermissions.LIST_FUNDS_TRANSFER]
          }
        },
        children: [
          {
            path: '',
            component: CashRegistersListComponent,
            data: {
              permissions: {
                only: [PermissionConstant.TreasuryPermissions.LIST_CASH_MANAGEMENT,
                  PermissionConstant.TreasuryPermissions.LIST_FUNDS_TRANSFER]
              }
            }
          },
          {
            path: 'CashRegisters',
            component: CashRegistersListComponent,
            data: {
              permissions: {
                only: [PermissionConstant.TreasuryPermissions.LIST_CASH_MANAGEMENT]
              }
            }
          },
          {
            path: 'FundsTransfer',
            data: {
              permissions: {
                only: [PermissionConstant.TreasuryPermissions.LIST_FUNDS_TRANSFER]
              }
            },
            children: [
              {
                path: '',
                component: FundsTransferListComponent,
                data: {
                  permissions: {
                    only: [PermissionConstant.TreasuryPermissions.LIST_FUNDS_TRANSFER]
                  }
                }
              },
              {
                path: 'add',
                component: FundsTransferAddComponent,
                canDeactivate: [CanDeactivateGuard],
                data :{
                  permissions:{
                    only: [PermissionConstant.TreasuryPermissions.ADD_FUNDS_TRANSFER]
                  }
                }
              },
              {
                path: 'edit/:id',
                component: FundsTransferAddComponent,
                canDeactivate: [CanDeactivateGuard],
                data :{
                  permissions:{
                    only: [PermissionConstant.TreasuryPermissions.UPDATE_FUNDS_TRANSFER]
                  }
                }
              }
            ]
          }
        ]
      },
      {
        path: 'bankManagement',
        data: {
          permissions: {
            only: [PermissionConstant.TreasuryPermissions.LIST_TREASURY_BANK_ACCOUNT,
              PermissionConstant.TreasuryPermissions.LIST_TREASURY_BANK_SLIP,
              PermissionConstant.SettingsRHAndPaiePermissions.LIST_BANK,
              PermissionConstant.SettingsRHAndPaiePermissions.LIST_BANKACCOUNT]
          }
        },
        children: [
          {
            path: 'bank',
            children: [
              {
                path: '',
                component: ListBankComponent,
                data: {
                  permissions: {
                    only: [PermissionConstant.SettingsRHAndPaiePermissions.LIST_BANK]
                  }
                }
              },
              {
                path: 'add',
                component: AddAdvencedBankComponent,
                canDeactivate: [CanDeactivateGuard],
                data: {
                  permissions: {
                    only: [PermissionConstant.SettingsRHAndPaiePermissions.ADD_BANK]
                  }
                }
              },
              {
                path: 'AdvancedEdit/:id',
                component: AddAdvencedBankComponent,
                canDeactivate: [CanDeactivateGuard],
                data: {
                  permissions: {
                    only: [PermissionConstant.SettingsRHAndPaiePermissions.UPDATE_BANK,
                      PermissionConstant.SettingsRHAndPaiePermissions.SHOW_BANK]
                  }
                }
              }
            ]
          },
          {
            path: 'bankaccounts',
            children: [
              {
                path: 'fromSettings',
                children: [
                  {
                    path: '',
                    component: BankAccountFromSettingComponent,
                    data: {
                      permissions: {
                        only: [ PermissionConstant.SettingsRHAndPaiePermissions.LIST_BANKACCOUNT]
                      }
                    }
                  },
                  {
                    path: 'add',
                    component: AddBankAccountComponent,
                    canDeactivate: [CanDeactivateGuard],
                    data: {
                      permissions: {
                        only: [PermissionConstant.SettingsRHAndPaiePermissions.ADD_BANKACCOUNT]
                      }
                    }
                  },
                  {
                    path: 'edit/:id',
                    component: AddBankAccountComponent,
                    canDeactivate: [CanDeactivateGuard],
                    data: {
                      permissions: {
                        only: [PermissionConstant.SettingsRHAndPaiePermissions.UPDATE_BANKACCOUNT,
                          PermissionConstant.SettingsRHAndPaiePermissions.SHOW_BANKACCOUNT]
                      }
                    }
                  }
                ]
              },
              {
                path: 'fromTreasury',
                children: [
                  {
                    path: '',
                    component: BankAccountFromTreasuryComponent,
                    data: {
                      permissions: {
                        only: [PermissionConstant.TreasuryPermissions.LIST_TREASURY_BANK_ACCOUNT]
                      }
                    }
                  },
                  {
                    path: 'edit/:id',
                    component: BankAccountDetailsComponent,
                    data: {
                      permissions: {
                        only: [PermissionConstant.TreasuryPermissions.VALIDATION_TREASURY_BANK_ACCOUNT,
                          PermissionConstant.TreasuryPermissions.LIST_TREASURY_BANK_ACCOUNT]
                      }
                    }
                  }
                ]
              }
            ]
          },
          {
            path: 'paymentSlip',
            children: [
              {
                path: '',
                component: PaymentSlipMenuComponent,
                data: {
                  permissions: {
                    only: [PermissionConstant.TreasuryPermissions.LIST_TREASURY_BANK_SLIP]
                  }
                }
              },
              {
                path: 'check',
                children: [
                  {
                    path: '',
                    component: ListCheckPaymentSlipComponent,
                    data: {
                      permissions: {
                        only: [PermissionConstant.TreasuryPermissions.LIST_TREASURY_BANK_SLIP]
                      }
                    }
                  },
                  {
                    path: 'add',
                    component: AddCheckPaymentSlipComponent,
                    data: {
                      permissions: {
                        only: [PermissionConstant.TreasuryPermissions.ADD_TREASURY_BANK_SLIP]
                      }
                    }
                  },
                  {
                    path: 'edit/:id/:state',
                    component: AddCheckPaymentSlipComponent,
                    data: {
                      permissions: {
                        only: [PermissionConstant.TreasuryPermissions.UPDATE_TREASURY_BANK_SLIP,
                          PermissionConstant.TreasuryPermissions.LIST_TREASURY_BANK_SLIP]
                      }
                    }
                  }
                ]
              },
              {
                path: 'draft',
                children: [
                  {
                    path: '',
                    component: ListDraftPaymentSlipComponent,
                    data: {
                      permissions: {
                        only: [PermissionConstant.TreasuryPermissions.LIST_TREASURY_BANK_SLIP]
                      }
                    }
                  },
                  {
                    path: 'add',
                    component: AddDraftPaymentSlipComponent,
                    data: {
                      permissions: {
                        only: [PermissionConstant.TreasuryPermissions.ADD_TREASURY_BANK_SLIP]
                      }
                    }
                  },
                  {
                    path: 'edit/:id/:state',
                    component: AddDraftPaymentSlipComponent,
                    data: {
                      permissions: {
                        only: [PermissionConstant.TreasuryPermissions.UPDATE_TREASURY_BANK_SLIP,
                          PermissionConstant.TreasuryPermissions.LIST_TREASURY_BANK_SLIP]
                      }
                    }
                  }
                ]
              },
              {
                path: 'cash',
                children: [
                  {
                    path: '',
                    component: ListCashPaymentSlipComponent,
                  },
                  {
                    path: 'add',
                    component: AddCashPaymentSlipComponent,
                  },
                  {
                    path: 'edit/:id',
                    component: AddCashPaymentSlipComponent,
                  }
                ]
              }
            ]
          },
          {
            path: 'paymentSlip/:draft',
            component: PaymentSlipMenuComponent
          },
        ]
      },
      {
        path: 'withholdingTaxConfiguration',
        data: {
          permissions: {
            only: [PermissionConstant.SettingsTreasuryPermissions.LIST_WITHHOLDING_TAX_TREASURY,
               PermissionConstant.SettingsTreasuryPermissions.SHOW_WITHHOLDING_TAX_TREASURY]
          }
        },
        children: [
          {
            path: '',
            component: WithholdingTaxConfigurationComponent,
            data: {
              permissions: {
                only: [PermissionConstant.SettingsTreasuryPermissions.LIST_WITHHOLDING_TAX_TREASURY,
                   PermissionConstant.SettingsTreasuryPermissions.SHOW_WITHHOLDING_TAX_TREASURY]
              }
            }
          },
          {
            path: 'add',
            component: AddWithHoldingTaxConfigurationComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [PermissionConstant.SettingsTreasuryPermissions.ADD_WITHHOLDING_TAX_TREASURY]
              }
            }
          },
          {
            path: 'edit/:id',
            component: AddWithHoldingTaxConfigurationComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [PermissionConstant.SettingsTreasuryPermissions.UPDATE_WITHHOLDING_TAX_TREASURY,
                   PermissionConstant.SettingsTreasuryPermissions.LIST_WITHHOLDING_TAX_TREASURY,
                   PermissionConstant.SettingsTreasuryPermissions.SHOW_WITHHOLDING_TAX_TREASURY]
              }
            }
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
export class TreasuryRoutingModule { }
