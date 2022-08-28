import {Injectable} from '@angular/core';
import {ChartAccountService} from '../services/chart-of-accounts/chart-of-account.service';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {ChartOfAccountsConstant} from '../../constant/accounting/chart-of-account.constant';

@Injectable()
export class ChartsAccountsResolverService implements Resolve<Observable<any>> {

  constructor(private chartAccountService: ChartAccountService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Observable<any>> | Promise<Observable<any>> | Observable<any> {
    return this.chartAccountService.getJavaGenericService().getEntityList(ChartOfAccountsConstant.GET_ALL_CHARTS);
  }
}
