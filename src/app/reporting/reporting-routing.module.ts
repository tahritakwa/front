import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RhReportingComponent } from './rh/rh-reporting/rh-reporting.component';
import { DocumentControlStatusComponent } from './document/document-control-status/document-control-status.component';
import { StockValuationComponent } from './stock-valuation/stock-valuation.component';
import { TiersExtractComponent } from './tiers-extract/tiers-extract.component';
import { VatDeclarationComponent } from './vat-declaration/vat-declaration.component';
import { PermissionConstant } from '../Structure/permission-constant';
import { NoteOnTurnoverComponent } from './note-on-turnover/note-on-turnover.component';
import { ListDailySalesInventoryMovementComponent } from '../sales/components/list-daily-sales-inventory-movement/list-daily-sales-inventory-movement.component';

const redirectToDashboardRoute = '/main/dashboard';
const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'document',
        data: {
          permissions: {
            only: [PermissionConstant.CommercialPermissions.LIST_DOCUMENT_STATUS_CONTROL],
            redirectTo: redirectToDashboardRoute
          }
        },
        children: [
          {
            path: 'document-control',
            component: DocumentControlStatusComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.LIST_DOCUMENT_STATUS_CONTROL],
                redirectTo: redirectToDashboardRoute
              }
            }
          }
        ]
      },
      {
        path: 'hr',
        children: [
          {
            path: '',
            component: RhReportingComponent
          }
        ]
      },
      {
        path: 'stock-valuation',
        children: [
          {
            path: '',
            component: StockValuationComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.LIST_STOCK_VALUATION],
                redirectTo: redirectToDashboardRoute
              }
            }
          }
        ]
      },
      {
        path: 'tiers-extract',
        data: {
          permissions: {
            only: [PermissionConstant.CommercialPermissions.LIST_TIERS_EXTRACT],
            redirectTo: redirectToDashboardRoute
          }
        },
        children: [
          {
            path: '',
            component: TiersExtractComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.LIST_TIERS_EXTRACT],
                redirectTo: redirectToDashboardRoute
              }
            }
          }
        ]
      },
      {
        path: 'vat-declaration',
        data: {
          permissions: {
            only: [PermissionConstant.CommercialPermissions.LIST_VAT_DECLARATION],
            redirectTo: redirectToDashboardRoute
          }
        },
        children: [
          {
            path: '',
            component: VatDeclarationComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.LIST_VAT_DECLARATION],
                redirectTo: redirectToDashboardRoute
              }
            }
          }
        ]
      },
      {
        path: 'note-on-turnover',
        data: {
          permissions: {
            only: [PermissionConstant.CommercialPermissions.LIST_NOTE_ON_TURNOVER],
            redirectTo: redirectToDashboardRoute
          }
        },
        children: [
          {
            path: '',
            component: NoteOnTurnoverComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.LIST_NOTE_ON_TURNOVER],
                redirectTo: redirectToDashboardRoute
              }
            }
          }
        ]
      },
      {
        path: 'daily-sales',
        data: {
          permissions: {
            only: [PermissionConstant.CommercialPermissions.GENERATE_SALES_JOURNAL],
            redirectTo: redirectToDashboardRoute
          }
        },
        children: [
          {
            path: '',
            component: ListDailySalesInventoryMovementComponent,
            data: {
              permissions: {
                only: [PermissionConstant.CommercialPermissions.GENERATE_SALES_JOURNAL],
                redirectTo: redirectToDashboardRoute
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
export class ReportingRoutingModule { }
