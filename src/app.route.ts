import {Routes, RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {LoginComponent} from './app/login/login.component';
import {DashboardComponent} from './app/dashboard/dashboard.component';
import {MainComponent} from './app/Structure/main/main.component';
import {AuthGuard} from './app/login/Authentification/services/auth.guard';
import {ProfileComponent} from './app/Structure/header/components/user-actions-dropdown/profile/profile.component';
import {UserActionListComponent} from './app/Structure/header/components/user-action-nav-mobile/user-action-list/user-action-list.component';
import {NotificationDropdownComponent} from './app/Structure/header/components/notification-dropdown/notification.dropdown.component';
import {ReminderDropdownComponent} from './app/Structure/header/components/reminder-dropdown/reminder-dropdown.component';
import { PermissionsResolverService } from './app/login/Authentification/services/permissions-resolver.service';
import { GarageDashboardComponent } from './app/dashboard/garage-dashboard/garage-dashboard.component';
import { CustomErrorComponent } from './app/custom-error/custom-error.component';
import { PermissionConstant } from './app/Structure/permission-constant';
import { SharedConstant } from './app/constant/shared/shared.constant';
import {RhDashboardComponent} from "./app/dashboard/rh-dashboard/rh-dashboard.component";

const redirectToDashboardRoute = '/main/dashboard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'main',
    component: MainComponent,
    canActivate: [AuthGuard],
    resolve : {'permissions' : PermissionsResolverService},
    runGuardsAndResolvers: 'always',
    children: [
      {
        path: 'profile',
        component: ProfileComponent,
        data: {
          permissions: {
            only: [PermissionConstant.SettingsRHAndPaiePermissions.SHOW_USER], redirectTo: redirectToDashboardRoute
          }
        }
      },
      {
        path: 'profile/:id',
        component: ProfileComponent,
        data: {
          permissions: {
            only: [PermissionConstant.SettingsRHAndPaiePermissions.SHOW_USER, PermissionConstant.SettingsRHAndPaiePermissions.UPDATE_USER],
            redirectTo: redirectToDashboardRoute
          }
        }
      },
      {
        path: 'user_actions',
        component: UserActionListComponent,
      }, {
        path: 'notifications',
        component: NotificationDropdownComponent,
      },
      {
        path: 'actions_notifications',
        component: ReminderDropdownComponent,
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'dashboard/commercial',
        component: DashboardComponent,
        data: {
          permissions: {
            only: [PermissionConstant.DashboardPermissions.PURCHASE_DASHBOARD, PermissionConstant.DashboardPermissions.SALES_DASHBOARD,
              PermissionConstant.DashboardPermissions.TREASURY_SALES_DASHBOARD,
              PermissionConstant.DashboardPermissions.TREASURY_PURCHASE_DASHBOARD], redirectTo: redirectToDashboardRoute
          }
        }
      },
      {
        path: 'dashboard/garage',
        component: GarageDashboardComponent,
        data: {
          permissions: {
            only: [PermissionConstant.DashboardPermissions.GARAGE_DASHBOARD], redirectTo: redirectToDashboardRoute
          }
        }
      },
      {
        path: 'dashboard/hr',
        component: RhDashboardComponent,
        data: {
          permissions: {
            only: [PermissionConstant.DashboardPermissions.RH_DASHBOARD], redirectTo: redirectToDashboardRoute
          }
        }
      },
      {
        path: 'error',
        component: CustomErrorComponent
      },
      {
        path: 'inventory',
        loadChildren: 'app/inventory/inventory.module#InventoryModule'
      },
      {
        path: 'purchase',
        loadChildren: 'app/purchase/purchase.module#PurchaseModule'
      },
      {
        path: 'rh',
        loadChildren: 'app/rh/rh.module#RhModule'
      },
      {
        path: 'payroll',
        loadChildren: 'app/payroll/payroll.module#PayrollModule'
      },
      {
        path: 'sales',
        loadChildren: 'app/sales/sales.module#SalesModule'
      },
      {
        path: 'payment',
        loadChildren: 'app/payment/payment.module#PaymentModule'
      },
      {
        path: 'immobilization',
        loadChildren: 'app/immobilization/immobilization.module#ImmobilizationModule'
      },
      {
        path: 'treasury',
        loadChildren: 'app/treasury/treasury.module#TreasuryModule'
      },
      {
        path: 'garage',
        loadChildren: 'app/garage/garage.module#GarageModule'
      },
      {
        path: 'administration',
        loadChildren: 'app/administration/administration.module#AdministrationModule'
      },
      {
        path: 'accounting',
        loadChildren: 'app/accounting/accounting.module#AccountingModule'
      },
      {
        path: 'manufacturing',
        loadChildren: 'app/manufacturing/manufacturing.module#ManufacturingModule'
      },
      {
        path: 'crm',
        loadChildren: 'app/crm/crm.module#CrmModule'
      },
      {
        path: 'reporting',
        loadChildren: 'app/reporting/reporting.module#ReportingModule'
      },
      {
        path: 'helpdesk',
        loadChildren: 'app/helpdesk/helpdesk.module#HelpdeskModule'
      },
      {
        path: 'mailing',
        loadChildren: 'app/mailing/mailing.module#MailingModule'
      },
      {
        path: 'ecommerce',
        loadChildren: 'app/ecommerce/ecommerce.module#EcommerceModule'
      },
      {
        path: 'stockCorrection',
        loadChildren: 'app/stock-correction/stock-correction.module#StockCorrectionModule'
      },
      {
        path: 'settings',
        loadChildren: 'app/settings/settings.module#SettingsModule'
      },
      {
        path: '**',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
