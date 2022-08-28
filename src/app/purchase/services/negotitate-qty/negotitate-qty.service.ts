import { Injectable, Inject, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../../../COM/config/app.config';
import { ResourceService } from '../../../shared/services/resource/resource.service';
import { NegotitateQty } from '../../../models/purchase/negotitate-qty.model';
import { Observable } from 'rxjs/Observable';
import { Operation } from '../../../../COM/Models/operations';
import { PredicateFormat } from '../../../shared/utils/predicate';
// import { Subject } from 'rxjs';

@Injectable()
export class NegotitateQtyService extends ResourceService<NegotitateQty> {
  // public refreshQuotations = new Subject<any>();

    public serviceHasEmitData: boolean;
    constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
        super(
            httpClient, appConfig,
            'DocumentLineNegotiationOptionsController', 'DocumentLineNegotiationOptions', 'Sales');
    }
    public loadItems = new EventEmitter<number>();
    public addNegotiationOption(negotitateQty: NegotitateQty): Observable<any> {
        return this.callService(Operation.POST, 'addNegotiationOption', negotitateQty);
    }
    public acceptOrRejectPrice(negotitateQty: NegotitateQty): Observable<any> {
        return this.callService(Operation.POST, 'acceptOrRejectPrice', negotitateQty);
    }
    public printNegotiation(idDocumentLine: number): Observable<any> {
        return this.callService(Operation.POST, 'printNegotiation', idDocumentLine);
    }

  public loadGridLinesAfterSavePrices(idDocument) {
    this.serviceHasEmitData = false;
    this.loadItems.emit(idDocument);
  }

  public getListNegotiationByItem(state, predicate): Observable<any> {
    const pred: PredicateFormat = predicate ? JSON.parse(JSON.stringify(predicate)) : new PredicateFormat();
    this.prepareServerOptions(state, pred);
    return this.callService(Operation.POST, 'getListNegotiationByItem', pred);
  }
  // show(data: any) {
  //   this.refreshQuotations.next({value: true, data: data});
  // }
  // getResult(): Observable<any> {
  //   return this.refreshQuotations.asObservable();
  // }
}
