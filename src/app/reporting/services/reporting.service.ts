import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../../../COM/config/app.config';
import { Operation } from '../../../COM/Models/operations';
import { UserService } from '../../administration/services/user/user.service';
import { ReportingConstant } from '../../constant/accounting/reporting.constant';
import { DocumentConstant } from '../../constant/sales/document.constant';
import { ReportTemplate } from '../../models/reporting/report-template.model';
import { ObjectToSave } from '../../models/shared/objectToSend';
import { ResourceService } from '../../shared/services/resource/resource.service';
import { DataTransferShowSpinnerService } from '../../shared/services/spinner/data-transfer-show-spinner.service';

@Injectable()
export class ReportingService extends ResourceService<ReportTemplate>{

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig,
    @Inject(DataTransferShowSpinnerService) dataTransferShowSpinnerService, private userService: UserService) {
    super(httpClient, appConfig, 'reporting', 'Reporting', 'Reporting', dataTransferShowSpinnerService);
  }

  public getStockValuationLines(idWarehouse: any): Observable<any> {
    return this.callService(Operation.GET, "getStockValuationLines/".concat(idWarehouse));
  }
  public getTiersExtractLines(idTiers: any, startDate): Observable<any> {
    return this.callService(Operation.GET, "getTiersExtractLines/".concat(idTiers).concat("/").concat(startDate));
  }
  public getVatDeclarationLines(endDate, startDate,isPurchaseType,idTier): Observable<any> {
    return this.callService(Operation.GET, "getVatDeclarationLines/".concat(endDate).concat("/").concat(startDate).concat("/").concat(isPurchaseType).concat("/").concat(idTier));
  }
  
}
