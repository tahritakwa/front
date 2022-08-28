import { Injectable, Inject } from '@angular/core';
import { AppConfig } from '../../../../COM/config/app.config';
import { HttpClient } from '@angular/common/http';
import { Operation } from '../../../../COM/Models/operations';
import { Observable } from 'rxjs/Observable';
import { BillingSession } from '../../../models/sales/billing-session.model';
import { BillingSessionConstant } from '../../../constant/sales/billing-session.constant';
import { PredicateFormat } from '../../../shared/utils/predicate';
import { DataSourceRequestState } from '@progress/kendo-data-query';
import { ObjectToSave } from '../../../models/shared/objectToSend';
import { ResourceServiceRhPaie } from '../../../shared/services/resource/resource.service.rhpaie';
@Injectable()
export class BillingSessionService extends ResourceServiceRhPaie<BillingSession> {
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(
      httpClient, appConfig,
      'billingSession', 'BillingSession', 'Sales');
  }

  public getTimeSheetDetailsByEmployee(id: number): Observable<any> {
    return this.callService(Operation.GET, BillingSessionConstant.GET_TIMESHEET_DETAILS_BY_EMPLOYEE.concat(id.toString()));
  }
  public getBillingSessionDetailsById(id: number): Observable<any> {
    return super.callService(Operation.GET, BillingSessionConstant.BILLING_SESSION_DETAILS.concat(id.toString()));
  }
  public getDocumentsGenerated(state: DataSourceRequestState, predicate: PredicateFormat): Observable<any> {
    super.prepareServerOptions(state, predicate);
    const data: any = {};
    data['predicate'] = predicate;
    const objectToSave: ObjectToSave = new ObjectToSave();
    objectToSave.Model = data;
    return this.callService(Operation.POST, BillingSessionConstant.GET_DOCUMENT_GENERATED, objectToSave);
  }

  public generateInvoiceFromBillingSession(idBillingSession: number): Observable<any> {
    return this.callService(Operation.GET, BillingSessionConstant.GENERATE_INVOICE_FROM_BILLING_SESSION.concat(idBillingSession.toString()));
  }

}
