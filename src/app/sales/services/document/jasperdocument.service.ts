import { Injectable, Inject } from '@angular/core';
import { AppConfig } from '../../../../COM/config/app.config';
import { HttpClient } from '@angular/common/http';
import { Document } from '../../../models/sales/document.model';
import { Observable } from 'rxjs/Observable';
import { Operation } from '../../../../COM/Models/operations';
import { ResourceService } from '../../../shared/services/resource/resource.service';
import { DocumentConstant } from '../../../constant/sales/document.constant';
import { DataTransferShowSpinnerService } from '../../../shared/services/spinner/data-transfer-show-spinner.service';
import { UserService } from '../../../administration/services/user/user.service';

@Injectable()
export class JasperDocumentService extends ResourceService<Document> {

  lastPurchaseQrderId: number;
  lastPurchaseQuotationId: number;
  documentType: string;
  urlAction: string;
  isCostPriceCalculated: boolean;
  isEditingExpense: boolean;
  isEditingDocumentLine: boolean;
  documentHasExpense: boolean;

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig,
    @Inject(DataTransferShowSpinnerService) dataTransferShowSpinnerService, private userService: UserService) {
    super(httpClient, appConfig, 'jasperSalesPurchaseReporting', 'Document', 'Sales', dataTransferShowSpinnerService);
  }

  public downloadJasperReport(idDocument: any): Observable<any> {
    return super.callService(Operation.POST,
      `${DocumentConstant.JASPER_REPORT_ROOT_DOWNLOAD}`, idDocument);
  }

  public downloadPurchaseReport(idDocument: any): Observable<any> {
    return super.callService(Operation.GET,
      `${DocumentConstant.REPORT_ROOT_PURCHASE_DOWNLOAD}${
        idDocument.reportparameters.id}/${idDocument.reportparameters.printType}/${idDocument.reportparameters.isFromBL}`);
  }

  public printJasperReport(idDocument: any): Observable<any> {
    return super.callService(Operation.POST,
      `${DocumentConstant.REPORT_ROOT_PRINT}`, idDocument
      , null, null, true);
  }
}

