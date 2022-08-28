import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { ResourceService } from '../../../shared/services/resource/resource.service';
import { Taxe } from '../../../models/administration/taxe.model';
import { AppConfig } from '../../../../COM/config/app.config';
import { Observable } from 'rxjs';
import { Operation } from '../../../../COM/Models/operations';

@Injectable()
export class TaxeService extends ResourceService<Taxe> {
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig, 'taxe', 'Taxe', 'Shared');
  }
  public downloadVatDeclarationJasperReport(dataToSend: any): Observable<any> {
    return this.callService(Operation.POST, "MultiPrintVatDeclarationJasper", dataToSend);
  }

}
