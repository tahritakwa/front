import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResourceService } from '../../../shared/services/resource/resource.service';
import { AppConfig } from '../../../../COM/config/app.config';
import { Currency } from '../../../models/administration/currency.model';
import { DataTransferShowSpinnerService } from '../../../shared/services/spinner/data-transfer-show-spinner.service';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
@Injectable()
export class CurrencyService extends ResourceService<Currency> {
  public isSelectedCurrency = new Subject<any>();
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig,
  @Inject(DataTransferShowSpinnerService) dataTransferShowSpinnerService) {
    super(httpClient, appConfig, 'currency', 'Currency', 'Administration', dataTransferShowSpinnerService);
  }
  show(data: any) {
    this.isSelectedCurrency.next({value: true, data: data});

  }
  getResult(): Observable<any> {

    return this.isSelectedCurrency.asObservable();
  }
}
