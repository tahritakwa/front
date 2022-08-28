import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {NotificationService} from '../../../../shared/services/signalr/notification/notification.service';
import {NotificationItem} from '../../../../models/shared/notification-item.model';
import {Subscription} from 'rxjs/Subscription';
import {NotificationCrmService} from '../../../../crm/services/notification-crm/notification-crm.service';
import {TranslateService} from '@ngx-translate/core';
import {NumberConstant} from '../../../../constant/utility/number.constant';
import {DatePipe} from '@angular/common';
import {ActionConstant} from '../../../../constant/crm/action.constant';
import {ActionService} from '../../../../crm/services/action/action.service';
import {WebSocketService} from '../../../../shared/services/webSocket/web-socket.service';
import {GrowlService} from '../../../../../COM/Growl/growl.service';
import {SharedCrmConstant} from '../../../../constant/crm/sharedCrm.constant';
import {CrmConstant} from '../../../../constant/crm/crm.constant';
import {OrganisationConstant} from '../../../../constant/crm/organisation.constant';
import {RoleConfigConstant} from '../../../_roleConfigConstant';
import {StarkPermissionsService} from '../../../../stark-permissions/service/permissions.service';
import {ActivatedRoute, Router} from '@angular/router';
import {isNotNullOrUndefinedAndNotEmptyValue} from '../../../../stark-permissions/utils/utils';
import {ModulesSettingsService} from '../../../../shared/services/modulesSettings/modules-settings.service';
import {SharedConstant} from '../../../../constant/shared/shared.constant';
import {LocalStorageService} from '../../../../login/Authentification/services/local-storage-service';

@Component({
  selector: 'app-notification-dropdown',
  templateUrl: './notification.dropdown.component.html',
  styleUrls: ['./notification.dropdown.component.scss']
})
export class NotificationDropdownComponent implements OnInit, OnDestroy {
  public isListMode = false;
  notifications: Array<NotificationItem> = [];
  notificationList = [];
  dotNetNotificationList = [];
  private connectedUser;
  private companyCode;
  private notificationsSubscription: Subscription;
  unreadNotificationCounter: number;
  unreadCrmNotificationCounter = 0;
  private unreadNotificationCounterSubscription: Subscription;
  loading: boolean;
  private loadingSubscription: Subscription;
  private isRoleCrm = false;
  notificationTaskList = [];

  /**
   *
   * @param notificationService
   * @param notificationCRMService
   * @param serviceModulesSettings
   * @param translate
   * @param permissionsService
   * @param datePipe
   * @param actionService
   * @param webSocketService
   * @param growlService
   * @param activatedRoute
   * @param router
   */
  constructor(private notificationService: NotificationService,
              private notificationCRMService: NotificationCrmService, private serviceModulesSettings: ModulesSettingsService,
              private translate: TranslateService, private permissionsService: StarkPermissionsService,
              private datePipe: DatePipe, private actionService: ActionService,
              private webSocketService: WebSocketService, private growlService: GrowlService,
              private activatedRoute: ActivatedRoute, private router: Router,
              private localStorageService: LocalStorageService) {

  }

  /**
   * on init subscribe on botification list and nootification unread counter
   * */
  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (isNotNullOrUndefinedAndNotEmptyValue(params['isListMode'])) {
        this.isListMode = JSON.parse(params['isListMode']);
      }
    });
    this.getConnectedUser();
    this.getCrmRoleConfig();
    this.loading = false;
    //this.notificationService.registerSignalrServerNotificationEvents();
    this.notificationService.getnotificationList();
    this.notificationService.getUnreadNotificationCount();
    this.subscribeOnUnreadNotificationCounter();
    this.subscribeOnLoading();
    this.subscribeOnNotificationList();
  }

  private sortNotificationByCreationDate() {
    return this.notifications.sort((val1, val2) => {
      return <any>new Date(val2.CreationDateString) - <any>new Date(val1.CreationDateString);
    });
  }

  private subscribeOnLoading(): void {
    this.loadingSubscription = this.notificationService.loadingSubject.subscribe(data => {
      this.loading = data;
    });
  }

  /**
   * subscribe on notication list
   * */
  private subscribeOnNotificationList(): void {
    this.notificationsSubscription = this.notificationService.notificationsListSubject
      .subscribe((data: Array<NotificationItem>) => {
        this.notifications = [];
        this.createNotification();
        this.dotNetNotificationList = data;
        this.notifications = this.notifications.concat(data);
        this.notificationService.getUnreadNotificationCount();
        this.subscribeOnUnreadNotificationCounter();
      });
  }

  /**
   * subscribe on notification counter
   * */
  private subscribeOnUnreadNotificationCounter(): void {
    this.unreadNotificationCounterSubscription = this.notificationService.unreadNotificationCounterSubject
      .subscribe((data: number) => {
        this.unreadNotificationCounter = this.unreadCrmNotificationCounter + data;
      });
  }

  /**
   * delete
   * @param id
   * @param index
   */
  onDelete(notification, index: number): void {
    if (notification.NotificationType !== NumberConstant.THIRTEEN) {
      this.notificationService.deleteNotification(notification.IdNotification, index);
    } else {
      this.deleteCrmNotification(notification);
    }
    event.stopPropagation();
  }

  private deleteCrmNotification(notification) {
    this.notificationCRMService.getJavaGenericService().deleteEntity(notification.Id)
      .subscribe(data => {
        if (data === true) {
          this.notifications = this.notifications.filter(notificationCrm => notificationCrm.Id !== notification.Id);
          this.updateCounters();
          this.growlService.successNotification(this.translate.instant(OrganisationConstant.SUCCESS_OPERATION));
        }
      });
  }

  /**
   * read
   * @param id
   */
  onRead(id: number, index: number, notification?: NotificationItem): void {
    if (notification.NotificationType !== NumberConstant.EIGHT) {
      this.notificationService.readNotification(id, index);
    } else {
      this.gotToDetails(notification);
    }
  }

  /**
   * readAll
   * */
  onReadAll(): void {
    this.notificationService.readAllNotifications();
    event.stopPropagation();
  }

  /**
   * dismiss all
   * */
  onDismissAll() {
    event.stopPropagation();
  }

  /**
   * on settings click
   * */
  onSettings() {
    this.router.navigateByUrl('/main/settings');
  }

  /**
   * on destroy
   * */
  ngOnDestroy() {
    this.notificationService.initData();
    if (this.notificationsSubscription) {
      this.notificationsSubscription.unsubscribe();
    }
    if (this.unreadNotificationCounterSubscription) {
      this.unreadNotificationCounterSubscription.unsubscribe();
    }
    if (this.loadingSubscription) {
      this.loadingSubscription.unsubscribe();
    }
    // stop notification ws when notification list is destroyed
    this.notificationService.unregisterSignalrServerNotificationEvents();
  }

  /**
   * fetch more notifications on scroll down
   * @param event
   */
  public onScroll() {
    if (this.loading) {
      return;
    }
    if (this.notifications) {
      this.fetchNextChunk();
      return;
    }
  }

  /**
   * on sroll up event listener
   * */
  onScrollUp() {

  }

  /**
   * fetchNextChunk
   * @param skip
   * @param limit
   */
  protected fetchNextChunk(): void {
    this.notificationService.getnotificationList();
  }

  /**
   * get CRM Notifications
   */
  getCrmNotifications() {
    this.getCrmRememberDateNotifications();
    this.getCrmActionNotifications();
  }

  private getCrmRememberDateNotifications() {
    this.notificationCRMService.getJavaGenericService().getEntityList(ActionConstant.REMEMBER_NOTIFICATION).subscribe((data) => {
      this.notificationList = data;
    });
  }

  private getCrmActionNotifications() {
    if (this.connectedUser.IdEmployee) {
      this.notificationCRMService.getJavaGenericService().getEntityList(ActionConstant.CONNECTED_USER, this.connectedUser.IdEmployee)
        .subscribe((data) => {
          this.notificationList = this.notificationList.concat(data);
        });
    }
  }

  countUnreadCrmNotifications() {
    this.countUnreadCrmRememberDateNotification();
    this.countUnreadCrmActionNotification();
  }

  private countUnreadCrmRememberDateNotification() {
    this.notificationCRMService.getJavaGenericService().getEntityList(ActionConstant.COUNT_REMEMBER_DATE_NOTIFICATION).subscribe((data) => {
      this.unreadCrmNotificationCounter = data;
    });
  }

  private countUnreadCrmActionNotification() {
    if (this.connectedUser.IdEmployee) {
      this.notificationCRMService.getJavaGenericService().getEntityList(ActionConstant.COUNT_ACTION_NOTIFICATION,
        this.connectedUser.IdEmployee).subscribe((data) => {
        this.unreadCrmNotificationCounter += data;
      });
    }
  }

  getConnectedUser() {
    this.connectedUser = this.localStorageService.getUser();
    this.companyCode = this.localStorageService.getCompanyCode();
  }

  private createNotification() {
    for (const notification of this.notificationList) {
      const notificationCrm = new NotificationItem(notification.id, notification.parentId,
        NumberConstant.ZERO, notification.viewed, this.transformDateToString(notification.creationDate),
        notification.translationKey, {FirstName: 'Stark', LastName: null}, NumberConstant.THIRTEEN);
      this.setTextAllNotificationType(notification, notificationCrm);
      this.notifications.push(notificationCrm);
    }
    this.notifications = this.sortNotificationByCreationDate();
  }

  private setTextAllNotificationType(notification, notificationCrm: NotificationItem) {
    if (notification.parentType !== ActionConstant.ACTION) {
      notificationCrm.Text = this.setText(notification.translationKey,
        notification.parentName, notification.dateToRemember.eventName);
    } else {
      this.actionService.getJavaGenericService().getEntityById(notification.parentId).subscribe((data) => {
        this.setActionTextByType(notificationCrm, data, data.startDate.toLocaleString());
      });
    }
  }

  setText(key, parentName, eventName) {
    return `${this.translate.instant(key)
      .replace(/{eventName}/g, '<b>'.concat(eventName).concat('</b>'))
      .replace(/{organisation}/g, '<b>'.concat(parentName))}`;
  }

  setActionText(key, action, startDate) {
    return `${this.translate.instant(key)
      .replace(/{startDate}/g, '<b>'.concat(startDate).concat('</b>'))
      .replace(/{contactsConcerned}/g, '<b>'.concat(action.contactConcernedName))}`;
  }

  setActionTextWithoutConcerned(key, action, startDate) {
    return `${this.translate.instant(key)
      .replace(/{startDate}/g, '<b>'.concat(startDate).concat('</b>'))}`;
  }

  setToDo_EmailText(key, action, startDate) {
    return `${this.translate.instant(key)
      .replace(/{actionName}/g, '<b>'.concat(action.name).concat('</b>'))
      .replace(/{startDate}/g, '<b>'.concat(startDate).concat('</b>'))
      .replace(/{contactsConcerned}/g, '<b>'.concat(action.contactConcernedName))}`;
  }

  setToDo_EmailTextWithoutConcerned(key, action, startDate) {
    return `${this.translate.instant(key)
      .replace(/{actionName}/g, '<b>'.concat(action.name).concat('</b>'))
      .replace(/{startDate}/g, '<b>'.concat(startDate).concat('</b>'))}`;
  }

  setActionTextByType(notification, action, startDate) {
    switch (action.type) {
      case ActionConstant.MEETING: {
        this.setNotificationTextByType(ActionConstant.MEETING_KEY, ActionConstant.MEETING_KEY_WITHOUT_CONCERNED,
          action, notification, startDate);
        break;
      }
      case ActionConstant.PHONE_CALL: {
        this.setNotificationTextByType(ActionConstant.PHONECALL_KEY, ActionConstant.PHONECALL_KEY_WITHOUT_CONCERNED,
          action, notification, startDate);
        break;
      }
      case ActionConstant.DEMO: {
        this.setNotificationTextByType(ActionConstant.DEMO_KEY, ActionConstant.DEMO_KEY_WITHOUT_CONCERNED,
          action, notification, startDate);
        break;
      }
      case ActionConstant.CUSTOMER_VISIT: {
        this.setNotificationTextByType(ActionConstant.CUSTOMER_VISIT_KEY, ActionConstant.CUSTOMER_VISIT_KEY_WITHOUT_CONCERNED,
          action, notification, startDate);
        break;
      }
      case ActionConstant.TO_DO: {
        this.setTodoNotificationText(action, notification, startDate);
        break;
      }
      default: {
        this.SetEmailNotificationText(action, notification, startDate);
        break;
      }
    }
  }

  private SetEmailNotificationText(action, notification, startDate) {
    if (action.contactConcernedId) {
      notification.Text = this.setToDo_EmailText(ActionConstant.EMAIL_KEY, action, startDate);
    } else {
      notification.Text = this.setToDo_EmailTextWithoutConcerned(ActionConstant.EMAIL_KEY_WITHOUT_CONCERNED, action, startDate);
    }
  }

  private setTodoNotificationText(action, notification, startDate) {
    if (action.contactConcernedId) {
      notification.Text = this.setToDo_EmailText(ActionConstant.TODO_KEY, action, startDate);
    } else {
      notification.Text = this.setToDo_EmailTextWithoutConcerned(ActionConstant.TODO_KEY_WITHOUT_CONCERNED, action, startDate);
    }
  }

  gotToDetails(notification) {
    if (!notification.Viewed) {
      this.searchAndUpdateIsViewed(notification);
      this.updateCounters();
    }
  }

  private searchAndUpdateIsViewed(notification) {
    notification.Viewed = true;
    const notificationToUpdate = this.findNotificationById(notification.Id);
    if (notificationToUpdate.length > NumberConstant.ZERO) {
      notificationToUpdate[NumberConstant.ZERO].viewed = true;
      this.updateNotification(notificationToUpdate[NumberConstant.ZERO]);
    }
  }

  private updateCounters() {
    this.unreadCrmNotificationCounter--;
    this.unreadNotificationCounter--;
  }

  private updateNotification(notification) {
    this.notificationCRMService.getJavaGenericService().updateEntity(notification, notification.id).subscribe();
  }

  transformDateToString(date) {
    return this.datePipe.transform(date, SharedCrmConstant.YYYY_MM_DD_HH_MM);
  }

  findNotificationById(id) {
    return this.notificationList.filter(notification => notification.id === id);
  }

  private setCrmNotificationListUpToDate() {
    if (this.connectedUser.IdEmployee) {
      // Open connection with server socket
      const stompClient = this.webSocketService.connect();
      stompClient.connect({}, frame => {

        // Subscribe to notification topic
        stompClient.subscribe(CrmConstant.TOPIC_NOTIFICATION + this.companyCode.toLowerCase() +
          CrmConstant.FILE_SEPARATOR + this.connectedUser.IdEmployee, notification => {
          this.growlService.InfoNotification(this.translate.instant('REMINDER_ACTIONS_NOTIFICATION'));
          this.notifications = [];
          const notificationItem = JSON.parse(notification.body);
          // Update notifications attribute with the recent messsage sent from the server
          this.notificationList.push(notificationItem);
          this.createNotification();
          this.notifications = this.notifications.concat(this.dotNetNotificationList);
          this.unreadNotificationCounter++;
        });
      });
    }
  }

  private setNotificationTextByType(key1, key2, action, notification, startDate) {
    if (action.contactConcernedId) {
      notification.Text = this.setActionText(key1, action, startDate);
    } else {
      notification.Text = this.setActionTextWithoutConcerned(key2, action, startDate);
    }
  }

  private getCrmRoleConfig() {
    this.permissionsService
      .hasPermission([RoleConfigConstant.CrmConfig])
      .then((x) => {
        this.isRoleCrm = x === true;
        this.serviceModulesSettings.getModulesSettings().subscribe(data => {
          if (data[SharedConstant.CRM] && this.isRoleCrm) {
            this.getCrmNotifications();
            this.countUnreadCrmNotifications();
            this.setCrmNotificationListUpToDate();
          }
        });
      });
  }

  /**
   * load profil component when screen is gratter than 768 px
   * @param event
   */
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (event.target.innerWidth >= NumberConstant.SEVEN_HUNDRED_SIXTY_EIGHT && this.isListMode) {
      this.isListMode = false;
      this.notificationService.notificationsListData = [];
    }
    if (this.router.url.includes(SharedConstant.ACTIONS_NOTIFICATIONS_URL) || this.router.url.includes(SharedConstant.NOTIFICATIONS_URL)) {
      this.router.navigate([SharedConstant.PROFILE_URL]);
    }
  }
}
