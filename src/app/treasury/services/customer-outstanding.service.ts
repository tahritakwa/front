import { Injectable, Inject } from '@angular/core';
import { ResourceService } from '../../shared/services/resource/resource.service';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../../COM/config/app.config';
import { Observable } from 'rxjs/Observable';
import { PredicateFormat } from '../../shared/utils/predicate';
import { DataSourceRequestState } from '@progress/kendo-data-query';
import { TreasuryConstant } from '../../constant/treasury/treasury.constant';
import { Operation } from '../../../COM/Models/operations';
import { IntermediateSettlementGeneration } from '../../models/payment/intermediate-settlement-generation.model';
import { ObjectToSend } from '../../models/sales/object-to-save.model';
import { FinancialCommitment } from '../../models/sales/financial-commitment.model';
const PREDICATE = 'predicate';
const TIERS_TYPE = 'tiersType';
const DOCUMENT_TYPE = 'documentType';
@Injectable()
export class CustomerOutstandingService extends ResourceService<any> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig, 'outstandingDocument', 'OutstandingDocument', 'Treasury');
  }

  public processDataForDeliveryForm(state: DataSourceRequestState,
    predicate: PredicateFormat): Observable<any> {
    predicate = this.preparePrediacteFormat(state, predicate);
    return this.callService(Operation.POST, TreasuryConstant.GET_DELIVERY_FORM_CUSTOMER_OUT_STANDING_LIST, predicate);
  }

  public processDataForFinancialCommitment(state: DataSourceRequestState,
    predicate: PredicateFormat, tiersType: number, documentType: number): Observable<any> {
    predicate = this.preparePrediacteFormat(state, predicate);
    const data = {};
    data[PREDICATE] = predicate;
    data[TIERS_TYPE] = tiersType;
    data[DOCUMENT_TYPE] = documentType;
    const objectToSend: ObjectToSend = new ObjectToSend(data, null);
    return this.callService(Operation.POST, TreasuryConstant.GET_FINANCIAL_COMMITMENTt_CUSTOMER_OUTSTANDING_LIST, objectToSend);
  }

  public financialCommitmentInReceivableExpandedRows(state: DataSourceRequestState,
    predicate: PredicateFormat, tiersType: number, documentType: number): Observable<any> {
    predicate = this.preparePrediacteFormat(state, predicate);
    const data = {};
    data[PREDICATE] = predicate;
    data[TIERS_TYPE] = tiersType;
    data[DOCUMENT_TYPE] = documentType;
    const objectToSend: ObjectToSend = new ObjectToSend(data, null);
    return this.callService(Operation.POST, TreasuryConstant.FINANCIAL_COMMITMENT_IN_RECEIVABLE_EXPANDED_ROWS, objectToSend);
  }

  public processDataInvoicesNotTotallyPayed(state: DataSourceRequestState,
    predicate: PredicateFormat, tiersType: number): Observable<any> {
    predicate = this.preparePrediacteFormat(state, predicate);
    const data = {};
    data[PREDICATE] = predicate;
    data[TIERS_TYPE] = tiersType;
    const objectToSend: ObjectToSend = new ObjectToSend(data, null);
    return this.callService(Operation.POST, TreasuryConstant.GET_INVOICE_NOT_TOTALLY_PAYED_LIST, objectToSend);
  }
  public addSettlement(settlementToGenerate: IntermediateSettlementGeneration, isForPos: boolean): Observable<any> {
    const objectToSend: ObjectToSend = new ObjectToSend(settlementToGenerate, null);
    return this.callService(Operation.POST, isForPos? TreasuryConstant.GENERATE_SETTLEMENT_FROM_TICKET : TreasuryConstant.GENERATE_SETTLEMENT_FROM_CUSTOMER_OUTSTANDING, objectToSend);
  }

  public getTiersReceivables(data, page: number, pageSize: number, tiersType: number,
    deliveryFormNotBilled: boolean, unpaidFinancialCommitment: boolean): Observable<any> {
    data.Page = page;
    data.PageSize = pageSize;
    data.TiersType = tiersType;
    data.deliveryFormNotBilled = deliveryFormNotBilled;
    data.unpaidFinancialCommitment = unpaidFinancialCommitment;
    const objectToSend: ObjectToSend = new ObjectToSend(data, null);
    return this.callService(Operation.POST, TreasuryConstant.GET_TIERS_RECEIVABLES, objectToSend);
  }

  public sendInvoiceRevivalMail(outstandingDocumentViewModels: Array<FinancialCommitment>): Observable<any> {
    return this.callService(Operation.POST, TreasuryConstant.SEND_INVOICE_REVIVAL_MAIL, outstandingDocumentViewModels);
  }
}
