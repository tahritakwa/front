import { NgModule } from '@angular/core';
import { ListSupplierComponent } from './supplier/list-supplier/list-supplier.component';
import { SharedModule } from '../shared/shared.module';
import { AddOrderProjectComponent } from './add-order-project/add-order-project.component';
import { PurchaseRoutingModule } from './purchase.routing.module';
import { TiersService } from './services/tiers/tiers.service';
import { OrderProjectService } from './services/order-project/order-project.service';
import { ContactService } from './services/contact/contact.service';
import { PurchaseRequestService } from './services/purchase-request/purchase-request.service';
import { PurchaseRequestListGridComponent } from './components/purchase-request-list-grid/purchase-request-list-grid.component';
import { PurchaseOrderAddComponent } from './purchase-order/purchase-order-add/purchase-order-add.component';
import { AddDevisComponent } from './devis/add-devis/add-devis.component';
import { PurchaseAssetListComponent } from './purchase-asset/purchase-asset-list/purchase-asset-list.component';
import { PurchaseAssetAddComponent } from './purchase-asset/purchase-asset-add/purchase-asset-add.component';
import { PurchaseInvoiceAddComponent } from './purchase-invoice/purchase-invoice-add/purchase-invoice-add.component';
import { PurchaseInvoiceListComponent } from './purchase-invoice/purchase-invoice-list/purchase-invoice-list.component';
import { PurchaseDeliveryListComponent } from './purchase-delivery/purchase-delivery-list/purchase-delivery-list.component';
import { PurchaseDeliveryAddComponent } from './purchase-delivery/purchase-delivery-add/purchase-delivery-add.component';
import { PriceRequestAddComponent } from './price-request/price-request-add/price-request-add.component';
import { PriceRequestListComponent } from './price-request/price-request-list/price-request-list.component';
import { PriceRequestService } from './services/price-request/PriceRequestService';
import { PriceRequestGridExportComponent } from './components/price-request-grid-export/price-request-grid-export.component';
import { PriceRequestDetailService } from './services/price-request-detail/price-request-detail.service';
import { SuppliersContactsSectionComponent } from './components/suppliers-contacts-section/suppliers-contacts-section.component';
import { ExpenseService } from './services/expense/expense.service';
import { DocumentExpenseLineService } from './services/document-expense-line/document-expense-line.service';
import { DocumentExpenseGridLineService } from './services/document-expense-grid-line/document-expense-grid-line.service';
import { PurchaseRequestAddComponent } from './purchase-request/purshase-request-add/purchase-request-add.component';
import {
  GridPurchaseInvoiceAssestsBudgetComponent
} from './components/grid-purchase-invoice-assests-budget/grid-purchase-invoice-assests-budget.component';
import { PurchaseSettingsService } from './services/purchase-settings/purchase-settings.service';
import { QuotationPriceRequestCardComponent } from './components/quotation-price-request-card/quotation-price-request-card.component';
import { BudgetForPriceRequestComponent } from './components/budget-for-price-request/budget-for-price-request.component';
import { ShareDataInPriceRequestService } from './services/price-request/share-data-in-price-request.service';
import {
  PurchaseOrderForPriceRequestComponent
} from './components/purchase-order-for-price-request/purchase-order-for-price-request.component';
import { PriceRequestGridComponent } from './components/price-request-grid/price-request-grid.component';
import { CrudGridService } from '../sales/services/document-line/crud-grid.service';
import { DeadLineDocumentService } from '../sales/services/dead-line-document/dead-line-document.service';
import { FinancialCommitmentService } from '../sales/services/financial-commitment/financial-commitment.service';
import { ReportingInModalComponent } from '../shared/components/reports/reporting-in-modal/reporting-in-modal.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProvisioningListComponent } from '../provisioning-list/provisioning-list.component';
import { PurchaseFinalOrderAddComponent } from './purchase-final-order/purchase-final-order-add/purchase-final-order-add.component';
import { PurchaseFinalOrderListComponent } from './purchase-final-order/purchase-final-order-list/purchase-final-order-list.component';
import { GridProvisionComponent } from './components/grid-provision/grid-provision.component';
import { SearchItemAddComponent } from '../sales/search-item/search-item-add/search-item-add.component';
import { PurchaseOrderGridComponent } from './components/purchase-order-grid/purchase-order-grid.component';
import { NegotitateQtyComponent } from './components/negotitate-qty/negotitate-qty.component';
import { NegotitateQtyService } from './services/negotitate-qty/negotitate-qty.service';
import { PurchaseBalanceComponent } from './purchase-balance/purchase-balance.component';
import { DatePipe } from '@angular/common';
import { DocumentWithholdingTaxService } from '../sales/services/document-withholding-tax/document-withholding-tax.service';
import { OemService } from '../inventory/services/oem/oem.service';
import { CardSuppliersComponent } from './supplier/card-suppliers/card-suppliers.component';
import { DocumentUtilityService } from '../treasury/services/document-utility.service';
import {PagerModule} from '@progress/kendo-angular-pager';
import {SupplierResolverService} from './resolvers/supplier-resolver.service';
import {TiersResolverService} from './resolvers/tiers-resolver.service';
import { WithholdingTaxService } from '../shared/services/withholding-tax/withholding-tax.service';
import { BehaviorSubjectService } from '../accounting/services/reporting/behavior-subject.service';
import { SettlementModeAddComponent } from '../payment/settlement-mode-add/settlement-mode-add.component';
import { DetailsSettlementModeService } from '../payment/services/payment-method/DetailsSettlementMode.service';
import {StockDocumentsService} from '../inventory/services/stock-documents/stock-documents.service';
import {PurchaseRequestSerachComponent} from './components/purchase-request-serach/purchase-request-serach.component';
import {InventoryModule} from '../inventory/inventory.module';
import { AddProductItemComponent } from '../inventory/components/add-product-item/add-product-item.component';
import {AddNatureComponent} from '../administration/nature/add-nature/add-nature.component';
import {BodyModule, HeaderModule} from '@progress/kendo-angular-grid';
import { PriceRequestDocumentsComponent } from './price-request-documents/price-request-documents.component';
@NgModule({
  imports: [
    SharedModule,
    PurchaseRoutingModule,
    NgbModule.forRoot(),
    PagerModule,
    InventoryModule,
    BodyModule,
    HeaderModule
  ],
  declarations: [
    ListSupplierComponent,
    AddOrderProjectComponent,
    PurchaseRequestAddComponent,
    PurchaseRequestListGridComponent,
    PurchaseOrderAddComponent,
    AddDevisComponent,
    PurchaseAssetListComponent,
    PurchaseAssetAddComponent,
    PurchaseInvoiceAddComponent,
    PurchaseInvoiceListComponent,
    PurchaseDeliveryListComponent,
    PurchaseDeliveryAddComponent,
    PriceRequestAddComponent,
    PriceRequestListComponent,
    PriceRequestGridExportComponent,
    SuppliersContactsSectionComponent,
    ProvisioningListComponent,
    QuotationPriceRequestCardComponent,
    BudgetForPriceRequestComponent,
    PurchaseOrderForPriceRequestComponent,
    PriceRequestGridComponent,
    GridPurchaseInvoiceAssestsBudgetComponent,
    PurchaseFinalOrderAddComponent,
    PurchaseFinalOrderListComponent,
    GridProvisionComponent,
    PurchaseOrderGridComponent,
    NegotitateQtyComponent,
    PurchaseBalanceComponent,
    CardSuppliersComponent,
    PurchaseRequestSerachComponent,
    PriceRequestDocumentsComponent
  ],
  exports: [
    GridPurchaseInvoiceAssestsBudgetComponent
  ],
  providers: [
    DatePipe,
    TiersService,
    PriceRequestService,
    PriceRequestDetailService,
    OrderProjectService,
    ContactService,
    PurchaseRequestService,
    ExpenseService,
    DocumentExpenseLineService,
    DocumentExpenseGridLineService,
    PurchaseSettingsService,
    ShareDataInPriceRequestService,
    DeadLineDocumentService,
    FinancialCommitmentService,
    CrudGridService,
    NegotitateQtyService,
    DocumentWithholdingTaxService,
    WithholdingTaxService,
    OemService,
    DocumentUtilityService,
    BehaviorSubjectService,
    SupplierResolverService,
    TiersResolverService,
    DetailsSettlementModeService,
    StockDocumentsService,
    DetailsSettlementModeService
  ],
  entryComponents: [
    SearchItemAddComponent,
    ReportingInModalComponent,
    QuotationPriceRequestCardComponent,
    NegotitateQtyComponent,
    SettlementModeAddComponent,
    AddNatureComponent,
    AddProductItemComponent
  ]
})
export class PurchaseModule { }
