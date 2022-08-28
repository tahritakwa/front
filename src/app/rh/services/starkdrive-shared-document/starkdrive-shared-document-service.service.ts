import {StarkdriveConstant} from '../../../constant/rh/starkdrive.constant';
import {ObjectToSave} from '../../../models/shared/objectToSend';
import {Operation} from '../../../../COM/Models/operations';
import {SharedDocumentConstant} from '../../../constant/payroll/shared-document.constant';
import {FileDriveSharedDocument} from '../../../models/rh/file-drive-shared-document.model';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../../../../COM/config/app.config';
import {Observable} from 'rxjs/Observable';
import {Inject, Injectable} from '@angular/core';
import { ResourceServiceRhPaie } from '../../../shared/services/resource/resource.service.rhpaie';


@Injectable()
export class StarkdriveSharedDocumentServiceService extends ResourceServiceRhPaie<FileDriveSharedDocument> {


  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig, 'fileDriveSharedDocument', 'FileDriveSharedDocument', 'RH');
  }

  public saveSharedDocumentAndSendMail(sharedDocument: FileDriveSharedDocument): Observable<any> {
    const data: any = {};
    data[StarkdriveConstant.URL] = location.origin.concat(SharedConstant.MAIN);
    data[StarkdriveConstant.SHARED_DOCUMENT] = sharedDocument;
    const objectToSave: ObjectToSave = new ObjectToSave();
    objectToSave.Model = data;
    return this.callService(Operation.POST, SharedDocumentConstant.ADD_SHARED_DOCUMENT_AND_SEND_MAIL, objectToSave);
  }


}
