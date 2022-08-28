import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { DataResult, DataSourceRequestState } from '@progress/kendo-data-query';
import { Observable } from 'rxjs';
import { AppConfig } from '../../../../COM/config/app.config';
import { Operation } from '../../../../COM/Models/operations';
import { EcommerceConstant } from '../../../constant/ecommerce/ecommerce.constant';
import { ItemConstant } from '../../../constant/inventory/item.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { ItemFilterPeerWarehouse } from '../../../models/inventory/item-filter-peer-warehouse.model';
import { ItemWarehouse } from '../../../models/inventory/item-warehouse.model';
import { Item } from '../../../models/inventory/item.model';
import { DocumentLinesWithPaging } from '../../../models/sales/document-lines-with-paging.model';
import { FiltersItemDropdown } from '../../../models/shared/filters-item-dropdown.model';
import { ObjectToSave } from '../../../models/shared/objectToSend';
import { ResourceService } from '../../../shared/services/resource/resource.service';
import { PredicateFormat } from '../../../shared/utils/predicate';
export const linesToAdd = [];
@Injectable()
export class SharedEcommerceService extends ResourceService<null> {
  TecDoc: boolean;
  public lineData: any[] = linesToAdd;
  public counter: number = linesToAdd.length;
  public ObjectToSend: any[] = [];
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig, 'SharedEcommerce', null, 'Ecommerce');
  }
  
  OnDestroy() {
    this.lineData = [];
    this.ObjectToSend = [];
    this.counter = NumberConstant.ZERO;
  }
  public LinesToAdd(): any[] {
    return this.lineData;
  }


  public warehouseFilterWithoutSpinner(state: DataSourceRequestState,
    predicate?: PredicateFormat, filtersItemDropdown?: FiltersItemDropdown): Observable<any> {
    const pred = this.preparePrediacteFormat(state, predicate);
    let dataToSend = new ItemFilterPeerWarehouse(pred, filtersItemDropdown);
    return this.callService(Operation.POST, EcommerceConstant.WAREHOUSEFILTER, dataToSend,null,true) as Observable<any>;
  }
  public warehouseFilter(state: DataSourceRequestState,
    predicate?: PredicateFormat, filtersItemDropdown?: FiltersItemDropdown): Observable<any> {
    const pred = this.preparePrediacteFormat(state, predicate);
    let dataToSend = new ItemFilterPeerWarehouse(pred, filtersItemDropdown);
    return this.callService(Operation.POST, EcommerceConstant.WAREHOUSEFILTER, dataToSend) as Observable<any>;
  }
  /**
   * get Item Warehouse
   * @param data 
   * @param serviceName 
   */
  public getItemWarhouse(data, serviceName): Observable<any> {
    return super.callService(Operation.POST, serviceName, data);
  }


 
  public uploadEmployee(file): Observable<any> {
    return super.callService(Operation.POST, 'importFileItems', file);
  }
  public getStockDocumentWithStockDocumentLine(documentLinesWithPaging: DocumentLinesWithPaging): Observable<DataResult> {

    return this.callService(Operation.POST, EcommerceConstant.GET_STOCK_DOCUMENT_WITH_STOCK_DOCUMENT_LINE, documentLinesWithPaging).map(
      (listObject: any) =>
        <GridDataResult>{
          data: listObject.listData,
          total: listObject.total
        }
    );

  }
  public saveStockDocumentLineInRealTime(data: ObjectToSave): Observable<any> {
    return this.callService(Operation.POST, EcommerceConstant.INSERT_STOCK_DOCUMENT_IN_REAL_TIME, data);
  }
  public validateEcommerceTransfertMovement(id: number): Observable<any> {
    return this.callService(Operation.POST, EcommerceConstant.VALIDATE_ECOMMERCE_TRANSFERT_MOVEMENT, id);
  }
  public transfertValidateStockDocumentFromEcommerce(data: ObjectToSave): Observable<any> {
    return this.callService(Operation.POST, EcommerceConstant.TRANSFERT_VALIDATE_STOCK_DOCUMENT_FROM_Ecommerce, data);
  }
  public receiveValidateStockDocument(data: ObjectToSave): Observable<any> {
    return this.callService(Operation.POST, EcommerceConstant.RECIEVE_VALIDATE_STOCK_DOCUMENT, data);
  }
  public ecommerceValidateStockDocument(data: ObjectToSave): Observable<any> {
    return this.callService(Operation.POST, EcommerceConstant.ECOMMERCE_STOCK_DOCUMENT, data);
  }
  public removeDocumentLineInRealTime(id: any): Observable<any> {
    return super.callService(Operation.POST, EcommerceConstant.DELETE_LINE_IN_REAL_TIME, id);
  }
  public getItemQtyInWarehouse(data: ObjectToSave): Observable<any> {
    return this.callService(Operation.POST, EcommerceConstant.GET_ITEM_QTE_WAREHOUSE, data);
  }
  public saveStockDocumentInRealTime(data: ObjectToSave): Observable<any> {
    return this.callService(Operation.POST, EcommerceConstant.INSERT_STOCK_DOCUMENT_REAL_TIME, data);
  }
}
