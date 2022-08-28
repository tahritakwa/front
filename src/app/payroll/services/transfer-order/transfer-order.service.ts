import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../../../COM/config/app.config';
import { TransferOrder } from '../../../models/payroll/transfer-order.model';
import { Observable } from 'rxjs/Observable';
import { Operation } from '../../../../COM/Models/operations';
import { TransferOrderConstant } from '../../../constant/payroll/transfer-order.constant';
import { ResourceServiceRhPaie } from '../../../shared/services/resource/resource.service.rhpaie';

@Injectable()
export class TransferOrderService extends ResourceServiceRhPaie<TransferOrder> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(
      httpClient, appConfig,
      'transferOrder', 'TransferOrder', 'PayRoll');
  }

  /**
   * Get list of contract not associate with any transfer order for current session
   * @param id
   */
  public getEmplpoyeesWithoutTransferOrder(idTransferOrder: number): Observable<any> {
    return this.callService(Operation.GET, TransferOrderConstant.GET_EMPLOYEES_WITHOUT_TRANSFER_ORDER.concat(idTransferOrder.toString()));
  }

  public generate(model: TransferOrder): Observable<any>  {
    return super.callService(Operation.POST, TransferOrderConstant.GENERATE_TRANSFERORDER, model) as Observable<any>;
  }

  public closeTransferOrder(idTransferOrder): Observable<any> {
    return this.callService(Operation.GET, TransferOrderConstant.CLOSE_TRANSFER_ORDER_URL.concat(idTransferOrder.toString()));
}


}
