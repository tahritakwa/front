import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppConfig } from '../../../../COM/config/app.config';
import { Operation } from '../../../../COM/Models/operations';
import { BankAccountConstant } from '../../../constant/Administration/bank-account.constant';
import { ObjectToSend } from '../../../models/sales/object-to-save.model';
import { BankAccount } from '../../../models/shared/bank-account.model';
import { ResourceService } from '../../../shared/services/resource/resource.service';
import { PredicateFormat } from '../../../shared/utils/predicate';


@Injectable()
export class BankAccountService extends ResourceService<BankAccount> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig, 'bankAccount', 'BankAccount', 'Shared');
  }

  public AddBankAccountAssociatedToCompany(bankAccount: BankAccount): Observable<any> {
    return this.callService(Operation.POST, BankAccountConstant.ADD_BANK_ACCOUNT_ASSOCIATED_TO_COMPANY, bankAccount);
  }

  public getBankAccountWithCondition(predicate: PredicateFormat): Observable<any> {
    return this.callService(Operation.POST, BankAccountConstant.GET_BANK_ACCOUNT_WITH_CONDITION, predicate);
  }
  /**
   * removeBankAccount
   * @param data
   */
   public removeBankAccount(bank: any): Observable<any> {
    var id : any;
     if(bank.dataItem != undefined){
       id = bank.dataItem.Id;
     }else {
     id = bank.Id;}
    return super.callService(Operation.POST, 'removeBankAccount', id);
  }
}
