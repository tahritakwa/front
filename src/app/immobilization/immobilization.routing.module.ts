import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddActiveComponent } from './active/add-active/add-active.component';
import { ListActiveComponent } from './active/list-active/list-active.component';
import { ActiveAssignmentComponent } from './active-assignment/active-assignment.component';
import { RoleConfigConstant } from '../Structure/_roleConfigConstant';
import { SharedConstant } from '../constant/shared/shared.constant';
import { StarkPermissionsGuard } from '../stark-permissions/stark-permissions.module';
import { PermissionConstant } from '../Structure/permission-constant';


const routes: Routes = [
  {
    path: '',
    canActivateChild: [StarkPermissionsGuard],
    children: [
      {
        path: 'listOfActive',
        data: {
          permissions: {
            only: [PermissionConstant.CommercialPermissions.LIST_ACTIVE],
            redirectTo: SharedConstant.DASHBOARD_URL
          }
        },

        children: [
          {
            path: '',
            component: ListActiveComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.LIST_ACTIVE],
                redirectTo: SharedConstant.DASHBOARD_URL
              }
            },
          },
          {
            path: 'AdvancedAdd',
            component: AddActiveComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.ADD_ACTIVE],
                redirectTo: SharedConstant.DASHBOARD_URL
              }
            },
          },
          {
            path: 'AdvancedEdit/:id',
            component: AddActiveComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.UPDATE_ACTIVE,PermissionConstant.CommercialPermissions.SHOW_ACTIVE ],
                redirectTo: SharedConstant.DASHBOARD_URL
              }
            },
          }
        ]
      },
      {
        path: 'activeAssignment',
        data: {
          permissions: {
            only: [PermissionConstant.CommercialPermissions.LIST_ASSIGNMENT_ACTIVE],
            redirectTo: SharedConstant.DASHBOARD_URL
          }
        },
        children: [
          {
            path: '',
            component: ActiveAssignmentComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.LIST_ASSIGNMENT_ACTIVE],
                redirectTo: SharedConstant.DASHBOARD_URL
              }
            },
          },
        ]
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImmobilizationRoutingModule { }

