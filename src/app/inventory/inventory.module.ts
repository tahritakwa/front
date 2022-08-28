import { AdministrationModule } from '../administration/administration.module';
import { NgModule } from '@angular/core';
import { InventoryRoutingModule } from './inventory.routing.module';
import { NgxBarcodeModule } from 'ngx-barcode';
import { AddproductComponent } from '../shared/components/item/add-item/add-product.component';
import { GerestockComponent } from './components/gerer-stock/gerer-stock.component';
import { ListProductsComponent } from '../shared/components/item/list-item/list-products.component';
import { ListProductsIndicationComponent } from './components/list-products-indication/list-products-indication.component';
import { AdvancedListProductsComponent } from './components/advanced-list-products/advanced-list-products.component';
import { ItemService } from './services/item/item.service';
import { WarehouseService } from './services/warehouse/warehouse.service';
import { WarehouseItemService } from './services/warehouse-item/warehouse-item.service';
import { ListTransferMovementComponent } from './stock-documents/transfer-movement/list-transfer-movement/list-transfer-movement.component';
import { AddTransferMovementComponent } from './stock-documents/transfer-movement/add-transfer-movement/add-transfer-movement.component';
import { StockDocumentsService } from './services/stock-documents/stock-documents.service';
import { BrandService } from './services/brand/brand.service';
import { FamilyService } from './services/family/family.service';
import { ModelOfItemService } from './services/model-of-item/model-of-item.service';
import { SubFamilyService } from './services/sub-family/sub-family.service';
import { SubModelService } from './services/sub-model/sub-model.service';
import { AddWarehouseComponent } from './warehouse/add-warehouse/add-warehouse.component';
import { AssignEquivalenceGroupComponent } from './components/assign-equivalence-group/assign-equivalence-group.component';
import { PopupAddWarehouseComponent } from './warehouse/popup-add-warehouse/popup-add-warehouse.component';
import { MeasureUnitListComponent } from './components/list-measure-unit/measure-unit-list.component';
import { AddDiscountGroupItemComponent } from './components/add-discount-group-item/add-discount-group-item.component';
import { AddSubModelComponent } from './components/add-sub-model/add-sub-model.component';
import { AddFamilyComponent } from './components/add-family/add-family.component';
import { AddSubFamilyComponent } from './components/add-sub-family/add-sub-family.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ListInventoryMovementComponent } from './Inventor-document/list-inventory-movement/list-inventory-movement.component';
import { AddInventoryMovementComponent } from './Inventor-document/add-inventory-movement/add-inventory-movement.component';
import { DetailsInventoryMovementComponent } from './Inventor-document/details-inventory-movement/details-inventory-movement.component';
import { ListTecDocComponent } from './components/list-tec-doc/list-tec-doc.component';
import { TecdocService } from './services/tecdoc/tecdoc.service';
import { TecDocAdvancedListProductComponent } from './components/tec-doc-advanced-list-product/tec-doc-advanced-list-product.component';
import { PopupInventoryDetailsValidateComponent } from './Inventor-document/popup-inventory-detailsvalidate/popup-inventory-detailsvalidate.component';
import { TecDocSyncStepperComponent } from './components/tec-doc-sync-stepper/tec-doc-sync-stepper.component';
import { InventorySearchItemComponent } from './components/inventory-search-item/inventory-search-item.component';
import { KitItemComponent } from './components/kit-item/kit-item.component';
import { ListDailyInventoryMovementComponent } from './Inventor-document/list-daily-inventory-movement/list-daily-inventory-movement.component';
import { ReplacementListProductComponent } from './components/replacement-list-product/replacement-list-product.component';
import { ListItemComponent } from './components/list-item/list-item.component';
import { SharedModule } from '../shared/shared.module';
import { ItemBrandComponent } from './components/item-brand/item-brand.component';
import { AddProductItemComponent } from './components/add-product-item/add-product-item.component';
import { SearchItemAddComponent } from '../sales/search-item/search-item-add/search-item-add.component';
import { ShelfAndStorageManageComponent } from './shelf-and-storage/list-shelf-and-storage-manage/shelf-and-storage-manage.component';
import { ShelfAndStorageManageGridComponent } from './components/shelf-and-storage-manage-grid/shelf-and-storage-manage-grid.component';
import { CrudGridService } from '../sales/services/document-line/crud-grid.service';
import { StarkPermissionsGuard, StarkPermissionsModule } from '../stark-permissions/stark-permissions.module';
import { TecdocDetailsComponent } from './components/tecdoc-details/tecdoc-details.component';
import { NgPipesModule } from 'ngx-pipes';
import { OemSynchronizeComponent } from './components/oem-synchronize/oem-synchronize.component';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { FetchProductsComponent } from './components/fetch-products/fetch-products.component';
import { ListFamilyComponent } from './list-family/list-family.component';
import { ListSubFamilyComponent } from './list-sub-family/list-sub-family.component';
import { ListBrandsComponent } from './list-brands/list-brands.component';
import { ListProductBrandComponent } from './list-product-brand/list-product-brand.component';
import { ListModelComponent } from './list-model/list-model.component';
import { ListSubModelsComponent } from './list-sub-models/list-sub-models.component';
import { ListExpenseItemsComponent } from './list-expense-items/list-expense-items.component';
import { AddExpenseComponent } from '../purchase/expense/add-expense/add-expense.component';
import { TecdocDetailsApiComponent } from './components/tecdoc-details-api/tecdoc-details-api.component';
import { InventoryDetailsListComponent } from './components/inventory-details-list/inventory-details-list.component';
import { NegotitateQtyService } from '../purchase/services/negotitate-qty/negotitate-qty.service';
import { OemService } from './services/oem/oem.service';
import { MassPrintInventoryComponent } from './Inventor-document/mass-print-inventory/mass-print-inventory.component';
import { AddEmployeeComponent } from '../payroll/employee/add-employee/add-employee.component';
import { QualificationService } from '../payroll/services/qualification/qualification.service';
import { ContractService } from '../payroll/services/contract/contract.service';
import { EmployeeTeamService } from '../payroll/services/employee-team/employee-team.service';
import { SearchBrandComponent } from './search-brand/search-brand.component';
import { AddUnitOfMeasureComponent } from './components/add-measure-of-unit/add-unit-of-measure.component';
import { SearchExpenseComponent } from './search-expense/search-expense.component';
import { InventoryDetailSearchComponent } from './inventory-detail-search/inventory-detail-search.component';
import { WarehouseOrgComponent } from './warehouse/warehouse-organigramme/warehouse-org.component';
import { WarehouseItemComponent } from './warehouse/warehouse-item/warehouse-item.component';
import { WarehouseCentralComponent } from './warehouse/warehouse-central/warehouse-central.component';
import { SearchItemWarehouseComponent } from './warehouse/search-item-warehouse/search-item-warehouse.component';
import { ShelfService } from './services/shelf/shelf.service';
import { WarehouseItemsDetailComponent } from './warehouse/warehouse-items-detail/warehouse-items-detail.component';
import { AddShelfAndStorageComponent } from './shelf-and-storage/add-shelf-and-storage/add-shelf-and-storage.component';
import { SearchShelfAndStorageComponent } from './shelf-and-storage/search-shelf-and-storage/search-shelf-and-storage.component';
import { AssociatedWarehouseGridComponent } from './associated-warehouse-grid/associated-warehouse-grid.component';
import { BodyModule, HeaderModule } from '@progress/kendo-angular-grid';
import { AddMeasureUnitComponent } from './components/add-measure-unit/add-measure-unit.component';
import { AddExpenseItemComponent } from './list-expense-items/add-expense-item/add-expense-item.component';
import { ItemCardComponent } from './item-card/item-card.component';
import { ItemFicheComponent } from './item-fiche/item-fiche.component';
import { ButtonModule } from 'primeng/button';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { StorageService } from './services/storage.service';
import { OemItemComponent } from '../inventory/components/oem-item/oem-item.component';
import { OemItemService } from '../inventory/services/oem-item/oem-item.service';
import { ItemSalesPriceService } from '../sales/services/item-sales-price/item-sales-price.service';
import {UnitOfMesureJavaService} from '../manufacturing/service/unit-of-mesure-java-service.service';
import { UserWarehouseService } from './services/user-warehouse/user-warehouse.service';
@NgModule({
  imports: [
    SharedModule,
    InventoryRoutingModule,
    NgxBarcodeModule,
    StarkPermissionsModule,
    AdministrationModule,
    NgPipesModule,
    LayoutModule,
    NgbModule.forRoot(),
    HeaderModule,
    BodyModule,
    ButtonModule,
    NgMultiSelectDropDownModule
  ],
  declarations: [
    AddproductComponent,
    GerestockComponent,
    FetchProductsComponent,
    ListProductsComponent,
    ListProductsIndicationComponent,
    AdvancedListProductsComponent,
    AddTransferMovementComponent,
    AddWarehouseComponent,
    AssignEquivalenceGroupComponent,
    AddWarehouseComponent,
    PopupAddWarehouseComponent,
    MeasureUnitListComponent,
    AddDiscountGroupItemComponent,
    AddSubModelComponent,
    AddFamilyComponent,
    AddSubFamilyComponent,
    ListInventoryMovementComponent,
    ListDailyInventoryMovementComponent,
    AddInventoryMovementComponent,
    PopupInventoryDetailsValidateComponent,
    InventorySearchItemComponent,
    DetailsInventoryMovementComponent,
    ListTecDocComponent,
    TecDocAdvancedListProductComponent,
    TecDocSyncStepperComponent,
    KitItemComponent,
    ReplacementListProductComponent,
    ListItemComponent,
    ItemBrandComponent,
    AddProductItemComponent,
    ShelfAndStorageManageComponent,
    ShelfAndStorageManageGridComponent,
    TecdocDetailsComponent,
    OemSynchronizeComponent,
    ListFamilyComponent,
    ListSubFamilyComponent,
    ListBrandsComponent,
    ListProductBrandComponent,
    ListModelComponent,
    ListSubModelsComponent,
    ListExpenseItemsComponent,
    InventoryDetailsListComponent,
    TecdocDetailsApiComponent,
    MassPrintInventoryComponent,
    SearchBrandComponent,
    AddUnitOfMeasureComponent,
    AddMeasureUnitComponent,
    SearchExpenseComponent,
    InventoryDetailSearchComponent,
    WarehouseOrgComponent,
    WarehouseItemComponent,
    WarehouseCentralComponent,
    SearchItemWarehouseComponent,
    WarehouseItemsDetailComponent,
    AddShelfAndStorageComponent,
    SearchShelfAndStorageComponent,
    AssociatedWarehouseGridComponent,
    MeasureUnitListComponent,
    AddExpenseItemComponent,
    AssociatedWarehouseGridComponent,
    ItemCardComponent,
    ItemFicheComponent,
    OemItemComponent
  ],
  exports: [
    ListProductsComponent,
    FetchProductsComponent,
    ListFamilyComponent,
    ListSubFamilyComponent,
    ListBrandsComponent,
    ListProductBrandComponent,
    ListModelComponent,
    ListSubModelsComponent,
    ListExpenseItemsComponent,
    InventoryDetailSearchComponent,
    AddExpenseItemComponent,
    ListItemComponent
  ],
  providers: [
    ItemService,
    WarehouseService,
    ShelfService,
    StorageService,
    WarehouseItemService,
    StockDocumentsService,
    BrandService,
    FamilyService,
    ModelOfItemService,
    SubFamilyService,
    SubModelService,
    TecdocService,
    FetchProductsComponent,
    StarkPermissionsGuard,
    CrudGridService,
    NgPipesModule,
    NegotitateQtyService,
    OemService,
    EmployeeTeamService,
    ContractService,
    QualificationService,
    OemItemService,
    ItemSalesPriceService,
    UnitOfMesureJavaService,
    UserWarehouseService
  ],
  entryComponents: [
    SearchItemAddComponent,
    FetchProductsComponent,
    PopupAddWarehouseComponent,
    MeasureUnitListComponent,
    AddDiscountGroupItemComponent,
    AddSubModelComponent,
    AddFamilyComponent,
    AddSubFamilyComponent,
    TecDocSyncStepperComponent,
    AddProductItemComponent,
    ListProductsComponent,
    AddExpenseComponent,
    AddEmployeeComponent,
    AddExpenseItemComponent,
    AddMeasureUnitComponent
  ]
})
export class InventoryModule {
}
