import { Injectable, Inject } from '@angular/core';
import { DocumentWithholdingTax } from '../../../models/sales/document-withholding-tax.model';
import { ResourceService } from '../../../shared/services/resource/resource.service';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../../../COM/config/app.config';
import { Operation } from '../../../../COM/Models/operations';
import { Observable } from 'rxjs/Observable';
import { WithholdingTaxConstant } from '../../../constant/payment/withholding_tax_constant';
import { PredicateFormat } from '../../../shared/utils/predicate';

@Injectable()
export class DocumentWithholdingTaxService extends ResourceService<DocumentWithholdingTax> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig, 'documentWithholdingTax', 'DocumentWithholdingTax', 'Sales');
  }

  public addDocumentsWithholdingTax(documenstsWithholdingTax: Array<DocumentWithholdingTax>): Observable<any> {
    return this.callService(Operation.POST, WithholdingTaxConstant.ADD_DOCUMENTS_WITHHOLDING_TAX, documenstsWithholdingTax);
  }

  public getAll(predicate: PredicateFormat): Observable<any> {
    return this.callService(Operation.POST, 'getAllDocumentsWithholdingTax', predicate);

  }
}
