import { Injectable, Inject, EventEmitter } from '@angular/core';
import { AppConfig } from '../../../../COM/config/app.config';
import { ResourceService } from '../../../shared/services/resource/resource.service';
import { DocumentLine } from '../../../models/sales/document-line.model';
import { Observable } from 'rxjs/Observable';
import { Operation } from '../../../../COM/Models/operations';
import { HttpClient } from '@angular/common/http';
import { DataTransferShowSpinnerService } from '../../../shared/services/spinner/data-transfer-show-spinner.service';

@Injectable()
export class BTobService extends ResourceService<DocumentLine> {

  public sendNotificationToUser = new EventEmitter();

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig,
    @Inject(DataTransferShowSpinnerService) dataTransferShowSpinnerService) {
    super(httpClient, appConfig, 'B2BOrder', 'Document', 'Sales', dataTransferShowSpinnerService);
  }
  public sendNotification() {
    this.sendNotificationToUser.emit();
  }
  public getOrderCount(): Observable<any> {
    return this.callService(Operation.GET, 'getOrderCount', null, null, true);
  }
}
