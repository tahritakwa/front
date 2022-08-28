import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettlementModeAddComponent } from './settlement-mode-add/settlement-mode-add.component';
import { SettlementModeListComponent } from './settlement-mode-list/settlement-mode-list.component';
import {CanDeactivateGuard} from '../shared/services/can-deactivate-guard.service';


export const routes: Routes = [
  {
    path: '',
    children: [

      {
        path: 'settlementmode',
        children: [
          {
            path: '',
            component: SettlementModeListComponent
          },
          {
            path: 'AdvancedAdd',
            canDeactivate: [CanDeactivateGuard],
            component: SettlementModeAddComponent
          },
          {
            path: 'AdvancedEdit/:id',
            canDeactivate: [CanDeactivateGuard],
            component: SettlementModeAddComponent
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
export class PaymentRoutingModule { }
