import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SettingsLayoutComponent} from './settings-layout/settings-layout.component';

const redirectToDashboardRoute = '/main/dashboard';

const routes: Routes = [
  {
    path: '',
    component: SettingsLayoutComponent,
    children: [
      {
        path: 'administration',
        loadChildren: 'app/administration/administration.module#AdministrationModule'
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
        path: 'sales',
        loadChildren: 'app/sales/sales.module#SalesModule'
      },
      {
        path: 'payment',
        loadChildren: 'app/payment/payment.module#PaymentModule'
      },
      {
        path: 'inventory',
        loadChildren: 'app/inventory/inventory.module#InventoryModule'
      },
      {
        path: 'payroll',
        loadChildren: 'app/payroll/payroll.module#PayrollModule'
      },
      {
        path: 'rh',
        loadChildren: 'app/rh/rh.module#RhModule'
      },
      {
        path: 'ecommerce',
        loadChildren: 'app/ecommerce/ecommerce.module#EcommerceModule'
      },
      {
        path: 'crm',
        loadChildren: 'app/crm/crm.module#CrmModule'
      },
      {
        path: 'manufacturing',
        loadChildren: 'app/manufacturing/manufacturing.module#ManufacturingModule'
      },
      {
        path: 'mailing',
        loadChildren: 'app/mailing/mailing.module#MailingModule'
      },
      {
        path: 'accounting',
        loadChildren: 'app/accounting/accounting.module#AccountingModule'
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
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
