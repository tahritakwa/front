import {Inject, Injectable} from '@angular/core';
import {AppConfig} from '../../../../COM/config/app.config';
import {FiscalYearConstant} from '../../../constant/accounting/fiscal-year.constant';
import {ResourceServiceJava} from '../../../shared/services/resource/resource.serviceJava';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {GridDataResult} from '@progress/kendo-angular-grid';


@Injectable()
export class FiscalYearService extends ResourceServiceJava {
  constructor(@Inject(HttpClient) http, @Inject(AppConfig) appConfigAccounting) {
    super(http, appConfigAccounting, 'accounting', FiscalYearConstant.ENTITY_NAME);
  }
}

@Injectable()
export class FiscalYearDetailsService extends BehaviorSubject<GridDataResult> {
  constructor() {
    super(null);
  }
}
