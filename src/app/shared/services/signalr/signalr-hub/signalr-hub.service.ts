import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { AppConfig } from '../../../../../COM/config/app.config';
import { LocalStorageService } from '../../../../login/Authentification/services/local-storage-service';
import { MessageToSend } from '../../../../models/shared/message-to-send.model';

const API_CONFIG = 'root_api';
const SEND_NOTIFICATION_TO_MULTIPLE_USERS = 'SendNotificationToMultipleUsers';
const NOTIFICATION = '/notificationHub';
const PAYSLIP_SESSION_PROGRESS = '/payslipSessionProgressHub';
const BILLING_SESSION_PROGRESS = '/billingSessionProgressHub';
const SOURCE_DEDUCTION_SESSION_PROGRESS = '/sourceDeductionSessionProgressHub';
const SEND = 'Send';
const SEND_TO_All_EXPECT_ME = 'SendToAllExpectMe';
const ON_CONNECTED_ASYNC = 'OnConnectedAsync';
const COMMENT = '/commentHub';
const CHAT = '/chatHub';
const LEAVE_BALANCE_REMAINING_PROGRESS = '/leaveBalanceRemainingProgressHub';


/**
 *
 * manage signalr websoket connections and events
 *
 * */
@Injectable()
export class SignalrHubService {
  hubNotificationConnection: HubConnection;
  hubPayslipSessionProgressConnection: HubConnection;
  hubBillingSessionProgressConnection: HubConnection;
  hubSourceDeductionSessionProgressConnection: HubConnection;
  hubCommentConnection: HubConnection;
  hubChatConnection: HubConnection;

  connectionNotificationEstablished: boolean;
  connectionProgressEstablished: boolean;
  connectionBillingSessionProgressEstablished: boolean;
  connectionSourceDeductionSessionProgressEstablished: boolean;
  connectionCommentEstablished: boolean;
  connectionChatEstablished: boolean;

  hubLeaveBalanceRemainingProgressConnection: HubConnection;
  connectionLeaveBalanceRemainingProgressEstablished: boolean;


  /**
   * create new signalr service
   * @param config
   */
  constructor(private config: AppConfig, private localStorageService : LocalStorageService) {
    this.connectionNotificationEstablished = false;
    this.connectionProgressEstablished = false;
    this.connectionChatEstablished = false;
  }
  // Notification hub
  /**
   * create websoket connection
   * */
  createNotificationHubConnection(): void {
    if (!this.connectionNotificationEstablished) {
      let userData = this.localStorageService.getUser();
      const userMail = userData ? userData.Email : '';
      this.hubNotificationConnection = new HubConnectionBuilder()
        .withUrl((this.config.getConfig(API_CONFIG) as string)
          .concat(NOTIFICATION)
          .concat('?userMail=')
          .concat(userMail)) // temporary; from local storage
        .build();
    }
  }
  /**
   * start websoket connection
   * */
  startNotificationHubConnection(): void {
    this.hubNotificationConnection.start().then(() => {
      this.connectionNotificationEstablished = true;
    });
  }
  /**
   * stop websoket connection
   * */
  stopNotificationHubConnection(): void {
    if (this.hubNotificationConnection) {
      this.hubNotificationConnection.stop().then(() => {
        this.connectionNotificationEstablished = false;
      });
    }
  }


  // progressHub
  /**
   * create websoket connection
   * */
  createPayslipSessionProgressHubConnection(): void {
    if (!this.connectionProgressEstablished) {
      let userData = this.localStorageService.getUser();
      const userMail = userData ? userData.Email : '';
      this.hubPayslipSessionProgressConnection = new HubConnectionBuilder()
        .withUrl((this.config.getConfig(API_CONFIG) as string)
          .concat(PAYSLIP_SESSION_PROGRESS)
          .concat('?userMail=')
          .concat(userMail)) // temporary; from local storage
        .build();
    }
  }

    // progressHub
  /**
   * create websoket connection
   * */
  createBillingSessionProgressHubConnection(): void {
    if (!this.connectionProgressEstablished) {
      let userData = this.localStorageService.getUser();
      const userMail = userData ? userData.Email : '';
      this.hubBillingSessionProgressConnection = new HubConnectionBuilder()
        .withUrl((this.config.getConfig(API_CONFIG) as string)
          .concat(BILLING_SESSION_PROGRESS)
          .concat('?userMail=')
          .concat(userMail)) // temporary; from local storage
        .build();
    }
  }

  // progressHub
  /**
   * create websoket connection
   * */
  createSourceDeductionSessionProgressHubConnection(): void {
    if (!this.connectionProgressEstablished) {
      let userData = this.localStorageService.getUser();
      const userMail = userData ? userData.Email : '';
      this.hubSourceDeductionSessionProgressConnection = new HubConnectionBuilder()
        .withUrl((this.config.getConfig(API_CONFIG) as string)
          .concat(SOURCE_DEDUCTION_SESSION_PROGRESS)
          .concat('?userMail=')
          .concat(userMail)) // temporary; from local storage
        .build();
    }
  }


  /**
   * start websoket Payslip progress connection
   * */
  startPayslipSessionProgressHubConnection(): void {
    this.hubPayslipSessionProgressConnection.start().then(() => {
      this.connectionProgressEstablished = true;
    });
  }
  /**
   * stop websoket Payslip progress connection
   * */
  stopPayslipSessionProgressHubConnection(): void {
    if (this.hubPayslipSessionProgressConnection) {
      this.hubPayslipSessionProgressConnection.stop().then(() => {
        this.connectionProgressEstablished = false;
      });
    }
  }


  /**
   * start websoket billing session connection
   * */
  startBillingSessionProgressHubConnection(): void {
    this.hubBillingSessionProgressConnection.start().then(() => {
      this.connectionBillingSessionProgressEstablished = true;
    });
  }
  /**
   * stop websoket billing session connection
   * */
  stopBillingSessionProgressHubConnection(): void {
    if (this.hubBillingSessionProgressConnection) {
      this.hubBillingSessionProgressConnection.stop().then(() => {
        this.connectionBillingSessionProgressEstablished = false;
      });
    }
  }

   /**
   * start websoket Source deduction session connection
   * */
  startSourceDeductionSessionProgressHubConnection(): void {
    this.hubSourceDeductionSessionProgressConnection.start().then(() => {
      this.connectionSourceDeductionSessionProgressEstablished = true;
    });
  }
  /**
   * stop websoket Source deduction session connection
   * */
  stopSourceDeductionSessionProgressHubConnection(): void {
    if (this.hubSourceDeductionSessionProgressConnection) {
      this.hubSourceDeductionSessionProgressConnection.stop().then(() => {
        this.connectionSourceDeductionSessionProgressEstablished = false;
      });
    }
  }

  // Chat hub
  /**
   * create websoket connection
   * */
  createChatHubConnection(): void {
    if (!this.connectionChatEstablished) {
      let userData = this.localStorageService.getUser();
      const userMail = userData ? userData.Email : '';
      this.hubChatConnection = new HubConnectionBuilder()
        .withUrl((this.config.getConfig(API_CONFIG) as string)
          .concat(CHAT)
          .concat('?userMail=')
          .concat(userMail)) // temporary; from local storage
        .build();
    }
  }
  /**
   * start websoket connection
   * */
  startChatHubConnection(): void {
    this.hubChatConnection.start().then(() => {
      this.connectionChatEstablished = true;
    });
  }
  /**
   * stop websoket connection
   * */
  stopChatHubConnection(): void {
    if (this.hubChatConnection) {
      this.hubChatConnection.stop().then(() => {
        this.connectionChatEstablished = false;
      });
    }
  }
  /**
   * invoke send broad cast messgae backend hub,the  result  is produced  as the result of resolving the promise
   * @param message
   */
  invokeSendBroadCastMessage(message: string): Promise<any> {
    return this.hubNotificationConnection.invoke(SEND, message);
  }
  /**
   * invoke send broad cast messgae expect me backend hub, the  result  is produced  as the result of resolving the promise
   * @param message
   */
  invokeSendBroadCastMessageExpectMe(message: string): Promise<any> {
    return this.hubNotificationConnection.invoke(SEND_TO_All_EXPECT_ME, message);
  }
  /**
   * invoke send notification to multiple users backend hub, the  result  is produced  as the result of resolving the promise
   * @param mails
   * @param message
   */
  invokeSendNotificationToMultipleUsers(mails: Array<string>, idInfo: number): Promise<any> {
    return this.hubNotificationConnection.invoke(SEND_NOTIFICATION_TO_MULTIPLE_USERS, JSON.stringify(new MessageToSend(mails, idInfo)));
  }

  // CommentHub
  /**
   * create websoket connection
   * */
  createCommentHubConnection(): void {
    if (!this.connectionCommentEstablished) {
      let userData = this.localStorageService.getUser();
      const userMail = userData ? userData.Email : '';
      this.hubCommentConnection = new HubConnectionBuilder()
        .withUrl((this.config.getConfig(API_CONFIG) as string)
          .concat(COMMENT)
          .concat('?userMail=')
          .concat(userMail)) // temporary; from local storage
        .build();
    }
  }
  /**
   * start websoket connection
   * */
  startCommentHubConnection(): void {
    this.hubCommentConnection.start().then(() => {
      this.connectionCommentEstablished = true;
    });
  }
  /**
   * stop websoket connection
   * */
  stopCommentHubConnection(): void {
    if (this.hubCommentConnection) {
      this.hubCommentConnection.stop().then(() => {
        this.connectionCommentEstablished = false;
      });
    }
  }


  // progressHub
  /**
   * create websoket connection
   * */
  createLeaveBalanceRemainingProgressHubConnection(): void {
    if (!this.connectionProgressEstablished) {
      const userMail = JSON.parse(localStorage.getItem('user')) ? JSON.parse(localStorage.getItem('user')).Email : '';
      this.hubLeaveBalanceRemainingProgressConnection = new HubConnectionBuilder()
        .withUrl((this.config.getConfig(API_CONFIG) as string)
          .concat(LEAVE_BALANCE_REMAINING_PROGRESS)
          .concat('?userMail=')
          .concat(userMail)) // temporary; from local storage
        .build();
    }
  }

  /**
   * start websoket leave balance remaining connection
   * */
  startLeaveBalanceRemainingProgressHubConnection(): void {
    this.hubLeaveBalanceRemainingProgressConnection.start().then(() => {
      this.connectionLeaveBalanceRemainingProgressEstablished = true;
    });
  }

  /**
   * stop websoket Source deduction session connection
   * */
  stopLeaveBalanceRemainingProgressHubConnection(): void {
    if (this.hubLeaveBalanceRemainingProgressConnection) {
      this.hubLeaveBalanceRemainingProgressConnection.stop().then(() => {
        this.connectionLeaveBalanceRemainingProgressEstablished = false;
      });
    }
  }

}
