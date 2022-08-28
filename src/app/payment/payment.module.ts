import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { CashRegisterService } from '../treasury/services/cash-register/cash-register.service';
import { FundsTransferService } from '../treasury/services/funds-transfer/funds-transfer.service';
import { PaymentMethodAddComponent } from './payment-method/payment-method-add.component';
import { PaymentRoutingModule, routes } from './payment.routing';
import { DetailsSettlementModeService } from './services/payment-method/DetailsSettlementMode.service';
import { PaymentModeService } from './services/payment-method/payment-mode.service';
import { PaymentMethodService } from './services/payment-method/paymentMethod.service';
import { SettlementMethodService } from './services/payment-method/settlement-method.service';
import { PaymentTypeService } from './services/payment-type/payment-type.service';
import { SettlementModeAddComponent } from './settlement-mode-add/settlement-mode-add.component';
import { SettlementModeListComponent } from './settlement-mode-list/settlement-mode-list.component';

@NgModule({
  imports: [
    PaymentRoutingModule,
    SharedModule,
    RouterModule.forChild(routes),
  ],
  declarations: [
    SettlementModeListComponent,
    SettlementModeAddComponent,
    PaymentMethodAddComponent
    
  ],
  providers: [PaymentTypeService,
    PaymentModeService,
    DetailsSettlementModeService,
    PaymentMethodService,
    SettlementMethodService,
    FundsTransferService,
    CashRegisterService
  ],
  exports: [RouterModule],
  entryComponents: [
    PaymentMethodAddComponent
  ]
})
export class PaymentModule { }
