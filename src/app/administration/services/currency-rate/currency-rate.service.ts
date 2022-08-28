import { Injectable, Inject } from '@angular/core';
import { ResourceService } from '../../../shared/services/resource/resource.service';
import { CurrencyRate } from '../../../models/administration/currency-rate.model';

import { AppConfig } from '../../../../COM/config/app.config';
import { DataTransferShowSpinnerService } from '../../../shared/services/spinner/data-transfer-show-spinner.service';
import { HttpClient } from '@angular/common/http';
import { Operation } from '../../../../COM/Models/operations';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CurrencyRateService extends ResourceService<CurrencyRate> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig,
  @Inject(DataTransferShowSpinnerService) dataTransferShowSpinnerService) {
    super(httpClient, appConfig, 'currencyRate', 'CurrencyRate', 'Administration', dataTransferShowSpinnerService);
  }

  public insertCurrencyRate(currencyRate: CurrencyRate): Observable<any> {
    return this.callService(Operation.POST, 'insertCurrencyRate', currencyRate);
  }
  public updateCurrencyRate(currencyRate: CurrencyRate): Observable<any> {
    return this.callService(Operation.PUT, 'updateCurrencyRate', currencyRate);
  }
}
