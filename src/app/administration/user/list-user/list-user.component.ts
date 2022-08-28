import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {GridSettings} from '../../../shared/utils/grid-settings.interface';
import {ColumnSettings} from '../../../shared/utils/column-settings.interface';
import {Filter, Operation, OrderBy, OrderByDirection, PredicateFormat, Relation} from '../../../shared/utils/predicate';
import {SortDescriptor, State} from '@progress/kendo-data-query';
import {DataStateChangeEvent, PagerSettings, SelectAllCheckboxState} from '@progress/kendo-angular-grid';
import {Router} from '@angular/router';
import {SwalWarring} from '../../../shared/components/swal/swal-popup';
import {UserConstant} from '../../../constant/Administration/user.constant';
import {UserService} from '../../services/user/user.service';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {CompanyService} from '../../services/company/company.service';
import {FormModalDialogService} from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import {MasterUserAddRoleComponent} from '../../components/master-user-add-role/master-user-add-role.component';
import {User} from '../../../models/administration/user.model';
import {FileInfo} from '../../../models/shared/objectToSend';
import swal from 'sweetalert2';
import {TranslateService} from '@ngx-translate/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {LoginConst} from '../../../constant/login/login.constant';
import {MasterRoleUser} from '../../../models/administration/user-role.model';
import {RoleService} from '../../services/role/role.service';
import {Role} from '../../../models/administration/role.model';
import {GrowlService} from '../../../../COM/Growl/growl.service';
import {DatePipe} from '@angular/common';
import {ReducedCompany} from '../../../models/administration/reduced-company.model';
import { MediaConstant } from '../../../constant/utility/Media.constant';
import {LocalStorageService} from '../../../login/Authentification/services/local-storage-service';

import { UserCurrentInformationsService } from '../../../shared/services/utility/user-current-informations.service';
import { PermissionConstant } from '../../../Structure/permission-constant';
import {AuthService} from '../../../login/Authentification/services/auth.service';

const SEPARATOR = '/';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.scss']
})
export class ListUserComponent implements OnInit {
  public predicate: PredicateFormat = new PredicateFormat();
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public choosenFilter: number;
  public isMasterUsersList = false;
  public currentCompany: ReducedCompany;
  public user: any;
  public isCurrentUser: boolean;
  private importFileUsers: FileInfo;
  dataImported: boolean;
  importData: Array<User>;
  // The list of selected user in the grid
  public usersIdsSelected: number[] = [];
  public usersSelected: User[] = [];
  public selectAllState: SelectAllCheckboxState = SharedConstant.UNCHECKED as SelectAllCheckboxState;
  // the list of all users Id
  public AllUsersIds: number[] = [];
  public AllusersList: User[] = [];
  public showErrorMessage = false;
  public isdelete = true;
  public status: Boolean;
  public formGroup: FormGroup;
  public importColumnsConfig: ColumnSettings[];
  public roleDataSource: Role[];
  public roleFiltredDataSource: Role[];
  /**
   * permissions
   */
  hasUpdatePermission: boolean;
  hasDeletePermission: boolean;
  hasDesactivatePermission: boolean;
  hasReactivatePermission: boolean;
  hasShowPermission: boolean;
  hasAddPermission: boolean;
  public gridState: State = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.TWENTY,
    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: []
    }
  };
  public columnsConfig: ColumnSettings[] = [
    {
      field: UserConstant.ID,
      title: UserConstant.ID,
      filterable: false
    },
    {
      field: UserConstant.FIRST_NAME_FIELD,
      title: UserConstant.USER_LABEL,
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED_FIFTY
    },
    {
      field: UserConstant.LAST_NAME_FIELD,
      title: UserConstant.LAST_NAME,
      filterable: false,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: UserConstant.EMAIL_FIELD,
      title: UserConstant.EMAIL,
      filterable: false,
      _width: NumberConstant.TWO_HUNDRED_FIFTY
    },
    {
      field: UserConstant.USER_COMPANY,
      title: UserConstant.USER_COMPANY_TITLE,
      filterable: false,
      _width: NumberConstant.THREE_HUNDRED
    },
    {
      field: UserConstant.ROLE_FIELD,
      title: UserConstant.ROLE,
      filterable: false,
      _width: NumberConstant.THREE_HUNDRED
    },
    {
      field: UserConstant.LAST_CONNECTION,
      title: UserConstant.LAST_CONNECTION_UPPERCASE,
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: UserConstant.IS_ACTIF,
      title: SharedConstant.STATE_UPPERCASE,
      filterable: false,
      _width: NumberConstant.NINETY
    },
    {
      field: UserConstant.LAST_CONNECTED_IP_ADRESS,
      title: UserConstant.LAST_CONNECTED_IP_ADRESS_UPPERCASE,
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: UserConstant.LAST_CONNECTED_COMPANY,
      title: UserConstant.LAST_CONNECTED_COMPANY_UPPERCASE,
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED
    }
  ];
  public exportColumnsConfig: ColumnSettings[] = [
    {
      field: UserConstant.ID,
      title: UserConstant.ID,
      filterable: true
    },
    {
      field: UserConstant.LAST_NAME_FIELD,
      title: UserConstant.LAST_NAME,
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: UserConstant.FIRST_NAME_FIELD,
      title: UserConstant.FIRST_NAME,
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: UserConstant.EMPLOYEE_FIELD,
      title: UserConstant.EMPLOYEE,
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED_FIFTY
    },
    {
      field: UserConstant.EMAIL_FIELD,
      title: UserConstant.EMAIL,
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED_FIFTY
    },
    {
      field: UserConstant.ROLE_FIELD,
      title: UserConstant.ROLE,
      filterable: true,
      _width: NumberConstant.THREE_HUNDRED
    },
    {
      field: UserConstant.USER_COMPANY,
      title: UserConstant.USER_COMPANY_TITLE,
      filterable: true,
      _width: NumberConstant.THREE_HUNDRED
    },
    {
      field: UserConstant.IS_ACTIF,
      title: SharedConstant.STATE_UPPERCASE,
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: UserConstant.LAST_CONNECTION,
      title: UserConstant.LAST_CONNECTION_UPPERCASE,
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: UserConstant.LAST_CONNECTED_IP_ADRESS,
      title: UserConstant.LAST_CONNECTED_IP_ADRESS_UPPERCASE,
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: UserConstant.LAST_CONNECTED_COMPANY,
      title: UserConstant.LAST_CONNECTED_COMPANY_UPPERCASE,
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED
    }
  ];
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };

  public exportGridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.exportColumnsConfig
  };


  public sort: SortDescriptor[] = [{
    field: 'LastName',
    dir: 'asc'
  }];

  public usersStates: { value, name: string }[] = [{
    value: true,
    name: this.translate.instant(UserConstant.ACTIVE_USER)
  }
    ,
    {
      value: false,
      name: this.translate.instant(UserConstant.INACTIVE_USER)
    },
    {
      value: '',
      name: this.translate.instant(UserConstant.ALL_USERS)
    }];
  public defaultUsersState = this.usersStates[NumberConstant.TWO];

  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.initGridDataSource();
  }
  public config = UserConstant.ExcelColumnsConfig;

  constructor(private viewRef: ViewContainerRef, public userService: UserService, private fb: FormBuilder,
              private swalWarrings: SwalWarring, private formModalDialogService: FormModalDialogService, private localStorageService: LocalStorageService,
              private router: Router, private companyService: CompanyService, private translate: TranslateService, private growlService: GrowlService,
              private datePipe: DatePipe, private authService: AuthService) {
    const url = this.router.url.split(SEPARATOR);
    this.isMasterUsersList = url[NumberConstant.FOUR] === 'masterUsers';
    this.companyService.getReducedDataOfCompany().subscribe((company: ReducedCompany) => {
      this.currentCompany = company;
    });
  }

  ngOnInit() {
    this.onCheckAllUsers();
    this.createFormGroupFromImport();
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.UPDATE_USER);
    this.hasDeletePermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.DELETE_USER);
    this.hasDesactivatePermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.DESACTIVATE_USER);
    this.hasReactivatePermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.REACTIVATE_USER);
    this.hasShowPermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.SHOW_USER);
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.ADD_USER);
    this.importColumnsConfig = [
      {
        field: UserConstant.FIRST_NAME_FIELD,
        title: UserConstant.FIRST_NAME,
        filterable: true,
        width: NumberConstant.TWO_HUNDRED
      },
      {
        field: UserConstant.LAST_NAME_FIELD,
        title: UserConstant.LAST_NAME,
        filterable: true,
        width: NumberConstant.TWO_HUNDRED
      },
      {
        field: UserConstant.EMAIL_FIELD,
        title: UserConstant.EMAIL,
        filterable: true,
        width: NumberConstant.TWO_HUNDRED
      },
      {
        field: UserConstant.USER_ROLE,
        title: UserConstant.ROLE,
        filterable: true,
        width: NumberConstant.TWO_HUNDRED
      },
      {
        field: UserConstant.EMAIL_EMPLOYEE_FIELD,
        title: UserConstant.EMAIL_EMPLOYEE,
        filterable: true,
        width: NumberConstant.TWO_HUNDRED
      },
      {
        field: UserConstant.WORKPHONE_FIELD,
        title: UserConstant.WORKPHONE,
        filterable: true,
        width: NumberConstant.TWO_HUNDRED
      },
      {
        field: UserConstant.MOBILEPHONE_FIELD,
        title: UserConstant.MOBILEPHONE,
        filterable: true,
        width: NumberConstant.TWO_HUNDRED
      },
      {
        field: UserConstant.PHONE_FIELD,
        title: UserConstant.PHONE,
        filterable: true,
        width: NumberConstant.TWO_HUNDRED
      }
    ]
    ;
    }

  public createFormGroupFromImport() {
    this.formGroup = this.fb.group({
      FirstName: new FormControl('', [Validators.required]),
      LastName: new FormControl('', [Validators.required]),
      Email: new FormControl('', [Validators.required, Validators.email]),
      AssociateEmployeeEmail: new FormControl('', [Validators.required, Validators.email]),
      UserRole: new FormControl('', [Validators.required]),
      WorkPhone: [''],
      MobilePhone: [''],
      Phone: ['']
    });
  }
  /**
   * Data changed listener
   * @param state
   */
  public dataStateChange(state: DataStateChangeEvent): void {
    if (!state.sort[NumberConstant.ZERO] || (state.sort[NumberConstant.ZERO] && !state.sort[NumberConstant.ZERO].dir)) {
      state.sort = [];
    }
    this.gridSettings.state = state;
    this.initGridDataSource();
  }

  initGridDataSource(predicate?: PredicateFormat, isFromSearch?: boolean) {
    if (isFromSearch) {
      this.gridSettings.state.skip = NumberConstant.ZERO;
    }
    if (!this.predicate.Filter) {
      this.predicate.Filter = new Array<Filter>();
    }
    this.predicate.Filter.push(new Filter('IsBToB', Operation.neq, true));
    this.predicate.Filter.push(new Filter(UserConstant.IS_DELETED, Operation.neq, true));
    this.predicate = predicate ? predicate : this.predicate;
    if(!this.gridSettings.state.sort){
      this.predicate.OrderBy = new Array<OrderBy>();
      this.predicate.OrderBy.push.apply(this.predicate.OrderBy,
        [new OrderBy(UserConstant.LAST_NAME_FIELD, OrderByDirection.asc)]);
    }
    this.predicate.Relation = new Array<Relation>();
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(UserConstant.ID_EMPLOYEE_NAVIGATION)
      , new Relation(UserConstant.ID_TIMESHEET_NAVIGATION), new Relation(UserConstant.ID_LEAVE_NAVIGATION)]);
    if (!this.isMasterUsersList) {
      this.AllUsersIds = [];
      this.usersIdsSelected = [];
      this.userService.reloadServerSideData(this.gridSettings.state, this.predicate)
        .subscribe(res => {
          res.data.forEach(user => {
            if (user.LastConnection) {
              const lastConnectionDate = new Date(user.LastConnection);
              user.LastConnection = this.datePipe.transform(lastConnectionDate, this.translate.instant(SharedConstant.DATE_FORMAT)) + ' '
                + (NumberConstant.ZERO.toString() + lastConnectionDate.getUTCHours()).slice(-NumberConstant.TWO) + ':' +
                (NumberConstant.ZERO.toString() + lastConnectionDate.getUTCMinutes()).slice(-NumberConstant.TWO);
            }
          });
         this.prepareList(res);
          res.data.forEach(data => {
            this.AllUsersIds.push(data.Id);
          });
          this.onSelectedKeysChange();
        });
    } else {
      this.predicate.pageSize = this.gridSettings.state.take;
      this.predicate.page = (this.gridSettings.state.skip / this.gridSettings.state.take) + 1;
      this.predicate.Filter.push(new Filter(UserConstant.IS_BTOB, Operation.neq, true));
      if(this.gridSettings.state.sort && this.gridSettings.state.sort.length !== NumberConstant.ZERO){
        this.predicate.OrderBy = new Array<OrderBy>();
        if(this.gridSettings.state.sort[NumberConstant.ZERO].dir === "asc"){
          this.predicate.OrderBy.push.apply(this.predicate.OrderBy,
            [new OrderBy(this.gridSettings.state.sort[NumberConstant.ZERO].field, OrderByDirection.asc)]);
        }
        else {
          this.predicate.OrderBy.push.apply(this.predicate.OrderBy,
            [new OrderBy(this.gridSettings.state.sort[NumberConstant.ZERO].field, OrderByDirection.desc)]);
        }
      }
      else {
        this.predicate.OrderBy = new Array<OrderBy>();
        this.predicate.OrderBy.push.apply(this.predicate.OrderBy,
          [new OrderBy(UserConstant.LAST_NAME_FIELD, OrderByDirection.asc)]);
      }
      this.userService.getUsersListFromMasterBase(this.predicate, this.localStorageService.getCompanyCode()).subscribe(data => {
        data.data.forEach(masterUser => {
          if (masterUser.LastConnectedCompany) {
            const associatedCompany = masterUser.CompanyAssociatedCode.filter(x => x.Code === masterUser.LastConnectedCompany);
            masterUser.LastConnectedCompany = associatedCompany.length > NumberConstant.ZERO
              ? associatedCompany[NumberConstant.ZERO].Name : undefined;
          }
        });
      this.prepareList(data);
      });
    }
  }

  /**
   * Remove handler
   * @param param0
   */
  public removeHandler(userMail) {
    this.swalWarrings.CreateSwal(UserConstant.DELETE_TXTE_USER, UserConstant.DELETE_TITLE_USER).then((result) => {
      if (result.value) {
        this.userService.DeleteUserFromSlaveBase(userMail).subscribe(() => {
          this.initGridDataSource();
        });
      }
    });
  }

  public goToAdvancedEdit(dataItem) {
    this.router.navigateByUrl(UserConstant.USER_URL_EDIT.concat(dataItem.Id), { queryParams: dataItem, skipLocationChange: true });
  }

  public receiveData(event: any) {
    const predicate: PredicateFormat = Object.assign({}, null, event.predicate);
    if (this.status !== undefined){
    predicate.Filter.push(new Filter(UserConstant.IS_ACTIF, Operation.eq,this.status));
  }
    this.initGridDataSource(predicate, true);
  }

  public addRoleToMasterUser(dataItem: any) {
    this.user = dataItem;
    this.user.LastConnectedCompany = this.localStorageService.getCompanyCode();
    this.formModalDialogService.openDialog(UserConstant.ADD_ROLE_TO_MASTER_USER,
      MasterUserAddRoleComponent, this.viewRef, this.onCloseModal.bind(this), this.user, true, SharedConstant.MODAL_DIALOG_SIZE_M);
  }
  setUserRole(): MasterRoleUser[] {
    const listOfUserRole = new Array<MasterRoleUser>();
    this.formGroup.controls[UserConstant.USERROLE].value.forEach(element => {
      const userRole = new MasterRoleUser();
      userRole.IdRole = element;
      listOfUserRole.push(userRole);
    });
    return listOfUserRole;
  }
  private onCloseModal(): void {
    this.initGridDataSource();
  }

  public synchronizeWithMaster() {
    this.userService.SynchronizeWithMaster().subscribe((data) => {
      const message = this.translate.instant(UserConstant.SUCCESSFUL_SYNCHRONIZATION);
      swal.fire({
        icon: 'success',
        html: message,
        confirmButtonColor: '#4c9aae'
      });
    });
  }

  /**
   * on Close Popup Import
   * */
  onClosePopupImport() {
    this.dataImported = false;
  }

  /**
   * save Imported Date
   * @param myData
   */
  public saveImportedData(myData: Array<User>) {
    myData.forEach(element => {
      if (element.MasterRoleUser != null) {
        const listOfUserRole = new Array<MasterRoleUser>();
        element.MasterRoleUser.forEach(w => {
          const userRole = new MasterRoleUser();
          userRole.IdRole = Number(w);
          listOfUserRole.push(userRole);
        })
        element.MasterRoleUser = [];
        element.MasterRoleUser = listOfUserRole;
      }
    })
    this.userService.saveImportedData(myData).subscribe(res => {
      this.dataImported = false;
      this.initGridDataSource();
    });
  }

  /**
   * incomming excel file
   * @param event
   */
  incomingFile(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e: any) => {
        this.importFileUsers = FileInfo.generateFileInfoFromFile(file, reader);
        this.userService.uploadUsers(this.importFileUsers).subscribe((res: Array<User>) => {
          this.dataImported = true;
          this.importData = res;

        });
      };
    }
  }
  public downLoadFile(event) {
    const link = document.createElement('a');
    link.download = UserConstant.NAME_EXCEL_MODEL_USER;
    link.href = UserConstant.IMPORT_EXCEL_MODEL_USER;
    link.click();
}
  public changeStateOfUser(id: number, state: boolean) {
    const text = state ? UserConstant.DESACTIVATE_USER_TEXT : UserConstant.REACTIVATE_USER_TEXT;
    const buttonText = state ? UserConstant.DESACTIVATE : UserConstant.REACTIVATE;
    this.swalWarrings.CreateSwal(text, null, buttonText).then((result) => {
      state = undefined;
      if (result.value) {
        this.userService.changeStateOfUser(id).subscribe(res => {
          this.initGridDataSource(this.predicate);
        });
      }
    });
  }
  /**
 * check the state of the select all checkbox in the kendo grid
 */
  public onSelectedKeysChange() {
    const selectionLength = this.usersIdsSelected.length;
    selectionLength === NumberConstant.ZERO ? this.showErrorMessage = true : this.showErrorMessage = false;
    if (selectionLength === NumberConstant.ZERO) {
      this.selectAllState = SharedConstant.UNCHECKED as SelectAllCheckboxState;
    } else if (selectionLength > NumberConstant.ZERO && selectionLength < this.AllUsersIds.length) {
      this.selectAllState = SharedConstant.INDETERMINATE as SelectAllCheckboxState;
    } else {
      this.selectAllState = SharedConstant.CHECKED as SelectAllCheckboxState;
    }
  }
  public openDesactivateusersdetails(state: boolean, usersIdsSelected): void {
    if (usersIdsSelected && usersIdsSelected.length === NumberConstant.ZERO) {
      this.growlService.ErrorNotification(this.translate.instant(UserConstant.NO_SELECtED_USER));
    } else {
      this.userService.setUserId(usersIdsSelected);
      this.userService.setUserState(state);
      this.router.navigate([UserConstant.DESACTIVATE_USER_URL_LIST]);
    }
  }

  /**
   * filter active or deactivated users
   * @param state
   */
  public onCheckAllUsers(state?: boolean) {
    if(this.predicate.Filter === undefined){
      this.predicate.Filter = new Array<Filter>();
    }
    else {
    this.predicate.Filter = this.predicate.Filter.filter(function(filter) {
      return filter.prop !== UserConstant.IS_ACTIF;
    });
    }
    if (state !== undefined) {
      this.status = state;
      this.predicate.Filter.push(new Filter(UserConstant.IS_ACTIF, Operation.eq, state));
    }
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.gridSettings.state.take = NumberConstant.TWENTY;
    this.initGridDataSource(this.predicate);
  }

  /**ToDo
   * get list of user from list Id
   */
  getUsersFromListId() {
    this.userService.getUsersFromListId(this.usersIdsSelected).subscribe(result => {
      this.usersSelected = result;
    });
  }

  /**Todo
   * deleteMassiveUsers
   */
  public deleteSelectedItems() {
    if (this.usersIdsSelected && this.usersIdsSelected.length === NumberConstant.ZERO) {
      this.growlService.ErrorNotification(this.translate.instant('NO_SELECtED_USER'));
    } else {
      /* deleteMassiveUsers */
    }
  }
  public reactivateUser(user) {
    this.swalWarrings.CreateSwal(UserConstant.REACTIVATE_USER_TEXT, null, UserConstant.REACTIVATE).then((result) => {
      if (result.value) {
        this.userService.changeInactiveStateOfUser(user).subscribe(res => {
          this.initGridDataSource(this.predicate);
        });
      }
    });
  }

  goToProfile(dataItem) {
    window.open('/main/profile/'.concat(dataItem.Id), '_blank');
    // this.router.navigateByUrl('main/profile/'.concat(dataItem.Id));
  }
  /**
   * Get Users Pictures
   *
   */
  prepareList(result) {
    // get first picture
    if (result) {
      const data = result.data;
      this.loadUserPicture(data);
      data.forEach(user => {
        user.image = MediaConstant.PLACEHOLDER_PICTURE;
      });
    }
    this.gridSettings.gridData = result;
  }

  private loadUserPicture(userList: User[]) {
    var userPicturesUrls = [];
    userList.forEach((user: User) => {
      userPicturesUrls.push(user.UrlPicture);
    });
    if (userPicturesUrls.length > NumberConstant.ZERO) {
      this.userService.getPictures(userPicturesUrls, false).subscribe(userPictures => {
        this.fillUserPictures(userList, userPictures);
      });
    }
  }
  private fillUserPictures(userList, userPictures) {
    userList.map((user: User) => {
      if (user.UrlPicture) {
        let dataPicture = userPictures.objectData.find(value => value.FulPath === user.UrlPicture);
        if (dataPicture) {
          user.image = `${SharedConstant.PICTURE_BASE}${dataPicture.Data}`;
        }
      }
    });
  }


  disconnectUser(userMail) {
    this.swalWarrings.CreateSwal(UserConstant.USER_DISCONNECTION_MESSAGE,UserConstant.USER_DISCONNECTION_TITLE).then(result=>{
      if(result){
        this.authService.logout(null,userMail);
      }
    })
  }
}
