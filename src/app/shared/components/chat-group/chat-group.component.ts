import {ChatService} from '../../services/signalr/chat/chat.service';
import {Component, OnInit, Inject, ElementRef, ViewChild, ViewEncapsulation} from '@angular/core';
import {UserDetailChat} from '../../../models/shared/user-detail-chat.model';
import {ChatConstant} from '../../../constant/chat/chat.constant';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {checkStringRespectRegEx} from '../../helpers/string.helper';
import {NumberConstant} from '../../../constant/utility/number.constant';
import { UserCurrentInformationsService } from '../../services/utility/user-current-informations.service';
import {LocalStorageService} from '../../../login/Authentification/services/local-storage-service';


@Component({
  selector: 'app-chat-group',
  templateUrl: './chat-group.component.html',
  styleUrls: ['./chat-group.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ChatGroupComponent implements OnInit {

  /**
   * id of current user
   */
  public idCurrentUser: any;
  /**
   * list id of connected users
   */
  public idsUsersList: number[] = [];
  /**
   * list of unconnected users
   */
  public usersUnConnectedList: UserDetailChat[] = new Array<UserDetailChat>(); // notification list data
  /**
   * list of all users
   */
  public usersList: UserDetailChat[] = new Array<UserDetailChat>(); // notification list data
  /**
   * list of connected users
   */
  public usersConnectedList: UserDetailChat[] = new Array<UserDetailChat>(); // notification list data
  /**
   * list of all users unfiltred list
   */
  public usersUnFiltredList: UserDetailChat[];
  /**
   * list of members of a group
   */
  public groupMembers: UserDetailChat[] = new Array<UserDetailChat>(); // the group members
  /**
   * list of members of an existed group
   */
  public oldMembers: any;
  /**
   * Check if this will make a new discussion or just update an old one
   */
  public newDiscussion = true;
  /**
   * Name of discussion
   */
  public discussionName: string;
  /**
   * mot recherché
   */
  @ViewChild('filterName', {read: ElementRef}) public input: ElementRef;

  constructor(public dialogRef: MatDialogRef<ChatGroupComponent>, private chatService: ChatService,
              @Inject(MAT_DIALOG_DATA) public data: any, private localStorageService : LocalStorageService) {
    this.usersConnectedList = data.listConnectedUsers;
    this.usersUnConnectedList = data.listUnconnectedUsers;
    this.usersList = this.usersConnectedList.concat(this.usersUnConnectedList);
    this.discussionName = data.discussionName;
    if (data.groupMembersList) {
      this.oldMembers = data.groupMembersList;
      if (data.groupMembersList.length) {
        this.newDiscussion = data.groupMembersList.length > 1 ? false : true;
        this.usersList = this.usersList.filter(x =>
          !this.oldMembers.find(j => j.Id === x.Id));
      } else {
        this.usersList = this.usersList.filter(x =>
          this.oldMembers.Id !== x.Id);
      }
    } else {
      this.groupMembers = [];
    }
    this.usersUnFiltredList = Object.assign([], this.usersList);
  }

  ngOnInit() {
    // Init chat hub connection usersUnConnectedList
    this.idCurrentUser = this.localStorageService.getUserId();
    this.chatService.initChatHubConnection();

    // Get list of users
    this.chatService.usersListSubject.subscribe((data: any) => {
      this.usersUnFiltredList = Object.assign([], this.usersList);
      this.idsUsersList = [];
      this.usersList.forEach(element => {
        this.idsUsersList.push(element.Id);
      });
    });
    if (this.newDiscussion) {
      if (this.oldMembers) {
        this.addToGroup(this.oldMembers);
      }
    } else {
      this.oldMembers.forEach(x => this.addToGroup(x));
    }
  }

  searchUser(searchValue: string) {
    if (searchValue.length === NumberConstant.ZERO) {
      if (this.groupMembers.length === NumberConstant.ZERO) {
        this.usersList = this.usersUnFiltredList;
      } else {
        this.usersList = this.usersUnFiltredList.filter(x =>
          !this.groupMembers.includes(x));
      }
    } else {
      this.usersList = this.usersList.filter(x =>
        x.FullName.toLowerCase().includes(searchValue.toLowerCase())
      );
    }
  }

  addToGroup(member: UserDetailChat) {
    this.groupMembers.push(member);
    this.usersList = this.usersList.filter(x =>
      x.Id !== member.Id);
    this.input.nativeElement.value = '';
    this.searchUser('');
  }

  removeMember(member: UserDetailChat) {
    this.groupMembers = this.groupMembers.filter(x =>
      x.Id !== member.Id);
    this.usersList = this.usersUnFiltredList.filter(x =>
      !this.groupMembers.includes(x));
  }

  clearGroupMembers() {
    this.usersList = Object.assign([], this.usersUnFiltredList);
    if (this.oldMembers) {
      if (this.newDiscussion) {
        this.groupMembers = [];
        this.groupMembers.push(this.oldMembers);
      } else {
        this.groupMembers = Object.assign([], this.oldMembers);
      }
    } else {
      this.groupMembers = [];

    }
  }

  closeDialogWithData() {

    this.dialogRef.close([this.groupMembers]);

  }

  onClose() {
    this.dialogRef.close();
  }
}
