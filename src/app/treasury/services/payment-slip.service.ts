import { Inject } from '@angular/core';
import { ResourceService } from '../../shared/services/resource/resource.service';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../../COM/config/app.config';
import { PaymentSlip } from '../../models/treasury/payment-slip.model';
import { PredicateFormat } from '../../shared/utils/predicate';
import { Observable } from 'rxjs/Observable';
import { SettlementConstant } from '../../constant/payment/settlement.constant';
import { Operation } from '../../../COM/Models/operations';
import { TreasuryConstant } from '../../constant/treasury/treasury.constant';
import { DataSourceRequestState } from '@progress/kendo-data-query';
import { ObjectToSave } from '../../models/shared/objectToSend';
import { ObjectToSend } from '../../models/sales/object-to-save.model';
import { BankAccount } from '../../models/shared/bank-account.model';
import { BankAccountConstant } from '../../constant/Administration/bank-account.constant';


export class PaymentSlipService extends ResourceService<PaymentSlip> {
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig, 'paymentSlip', 'PaymentSlip', 'Payment');
  }

  public getPaymentSlip(state: DataSourceRequestState, startDate: Date, endDate: Date, predicate: PredicateFormat): Observable<any> {
    super.prepareServerOptions(state, predicate);
    const data: any = {};
    data[SettlementConstant.START_DATE] = startDate;
    data[SettlementConstant.END_DATE] = endDate;
    data[SettlementConstant.PREDICATE] = predicate;
    const objectToSave: ObjectToSave = new ObjectToSave();
    objectToSave.Model = data;
    return this.callService(Operation.POST, TreasuryConstant.GET_PAYMENT_SLIP, objectToSave);
  }

  public addPaymentSlip(paymentSlip: PaymentSlip, settlementIds: Array<number>): Observable<any> {
    const data: any = {};
    data[BankAccountConstant.PAYMENT_SLIP] = paymentSlip;
    data[BankAccountConstant.SETTLEMENT_IDS] = settlementIds;
    const objectToSave: ObjectToSave = new ObjectToSave();
    objectToSave.Model = data;
    return this.callService(Operation.POST, BankAccountConstant.ADD_PAYMENT_SLIP, objectToSave);
  }

  public deleteWithResetSettlementsState(data: PaymentSlip): Observable<any> {
    return this.callService(Operation.POST, TreasuryConstant.DELETE_PAYMENT_SLIP, data);
  }

  public validatePaymentSlip(paymentSlip: PaymentSlip, settlementIds: Array<number>): Observable<any> {
    const data: any = {};
    data[BankAccountConstant.PAYMENT_SLIP] = paymentSlip;
    data[BankAccountConstant.SETTLEMENT_IDS] = settlementIds;
    const objectToSave: ObjectToSave = new ObjectToSave();
    objectToSave.Model = data;
    return this.callService(Operation.POST, TreasuryConstant.VALIDATE_PAYMENT_SLIP, objectToSave);
  }
}
