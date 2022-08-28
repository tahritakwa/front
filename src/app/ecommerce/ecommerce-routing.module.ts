import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductEcommerceComponent } from './product-ecommerce/product-ecommerce.component';
import { CustomerEcommerceComponent } from './customer-ecommerce/customer-ecommerce.component';
import { MouvementEcommerceComponent } from './mouvement-ecommerce/mouvement-ecommerce.component';
import { AddMouvementEcommerceComponent } from './add-mouvement-ecommerce/add-mouvement-ecommerce.component';
import { SendProductEcommerceComponent } from './send-product-ecommerce/send-product-ecommerce.component';
import { ErrorSendProductEcommerceComponent } from './error-send-product-ecommerce/error-send-product-ecommerce.component';
import { RoleConfigConstant } from '../Structure/_roleConfigConstant';
import { ErrorSalesDeliveryGenerationListComponent } from './error-sales-delivery-generation-list/error-sales-delivery-generation-list.component';
import { DeliveryEcommerceComponent } from './delivery-ecommerce/delivery-ecommerce.component';
import { StarkPermissionsGuard } from '../stark-permissions/stark-permissions.module';

const routes: Routes = [
  {
    path: '',
    canActivateChild: [StarkPermissionsGuard],
    children: [
      {
        path: 'delivery',
        children: [
          {
            path: '',
            component: DeliveryEcommerceComponent,
            data: {
              permissions: {
                only: [RoleConfigConstant.EcommerceConfig],
                redirectTo: '/main/dashboard'
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
            component: ProductEcommerceComponent,
            data: {
              permissions: {
                only: [RoleConfigConstant.EcommerceConfig],
                redirectTo: '/main/dashboard'
              }
            },
          }
        ]
      },
      {
        path: 'movement',
        children: [
          {
            path: '',
            component: MouvementEcommerceComponent,
            data: {
              permissions: {
                only: [RoleConfigConstant.EcommerceConfig],
                redirectTo: '/main/dashboard'
              }
            },
          }
        ]
      },
      {
        path: 'customer',
        children: [
          {
            path: '',
            component: CustomerEcommerceComponent,
            data: {
              permissions: {
                only: [RoleConfigConstant.EcommerceConfig],
                redirectTo: '/main/dashboard'
              }
            },
          }
        ]
      },
      {
        path: 'log',
        children: [
          {
            path: 'toExecute',
            component: SendProductEcommerceComponent,
            data: {
              permissions: {
                only: [RoleConfigConstant.EcommerceConfig],
                redirectTo: '/main/dashboard'
              }
            },
          },
          {
            path: 'error',
            component: ErrorSendProductEcommerceComponent,
            data: {
              permissions: {
                only: [RoleConfigConstant.EcommerceConfig],
                redirectTo: '/main/dashboard'
              }
            },
          },
          {
            path: 'salesDeliveryError',
            component: ErrorSalesDeliveryGenerationListComponent,
            data: {
              permissions: {
                only: [RoleConfigConstant.EcommerceConfig],
                redirectTo: '/main/dashboard'
              }
            },
          }
        ]
      },
      {
        path: 'transfertMovement/advancedAdd',
        component: AddMouvementEcommerceComponent,
        data: {
          permissions: {
            only: [RoleConfigConstant.EcommerceConfig],
            redirectTo: '/main/dashboard'
          }
        },
      },
      {
        path: 'transfertMovement/advancedEdit/:id',
        component: AddMouvementEcommerceComponent,
        data: {
          permissions: {
            only: [RoleConfigConstant.EcommerceConfig],
            redirectTo: '/main/dashboard'
          }
        },
      },
      {
        path: 'transfertMovement/show/:id',
        component: AddMouvementEcommerceComponent,
        data: {
          permissions: {
            only: [RoleConfigConstant.EcommerceConfig],
            redirectTo: '/main/dashboard'
          }
        },
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EcommerceRoutingModule { }
