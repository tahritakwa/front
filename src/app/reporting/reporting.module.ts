import { NgModule } from '@angular/core';
import { ReportingRoutingModule } from './reporting-routing.module';
import { RhReportingComponent } from './rh/rh-reporting/rh-reporting.component';
import { SharedModule } from '../shared/shared.module';
import { AgeRangeComponent } from './rh/age-range/age-range.component';
import { DocumentControlStatusComponent } from './document/document-control-status/document-control-status.component';
import { StockValuationComponent } from './stock-valuation/stock-valuation.component';
import { TiersExtractComponent } from './tiers-extract/tiers-extract.component';
import { VatDeclarationComponent } from './vat-declaration/vat-declaration.component';
import { ReportingService } from './services/reporting.service';
import { NoteOnTurnoverComponent } from './note-on-turnover/note-on-turnover.component';
import { ListDailySalesInventoryMovementComponent } from '../sales/components/list-daily-sales-inventory-movement/list-daily-sales-inventory-movement.component';


@NgModule({
  imports: [
    SharedModule,
    ReportingRoutingModule
  ],
  declarations: [
    RhReportingComponent,
    DocumentControlStatusComponent,
    AgeRangeComponent,
    StockValuationComponent,
    TiersExtractComponent,
    VatDeclarationComponent,
    NoteOnTurnoverComponent,
    ListDailySalesInventoryMovementComponent,
  ],
  providers: [
    ReportingService
  ],
  entryComponents: [

  ]
})
export class ReportingModule { }
