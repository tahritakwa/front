import {Injectable, Inject} from '@angular/core';
import {ResourceService} from '../../resource/resource.service';
import {DiscussionChat} from '../../../../models/shared/discussion-chat.model';
import {AppConfig} from '../../../../../COM/config/app.config';
import {SignalrHubService} from '../signalr-hub/signalr-hub.service';
import {UserService} from '../../../../administration/services/user/user.service';
import {HttpClient} from '@angular/common/http';
import {UserDetailChat} from '../../../../models/shared/user-detail-chat.model';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {Operation} from '../../../../../COM/Models/operations';
import {MessageChat} from '../../../../models/shared/message-chat.model';
import {ObjectToSave} from '../../../../models/shared/objectToSend';
import {ChatConstant} from '../../../../constant/chat/chat.constant';
import {DataTransferShowSpinnerService} from '../../spinner/data-transfer-show-spinner.service';
import {NumberConstant} from '../../../../constant/utility/number.constant';
import {UserDiscussionChat} from '../../../../models/shared/user-discussion-chat.model';
import {ObjectToSend} from '../../../../models/sales/object-to-save.model';
import { UserCurrentInformationsService } from '../../utility/user-current-informations.service';
import {LocalStorageService} from '../../../../login/Authentification/services/local-storage-service';

@Injectable()
export class ChatService extends ResourceService<DiscussionChat> {
  private usersConnectedList: UserDetailChat[] = new Array<UserDetailChat>();
  private usersUnConnectedList: UserDetailChat[] = new Array<UserDetailChat>();
  public usersListSubject: Subject<any> = new Subject<any>();
  private pageNumber = NumberConstant.ZERO;
  private pageSize = NumberConstant.TWENTY;
  public messagesListSubject: Subject<MessageChat[]> = new Subject<MessageChat[]>();
  public seenByListSubject: Subject<UserDiscussionChat[]> = new Subject<UserDiscussionChat[]>();
  public discussion: DiscussionChat;
  private messageListData: MessageChat[] = new Array<MessageChat>();
  private userSeenLastMessageListData: UserDiscussionChat[] = new Array<UserDiscussionChat>();
  private discussionsListData: DiscussionChat[] = new Array<DiscussionChat>();
  public discussionsListSubject: Subject<boolean> = new Subject<boolean>();
  private newDiscussion = false;
  private seenBy: UserDiscussionChat[];
  private newDiscussionName: string;
  private receiversNewMembers: UserDiscussionChat[];
  public newDiscussionNameSubject: Subject<string> = new Subject<string>();
  public newGroupMembersSubject: Subject<UserDiscussionChat[]> = new Subject<UserDiscussionChat[]>();

  /**
   * create new Discussion Chat service
   * @param httpClient
   * @param appConfig
   * @param informationService
   * @param userService
   * @param notificationService
   */
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig,
              @Inject(DataTransferShowSpinnerService) dataTransferShowSpinnerService,
              private signalrHubService: SignalrHubService,
              private localStorageService : LocalStorageService) {
    super(httpClient, appConfig, ChatConstant.DISCUSSION_CHAT_BASE_ROUTE, ChatConstant.DISCUSSION_CHAT, ChatConstant.ERP_SETTINGS,
      dataTransferShowSpinnerService);
  }

  /**
   * Initiate chat hub connection
   */
  initChatHubConnection() {
    if (!this.signalrHubService.connectionChatEstablished) {
      this.signalrHubService.createChatHubConnection();
      this.signalrHubService.startChatHubConnection();
    }
  }

  /**
   * Destroy chat hub connection
   */
  destroyChatHubConnection() {
    this.signalrHubService.stopChatHubConnection();
  }

  /**
   * Get List of connected users
   * */
  getConnectedUsers(): void {
    this.signalrHubService.hubChatConnection.on(ChatConstant.LIST_CONNECTED_USERS, (data: string) => {
      this.unshiftConnectedUsers(JSON.parse(data) as Array<UserDetailChat>, this.usersConnectedList);
      this.emitConnectedUsersList();
    });
  }

  /**
   * Get List of connected users
   * */
  getUnConnectedUsers(): void {
    this.signalrHubService.hubChatConnection.on(ChatConstant.LIST_UNCONNECTED_USERS, (data: string) => {
      this.unshiftUnConnectedUsers(JSON.parse(data) as Array<UserDetailChat>, this.usersUnConnectedList);
      this.emitConnectedUsersList();
    });
  }

  /**
   * Receive Message
   * */
  ReceiveMessage(): void {
    this.signalrHubService.hubChatConnection.on(ChatConstant.RECEIVE_MESSAGE, (data: string) => {
      const msg = JSON.parse(data) as MessageChat;
      this.newDiscussion = true;
      this.emitNewDiscussion();
      if (this.discussion != null) {
        const userDiscussionsIdS = this.discussion.UserDiscussionChat.map(({Id}) => Id);
        const userDiscussionChat: UserDiscussionChat[] = this.discussion.UserDiscussionChat.filter(
          (x) => x.IdUser === this.localStorageService.getUserId());
        if (userDiscussionsIdS.includes(msg.IdUserDiscussion)) {
          this.messageListData.push(msg);
        }
        this.emitMessagesData();
        if (this.discussion && this.discussion.Id === msg.IdUserDiscussionNavigation.IdDiscussion) {
          this.seenBy = new Array<UserDiscussionChat>();
          this.clearSeenBy();
          this.emitUsersSeenLastMessage();
        }
      }
    });
  }

  ReceiveNewDiscussionName(): void {
    this.signalrHubService.hubChatConnection.on(ChatConstant.RECEIVE_NEW_DISCUSSION_NAME, (data) => {
      const newName = JSON.parse(data);
      if (this.discussion && this.discussion.Id === newName.idDiscussion) {
        this.newDiscussionName = newName.newName;
        this.emitNewDiscussionNameData();
      }
    });
  }

  ReceiveNewGroupMembers(): void {
    this.signalrHubService.hubChatConnection.on(ChatConstant.RECEIVE_NEW_GROUP_MEMBERS, (data) => {
      const newMembers = JSON.parse(data);
      if (this.discussion && this.discussion.Id === newMembers.idDiscussion) {
        this.receiversNewMembers = newMembers.userDiscussions;
        this.emitNewDiscussionMembersData();
      }
    });
  }

  ReceiveSeenMessageEvent(): void {
    this.signalrHubService.hubChatConnection.on(ChatConstant.RECEIVE_SEEN_MESSAGE_EVENT, (data: string) => {
      const user = JSON.parse(data) as UserDiscussionChat;
      if (this.discussion) {
        const userDiscussionsIdS = this.discussion.UserDiscussionChat.map(({Id}) => Id);
        if (this.seenBy.length > NumberConstant.ZERO) {
          if (!this.seenBy.find(x => x.Id === user.Id)) {
            this.userSeenLastMessageListData = Object.assign(this.userSeenLastMessageListData, this.seenBy);
            this.addUserSeenLastMessage(userDiscussionsIdS, user);
          }
        } else {
          this.addUserSeenLastMessage(userDiscussionsIdS, user);
        }
      }
    });
  }

  addUserSeenLastMessage(userDiscussionsIdS: number[], user: UserDiscussionChat) {
    if (userDiscussionsIdS.includes(user.Id) && (!this.userSeenLastMessageListData.find(x => x.Id === user.Id))) {
      this.userSeenLastMessageListData.push(user);
      this.emitUsersSeenLastMessage();
    }
  }

  setDiscussion(discussion: DiscussionChat) {
    this.discussion = discussion;
  }

  setUserSeenLastMessage(seenBy: UserDiscussionChat[]) {
    this.seenBy = seenBy;
  }

  sendToSpecificUser(message, receiverUserDiscussion) {
    const data = {
      'message': message,
      'userDiscussions': receiverUserDiscussion
    };
    this.signalrHubService.hubChatConnection
      .invoke(ChatConstant.SEND_SOME_DATA_TO_CONNECTED_USERS, JSON.stringify(data));
    this.userSeenLastMessageListData = new Array<UserDiscussionChat>();
  }

  sendSeenByEvent(userDiscussionChat, receiverUserDiscussion) {
    const data = {
      'userSeenLastMessage': userDiscussionChat,
      'userDiscussions': receiverUserDiscussion
    };
    this.signalrHubService.hubChatConnection.invoke(ChatConstant.SEND_SOME_DATA_TO_CONNECTED_USERS, JSON.stringify(data));
  }

  sendNewDiscussionName(idDiscussion: number, newName: string, receiverUserDiscussion: UserDiscussionChat[]) {
    const data = {
      'idDiscussion': idDiscussion,
      'newName': newName,
      'userDiscussions': receiverUserDiscussion
    };
    this.signalrHubService.hubChatConnection.invoke(ChatConstant.SEND_SOME_DATA_TO_CONNECTED_USERS, JSON.stringify(data));
  }

  sendNewGroupMembers(idDiscussion: number, receiverUserDiscussion: UserDiscussionChat[]) {
    const data = {
      'idDiscussion': idDiscussion,
      'userDiscussions': receiverUserDiscussion
    };
    this.signalrHubService.hubChatConnection.invoke(ChatConstant.SEND_SOME_DATA_TO_CONNECTED_USERS, JSON.stringify(data));
  }

  public unshiftConnectedUsers(users: Array<UserDetailChat>, listUsers: Array<UserDetailChat>): void {
    this.usersConnectedList = [];
    const currentUser = this.localStorageService.getUser();

    users.forEach(user => {
      if (user.Id !== currentUser.IdUser) {
        this.usersConnectedList.unshift(user);
      }
    });
  }

  public unshiftUnConnectedUsers(users: Array<UserDetailChat>, listUsers: Array<UserDetailChat>): void {
    this.usersUnConnectedList = [];
    users.forEach(user => {
      this.usersUnConnectedList.unshift(user);
    });
  }

  /**
   * Emit projgress object
   */
  emitConnectedUsersList() {
    const data = {
      'usersConnectedList': this.usersConnectedList,
      'usersUnConnectedList': this.usersUnConnectedList
    };
    this.usersListSubject.next(data);
  }

  getDiscussion(receiver): Observable<any> {
    return super.callService(Operation.GET, ChatConstant.GET_DISCUSSION.concat(String(receiver.Id)), null, null, true);
  }

  getDiscussionById(idDiscussion: number): Observable<any> {
    return super.callService(Operation.GET, ChatConstant.GET_DISCUSSION_BY_ID.concat(String(idDiscussion)), null, null, true);
  }

  createDiscussion(receiver): Observable<any> {
    return super.callService(Operation.GET, ChatConstant.CREATE_DISCUSSION.concat(String(receiver.Id)), null, null, true);
  }

  createChatGroup(listOfGroupMembers: UserDetailChat[], discussionName: string): Observable<any> {
    const data = {};
    data['discussionName'] = discussionName;
    data['listOfGroupMembers'] = listOfGroupMembers;
    const objectToSend: ObjectToSend = new ObjectToSend(data, null);
    return super.callService(Operation.POST, ChatConstant.CREATE_CHAT_GROUP, objectToSend);
  }

  updateChatGroupName(idDiscussion: number, discussionName: string): Observable<any> {
    const data = {};
    data['idDiscussion'] = idDiscussion;
    data['discussionName'] = discussionName;
    const objectToSend: ObjectToSend = new ObjectToSend(data, null);
    return super.callService(Operation.POST, ChatConstant.UPDATE_CHAT_GROUP_NAME, objectToSend);
  }

  AddNewMembers(newMembers: UserDetailChat[], discussionId: number): Observable<any> {
    const data = {};
    data['newMembers'] = newMembers;
    data['idDiscussion'] = discussionId;
    const objectToSend: ObjectToSend = new ObjectToSend(data, null);
    return super.callService(Operation.POST, ChatConstant.ADD_NEW_MEMBERS, objectToSend);
  }

  getMessages(idDiscussion: number) {
    this.pageNumber = this.pageNumber + 1;
    (super.callService(Operation.POST, ChatConstant.GET_DISCUSSION_MESSAGES, this.prepareDataToSendForList(idDiscussion, this.pageNumber,
      this.pageSize), null, true) as Observable<MessageChat[]>).subscribe((result) => {
      result[ChatConstant.DATA].forEach(element => {
        this.messageListData.unshift(element);
      });
      this.emitMessagesData();
    });
  }

  public reloadMessages(): void {
    this.pageNumber = NumberConstant.MINUS_ONE;
    this.messageListData = new Array<MessageChat>();
  }

  public clearSeenBy(): void {
    this.userSeenLastMessageListData = new Array<UserDiscussionChat>();
  }

  public emitMessagesData() {
    this.messagesListSubject.next(this.messageListData.slice());
  }

  public emitNewDiscussionNameData() {
    this.newDiscussionNameSubject.next(this.newDiscussionName);
  }

  private emitNewDiscussionMembersData() {
    this.newGroupMembersSubject.next(this.receiversNewMembers);
  }

  public emitUsersSeenLastMessage() {
    this.seenByListSubject.next(this.userSeenLastMessageListData);
  }

  public emitNewDiscussion() {
    this.discussionsListSubject.next(this.newDiscussion);
  }

  private prepareDataToSendForList(idDiscussion: number, pageNumber: number, pageSize: number): ObjectToSave {
    const params: ObjectToSave = new ObjectToSave();
    const getListParams: any = {};
    getListParams[ChatConstant.ID_DISCUSSION] = idDiscussion;
    getListParams[ChatConstant.PAGE_NUMBER] = pageNumber;
    getListParams[ChatConstant.PAGE_SIZE] = pageSize;
    params.Model = getListParams;
    return params;
  }

  sendMessage(message): Observable<any> {
    this.messageListData.push(message);
    // this.dataTransferShowSpinnerService.setShowSpinnerValue(true);
    return super.callService(Operation.POST, ChatConstant.ADD_MESSAGE, message, null, true);
  }

  notifUser(message, receiverUserDiscussion) {
    this.sendToSpecificUser(message, receiverUserDiscussion);
  }

  MarkNotifUserDiscussion(userDiscussionChat): Observable<any> {
    return super.callService(Operation.POST, ChatConstant.MARK_NOTIF_USER_DISCUSSION, userDiscussionChat, null, true);
  }

  notifReceiversWithSeenEvent(userDiscussionChat, receiverUserDiscussion) {
    const data = {
      'userSeenLastMessage': userDiscussionChat,
      'userDiscussions': receiverUserDiscussion
    };
    this.signalrHubService.hubChatConnection
      .invoke(ChatConstant.SEND_SOME_DATA_TO_CONNECTED_USERS, JSON.stringify(data));
  }

  logout() {
    this.destroyChatHubConnection();
  }

  getCurrentUserDiscussionListsChat(): Observable<any> {
    return super.callService(Operation.GET, ChatConstant.GET_LIST__DISCUSSIONS_OF_CURRENT_USER, null, null, true);
  }

  GetNumberOfNotifChat(): Observable<any> {
    return super.callService(Operation.GET, ChatConstant.GET_NUMBER_OF_NOTIF_CHAT, null, null, true);
  }

}
