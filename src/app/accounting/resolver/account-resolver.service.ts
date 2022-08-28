import {Injectable} from '@angular/core';
import {ChartAccountService} from '../services/chart-of-accounts/chart-of-account.service';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {ChartOfAccountsConstant} from '../../constant/accounting/chart-of-account.constant';
import { AccountService } from '../services/account/account.service';
import { AccountsConstant } from '../../constant/accounting/account.constant';

@Injectable()
export class AccountResolverService implements Resolve<Observable<any>> {

  constructor(private accountService: AccountService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Observable<any>> | Promise<Observable<any>> | Observable<any> {
    return this.accountService.getJavaGenericService().getEntityList(AccountsConstant.GET_ACCOUNTS_URL);
  }
}
