import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListSupplierComponent } from './supplier/list-supplier/list-supplier.component';
import { AddOrderProjectComponent } from './add-order-project/add-order-project.component';
import { PurchaseOrderAddComponent } from './purchase-order/purchase-order-add/purchase-order-add.component';
import { PurchaseOrderListComponent } from './purchase-order/purchase-order-list/purchase-order-list.component';
import { AddDevisComponent } from './devis/add-devis/add-devis.component';
import { PurchaseAssetListComponent } from './purchase-asset/purchase-asset-list/purchase-asset-list.component';
import { PurchaseAssetAddComponent } from './purchase-asset/purchase-asset-add/purchase-asset-add.component';
import { PurchaseInvoiceListComponent } from './purchase-invoice/purchase-invoice-list/purchase-invoice-list.component';
import { PurchaseInvoiceAddComponent } from './purchase-invoice/purchase-invoice-add/purchase-invoice-add.component';
import { PurchaseDeliveryListComponent } from './purchase-delivery/purchase-delivery-list/purchase-delivery-list.component';
import { PurchaseDeliveryAddComponent } from './purchase-delivery/purchase-delivery-add/purchase-delivery-add.component';
import { PriceRequestListComponent } from './price-request/price-request-list/price-request-list.component';
import { PriceRequestAddComponent } from './price-request/price-request-add/price-request-add.component';
import { PurchaseRequestAddComponent } from './purchase-request/purshase-request-add/purchase-request-add.component';
import { ReportingInModalComponent } from '../shared/components/reports/reporting-in-modal/reporting-in-modal.component';
import { ProvisioningListComponent } from '../provisioning-list/provisioning-list.component';
import { PurchaseFinalOrderListComponent } from './purchase-final-order/purchase-final-order-list/purchase-final-order-list.component';
import { PurchaseFinalOrderAddComponent } from './purchase-final-order/purchase-final-order-add/purchase-final-order-add.component';
import { StarkPermissionsGuard } from '../stark-permissions/stark-permissions.module';
import { RoleConfigConstant } from '../Structure/_roleConfigConstant';
import { SharedConstant } from '../constant/shared/shared.constant';
import { FetchProductsComponent } from '../inventory/components/fetch-products/fetch-products.component';
import { AddproductComponent } from '../shared/components/item/add-item/add-product.component';
import { DetailsProductComponent } from '../shared/components/item/details-product/details-product.component';
import { PurchaseBalanceComponent } from './purchase-balance/purchase-balance.component';
import { CanDeactivateGuard } from '../shared/services/can-deactivate-guard.service';
import { AddTiersComponent } from '../shared/components/add-tiers/add-tiers.component';
import { SupplierResolverService } from './resolvers/supplier-resolver.service';
import { TiersResolverService } from './resolvers/tiers-resolver.service';
import { ProfileTierComponent } from '../shared/components/profile-tier/profile-tier.component';
import { PurchaseRequestListGridComponent } from './components/purchase-request-list-grid/purchase-request-list-grid.component';
import { TiersAccountsResolverService } from '../accounting/resolver/tiers-accounts-resolver.service';
import { PermissionConstant } from '../Structure/permission-constant';

const routes: Routes = [
  {
    path: '',
    canActivateChild: [StarkPermissionsGuard],
    children: [
      {
        path: 'orderProject',
        data: {
          permissions: {
            only: [PermissionConstant.CommercialPermissions.LIST_PROVISIONING],
            redirectTo: SharedConstant.DASHBOARD_URL
          }
        },
        children: [
          {
            path: '',
            component: ProvisioningListComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.LIST_PROVISIONING],
                redirectTo: SharedConstant.DASHBOARD_URL
              }
            },
          },
          {
            path: 'addProvision',
            component: AddOrderProjectComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.ADD_PROVISIONING],
                redirectTo: SharedConstant.DASHBOARD_URL
              }
            },
          },
          {
            path: 'editProvision/:id',
            component: AddOrderProjectComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.UPDATE_PROVISIONING,PermissionConstant.CommercialPermissions.SHOW_PROVISIONING],
                redirectTo: SharedConstant.DASHBOARD_URL
              }
            },
          },
        ]
      },
      {
        path: 'suppliers',
        data: {
          permissions: {
            only: [PermissionConstant.CommercialPermissions.LIST_SUPPLIER],
            redirectTo: SharedConstant.DASHBOARD_URL
          }
        },
        children: [
          {
            path: '',
            component: ListSupplierComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.LIST_SUPPLIER],
                redirectTo: SharedConstant.DASHBOARD_URL
              }
            },
          },
          {
            path: 'AdvancedAdd',
            component: AddTiersComponent,
            canDeactivate: [CanDeactivateGuard],
            resolve: { supplierTypeId: SupplierResolverService },
            data: {
              title: 'Ajout avancé',
              permissions: {
                only: [PermissionConstant.CommercialPermissions.ADD_SUPPLIER],
                redirectTo: SharedConstant.DASHBOARD_URL
              }
            },
          },
          {
            path: 'AdvancedEdit/:id',
            component: AddTiersComponent,
            canDeactivate: [CanDeactivateGuard],
            resolve: {
              supplierTypeId: SupplierResolverService,
              tiersToUpdate: TiersResolverService
            },
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.UPDATE_SUPPLIER
                  ,PermissionConstant.CommercialPermissions.SHOW_SUPPLIER],
                redirectTo: SharedConstant.DASHBOARD_URL
              }
            },
          },
          {
            path: 'profile/:id',
            component: ProfileTierComponent,
            canDeactivate: [CanDeactivateGuard],
            resolve: {
              tiersId: SupplierResolverService,
              tiersToUpdate: TiersResolverService
            },
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.UPDATE_SUPPLIER,PermissionConstant.CommercialPermissions.DELETE_SUPPLIER
                  ,PermissionConstant.CommercialPermissions.SHOW_SUPPLIER],
                redirectTo: SharedConstant.DASHBOARD_URL
              }
            },
          }
        ]
      },
      {
        path: 'purchaserequest',
        data: {
          permissions: {
            only: [PermissionConstant.CommercialPermissions.LIST_PURCHASE_REQUEST],
            redirectTo: SharedConstant.DASHBOARD_URL
          }
        },
        children: [
          {
            path: '',
            component: PurchaseRequestListGridComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.LIST_PURCHASE_REQUEST],
                redirectTo: SharedConstant.DASHBOARD_URL
              }
            },
          },
          {
            path: 'add',
            component: PurchaseRequestAddComponent,
            data: {
              action: 'add',
              permissions: {
                only: [PermissionConstant.CommercialPermissions.ADD_PURCHASE_REQUEST],
                redirectTo: SharedConstant.DASHBOARD_URL
              }
            },
          },
          {
            path: 'edit/:id',
            component: PurchaseRequestAddComponent,
            data: {
              action: 'update',
              permissions: {
                only: [PermissionConstant.CommercialPermissions.UPDATE_PURCHASE_REQUEST,
                  PermissionConstant.CommercialPermissions.SHOW_PURCHASE_REQUEST],
                redirectTo: SharedConstant.DASHBOARD_URL
              }
            },
          },
          {
            path: 'show/:id',
            component: PurchaseRequestAddComponent,
            data: {
              action: 'show',
              title: 'Consulter demande d\'achat',
              permissions: {
                only: [PermissionConstant.CommercialPermissions.ADD_PURCHASE_REQUEST, PermissionConstant.CommercialPermissions.UPDATE_PURCHASE_REQUEST,
                PermissionConstant.CommercialPermissions.SHOW_PURCHASE_REQUEST, PermissionConstant.CommercialPermissions.VALIDATE_PURCHASE_REQUEST, 
              PermissionConstant.CommercialPermissions.REFUSE_PURCHASE_REQUEST],
                redirectTo: SharedConstant.DASHBOARD_URL
              }
            },
          }
        ]
      },
      {
        path: 'purchaseorder',
        data: {
          permissions: {
            only: [PermissionConstant.CommercialPermissions.LIST_ORDER_QUOTATION_PURCHASE],
            redirectTo: SharedConstant.DASHBOARD_URL
          }
        },
        children: [
          {
            path: '',
            component: PurchaseOrderListComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.LIST_ORDER_QUOTATION_PURCHASE],
                redirectTo: SharedConstant.DASHBOARD_URL
              }
            },
          },
          {
            path: 'add',
            component: PurchaseOrderAddComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.ADD_ORDER_QUOTATION_PURCHASE],
                redirectTo: SharedConstant.DASHBOARD_URL
              }
            },
          },
          {
            path: 'edit/:id/:status',
            component: PurchaseOrderAddComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.UPDATE_ORDER_QUOTATION_PURCHASE,
                  PermissionConstant.CommercialPermissions.SHOW_ORDER_QUOTATION_PURCHASE],
                redirectTo: SharedConstant.DASHBOARD_URL
              }
            },
          },
          {
            path: 'show/:id/:status',
            component: PurchaseOrderAddComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.SHOW_ORDER_QUOTATION_PURCHASE,
                  PermissionConstant.CommercialPermissions.UPDATE_ORDER_QUOTATION_PURCHASE,
                  PermissionConstant.CommercialPermissions.ADD_ORDER_QUOTATION_PURCHASE],
                redirectTo: SharedConstant.DASHBOARD_URL
              }
            },
          },
          {
            path: 'report/:id/:reportname',
            component: ReportingInModalComponent,
          }
        ]
      },
      {
        path: 'purchasefinalorder',
        data: {
          permissions: {
            only: [PermissionConstant.CommercialPermissions.LIST_FINAL_ORDER_PURCHASE],
            redirectTo: SharedConstant.DASHBOARD_URL
          }
        },
        children: [
          {
            path: '',
            component: PurchaseFinalOrderListComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.LIST_FINAL_ORDER_PURCHASE],
                redirectTo: SharedConstant.DASHBOARD_URL
              }
            },
          },
          {
            path: 'add',
            component: PurchaseFinalOrderAddComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.ADD_FINAL_ORDER_PURCHASE],
                redirectTo: SharedConstant.DASHBOARD_URL
              }
            },
          },
          {
            path: 'edit/:id/:status',
            component: PurchaseFinalOrderAddComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.UPDATE_FINAL_ORDER_PURCHASE,
                  PermissionConstant.CommercialPermissions.SHOW_FINAL_ORDER_PURCHASE],
                redirectTo: SharedConstant.DASHBOARD_URL
              }
            },
          },
          {
            path: 'show/:id/:status',
            component: PurchaseFinalOrderAddComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.SHOW_FINAL_ORDER_PURCHASE,
                  PermissionConstant.CommercialPermissions.ADD_FINAL_ORDER_PURCHASE,
                  PermissionConstant.CommercialPermissions.UPDATE_FINAL_ORDER_PURCHASE],
                redirectTo: SharedConstant.DASHBOARD_URL
              }
            },
          },
          {
            path: 'report/:id/:reportname',
            component: ReportingInModalComponent,
          }
        ]
      },
      {
        path: 'devis',
        children: [
          {
            path: 'list',
            component: PurchaseOrderListComponent,
            data: {
              permissions: {
                only: [RoleConfigConstant.PurchaseConfig, RoleConfigConstant.SuperAdminConfig, RoleConfigConstant.LIST.PURCHASEORDER],
                redirectTo: SharedConstant.DASHBOARD_URL
              }
            },
          },
          {
            path: 'add',
            component: AddDevisComponent,
            data: {
              title: 'Ajout avancé',
              permissions: {
                only: [RoleConfigConstant.PurchaseConfig, RoleConfigConstant.SuperAdminConfig, RoleConfigConstant.ADD.PURCHASEORDER],
                redirectTo: SharedConstant.DASHBOARD_URL
              }
            }
          },
          {
            path: 'edit/:id',
            component: AddDevisComponent,
            data: {
              permissions: {
                only: [RoleConfigConstant.PurchaseConfig, RoleConfigConstant.SuperAdminConfig, RoleConfigConstant.UPDATE.PURCHASEORDER],
                redirectTo: SharedConstant.DASHBOARD_URL
              }
            },
          },
          {
            path: 'report/:id/:reportname',
            component: ReportingInModalComponent,
          }
        ]
      },
      {
        path: 'asset',
        data: {
          permissions: {
            only: [PermissionConstant.CommercialPermissions.LIST_ASSET_PURCHASE],
            redirectTo: SharedConstant.DASHBOARD_URL
          }
        },
        children: [
          {
            path: '',
            component: PurchaseAssetListComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.LIST_ASSET_PURCHASE],
                redirectTo: SharedConstant.DASHBOARD_URL
              }
            },
          },
          {
            path: 'add',
            component: PurchaseAssetAddComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.ADD_ASSET_PURCHASE],
                redirectTo: SharedConstant.DASHBOARD_URL
              }
            },
          },
          {
            path: 'edit/:id/:status',
            component: PurchaseAssetAddComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.UPDATE_ASSET_PURCHASE, PermissionConstant.CommercialPermissions.SHOW_ASSET_PURCHASE],
                redirectTo: SharedConstant.DASHBOARD_URL
              }
            },
          },
          {
            path: 'show/:id/:status',
            component: PurchaseAssetAddComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.SHOW_ASSET_PURCHASE, PermissionConstant.CommercialPermissions.UPDATE_ASSET_PURCHASE],
                redirectTo: SharedConstant.DASHBOARD_URL
              }
            },
          },
          {
            path: 'report/:id/:reportname',
            component: ReportingInModalComponent,
          }
        ]
      },
      {
        path: 'invoice',
        data: {
          permissions: {
            only: [PermissionConstant.CommercialPermissions.LIST_INVOICE_PURCHASE],
            redirectTo: SharedConstant.DASHBOARD_URL
          }
        },
        children: [
          {
            path: '',
            component: PurchaseInvoiceListComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.LIST_INVOICE_PURCHASE],
                redirectTo: SharedConstant.DASHBOARD_URL
              }
            },
          },
          {
            path: 'add',
            component: PurchaseInvoiceAddComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.ADD_INVOICE_PURCHASE],
                redirectTo: SharedConstant.DASHBOARD_URL
              }
            },
          },
          {
            path: 'edit/:id/:status',
            component: PurchaseInvoiceAddComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.UPDATE_INVOICE_PURCHASE, PermissionConstant.CommercialPermissions.SHOW_INVOICE_PURCHASE],
                redirectTo: SharedConstant.DASHBOARD_URL
              }
            },
          },
          {
            path: 'show/:id/:status',
            component: PurchaseInvoiceAddComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.SHOW_INVOICE_PURCHASE, PermissionConstant.CommercialPermissions.UPDATE_INVOICE_PURCHASE],
                redirectTo: SharedConstant.DASHBOARD_URL
              }
            },
          },
          {
            path: 'report/:id/:reportname',
            component: ReportingInModalComponent,
          }
        ]
      },
      {
        path: 'delivery',
        data: {
          permissions: {
            only: [PermissionConstant.CommercialPermissions.LIST_RECEIPT_PURCHASE],
            redirectTo: SharedConstant.DASHBOARD_URL
          }
        },
        children: [
          {
            path: '',
            component: PurchaseDeliveryListComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.LIST_RECEIPT_PURCHASE],
                redirectTo: SharedConstant.DASHBOARD_URL
              }
            },
          },
          {
            path: 'add',
            component: PurchaseDeliveryAddComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.ADD_RECEIPT_PURCHASE],
                redirectTo: SharedConstant.DASHBOARD_URL
              }
            },
          },
          {
            path: 'edit/:id/:status',
            component: PurchaseDeliveryAddComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.UPDATE_RECEIPT_PURCHASE,
                  PermissionConstant.CommercialPermissions.SHOW_RECEIPT_PURCHASE],
                redirectTo: SharedConstant.DASHBOARD_URL
              }
            },
          },
          {
            path: 'show/:id/:status',
            component: PurchaseDeliveryAddComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.SHOW_RECEIPT_PURCHASE,
                  PermissionConstant.CommercialPermissions.UPDATE_RECEIPT_PURCHASE,
                  PermissionConstant.CommercialPermissions.ADD_RECEIPT_PURCHASE],
                redirectTo: SharedConstant.DASHBOARD_URL
              }
            },
          },
          {
            path: 'report/:id/:reportname',
            component: ReportingInModalComponent,
          }
        ]
      },
      {
        path: 'pricerequest',
        data: {
          permissions: {
            only: [PermissionConstant.CommercialPermissions.LIST_PRICEREQUEST],
            redirectTo: SharedConstant.DASHBOARD_URL
          }
        },
        children: [
          {
            path: '',
            component: PriceRequestListComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.LIST_PRICEREQUEST],
                redirectTo: SharedConstant.DASHBOARD_URL
              }
            },
          },
          {
            path: 'add',
            component: PriceRequestAddComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.ADD_PRICEREQUEST],
                redirectTo: SharedConstant.DASHBOARD_URL
              }
            },
          },
          {
            path: 'edit/:id',
            component: PriceRequestAddComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.UPDATE_PRICEREQUEST,PermissionConstant.CommercialPermissions.SHOW_PRICEREQUEST],
                redirectTo: SharedConstant.DASHBOARD_URL
              }
            },
          },
          {
            path: 'edit/:id/:idStatus',
            resolve: { tiersAccount: TiersAccountsResolverService },
            component: PriceRequestAddComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.UPDATE_PRICEREQUEST,PermissionConstant.CommercialPermissions.SHOW_PRICEREQUEST],
                redirectTo: SharedConstant.DASHBOARD_URL
              }
            },
          }
        ]
      },
      {
        path: 'product',

        children: [
          {
            path: '',
            component: FetchProductsComponent,
            data: {
              permissions: {
                only: [RoleConfigConstant.ItemListConfig, RoleConfigConstant.SuperAdminConfig, RoleConfigConstant.LIST.ITEMPURCHASE, RoleConfigConstant.PURCHASEITEMCONFIG],
                redirectTo: SharedConstant.DASHBOARD_URL
              },
              isPurchase: true,
              isForInventory: true
            },

          },
          {
            path: 'AdvancedAdd',
            component: AddproductComponent,
            data: {
              permissions: {
                only: [RoleConfigConstant.StockConfig, RoleConfigConstant.SuperAdminConfig, RoleConfigConstant.ADD.ITEM],
                redirectTo: SharedConstant.DASHBOARD_URL
              },
              isPurchase: true
            },
          },
          {
            path: 'duplicateItem/:cloneId',
            component: AddproductComponent,
            data: {
              permissions: {
                only: [RoleConfigConstant.StockConfig, RoleConfigConstant.SuperAdminConfig, RoleConfigConstant.ADD.ITEM],
                redirectTo: SharedConstant.DASHBOARD_URL
              },
              isPurchase: true
            },
          },
          {
            path: 'AdvancedEdit/:id',
            component: AddproductComponent,
            data: {
              permissions: {
                only: [RoleConfigConstant.StockConfig, RoleConfigConstant.SuperAdminConfig, RoleConfigConstant.UPDATE.ITEM],
                redirectTo: SharedConstant.DASHBOARD_URL
              },
              isPurchase: true
            },
          },
          {
            path: 'details/:id',
            component: DetailsProductComponent,
            data: {
              permissions: {
                only: [RoleConfigConstant.ItemListConfig, RoleConfigConstant.StockConfig,
                RoleConfigConstant.SuperAdminConfig, RoleConfigConstant.SHOW.ITEM, RoleConfigConstant.PURCHASEITEMCONFIG],
                redirectTo: SharedConstant.DASHBOARD_URL
              },
              isPurchase: true
            }
          }
        ]
      },
      {
        path: 'purchasebalance',
        data: {
          permissions: {
            only: [PermissionConstant.CommercialPermissions.SHOW_BALANCE_PURCHASE, PermissionConstant.CommercialPermissions.SHOW_UPDATE_BALANCE_PURCHASE],
            redirectTo: SharedConstant.DASHBOARD_URL
          }
        },
        children: [
          {
            path: '',
            component: PurchaseBalanceComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.SHOW_BALANCE_PURCHASE, PermissionConstant.CommercialPermissions.SHOW_UPDATE_BALANCE_PURCHASE],
                redirectTo: SharedConstant.DASHBOARD_URL
              }
            },
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
export class PurchaseRoutingModule { }
