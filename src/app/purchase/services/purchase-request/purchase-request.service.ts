import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { DataResult, DataSourceRequestState } from '@progress/kendo-data-query';
import { ResourceService } from '../../../shared/services/resource/resource.service';
import { PurchaseRequest } from '../../../models/purchase/purchase-request.model';
import { AppConfig } from '../../../../COM/config/app.config';
import { PredicateFormat } from '../../../shared/utils/predicate';
import { Operation } from '../../../../COM/Models/operations';
import { ObjectToSave as os } from '../../../models/shared/objectToSend';
const GET_REQUEST_LIST = 'getRequestList';
const GET_ITEM_DETAILS = 'getItemDetails';
const GET_DOCUMENT_WITH_DOCUMENT_LINE = 'getDocumentWithDocumentLine/';
const REJECT = 'validateOrReject';
const GENERATE_PURCHASE_ORDER = 'generatePurchaseOrder';
const GENERATE_PRICE_REQUEST = 'generatePriceRequest';

@Injectable()
export class PurchaseRequestService extends ResourceService<PurchaseRequest> {
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig, 'document', 'Document', 'Sales');
  }

  /**
  * HttpGet element by Id, return
  * @param id
  * @returns Observable
  */
  public getDocumentWithDocumentLine(id: any): Observable<any> {
    return this.callService(Operation.GET, GET_DOCUMENT_WITH_DOCUMENT_LINE.concat(id));
  }

  public getItemDetails(idItem: number): Observable<any> {
    return this.callService(Operation.POST, GET_ITEM_DETAILS, idItem);
  }

  public validateOrRejectDocument(data: os): Observable<any> {
    return this.callService(Operation.POST, REJECT, data);
  }

  public validateDocumentAndGenerate(data: os): Observable<any> {
    return this.callService(Operation.POST, GENERATE_PURCHASE_ORDER, data);
  }

  public validateDocumentAndGeneratePriceRequest(data: os): Observable<any> {
    return this.callService(Operation.POST, GENERATE_PRICE_REQUEST, data);
  }

  public getRequestList(state: DataSourceRequestState, predicate: PredicateFormat): Observable<DataResult> {
    const pred: PredicateFormat = predicate ? JSON.parse(JSON.stringify(predicate)) : new PredicateFormat();
    this.prepareServerOptions(state, pred);
    return this.callService(Operation.POST, GET_REQUEST_LIST, pred).map(
      ({ listData, total }: any) =>
        <GridDataResult>{
          data: listData,
          total: total
        }
    );
  }
}
