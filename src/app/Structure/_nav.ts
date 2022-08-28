import { RoleConfigConstant } from './_roleConfigConstant';
import { Injectable } from '@angular/core';
import {PermissionConstant} from './permission-constant';

@Injectable()
export class NavGlobals {
  public navItems = [
    {
      name: 'DASHBOARD',
      url: '/main/dashboard',
      icon: 'icon-speedometer',
      role: [
        {
          name: PermissionConstant.DashboardPermissions.SALES_DASHBOARD
        },
        {
          name: PermissionConstant.DashboardPermissions.PURCHASE_DASHBOARD
        },
        {
          name: PermissionConstant.DashboardPermissions.TREASURY_SALES_DASHBOARD
        },
        {
          name: PermissionConstant.DashboardPermissions.TREASURY_PURCHASE_DASHBOARD
        },
        {
          name: PermissionConstant.DashboardPermissions.GARAGE_DASHBOARD
        },
        {
          name: PermissionConstant.DashboardPermissions.RH_DASHBOARD
        }
      ],
      children: [
        {
          name: 'COMMERCIAL',
          url: 'dashboard/commercial',
          role: [
            {
              name: PermissionConstant.DashboardPermissions.SALES_DASHBOARD
            },
            {
              name: PermissionConstant.DashboardPermissions.PURCHASE_DASHBOARD
            },
            {
              name: PermissionConstant.DashboardPermissions.TREASURY_SALES_DASHBOARD
            },
            {
              name: PermissionConstant.DashboardPermissions.TREASURY_PURCHASE_DASHBOARD
            },
          ]
        },
        {
          name: 'GARAGE',
          url: 'dashboard/garage',
          role: [
            {
              name: PermissionConstant.DashboardPermissions.GARAGE_DASHBOARD
            }
          ]
        },
        {
          name: 'HR',
          url: 'dashboard/hr',
          role: [
            {
              name: PermissionConstant.DashboardPermissions.RH_DASHBOARD
            }
          ]
        },
      ]

    },
    {
      name: 'STOCK',
      url: 'inventory',
      icon: 'icon-layers',
      role: [
        {
          name: PermissionConstant.CommercialPermissions.LIST_INVENTORY_MOVEMENT,
        },
        {
          name: PermissionConstant.CommercialPermissions.LIST_ITEM_STOCK,
        },
        {
          name: PermissionConstant.CommercialPermissions.LIST_MOVEMENT_HISTORY,
        },
        {
          name: PermissionConstant.CommercialPermissions.LIST_SHELFS_AND_STORAGES,
        },
        {
          name: PermissionConstant.CommercialPermissions.LIST_TRANSFER_MOVEMENT,
        },
        {
          name: PermissionConstant.CommercialPermissions.LIST_WAREHOUSE,
        },
        {
          name: PermissionConstant.CommercialPermissions.OEM,
        }
      ],
      children: [
        {
          name: 'PRODUCTS',
          url: 'inventory/product',
          role: [
            {
              name: PermissionConstant.CommercialPermissions.LIST_ITEM_STOCK,
            },
          ]
        },
        {
          name: 'WAREHOUSES',
          url: 'inventory/warehouse',
          role: [
            {
              name: PermissionConstant.CommercialPermissions.LIST_WAREHOUSE,
            },
          ],
        },
        {
          name: 'SHELFS_AND_STORAGES',
          url: 'inventory/ShelfAndStorage',
          role: [
            {
              name: PermissionConstant.CommercialPermissions.LIST_SHELFS_AND_STORAGES,
            }
          ]
        },
        {
          name: 'INVENTORY_DOCUMENTS',
          url: 'inventory/inventoryDocuments',
          role: [
            {
              name: PermissionConstant.CommercialPermissions.LIST_INVENTORY_MOVEMENT,
            }
          ],
        },
        {
          name: 'STOCK_DOCUMENTS',
          url: 'inventory/transfertMovement',
          role: [
            {
              name: PermissionConstant.CommercialPermissions.LIST_TRANSFER_MOVEMENT,
            }
          ]
        },
        {
          name: 'LIST_MOVEMENT_HISTORY',
          url: 'inventory/MovementHistory',
          role: [
            {
              name: PermissionConstant.CommercialPermissions.LIST_MOVEMENT_HISTORY,
            },
          ]
        },
        {
          name: 'OEM',
          url: 'inventory/Oem',
          role: [
            {
              name: PermissionConstant.CommercialPermissions.OEM,
            }
          ]
        },
      ]
    },
    {
      name: 'PURCHASE',
      url: 'Achat',
      icon: 'fa fa-shopping-cart',
      role: [
        {
          name: PermissionConstant.CommercialPermissions.LIST_SUPPLIER,
        },
        {
          name: PermissionConstant.CommercialPermissions.LIST_ORDER_QUOTATION_PURCHASE,
        },
        {
          name: PermissionConstant.CommercialPermissions.LIST_FINAL_ORDER_PURCHASE,
        },
        {
          name: PermissionConstant.CommercialPermissions.LIST_RECEIPT_PURCHASE,
        },
        {
          name: PermissionConstant.CommercialPermissions.LIST_INVOICE_PURCHASE,
        },
        {
          name: PermissionConstant.CommercialPermissions.LIST_ASSET_PURCHASE,
        },
        {
          name: PermissionConstant.CommercialPermissions.LIST_CLAIM_PURCHASE,
        },
        {
          name: PermissionConstant.CommercialPermissions.LIST_PURCHASE_REQUEST,
        },
        {
          name: PermissionConstant.CommercialPermissions.LIST_PRICEREQUEST
        },
        {
          name: PermissionConstant.CommercialPermissions.LIST_PROVISIONING
        },
        {
          name: PermissionConstant.CommercialPermissions.SHOW_BALANCE_PURCHASE
        },
        {
          name: PermissionConstant.CommercialPermissions.SHOW_UPDATE_BALANCE_PURCHASE
        },
      ],
      children: [
        {
          name: 'SUPPLIERS',
          url: 'purchase/suppliers',
          role: [
            {
              name: PermissionConstant.CommercialPermissions.LIST_SUPPLIER,
            }
          ],
        },
        {
          name: 'DOCUMENTS',
          role: [
            {
              name: PermissionConstant.CommercialPermissions.LIST_ORDER_QUOTATION_PURCHASE,
            },
            {
              name: PermissionConstant.CommercialPermissions.LIST_FINAL_ORDER_PURCHASE
            },
            {
              name: PermissionConstant.CommercialPermissions.LIST_RECEIPT_PURCHASE
            },
            {
              name: PermissionConstant.CommercialPermissions.LIST_INVOICE_PURCHASE
            },
            {
              name: PermissionConstant.CommercialPermissions.LIST_ASSET_PURCHASE
            },
          ],
          url: 'purchase/purchaseorder',
          children: [
            {
              name: 'ORDER_QUOTATION',
              url: 'purchase/purchaseorder',
              icon: ' ',
              role: [
                {
                  name: PermissionConstant.CommercialPermissions.LIST_ORDER_QUOTATION_PURCHASE,
                }
              ]
            },
            {
              name: 'FINAL_ORDER',
              url: 'purchase/purchasefinalorder',
              icon: ' ',
              role: [
                {
                  name: PermissionConstant.CommercialPermissions.LIST_FINAL_ORDER_PURCHASE
                }
              ],
            },
            {
              name: 'RECEIPT',
              url: 'purchase/delivery',
              icon: ' ',
              role: [
                {
                  name: PermissionConstant.CommercialPermissions.LIST_RECEIPT_PURCHASE,
                }
              ],
            },
            {
              name: 'INVOICE',
              url: 'purchase/invoice',
              icon: ' ',
              role: [
                {
                  name: PermissionConstant.CommercialPermissions.LIST_INVOICE_PURCHASE
                }
              ],
            },
            {
              name: 'ASSET',
              url: 'purchase/asset',
              icon: ' ',
              role: [
                {
                  name: PermissionConstant.CommercialPermissions.LIST_ASSET_PURCHASE
                }
              ],
            }
          ]
        },
        {
          name: 'CLAIMS',
          url: 'helpdesk/claims',
          role: [
            {
              name: PermissionConstant.CommercialPermissions.LIST_CLAIM_PURCHASE,
            }
          ],
        },
        {
          name: 'PURCHASE_REQUEST',
          url: 'purchase/purchaserequest',
          role: [
            {
              name: PermissionConstant.CommercialPermissions.LIST_PURCHASE_REQUEST,
            }
          ],
        },
        {
          name: 'PRICE_REQUESTS',
          url: 'purchase/pricerequest',
          role: [
            {
              name: PermissionConstant.CommercialPermissions.LIST_PRICEREQUEST,
            }
          ],
        },
        {
          name: 'ORDERPROJECT',
          url: 'purchase/orderProject',
          role: [
            {
              name: PermissionConstant.CommercialPermissions.LIST_PROVISIONING,
            }
          ],
        },
        {
          name: 'PURCHASE_BALANCE',
          url: 'purchase/purchasebalance',
          role: [
            {
              name: PermissionConstant.CommercialPermissions.SHOW_BALANCE_PURCHASE,
            },
            {
              name: PermissionConstant.CommercialPermissions.SHOW_UPDATE_BALANCE_PURCHASE,
            },

          ],
        }
      ]
    },
    {
      name: 'SALES',
      url: 'sales',
      icon: 'fa fa-line-chart',
      role: [
        {
          name: PermissionConstant.CommercialPermissions.LIST_CUSTOMER,
        },
        {
          name: PermissionConstant.CommercialPermissions.LIST_QUICK_SALES,
        },
        {
          name: PermissionConstant.CommercialPermissions.LIST_QUOTATION_SALES
        },
        {
          name: PermissionConstant.CommercialPermissions.LIST_ORDER_SALES
        },
        {
          name: PermissionConstant.CommercialPermissions.LIST_DELIVERY_SALES
        },
        {
          name: PermissionConstant.CommercialPermissions.LIST_INVOICE_SALES
        },
        {
          name: PermissionConstant.CommercialPermissions.LIST_ASSET_SALES
        },
        {
          name: PermissionConstant.CommercialPermissions.LIST_INVOICE_ASSET_SALES
        },
        {
          name: PermissionConstant.CommercialPermissions.LIST_FINANCIAL_ASSET_SALES
        },
        {
          name: PermissionConstant.CommercialPermissions.GENERATE_SALES_JOURNAL
        },
        {
          name: PermissionConstant.CommercialPermissions.SHOW_TERM_BILLING
        },
        {
          name: PermissionConstant.CommercialPermissions.RESEARCH_HISTORY
        },
        {
          name : PermissionConstant.CommercialPermissions.LIST_SERVICES_CONTRACT
        },
        {
          name : PermissionConstant.CommercialPermissions.COUNTER_SALES
        },
        {
          name: PermissionConstant.CommercialPermissions.LIST_BILLING_SESSION
        }
      ],
      children: [
        {
          name: 'CUSTOMERS',
          url: 'sales/customer',
          role: [
            {
              name: PermissionConstant.CommercialPermissions.LIST_CUSTOMER,
            },
          ]
        },
        {
          name: 'FASTE_SALES_MENU',
          url: 'sales/searchItem',
          role: [
            {
              name: PermissionConstant.CommercialPermissions.LIST_QUICK_SALES,
            }
          ]
        },
        {
          name: 'COUNTER_SALES',
          url: 'sales/counterSales',
          role: [
            {
              name: PermissionConstant.CommercialPermissions.COUNTER_SALES,
            }
          ]
        },
        {
          name: 'DOCUMENTS',
          url: 'sales/quotation',
          role: [
            {
              name: PermissionConstant.CommercialPermissions.LIST_QUOTATION_SALES
            },
            {
              name: PermissionConstant.CommercialPermissions.LIST_ORDER_SALES
            },
            {
              name: PermissionConstant.CommercialPermissions.LIST_DELIVERY_SALES
            },
            {
              name: PermissionConstant.CommercialPermissions.LIST_INVOICE_SALES
            },
            {
              name: PermissionConstant.CommercialPermissions.LIST_ASSET_SALES
            },
            {
              name: PermissionConstant.CommercialPermissions.LIST_INVOICE_ASSET_SALES
            },
            {
              name: PermissionConstant.CommercialPermissions.LIST_FINANCIAL_ASSET_SALES
            }
          ],
          children: [
            {
              name: 'DEVIS',
              url: 'sales/quotation',
              icon: ' ',
              role: [
                {
                  name: PermissionConstant.CommercialPermissions.LIST_QUOTATION_SALES,
                }
              ],
            },
            {
              name: 'ORDER',
              url: 'sales/order',
              icon: ' ',
              role: [
                {
                  name: 'LIST-SALESORDER',
                },
                {
                  name: PermissionConstant.CommercialPermissions.LIST_ORDER_SALES,
                }
              ],
            },
            {
              name: 'DELIVERY_FORM',
              url: 'sales/delivery',
              icon: ' ',
              role: [
                {
                  name: PermissionConstant.CommercialPermissions.LIST_DELIVERY_SALES,
                },
              ],
            },
            {
              name: 'INVOICE',
              url: 'sales/invoice',
              icon: ' ',
              role: [
                {
                  name: PermissionConstant.CommercialPermissions.LIST_INVOICE_SALES,
                },
              ],
            },
            {
              name: 'ASSET',
              url: 'sales/asset',
              icon: ' ',
              role: [
                {
                  name: PermissionConstant.CommercialPermissions.LIST_ASSET_SALES,
                }
              ],
            },
            {
              name: 'INVOICEASSEST',
              url: 'sales/invoiceasset',
              icon: ' ',
              role: [
                {
                  name: PermissionConstant.CommercialPermissions.LIST_INVOICE_ASSET_SALES,
                }
              ],
            },
            {
              name: 'ALL_ASSETS_FINACIAL',
              url: 'sales/financialDocument',
              icon: ' ',
              role: [
                {
                  name: PermissionConstant.CommercialPermissions.LIST_FINANCIAL_ASSET_SALES,
                }
              ]
            }
          ]
        },
        {
          name: 'BILLING_SESSION',
          url: 'sales/billingSession',
          role: [
            {
              name: PermissionConstant.CommercialPermissions.LIST_BILLING_SESSION,
            },
            {
              name: 'BILLINGSESSION',
            },
          ],
        },
        {
          name: 'SERVICES_CONTRACT',
          url: 'sales/project',
          role: [
            {
              name: PermissionConstant.CommercialPermissions.LIST_SERVICES_CONTRACT,
            }
          ],
        },
        {
          name: 'TERM_BILLING',
          url: 'sales/termbillinglist',
          role: [
            {
              name: PermissionConstant.CommercialPermissions.SHOW_TERM_BILLING,
            }
          ]
        }, {
          name: 'SEARCH_ITEM_MENU',
          url: 'sales/searchHistory',
          role: [
            {
              name: PermissionConstant.CommercialPermissions.RESEARCH_HISTORY,
            }
          ]
        },
        //{
        //  name: 'SEARCH_ITEM_MENU',
        //  url: 'sales/searchHistory',
        //  role: [
        //    {
        //      name: RoleConfigConstant.SEARCHITEMCONFIG,
        //    }
        //  ]
        //},
      ]
    },
    {
      name: 'TREASURY',
      url: 'treasury',
      icon: 'cui-dollar icons font-xl mt-1',
      role: [
        {
          name: PermissionConstant.TreasuryPermissions.LIST_CUSTOMER_OUTSTANDING_DOCUMENT,
        },
        {
          name: PermissionConstant.TreasuryPermissions.LIST_SUPPLIER_OUTSTANDING_DOCUMENT,
        },
        {
          name: PermissionConstant.TreasuryPermissions.LIST_CUSTOMER_RECEIVABLES_STATE,
        },
        {
          name: PermissionConstant.TreasuryPermissions.LIST_CUSTOMER_PAYMENT_HISTORY,
        },
        {
          name: PermissionConstant.TreasuryPermissions.READONLY_CUSTOMER_PAYMENT_HISTORY,
        },
        {
          name: PermissionConstant.TreasuryPermissions.LIST_SUPPLIER_RECEIVABLES_STATE
        },
        {
          name: PermissionConstant.TreasuryPermissions.LIST_SUPPLIER_PAYMENT_HISTORY
        },
        {
          name: PermissionConstant.TreasuryPermissions.READONLY_SUPPLIER_PAYMENT_HISTORY,
        },
        {
          name: PermissionConstant.TreasuryPermissions.LIST_TREASURY_BANK_ACCOUNT
        },
        {
          name: PermissionConstant.TreasuryPermissions.LIST_TREASURY_BANK_SLIP
        },
        {
          name: PermissionConstant.TreasuryPermissions.LIST_CASH_MANAGEMENT
        },
        {
          name: PermissionConstant.TreasuryPermissions.LIST_FUNDS_TRANSFER
        }
      ],
      children: [
        {
          name: 'CUSTOMER',
          url: 'treasury/customer',
          role: [
            {
              name: PermissionConstant.TreasuryPermissions.LIST_CUSTOMER_OUTSTANDING_DOCUMENT
            },
            {
              name: PermissionConstant.TreasuryPermissions.LIST_CUSTOMER_RECEIVABLES_STATE
            },
            {
              name: PermissionConstant.TreasuryPermissions.LIST_CUSTOMER_PAYMENT_HISTORY
            },
            {
              name: PermissionConstant.TreasuryPermissions.READONLY_CUSTOMER_PAYMENT_HISTORY,
            },
          ],
          children: [
            {
              name: 'OUTSTANDING',
              url: 'treasury/customer/outstanding/outstandingDocument',
              role: [
                {
                  name: PermissionConstant.TreasuryPermissions.LIST_CUSTOMER_OUTSTANDING_DOCUMENT
                }
              ]
            },
            {
              name: 'RECEIVABLES_STATE',
              url: 'treasury/customer/receivables',
              role: [
                {
                  name: PermissionConstant.TreasuryPermissions.LIST_CUSTOMER_RECEIVABLES_STATE
                }
              ],
            },
            {
              name: 'PAYMENT_HISTORY',
              url: 'treasury/customer/paymentHistory',
              role: [
                {
                  name: PermissionConstant.TreasuryPermissions.LIST_CUSTOMER_PAYMENT_HISTORY
                },
                {
                  name: PermissionConstant.TreasuryPermissions.READONLY_CUSTOMER_PAYMENT_HISTORY
                }
              ],
            }
          ]
        },
        {
          name: 'SUPPLIER',
          url: 'treasury/supplier',
          role: [
            {
              name: PermissionConstant.TreasuryPermissions.LIST_SUPPLIER_OUTSTANDING_DOCUMENT
            },
            {
              name: PermissionConstant.TreasuryPermissions.LIST_SUPPLIER_RECEIVABLES_STATE
            },
            {
              name: PermissionConstant.TreasuryPermissions.LIST_SUPPLIER_PAYMENT_HISTORY
            },
            {
              name: PermissionConstant.TreasuryPermissions.READONLY_SUPPLIER_PAYMENT_HISTORY,
            }
          ],
          children: [
            {
              name: 'OUTSTANDING',
              url: 'treasury/supplier/outstanding',
              role: [
                {
                  name: PermissionConstant.TreasuryPermissions.LIST_SUPPLIER_OUTSTANDING_DOCUMENT
                }
              ],
            },
            {
              name: 'RECEIVABLES_STATE',
              url: 'treasury/supplier/receivables',
              role: [
                {
                  name: PermissionConstant.TreasuryPermissions.LIST_SUPPLIER_RECEIVABLES_STATE
                }
              ],
            },
            {
              name: 'DISBURSMENT_HISTORY',
              url: 'treasury/supplier/disbursmentHistory',
              role: [
                {
                  name: PermissionConstant.TreasuryPermissions.LIST_SUPPLIER_PAYMENT_HISTORY
                },
                {
                  name: PermissionConstant.TreasuryPermissions.READONLY_SUPPLIER_PAYMENT_HISTORY
                }
              ],
            }
          ]
        },
        {
          name: 'CASH_REGISTERS',
          url: 'treasury/CashManagement',
          role: [
            {
              name: PermissionConstant.TreasuryPermissions.LIST_CASH_MANAGEMENT
            },
            {
              name: PermissionConstant.TreasuryPermissions.LIST_FUNDS_TRANSFER
            }
          ],
          children: [
            {
              name: 'CASH_MANAGEMENT',
              url: 'treasury/CashManagement/CashRegisters',
              role: [
                {
                  name: PermissionConstant.TreasuryPermissions.LIST_CASH_MANAGEMENT
                },
              ],
            },
            {
              name: 'FUNDS_TRANSFER',
              url: 'treasury/CashManagement/FundsTransfer',
              role: [
                {
                  name: PermissionConstant.TreasuryPermissions.LIST_FUNDS_TRANSFER
                }
              ],
            },
            /*  {
                name: 'FUNDS_TRANSFER',
                url: 'treasury/CashManagement/FundsTransfer',
                role: [
                  {
                    name: RoleConfigConstant.CASHREGISTERTREASURY
                  },
                ],
              }*/
          ]
        },
        {
          name: 'BANK',
          url: 'treasury/bankManagement',
          role: [
            {
              name: PermissionConstant.TreasuryPermissions.LIST_TREASURY_BANK_ACCOUNT
            },
            {
              name: PermissionConstant.TreasuryPermissions.LIST_TREASURY_BANK_SLIP
            }
          ],
          children: [
            {
              name: 'BANK_ACCOUNT',
              url: 'treasury/bankManagement/bankaccounts/fromTreasury',
              role: [
                {
                  name: PermissionConstant.TreasuryPermissions.LIST_TREASURY_BANK_ACCOUNT
                }
              ],
            },
            {
              name: 'BANK_SLIP',
              url: 'treasury/bankManagement/paymentSlip',
              role: [
                {
                  name: PermissionConstant.TreasuryPermissions.LIST_TREASURY_BANK_SLIP
                }
              ],
            }
          ]
        },
      ]
    },
    {
      name: 'STOCKCORRECTION',
      url: 'stockCorrection',
      icon: 'icon-briefcase',
      role: [
        {
          name: PermissionConstant.CommercialPermissions.LIST_ADMISSION_VOUCHERS
        },
        {
          name: PermissionConstant.CommercialPermissions.LIST_EXIT_VOUCHERS
        },
      ],
      children: [
        {
          name: 'BE',
          url: 'stockCorrection/be',
          role: [
            {
              name: PermissionConstant.CommercialPermissions.LIST_ADMISSION_VOUCHERS,
            },
          ]
        },
        {
          name: 'BS',
          url: 'stockCorrection/bs',
          role: [
            {
              name: PermissionConstant.CommercialPermissions.LIST_EXIT_VOUCHERS,
            },
          ],
        }
      ]
    },
    {
      name: 'IMMOBILIZATION',
      url: 'Immobilization',
      icon: 'icon-briefcase',
      role: [
        {
          name: PermissionConstant.CommercialPermissions.LIST_ACTIVE,
        },
        {
          name: PermissionConstant.CommercialPermissions.LIST_ASSIGNMENT_ACTIVE,
        },
        {
          name: PermissionConstant.CommercialPermissions.ADD_ASSIGNMENT_ACTIVE,
        },
      ],
      children: [
        {
          name: 'ACTIVES',
          url: 'immobilization/listOfActive',
          role: [
            {
              name: PermissionConstant.CommercialPermissions.LIST_ACTIVE,
            },
          ],
        },
        {
          name: 'ACTIVE_ASSIGNMENT',
          url: 'immobilization/activeAssignment',
          role: [
            {
              name: PermissionConstant.CommercialPermissions.LIST_ASSIGNMENT_ACTIVE,
            },
          ],
        },
      ],
    },

    {
      name: 'HR_SPACE',
      url: 'payroll',
      icon: 'icon-people',
      role: [
        {
          name: PermissionConstant.RHAndPaiePermissions.LIST_EMPLOYEE
        },
        {
          name: PermissionConstant.RHAndPaiePermissions.LIST_CONTRACT
        },
        {
          name: PermissionConstant.RHAndPaiePermissions.LIST_EXITEMPLOYEE
        },
        {
          name: PermissionConstant.RHAndPaiePermissions.LIST_TEAM
        },
        {
          name: PermissionConstant.RHAndPaiePermissions.VIEW_ORGANIZATIONCHART
        },
        {
          name: PermissionConstant.SettingsRHAndPaiePermissions.VIEW_SKILLS_MATRIX,
        },
        {
          name: PermissionConstant.RHAndPaiePermissions.LIST_ANNUALINTERVIEW,
        },
      ],
      children: [
        {
          name: 'EMPLOYEES',
          url: 'payroll/employee',
          role: [
            {
              name: PermissionConstant.RHAndPaiePermissions.LIST_EMPLOYEE
            }
          ],
        },
        {
          name: 'CONTRACT',
          url: 'payroll/contract',
          role: [
            {
              name: PermissionConstant.RHAndPaiePermissions.LIST_CONTRACT
            }
          ],
        },
        {
          name: 'LEAVE_EMPLOYEE',
          url: 'payroll/exit-employee',
          role: [
            {
              name: PermissionConstant.RHAndPaiePermissions.LIST_EXITEMPLOYEE
            }
          ],
        },
        {
          name: 'ORGANIZATIONAL',
          url: 'payroll/employee/organizationChart',
          role: [
            {
              name: PermissionConstant.RHAndPaiePermissions.VIEW_ORGANIZATIONCHART,
            }
          ],
        },
        {
          name: 'TEAMS',
          url: 'payroll/team',
          role: [
            {
              name: PermissionConstant.RHAndPaiePermissions.LIST_TEAM,
            }
          ],
        },
        {
          name: 'SKILLS_MATRIX',
          url: 'payroll/skillsMatrix',
          role: [
            {
              name: PermissionConstant.SettingsRHAndPaiePermissions.VIEW_SKILLS_MATRIX,
            }
          ],
        },
        {
          name: 'FORMATIONS',
          url: 'payroll',
          role: [
            {
              name: PermissionConstant.RHAndPaiePermissions.LIST_TRAINING,
            },
            {
              name: PermissionConstant.RHAndPaiePermissions.LIST_TRAININGREQUEST,
            },
            {
              name: PermissionConstant.RHAndPaiePermissions.LIST_TRAININGSESSION,
            }
          ],
          children: [
            {
              name: 'CATALOG',
              url: 'rh/training/catalog',
              role: [
                {
                  name: PermissionConstant.RHAndPaiePermissions.LIST_TRAINING,
                }
              ],
            },
            {
              name: 'TRAINING_REQUEST',
              url: 'rh/training/request',
              role: [
                {
                  name: PermissionConstant.RHAndPaiePermissions.LIST_TRAININGREQUEST,
                },
                {
                  name: PermissionConstant.RHAndPaiePermissions.ALL_TRAINING_REQUEST,
                }
              ],
            },
            {
              name: 'TRAINING_SESSION',
              url: 'rh/training/session',
              role: [
                {
                  name: PermissionConstant.RHAndPaiePermissions.LIST_TRAININGSESSION,
                }
              ],
            },
          ],
        },
        {
          name: 'ANNUAL_INTERVIEWS',
          url: 'rh/review',
          role: [
            {
              name: PermissionConstant.RHAndPaiePermissions.LIST_ANNUALINTERVIEW
            },
            {
              name: PermissionConstant.RHAndPaiePermissions.UPDATE_ANNUALINTERVIEW
            }
          ],
        }
      ],
    },
    {
      name: 'RECRUITMENT_MANAGEMENT',
      url: 'Payroll',
      icon: 'fa fa-users',
      role: [
        {
          name: PermissionConstant.RHAndPaiePermissions.LIST_RECRUITMENT,
        },
        {
          name: PermissionConstant.RHAndPaiePermissions.LIST_CANDIDATE,
        },
        {
          name: PermissionConstant.RHAndPaiePermissions.LIST_RECRUITMENTREQUEST,
        },
        {
          name: PermissionConstant.RHAndPaiePermissions.LIST_RECRUITMENTOFFER,
        }
      ],
      children: [
        {
          name: 'RECRUITMENT_REQUEST',
          url: 'rh/recruitment-request',
          role: [
            {
              name: PermissionConstant.RHAndPaiePermissions.LIST_RECRUITMENTREQUEST,
            }
          ],
        },
        {
          name: 'RECRUITMENT_OFFER',
          url: 'rh/recruitment-offer',
          role: [
            {
              name: PermissionConstant.RHAndPaiePermissions.LIST_RECRUITMENTOFFER,
            }
          ],
        },
        {
          name: 'CANDIDATES',
          url: 'rh/candidate',
          role: [
            {
              name: PermissionConstant.RHAndPaiePermissions.LIST_CANDIDATE,
            }
          ],
        },
        {
          name: 'RECRUITMENT',
          url: 'rh/recruitment',
          role: [
            {
              name: PermissionConstant.RHAndPaiePermissions.LIST_RECRUITMENT
            },
            {
              name: PermissionConstant.RHAndPaiePermissions.FULL_RECRUITMENT,
            }
          ],
        },
      ],
    },
    {
      name: 'EMPLOYEE_SPACE',
      url: 'payroll',
      icon: 'fa fa-list-alt',
      role: [
        {
          name: PermissionConstant.RHAndPaiePermissions.LIST_TIMESHEET
        },
        {
          name: PermissionConstant.RHAndPaiePermissions.TIMESHEET_MY_TIMESHEET
        },
        {
          name: PermissionConstant.RHAndPaiePermissions.LIST_LEAVE,
        },
        {
          name: PermissionConstant.RHAndPaiePermissions.LIST_EXPENSEREPORT,
        },
        {
          name: PermissionConstant.RHAndPaiePermissions.LIST_DOCUMENTREQUEST,
        },
        {
          name: PermissionConstant.RHAndPaiePermissions.LIST_SHAREDDOCUMENT,
        },
        {
          name: PermissionConstant.RHAndPaiePermissions.LIST_OWNED_SHARED_DOCUMENT,
        }
      ],
      children: [
        {
          name: 'TIMESHEET',
          url: 'timesheet',
          role: [

            {
              name: PermissionConstant.RHAndPaiePermissions.LIST_TIMESHEET
            },
            {
              name: PermissionConstant.RHAndPaiePermissions.TIMESHEET_MY_TIMESHEET
            }
          ],
          children: [
            {
              name: 'MY_TIMESHEET',
              url: 'rh/timesheet',
              icon: ' ',
              role: [
                {
                  name: PermissionConstant.RHAndPaiePermissions.TIMESHEET_MY_TIMESHEET
                },
              ],
            },
            {
              name: 'LIST',
              url: 'rh/timesheet/list',
              icon: ' ',
              role: [
                {
                  name: PermissionConstant.RHAndPaiePermissions.LIST_TIMESHEET
                }
              ],
            },
          ],
        },
        {
          name: 'LEAVES',
          url: 'payroll/leave',
          role: [
            {
              name: PermissionConstant.RHAndPaiePermissions.LIST_LEAVE,
            }
          ],
        },
        {
          name: 'EXPENSE_REPORT',
          url: 'rh/generalLedger',
          role: [
            {
              name: PermissionConstant.RHAndPaiePermissions.LIST_EXPENSEREPORT,
            },
          ],
          children: [
            {
              name: 'DEMAND',
              url: 'payroll/expenseReport/add',
              icon: ' ',
              role: [
                {
                  name: PermissionConstant.RHAndPaiePermissions.LIST_EXPENSEREPORT,
                },
                {
                  name: PermissionConstant.RHAndPaiePermissions.ADD_EXPENSEREPORT,
                }
              ],
            },
            {
              name: 'LIST',
              url: 'payroll/expenseReport',
              icon: ' ',
              role: [
                {
                  name: PermissionConstant.RHAndPaiePermissions.LIST_EXPENSEREPORT,
                }
              ],
            },
          ],
        },
        {
          name: 'DOCUMENTS',
          url: 'payroll/document',
          role: [
            {
              name: PermissionConstant.RHAndPaiePermissions.LIST_DOCUMENTREQUEST,
            },
          ],
        },
      ],
    },
    {
      name: 'PAYROLL',
      url: 'payroll',
      icon: 'fa fa-money',
      role: [
        {
          name: PermissionConstant.RHAndPaiePermissions.LIST_SESSION
        },
        {
          name: PermissionConstant.RHAndPaiePermissions.LIST_TRANSFERORDER
        },
        {
          name: PermissionConstant.RHAndPaiePermissions.LIST_CNSSDECLARATION
        },
        {
          name: PermissionConstant.RHAndPaiePermissions.LIST_SOURCEDEDUCTIONSESSION
        },
        {
          name: PermissionConstant.RHAndPaiePermissions.LIST_LOAN
        },
      ],
      children: [
        {
          name: 'SESSION',
          url: 'payroll/session',
          role: [
            {
              name: PermissionConstant.RHAndPaiePermissions.LIST_SESSION
            },
          ],
        },
        {
          name: 'PAYSLIPHISTORY',
          url: 'payroll/paysliphistory',
          role: [
            {
              name: PermissionConstant.RHAndPaiePermissions.LIST_PAYSLIPHISTORY
            }
          ]
        },
        {
          name: 'TRANSFERORDER',
          url: 'payroll/transferorder',
          role: [
            {
              name: PermissionConstant.RHAndPaiePermissions.LIST_TRANSFERORDER
            },
          ],
        },
        {
          name: 'CNSS_DECLARATION',
          url: 'payroll/cnssdeclaration',
          role: [
            {
              name: PermissionConstant.RHAndPaiePermissions.LIST_CNSSDECLARATION
            },
          ]
        },
        {
          name: 'SOURCE_DEDUCTION',
          url: 'payroll/sourcedeductionsession',
          role: [
            {
              name: PermissionConstant.RHAndPaiePermissions.LIST_SOURCEDEDUCTIONSESSION
            }
          ]
        },
        {
          name: 'EMPLOYER_DECLARATION',
          url: 'payroll/employerdeclaration',
          role: [
            {
              name: PermissionConstant.RHAndPaiePermissions.DECLARATION_EMPLOYEE
            }
          ]
        },
        {
          name: 'LOANADVANCE',
          url: 'payroll/loan',
          role: [
            {
              name: PermissionConstant.RHAndPaiePermissions.LIST_LOAN
            }
          ]
        }
      ]
    },
    {
      name: 'ACCOUNTING',
      url: 'Accounting',
      icon: 'fa fa-calculator',
      role: [
        {
          name: PermissionConstant.AccountingPermissions.ACCOUNTING
        },
        {
          name: 'COMPTABILITE'
        }
      ],
      children: [
        {
          name: 'DOCUMENT_ACCOUNT',
          url: 'accounting/documentAccount',
          role: [
            {
              name: PermissionConstant.AccountingPermissions.DOCUMENTS_ACCOUNTS
            }
          ],
        },
        {
          name: 'ACCOUNTING_LETTERING',
          url: 'accounting/lettering',
          role: [
            {
              name: PermissionConstant.AccountingPermissions.ACCOUNTING_LETTERING
            }
          ],
        },
        {
          name: 'RECONCILIATION_BANK',
          url: 'accounting/reconciliationBankMenu',
          role: [
            {
              name: PermissionConstant.AccountingPermissions.RECONCILIATION_BANK
            }
          ],
        },
        {
          name: 'ACCOUNTING_IMMOBILIZATION',
          url: 'accounting/depreciationAssets',
          role: [
            {
              name: PermissionConstant.AccountingPermissions.AMORTIZATION_OF_IMMOBILIZATIONS
            }
          ]
        },
        {
          name: 'IMPORT_DOCUMENTS',
          url: 'accounting/import',
          role: [
            {
              name: PermissionConstant.AccountingPermissions.IMPORT_ACCOUNTING_DOCUMENTS
            }
          ],
        },
        {
          name: 'REPORTINGS',
          url: 'accounting/reporting/editions/trialBalance',
          role: [
            {
              name: PermissionConstant.AccountingPermissions.EDITIONS_REPORTS
            },
            {
              name: PermissionConstant.AccountingPermissions.FINANCIAL_STATES_REPORTS
            },
            {
              name: PermissionConstant.AccountingPermissions.JOURNALS_REPORTS
            }
          ],
          children: [
            {
              name: 'EDITIONS',
              icon: ' ',
              url: 'accounting/reporting/editions/trialBalance',
              role: [
                {
                  name: PermissionConstant.AccountingPermissions.EDITIONS_REPORTS
                }
              ],
            },
            {
              name: 'FINANCIAL_STATES',
              icon: ' ',
              url: 'accounting/reporting/financialStates/stateOfIncome',
              role: [
                {
                  name: PermissionConstant.AccountingPermissions.FINANCIAL_STATES_REPORTS
                }
              ],
            },
            {
              name: 'JOURNALS',
              icon: ' ',
              url: 'accounting/reporting/journals/StateOfAuxiliaryJournals',
              role: [
                {
                  name: PermissionConstant.AccountingPermissions.JOURNALS_REPORTS
                }
              ],
            },
          ]
        }
      ]
    },
    {
      name: 'MANUFACTURING',
      url: 'Manufacturing',
      icon: 'fa fa-industry',
      role: [
        {
          name: RoleConfigConstant.ManufacturingModule
        }
      ],
      children: [
        {
          name: 'PRODUCTION_DATA_MANAGEMENT',
          url: 'manufacturing/nomenclature',
          role: [
            {
              name: PermissionConstant.MANUFATORINGPermissions.FABRICATION_PERMISSION
            },
          ],
          children: [
            {
              name: 'NOMENCLATURE',
              url: 'manufacturing/nomenclature',
              role: [
                {
                  name: PermissionConstant.MANUFATORINGPermissions.MANUFACTURING_NOMENCLATURE_PERMISSION
                },
              ],
            },
            {
              name: 'CREATION_OF_OPERATING_RANGES',
              url: 'manufacturing/gamme',
              role: [
                {
                  name: PermissionConstant.MANUFATORINGPermissions.MANUFACTURING_GAMME_PERMISSION
                }
              ],
            },
            {
              name: 'RANGE_VISIBILITY',
              url: 'manufacturing/range_visibility',
              role: [
                {
                  name: PermissionConstant.MANUFATORINGPermissions.MANUFACTURING_GAMME_VISUALISATION_PERMISSION
                },
              ],
            },
            {
              name: 'CALCULATION_COST_PRICE',
              url: 'manufacturing/calculate_cost_price',
              role: [
                {
                  name: PermissionConstant.MANUFATORINGPermissions.FABRICATION_PERMISSION
                },
              ],
            },
            {
              name: 'WORK_STATION',
              url: 'manufacturing/workstation',
              role: [
                {
                  name: PermissionConstant.MANUFATORINGPermissions.TIMELINE_PERMISSION
                },
              ],
            },
            {
              name: 'CALENDER',
              url: 'manufacturing/timeline/calendar',
              role: [
                {
                  name: PermissionConstant.MANUFATORINGPermissions.CALENDER_PERMISSION
                },
              ],
            },
          ]
        },
        {
          name: 'MANUFACTURING_PROCESS',
          url: 'manufacturing/fabricationArrangement',
          role: [
            {
              name: PermissionConstant.MANUFATORINGPermissions.FABRICATION_PERMISSION
            },
          ],
          children: [
            {
              name: 'CREATION_OF_PRODUCTION_ORDERS',
              url: 'manufacturing/fabricationArrangement',
              role: [
                {
                  name: PermissionConstant.MANUFATORINGPermissions.MANUFACTURING_OF_PERMISSION
                },
              ],
            },
            {
              name: 'LAUNCH_OF_PRODUCTION_ORDERS',
              url: 'manufacturing/fabricationArrangement/launch',
              role: [
                {
                  name: PermissionConstant.MANUFATORINGPermissions.MANUFACTURING_LAUNCH_OF_PERMISSION
                },
              ],
            },
            {
              name: 'MONITORING_OF_MANUFACTURING_ORDERS',
              url: 'manufacturing/monotoring_of_ordres',
              role: [
                {
                  name: PermissionConstant.MANUFATORINGPermissions.TIMELINE_PERMISSION
                },
              ],
            },
            {
              name: 'PRODUCTION_MONITORING',
              url: 'manufacturing/monitoring',
              role: [
                {
                  name: PermissionConstant.MANUFATORINGPermissions.TIMELINE_PERMISSION
                },
              ],
            },
            {
              name: 'WORKSTATION_SHEET',
              url: 'manufacturing/workstation_sheet',
              role: [
                {
                  name: PermissionConstant.MANUFATORINGPermissions.TIMELINE_PERMISSION
                },
              ],
            }
          ]
        },
        {
          name: 'PRODUCTION_DASHBOARD',
          url: 'manufacturing/dashboard',
          role: [
            {
              name: PermissionConstant.MANUFATORINGPermissions.FABRICATION_PERMISSION
            },
          ],
          children: [
            {
              name: 'QUALITY_RATE',
              url: 'manufacturing/quality_rate',
              role: [
                {
                  name: PermissionConstant.MANUFATORINGPermissions.FABRICATION_PERMISSION
                },
              ],
            },
            {
              name: 'AVAILABILITY_RATE',
              url: 'manufacturing/availability_rate',
              role: [
                {
                  name: PermissionConstant.MANUFATORINGPermissions.TASK_TITLE_PERMISSION
                },
              ],
            },
            {
              name: 'PERFERMANCE_RATE',
              url: 'manufacturing/perfermance_rate',
              role: [
                {
                  name: PermissionConstant.MANUFATORINGPermissions.TIMELINE_PERMISSION
                },
              ],
            },
            {
              name: 'TRS',
              url: 'manufacturing/trs',
              role: [
                {
                  name: PermissionConstant.MANUFATORINGPermissions.TIMELINE_PERMISSION
                },
              ],
            }
          ]
        },
      ]

    },
    {
      name: 'CRM',
      url: 'Crm',
      icon: 'fa fa-handshake-o',
      role: [
        {
          name: PermissionConstant.CRMPermissions.CRM
        }

      ],
      children: [
        {
          name: 'Contacts',
          url: 'crm/contactCrm',
          role: [
            {
              name: PermissionConstant.CRMPermissions.CRM_Contacts
            },
          ]
        }
        ,
        {
          name: 'ORGANISATIONS',
          url: 'crm/organisation',
          role: [
            {
              name: PermissionConstant.CRMPermissions.CRM_ORGANISATIONS
            },
          ]
        },
        {
          name: 'CALENDAR.MENU_TITLE',
          url: 'crm/calendar',
          role: [
            {
              name: PermissionConstant.CRMPermissions.CRM_CALENDAR
            },
          ]
        },
        {
          name: 'ACTIONS',
          url: 'crm/action',
          role: [
            {
              name: PermissionConstant.CRMPermissions.VIEW_ACTION
            }
          ]
        }

        ,
        {
          name: 'OPPORTUNITY',
          url: 'crm/opportunity',
          role: [
            {
              name: PermissionConstant.CRMPermissions.CRM_OPPORTUNITY
            },
          ]
        }, {
          name: 'CLAIMS',
          url: 'crm/claim',
          role: [
            {
              name: PermissionConstant.CRMPermissions.CRM_CLAIMS
            },
          ]
        },
        {
          name: 'C marketing',
          url: 'crm/campaign',
          role: [
            {
              name: PermissionConstant.CRMPermissions.VIEW_PH_CAMPAIGN
            },
          ]
        },
        {
          name: 'ARCHIVING',
          url: 'crm/archiving/action',
          role: [
            {
              name: PermissionConstant.CRMPermissions.CRM_ARCHIVING
            },
          ]
        },
      ]
    },
    {
      name: 'ECOMMERCE',
      url: 'ecommerce',
      icon: 'fa fa-shopping-cart',
      role: [
        {
          name: RoleConfigConstant.EcommerceConfig,
        },
        // {
        //   name: 'ItemEcomm'
        // },
      ],
      children: [
        {
          name: 'ONLINE_EXHIBITION',
          url: 'ecommerce/product',
          role: [
            {
              name: RoleConfigConstant.EcommerceConfig,
            },
            // {
            //   name: RoleConfigConstant.EcommerceItemConfig,
            // },
            // {
            //   name: 'ItemEcomm'
            // },
          ]
        },
        {
          name: 'RESERVATIONS',
          url: 'ecommerce/movement',
          role: [
            {
              name: RoleConfigConstant.EcommerceConfig,
            },
            // {
            //   name: RoleConfigConstant.EcommerceMovementConfig,
            // },
            // {
            //   name: 'StockMovementEcomm'
            // },
          ]
        },
        /*{
          name: 'ECOMMERCECUSTOMER',
          url: 'ecommerce/customer',
          role: [
            {
              name: RoleConfigConstant.EcommerceTiersConfig,
            },
            {
              name: 'TiersEcomm'
            },
          ]
        },*/
        {
          name: 'ECOMMERCELOG',
          url: 'ecommerce/log/toExecute',
          role: [
            {
              name: RoleConfigConstant.EcommerceConfig,
            },
            // {
            //   name: RoleConfigConstant.AdminConfig,
            // },
            // {
            //   name: RoleConfigConstant.NotControlledConfig,
            // },
          ]
        }
      ]
    },
    {
      name: 'Reporting',
      url: 'reporting',
      icon: 'fa fa-bar-chart',
      role: [
        {
          name: PermissionConstant.CommercialPermissions.LIST_DOCUMENT_STATUS_CONTROL,
        },
        {
          name: PermissionConstant.CommercialPermissions.LIST_STOCK_VALUATION,
        },
        {
          name: PermissionConstant.CommercialPermissions.LIST_TIERS_EXTRACT,
        },
        {
          name: PermissionConstant.CommercialPermissions.LIST_VAT_DECLARATION,
        }

      ],
      children: [
        {
          name: 'DOCUMENT_CONTROL_STATUS',
          url: 'reporting/document/document-control',
          role: [
            {
              name: PermissionConstant.CommercialPermissions.LIST_DOCUMENT_STATUS_CONTROL,
            }
          ],
        },
        {
          name: 'STOCK_VALUATION',
          url: 'reporting/stock-valuation',
          role: [
            {
              name: PermissionConstant.CommercialPermissions.LIST_STOCK_VALUATION,
            }
          ],
        },
        {
          name: 'TIERS_EXTRACT',
          url: 'reporting/tiers-extract',
          role: [
            {
              name: PermissionConstant.CommercialPermissions.LIST_TIERS_EXTRACT,
            }
          ],
        },
        {
          name: 'VAT_DECLARATION',
          url: 'reporting/vat-declaration',
          role: [
            {
              name: PermissionConstant.CommercialPermissions.LIST_VAT_DECLARATION,
            }
          ],
        },
        {
          name: 'Sales_Journal',
          url: 'reporting/daily-sales',
          role: [
            {
              name: PermissionConstant.CommercialPermissions.GENERATE_SALES_JOURNAL,
            }
          ]
        },
        {
          name: 'NOTE_ON_TURNOVER',
          url: 'reporting/note-on-turnover',
          role: [
            {
              name: PermissionConstant.CommercialPermissions.LIST_NOTE_ON_TURNOVER,
            }
          ],
        }
      ]
    },
    {
      name: 'STARKDRIVE',
      url: 'rh/explorer-starkdrive',
      icon: 'fa fa-hdd-o',
      role: [
        {
          name: RoleConfigConstant.Starkdrive,
        },
      ],
    },
    {
      name: 'GARAGE',
      url: 'garage',
      icon: 'fa fa-car font-xm mt-1',
      role: [
        {
          name: PermissionConstant.GaragePermissions.LIST_CUSTOMER_VEHICLE
        },
        {
          name: PermissionConstant.GaragePermissions.LIST_LOAN_VEHICLE
        },
        {
          name: PermissionConstant.GaragePermissions.LIST_APPOINTMENT
        },
        {
          name: PermissionConstant.GaragePermissions.LIST_INTERVENTION
        },
        {
          name: PermissionConstant.GaragePermissions.LIST_REPAIR_ORDER
        },
        {
          name: PermissionConstant.GaragePermissions.LIST_SMS
        }
      ],
      children: [
        {
          name: 'VEHICLES',
          url: 'vehicle',
          role: [
            {
              name: PermissionConstant.GaragePermissions.LIST_CUSTOMER_VEHICLE
            },
            {
              name: PermissionConstant.GaragePermissions.LIST_LOAN_VEHICLE
            }
          ],
          children: [
            {
                name: 'CUSTOMERS_VEHICLES',
                url: 'garage/vehicle/customers-vehicles',
                role: [
                  {
                    name: PermissionConstant.GaragePermissions.LIST_CUSTOMER_VEHICLE
                  }
                ]
            },
            {
              name: 'LOAN_VEHICLES',
              url: 'garage/vehicle/loan-vehicles',
              role: [
                {
                  name: PermissionConstant.GaragePermissions.LIST_LOAN_VEHICLE
                }
              ]
            }
          ]
        },
        {
          name: 'PLANNING',
          url: 'planning',
          role: [
            {
              name: PermissionConstant.GaragePermissions.LIST_APPOINTMENT,
            },
            {
              name: PermissionConstant.GaragePermissions.SEND_SMS,
            }
          ],
          children: [
            {
              name: 'APPOINTMENT_REQUEST',
              url: 'garage/planning/planning-request',
              role: [
                {
                  name: PermissionConstant.GaragePermissions.LIST_APPOINTMENT
                }
              ]
            },
            {
              name: 'SEND_SMS_MENU',
              url: 'garage/planning/sms',
              role: [
                {
                  name: PermissionConstant.GaragePermissions.LIST_SMS
                }
              ]
            }
          ]
        },
        {
          name: 'REPAIR_ORDER',
          url: 'garage/repair-order',
          role: [
            {
              name: PermissionConstant.GaragePermissions.LIST_REPAIR_ORDER
            }
          ]
        },
        {
          name: 'INTERVENTIONS',
          url: 'garage/intervention',
          role: [
            {
              name: PermissionConstant.GaragePermissions.LIST_INTERVENTION
            }
          ]
        }
      ]
    }
  ];

  public navItemsConsultant = [
    {
      name: 'DASHBOARD',
      url: '/main/dashboard',
      icon: 'icon-speedometer',
      children: [
        {
          name: 'VEHICLES',
          url: '',
          role: [
            {
              name: PermissionConstant.DashboardPermissions.SALES_DASHBOARD
            },
            {
              name: PermissionConstant.DashboardPermissions.PURCHASE_DASHBOARD
            },
            {
              name: PermissionConstant.DashboardPermissions.TREASURY_SALES_DASHBOARD
            },
            {
              name: PermissionConstant.DashboardPermissions.TREASURY_PURCHASE_DASHBOARD
            },
            {
              name: PermissionConstant.DashboardPermissions.GARAGE_DASHBOARD
            }
          ]
        }
      ],
      role: [
        {
              name: PermissionConstant.DashboardPermissions.SALES_DASHBOARD
            },
            {
              name: PermissionConstant.DashboardPermissions.PURCHASE_DASHBOARD
            },
            {
              name: PermissionConstant.DashboardPermissions.TREASURY_SALES_DASHBOARD
            },
            {
              name: PermissionConstant.DashboardPermissions.TREASURY_PURCHASE_DASHBOARD
            },
            {
              name: PermissionConstant.DashboardPermissions.GARAGE_DASHBOARD
            }
      ],
    },
    {
      title: true,
      name: 'MODULES',
      children: undefined,
      role: [
        {
          name: RoleConfigConstant.AllowAnonymousConfig,
        },
        {
          name: RoleConfigConstant.NotControlledConfig,
        },
      ],
    },
    {
      name: 'TIMESHEET',
      url: 'rh/timesheet',
      icon: 'fa fa-calendar-plus-o',
      role: [
        {
          name: PermissionConstant.RHAndPaiePermissions.LIST_TIMESHEET,
        }
      ],
    },
    {
      name: 'LEAVE',
      url: 'payroll/leave',
      icon: 'fa fa-plane',
      role: [
        {
          name: PermissionConstant.RHAndPaiePermissions.LIST_LEAVE,
        }
      ],
    },
    {
      name: 'EXPENSE_REPORT',
      url: 'payroll/expenseReport',
      icon: 'fa fa-money',
      role: [
        {
          name: PermissionConstant.RHAndPaiePermissions.LIST_EXPENSEREPORT,
        }
      ],
    },
    {
      name: 'DOCUMENT',
      url: 'payroll/document',
      icon: 'fa fa-file-word-o',
      role: [
        {
          name: PermissionConstant.RHAndPaiePermissions.LIST_DOCUMENTREQUEST,
        }
      ],
    },
    {
      name: 'SHARED_DOCUMENT',
      url: 'rh/sharedDocument',
      icon: 'fa fa-share-square-o',
      role: [
        {
          name: PermissionConstant.RHAndPaiePermissions.LIST_SHAREDDOCUMENT,
        },
        {
          name: PermissionConstant.RHAndPaiePermissions.LIST_OWNED_SHARED_DOCUMENT,
        }
      ],
    },
    {
      name: 'ANNUAL_INTERVIEWS',
      url: 'rh/review',
      icon: 'fa fa-exchange',
      role: [
        {
          name: PermissionConstant.RHAndPaiePermissions.LIST_INTERVIEW,
        }
      ],
    },
    {
      name: 'ORGANIZATIONAL',
      url: 'payroll/employee/organizationChart',
      icon: 'fa fa-sitemap',
      role: [
        {
          name: RoleConfigConstant.ConsultantConfig,
        },
        {
          name: 'PAYROLL',
        },
      ],
    }
  ];
}
