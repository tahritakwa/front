import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ResourceService} from '../../../shared/services/resource/resource.service';
import {TeamType} from '../../../models/payroll/team-type.model';
import {AppConfig} from '../../../../COM/config/app.config';
import {BankAccount} from '../../../models/shared/bank-account.model';
import {Observable} from 'rxjs/Observable';
import {Operation} from '../../../../COM/Models/operations';
import {BankAccountConstant} from '../../../constant/Administration/bank-account.constant';


@Injectable()
export class TeamTypeService extends ResourceService<TeamType> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(
      httpClient, appConfig,
      'teamType', 'TeamType', 'PayRoll');
  }

  public AddBankAccountAssociatedToCompany(bankAccount: BankAccount): Observable<any> {
    return this.callService(Operation.POST, BankAccountConstant.ADD_BANK_ACCOUNT_ASSOCIATED_TO_COMPANY, bankAccount);
  }
}
