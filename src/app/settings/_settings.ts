import {Injectable} from '@angular/core';
import { PermissionConstant } from '../Structure/permission-constant';
import {RoleConfigConstant} from '../Structure/_roleConfigConstant';

@Injectable()
export class AllSettings {
  public ALL_SETTINGS = [
    {
      menu: 'COMPANY',
      permission: [PermissionConstant.SettingsRHAndPaiePermissions.UPDATE_COMPANY,
        PermissionConstant.SettingsRHAndPaiePermissions.SHOW_COMPANY,
        PermissionConstant.SettingsRHAndPaiePermissions.LIST_COUNTRY,
        PermissionConstant.SettingsRHAndPaiePermissions.LIST_CITY,
        PermissionConstant.SettingsRHAndPaiePermissions.LIST_BANK,
        PermissionConstant.SettingsRHAndPaiePermissions.LIST_BANKACCOUNT,
        PermissionConstant.SettingsRHAndPaiePermissions.LIST_OFFICE,
        PermissionConstant.SettingsCommercialPermissions.LIST_CURRENCY,
        PermissionConstant.SettingsCommercialPermissions.LIST_TAX,
        PermissionConstant.SettingsCommercialPermissions.LIST_GROUP_TAX
    ],
      sub_menus: [
        {
          menu: 'PROFIL',
          url: 'administration/company',
          permission: [PermissionConstant.SettingsRHAndPaiePermissions.SHOW_COMPANY,
            PermissionConstant.SettingsRHAndPaiePermissions.UPDATE_COMPANY]
        },
        {
          menu: 'TAXE',
          url: 'administration/taxe',
          permission: [PermissionConstant.SettingsCommercialPermissions.LIST_TAX],
        },
        {
          menu: 'GROUP_TAXE',
          url: 'administration/group-taxe',
          permission: [PermissionConstant.SettingsCommercialPermissions.LIST_GROUP_TAX]
        },
        {
          menu: 'BANK',
          url: 'treasury/bankManagement/bank',
          permission: [PermissionConstant.SettingsRHAndPaiePermissions.LIST_BANK]
        },
        {
          menu: 'BANK_ACCOUNT',
          url: 'treasury/bankManagement/bankaccounts/fromSettings',
          permission: [PermissionConstant.SettingsRHAndPaiePermissions.LIST_BANKACCOUNT]
        },
        {
          menu: 'CURRENCY',
          url: 'administration/currency',
          permission: [PermissionConstant.SettingsCommercialPermissions.LIST_CURRENCY],
        },
        {
          menu: 'OFFICE',
          url: 'administration/office',
          permission: [PermissionConstant.SettingsRHAndPaiePermissions.LIST_OFFICE]
        },
        {
          menu: 'CITY',
          url: 'administration/city',
          permission: [PermissionConstant.SettingsRHAndPaiePermissions.LIST_CITY]
        },
        {
          menu: 'COUNTRY',
          url: 'administration/country',
          permission: [PermissionConstant.SettingsRHAndPaiePermissions.LIST_COUNTRY]
        },
        {
          menu: 'ABOUT',
          url: 'administration/version',
          permission: [PermissionConstant.SettingsRHAndPaiePermissions.SHOW_ABOUT]
        }
      ]
    },
    {
      menu: 'USERS',
      permission: [
        PermissionConstant.SettingsRHAndPaiePermissions.LIST_USER,
        PermissionConstant.SettingsRHAndPaiePermissions.LIST_GROUPUSERS,
        PermissionConstant.SettingsRHAndPaiePermissions.LIST_ROLE,
      ]
    ,
      sub_menus: [
        {
          menu: 'USER',
          url: 'administration/user',
          permission: [PermissionConstant.SettingsRHAndPaiePermissions.LIST_USER]
        },
        {
          menu: 'MASTER_USER',
          url: 'administration/masterUsers',
          permission: [PermissionConstant.SettingsRHAndPaiePermissions.LIST_GROUPUSERS]
        },
        {
          menu: 'ROLE',
          url: 'administration/role',
          permission: [PermissionConstant.SettingsRHAndPaiePermissions.LIST_ROLE]
        },
        {
          menu: 'PRIVILEGES',
          url: 'administration/privilege',
          permission: [RoleConfigConstant.PRIVILEGESCONFIG]
        }
      ]
    },
    {
      menu: 'SALE',
      permission: [PermissionConstant.SettingsCommercialPermissions.LIST_SETTLEMENTMODE,
        PermissionConstant.SettingsCommercialPermissions.LIST_PRICES,PermissionConstant.SettingsCommercialPermissions.LIST_PRICECATEGORY],
      sub_menus: [
        {
          menu: 'DISCOUNT',
          url: 'sales/price',
          permission: [PermissionConstant.SettingsCommercialPermissions.LIST_PRICES]
        },
        {
          menu: 'PAYMENT_METHOD',
          url: 'payment/settlementmode',
          permission: [PermissionConstant.SettingsCommercialPermissions.LIST_SETTLEMENTMODE]
        },
        {
          menu: 'PRICE_CATEGORY',
          url: 'sales/salesPrice',
          permission: [PermissionConstant.SettingsCommercialPermissions.LIST_PRICECATEGORY]
        },
        {
          menu: 'BILLING_METHOD',
          url: 'sales/list-tier-categorys',
          permission: [PermissionConstant.SettingsCommercialPermissions.LIST_TIER_CATEGORY]
        }
      ]
    },
    {
      menu: 'PURCHASE',
      permission: [PermissionConstant.SettingsCommercialPermissions.LIST_EXPENSE],
      sub_menus: [
        {
          menu: 'EXPENSES',
          url: 'inventory/list-expense-items',
          permission: [PermissionConstant.SettingsCommercialPermissions.LIST_EXPENSE]
        }
      ]
    },
    {
      menu: 'STOCK',
      permission: [PermissionConstant.SettingsCommercialPermissions.LIST_FAMILY,
        PermissionConstant.SettingsCommercialPermissions.LIST_MEASUREUNIT,
        PermissionConstant.SettingsCommercialPermissions.LIST_MODELOFITEM,
        PermissionConstant.SettingsCommercialPermissions.LIST_NATURE,
        PermissionConstant.SettingsCommercialPermissions.LIST_PRODUCTITEM,
        PermissionConstant.SettingsCommercialPermissions.LIST_SUBFAMILY,
        PermissionConstant.SettingsCommercialPermissions.LIST_SUBMODEL,
        PermissionConstant.SettingsCommercialPermissions.LIST_VEHICLEBRAND
    ],
      sub_menus: [
        {
          menu: 'PRODUCTS_TYPE',
          url: 'administration/nature',
          permission : [PermissionConstant.SettingsCommercialPermissions.LIST_NATURE]
        },
        {
          menu: 'Measure_Unit',
          url: 'inventory/list-Measure-Unit',
          permission : [PermissionConstant.SettingsCommercialPermissions.LIST_MEASUREUNIT]
        },
        {
          menu: 'FAMILIES',
          url: 'inventory/list-family',
          permission : [PermissionConstant.SettingsCommercialPermissions.LIST_FAMILY]
        },
        {
          menu: 'SUB_FAMILY',
          url: 'inventory/list-sub-family',
          permission : [PermissionConstant.SettingsCommercialPermissions.LIST_SUBFAMILY]
        },
        {
          menu: 'VEHICLES_BRANDS',
          url: 'inventory/list-brands',
          permission : [PermissionConstant.SettingsCommercialPermissions.LIST_VEHICLEBRAND]
        },
        {
          menu: 'PRODUCT_BRANDS',
          url: 'inventory/list-product-brand',
          permission : [PermissionConstant.SettingsCommercialPermissions.LIST_PRODUCTITEM]
        },
        {
          menu: 'MODELS',
          url: 'inventory/list-model',
          permission : [PermissionConstant.SettingsCommercialPermissions.LIST_MODELOFITEM]
        },
        {
          menu: 'SUB_MODELS',
          url: 'inventory/list-sub-models',
          permission : [PermissionConstant.SettingsCommercialPermissions.LIST_SUBMODEL]
        },
      ]
    },
    {
      menu: 'ACCOUNTING',
      permission: [PermissionConstant.SettingsAccountingPermissions.CHART_OF_ACCOUNTS,
        PermissionConstant.SettingsAccountingPermissions.JOURNALS,
        PermissionConstant.SettingsAccountingPermissions.ACCOUNTING_ACCOUNTS,
        PermissionConstant.SettingsAccountingPermissions.ACCOUNTING_TEMPLATE,
        PermissionConstant.SettingsAccountingPermissions.FISCAL_YEARS,
        PermissionConstant.SettingsAccountingPermissions.AMORTIZATION_OF_IMMOBILIZATIONS_SETTINGS,
        PermissionConstant.SettingsAccountingPermissions.ACCOUNTING_STANDARD_REPORTS,
        PermissionConstant.SettingsAccountingPermissions.FINANCIAL_ACCOUNTS_SETTINGS,
        PermissionConstant.SettingsAccountingPermissions.TIERS_ACCOUNTS_SETTINGS,
        PermissionConstant.SettingsAccountingPermissions.PAYMENTS_ACCOUNTS_SETTINGS,
        PermissionConstant.SettingsAccountingPermissions.AMORTIZATION_ACCOUNT_SETTINGS,
        PermissionConstant.SettingsAccountingPermissions.ACCOUNTING_JOURNAL_SETTINGS,
        PermissionConstant.SettingsAccountingPermissions.USER_ACCOUNTING_SETTINGS
      ],
      sub_menus: [
        {
          menu: 'CHART_OF_ACCOUNTS',
          url: '/main/settings/accounting/chartOfAccounts',
          permission: [PermissionConstant.SettingsAccountingPermissions.CHART_OF_ACCOUNTS],
        },
        {
          menu: 'JOURNAL',
          url: '/main/settings/accounting/journal',
          permission: [PermissionConstant.SettingsAccountingPermissions.JOURNALS],
        },
        {
          menu: 'ACCOUNT_ACCOUNTING',
          url: '/main/settings/accounting/account',
          permission: [PermissionConstant.SettingsAccountingPermissions.ACCOUNTING_ACCOUNTS],
        },
        {
          menu: 'TEMPLATE_ACCOUNTING',
          url: '/main/settings/accounting/template',
          permission: [PermissionConstant.SettingsAccountingPermissions.ACCOUNTING_TEMPLATE],
        },
        {
          menu: 'FISCAL_YEARS',
          url: '/main/settings/accounting/fiscalyear',
          permission: [PermissionConstant.SettingsAccountingPermissions.FISCAL_YEARS],
        },
        {
          menu: 'ACCOUNTING_IMMOBILIZATION',
          url: '/main/settings/accounting/amortizationConfiguration',
          permission: [PermissionConstant.SettingsAccountingPermissions.AMORTIZATION_OF_IMMOBILIZATIONS_SETTINGS],
        },
        {
          menu: 'REPORTINGS',
          url: '/main/settings/accounting/configuration/reports',
          permission: [PermissionConstant.SettingsAccountingPermissions.ACCOUNTING_STANDARD_REPORTS],
        },
        {
          menu: 'FINANCIAL_ACCOUNTS',
          url: '/main/settings/accounting/configuration/financialAccount',
          permission: [PermissionConstant.SettingsAccountingPermissions.FINANCIAL_ACCOUNTS_SETTINGS],
        },
        {
          menu: 'TIERS_ACCOUNTS',
          url: '/main/settings/accounting/configuration/tiersAccount',
          permission: [PermissionConstant.SettingsAccountingPermissions.TIERS_ACCOUNTS_SETTINGS],
        },
        {
          menu: 'PAYMENTS_ACCOUNTS',
          url: '/main/settings/accounting/configuration/paymentsAccount',
          permission: [PermissionConstant.SettingsAccountingPermissions.PAYMENTS_ACCOUNTS_SETTINGS],
        },
        {
          menu: 'AMORTIZATION_ACCOUNT',
          url: '/main/settings/accounting/configuration/amortizationAccount',
          permission: [PermissionConstant.SettingsAccountingPermissions.AMORTIZATION_ACCOUNT_SETTINGS],
        },
        {
          menu: 'ACCOUNTING_JOURNAL_SETTINGS',
          url: '/main/settings/accounting/configuration/journals',
          permission: [PermissionConstant.SettingsAccountingPermissions.ACCOUNTING_JOURNAL_SETTINGS],
        },
        {
          menu: 'USER_PARAMETERS',
          url: '/main/settings/accounting/configuration/userConfiguration',
          permission: [PermissionConstant.SettingsAccountingPermissions.USER_ACCOUNTING_SETTINGS],
        }
      ]
    },
    {
      menu: 'TREASURY',
      permission: [PermissionConstant.SettingsTreasuryPermissions.LIST_WITHHOLDING_TAX_TREASURY,
        PermissionConstant.SettingsTreasuryPermissions.SHOW_WITHHOLDING_TAX_TREASURY
    ],
      sub_menus: [
        {
          menu: 'HOLDING_TAX',
          url: 'treasury/withholdingTaxConfiguration',
          permission: [PermissionConstant.SettingsTreasuryPermissions.LIST_WITHHOLDING_TAX_TREASURY,
            PermissionConstant.SettingsTreasuryPermissions.SHOW_WITHHOLDING_TAX_TREASURY
        ]
        }
      ]
    },
    {
      menu: 'GARAGE',
      permission: [
        PermissionConstant.SettingsGaragePermissions.LIST_WORKER,
        PermissionConstant.SettingsGaragePermissions.LIST_UNIT,
        PermissionConstant.SettingsGaragePermissions.LIST_OPERATIONTYPE,
        PermissionConstant.SettingsGaragePermissions.LIST_OPERATION,
        PermissionConstant.SettingsGaragePermissions.LIST_OPERATION_PROPOSED,
        PermissionConstant.SettingsGaragePermissions.LIST_OPERATIONKIT,
        PermissionConstant.SettingsGaragePermissions.LIST_MACHINE,
        PermissionConstant.SettingsGaragePermissions.LIST_GARAGE,
        PermissionConstant.SettingsGaragePermissions.LIST_VEHICLE_BRAND,
        PermissionConstant.SettingsGaragePermissions.LIST_VEHICLEMODEL,
      ],
      sub_menus: [
        {
          menu: 'WORKERS',
          url: 'garage/workers',
          permission: [PermissionConstant.SettingsGaragePermissions.LIST_WORKER]
        },
        {
          menu: 'UNIT',
          url: 'garage/unit',
          permission: [PermissionConstant.SettingsGaragePermissions.LIST_UNIT]
        },
        {
          menu: 'TYPE_OF_OPERATION',
          url: 'garage/operation-type',
          permission: [PermissionConstant.SettingsGaragePermissions.LIST_OPERATIONTYPE]
        },
        {
          menu: 'OPERATIONS',
          url: 'garage/operation',
          permission: [PermissionConstant.SettingsGaragePermissions.LIST_OPERATION]
        },
        {
          menu: 'OPERATIONS_PROPOSED',
          url: 'garage/program',
          permission: [PermissionConstant.SettingsGaragePermissions.LIST_OPERATION_PROPOSED]
        },
        {
          menu: 'OPERATIONS_KIT',
          url: 'garage/kit',
          permission: [PermissionConstant.SettingsGaragePermissions.LIST_OPERATIONKIT]
        },
        {
          menu: 'MACHINES',
          url: 'garage/machine',
          permission: [PermissionConstant.SettingsGaragePermissions.LIST_MACHINE]
        },
        {
          menu: 'GARAGE',
          url: 'garage/garage',
          permission: [PermissionConstant.SettingsGaragePermissions.LIST_GARAGE]
        },
        {
          menu: 'VEHICLES_BRANDS',
          url: 'garage/brands',
          permission: [PermissionConstant.SettingsGaragePermissions.LIST_VEHICLE_BRAND]
        },
        {
          menu: 'VEHICLES_MODELS',
          url: 'garage/models',
          permission: [PermissionConstant.SettingsGaragePermissions.LIST_VEHICLEMODEL]
        },
        // {
        //   menu: 'CALIBRATION',
        //   url: 'garage/calibration'
        // }
      ]
    },
    {
      menu: 'PAY',
      permission: [ PermissionConstant.SettingsRHAndPaiePermissions.LIST_BENEFITINKIND,
        PermissionConstant.SettingsRHAndPaiePermissions.LIST_BONUS,
        PermissionConstant.SettingsRHAndPaiePermissions.LIST_CNSS,
        PermissionConstant.SettingsRHAndPaiePermissions.LIST_SALARYRULE,
        PermissionConstant.SettingsRHAndPaiePermissions.LIST_VARIABLE,
        PermissionConstant.SettingsRHAndPaiePermissions.LIST_SALARYSTRUCTURE,
        PermissionConstant.SettingsRHAndPaiePermissions.LIST_ADDITIONAL_HOUR
    ],
      sub_menus: [
        {
          menu: 'BENEFIT_IN_KIND',
          url: 'payroll/benefitInKind',
          permission: [PermissionConstant.SettingsRHAndPaiePermissions.LIST_BENEFITINKIND]
        },
        {
          menu: 'BONUSES',
          url: 'payroll/bonus',
          permission: [PermissionConstant.SettingsRHAndPaiePermissions.LIST_BONUS]
        },
        {
          menu: 'CNSS_TYPE',
          url: 'payroll/cnss',
          permission: [PermissionConstant.SettingsRHAndPaiePermissions.LIST_CNSS]
        },
        {
          menu: 'SALARY_RULE',
          url: 'payroll/salaryRule',
          permission: [PermissionConstant.SettingsRHAndPaiePermissions.LIST_SALARYRULE]
        },
        {
          menu: 'VARIABLE',
          url: 'payroll/variable',
          permission: [PermissionConstant.SettingsRHAndPaiePermissions.LIST_VARIABLE]
        },
        {
          menu: 'SALARY_STRUCTURE',
          url: 'payroll/salaryStructure',
          permission: [PermissionConstant.SettingsRHAndPaiePermissions.LIST_SALARYSTRUCTURE]
        },
        {
          menu: 'ADDITIONAL_HOUR',
          url: 'payroll/additionalHour',
          permission: [PermissionConstant.SettingsRHAndPaiePermissions.LIST_ADDITIONAL_HOUR]
        }
      ]
    },
    {
      menu: 'HR',
      permission: [ PermissionConstant.SettingsRHAndPaiePermissions.LIST_SKILLS,
        PermissionConstant.SettingsRHAndPaiePermissions.LIST_GRADE,
        PermissionConstant.SettingsRHAndPaiePermissions.LIST_JOB,
        PermissionConstant.SettingsRHAndPaiePermissions.LIST_CONTRACTTYPE,
        PermissionConstant.SettingsRHAndPaiePermissions.LIST_LEAVETYPE,
        PermissionConstant.SettingsRHAndPaiePermissions.LIST_QUALIFICATIONTYPE,
        PermissionConstant.SettingsRHAndPaiePermissions.LIST_EXPENSEREPORTDETAILSTYPE,
        PermissionConstant.SettingsRHAndPaiePermissions.LIST_EVALUATIONCRITERIATHEME,
        PermissionConstant.SettingsRHAndPaiePermissions.LIST_INTERVIEWTYPE,
        PermissionConstant.SettingsRHAndPaiePermissions.LIST_EXITREASON,
        PermissionConstant.SettingsRHAndPaiePermissions.SHOW_GENERALSETTINGS,
        PermissionConstant.SettingsRHAndPaiePermissions.SHOW_JOBSPARAMETERS,
        PermissionConstant.SettingsRHAndPaiePermissions.LIST_PERIOD,
        PermissionConstant.SettingsRHAndPaiePermissions.LIST_LANGUAGE,
        PermissionConstant.SettingsRHAndPaiePermissions.UPDATE_GENERALSETTINGS,
        PermissionConstant.SettingsRHAndPaiePermissions.UPDATE_JOBSPARAMETERS
    ],
      sub_menus: [
        {
          menu: 'PERIOD',
          url: 'administration/period',
          permission: [PermissionConstant.SettingsRHAndPaiePermissions.LIST_PERIOD]
        },
        {
          menu: 'LANGUAGE',
          url: 'administration/language',
          permission: [PermissionConstant.SettingsRHAndPaiePermissions.LIST_LANGUAGE]
        },
        {
          menu: 'SKILLS',
          url: '/main/settings/payroll/skills',
          permission: [PermissionConstant.SettingsRHAndPaiePermissions.LIST_SKILLS]
        },
        {
          menu: 'GRADE',
          url: '/main/settings/payroll/grade',
          permission: [PermissionConstant.SettingsRHAndPaiePermissions.LIST_GRADE]
        },
        {
          menu: 'JOB',
          url: '/main/settings/payroll/job',
          permission: [PermissionConstant.SettingsRHAndPaiePermissions.LIST_JOB]
        },
        {
          menu: 'CONTRACT_TYPE',
          url: '/main/settings/payroll/contract-type',
          permission: [PermissionConstant.SettingsRHAndPaiePermissions.LIST_CONTRACTTYPE]
        },
        {
          menu: 'LEAVE_TYPE',
          url: '/main/settings/payroll/leave-type',
          permission: [PermissionConstant.SettingsRHAndPaiePermissions.LIST_LEAVETYPE]
        },
        {
          menu: 'EXPENSE_REPORT_TYPE',
          url: '/main/settings/payroll/expense-report-type',
          permission: [PermissionConstant.SettingsRHAndPaiePermissions.LIST_EXPENSEREPORTDETAILSTYPE]
        },
        {
          menu: 'EVALUATION_CRITERIA',
          url: '/main/settings/rh/evaluation-criteria',
          permission: [PermissionConstant.SettingsRHAndPaiePermissions.LIST_EVALUATIONCRITERIATHEME]
        },
        {
          menu: 'QUALIFICATION_TYPE',
          url: '/main/settings/payroll/qualification-type',
          permission: [PermissionConstant.SettingsRHAndPaiePermissions.LIST_QUALIFICATIONTYPE]
        },
        {
          menu: 'NAME_EXIT_REASON',
          url: '/main/settings/payroll/exit-reason',
          permission: [PermissionConstant.SettingsRHAndPaiePermissions.LIST_EXITREASON]
        },
        {
          menu: 'INTERVIEW_TYPE',
          url: '/main/settings/rh/interview-type',
          permission: [PermissionConstant.SettingsRHAndPaiePermissions.LIST_INTERVIEWTYPE]
        },
        {
          menu: 'REVIEW_MANAGER',
          url: '/main/settings/rh/review/manager',
          permission: [PermissionConstant.SettingsRHAndPaiePermissions.SHOW_GENERALSETTINGS,
                       PermissionConstant.SettingsRHAndPaiePermissions.UPDATE_GENERALSETTINGS]
        },
        {
          menu: 'ANNUAL_REVIEW',
          url: '/main/settings/rh/review/notification',
          permission: [PermissionConstant.SettingsRHAndPaiePermissions.SHOW_JOBSPARAMETERS,
            PermissionConstant.SettingsRHAndPaiePermissions.UPDATE_JOBSPARAMETERS]
        }
      ]
    },
    {
      menu: 'ECOMMERCE',
      permission: [RoleConfigConstant.EcommerceConfig],
      sub_menus: [
        {
          menu: 'DELIVERY',
          url: '/main/settings/ecommerce/delivery'
        }
      ]
    },
    {
      menu: 'CRM',
      permission: [RoleConfigConstant.CRMSettings],
      sub_menus: [
        {
          menu: 'OBJECTIF',
          url: '/main/settings/crm/category',
          permission: [PermissionConstant.CRMPermissions.VIEW_CATEGORY]
        },
        {
          menu: 'STATUS_OBJECTIFS',
          url: '/main/settings/crm/status',
          permission: [PermissionConstant.CRMPermissions.STATUS_OF_CATEGORIES]
        },
        {
          menu: 'PIPELINE',
          url: '/main/settings/crm/pipeline',
          permission: [PermissionConstant.CRMPermissions.PIPELINE]
        },
        {
          menu: 'DROPDOWNS',
          url: '/main/settings/crm/dropdowns',
          permission: [PermissionConstant.CRMPermissions.PIPELINE]
        }
      ]
    },
    {
      menu: 'MANUFACTURING',
      permission: [
        PermissionConstant.MANUFATORINGPermissions.FABRICATIONCONFIG,
        PermissionConstant.MANUFATORINGPermissions.AREA_PERMISSION,
        PermissionConstant.MANUFATORINGPermissions.SECTION_PERMISSION,
        PermissionConstant.MANUFATORINGPermissions.MANUFACTURING_MACHINES_PERMISSION
],
      sub_menus: [
        {
          menu: 'AREA',
          url: '/main/settings/manufacturing/area',
          permission: [PermissionConstant.MANUFATORINGPermissions.AREA_PERMISSION]
        },
        {
          menu: 'MACHINE',
          url: '/main/settings/manufacturing/machine',
          permission: [PermissionConstant.MANUFATORINGPermissions.MANUFACTURING_MACHINES_PERMISSION]
        },
        {
          menu: 'OPERATION',
          url: '/main/settings/manufacturing/operation',
          permission: [PermissionConstant.MANUFATORINGPermissions.FABRICATION_PERMISSION]
        }
      ]
    },
    {
      menu: 'Mailing',
      permission: [RoleConfigConstant.MailingSettings],
      sub_menus: [
        {
          menu: 'TEMPLATE_EMAIL',
          url: '/main/settings/mailing/templateEmail'
        },
        {
          menu: 'SERVER_SETTINGS',
          url: '/main/settings/mailing/settings'
        },
        {
          menu: 'USER_SETTINGS',
          url: '/main/settings/mailing/settingsUser/listUsercredentials'
        }
      ]
    }
  ];
}
