import { NgModule } from '@angular/core';
import { EcommerceRoutingModule } from './ecommerce-routing.module';
import { ProductEcommerceComponent } from './product-ecommerce/product-ecommerce.component';
import { CustomerEcommerceComponent } from './customer-ecommerce/customer-ecommerce.component';
import { SharedModule } from '../shared/shared.module';
import { NgxBarcodeModule } from 'ngx-barcode';
import { AdministrationModule } from '../administration/administration.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MouvementEcommerceComponent } from './mouvement-ecommerce/mouvement-ecommerce.component';
import { AddMouvementEcommerceComponent } from './add-mouvement-ecommerce/add-mouvement-ecommerce.component';
import { StockDocumentsService } from '../inventory/services/stock-documents/stock-documents.service';
import { SearchItemEcommerceComponent } from './search-item-ecommerce/search-item-ecommerce.component';
import { MenuEcommerceComponent } from './menu-ecommerce/menu-ecommerce.component';
import { SendProductEcommerceComponent } from './send-product-ecommerce/send-product-ecommerce.component';
import { ErrorSendProductEcommerceComponent } from './error-send-product-ecommerce/error-send-product-ecommerce.component';
import { JobTableService } from './services/job-table/job-table.service';
import { EcommerceCustomerService } from './services/ecommerce-customer/ecommerce-customer.service';
import { LogService } from './services/log/log.service';
import { EcommerceProductService } from './services/ecommerce-product/ecommerce-product.service';
import { ErrorSalesDeliveryGenerationListComponent } from './error-sales-delivery-generation-list/error-sales-delivery-generation-list.component';
import { EcommerceSalesDeliveryService } from './services/ecommerce-sales-delivery/ecommerce-sales-delivery.service';
import { DeliveryEcommerceComponent } from './delivery-ecommerce/delivery-ecommerce.component';
import { DeliveryService } from './services/ecommerce-delivery/delivery.service';
import { StarkPermissionsGuard } from '../stark-permissions/stark-permissions.module';
import { SharedEcommerceService } from './services/shared-ecommerce/shared-ecommerce.service';

@NgModule({
  imports: [
    EcommerceRoutingModule,
    SharedModule,
    NgxBarcodeModule,
    AdministrationModule,
    NgbModule.forRoot()
  ],
  declarations: [
    CustomerEcommerceComponent,
    ProductEcommerceComponent,
    MouvementEcommerceComponent,
    AddMouvementEcommerceComponent,
    SearchItemEcommerceComponent,
    SendProductEcommerceComponent,
    ErrorSendProductEcommerceComponent,
    ErrorSalesDeliveryGenerationListComponent,
    DeliveryEcommerceComponent
  ],
  providers: [
    StockDocumentsService,
    JobTableService,
    EcommerceCustomerService,
    LogService,
    EcommerceProductService,
    StarkPermissionsGuard,
    EcommerceSalesDeliveryService,
    DeliveryService,
    SharedEcommerceService
  ],
  entryComponents: [

  ]
})
export class EcommerceModule { }
