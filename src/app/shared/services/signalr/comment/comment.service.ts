import { Injectable, Inject } from '@angular/core';
import { ResourceService } from '../../resource/resource.service';
import { Comment } from '../../../../models/shared/comment.model';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../../../../COM/config/app.config';
import { SignalrHubService } from '../signalr-hub/signalr-hub.service';
import { Subject } from 'rxjs/Subject';
import { UserService } from '../../../../administration/services/user/user.service';
import { User } from '../../../../models/administration/user.model';
import { Information } from '../../../../models/shared/information.model';
import { InformationTypeEnum } from '../information/information.enum';
import { CreatedData } from '../../../../models/shared/created-data.model';
import { InformationService } from '../information/information.service';
import { MessageService } from '../message/message.service';
import { EmployeeService } from '../../../../payroll/services/employee/employee.service';

@Injectable()
export class CommentService extends ResourceService<Comment> {

  listCommentSubject: Subject<Comment> = new Subject<Comment>();
  listCommentData: Comment = new Comment();

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig, private signalrHubService: SignalrHubService,
    private userService: UserService, private employeeService: EmployeeService,
    private informationService: InformationService, private messageService: MessageService) {
    super(httpClient, appConfig, 'comment', 'Comment', 'ErpSettings');
  }

  /**
   * emit notification changes
   */
  private emitComment(): void {
    this.listCommentSubject.next(this.listCommentData);
  }

  /**
   * Initiate comment hub connection
   */
  initCommentHubConnection() {
    if (!this.signalrHubService.connectionCommentEstablished) {
      this.signalrHubService.createCommentHubConnection();
      this.signalrHubService.startCommentHubConnection();
      this.registerOnCommentEvent();
    }
  }

  /**
 * Progress bar listener event
 */
  private registerOnCommentEvent() {
    this.signalrHubService.hubCommentConnection.on('SendComment', (data: string) => {
      this.listCommentData = JSON.parse(data) as Comment;
      this.emitComment();
    });
  }

  /**
 * send notification to multiple users
 * @param mails
 * @param message
 */
  public sendComment(comment: Comment): void {
    this.signalrHubService.hubCommentConnection.invoke('SendComment', JSON.stringify(comment));
  }

  /**
 * Destroy progress hub connection
 */
  destroyCommentHubConnection() {
    this.signalrHubService.stopCommentHubConnection();
  }

  /**
* send notification to multiple users
* @param mails
* @param message
*/
  public sendNotifWithComment(informationType: InformationTypeEnum, createdData: CreatedData, targetedUsers: Array<User>): void {
    this.informationService.getInfomationByType(informationType).subscribe((information: Information) => {
      // create message
      this.messageService.createMessage(information, createdData, targetedUsers).subscribe(idMessage => {
        this.messageService.sendMessage(idMessage, createdData, targetedUsers, information);
      });
    });
  }
  public startSendComment(comment: Comment, idCreatorEntity: number, createdData: CreatedData,
    informationTypeToTargetUser: InformationTypeEnum, informationTypeToUserCreator: InformationTypeEnum) {
    comment.Mails = new Array<string>();
    let listOfTargetedUsers: Array<User> = new Array<User>();
    let userCreator: Array<User> = new Array<User>();
    this.userService.getListOfUsersParent(idCreatorEntity, comment.EmailCreator).subscribe((targetedUsers: Array<User>) => {
      targetedUsers.forEach((x) => {
        if (x.Id !== comment.IdCreator) {
          if (x.Id !== idCreatorEntity) {
            listOfTargetedUsers.push(x);
          } else {
            userCreator.push(x);
          }
          comment.Mails.push(x.Email);
        }
      });
      if (comment.Mails.length > 0) {
        this.sendComment(comment);
      }
      if (listOfTargetedUsers.length > 0) {
        this.sendNotifWithComment(informationTypeToTargetUser, createdData, listOfTargetedUsers);
      }
      if (userCreator.length > 0) {
        this.sendNotifWithComment(informationTypeToUserCreator, createdData, userCreator);
      }
    });
  }

  // idEmployeeAssociated is the id of the employee who is concerned by the action
  // comment.IdCreator is the id of the connected user who can be a superior
  public addCommentAndSendNotifTheSuperior(comment: Comment,
    idEmployeeAssociated: number,
    createdData: CreatedData,
    informationTypeToTargetUser: InformationTypeEnum, withEmployeeAssociated: boolean) {
    comment.Mails = new Array<string>();
    const listOfTargetedUsers: Array<User> = new Array<User>();
    this.employeeService.GetSuperiorsEmployeeAsUsers(idEmployeeAssociated, withEmployeeAssociated)
      .subscribe((targetedUsers: Array<User>) => {
        targetedUsers.forEach((x) => {
          if (x.Id !== comment.IdCreator) {
            listOfTargetedUsers.push(x);
            comment.Mails.push(x.Email);
          }
        });
        if (comment.Mails.length > 0) {
          this.sendComment(comment);
        }
        if (listOfTargetedUsers.length > 0) {
          this.sendNotifWithComment(informationTypeToTargetUser, createdData, listOfTargetedUsers);
        }
      });
  }
}
