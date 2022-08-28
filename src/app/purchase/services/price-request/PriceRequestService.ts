import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../../../COM/config/app.config';
import { ResourceService } from '../../../shared/services/resource/resource.service';
import { ObjectToOrder } from '../../../models/purchase/object-to-order';
import { Observable } from 'rxjs/Observable';
import { Operation } from '../../../../COM/Models/operations';
import { PriceRequest } from '../../../models/purchase/price-request.model';
import { InformationTypeEnum } from '../../../shared/services/signalr/information/information.enum';
import { DocumentLineWithPriceRequest } from '../../../models/sales/document-line-with-request-price.model';
import { PredicateFormat } from '../../../shared/utils/predicate';
import { PurchaseBudgetPriceRequest } from '../../../models/sales/purchase-budget-price-request.model';
import { PriceRequestWithPredicateFormat } from '../../../models/sales/price-request-with-predicate-format.models';
import { DocumentLineWithSupplier } from '../../../models/purchase/document-line-with-supplier.model';
import { DocumentLine } from '../../../models/sales/document-line.model';

@Injectable()
export class PriceRequestService extends ResourceService<PriceRequest> {
    constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
        super(
            httpClient, appConfig,
            'PriceRequest', 'PriceRequest', 'Sales');
    }
    public CreatePriceRquestFromProvisionning(data: Array<ObjectToOrder>): Observable<any> {
        return this.callService(Operation.POST, 'createPriceRquestFromProvisionning', data);
    }
    public generatePurchaseOrder(data: DocumentLineWithPriceRequest): Observable<any> {
        return this.callService(Operation.POST, 'generatePurchaseOrderFromPriceRequest', data);
    }
    public updatePriceRequest(data: PriceRequest): Observable<any> {
        return this.callService(Operation.POST, 'updatePriceRequest', data);
    }

    public getPurchaseBudget(prdicate: PredicateFormat): Observable<any> {
        return this.callService(Operation.POST, 'getPurchaseBudget', prdicate);
    }

    public SendPriceRequestMail(idPriceRequest: number, informationType: InformationTypeEnum): Observable<any> {
        const data = {};
        data['idPriceRequest'] = idPriceRequest;
        data['informationType'] = informationType;
        data['url'] = location.origin + '/main';
        return this.callService(Operation.POST, 'sendPriceRequestMail', data);
    }
    public getPurchaseBudgetPriceRequest(purchaseBudgetPriceRequest: PurchaseBudgetPriceRequest): Observable<any> {
        return this.callService(Operation.POST, 'getPurchaseBudgetPriceRequest', purchaseBudgetPriceRequest);
    }
    public generatePurchaseOrderFromPriceRequest(documentLineWithSupplier: Array<DocumentLineWithSupplier>): Observable<any> {
        return this.callService(Operation.POST, 'generatePurchaseOrderFromPriceRequest', documentLineWithSupplier);
    }
}
