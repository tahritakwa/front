import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { CompanyService } from '../../administration/services/company/company.service';

@Injectable()
export class CurrencyResolverService implements Resolve<Observable<any>> {

  constructor(private companyService: CompanyService) {
  }

  resolve(): Observable<Observable<any>> | Promise<Observable<any>> | Observable<any> {
    return this.companyService.getDefaultCurrencyDetails();
  }
}
