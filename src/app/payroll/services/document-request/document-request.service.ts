import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {DocumentRequest} from '../../../models/payroll/document-request.model';
import {AppConfig} from '../../../../COM/config/app.config';
import {Operation} from '../../../../COM/Models/operations';
import {DocumentRequestConstant} from '../../../constant/payroll/document-request.constant';
import {DataSourceRequestState} from '@progress/kendo-data-query';
import {PredicateFormat} from '../../../shared/utils/predicate';
import {ObjectToSave} from '../../../models/shared/objectToSend';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import { ResourceServiceRhPaie } from '../../../shared/services/resource/resource.service.rhpaie';

@Injectable()
export class DocumentRequestService extends ResourceServiceRhPaie<DocumentRequest> {
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(
      httpClient, appConfig,
      'documentRequest', 'DocumentRequest', 'PayRoll');
  }

  public getDocumentRequestsWithHierarchy(state: DataSourceRequestState, predicate?: PredicateFormat,
                                          onlyFirstLevelOfHierarchy?: boolean, month?: Date): Observable<any> {
    super.prepareServerOptions(state, predicate);
    const data: any = {};
    data[SharedConstant.ONLY_FIRST_LEVEL_OF_HIERARCHY] = onlyFirstLevelOfHierarchy;
    data[SharedConstant.PREDICATE] = predicate;
    data[SharedConstant.MONTH_LOWER] = month;
    const objectToSave: ObjectToSave = new ObjectToSave();
    objectToSave.Model = data;
    return this.callService(Operation.POST, DocumentRequestConstant.GET_DOCUMENT_REQUESTS_WITH_HIERARCHY, objectToSave);
  }

  public validateDocumentRequest(data): Observable<any> {
    return this.callService(Operation.POST, DocumentRequestConstant.VALIDATE_API_URL, data);
  }

  /**
   * getDocumentsFromListId
   * @param objectToSend
   */
  public getDocumentsFromListId(objectToSend: Array<number>): Observable<any> {
    return super.callService(Operation.POST, DocumentRequestConstant.GET_DOCUMENT_FROM_LIST_ID, objectToSend);
  }

  /**
   * validateMassiveDocuments
   * @param objectToSend
   */
  public validateMassiveDocuments(objectToSend: DocumentRequest []): Observable<any> {
    return super.callService(Operation.POST, DocumentRequestConstant.VALIDATE_MASSIVE_DOCUMENTS, objectToSend);
  }

  /**
   * deleteMassiveDocumentRequest
   * @param objectToSend
   */
  public deleteMassiveDocumentRequest(objectToSend: number []): Observable<any> {
    return super.callService(Operation.POST, DocumentRequestConstant.DELETE_MASSIVE_DOCUMENTS, objectToSend);
  }

  /**
   * refuseMassiveDocumentRequest
   * @param objectToSend
   */
  public refuseMassiveDocumentRequest(objectToSend: number []): Observable<any> {
    return super.callService(Operation.POST, DocumentRequestConstant.REFUSE_MASSIVE_DOCUMENTS, objectToSend);
  }
}
