import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../services/user/user.service';
import {User} from '../../models/administration/user.model';
import {PredicateFormat} from '../../shared/utils/predicate';
import {UserConstant} from '../../constant/Administration/user.constant';
import {NumberConstant} from '../../constant/utility/number.constant';
import {GridSettings} from '../../shared/utils/grid-settings.interface';
import {State} from '@progress/kendo-data-query';
import {UserPrivilege} from '../../models/administration/user-privilege.model';
import {SharedConstant} from '../../constant/shared/shared.constant';
import {FormBuilder, FormGroup} from '@angular/forms';
import {isNullOrUndefined} from 'util';
import {ItemConstant} from '../../constant/inventory/item.constant';
import {SwalWarring} from '../../shared/components/swal/swal-popup';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-desactivate-users-details',
  templateUrl: './desactivate-users-details.component.html',
  styleUrls: ['./desactivate-users-details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DesactivateUsersDetailsComponent implements OnInit {
  public listUserUrl = UserConstant.USER_URL_LIST;
  public users: number[] = [];
  public listOfUsers: any [];
  public UserPicture: any;
  public status = false;
  public listUserPrivilege: UserPrivilege [];
  public privilegeopened: boolean[] = [];
  public predicate: PredicateFormat;
  defaultPictureUrl = 'assets/image/placeholder-logo.png';
  public pictureSrc: any;
  private imageGrid = [];
  gridState: State = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.TWENTY,
    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: []
    }
  };
  public isList = true;
  public gridSettings: GridSettings = {
    state: this.gridState,
  };
  public formGroup: FormGroup;

  constructor(private dataRoute: ActivatedRoute, public userService: UserService,
              private router: Router, private swalWarrings: SwalWarring, private translate: TranslateService, private fb: FormBuilder) {
  }

  ngOnInit() {
    this.formGroup = this.fb.group({
      Privilege: this.fb.array([]),
    });
    this.users = this.userService.getUserId();
    this.status = this.userService.getUserState();
    this.getUsersFromListId();
    this.isList = this.users.length !== NumberConstant.ONE;
  }

  /**
   * get list of user from list Id
   */
  getUsersFromListId() {
    this.userService.getUsersFromListId(this.users).subscribe(result => {
      this.listOfUsers = result;
      this.gridSettings.gridData = result.UserPrivilege;
      this.getUsersPictures(result);
    });
    
  }

  deleteUserFromListUsersId(id: number) {
    this.listOfUsers = this.listOfUsers.filter(item => item.Id !== id);
  }

  /**
   * desactivate massive users from list of user
   * @param listOfUser
   */
  desactivateMassiveUsers(listOfUser: User []) {
    const demonstrativePronoun = (listOfUser.length > NumberConstant.ONE) ? UserConstant.THESE_USERS :  UserConstant.THIS_USER;
    this.swalWarrings.CreateSwal(this.translate.instant(UserConstant.TEXT_VALIDATION)
        .concat(this.translate.instant(UserConstant.DEACTIVATE))
        .concat(this.translate.instant(demonstrativePronoun)),
      UserConstant.DEACTIVATE_TITLE_VALIDATION).then((result) => {
      if (result.value) {
        this.userService.desactivateMassiveUsers(listOfUser).subscribe(() => {
          this.router.navigateByUrl(UserConstant.USER_URL_LIST);
        });
      }
    });
  }

  /**
   * reactivate massive users from list of user
   * @param listOfUser
   */
  reactivateMassiveUsers(listOfUser: User []) {
    const demonstrativePronoun = (listOfUser.length > NumberConstant.ONE) ? UserConstant.THESE_USERS :  UserConstant.THIS_USER;
    this.swalWarrings.CreateSwal(this.translate.instant(UserConstant.TEXT_VALIDATION)
        .concat(this.translate.instant(UserConstant.ACTIVATE))
        .concat(this.translate.instant(demonstrativePronoun)), UserConstant.ACTIVATE_TITLE_VALIDATION).then((result) => {
      if (result.value) {
        this.userService.reactivateMassiveUsers(listOfUser).subscribe(() => {
            this.router.navigateByUrl(UserConstant.USER_URL_LIST);
          }
        );
      }
    });
  }

  // Id of clicked checkbox
  public getId(dataItem: UserPrivilege, columnIndex: number, rowIndex: number): string {
    return rowIndex.toString().concat(SharedConstant.UNDERSCORE).concat(columnIndex.toString())
      .concat(SharedConstant.UNDERSCORE).concat(dataItem.IdPrivilege.toString());
  }

  gotoLink(platform) {
    let url;
    switch (platform) {
      case 'fb':
        url = SharedConstant.FACEBOOK_LINK + this.formGroup.value.Facebook;
        break;
      case 'tw':
        url = SharedConstant.TWITTER_LINK + this.formGroup.value.Twitter;
        break;
      case 'li':
        url = SharedConstant.LINKEDIN_LINK + this.formGroup.value.Linkedin;
        break;
      default:
        break;
    }
    window.open(url, '_blank');
  }

  public openedPrivilege(index) {
    if (isNullOrUndefined(this.privilegeopened[index]) || !this.privilegeopened[index]) {
      this.privilegeopened[index] = true;
    } else {
      this.privilegeopened[index] = false;
    }
  }
  /**get picture */
  getPictureSrc(UrlPicture:string, index): any {   
    if(UrlPicture) {
    this.userService.getPicture(UrlPicture).subscribe((data)=> {
      this.pictureSrc ='data:image/png;base64,'+data;  
      this.imageGrid[index] = this.pictureSrc;
     });
    } else {
      this.imageGrid[index] = this.defaultPictureUrl;
    }
 }
 getUsersPictures(listOfUsers : User[]){
  listOfUsers.forEach((user, index) => {
    this.getPictureSrc(user.UrlPicture, index);
  });
 }
   
}
