
import { TierCategoryComponent } from './tier-category/list-tier-category/tier-category.component';
import { TierCategoryAddComponent } from './tier-category/add-tier-category/TierCategoryAdd.component';
import { Routes } from '@angular/router';
import { InvoiceComponent } from './invoice/invoice-add/invoice.component';
import { InvoiceListComponent } from './invoice/invoice-list/invoice-list.component';
import { DeliveryFormsListComponent } from './delivery-forms/delivery-forms-list/delivery-forms-list.component';
import { DeliveryFormsAddComponent } from './delivery-forms/delivery-forms-add/delivery-forms-add.component';
import { ListCustomerComponent } from './customer/list-customer/list-customer.component';
import { AddCustomerComponent } from './customer/add-customer/add-customer.component';
import { AssetListComponent } from './asset/asset-list/asset-list.component';
import { AssetAddComponent } from './asset/asset-add/asset-add.component';
import { PriceListComponent } from './price/price-list/price-list.component';
import { SalesOrderListComponent } from './sales-order/sales-order-list/sales-order-list.component';
import { SalesOrderAddComponent } from './sales-order/sales-order-add/sales-order-add.component';
import { PriceAddComponent } from './price/price-add/price-add.component';
import { QuotationSalesListComponent } from './quotation/quotation-sales-list/quotation-sales-list.component';
import { QuotationSalesAddComponent } from './quotation/quotation-sales-add/quotation-sales-add.component';
import { ReportingInUrlComponent } from '../shared/components/reports/reporting-in-url/reporting-in-url.component';
import { BillingSessionEmployeesComponent } from './billing-session/billing-session-employees/billing-session-employees.component';
// tslint:disable-next-line:max-line-length
import { ListDailySalesInventoryMovementComponent } from './components/list-daily-sales-inventory-movement/list-daily-sales-inventory-movement.component';
import { ListProjectComponent } from './project/list-project/list-project.component';
import { AddProjectComponent } from './project/add-project/add-project.component';
import { ValidateCraComponent } from './billing-session/validate-cra/validate-cra.component';
import { DocumentsGeneratedListComponent } from './billing-session/documents-generated-list/documents-generated-list.component';
import { RoleConfigConstant } from '../Structure/_roleConfigConstant';
import { SearchItemListComponent } from './search-item/search-item-list/search-item-list.component';
import { StarkPermissionsGuard } from '../stark-permissions/stark-permissions.module';
import { SearchItemAddComponent } from './search-item/search-item-add/search-item-add.component';
import { TermBillingListComponent } from '../shared/components/document/term-billing-list/term-billing-list.component';
import { ListInvoiceAssetsComponent } from './invoice-asset/list-invoice-assets/list-invoice-assets.component';
import { InvoiceAssetsComponent } from './invoice-asset/invoice-assets/invoice-assets.component';
import { ListBillingSessionComponent } from './billing-session/list-billing-session/list-billing-session.component';
import { TiersResolverService } from '../purchase/resolvers/tiers-resolver.service';
import { CanDeactivateGuard } from '../shared/services/can-deactivate-guard.service';
import { ProfileTierComponent } from '../shared/components/profile-tier/profile-tier.component';
import { CustomerResolverService } from './resolvers/customer-resolver.service';
import { PermissionConstant } from '../Structure/permission-constant';
import { CounterSalesComponent } from './counter-sales/counter-sales/counter-sales.component';
import { AddSalesPriceComponent } from './sales-price/add-sales-price/add-sales-price.component';
import { ListSalesPriceComponent } from './sales-price/list-sales-price/list-sales-price.component';



const redirectToDashboardRoute = '/main/dashboard';

export const routes: Routes = [
  {
    path: '',
    canActivateChild: [StarkPermissionsGuard],
    children: [
      {
        path: 'customer',
        data: {
          permissions: {
            only: [PermissionConstant.CommercialPermissions.LIST_CUSTOMER, PermissionConstant.CommercialPermissions.SHOW_CUSTOMER,
              PermissionConstant.CommercialPermissions.UPDATE_CUSTOMER],
            redirectTo: redirectToDashboardRoute
          }
        },
        children: [
          {
            path: '',
            component: ListCustomerComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.LIST_CUSTOMER],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'AdvancedAdd',
            component: AddCustomerComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.ADD_CUSTOMER],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'AdvancedEdit/:id',
            component: AddCustomerComponent,
            canDeactivate: [CanDeactivateGuard],
            resolve: { tiersToUpdate: TiersResolverService },
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.SHOW_CUSTOMER, PermissionConstant.CommercialPermissions.UPDATE_CUSTOMER],
                redirectTo: redirectToDashboardRoute
              }
            },
          }
          ,
          {
            path: 'profile/:id',
            component: ProfileTierComponent,
            canDeactivate: [CanDeactivateGuard],
            resolve: {
              tiersId: CustomerResolverService,
              tiersToUpdate: TiersResolverService
            },
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.SHOW_CUSTOMER, PermissionConstant.CommercialPermissions.UPDATE_CUSTOMER],
                redirectTo: redirectToDashboardRoute
              }
            },
          }
        ]
      },
      {
        path: 'invoice',
        data: {
          permissions: {
            only: [PermissionConstant.CommercialPermissions.LIST_INVOICE_SALES,
              PermissionConstant.CommercialPermissions.UPDATE_INVOICE_SALES, PermissionConstant.CommercialPermissions.SHOW_INVOICE_SALES],
            redirectTo: redirectToDashboardRoute
          }
        },
        children: [
          {
            path: '',
            component: InvoiceListComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.LIST_INVOICE_SALES],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'add',
            component: InvoiceComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.ADD_INVOICE_SALES],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'edit/:id/:status',
            component: InvoiceComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.UPDATE_INVOICE_SALES,
                  PermissionConstant.CommercialPermissions.SHOW_INVOICE_SALES,
                  PermissionConstant.CommercialPermissions.ADD_INVOICE_SALES],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'show/:id/:status',
            component: InvoiceComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.SHOW_INVOICE_SALES,
                  PermissionConstant.CommercialPermissions.ADD_INVOICE_SALES,
                  PermissionConstant.CommercialPermissions.UPDATE_INVOICE_SALES],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'report/:id/:reportname',
            component: ReportingInUrlComponent,
            data: {
              title: ''
            }
          }
        ]
      },
      {
        path: 'delivery',
        data: {
          permissions: {
            only: [PermissionConstant.CommercialPermissions.LIST_DELIVERY_SALES,
              PermissionConstant.CommercialPermissions.UPDATE_DELIVERY_SALES, PermissionConstant.CommercialPermissions.SHOW_DELIVERY_SALES,
              PermissionConstant.CommercialPermissions.ADD_DELIVERY_SALES],
            redirectTo: redirectToDashboardRoute
          }
        },
        children: [
          {
            path: '',
            component: DeliveryFormsListComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.LIST_DELIVERY_SALES],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'client/:idClient',
            component: DeliveryFormsListComponent,
            data: {
              permissions: {
                only: [RoleConfigConstant.SalesConfig, RoleConfigConstant.LIST.SALESDELIVERY],
                redirectTo: redirectToDashboardRoute
              },
            }
          },
          {
            path: 'add',
            component: DeliveryFormsAddComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.ADD_DELIVERY_SALES],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'new',
            component: DeliveryFormsAddComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.ADD_DELIVERY_SALES],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'edit/:id/:status',
            component: DeliveryFormsAddComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.UPDATE_DELIVERY_SALES,
                  PermissionConstant.CommercialPermissions.SHOW_DELIVERY_SALES, PermissionConstant.CommercialPermissions.UPDATE_VALID_DELIVERY_SALES],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'show/:id/:status',
            component: DeliveryFormsAddComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.SHOW_DELIVERY_SALES, PermissionConstant.CommercialPermissions.UPDATE_VALID_DELIVERY_SALES,
                  PermissionConstant.CommercialPermissions.UPDATE_DELIVERY_SALES],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'report/:id/:reportname',
            component: ReportingInUrlComponent,
            data: {
              permissions: {
                only: [RoleConfigConstant.SalesConfig, RoleConfigConstant.SuperAdminConfig],
                redirectTo: redirectToDashboardRoute
              }
            },
          }
        ]
      },
      {
        path: 'invoiceasset',
        data: {
          permissions: {
            only: [PermissionConstant.CommercialPermissions.LIST_INVOICE_ASSET_SALES],
            redirectTo: redirectToDashboardRoute
          }
        },
        children: [
          {
            path: '',
            component: ListInvoiceAssetsComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.LIST_INVOICE_ASSET_SALES],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'add',
            component: InvoiceAssetsComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.ADD_INVOICE_ASSET_SALES],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'edit/:id/:status',
            component: InvoiceAssetsComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.UPDATE_INVOICE_ASSET_SALES,
                  PermissionConstant.CommercialPermissions.SHOW_INVOICE_ASSET_SALES],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'show/:id/:status',
            component: InvoiceAssetsComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.SHOW_INVOICE_ASSET_SALES,
                  PermissionConstant.CommercialPermissions.ADD_INVOICE_ASSET_SALES,
                  PermissionConstant.CommercialPermissions.UPDATE_INVOICE_ASSET_SALES],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'report/:id/:reportname',
            component: ReportingInUrlComponent,
            data: {
              permissions: {
                only: [RoleConfigConstant.SalesConfig, RoleConfigConstant.SuperAdminConfig],
                redirectTo: redirectToDashboardRoute
              }
            },
          }
        ]
      },
      {
        path: 'financialDocument',
        data: {
          permissions: {
            only: [PermissionConstant.CommercialPermissions.LIST_FINANCIAL_ASSET_SALES],
            redirectTo: redirectToDashboardRoute
          },
          assetFinancial: true
        },
        children: [
          {
            path: '',
            component: ListInvoiceAssetsComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.LIST_FINANCIAL_ASSET_SALES],
                redirectTo: redirectToDashboardRoute
              },
              assetFinancial: true
            },
          },
          {
            path: 'add',
            component: InvoiceAssetsComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.ADD_FINANCIAL_ASSET_SALES],
                redirectTo: redirectToDashboardRoute
              },
              assetFinancial: true
            },
          },
          {
            path: 'edit/:id/:status',
            component: InvoiceAssetsComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.UPDATE_FINANCIAL_ASSET_SALES,
                  PermissionConstant.CommercialPermissions.SHOW_FINANCIAL_ASSET_SALES],
                redirectTo: redirectToDashboardRoute
              },
              assetFinancial: true
            },
          },
          {
            path: 'show/:id/:status',
            component: InvoiceAssetsComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.SHOW_FINANCIAL_ASSET_SALES,
                  PermissionConstant.CommercialPermissions.ADD_FINANCIAL_ASSET_SALES,
                  PermissionConstant.CommercialPermissions.UPDATE_FINANCIAL_ASSET_SALES],
                redirectTo: redirectToDashboardRoute
              },
              assetFinancial: true
            },
          },
          {
            path: 'report/:id/:reportname',
            component: ReportingInUrlComponent,
            data: {
              permissions: {
                only: [RoleConfigConstant.SalesConfig, RoleConfigConstant.SuperAdminConfig],
                redirectTo: redirectToDashboardRoute
              }
            },
          }
        ]
      },
      {
        path: 'asset',
        data: {
          permissions: {
            only: [PermissionConstant.CommercialPermissions.LIST_ASSET_SALES, PermissionConstant.CommercialPermissions.ADD_ASSET_SALES],
            redirectTo: redirectToDashboardRoute
          }
        },
        children: [
          {
            path: '',
            component: AssetListComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.LIST_ASSET_SALES],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'add',
            component: AssetAddComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.ADD_ASSET_SALES],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'new',
            component: AssetAddComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.ADD_ASSET_SALES],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'edit/:id/:status',
            component: AssetAddComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.UPDATE_ASSET_SALES,
                  PermissionConstant.CommercialPermissions.SHOW_ASSET_SALES],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'show/:id/:status',
            component: AssetAddComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.SHOW_ASSET_SALES,
                  PermissionConstant.CommercialPermissions.ADD_ASSET_SALES,
                  PermissionConstant.CommercialPermissions.UPDATE_ASSET_SALES,
                  PermissionConstant.CommercialPermissions.UPDATE_VALID_ASSET_SALES],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'report/:id/:reportname',
            component: ReportingInUrlComponent,
            data: {
              permissions: {
                only: [RoleConfigConstant.SalesConfig, RoleConfigConstant.SuperAdminConfig],
                redirectTo: redirectToDashboardRoute
              }
            },
          }
        ]
      },
      {
        path: 'price',
        data: {
          permissions: {
            only: [PermissionConstant.SettingsCommercialPermissions.LIST_PRICES],
            redirectTo: redirectToDashboardRoute
          }
        },
        children: [
          {
            path: '',
            component: PriceListComponent,
            data: {
              permissions: {
                only: [PermissionConstant.SettingsCommercialPermissions.LIST_PRICES],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'AdvancedAdd',
            component: PriceAddComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [PermissionConstant.SettingsCommercialPermissions.ADD_PRICES],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'AdvancedEdit/:id',
            component: PriceAddComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [PermissionConstant.SettingsCommercialPermissions.UPDATE_PRICES,
                  PermissionConstant.SettingsCommercialPermissions.SHOW_PRICES],
                redirectTo: redirectToDashboardRoute
              }
            },
          }
        ]
      },
      {
        path: 'salesPrice',
        data: {
          permissions: {
            only: [PermissionConstant.SettingsCommercialPermissions.LIST_PRICECATEGORY],
            redirectTo: redirectToDashboardRoute
          }
        },
        children: [
          {
            path: '',
            component: ListSalesPriceComponent,
            data: {
              permissions: {
                only: [PermissionConstant.SettingsCommercialPermissions.LIST_PRICECATEGORY],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'AdvancedAdd',
            component: AddSalesPriceComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [PermissionConstant.SettingsCommercialPermissions.ADD_PRICECATEGORY],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'AdvancedEdit/:id',
            component: AddSalesPriceComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [PermissionConstant.SettingsCommercialPermissions.UPDATE_PRICECATEGORY],
                redirectTo: redirectToDashboardRoute
              }
            },
          }
        ]
      },
      {
        path: 'order',
        data: {
          permissions: {
            only: [PermissionConstant.CommercialPermissions.LIST_ORDER_SALES],
            redirectTo: redirectToDashboardRoute
          }
        },
        children: [
          {
            path: '',
            component: SalesOrderListComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.LIST_ORDER_SALES],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'add',
            component: SalesOrderAddComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.ADD_ORDER_SALES],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'edit/:id/:status',
            component: SalesOrderAddComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.UPDATE_ORDER_SALES, PermissionConstant.CommercialPermissions.SHOW_ORDER_SALES,
                  PermissionConstant.CommercialPermissions.UPDATE_VALID_ORDER_SALES],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'show/:id/:status',
            component: SalesOrderAddComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.SHOW_ORDER_SALES, PermissionConstant.CommercialPermissions.UPDATE_ORDER_SALES,
                  PermissionConstant.CommercialPermissions.UPDATE_VALID_ORDER_SALES],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'report/:id/:reportname',
            component: ReportingInUrlComponent,
            data: {
              permissions: {
                only: [RoleConfigConstant.SalesConfig, RoleConfigConstant.SuperAdminConfig],
                redirectTo: redirectToDashboardRoute
              }
            },
          }
        ]
      },
      {
        path: 'billingSession',
        data: {
          permissions: {
            only: [PermissionConstant.CommercialPermissions.LIST_BILLING_SESSION],
            redirectTo: redirectToDashboardRoute
          }
        },
        children: [
          {
            path: '',
            component: ListBillingSessionComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.LIST_BILLING_SESSION],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'add',
            component: BillingSessionEmployeesComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.ADD_BILLING_SESSION],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'add/:id/:isEnabled',
            component: BillingSessionEmployeesComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.UPDATE_BILLING_SESSION,
                  PermissionConstant.CommercialPermissions.SHOW_BILLING_SESSION,
                  PermissionConstant.CommercialPermissions.ADD_BILLING_SESSION],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'ValidateCRA/:id/:isEnabled',
            component: ValidateCraComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.UPDATE_BILLING_SESSION,
                  PermissionConstant.CommercialPermissions.SHOW_BILLING_SESSION,
                  PermissionConstant.CommercialPermissions.ADD_BILLING_SESSION],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'DocumentsGenerated/:id/:isEnabled',
            component: DocumentsGeneratedListComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.UPDATE_BILLING_SESSION,
                  PermissionConstant.CommercialPermissions.SHOW_BILLING_SESSION,
                  PermissionConstant.CommercialPermissions.ADD_BILLING_SESSION],
                redirectTo: redirectToDashboardRoute
              }
            },
          }
        ]
      },
      {
        path: 'quotation',
        data: {
          permissions: {
            only: [PermissionConstant.CommercialPermissions.LIST_QUOTATION_SALES,
              PermissionConstant.CommercialPermissions.ADD_QUOTATION_SALES],
            redirectTo: redirectToDashboardRoute
          }
        },
        children: [
          {
            path: '',
            component: QuotationSalesListComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.LIST_QUOTATION_SALES],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'add',
            component: QuotationSalesAddComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.ADD_QUOTATION_SALES],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'new',
            component: QuotationSalesAddComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.ADD_QUOTATION_SALES],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'edit/:id/:status',
            component: QuotationSalesAddComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.UPDATE_QUOTATION_SALES, PermissionConstant.CommercialPermissions.SHOW_QUOTATION_SALES],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'show/:id/:status',
            component: QuotationSalesAddComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.SHOW_QUOTATION_SALES, PermissionConstant.CommercialPermissions.UPDATE_QUOTATION_SALES],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'report/:id/:reportname',
            component: ReportingInUrlComponent,
            data: {
              permissions: {
                only: [RoleConfigConstant.SalesConfig, RoleConfigConstant.SuperAdminConfig],
                redirectTo: redirectToDashboardRoute
              }
            },
          }
        ]
      },
      {
        path: 'project',
        data: {
          permissions: {
            only: [PermissionConstant.CommercialPermissions.LIST_SERVICES_CONTRACT],
            redirectTo: redirectToDashboardRoute
          }
        },
        children: [
          {
            path: '',
            component: ListProjectComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.LIST_SERVICES_CONTRACT],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'add',
            component: AddProjectComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.ADD_SERVICES_CONTRACT],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'edit/:id',
            component: AddProjectComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.UPDATE_SERVICES_CONTRACT, PermissionConstant.CommercialPermissions.SHOW_SERVICES_CONTRACT],
                redirectTo: redirectToDashboardRoute
              }
            },
          }
        ]
      },
      {
        path: 'counterSales',
        data: {
          permissions: {
            only: [PermissionConstant.CommercialPermissions.COUNTER_SALES],
            redirectTo: redirectToDashboardRoute
          }
        },
        children: [
          {
            path: '',
            component: CounterSalesComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.COUNTER_SALES],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'show/:id',
            component: CounterSalesComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.COUNTER_SALES],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'show/idDocument/:id',
            component: CounterSalesComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.COUNTER_SALES],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
        ]
      },
      {
        path: 'searchItem',
        data: {
          permissions: {
            only: [PermissionConstant.CommercialPermissions.RESEARCH_HISTORY,
              PermissionConstant.CommercialPermissions.LIST_QUICK_SALES],
            redirectTo: redirectToDashboardRoute
          }
        },
        children: [
          {
            path: '',
            component: SearchItemAddComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.RESEARCH_HISTORY,
                  PermissionConstant.CommercialPermissions.LIST_QUICK_SALES],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'add',
            component: SearchItemAddComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.LIST_QUICK_SALES],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'new',
            component: SearchItemAddComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.LIST_QUICK_SALES],
                redirectTo: redirectToDashboardRoute
              }
            },
          }
        ]
      },
      {
        path: 'searchHistory',
        component: SearchItemListComponent,
        data: {
          permissions: {
            only: [PermissionConstant.CommercialPermissions.RESEARCH_HISTORY], redirectTo: redirectToDashboardRoute
          }
        },
      },
      {
        path: 'termbillinglist',
        component: TermBillingListComponent,
        data: {
          permissions: {
            only: [PermissionConstant.CommercialPermissions.SHOW_TERM_BILLING],
            redirectTo: redirectToDashboardRoute
          }
        },
      },
      {
        path: 'list-tier-categorys',
        data: {
          permissions: {
            only: [PermissionConstant.SettingsCommercialPermissions.LIST_TIER_CATEGORY],
            redirectTo: redirectToDashboardRoute
          }
        },
        children: [
          {
            path: '',
            component: TierCategoryComponent,
            data: {
              permissions: {
                only: [PermissionConstant.SettingsCommercialPermissions.LIST_TIER_CATEGORY],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'AdvancedAdd',
            component: TierCategoryAddComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              title: 'Ajout tier category',
              permissions: {
                only: [PermissionConstant.SettingsCommercialPermissions.ADD_TIER_CATEGORY],
                redirectTo: redirectToDashboardRoute
              },
              cardMode: true
            },
          },
          {
            path: 'AdvancedEdit/:id',
            component: TierCategoryAddComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              title: 'Edit tier category',
              permissions: {
                only: [PermissionConstant.SettingsCommercialPermissions.UPDATE_TIER_CATEGORY,
                  PermissionConstant.SettingsCommercialPermissions.SHOW_TIER_CATEGORY],
                redirectTo: redirectToDashboardRoute
              },
              cardMode: true
            },
          }
        ]
      }

    ]
  }
];
