import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../../../COM/config/app.config';
import { ResourceService } from '../../../shared/services/resource/resource.service';
import { FundsTransfer } from '../../../models/treasury/funds-transfer.model';
import { Observable } from 'rxjs/Observable';
import { Operation } from '../../../../COM/Models/operations';
import { FundsTransferConstant } from '../../../constant/treasury/funds-transfer.constant';

@Injectable()
export class FundsTransferService extends ResourceService<FundsTransfer>{

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig, 'fundsTransfer', 'FundsTransfer', 'Payment');
  }
  public getSourceCashDropdown(transferType?: number): Observable<any> {
    return this.callService(Operation.POST, FundsTransferConstant.GET_SOURCE_BY_TYPE, transferType);
  }
  public getDestinationCashDropdown(transferType?: number): Observable<any> {
    return this.callService(Operation.POST, FundsTransferConstant.GET_DESTINATION_BY_TYPE, transferType);
  }
}