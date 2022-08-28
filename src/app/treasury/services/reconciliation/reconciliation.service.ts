import { Injectable, Inject } from '@angular/core';
import { Reconciliation } from '../../../models/treasury/reconciliation.model';
import { ResourceService } from '../../../shared/services/resource/resource.service';
import { Observable } from 'rxjs/Observable';
import { Operation } from '../../../../COM/Models/operations';
import { BankAccountConstant } from '../../../constant/Administration/bank-account.constant';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../../../COM/config/app.config';
import { ObjectToSave } from '../../../models/shared/objectToSend';

@Injectable()
export class ReconciliationService extends ResourceService<Reconciliation> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig, 'reconciliation', 'Reconciliation', 'Treasury');
  }

  cashSettlements(reconciliation: Reconciliation, settlementIds: Array<number>): Observable<any> {
    const data: any = {};
    data[BankAccountConstant.RECONCILIATION] = reconciliation;
    data[BankAccountConstant.SETTLEMENT_IDS] = settlementIds;
    const objectToSave: ObjectToSave = new ObjectToSave();
    objectToSave.Model = data;
    return this.callService(Operation.POST, BankAccountConstant.CASH_SETTLEMENTS, objectToSave);
  }

}
