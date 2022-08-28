import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { routes } from '../../app.route';
import { StockCorrectionRoutingModule } from './stock-correction.routing.module';
import { BeAddComponent } from './be/be-add/be-add.component';
import { BeListComponent } from './be/be-list/be-list.component';
import { BsAddComponent } from './bs/bs-add/bs-add.component';
import { BsListComponent } from './bs/bs-list/bs-list.component';
import { PurchaseModule } from '../purchase/purchase.module';
import { SalesModule } from '../sales/sales.module';
import { GridBeComponent } from './be/grid-be/grid-be.component';
import { GridBsComponent } from './bs/grid-bs/grid-bs.component';
import { GridImportBlComponent } from './bs/grid-import-bl/grid-import-bl.component';
import { StarkPermissionsGuard } from '../stark-permissions/stark-permissions.module';

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    SharedModule,
    StockCorrectionRoutingModule,
    PurchaseModule,
    SalesModule,
    NgbModule.forRoot()
  ],
  declarations: [
    BeAddComponent,
    BeListComponent,
    BsListComponent,
    BsAddComponent,
    GridBeComponent,
    GridBsComponent,
    GridImportBlComponent
  ],
  providers: [
    StarkPermissionsGuard
  ],
  exports: [RouterModule]
})
export class StockCorrectionModule { }
