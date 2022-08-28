import { Component, HostListener, OnInit } from '@angular/core';
import { NotificationItem } from '../../../../models/shared/notification-item.model';
import { DatePipe } from '@angular/common';
import { NotificationCrmService } from '../../../../crm/services/notification-crm/notification-crm.service';
import { TranslateService } from '@ngx-translate/core';
import { GrowlService } from '../../../../../COM/Growl/growl.service';
import { ReminderEventService } from '../../../../crm/services/reminder-event/reminder-event.service';
import { ActionConstant } from '../../../../constant/crm/action.constant';
import { NumberConstant } from '../../../../constant/utility/number.constant';
import { SharedCrmConstant } from '../../../../constant/crm/sharedCrm.constant';
import { CrmConstant } from '../../../../constant/crm/crm.constant';
import { WebSocketService } from '../../../../shared/services/webSocket/web-socket.service';
import { isNotNullOrUndefinedAndNotEmptyValue } from '../../../../stark-permissions/utils/utils';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedConstant } from '../../../../constant/shared/shared.constant';
import { Employee } from '../../../../models/payroll/employee.model';
import { EmployeeService } from '../../../../payroll/services/employee/employee.service';
import {LocalStorageService} from '../../../../login/Authentification/services/local-storage-service';
import {UserService} from '../../../../administration/services/user/user.service';

@Component({
  selector: 'app-reminder-dropdown',
  templateUrl: './reminder-dropdown.component.html',
  styleUrls: ['./reminder-dropdown.component.scss']
})
export class ReminderDropdownComponent implements OnInit {
  reminders: Array<NotificationItem> = [];
  remindersList = [];
  private connectedEmployee: Employee;
  private companyCode;
  unreadCrmNotificationCounter = 0;
  loading: boolean;
  repeatDelays = ['10 min', '15 min', '20 min', '25 min'];
  defaultItemRepeat = '5 min';
  public isListMode = false;

  constructor(private datePipe: DatePipe, private notificationCRMService: NotificationCrmService, private translate: TranslateService,
    private reminderEventService: ReminderEventService, private growlService: GrowlService, private router: Router,
    private webSocketService: WebSocketService, private activatedRoute: ActivatedRoute, private userService: UserService, private localStorageService : LocalStorageService) {
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (isNotNullOrUndefinedAndNotEmptyValue(params['isListMode'])) {
        this.isListMode = JSON.parse(params['isListMode']);
      }
    });
    this.userService.getByEmail(this.localStorageService.getUser().Email).subscribe(
      (user) => {
        this.connectedEmployee = user;
        const us = user;
        this.companyCode = this.localStorageService.getCompanyCode();
        //this.getCrmRemindersNotifications();
        this.setReminderNotificationListUpToDate();
      }
    );
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

  }

  /**
   * fetch more notifications on scroll down
   * @param event
   */
  public onScroll() {
  }

  /**
   * on sroll up event listener
   * */
  onScrollUp() {

  }

  /**
   * readAll
   * */
  onReadAll(): void {
  }

  private getCrmRemindersNotifications() {
    if (this.connectedEmployee.Id) {
      this.notificationCRMService.getJavaGenericService().getEntityList(ActionConstant.REMINDER_CONNECTED_USER,
        this.connectedEmployee.Id).subscribe((data) => {
          this.remindersList = data;
          this.unreadCrmNotificationCounter = this.remindersList.length;
          this.createNotifications();
        });
    }
  }

  private createNotifications() {
    for (const notification of this.remindersList) {
      const notificationCrm = new NotificationItem(notification.id, notification.parentId,
        NumberConstant.ZERO, notification.viewed, this.transformDateToString(notification.creationDate, SharedCrmConstant.YYYY_MM_DD_HH_MM),
        notification.translationKey, { FirstName: 'Stark', LastName: null }, NumberConstant.EIGHT);
      this.reminderEventService.getJavaGenericService().getEntityById(notification.parentId).subscribe(data => {
        this.setTextNotification(notification, notificationCrm, data);
        this.reminders.push(notificationCrm);
      });
    }
    this.reminders = this.sortNotificationByCreationDate();
  }

  transformDateToString(date, format) {
    return this.datePipe.transform(date, format);
  }

  private setTextNotification(notification, notificationCrm, reminder) {
    notificationCrm.Text = this.setText(notification.translationKey, reminder.description, reminder.reminderDate);
  }

  setText(key, description, reminderDate) {
    return `${this.translate.instant(key)
      .replace(/{description}/g, '<b>'.concat(description).concat('</b>'))
      .replace(/{reminderDate}/g, '<b>'.concat(this.transformDateToString(reminderDate, 'shortDate')).concat('</b>'))
      .replace(/{reminderTime}/g, '<b>'.concat(this.transformDateToString(reminderDate, 'shortTime')).concat('</b>'))}`;
  }

  private sortNotificationByCreationDate() {
    return this.reminders.sort((val1, val2) => {
      return <any>new Date(val2.CreationDateString) - <any>new Date(val1.CreationDateString);
    });
  }

  keepDropdownOpen(event) {
    event.stopPropagation();
  }

  private setReminderNotificationListUpToDate() {
    if (this.connectedEmployee.Id) {
      // Open connection with server socket
      const stompClient = this.webSocketService.connect();
      stompClient.connect({}, frame => {

        // Subscribe to notification topic
        stompClient.subscribe(CrmConstant.TOPIC_NOTIFICATION + this.companyCode.toLowerCase() +
          CrmConstant.FILE_SEPARATOR + this.connectedEmployee.Id, notification => {
            this.growlService.InfoNotification(this.translate.instant('REMINDER_NOTIFICATION'));
            this.reminders = [];
            const notificationItem = JSON.parse(notification.body);
            // Update notifications attribute with the recent messsage sent from the server
            this.remindersList.push(notificationItem);
            this.createNotifications();
            this.unreadCrmNotificationCounter++;
          });
      });
    }
  }

  /**
   * load profil component when screen is gratter than 768 px
   * @param event
   */
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (event.target.innerWidth >= NumberConstant.SEVEN_HUNDRED_SIXTY_EIGHT && this.isListMode) {
      this.isListMode = false;
    }
    if (this.router.url.includes(SharedConstant.ACTIONS_NOTIFICATIONS_URL) || this.router.url.includes(SharedConstant.ACTIONS_NOTIFICATIONS_URL)) {
      this.router.navigate([SharedConstant.PROFILE_URL]);
    }
  }
}
