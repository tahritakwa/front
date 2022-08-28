import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { BeListComponent } from './be/be-list/be-list.component';
import { BeAddComponent } from './be/be-add/be-add.component';
import { BsListComponent } from './bs/bs-list/bs-list.component';
import { BsAddComponent } from './bs/bs-add/bs-add.component';
import { ReportingInModalComponent } from '../shared/components/reports/reporting-in-modal/reporting-in-modal.component';
import { StarkPermissionsGuard } from '../stark-permissions/stark-permissions.module';
import { RoleConfigConstant } from '../Structure/_roleConfigConstant';
import { SharedConstant } from '../constant/shared/shared.constant';
import { PermissionConstant } from '../Structure/permission-constant';


const routes: Routes = [
  {
    path: '',
    canActivateChild: [StarkPermissionsGuard],
    children: [

      {
        path: 'be',
        data: {
          permissions: {
            only: [PermissionConstant.CommercialPermissions.LIST_ADMISSION_VOUCHERS],
            redirectTo: SharedConstant.DASHBOARD_URL
          }
        },
        children: [
          {
            path: '',
            component: BeListComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.LIST_ADMISSION_VOUCHERS],
                redirectTo: SharedConstant.DASHBOARD_URL
              }
            },
          },
          {
            path: 'add',
            component: BeAddComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.ADD_ADMISSION_VOUCHERS],
                redirectTo: SharedConstant.DASHBOARD_URL
              }
            },
          },
          {
            path: 'edit/:id/:status',
            component: BeAddComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.UPDATE_ADMISSION_VOUCHERS,
                  PermissionConstant.CommercialPermissions.SHOW_ADMISSION_VOUCHERS],
                redirectTo: SharedConstant.DASHBOARD_URL
              }
            },
          },
          {
            path: 'show/:id/:status',
            component: BeAddComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.SHOW_ADMISSION_VOUCHERS,
                  PermissionConstant.CommercialPermissions.UPDATE_ADMISSION_VOUCHERS,
                  PermissionConstant.CommercialPermissions.ADD_ADMISSION_VOUCHERS
                ],
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
        path: 'bs',
        data: {
          permissions: {
            only: [PermissionConstant.CommercialPermissions.LIST_EXIT_VOUCHERS],
            redirectTo: SharedConstant.DASHBOARD_URL
          }
        },
        children: [
          {
            path: '',
            component: BsListComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.LIST_EXIT_VOUCHERS],
                redirectTo: SharedConstant.DASHBOARD_URL
              }
            },
          },
          {
            path: 'add',
            component: BsAddComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.ADD_EXIT_VOUCHERS],
                redirectTo: SharedConstant.DASHBOARD_URL
              }
            },
          },
          {
            path: 'edit/:id/:status',
            component: BsAddComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.UPDATE_EXIT_VOUCHERS,
                  PermissionConstant.CommercialPermissions.SHOW_EXIT_VOUCHERS],
                redirectTo: SharedConstant.DASHBOARD_URL
              }
            },
          },
          {
            path: 'show/:id/:status',
            component: BsAddComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.SHOW_EXIT_VOUCHERS,
                  PermissionConstant.CommercialPermissions.UPDATE_EXIT_VOUCHERS,
                  PermissionConstant.CommercialPermissions.ADD_EXIT_VOUCHERS],
                redirectTo: SharedConstant.DASHBOARD_URL
              }
            },
          },
          {
            path: 'report/:id/:reportname',
            component: ReportingInModalComponent,
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


export class StockCorrectionRoutingModule { }

