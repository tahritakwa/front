import { Injectable, Inject } from '@angular/core';
import { CreatedData } from '../../../../models/shared/created-data.model';
import { HttpClient } from '@angular/common/http';
import { ResourceService } from '../../resource/resource.service';
import { AppConfig } from '../../../../../COM/config/app.config';
import { Message } from '../../../../models/shared/message.model';
import { Operation } from '../../../../../COM/Models/operations';
import { SendMailConfiguration } from '../../../../models/shared/send-mail-configuration.model';
import { Observable } from 'rxjs/Observable';
import { DocumentService } from '../../../../sales/services/document/document.service';

const ERP_SETTINGS = 'ErpSettings';
const MESSAGE = 'Message';
const URL_MAIL_BASE = 'Mail';
const URL_MAIL_SEND = '/send';


@Injectable()
export class MailingService extends ResourceService<Message> {
  /**
   * create new message service
   * @param httpClient
   * @param appConfig
   * @param informationService
   * @param userService
   * @param notificationService
   */
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig, private documentService: DocumentService) {
    super(httpClient, appConfig, URL_MAIL_BASE, MESSAGE, ERP_SETTINGS);
  }
  public sendMail(idMssage: number, createdData: CreatedData, mails: Array<string>, useDocumentApi: boolean) {
    if (!useDocumentApi) {
      (super.callService(Operation.POST, URL_MAIL_SEND,
        new SendMailConfiguration(idMssage, location.origin + '/main', createdData, mails)) as Observable<any>).subscribe();
    } else {
      this.documentService.sendMail(idMssage, createdData, mails).subscribe();
    }
  }
}
