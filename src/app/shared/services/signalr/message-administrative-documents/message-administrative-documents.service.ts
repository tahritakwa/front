import { Injectable } from '@angular/core';
import { CreatedData } from '../../../../models/shared/created-data.model';
import { InformationTypeEnum } from '../information/information.enum';
import { Information } from '../../../../models/shared/information.model';
import { MessageService } from '../message/message.service';
import { User } from '../../../../models/administration/user.model';
import { InformationService } from '../information/information.service';
import { EmployeeService } from '../../../../payroll/services/employee/employee.service';
import { Employee } from '../../../../models/payroll/employee.model';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from '../notification/notification.service';
import { ResourceService } from '../../resource/resource.service';
import { Resource } from '../../../../models/shared/ressource.model';
import { Operation } from '../../../../../COM/Models/operations';
import { SendMailConfiguration } from '../../../../models/shared/send-mail-configuration.model';
import { Observable } from 'rxjs/Observable';
import { AdministrativeDocumentConstant } from '../../../../constant/payroll/administrative-document-constant';
import { ObjectToSave } from '../../../../models/shared/objectToSend';
import { ActionConstant } from '../../../../constant/payroll/action.constant';
import { isNullOrUndefined } from 'util';
const FOR = 'FOR';
const OF = 'OF';
@Injectable()
export class MessageAdministrativeDocumentsService {

  // It can be LeaveService, ExpenseReportService or DocumentRequestService
  administrativeDocumentService: ResourceService<Resource>;

  constructor(private serviceMessage: MessageService, private translate: TranslateService,
    private informationService: InformationService, private employeeService: EmployeeService,
    private notificationService: NotificationService) { }

  public startSendMessageRHDocuments(createdData: CreatedData,
     informationType: InformationTypeEnum,
     employeeAssociated: Employee,
     idUserConnected: number,
     withEmployeeAssociated: boolean,
     action: string,
     oldObject?) {
    // oldObject is not null in case of delete action or update
    const oldEntity = oldObject ? oldObject : undefined;
    this.informationService.getInfomationByType(informationType).subscribe((information: any) => {
      this.employeeService.GetSuperiorsEmployeeAsUsers(employeeAssociated.Id, withEmployeeAssociated)
      .subscribe((targetedUsers: Array<User>) => {
        // list for users that will received that message => x created a document
        const users1: Array<User> = [];
        // list for users that will received that message => x created a document for  y
        const users2: Array<User> = [];
        targetedUsers.forEach((x) => {
           if (!isNullOrUndefined(employeeAssociated) && idUserConnected === employeeAssociated.Id) {
            users1.push(x);
           } else {
            users2.push(x);
           }
       });
       this.sendNotif(createdData, information, employeeAssociated, users1, users2, action, oldEntity);
      });
    });
  }
  sendNotif(createdData: CreatedData, information: Information,
    employeeAssociated: Employee, users1: Array<User>, users2: Array<User>, action: string, oldObject) {
    if (users1.length > 0) {
      if (createdData.Code) {
      createdData.Code = '{"PROFIL": \' \' , \'DOC_CODE\': "'.concat(createdData.Code).concat('" }');
     } else {
      createdData.Code = '{"PROFIL": \' \' , \'DOC_CODE\': \' \'}';
     }
     this.createAndSendMessage(information, createdData, users1, action, oldObject);
    }
    if (users2.length > 0) {
      let linkingSentence = OF;
      if (action === ActionConstant.ADDING) {
        linkingSentence = FOR;
      }
      createdData.Code = '{"PROFIL": "'.concat(this.translate.instant(linkingSentence)).concat(' ').concat(employeeAssociated.FullName)
                         .concat('", "DOC_CODE":"').concat(createdData.Code).concat('"}');
      this.createAndSendMessage(information, createdData, users2, action, oldObject);
    }
  }
 createAndSendMessage(information: Information, createdData: CreatedData, targetedUsers: Array<User>, action: string, oldObject) {
  this.serviceMessage.createMessage(information, createdData, targetedUsers).subscribe(idMessage => {

   // send notifs
   this.notificationService.sendNotificationToMultipleUsers(targetedUsers.map(u => u.Email), information.IdInfo);

   // Send Mails
   const usersMails = targetedUsers.map(x => x.Email);
   const mailConfiguration =  new SendMailConfiguration(idMessage, location.origin + '#', createdData, usersMails);

   const data: any = {};
   data['action'] = action;
   data['objectBeforeAction'] = oldObject;
   data['mailConfiguration'] = mailConfiguration;
   const objectToSave: ObjectToSave = new ObjectToSave();
   objectToSave.Model = data;
   if(!isNullOrUndefined(this.administrativeDocumentService)) {
  (this.administrativeDocumentService
    .callService(Operation.POST, AdministrativeDocumentConstant.PREPARE_AND_SEND_EMAIL, objectToSave
     ) as Observable<any>).subscribe();
    }
  
  });
 }

 // Send notif when creating new user
 public startSendNewUserNotifMessage(createdUser: any,
  password: string) {
      // Send Mails and notif
     const data: any = {};
     data['password'] = password;
     data['newUser'] = createdUser;
     const objectToSave: ObjectToSave = new ObjectToSave();
     objectToSave.Model = data;
    if(!isNullOrUndefined(this.administrativeDocumentService)) {
     (this.administrativeDocumentService.callService(Operation.POST,
      AdministrativeDocumentConstant.PREPARE_AND_SEND_EMAIL, objectToSave ) as Observable<any>)
     .subscribe();
      }
  }
}
