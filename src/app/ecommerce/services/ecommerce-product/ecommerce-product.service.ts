import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ResourceService } from '../../../shared/services/resource/resource.service';
import { AppConfig } from '../../../../COM/config/app.config';
import { Operation } from '../../../../COM/Models/operations';
import { EcommerceConstant } from '../../../constant/ecommerce/ecommerce.constant';
import { DataTransferShowSpinnerService } from '../../../shared/services/spinner/data-transfer-show-spinner.service';

@Injectable()
export class EcommerceProductService extends ResourceService<null> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig,
  @Inject(DataTransferShowSpinnerService) dataTransferShowSpinnerService) {
    super(httpClient, appConfig, 'ecommerceProduct', null, 'Ecommerce', dataTransferShowSpinnerService);
  }

  public synchronizeProducts(productsList: any): Observable<any> {

    const stringData = JSON.stringify({ 'Products': productsList });

    return this.callService(Operation.POST, EcommerceConstant.URI_SYNCH_PRODUCTS, stringData);

  }

  public synchronizeAllProductsDetails(productsList: any): Observable<any> {

    const stringData = JSON.stringify({ 'Products': productsList });

    return this.callService(Operation.POST, EcommerceConstant.URI_SYNCH_ALL_PRODUCTS_DETAILS, stringData);

  }

  public synchronizeAllProductsDetailsNow(): Observable<any> {

    return this.callService(Operation.POST, EcommerceConstant.URI_SYNCH_ALL_PRODUCTS_DETAILS_NOW, null, null, true);

  }
  public synchronizeWithEcommerce(listidItem: any): Observable<any> {
    return this.callService(Operation.POST,EcommerceConstant.SYNCHRONIZE_WITH_MAGENTO, listidItem);
  }
  public ecommerceGetDeliveryForms(): Observable<any> {
    return this.callService(Operation.GET, EcommerceConstant.ECOMMERCE_GET_DELIVERY_FORMS);
  }
  public AddTotalShipmentFromMagento(documentId:any): Observable<any> {
    return this.callService(Operation.POST, EcommerceConstant.ADD_TOTAL_SHIPMENT_FROM_MAGENTO,documentId);
  }
  public AddInvoiceToMagento(documentId:any): Observable<any> {
    return this.callService(Operation.POST, EcommerceConstant.ADD_INVOICE,documentId);
  }
  public AddCategoryFromMagento(category:any): Observable<any> {
    return this.callService(Operation.POST, EcommerceConstant.ADD_CATEGORY_FROM_MAGENTO,category);
  }
  public UpdateCategoryFromMagento(category:any): Observable<any> {
    return this.callService(Operation.PUT, EcommerceConstant.UPDATE_CATEGORY_FROM_MAGENTO,category);
  }
  public AddSubCategoryFromMagento(category:any): Observable<any> {
    return this.callService(Operation.POST,EcommerceConstant.ADD_SUB_CATEGORY_FROM_MAGENTO,category);
  }
  public UpdateSubCategoryFromMagento(category:any): Observable<any> {
    return this.callService(Operation.PUT, EcommerceConstant.UPDATE_SUB_CATEGORY_FROM_MAGENTO,category);
  }


}
