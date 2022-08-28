import { Injectable, Inject } from '@angular/core';
import { ResourceService } from '../../../shared/services/resource/resource.service';
import { Contact } from '../../../models/shared/contact.model';
import { AppConfig } from '../../../../COM/config/app.config';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Operation } from '../../../../COM/Models/operations';
import { FinancialCommitmentConstant } from '../../../constant/sales/financial-commitment.constant';

@Injectable()
export class FinancialCommitmentService extends ResourceService<Contact> {
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig, 'financialCommitment', 'FinancialCommitment', 'Sales');
  }
  public getFinancialCommitmentOfCurrentDocument(idDocument: number): Observable<any>  {
    return this.callService(Operation.GET,
      FinancialCommitmentConstant.getFinancialCommitmentOfCurrentDocument + String(idDocument));
  }
  public isDcoumentHaveOnlyDepositSettlement(idDocument: number) : Observable<any> {
    const objectToSend={
      "IdDocument": idDocument
    }
    return this.callService(Operation.POST, FinancialCommitmentConstant.IS_DOCUMENT_HAVE_ONLY_DEPOSIT_SETTLEMNT, objectToSend );
  }
}
