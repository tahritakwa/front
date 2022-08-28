import { AdministrationModule } from '../administration/administration.module';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { HelpdeskRoutingModule } from './helpdesk.routing.module';
import { NgxBarcodeModule } from 'ngx-barcode';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ClaimService } from './services/claim/claim.service';
import { ClaimTypeService } from './services/claim-type/claim-type.service';
import { ClaimStatusService } from './services/claim-status/claim-status.service';
import { ListClaimComponent } from './claim/list-claim/list-claim.component';
import { AddClaimComponent } from './claim/add-claim/add-claim.component';
import { BLDropdownComponent } from './components/bl-dropdown/bl-dropdown.component';
import { BLLineDropdownComponent } from './components/bl-line-dropdown/bl-line-dropdown.component';
import { ClaimStatusDropdownComponent } from './components/claim-status-dropdown/claim-status-dropdown.component';
import { AddClaimInteractionComponent } from './components/add-claim-interaction/add-claim-interaction.component';
import { ClaimSearchItemComponent } from './components/claim-search-item/claim-search-item.component';
import { AddClaimDetailsComponent } from './components/add-claim-details/add-claim-details.component';
import { FetchProductsComponent } from '../inventory/components/fetch-products/fetch-products.component';
@NgModule({
  imports: [
    SharedModule,
    HelpdeskRoutingModule,
    NgxBarcodeModule,
    AdministrationModule,
    NgbModule.forRoot()
  ],
  declarations: [
    AddClaimComponent,
    ListClaimComponent,
    BLDropdownComponent,
    BLLineDropdownComponent,
    ClaimStatusDropdownComponent,
    AddClaimInteractionComponent,
    ClaimSearchItemComponent,
    AddClaimDetailsComponent
  ],
  exports: [
    ListClaimComponent
  ],
  providers: [
    ClaimService,
    ClaimTypeService,
    ClaimStatusService
  ],
  entryComponents: [
    BLDropdownComponent,
    ClaimStatusDropdownComponent,
    FetchProductsComponent
  ]
})
export class HelpdeskModule { }
