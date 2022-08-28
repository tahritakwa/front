import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddClaimComponent } from './claim/add-claim/add-claim.component';
import { ListClaimComponent } from './claim/list-claim/list-claim.component';
import { StarkPermissionsGuard } from '../stark-permissions/stark-permissions.module';
import {CanDeactivateGuard} from '../shared/services/can-deactivate-guard.service';
import { PermissionConstant } from '../Structure/permission-constant';
import { SharedConstant } from '../constant/shared/shared.constant';


const routes: Routes = [
  {
    path: '',
    canActivateChild: [StarkPermissionsGuard],
    children: [
      {
        path: 'claims',
        data: {
          permissions: {
            only: [PermissionConstant.CommercialPermissions.LIST_CLAIM_PURCHASE],
            redirectTo: SharedConstant.DASHBOARD_URL
          }
        },
        children: [
          {
            path: '',
            component: ListClaimComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.LIST_CLAIM_PURCHASE],
                redirectTo: SharedConstant.DASHBOARD_URL
              }
            },
          },
          {
            path: 'claimItem/:id',
            component: ListClaimComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.LIST_CLAIM_PURCHASE],
                redirectTo: SharedConstant.DASHBOARD_URL
              }
            },
          },
          {
            path: 'add',
            component: AddClaimComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.ADD_CLAIM_PURCHASE],
                redirectTo: SharedConstant.DASHBOARD_URL
              }
            },
          },
          {
            path: 'advancedAdd',
            component: AddClaimComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.ADD_CLAIM_PURCHASE],
                redirectTo: SharedConstant.DASHBOARD_URL
              }
            },
          },
          {
            path: 'advancedAdd/:id',
            component: AddClaimComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.ADD_CLAIM_PURCHASE],
                redirectTo: SharedConstant.DASHBOARD_URL
              }
            },
          },
          {
            path: 'advancedEdit/:id',
            component: AddClaimComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.UPDATE_CLAIM_PURCHASE,PermissionConstant.CommercialPermissions.SHOW_CLAIM_PURCHASE],
                redirectTo: SharedConstant.DASHBOARD_URL
              }
            },
          },
          {
            path: 'show/:id',
            component: AddClaimComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.LIST_CLAIM_PURCHASE],
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
export class HelpdeskRoutingModule { }
