import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../../../COM/config/app.config';
import { CashRegister } from '../../../models/treasury/cash-register.model';
import { ResourceService } from '../../../shared/services/resource/resource.service';
import { Observable } from 'rxjs/Observable';
import { Operation } from '../../../../COM/Models/operations';
import { CashRegisterConstant } from '../../../constant/treasury/cash-register.constant';

@Injectable()
export class CashRegisterService extends ResourceService<CashRegister>{

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig, 'cashRegister', 'CashRegister', 'Payment');
  }

  public getCashRegisterHierarchy(): Observable<any> {
    return this.callService(Operation.GET, CashRegisterConstant.GET_CASH_REGISTER_HIERARCHY);
  }

  public getCentralCash (): Observable<any>{
    return this.callService(Operation.GET,CashRegisterConstant.GET_CENTRAL_CASH)
  }
  public getCashRegisterVisibility(): Observable<any>{
    return this.callService(Operation.GET, CashRegisterConstant.GET_CASH_REGISTER_VISIBILITY);
  }
}
