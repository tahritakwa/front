import {MeasureUnitListComponent} from './components/list-measure-unit/measure-unit-list.component';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FetchProductsComponent} from './components/fetch-products/fetch-products.component';
import {AddproductComponent} from '../shared/components/item/add-item/add-product.component';
import {ListTransferMovementComponent} from './stock-documents/transfer-movement/list-transfer-movement/list-transfer-movement.component';
import {AddTransferMovementComponent} from './stock-documents/transfer-movement/add-transfer-movement/add-transfer-movement.component';
import {DetailsProductComponent} from '../shared/components/item/details-product/details-product.component';
import {AddInventoryMovementComponent} from './Inventor-document/add-inventory-movement/add-inventory-movement.component';
import {ListInventoryMovementComponent} from './Inventor-document/list-inventory-movement/list-inventory-movement.component';
import {ReportingInUrlComponent} from '../shared/components/reports/reporting-in-url/reporting-in-url.component';
import {ListDailyInventoryMovementComponent} from './Inventor-document/list-daily-inventory-movement/list-daily-inventory-movement.component';
import {RoleConfigConstant} from '../Structure/_roleConfigConstant';
import {StarkPermissionsGuard} from '../stark-permissions/stark-permissions.module';
import {ShelfAndStorageManageComponent} from './shelf-and-storage/list-shelf-and-storage-manage/shelf-and-storage-manage.component';
import {MovementHistoryComponent} from './movement-history/movement-history.component';
import {OemSynchronizeComponent} from './components/oem-synchronize/oem-synchronize.component';
import {ListFamilyComponent} from './list-family/list-family.component';
import {AddSubFamilyComponent} from './components/add-sub-family/add-sub-family.component';
import {ListSubFamilyComponent} from './list-sub-family/list-sub-family.component';
import {ListBrandsComponent} from './list-brands/list-brands.component';
import {ListProductBrandComponent} from './list-product-brand/list-product-brand.component';
import {AddModelComponent} from '../shared/components/add-model/add-model.component';
import {ListModelComponent} from './list-model/list-model.component';
import {AddSubModelComponent} from './components/add-sub-model/add-sub-model.component';
import {ListSubModelsComponent} from './list-sub-models/list-sub-models.component';
import {ListExpenseItemsComponent} from './list-expense-items/list-expense-items.component';
import {AddFamilyComponent} from './components/add-family/add-family.component';
import {AddProductItemComponent} from './components/add-product-item/add-product-item.component';
import {CanDeactivateGuard} from '../shared/services/can-deactivate-guard.service';
import {AddUnitOfMeasureComponent} from './components/add-measure-of-unit/add-unit-of-measure.component';
import {AddExpenseComponent} from '../purchase/expense/add-expense/add-expense.component';
import {WarehouseOrgComponent} from './warehouse/warehouse-organigramme/warehouse-org.component';
import {WarehouseItemsDetailComponent} from './warehouse/warehouse-items-detail/warehouse-items-detail.component';
import {AddShelfAndStorageComponent} from './shelf-and-storage/add-shelf-and-storage/add-shelf-and-storage.component';
import {AddBandComponent} from '../shared/components/add-band/add-band.component';
import { PermissionConstant } from '../Structure/permission-constant';

const redirectToDashboardRoute = '/main/dashboard';

const routes: Routes = [
  {
    path: '',
    canActivateChild: [StarkPermissionsGuard],
    children: [
      {
        path: 'warehouse',
        data: {
          permissions: {
            only: [PermissionConstant.CommercialPermissions.LIST_WAREHOUSE],
            redirectTo: redirectToDashboardRoute
          }
        },
        children: [
          {
            path: '',
            component: WarehouseOrgComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.LIST_WAREHOUSE],
                redirectTo: redirectToDashboardRoute
              }
            },
          }
        ]
      },
      {
        path: 'warehouseItemsDetails/:id',
        data: {
          permissions: {
            only: [PermissionConstant.CommercialPermissions.SHOW_WAREHOUSE_DETAILS],
            redirectTo: redirectToDashboardRoute
          }
        },
        children: [
          {
            path: '',
            component: WarehouseItemsDetailComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.SHOW_WAREHOUSE_DETAILS],
                redirectTo: redirectToDashboardRoute
              }
            },
          }
        ]
      },
      {
        path: 'product',
        data: {
          permissions: {
            only: [PermissionConstant.CommercialPermissions.LIST_ITEM_STOCK],
            redirectTo: redirectToDashboardRoute
          }
        },
        children: [
          {
            path: '',
            component: FetchProductsComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.LIST_ITEM_STOCK],
                redirectTo: redirectToDashboardRoute
              },
              isPurchase: false,
              isForInventory: true
            },
          },
          {
            path: 'showItem/:itemId',
            component: FetchProductsComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.SHOW_ITEM_STOCK, PermissionConstant.CommercialPermissions.UPDATE_ITEM_STOCK],
                redirectTo: redirectToDashboardRoute
              },
              isPurchase: false,
              isForInventory: true
            },
          },
          {
            path: 'AdvancedAdd',
            component: AddproductComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.ADD_ITEM_STOCK],
                redirectTo: redirectToDashboardRoute
              },
              isPurchase: false
            },
          },
          {
            path: 'duplicateItem/:cloneId',
            component: AddproductComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.SHOW_ITEM_STOCK,PermissionConstant.CommercialPermissions.UPDATE_ITEM_STOCK],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'AdvancedEdit/:id',
            component: AddproductComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.SHOW_ITEM_STOCK, PermissionConstant.CommercialPermissions.UPDATE_ITEM_STOCK],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'details/:id',
            component: DetailsProductComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.SHOW_ITEM_STOCK, PermissionConstant.CommercialPermissions.UPDATE_ITEM_STOCK],
                redirectTo: redirectToDashboardRoute
              }
            }
          }
        ]
      },
      {
        path: 'transfertMovement',
        data: {
          permissions: {
            only: [PermissionConstant.CommercialPermissions.LIST_TRANSFER_MOVEMENT],
            redirectTo: redirectToDashboardRoute
          }
        },
        children: [
          {
            path: '',
            component: ListTransferMovementComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.LIST_TRANSFER_MOVEMENT],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'advancedAdd',
            component: AddTransferMovementComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.ADD_TRANSFER_MOVEMENT],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'advancedEdit/:id',
            component: AddTransferMovementComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.SHOW_TRANSFER_MOVEMENT, PermissionConstant.CommercialPermissions.UPDATE_TRANSFER_MOVEMENT],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'show/:id',
            component: AddTransferMovementComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.SHOW_TRANSFER_MOVEMENT, PermissionConstant.CommercialPermissions.UPDATE_TRANSFER_MOVEMENT],

                redirectTo: redirectToDashboardRoute
              }
            },
          }
        ]
      },
      {
        path: 'ShelfAndStorage',
        data: {
          permissions: {
            only: [PermissionConstant.CommercialPermissions.LIST_SHELFS_AND_STORAGES],
            redirectTo: redirectToDashboardRoute
          }
        },
        children: [
          {
            path: '',
            component: ShelfAndStorageManageComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.LIST_SHELFS_AND_STORAGES],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'advancedAdd',
            component: AddShelfAndStorageComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.ADD_SHELFS_AND_STORAGES],
                redirectTo: redirectToDashboardRoute
              }
            },
          }, {
            path: 'advancedEdit/:id',
            component: AddShelfAndStorageComponent,
            data: {
              permissions: {

                only: [PermissionConstant.CommercialPermissions.SHOW_SHELFS_AND_STORAGES, PermissionConstant.CommercialPermissions.UPDATE_SHELFS_AND_STORAGES],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'show/:id',
            component: AddShelfAndStorageComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.SHOW_SHELFS_AND_STORAGES, PermissionConstant.CommercialPermissions.UPDATE_SHELFS_AND_STORAGES],
                redirectTo: redirectToDashboardRoute
              }
            },
          }
        ]
      },
      {
        path: 'inventoryDocuments',
        data: {
          permissions: {
            only: [PermissionConstant.CommercialPermissions.LIST_INVENTORY_MOVEMENT],
            redirectTo: redirectToDashboardRoute
          }
        },
        children: [
          {
            path: '',
            component: ListInventoryMovementComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.LIST_INVENTORY_MOVEMENT],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'daily',
            component: ListDailyInventoryMovementComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.LIST_INVENTORY_MOVEMENT],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'advancedAdd',
            component: AddInventoryMovementComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.ADD_INVENTORY_MOVEMENT],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'edit/:id',
            component: AddInventoryMovementComponent,
            data: {
              permissions: {
                only: [RoleConfigConstant.StockConfig, RoleConfigConstant.SuperAdminConfig, RoleConfigConstant.UPDATE.INVENTORYMOVEMENT],
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
        path: 'MovementHistory',
        data: {
          permissions: {
            only: [PermissionConstant.CommercialPermissions.LIST_MOVEMENT_HISTORY],
            redirectTo: redirectToDashboardRoute
          }
        },

        children: [
          {
            path: '',
            component: MovementHistoryComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.LIST_MOVEMENT_HISTORY],
                redirectTo: redirectToDashboardRoute
              }
            },
          }
        ]
      }, {
        path: 'Oem',
        data: {
          permissions: {
            only: [PermissionConstant.CommercialPermissions.OEM],
            redirectTo: redirectToDashboardRoute
          }
        },

        children: [
          {
            path: '',
            component: OemSynchronizeComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.OEM],
                redirectTo: redirectToDashboardRoute
              }
            },
          }
        ]
      },
      {
        path: 'list-family',
        data: {
          permissions: {
            only: [PermissionConstant.SettingsCommercialPermissions.LIST_FAMILY],
            redirectTo: redirectToDashboardRoute
          }
        },
        children: [
          {
            path: '',
            component: ListFamilyComponent,
            data: {
              permissions: {
                only: [PermissionConstant.SettingsCommercialPermissions.LIST_FAMILY],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'AdvancedAdd',
            component: AddFamilyComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              title: 'Ajout famille',
              permissions: {
                only: [PermissionConstant.SettingsCommercialPermissions.ADD_FAMILY],
                redirectTo: redirectToDashboardRoute
              },
              cardMode: true
            },
          },
          {
            path: 'AdvancedEdit/:id',
            component: AddFamilyComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              title: 'Edit famille',
              permissions: {
                only: [PermissionConstant.SettingsCommercialPermissions.UPDATE_FAMILY,
                  PermissionConstant.SettingsCommercialPermissions.SHOW_FAMILY],
                redirectTo: redirectToDashboardRoute
              },
              cardMode: true
            },
          }
        ]
      },
      {
        path: 'list-sub-family',
        data: {
          permissions: {
            only: [PermissionConstant.SettingsCommercialPermissions.LIST_SUBFAMILY],
            redirectTo: redirectToDashboardRoute
          }
        },
        children: [
          {
            path: '',
            component: ListSubFamilyComponent,
            data: {
              permissions: {
                only: [PermissionConstant.SettingsCommercialPermissions.LIST_SUBFAMILY],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'AdvancedAdd',
            component: AddSubFamilyComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [PermissionConstant.SettingsCommercialPermissions.ADD_SUBFAMILY],
                redirectTo: redirectToDashboardRoute
              },
              cardMode: true,
            },
          },
          {
            path: 'AdvancedEdit/:id',
            component: AddSubFamilyComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [PermissionConstant.SettingsCommercialPermissions.UPDATE_SUBFAMILY,
                  PermissionConstant.SettingsCommercialPermissions.SHOW_SUBFAMILY],
                redirectTo: redirectToDashboardRoute
              },
              cardMode: true,
            },
          },
        ]
      },
      {
        path: 'list-brands',
        data: {
          permissions: {
            only: [PermissionConstant.SettingsCommercialPermissions.LIST_VEHICLEBRAND],
            redirectTo: redirectToDashboardRoute
          }
        },
        children: [
          {
            path: '',
            component: ListBrandsComponent,
            data: {
              permissions: {
                only: [PermissionConstant.SettingsCommercialPermissions.LIST_VEHICLEBRAND],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'AdvancedAdd',
            component: AddBandComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              title: 'Ajout marque',
              permissions: {
                only: [PermissionConstant.SettingsCommercialPermissions.ADD_VEHICLEBRAND],
                redirectTo: redirectToDashboardRoute
              },
              cardMode: true
            },
          },
          {
            path: 'AdvancedEdit/:id',
            component: AddBandComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              title: 'Edit marque',
              permissions: {
                only: [PermissionConstant.SettingsCommercialPermissions.UPDATE_VEHICLEBRAND,
                  PermissionConstant.SettingsCommercialPermissions.SHOW_VEHICLEBRAND],
                redirectTo: redirectToDashboardRoute
              },
              cardMode: true
            },
          }
        ]
      },
      {
        path: 'list-product-brand',
        data: {
          permissions: {
            only: [PermissionConstant.SettingsCommercialPermissions.LIST_PRODUCTITEM],
            redirectTo: redirectToDashboardRoute
          }
        },
        children: [
          {
            path: '',
            component: ListProductBrandComponent,
            data: {
              permissions: {
                only: [PermissionConstant.SettingsCommercialPermissions.LIST_PRODUCTITEM],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'AdvancedAdd',
            component: AddProductItemComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              title: 'Ajout marque de produit',
              permissions: {
                only: [PermissionConstant.SettingsCommercialPermissions.ADD_PRODUCTITEM],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'AdvancedEdit/:id',
            component: AddProductItemComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              title: 'Edit marque de produit',
              permissions: {
                only: [PermissionConstant.SettingsCommercialPermissions.UPDATE_PRODUCTITEM,
                  PermissionConstant.SettingsCommercialPermissions.SHOW_PRODUCTITEM],
                redirectTo: redirectToDashboardRoute
              }
            },
          }
        ]
      },
      {
        path: 'list-model',
        data: {
          permissions: {
            only: [PermissionConstant.SettingsCommercialPermissions.LIST_MODELOFITEM],
            redirectTo: redirectToDashboardRoute
          }
        },
        children: [
          {
            path: '',
            component: ListModelComponent,
            data: {
              permissions: {
                only: [PermissionConstant.SettingsCommercialPermissions.LIST_MODELOFITEM],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'AdvancedAdd',
            component: AddModelComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [PermissionConstant.SettingsCommercialPermissions.ADD_MODELOFITEM],
                redirectTo: redirectToDashboardRoute
              },
              cardMode: true,
            },
          },
          {
            path: 'AdvancedEdit/:id',
            component: AddModelComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [PermissionConstant.SettingsCommercialPermissions.UPDATE_MODELOFITEM,
                  PermissionConstant.SettingsCommercialPermissions.SHOW_MODELOFITEM],
                redirectTo: redirectToDashboardRoute
              },
              cardMode: true,
            }
          }
        ]
      },
      {
        path: 'list-sub-models',
        data: {
          permissions: {
            only: [PermissionConstant.SettingsCommercialPermissions.LIST_SUBMODEL],
            redirectTo: redirectToDashboardRoute
          },
          cardMode: true,
        },

        children: [
          {
            path: '',
            component: ListSubModelsComponent,
            data: {
              permissions: {
                only: [PermissionConstant.SettingsCommercialPermissions.LIST_SUBMODEL],
                redirectTo: redirectToDashboardRoute
              },
              cardMode: true,
            },
          },
          {
            path: 'AdvancedAdd',
            component: AddSubModelComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [PermissionConstant.SettingsCommercialPermissions.ADD_SUBMODEL],
                redirectTo: redirectToDashboardRoute
              },
              cardMode: true,
            },
          },
          {
            path: 'AdvancedEdit/:id',
            component: AddSubModelComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [PermissionConstant.SettingsCommercialPermissions.UPDATE_SUBMODEL,
                  PermissionConstant.SettingsCommercialPermissions.SHOW_SUBMODEL],
                redirectTo: redirectToDashboardRoute
              },
              cardMode: true,
            },
          },
        ]
      },
      {
        path: 'list-expense-items',
        data: {
          permissions: {
            only: [PermissionConstant.SettingsCommercialPermissions.LIST_EXPENSE],
            redirectTo: redirectToDashboardRoute
          }
        },
        children: [
          {
            path: '',
            component: ListExpenseItemsComponent,
            data: {
              permissions: {
                only: [PermissionConstant.SettingsCommercialPermissions.LIST_EXPENSE],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'add',
            component: AddExpenseComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [PermissionConstant.SettingsCommercialPermissions.ADD_EXPENSE],
                redirectTo: redirectToDashboardRoute
              }
            }
          },
          {
            path: 'edit/:id',
            component: AddExpenseComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [PermissionConstant.SettingsCommercialPermissions.UPDATE_EXPENSE,
                  PermissionConstant.SettingsCommercialPermissions.SHOW_EXPENSE],
                redirectTo: redirectToDashboardRoute
              }
            }
          }
        ]
      },
      {
        path: 'list-Measure-Unit',
        data: {
          title: 'Liste des unites de mesures',
          permissions: {
            only: [PermissionConstant.SettingsCommercialPermissions.LIST_MEASUREUNIT],
            redirectTo: redirectToDashboardRoute
          }
        },
        children: [
          {
            path: '',
            component: MeasureUnitListComponent,
            data: {
              title: 'Liste des unites de mesures',
              permissions: {
                only: [PermissionConstant.SettingsCommercialPermissions.LIST_MEASUREUNIT],
                redirectTo: redirectToDashboardRoute
              }
            },

          },
          {
            path: 'add',
            component: AddUnitOfMeasureComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              title: 'Add Unit of measure',
              permissions: {
                only: [PermissionConstant.SettingsCommercialPermissions.ADD_MEASUREUNIT],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'edit/:id',
            component: AddUnitOfMeasureComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              title: 'Edit Unit of measure',
              permissions: {
                only: [PermissionConstant.SettingsCommercialPermissions.UPDATE_MEASUREUNIT,
                  PermissionConstant.SettingsCommercialPermissions.SHOW_MEASUREUNIT],
                redirectTo: redirectToDashboardRoute
              }
            },
          }
        ]
      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryRoutingModule {
}
