import {Injectable} from '@angular/core';
import {AccountingConfigurationService} from '../services/configuration/accounting-configuration.service';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {AccountingConfigurationConstant} from '../../constant/accounting/accounting-configuration.constant';

@Injectable()
export class CurrentFiscalYearResolverService implements Resolve<Observable<any>> {

  constructor(private  accountingConfigurationService: AccountingConfigurationService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<Observable<any>> | Promise<Observable<any>> | Observable<any> {
    return this.accountingConfigurationService.getJavaGenericService().getData(AccountingConfigurationConstant.CURRENT_FISCAL_YEAR_URL);
  }
  
}
