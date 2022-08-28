import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Loan} from '../../../models/payroll/loan.model';
import {AppConfig} from '../../../../COM/config/app.config';
import {Observable} from 'rxjs/Observable';
import {Operation} from '../../../../COM/Models/operations';
import {LoanConstant} from '../../../constant/payroll/loan.constant';
import { ResourceServiceRhPaie } from '../../../shared/services/resource/resource.service.rhpaie';

@Injectable()
export class LoanService extends ResourceServiceRhPaie<Loan> {
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(
      httpClient, appConfig,
      'loan', 'Loan', 'PayRoll');
  }

  public validateRequest(data): Observable<any> {
    return this.callService(Operation.POST, LoanConstant.VALIDATE_API_URL, data);
  }

  public getNetToPay(data): Observable<any> {
    return this.callService(Operation.POST, LoanConstant.GET_NET_TO_PAY, data);
  }
}
