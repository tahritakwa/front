import { Injectable, Inject } from '@angular/core';
import { SignalrHubService } from '../signalr-hub/signalr-hub.service';
import { ResourceService } from '../../resource/resource.service';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../../../../COM/config/app.config';
import { Observable } from 'rxjs/Observable';
import { Operation as RequestOperation } from '../../../../../COM/Models/operations';
import { ObjectToSave } from '../../../../models/shared/objectToSend';
import { NotificationItem } from '../../../../models/shared/notification-item.model';
import { TranslateService } from '@ngx-translate/core';
import { GrowlService } from '../../../../../COM/Growl/growl.service';
import { Subject } from 'rxjs/Subject';
import { DatePipe } from '@angular/common';
import { MessageTypeEnum } from '../message/message.enum';
import { SharedConstant } from '../../../../constant/shared/shared.constant';
import { UserCurrentInformationsService } from '../../utility/user-current-informations.service';
import {LocalStorageService} from '../../../../login/Authentification/services/local-storage-service';

const ERP_SETTINGS = 'ErpSettings';
const MSG_NOTIFICATION = 'MsgNotification';
const MSG_NOTIFICATION_BASE_ROUTE = 'msgnotification';
const USER_EMAIL = 'userMail';
const PAGE_SIZE = 'pageSize';
const PAGE_NUMBER = 'pageNumber';
const LIST_DATA = 'listData';
const LIST_NOTIFICATION_WITH_PAGINATION_URL = 'getNotificationsWithPagination';
const MARK_NOTIFICATION_AS_READ_URL = '/markNotificationAsRead';
const MARK_ALL_AS_READ_URL = '/markAllAsRead';
const DROP_NOFICATION_URL = '/drop';
const ID_TARGETED_USER = 'IdTargetUser';
const ID_NOTIFICATION = 'IdNotification';
const pipe = new DatePipe('en-US');
const SEND_NOTIFICATION_TO_MULTIPLE_USERS = 'SendNotificationToMultipleUsers';
const SEND_FINANCUIAL_COMMITEMENT_REMINDER_NOTIFICATIONS = 'SendFinancialCommitmentReminderNotications';
const FIVE = 5;
const DAY_HOURS_NUMBER = 24;
const DEFAULT_USER_ID = 2;
const SEND_NOTIFICATIONS_REMINDER = 'SendNoticationsReminder';
const GET_UNREAD_NOTIFICATION_COUNT = 'getUnreadNotificationCount';

@Injectable()
export class NotificationService extends ResourceService<NotificationItem> {

  private formatDate = this.translate.instant(SharedConstant.DATE_FORMAT);

  private unreadNotificationsCounter = 0;
  private pageNumber = 0;
  private pageSize = 30;
  public unreadNotificationCounterSubject: Subject<number> = new Subject<number>();
  public notificationsListData: NotificationItem[] = new Array<NotificationItem>(); // notification list data
  public notificationsListSubject: Subject<NotificationItem[]> = new Subject<NotificationItem[]>(); // notification observable
  private loading: boolean;
  public loadingSubject: Subject<boolean> = new Subject<boolean>();
  notifcount: any;
  /**
   * create new notification service
   * @param httpClient
   * @param appConfig
   * @param signalrHubService
   * @param translate
   * @param growlPopupService
   * @param languageService
   */
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig, private signalrHubService: SignalrHubService,
    private translate: TranslateService, private growlPopupService: GrowlService, private localStorageService : LocalStorageService) {
    super(httpClient, appConfig, MSG_NOTIFICATION_BASE_ROUTE, MSG_NOTIFICATION, ERP_SETTINGS);

  }

  /**
   * emit notification data
   * */
  public emitNotificationsData() {
    this.emitNotifications();
    this.emitUnreadNotificationCounter();
  }
  /**
   * emit notication changes
   * */
  private emitNotifications(): void {
    this.notificationsListSubject.next(this.notificationsListData.slice());
  }
  /**
   * emit counter changes
   * */
  private emitUnreadNotificationCounter(): void {
    this.unreadNotificationCounterSubject.next(this.unreadNotificationsCounter);
  }
  emitLoading() {
    this.loadingSubject.next(this.loading);
  }
  /**
   * notification list getter
   */
  getnotificationList(): void {
    if (this.loading) {
      return;
    }
    this.loading = true;
    this.emitLoading();
    this.pageNumber = Math.round((this.notificationsListData.length) / this.pageSize);
    (super.callService(RequestOperation.POST, LIST_NOTIFICATION_WITH_PAGINATION_URL,
      this.prepareDataToSendForList(this.pageNumber, this.pageSize)) as Observable<NotificationItem[]>).subscribe(data => {
        this.notificationsListData = this.notificationsListData.concat(this.prepareNotificationsContent(data[LIST_DATA]));
        this.emitNotificationsData();
        this.loading = false;
        this.emitLoading();
      });
  }
  getUnreadNotificationCount()  {
    (super.callService(RequestOperation.POST, GET_UNREAD_NOTIFICATION_COUNT, this.prepareDataToSendForList(this.pageNumber,
      this.pageSize)) as Observable<any>)
      .subscribe(data => {
        this.unreadNotificationsCounter = data.listData;
        this.emitUnreadNotificationCounter();
      });
  }
  /**
   * delete  notification
   * @param id
   */
  public deleteNotification(id: number, index: number): void {
    (super.callService(RequestOperation.POST, DROP_NOFICATION_URL, this.prepareDataToSendForDelete(id)) as Observable<any>)
      .subscribe(() => {
        this.decUnreadNotificationsCounter(this.notificationsListData[index].Viewed);
        this.notificationsListData.splice(index, 1);
        this.emitNotificationsData();
      });
  }
  /**
   * mark notification as readed
   * @param id
   */
  public readNotification(id: number, index: number): void {
    if (this.notificationsListData[index] && !this.notificationsListData[index].Viewed) {
      (super.callService(RequestOperation.POST, MARK_NOTIFICATION_AS_READ_URL, this.prepareDataToSendForDelete(id)) as Observable<any>)
        .subscribe(() => {
          this.decUnreadNotificationsCounter(this.notificationsListData[index].Viewed);
          this.notificationsListData[index].Viewed = true;
          this.emitNotificationsData();
        });
    }
  }
  /**
   * mark all notifications as readed
   * */
  public readAllNotifications(): void {
    (super.callService(RequestOperation.POST, MARK_ALL_AS_READ_URL, this.prepareDataToSendForMarkAllAsRead()) as Observable<any>)
      .subscribe(() => {
        this.notificationsListData.forEach(notification => {
          this.decUnreadNotificationsCounter(notification.Viewed);
          notification.Viewed = true;
        });
        this.unreadNotificationsCounter = 0;
        this.emitNotificationsData();
      });
  }
  /**
   * unshift new notification item
   * @param notification
   */
  public unshiftNotification(notification: NotificationItem): void {
    if (notification.ConnectedCompany === this.localStorageService.getCompanyCode()) {
      this.notificationsListData.unshift(notification);
      this.growlPopupService.InfoNotification(notification.Text);
    }
  }
  /**
   * prepare notification list content
   * @param notifications
   */
  private prepareNotificationsContent(notifications: Array<NotificationItem>): Array<NotificationItem> {
    this.getUnreadNotificationCount();
    notifications.forEach(notification => {
      this.prepareNotifcationItem(notification);
    });
    return notifications;
  }
  /**
   * prepare notification content
   * @param notification
   */
  private prepareNotifcationItem(notification: NotificationItem): NotificationItem {
    if (!notification.CodeEntity) {
      notification.CodeEntity = '';
    }

    switch (notification.NotificationType) {
      case MessageTypeEnum.AlertFinancialCommitment: {
        notification.FinancialCommitmentDateString = this.dateToShortString(notification.FinancialCommitmentDate);
        break;
      }
      case MessageTypeEnum.AlertEndContract: {
        if (notification.DataOfEndContract && notification.Text) {
          notification.Text = `${notification.Text && notification.Text
            .replace(/{DateEndContract}/g, '<b>'.concat(notification.DataOfEndContract.DateEndContract).concat('</b>'))
            .replace(/{FullName}/g, '<b>'.concat(notification.DataOfEndContract.FullName).concat('</b>'))}`;
        }
        break;
      }
    }



    notification.CreationDateString = this.creationDateToReadableString(notification.CreationDate);
    notification.Text = `${this.translate.instant(notification.TranslationKey)
      .replace(/{CODE}/g, '<b>'.concat(notification.CodeEntity).concat('</b>'))
      .replace(/{CREATOR}/g, '<b>'.concat(notification.Creator.FirstName).concat(' ').concat(notification.Creator.LastName).concat('</b>'))
      .replace(/{DATE}/g, '<b>'.concat(notification.FinancialCommitmentDateString).concat('</b>'))}`;

    if (notification.Parameters) {
      for (const paramName in notification.Parameters) {
        if (notification.Parameters.hasOwnProperty(paramName)) {
          notification.Text = notification.Text.replace('{'.concat(paramName).concat('}'),
            '<b>'.concat(notification.Parameters[paramName]).concat('</b>'));
        }
      }
    }
return notification;
  }
  /**
  * decrement unread notification counter
  * */
  private decUnreadNotificationsCounter(viewed: boolean) {
    if (!viewed) {
      this.unreadNotificationsCounter--;
    }
  }
  /**
   * reload notification list
   * */
  public reloadNotifications(): void {
    this.unreadNotificationsCounter = 0;
    this.prepareNotificationsContent(this.notificationsListData);
    this.emitNotificationsData();
  }
  /**
   * prepare creation date
   * @param creationDate
   */
  private creationDateToReadableString(creationDate: Date): string {
    const now = new Date();
    const date = new Date(creationDate);
    const diffH = now.getHours() - date.getHours();
    const diffMin = now.getMinutes() - date.getMinutes();
    const dayDiff = now.getDay() - date.getDay();
    if (dayDiff === 0) {
      if (0 < diffH && diffH <= FIVE) {
        return diffH.toString().concat('h');
      }
      if (6 < diffH && diffH <= DAY_HOURS_NUMBER) {
        return pipe.transform(date, 'hh:mm a').toString();
      }
      if (0 === diffH && diffMin > 0) {
        return diffMin.toString().concat('m');
      }
      if (0 === diffH && diffMin === 0) {
        return `${this.translate.instant('NOTIFICATION_JUST_NOW')}`;
      }
    }
    let formatDateConcatenated;
    if(this.formatDate){
      formatDateConcatenated = this.formatDate.concat(' hh:mm')
    }
    return pipe.transform(date, formatDateConcatenated).toString();
  }
  /**
   * date to short pipe
   * @param date
   */
  private dateToShortString(date: Date): string {
    return pipe.transform(new Date(date), this.formatDate).toString();
  }
  /**
   * send notification to multiple users
   * @param mails
   * @param message
   */
  public sendNotificationToMultipleUsers(mails: Array<string>, idInfo: number): void {
    this.signalrHubService.invokeSendNotificationToMultipleUsers(mails, idInfo);
  }
  public initData() {
    this.notificationsListData = new Array<NotificationItem>();
    this.unreadNotificationsCounter = 0;
    this.emitNotificationsData();
  }
  // region: signalr listeners
  /**
   * register to notification server hub events
   * */
  public registerSignalrServerNotificationEvents(): void {
    if (!this.signalrHubService.connectionNotificationEstablished) {
      this.signalrHubService.createNotificationHubConnection();
      this.signalrHubService.startNotificationHubConnection();
    }
    this.registerOnSendNotificationToMultipleUsersEvent();
    this.registerOnSendFinancialCommitementReminderNotificationEvent();
    this.registerOnSendNotificationReminderEvent();
  }
  public unregisterSignalrServerNotificationEvents(): void {
    this.signalrHubService.stopNotificationHubConnection();
  }
  /**
   * register to send notification to muliple users event
   * */
  registerOnSendNotificationToMultipleUsersEvent(): void {
    this.signalrHubService.hubNotificationConnection.on(SEND_NOTIFICATION_TO_MULTIPLE_USERS, (data: string) => {
      this.unshiftNotification(this.prepareNotifcationItem(JSON.parse(data) as NotificationItem));
      this.emitNotifications();
    });
  }
  /**
 * register to financtial commitement reminder notification event, will invoked when the hub methode with the specified name is invoked
 * */
  registerOnSendFinancialCommitementReminderNotificationEvent(): void {
    this.signalrHubService.hubNotificationConnection.on(SEND_FINANCUIAL_COMMITEMENT_REMINDER_NOTIFICATIONS, (data: any) => {
      this.unshiftNotification(this.prepareNotifcationItem(JSON.parse(data) as NotificationItem));
      this.emitNotifications();
    });
  }

  registerOnSendNotificationReminderEvent(): void {
    this.signalrHubService.hubNotificationConnection.on(SEND_NOTIFICATIONS_REMINDER, (data: any) => {
      this.unshiftNotification(this.prepareNotifcationItem(JSON.parse(data) as NotificationItem));
      this.emitNotifications();
    });
  }


  // end region

  // region: prepare data to send for api calls
  /**
   * prepare params get list of notifications
   * */
  private prepareDataToSendForList(pageNumber: number, pageSize: number): ObjectToSave {
    const params: ObjectToSave = new ObjectToSave();
    const getListParams: any = {};
    // user mail temporary hard coded
    let userData = this.localStorageService.getUser();
    getListParams[USER_EMAIL] = userData? userData.Email : 'demo@spark-it.fr';
    getListParams[PAGE_NUMBER] = pageNumber;
    getListParams[PAGE_SIZE] = pageSize;
    params.Model = getListParams;
    return params;
  }
  /**
   * prepare params for delete notification
   * @param idNotification
   */
  private prepareDataToSendForDelete(idNotification: number): ObjectToSave {
    const params: ObjectToSave = new ObjectToSave();
    const getListParams: any = {};
    getListParams[ID_NOTIFICATION] = idNotification;
    let userData = this.localStorageService.getUser();
    // temporary from local storage
    getListParams[ID_TARGETED_USER] = userData ? userData.IdUser
      : DEFAULT_USER_ID;
    params.Model = getListParams;
    return params;
  }
  /**
   * prepare params for mark all notifications as read
   * */
  private prepareDataToSendForMarkAllAsRead(): ObjectToSave {
    const params: ObjectToSave = new ObjectToSave();
    const getListParams: any = {};
    let userData = this.localStorageService.getUser();
    // temporary from local storage
    getListParams[ID_TARGETED_USER] = userData ? userData.IdUser
      : DEFAULT_USER_ID;
    params.Model = getListParams;
    return params;
  }
  // end region
}
