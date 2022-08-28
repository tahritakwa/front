import { Injectable, Inject } from '@angular/core';
import { InformationTypeEnum } from '../information/information.enum';
import { InformationService } from '../information/information.service';
import { Information } from '../../../../models/shared/information.model';
import { UserService } from '../../../../administration/services/user/user.service';
import { User } from '../../../../models/administration/user.model';
import { Observable } from 'rxjs/Observable';
import { Message } from '../../../../models/shared/message.model';
import { ResourceService } from '../../resource/resource.service';
import { AppConfig } from '../../../../../COM/config/app.config';
import { HttpClient } from '@angular/common/http';
import { Operation } from '../../../../../COM/Models/operations';
import { CreatedData } from '../../../../models/shared/created-data.model';
import { ObjectToSave } from '../../../../models/shared/objectToSend';
import { NotificationService } from '../notification/notification.service';
import { MailingService } from '../mailing/mailing.service';
import { EmployeeService } from '../../../../payroll/services/employee/employee.service';
import { UserB2bService } from '../../../../administration/services/user-b2b/user-b2b.service';
import { UserCurrentInformationsService } from '../../utility/user-current-informations.service';
import {LocalStorageService} from '../../../../login/Authentification/services/local-storage-service';

const MESSAGE_BASE_URL = 'notification';
const MESSAGE = 'Message';
const ERP_SETTINGS = 'ErpSettings';
const GET_NOTIFICATION_INPUT = '/getNotificationInput';

@Injectable()
export class MessageService extends ResourceService<Message> {
  /**
   * create new message service
   * @param httpClient
   * @param appConfig
   * @param informationService
   * @param userService
   * @param notificationService
   */
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig,
    private informationService: InformationService,
    private userService: UserService,
    private notificationService: NotificationService,
    private mailingService: MailingService, private localStorageService : LocalStorageService,
    private userB2bService: UserB2bService) {
    super(httpClient, appConfig, MESSAGE_BASE_URL, MESSAGE, ERP_SETTINGS);
  }

  /**
   * create new message
   * @param information
   * @param createdData
   * @param targetedUsers
   * @param url
   */
  public createMessage(information: Information, createdData: CreatedData,
    targetedUsers: Array<User>, url?, useApiDocument?: boolean): Observable<any> {
    return (this.callService(Operation.POST,
      GET_NOTIFICATION_INPUT,
      this.prepareObjectToSendForCreateMessage(information, createdData, targetedUsers, useApiDocument)));
  }
  /**
   * start sending process
   * @param createdData
   * @param informationType
   * @param idEntityReference
   */
  public async startSendMessage(createdData: CreatedData, informationType: InformationTypeEnum, idEntityReference?: number,
    useApiDocument?: boolean, isValidatePurchaseRequest?: boolean, isB2B?: boolean, idTiers?: number) {
    // get information
    this.informationService.getInfomationByType(informationType).toPromise().then(async (information: Information) => {
      await new Promise(resolve => resolve(
        this.operationInfo(isB2B, idTiers, information, createdData, isValidatePurchaseRequest, useApiDocument)
      ));
    });
  }
  private async operationInfo(isB2B, idTiers, information, createdData, isValidatePurchaseRequest, useApiDocument) {
    // get targeted users
      if (!isB2B){
      this.userService
        .getTargetedUsers(this.prepareObjectToSend(information, createdData.Id,
          this.localStorageService.getUserId(), isValidatePurchaseRequest))
        .subscribe((targetedUsers: Array<User>) => {
          // create message
          this.createMessage(information, createdData, targetedUsers, null, useApiDocument).subscribe(idMessage => {
            this.sendMessage(idMessage, createdData, targetedUsers, information, useApiDocument);
          });
        });
    }
  }
  // send message
  /**
   * send message
   * @param idMessage
   * @param createdData
   * @param targetedUsers
   * @param information
   * @param url
   */
  public sendMessage(idMessage: number, createdData: CreatedData, targetedUsers: Array<User>,
    information: Information, useDocumentApi?: boolean) {
    // if is mail
    if (information.IsMail) {
      this.mailingService.sendMail(idMessage, createdData, targetedUsers.map(u => u.Email), useDocumentApi);
    }
    // if is notification
    if (information.IsNotification) {
      this.notificationService.sendNotificationToMultipleUsers(targetedUsers.map(u => u.Email), information.IdInfo);
    }
  }
  /**
   * methode helper : prepare object to send
   * @param information
   * @param idEntityReference
   * @param idUser
   */
  private prepareObjectToSend(information: Information, idEntityReference, idUser: number, isValidatePurchaseRequest?: boolean): any {
    return {
      IdInformation: information.IdInfo,
      EntityReference: idEntityReference,
      IdUser: idUser,
      IsValidatePurchaseRequest: isValidatePurchaseRequest
    };
  }
  /**
   * methode helper : prepare object to send
   * @param information
   * @param idEntityReference
   * @param idUser
   */
  private prepareObjectToSendForCreateMessage(information: Information, createdData: CreatedData,
    targetedUsers: Array<User>, useApiDocument?: boolean): ObjectToSave {
    const message = new Message(this.localStorageService.getUserId(), information.IdInfo,
      createdData.Id, createdData.Code, targetedUsers);
    if (useApiDocument === true) {
      message.TypeMessage = 8;
    }
    const objectToSave = new ObjectToSave();
    objectToSave.Model = message;
    return objectToSave;
  }


}
