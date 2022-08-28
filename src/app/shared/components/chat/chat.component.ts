import { Component, OnInit, ViewChild, ElementRef, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ChatService } from '../../services/signalr/chat/chat.service';
import { UserDetailChat } from '../../../models/shared/user-detail-chat.model';
import { DiscussionChat } from '../../../models/shared/discussion-chat.model';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { MessageChat } from '../../../models/shared/message-chat.model';
import { User } from '../../../models/administration/user.model';
import { UserDiscussionChat } from '../../../models/shared/user-discussion-chat.model';
import { ChatConstant } from '../../../constant/chat/chat.constant';
import { MatDialog } from '@angular/material';
import { ChatGroupComponent } from './../chat-group/chat-group.component';
import { Subscription } from 'rxjs/Subscription';
import { checkStringRespectRegEx } from '../../helpers/string.helper';
import { FormModalDialogService } from '../../services/dialog/form-modal-dialog/form-modal-dialog.service';
import {LocalStorageService} from '../../../login/Authentification/services/local-storage-service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class ChatComponent implements OnInit, OnDestroy {
  @ViewChild('sideTwo', { read: ElementRef }) public SideTwo: ElementRef;
  @ViewChild('Conversation', { read: ElementRef }) public Conversation: ElementRef;
  @ViewChild('editDiscussionName') editDiscussionNameElement: ElementRef;

  public usersList: UserDetailChat[] = new Array<UserDetailChat>();
  public usersConnectedList: UserDetailChat[] = new Array<UserDetailChat>();
  public idsUsersConnectedList: number[] = [];
  public usersUnConnectedList: UserDetailChat[] = new Array<UserDetailChat>();
  public messageFormGroup: FormGroup;
  public receiver: UserDetailChat;
  public receiverName: string;
  public user: UserDetailChat;
  public discussion: DiscussionChat;
  public currentUserDiscussion: UserDiscussionChat;
  public receiverUserDiscussion: UserDiscussionChat[];
  public numberOfNotif = NumberConstant.ZERO;
  public messages: Array<MessageChat>;
  public seenBy: Array<UserDiscussionChat>;
  public myDiscussions: Array<DiscussionChat>;
  public myGroupDiscussions: Array<DiscussionChat>;
  public myGroupDiscussionsSearch: Array<DiscussionChat>;
  public idCurrentUser: any;
  public connectedUsersUnFiltredList: UserDetailChat[];
  public UnconnectedUsersUnFiltredList: UserDetailChat[];
  private groupMembersList: UserDetailChat[];
  public groupMembersName = '';
  public isGroupOfDiscussion: boolean;
  public isDiscussionNameChanged: boolean;
  public isEmptyPairDiscussion: boolean;
  public membersSeenLastMessageFromDB: UserDiscussionChat[] = new Array<UserDiscussionChat>();


  constructor(private chatService: ChatService, private fb: FormBuilder,
    private dialog: MatDialog, private localStorageService : LocalStorageService) {
  }

  ngOnInit() {
    this.idCurrentUser = this.localStorageService.getUserId();
    // Init chat hub connection
    this.chatService.initChatHubConnection();
    this.chatService.getConnectedUsers();
    this.chatService.getUnConnectedUsers();
    // Get number of notif
    this.GetNumberOfNotifChat();
    // Get list of users
    this.chatService.usersListSubject.subscribe((data: any) => {
      this.usersConnectedList = data[ChatConstant.USERS_CONNECTED_LIST];
      this.usersUnConnectedList = data[ChatConstant.USERS_UNCONNECTED_LIST];
      this.connectedUsersUnFiltredList = Object.assign([], this.usersConnectedList);
      this.UnconnectedUsersUnFiltredList = Object.assign([], this.usersUnConnectedList);
      this.usersList = this.connectedUsersUnFiltredList.concat(this.UnconnectedUsersUnFiltredList);
      this.idsUsersConnectedList = [];
      this.usersConnectedList.forEach(element => {
        this.idsUsersConnectedList.push(element.Id);
      });
      // Get list  discussions of current user
      this.getCurrentUserDiscussionList();
    });
    this.chatService.ReceiveMessage();
    this.chatService.ReceiveNewDiscussionName();
    this.chatService.ReceiveSeenMessageEvent();
    this.chatService.ReceiveNewGroupMembers();
    this.subscribeOnMessageList();
    this.getNewDiscussionName();
    this.getNewGroupMembers();
    this.getSeenByUserList();
    this.subscribeOnNewDiscussion();
    this.createAddForm();
    this.Conversation.nativeElement.addEventListener(ChatConstant.SCROLL, this.scrollEvent.bind(this), true);
    this.dragChatIcon();
  }

  ngOnDestroy() {
    this.chatService.destroyChatHubConnection();
  }

  /**
   * Prepare the drag event
   */
  dragChatIcon() {
    const Draggabilly = require('draggabilly');
    const draggie = new Draggabilly(document.querySelector('.draggable'), {
      containment: document.querySelector('.app-main'),
    });
    this.dragEvent(draggie);
  }

  /**
   * Drag Event
   * @param draggie
   */
  dragEvent(draggie: any) {
    draggie.on('dragMove', function () {
    });

    draggie.on('dragEnd', function () {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      setTimeout(function () {
      }, NumberConstant.FIVE_HUNDRED);

      const newTopValue = (draggie.position.y / Math.floor(windowHeight / NumberConstant.TEN))
        * NumberConstant.TEN;

      const newLeftValue = (draggie.position.x / Math.floor(windowWidth / NumberConstant.TEN))
        * NumberConstant.TEN;
      document.getElementById(ChatConstant.OPEN_CONTACT_FORM_BUTTON).style.top = newTopValue.toFixed(NumberConstant.ONE) + '%';
      document.getElementById(ChatConstant.OPEN_CONTACT_FORM_BUTTON).style.left = newLeftValue.toFixed(NumberConstant.ONE) + '%';

      if (draggie.position.y < NumberConstant.ZERO) {
        document.getElementById(ChatConstant.OPEN_CONTACT_FORM_BUTTON).style.top = NumberConstant.ZERO + '%';
      }
      if (draggie.position.x < NumberConstant.ZERO) {
        document.getElementById(ChatConstant.OPEN_CONTACT_FORM_BUTTON).style.left = NumberConstant.ZERO + '%';
      }
      if (draggie.position.y + NumberConstant.FORTY_FIVE >= windowHeight) {
        document.getElementById(ChatConstant.OPEN_CONTACT_FORM_BUTTON).style.top = (NumberConstant.NINETY +
          Math.floor(((Math.floor(windowHeight / 10) - NumberConstant.FIFTY) / Math.floor(windowHeight / 10)) * NumberConstant.TEN)) + '%';
      }
      if (draggie.position.x + NumberConstant.FIFTY >= windowWidth) {
        document.getElementById(ChatConstant.OPEN_CONTACT_FORM_BUTTON).style.left = (NumberConstant.NINETY +
          Math.floor(((Math.floor(windowWidth / 10) - NumberConstant.FIFTY) / Math.floor(windowWidth / 10)) * NumberConstant.TEN)) + '%';
      }
    });
  }

  /**
   * open chat with receiver if click on user
   * @param receiver
   */
  openChat(receiver: UserDetailChat) {
    this.isEmptyPairDiscussion = true;
    this.openChatElement();
    this.discussion = null;
    this.receiver = null;
    this.currentUserDiscussion = null;
    this.receiver = receiver;
    this.receiverName = receiver.FullName;
    this.receiverUserDiscussion = null;
    this.messages = new Array<MessageChat>();
    this.chatService.getDiscussion(receiver).subscribe((data) => {
      this.discussion = data;
      if (data !== null) {
        this.GetUsersDiscussions(data);
        this.chatService.reloadMessages();
        this.chatService.getMessages(this.discussion.Id);
        this.subscribeOnMessageList();
        this.chatService.clearSeenBy();
        this.getSeenByUserList();
        this.chatService.sendSeenByEvent(this.currentUserDiscussion, this.receiverUserDiscussion);
      }
    }
    );
  }

  GetUsersDiscussions(discussion: DiscussionChat) {
    this.chatService.setDiscussion(this.discussion);
    if (discussion.UserDiscussionChat) {
      const idUser = this.localStorageService.getUserId();
      // Get current user discussion
      const userDiscussionChat: UserDiscussionChat[] = this.discussion.UserDiscussionChat.filter(
        (x) => x.IdUser === idUser);
      this.messageFormGroup.controls[ChatConstant.ID_USER_DISCUSSION].setValue(userDiscussionChat[NumberConstant.ZERO].Id);
      this.currentUserDiscussion = userDiscussionChat[NumberConstant.ZERO];
      // Mark UserDiscussion as viewed
      this.chatService.MarkNotifUserDiscussion(this.currentUserDiscussion).subscribe();
      // Get receiver user discussion
      this.receiverUserDiscussion = this.discussion.UserDiscussionChat.filter(
        (x) => x.IdUser !== idUser);

    }
  }

  checkSeenByMembers() {
    this.membersSeenLastMessageFromDB = this.receiverUserDiscussion.filter(x => !x.HasNotif);
    if (this.discussion.LastMsg) {
      this.seenBy = this.membersSeenLastMessageFromDB.filter(y => y.Id !== this.discussion.LastMsg.IdUserDiscussion);
      this.chatService.setUserSeenLastMessage(this.seenBy);
    }
  }

  /**
   *  open chat with receiver if click on discussion
   * @param receiver
   */
  openDiscussion(discussion: DiscussionChat) {
    this.chatService.getDiscussionById(discussion.Id).subscribe(data => {
      this.discussion = data;
      this.isEmptyPairDiscussion = false;
      this.messages = new Array<MessageChat>();
      this.GetUsersDiscussions(this.discussion);
      this.listOfMembers(this.discussion);
      if (discussion.NumberOfDiscussionMember === NumberConstant.TWO) {
        this.receiverName = this.receiverUserDiscussion[NumberConstant.ZERO].IdUserNavigation.FirstName;
      } else {
        this.receiverName = this.discussion.Name;
        this.isGroupOfDiscussion = true;
        this.isDiscussionNameChanged = false;
      }
      this.chatService.reloadMessages();
      this.chatService.getMessages(this.discussion.Id);
      this.subscribeOnMessageList();
      this.checkSeenByMembers();
      this.chatService.clearSeenBy();
      this.getSeenByUserList();
      this.chatService.sendSeenByEvent(this.currentUserDiscussion, this.receiverUserDiscussion);
      this.openChatElement();
    });
  }

  /**
   * update message list of current discussion
   */
  private subscribeOnMessageList(): void {
    this.chatService.messagesListSubject
      .subscribe((data: Array<MessageChat>) => {
        this.messages = data;
      });
  }

  private getNewDiscussionName(): void {
    this.chatService.newDiscussionNameSubject
      .subscribe((data: string) => {
        this.receiverName = data;
      });
  }

  private getNewGroupMembers(): void {
    this.chatService.newGroupMembersSubject
      .subscribe((data) => {
        this.receiverUserDiscussion = data;
        this.chatService.getDiscussionById(this.discussion.Id).subscribe(discussion => {
          this.discussion = discussion;
          this.listOfMembers(this.discussion);
        });
      });
  }

  private getSeenByUserList(): void {
    this.chatService.seenByListSubject
      .subscribe((data: Array<UserDiscussionChat>) => {
        if (this.discussion) {
          this.chatService.getDiscussionById(this.discussion.Id).subscribe(discussion => {
            this.discussion = discussion;
            data.forEach(user => {
              if (!this.seenBy.includes(user)) {
                this.seenBy = data.filter(x => discussion.LastMsg.IdUserDiscussion !== x.Id);
              }
            });
          });
        }
      });
  }

  /**
   * if current user recieve new message
   */
  private subscribeOnNewDiscussion(): void {
    this.chatService.discussionsListSubject
      .subscribe(() => {
        this.getCurrentUserDiscussionList();
        this.GetNumberOfNotifChat();
      });
  }

  /**
   * form  add new message
   */
  private createAddForm() {
    this.messageFormGroup = this.fb.group({
      Id: [NumberConstant.ZERO],
      Text: ['', [Validators.required]],
      Date: [new Date()],
      IdUserDiscussion: [NumberConstant.ZERO]
    });
  }

  /**
   *  send new message
   */
  save() {
    if (checkStringRespectRegEx(this.messageFormGroup.value.Text, /\S/)) {
      if (this.messageFormGroup.valid) {
        const obj: MessageChat = Object.assign({}, null, this.messageFormGroup.value);
        if (this.discussion === null) {
          this.chatService.createDiscussion(this.receiver).subscribe((data) => {
            // Get Current Discussion
            this.discussion = data;
            this.GetUsersDiscussions(data);
            // Get list message of current discussion
            this.chatService.reloadMessages();
            this.chatService.getMessages(this.discussion.Id);
            this.subscribeOnMessageList();
            obj.IdUserDiscussion = this.currentUserDiscussion.Id;
            this.chatService.sendMessage(obj).subscribe((res) => {
              this.chatService.notifUser(res, this.receiverUserDiscussion);
              this.Text.patchValue('');
              this.seenBy = new Array<UserDiscussionChat>();
              this.chatService.setUserSeenLastMessage(this.seenBy);
            });
            this.isEmptyPairDiscussion = false;
          });
        } else {
          this.chatService.sendMessage(obj).subscribe((data) => {
            this.GetUsersDiscussions(this.discussion);
            this.messages.push(data);
            this.chatService.notifUser(data, this.receiverUserDiscussion);
            this.Text.patchValue('');
            this.seenBy = new Array<UserDiscussionChat>();
            this.chatService.setUserSeenLastMessage(this.seenBy);
            this.markUserDiscussionAsViewed();
          });
        }
      }
    }
  }

  markUserDiscussionAsViewed() {
    this.chatService.MarkNotifUserDiscussion(this.currentUserDiscussion).subscribe(() => {
      this.chatService.sendSeenByEvent(this.currentUserDiscussion, this.receiverUserDiscussion);
    });
  }

  /**
   * get list discussion of current user
   */
  getCurrentUserDiscussionList() {
    this.chatService.getCurrentUserDiscussionListsChat().subscribe((data: DiscussionChat[]) => {
     data.forEach(element => {
       const userDiscussionChat: UserDiscussionChat[] = element.UserDiscussionChat.filter(
         (x) => x.IdUser !== this.localStorageService.getUserId());
       const receiver: User[] = new Array<User>();
       for (let index = NumberConstant.ZERO; index < userDiscussionChat.length; index++) {
         receiver.push(userDiscussionChat[index].IdUserNavigation);
         this.checkUserStatus(receiver[index]);
       }
     });
     this.myDiscussions = data.filter(x => x.NumberOfDiscussionMember === NumberConstant.TWO);
     this.myGroupDiscussions = data.filter(x => x.NumberOfDiscussionMember > NumberConstant.TWO);
    });
  }

  /**
   * Verify if the receiver is connected
   */
  checkUserStatus(receiver: User) {
    if (this.idsUsersConnectedList.indexOf(receiver.Id) !== NumberConstant.MINUS_ONE) {
      receiver.IsUserOnline = true;
    }
  }

  /**
   * on scroll event old message
   */
  scrollEvent() {
    let lastScrollTop = NumberConstant.ZERO;
    const st = document.getElementById(ChatConstant.CONVERSATION).scrollTop;
    if (st > lastScrollTop) {
      // Scroll Down
    } else {
      if (this.discussion) {
        this.chatService.getMessages(this.discussion.Id);
        this.subscribeOnMessageList();
      }
    }
    lastScrollTop = st <= NumberConstant.ZERO ? NumberConstant.ZERO : st;
  }

  get Text(): FormControl {
    return this.messageFormGroup.get(ChatConstant.TEXT) as FormControl;
  }

  searchUser(searchValue: string) {
    if (searchValue.length === NumberConstant.ZERO) {
      this.usersConnectedList = Object.assign([], this.connectedUsersUnFiltredList);
      this.usersUnConnectedList = Object.assign([], this.UnconnectedUsersUnFiltredList);
      this.myGroupDiscussionsSearch = new Array<DiscussionChat>();
      // Show section recent discussion
      document.getElementById(ChatConstant.SECTION_CHAT_RECENT).setAttribute(ChatConstant.STYLE, ChatConstant.DISPLAY_BLOCK);
    } else {
      this.usersConnectedList = this.usersConnectedList.filter(x =>
        x.FullName.toLowerCase().includes(searchValue.toLowerCase()));
      this.usersUnConnectedList = this.usersUnConnectedList.filter(x =>
        x.FullName.toLowerCase().includes(searchValue.toLowerCase()));
      this.myGroupDiscussionsSearch = this.myGroupDiscussions.filter(x =>
        x.Name.toLowerCase().includes(searchValue.toLowerCase()));
      // Hide section recent discussion
      document.getElementById(ChatConstant.SECTION_CHAT_RECENT).setAttribute(ChatConstant.STYLE, ChatConstant.DISPLAY_NONE);
    }
  }

  GetNumberOfNotifChat() {
    this.chatService.GetNumberOfNotifChat().subscribe((data => {
      this.numberOfNotif = data;
    }
    ));
  }

  closeChat() {
    // Mark UserDiscussion as viewed
    if (this.currentUserDiscussion != null) {
      this.chatService.MarkNotifUserDiscussion(this.currentUserDiscussion).subscribe((res) => {
        this.chatService.sendSeenByEvent(this.currentUserDiscussion, this.receiverUserDiscussion);
        this.seenBy = new Array<UserDiscussionChat>();
        this.getCurrentUserDiscussionList();
      });
    }

    this.isGroupOfDiscussion = false;
    this.discussion = null;
    this.SideTwo.nativeElement.style.left = ChatConstant.MINUS_ONE_HUNDRED_PERCENT;
    document.getElementById(ChatConstant.HEADING_CHAT_LIST_ITEMS).setAttribute(ChatConstant.STYLE, ChatConstant.DISPLAY_BLOCK);
    document.getElementById(ChatConstant.HEADING_MESSAGE_BOX).setAttribute(ChatConstant.STYLE, ChatConstant.DISPLAY_NONE);
    document.getElementById(ChatConstant.CHAT_BODY).classList.remove(ChatConstant.CHAT_BODY_MESSAGE_BOX);
    document.getElementById(ChatConstant.CHAT_BODY).classList.add(ChatConstant.CHAT_BODY);
  }

  showChatButton() {
    document.getElementById(ChatConstant.OPEN_CONTACT_FORM_BUTTON).setAttribute(ChatConstant.STYLE, ChatConstant.DISPLAY_BLOCK);
  }

  openChatElement() {
    this.SideTwo.nativeElement.style.left = NumberConstant.ZERO;
    document.getElementById(ChatConstant.HEADING_MESSAGE_BOX).setAttribute(ChatConstant.STYLE, ChatConstant.DISPLAY_BLOCK);
    document.getElementById(ChatConstant.HEADING_CHAT_LIST_ITEMS).setAttribute(ChatConstant.STYLE, ChatConstant.DISPLAY_NONE);
    document.getElementById(ChatConstant.CHAT_BODY).classList.remove(ChatConstant.CHAT_BODY);
    document.getElementById(ChatConstant.CHAT_BODY).classList.add(ChatConstant.CHAT_BODY_MESSAGE_BOX);
  }

  openBoxChat() {
    if (!(JSON.parse(localStorage.getItem(ChatConstant.DRAGGING_CHAT)) as boolean)) {
      this.getCurrentUserDiscussionList();
      document.getElementById(ChatConstant.TOP_BTN_MINUS).classList.add(ChatConstant.TOP_BTN_SHOW);
      document.getElementById(ChatConstant.BOX_CHAT).classList.add(ChatConstant.SHOW_BOX_CHAT);
      document.getElementById(ChatConstant.OPEN_CONTACT_FORM_BUTTON).classList.add(ChatConstant.BOTTOM_CHAT_BTN_HIDE);
    }
  }

  closeBoxChat() {
    if (this.discussion) {
      this.closeChat();
    }
    this.GetNumberOfNotifChat();
    document.getElementById(ChatConstant.OPEN_CONTACT_FORM_BUTTON).classList.remove(ChatConstant.BOTTOM_CHAT_BTN_HIDE);
    document.getElementById(ChatConstant.BOX_CHAT).classList.remove(ChatConstant.SHOW_BOX_CHAT);
  }

  createGroup(oldUserDiscussionChat: UserDiscussionChat): void {
    let oldMember;
    const discussionName = '';
    if (oldUserDiscussionChat) {
      oldMember = this.usersList.find(u => u.Id === oldUserDiscussionChat.IdUser);
    }
    const dialogRef = this.dialog.open(ChatGroupComponent, {
      width: '400px',
      position: { right: '25px' },
      panelClass: 'mat-dialog-container',
      data: {
        listConnectedUsers: this.usersConnectedList,
        listUnconnectedUsers: this.usersUnConnectedList,
        groupMembersList: oldMember,
        discussionName: discussionName
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Get Selected Members from matDialog
        this.groupMembersList = result[NumberConstant.ZERO];

        if (this.groupMembersList.length === NumberConstant.ONE) {
          this.openChat(this.groupMembersList[NumberConstant.ZERO]);
        } else {
          this.chatService.createChatGroup(this.groupMembersList, discussionName).subscribe((data) => {
            // Get Current Discussion
            this.discussion = data;
            this.messages = new Array<MessageChat>();
            this.chatService.reloadMessages();
            this.chatService.getMessages(this.discussion.Id);
            this.subscribeOnMessageList();
            this.GetUsersDiscussions(this.discussion);
            this.chatService.clearSeenBy();
            this.getSeenByUserList();
            this.receiverName = this.discussion.Name;
            this.isGroupOfDiscussion = true;
            this.listOfMembers(this.discussion);
            this.openChatElement();
          });
        }
      }
    });
  }

  addMember() {
    const discussionName = this.discussion.Name;
    this.GetUsersDiscussions(this.discussion);
    const oldMembers: UserDetailChat[] = new Array<UserDetailChat>();
    if (this.discussion.NumberOfDiscussionMember === NumberConstant.TWO) {
      this.createGroup(this.receiverUserDiscussion.find(x => x.IdUser !== this.idCurrentUser));
      this.seenBy = new Array<UserDiscussionChat>();
    } else {
      this.receiverUserDiscussion.forEach(p => {
        oldMembers.push(this.usersList.find(x => x.Id === p.IdUser));
      });
      const dialogRef = this.dialog.open(ChatGroupComponent, {
        width: '400px',
        position: { right: '25px' },
        panelClass: 'mat-dialog-container',
        data: {
          listConnectedUsers: this.usersConnectedList,
          listUnconnectedUsers: this.usersUnConnectedList,
          groupMembersList: oldMembers
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          result = result[0].filter(u => oldMembers.indexOf(u) < NumberConstant.ZERO);
          if (result.length) {
            this.groupMembersList = result;
            this.chatService.AddNewMembers(this.groupMembersList, this.discussion.Id).subscribe((data) => {
              this.discussion = data;
              this.GetUsersDiscussions(data);
              this.chatService.reloadMessages();
              this.chatService.getMessages(data.Id);
              this.subscribeOnMessageList();
              this.receiverName = discussionName;
              this.isGroupOfDiscussion = true;
              this.listOfMembers(data);
              this.chatService.clearSeenBy();
              this.getSeenByUserList();
              this.chatService.sendNewGroupMembers(this.discussion.Id, this.receiverUserDiscussion);
            });
          }
        }
      });
    }
  }

  listOfMembers(discussion: DiscussionChat) {
    this.groupMembersName = '';
    if (discussion) {
      this.receiverUserDiscussion.forEach(x =>
        this.groupMembersName += x.IdUserNavigation.FirstName + ' ' + x.IdUserNavigation.LastName + '<br>'
      );
    }
  }

  updateDiscussionName() {
    this.isDiscussionNameChanged = !this.isDiscussionNameChanged;
    setTimeout(() => { // this will make the execution after the above boolean has changed
      this.editDiscussionNameElement.nativeElement.focus();
    }, 0);
    if (!(checkStringRespectRegEx(this.receiverName, /\S/))) {
      this.receiverName = this.discussion.Name;
    } else {
      this.chatService.updateChatGroupName(this.discussion.Id, this.receiverName).subscribe(data => {
        this.chatService.sendNewDiscussionName(this.discussion.Id, this.receiverName, this.receiverUserDiscussion);
      });
    }
  }
}
