import { Injectable, Inject } from '@angular/core';
import { SharedDocument } from '../../../models/payroll/shared-document.model';
import { AppConfig } from '../../../../COM/config/app.config';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ObjectToSave } from '../../../models/shared/objectToSend';
import { Operation } from '../../../../COM/Models/operations';
import { SharedDocumentConstant } from '../../../constant/payroll/shared-document.constant';
import { DocumentService } from '../../../sales/services/document/document.service';
import { DocumentConstant } from '../../../constant/sales/document.constant';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { DataSourceRequestState } from '@progress/kendo-data-query';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { PredicateFormat } from '../../../shared/utils/predicate';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { TranslateService } from '@ngx-translate/core';
import { ResourceServiceRhPaie } from '../../../shared/services/resource/resource.service.rhpaie';
const URL = 'Url';
const SHARED_DOCUMENT = 'SharedDocument';
const MAIN = '/main';
const AND = 'and';

@Injectable()
export class SharedDocumentService extends ResourceServiceRhPaie<SharedDocument> {

  public gridState: DataSourceRequestState = {
    skip: 0,
    take: 10,
    filter: { // Initial filter descriptor
      logic: AND,
      filters: []
    }
  };
  public columnsConfig: ColumnSettings[] = [
    {
      field: DocumentConstant.ID_TIER_NAVIGATION_NAME,
      title: DocumentConstant.SUPPLIER,
      filterable: true,
    },
    {
      field: DocumentConstant.DOCUMENT_DATE,
      title: DocumentConstant.DATE,
      filterable: true,
      format: localStorage.getItem(DocumentConstant.FORMAT_DATE)
    },
    {
      field: DocumentConstant.CODE,
      title: DocumentConstant.CODE,
      filterable: true
    },
    {
      field: DocumentConstant.DPCUMENT_HTTPRICE_WITH_CURRENCY,
      title: DocumentConstant.AMOUNT_HT,
      filterable: false,
      format: DocumentConstant.FORMAT_NUMBER
    },
    {
      field: DocumentConstant.DOCUMENT_TTC_PRICE_WITH_CURRENCY,
      title: DocumentConstant.AMOUNT_TTC,
      filterable: false,
      format: DocumentConstant.FORMAT_NUMBER
    },
    {
      field: DocumentConstant.ID_DOCUMENT_STATUS_NAVIGATION_LABEL,
      title: DocumentConstant.STATUS,
      filterable: true
    }
  ];
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig
  };

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig, private documentService: DocumentService,) {
    super(
      httpClient, appConfig, 'sharedDocument', 'SharedDocument', 'PayRoll');
  }

  public saveSharedDocumentAndSendMail(sharedDocument: SharedDocument): Observable<any> {
    const data: any = {};
    data[URL] = location.origin.concat(MAIN);
    data[SHARED_DOCUMENT] = sharedDocument;
    const objectToSave: ObjectToSave = new ObjectToSave();
    objectToSave.Model = data;
    return this.callService(Operation.POST, SharedDocumentConstant.ADD_SHARED_DOCUMENT_AND_SEND_MAIL, objectToSave);
  }

  public dataStateChange(state, predicate): any {
    return this.documentService.reloadServerSideData(state,
      predicate, DocumentConstant.GET_DATASOURCE_PREDICATE_DOCUMENT).subscribe(data => this.gridSettings.gridData = data);
  }

  public getSharedDocumentList(state: DataSourceRequestState, predicate: PredicateFormat, startDate: Date, endDate: Date): Observable<any> {
    super.prepareServerOptions(state, predicate);
    let data: any = {};
    data['predicate'] = predicate;
    data['startDate'] = startDate;
    data['endDate'] = endDate;
    let objectToSave: ObjectToSave = new ObjectToSave();
    objectToSave.Model = data;
    return super.callService(Operation.POST,
      SharedDocumentConstant.GET_SHARED_DOCUMENT_LIST, objectToSave);
  }

}
