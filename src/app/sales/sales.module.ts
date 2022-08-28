import { TierCategoryComponent } from './tier-category/list-tier-category/tier-category.component';
import { TierCategoryAddComponent } from './tier-category/add-tier-category/TierCategoryAdd.component';
import { TierCategoryDropdownComponent } from '../shared/components/tier-category-dropdown/tier-category-dropdown.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { routes } from './sales.routing.module';
import { SharedModule } from '../shared/shared.module';
import { TaxeGroupTiersService } from './services/taxe-group-tiers/sale-group-tiers.service';
import { DocumentService } from './services/document/document.service';
import { DocumentLineService } from './services/document-line/document-line.service';
import { DeliveryFormsAddComponent } from './delivery-forms/delivery-forms-add/delivery-forms-add.component';
import { AddCustomerComponent } from './customer/add-customer/add-customer.component';
import { ListCustomerComponent } from './customer/list-customer/list-customer.component';
import { AssetAddComponent } from './asset/asset-add/asset-add.component';
import { AssetListComponent } from './asset/asset-list/asset-list.component';
import { SalesOrderListComponent } from './sales-order/sales-order-list/sales-order-list.component';
import { SalesOrderAddComponent } from './sales-order/sales-order-add/sales-order-add.component';
import { PriceAddComponent } from './price/price-add/price-add.component';
import { PriceListComponent } from './price/price-list/price-list.component';
import { QuotationSalesAddComponent } from './quotation/quotation-sales-add/quotation-sales-add.component';
import { PricesService } from './services/prices/prices.service';
import { FinancialCommitmentService } from './services/financial-commitment/financial-commitment.service';
import { DeadLineDocumentService } from './services/dead-line-document/dead-line-document.service';
import { ShowDetailSettlementComponent } from './components/show-detail-settlement/show-detail-settlement.component';
import { CrudGridService } from './services/document-line/crud-grid.service';
import { BillingSessionEmployeesComponent } from './billing-session/billing-session-employees/billing-session-employees.component';
// tslint:disable-next-line:max-line-length
import { ListProjectComponent } from './project/list-project/list-project.component';
import { AddProjectComponent } from './project/add-project/add-project.component';
import { ConsultantAssignmentComponent } from './project/consultant-assignment/consultant-assignment.component';
import { ProjectService } from './services/project/project.service';
import { ValidateCraComponent } from './billing-session/validate-cra/validate-cra.component';
import { BillingSessionService } from './services/billing-session/billing-session.service';
import { ExchangeEmployeeProjectsDataService } from './services/exchange-employee-projects-data/exchange-employee-projects-data.service';
import { DocumentsGeneratedListComponent } from './billing-session/documents-generated-list/documents-generated-list.component';
import { StockDocumentsService } from '../inventory/services/stock-documents/stock-documents.service';
import { ReportingInModalComponent } from '../shared/components/reports/reporting-in-modal/reporting-in-modal.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TaxeService } from '../administration/services/taxe/taxe.service';

import { SearchItemListComponent } from './search-item/search-item-list/search-item-list.component';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { InventoryModule } from '../inventory/inventory.module';
import { SettlementModeListComponent } from '../payment/settlement-mode-list/settlement-mode-list.component';
import { SettlementModeAddComponent } from '../payment/settlement-mode-add/settlement-mode-add.component';
import { DetailsSettlementModeService } from '../payment/services/payment-method/DetailsSettlementMode.service';
import { GridSalesInvoiceAssestsComponent } from './components/grid-sales-invoice-assests/grid-sales-invoice-assests.component';
import { StarkPermissionsGuard } from '../stark-permissions/stark-permissions.module';
import { ValidInvoiceAssetListComponent } from './valid-invoice-asset/valid-invoice-asset-list/valid-invoice-asset-list.component';
import { InvoiceAssetsComponent } from './invoice-asset/invoice-assets/invoice-assets.component';
import { ListInvoiceAssetsComponent } from './invoice-asset/list-invoice-assets/list-invoice-assets.component';
import { SearchItemAddComponent } from './search-item/search-item-add/search-item-add.component';
import { AssignementModalComponent } from './components/assignment-modal/assignment-modal.component';
import { EmployeeProjectService } from './services/employee-project/employee-project.service';
import { ListBillingSessionComponent } from './billing-session/list-billing-session/list-billing-session.component';
import { TimesheetValidationService } from '../rh/services/timesheet-validation/timesheet-validation.service';
import { BillingEmployeeService } from './services/billing-employee/billing-employee.service';
import { DocumentWithholdingTaxService } from './services/document-withholding-tax/document-withholding-tax.service';
import { CardCustomerComponent } from './customer/card-customer/card-customer.component';
import { DocumentUtilityService } from '../treasury/services/document-utility.service';
import {TiersResolverService} from '../purchase/resolvers/tiers-resolver.service';
import {PagerModule} from '@progress/kendo-angular-pager';
import { WithholdingTaxService } from '../shared/services/withholding-tax/withholding-tax.service';
import { BehaviorSubjectService } from '../accounting/services/reporting/behavior-subject.service';
import { PriceCustomersCardListComponent } from './components/price-customers-card-list/price-customers-card-list.component';
import { PriceItemsCardListComponent } from './components/price-items-card-list/price-items-card-list.component';
import { PriceQuantityDiscountListComponent } from './components/price-quantity-discount-list/price-quantity-discount-list.component';
import { PriceTotalPurchasesDiscountListComponent
 } from './components/price-total-purchases-discount-list/price-total-purchases-discount-list.component';
import { PriceSpecialPriceDiscountListComponent
 } from './components/price-special-price-discount-list/price-special-price-discount-list.component';
import { PriceGiftedItemsDiscountListComponent
 } from './components/price-gifted-items-discount-list/price-gifted-items-discount-list.component';
import { PriceCustomersAffectionListComponent } from './components/price-customers-affection-list/price-customers-affection-list.component';
import { PriceItemsAffectionListComponent } from './components/price-items-affection-list/price-items-affection-list.component';
import { PriceQuantityDiscountComponent } from './components/price-quantity-discount/price-quantity-discount.component';
import { PriceGiftedItemsDiscountComponent } from './components/price-gifted-items-discount/price-gifted-items-discount.component';
import { PriceSpecialPriceDiscountComponent } from './components/price-special-price-discount/price-special-price-discount.component';
import { PriceTotalPurchasesDiscountComponent } from './components/price-total-purchases-discount/price-total-purchases-discount.component';
import {CustomerResolverService} from './resolvers/customer-resolver.service';
import { CounterSalesComponent } from './counter-sales/counter-sales/counter-sales.component';
import { CounterSalesDetailsComponent } from './counter-sales/counter-sales-details/counter-sales-details.component';
import { TicketService } from '../treasury/services/ticket/ticket.service';
import { SessionCashService } from '../treasury/services/session-cash/session-cash.service';
import { TicketPaymentService } from '../treasury/services/ticket-payment/ticket-payment.service';

import { AddSalesPriceComponent } from './sales-price/add-sales-price/add-sales-price.component';
import { ListSalesPriceComponent } from './sales-price/list-sales-price/list-sales-price.component';
import { SalesPriceService } from './services/sales-price/sales-price.service';
import { ItemSalesPriceService } from './services/item-sales-price/item-sales-price.service';
import { VehicleDropdownComponent } from './components/vehicle-dropdown/vehicle-dropdown.component';
import { VehicleService } from '../shared/services/vehicle/vehicle.service';
import { CashRegisterTicketComponent } from '../treasury/cash-management/cash-registers/cash-register-ticket/cash-register-ticket.component';
import { CloseCashRegisterSessionComponent } from '../treasury/cash-management/cash-registers/close-cash-register-session/close-cash-register-session.component';
import { AddSettlementComponent } from '../treasury/components/add-settlement/add-settlement.component';
import { AccordionModule } from 'primeng/accordion';
import { OpenCashRegisterSessionComponent } from '../treasury/cash-management/cash-registers/open-cash-register-session/open-cash-register-session.component';
import { CashRegisterService } from '../treasury/services/cash-register/cash-register.service';
@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    LayoutModule,
    InventoryModule,
    NgbModule.forRoot(),
    PagerModule,
    AccordionModule
  ],
  declarations: [
    TierCategoryComponent,
    DeliveryFormsAddComponent,
    AddCustomerComponent,
    ListCustomerComponent,
    AddCustomerComponent,
    ListCustomerComponent,
    AssetAddComponent,
    AssetListComponent,
    SalesOrderListComponent,
    SalesOrderAddComponent,
    PriceAddComponent,
    PriceListComponent,
    QuotationSalesAddComponent,
    ShowDetailSettlementComponent,
    BillingSessionEmployeesComponent,
    ListProjectComponent,
    AddProjectComponent,
    ConsultantAssignmentComponent,
    ValidateCraComponent,
    DocumentsGeneratedListComponent,
    AssignementModalComponent,
    SearchItemListComponent,
    SearchItemAddComponent,
    ValidInvoiceAssetListComponent,
    InvoiceAssetsComponent,
    ListInvoiceAssetsComponent,
    ListBillingSessionComponent,
    CardCustomerComponent,
    PriceCustomersCardListComponent,
    PriceItemsCardListComponent,
    PriceQuantityDiscountListComponent,
    PriceTotalPurchasesDiscountListComponent,
    PriceSpecialPriceDiscountListComponent,
    PriceGiftedItemsDiscountListComponent,
    PriceCustomersAffectionListComponent,
    PriceItemsAffectionListComponent,
    PriceQuantityDiscountComponent,
    PriceGiftedItemsDiscountComponent,
    PriceSpecialPriceDiscountComponent,
    PriceTotalPurchasesDiscountComponent,
    CounterSalesComponent,
    CounterSalesDetailsComponent,
    AddSalesPriceComponent,
    ListSalesPriceComponent,
    AddSalesPriceComponent,
    ListSalesPriceComponent,
    PriceTotalPurchasesDiscountComponent,
    TierCategoryAddComponent,
    VehicleDropdownComponent
  ],
  providers: [
    TaxeService,
    TimesheetValidationService,
    TaxeGroupTiersService,
    DocumentService,
    DocumentLineService,
    PricesService,
    FinancialCommitmentService,
    DeadLineDocumentService,
    StockDocumentsService,
    CrudGridService,
    BillingSessionService,
    ExchangeEmployeeProjectsDataService,
    ProjectService,
    StarkPermissionsGuard,
    EmployeeProjectService,
    DetailsSettlementModeService,
    BillingEmployeeService,
    WithholdingTaxService,
    DocumentWithholdingTaxService,
    DocumentUtilityService,
    BehaviorSubjectService,
    DocumentUtilityService,
    TiersResolverService,
    CustomerResolverService,
    TicketService,
    SessionCashService,
    TicketPaymentService,
    SalesPriceService,
    ItemSalesPriceService,
    VehicleService,
    CashRegisterService
  ],
  entryComponents: [
    SearchItemAddComponent,
    ReportingInModalComponent,
    ShowDetailSettlementComponent,
    AssignementModalComponent,
    SettlementModeListComponent,
    SettlementModeAddComponent,
    PriceCustomersAffectionListComponent,
    PriceItemsAffectionListComponent,
    PriceItemsCardListComponent,
    PriceCustomersCardListComponent,
    CashRegisterTicketComponent,
    CloseCashRegisterSessionComponent,
    AddSettlementComponent,
    OpenCashRegisterSessionComponent
  ],
  exports: [
    RouterModule,
    GridSalesInvoiceAssestsComponent,
    AccordionModule
  ]

})
export class SalesModule { }
