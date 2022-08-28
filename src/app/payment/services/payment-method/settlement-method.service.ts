import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResourceService } from '../../../shared/services/resource/resource.service';
import { AppConfig } from '../../../../COM/config/app.config';
import { PaymentMode } from '../../../models/payment/payment-mode';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class SettlementMethodService extends ResourceService<PaymentMode> {
    public showAddedSettlement = new Subject<any>();

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig, 'base', 'SettlementMode', 'Sales');
  }

  show(data: any) {
    this.showAddedSettlement.next({value: true, data: data});

  }
  getResult(): Observable<any> {

    return this.showAddedSettlement.asObservable();
  }

}
