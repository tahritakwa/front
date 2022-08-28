import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import { AccountService } from '../services/account/account.service';

@Injectable()
export class AmortizationAccountsResolverService implements Resolve<Observable<any>> {

  constructor(private accountService: AccountService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<Observable<any>> | Promise<Observable<any>> | Observable<any> {
      return this.accountService.getJavaGenericService().getData('immobilization-amortization-accounts');
  }
  
}
