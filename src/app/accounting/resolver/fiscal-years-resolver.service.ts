import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {FiscalYearService} from '../services/fiscal-year/fiscal-year.service';
import {FiscalYearConstant} from '../../constant/accounting/fiscal-year.constant';

@Injectable()
export class FiscalYearsResolverService implements Resolve<Observable<any>> {

  constructor(private fiscalYearService: FiscalYearService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<Observable<any>> | Promise<Observable<any>> | Observable<any> {
    return this.fiscalYearService.getJavaGenericService().getEntityList(FiscalYearConstant.FIND_ALL_METHOD_URL);
  }
}
