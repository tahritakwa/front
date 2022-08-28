import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {PermissionConstant} from '../../../constant/crm/permission.constant';
import {Subscription} from 'rxjs/Subscription';
import {GrowlService} from '../../../../COM/Growl/growl.service';
import {SharedCrmConstant} from '../../../constant/crm/sharedCrm.constant';
import {TranslateService} from '@ngx-translate/core';
import {GenericCrmService} from '../../generic-crm.service';
import {PermissionService} from '../../services/permission/permission.service';
import {PermissionType} from '../../../models/crm/enums/PermissionType';
import {UserService} from '../../../administration/services/user/user.service';
import {PredicateFormat} from '../../../shared/utils/predicate';
import {EmployeeTeam} from '../../../models/payroll/employee-team.model';
import {LocalStorageService} from '../../../login/Authentification/services/local-storage-service';

@Component({
  selector: 'app-permission',
  templateUrl: './permission.component.html',
  styleUrls: ['./permission.component.scss']
})
export class PermissionComponent implements OnInit, OnChanges, OnDestroy {
  /**
   * Decorator to send permission flag for update to parent  component
   */
  @Output() canUpdatePermissionEvent = new EventEmitter<any>();

  /**
   * Decorator to identify the related entity name permission in update case
   */
  @Input() relatedEntityName;
  /**
   * Decorator to identify the related entity id permission in update case
   */
  @Input() relatedEntityId;
  /**
   * Decorator to identify the parent
   */
  @Input() parent;

  /**
   * Decorator to identify whether a field is to read only (in details mode) or not
   */
  @Input() readOnly = false;
  /**
   * id for related popUp
   */
  @Input() uuid = '';
  /**
   * permission FormGroup
   */
  public permissionForm: FormGroup;
  private subscription$: Subscription;
  public showIndividualList = false;
  public showTeamList = false;
  public listUsers = [];
  public Users = [];
  public listUsersFilter = [];
  public listTeams = [];
  private connectedUser: any;
  public predicate: PredicateFormat;
  public listAdminIds = [];

  /**
   * boolean permission state
   * by default all permission checkbox is checked
   */
  public checkedAllPermission = false;
  public checkedTeamPermission = false;
  public checkedIndividualPermission = false;


  /**
   * permissions types
   */
  public allPermission = PermissionType.ALL_PERMSSION;
  public teamPermission = PermissionType.TEAM_PERMSSION;
  public individualPermission = PermissionType.INDIVIDUAL_PERMSSION;

  /**
   * selected users or teams in update permission mode
   */
  public selectedUsers: any = [];
  public selectedTeams: any = [];
  private permission: any;

  /**
   * TODO: show the permission team until .net ressource is avaible
   */
  public isShowedTeamPermission = false;
  public assignResources: EmployeeTeam[];
  public usersIdTeam = [];

  /**
   *
   * @param userService
   * @param teamService
   * @param genericCrmService
   * @param growlService
   * @param permissionService
   * @param translate
   */
  constructor(
              private userService: UserService,
              private genericCrmService: GenericCrmService,
              private growlService: GrowlService,
              private permissionService: PermissionService,
              private translate: TranslateService,
              private localStorageService: LocalStorageService) {
  }


  /**
   * init Permission form group
   */
  createPermissionForm() {
    this.permissionForm = new FormGroup({
        allPermission: new FormControl(),
        teamPermission: new FormControl(),
        teamPermittedTo: new FormControl(),
        individualPermission: new FormControl(),
        employeesPermittedTo: new FormControl()
      }
    );
  }


  /**
   * action to related checkbox permission change
   * @param permission
   */
  selectedEvent(permission) {
    switch (permission) {
      case this.allPermission :
        this.caseAllPermission();
        break;
      case this.teamPermission :
        this.caseTeamPermission();
        break;
      case this.individualPermission :
        this.caseIndividualPermission();
        break;
    }
  }

  /**
   *  action related to individualPermission checkbox
   */
  private caseIndividualPermission() {
    this.checkedIndividualPermission = !this.checkedIndividualPermission;
    this.checkedAllPermission = false;
    this.checkedTeamPermission = false;
    this.checkedIndividualPermission ? this.loadIndividualUsersList() : this.hideIndividualUsersList();
    this.hideTeamsList();
    const permission = {type: PermissionType.INDIVIDUAL_PERMSSION, permissionValidForm: false};
    this.permissionService.send(permission, this.parent);
    if (!this.checkedIndividualPermission) {
      this.caseOwnerPermisison();
    }
  }

  /**
   *  action related to teamPermission checkbox
   */
  private caseTeamPermission() {
    this.checkedTeamPermission = !this.checkedTeamPermission;
    this.checkedAllPermission = false;
    this.checkedIndividualPermission = false;
    this.checkedTeamPermission ? this.loadTeamsList() : this.hideTeamsList();
    this.hideIndividualUsersList();
    const permission = {type: PermissionType.TEAM_PERMSSION, permissionValidForm: false};
    this.permissionService.send(permission, this.parent);
    if (!this.checkedTeamPermission) {
      this.caseOwnerPermisison();
    }
  }

  /**
   *  action related to allPermission checkbox
   */
  private caseAllPermission() {
    this.checkedAllPermission = !this.checkedAllPermission;
    this.checkedTeamPermission = false;
    this.checkedIndividualPermission = false;
    this.hideTeamsList();
    this.hideIndividualUsersList();
    const permission = {
      type: PermissionType.ALL_PERMSSION,
      permittedUserTeam: PermissionType.ALL_PERMSSION,
      permissionValidForm: true,
      id: this.permission ? this.permission.id : undefined,
      isUpdateMode: !this.permission ? false : true
    };
    this.permissionService.send(permission, this.parent);
    if (!this.checkedAllPermission) {
      this.caseOwnerPermisison();
    }
  }

  /**
   *  action related to ownerPermission checkbox
   */
  private caseOwnerPermisison() {
    this.checkedAllPermission = false;
    this.checkedTeamPermission = false;
    this.checkedIndividualPermission = false;
    this.hideTeamsList();
    this.hideIndividualUsersList();
    let userId = [];
    userId.push(this.connectedUser.Email);
    userId = this.addAdminUserToPermission(userId);
    const permission = {
      type: PermissionType.OWNER_PERMSSION,
      permittedUserTeam: userId.toString(),
      permissionValidForm: true,
      id: this.permission ? this.permission.id : undefined,
      isUpdateMode: !this.permission ? false : true
    };
    this.permissionService.send(permission, this.parent);
  }

  loadUsers() {
    this.predicate = PredicateFormat.prepareEmptyPredicate();
    this.userService.processDataServerSide(this.predicate).subscribe(data => {
      this.Users = data.data.filter(user => user.Email !== this.connectedUser.Email);
    });
  }

  /**
   * init individual list of users
   */
  loadIndividualUsersList() {
    this.predicate = PredicateFormat.prepareEmptyPredicate();
    this.userService.processDataServerSide(this.predicate).subscribe(data => {
      this.listUsers = data.data.filter(user => user.Id !== this.connectedUser.IdUser);
      this.listUsersFilter = data.data.filter(user => user.Id !== this.connectedUser.IdUser);
      this.filterUsers();
    }, () => {
      this.growlService.ErrorNotification(this.translate.instant(SharedCrmConstant.FAILURE_OPERATION));
    }, () => {
      this.showIndividualList = true;
      this.employeesPermittedTo.setValidators(Validators.required);
      this.employeesPermittedTo.markAsTouched();
      this.permissionForm.updateValueAndValidity();
      this.updateModeCaseIndividualType();
    });
  }

  /**
   * load the permission to current user cae individual permision type
   */
  private updateModeCaseIndividualType() {
    if (!this.genericCrmService.isNullOrUndefinedOrEmpty(this.permission)) {
      const relatedPermission = this.getRelatedPermissions();
      const relatedPermissionsWithoutAdmins = relatedPermission.filter(id => this.listAdminIds.indexOf(id) < 0);
      this.selectedUsers = this.listUsers.filter(user => user.Email === relatedPermissionsWithoutAdmins.find(u => u === user.Email));
      const permission = {permissionValidForm: true, isUpdateMode: false};
      this.permissionService.send(permission, this.parent);
    }
  }

  /**
   * load the permission to current user cae teams permision type
   */
  private updateModeCaseTeamsType() {
    if (!this.genericCrmService.isNullOrUndefinedOrEmpty(this.permission)) {
      const relatedPermissions = this.getRelatedPermissions();
      const relatedPermissionsWithoutAdmins = relatedPermissions.filter(id => this.listAdminIds.indexOf(id) < 0);
      //   this.selectedTeams = this.listTeams.filter(team => team.Id === relatedPermissionsWithoutAdmins
      //    .find(relatedPermission => relatedPermission === team.Id));
      this.selectedTeams = this.getTeamPermissionIds();
      const permission = {permissionValidForm: true, isUpdateMode: false};
      this.permissionService.send(permission, this.parent);
    }
  }

  /**
   * get relatedPermissions
   * map permisison from String to Number
   */
  private getRelatedPermissions() {
    return this.permission.permittedUserTeam.split(',').map(String);
  }

  private getTeamPermissionIds() {
    return this.permission.permittedTeamIds.split(',').map(String);
  }

  /**
   * init list of teams
   */
  loadTeamsList() {
  }

  /**
   * hide individual users list
   */
  private hideIndividualUsersList() {
    this.employeesPermittedTo.setValue(undefined);
    this.employeesPermittedTo.clearValidators();
    this.permissionForm.updateValueAndValidity();
    this.showIndividualList = false;
  }

  /**
   * hide tams list
   */
  private hideTeamsList() {
    this.teamPermittedTo.setValue(undefined);
    this.teamPermittedTo.clearValidators();
    this.permissionForm.updateValueAndValidity();
    this.showTeamList = false;
  }

  /**
   * action related to multi-select-dropdown value changed case individal
   * @param value
   */
  onValueChangeResponsableUser(value) {
    const usersIds = this.addConnectedUserToPermission(value);
    let userIds = [];
    userIds = this.addAdminUserToPermission(usersIds);
    const permission = {
      type: PermissionType.INDIVIDUAL_PERMSSION, permittedUserTeam: userIds.toString(), permissionValidForm: true,
      id: this.permission ? this.permission.id : undefined
    };
    this.permissionService.send(permission, this.parent);
  }

  /**
   * add connected user id for the permission object to save
   * @param value
   */
  private addConnectedUserToPermission(value) {
    let usersIds: number[];
    value = value.map(user => user.Email);
    usersIds = [...value];
    usersIds.push(this.connectedUser.Email);
    return usersIds;
  }

  /**
   * action related to multi-select-dropdown value changed case team
   * @param value
   */
  onValueChangeTeam(value) {

  }


  get teamPermittedTo(): FormControl {
    return this.permissionForm.get(PermissionConstant.TEAM_PERMITTED_TO_FORM_CONTROL) as FormControl;
  }

  get employeesPermittedTo(): FormControl {
    return this.permissionForm.get(PermissionConstant.EMPLOYEE_PERMITTED_TO_FORM_CONTROL) as FormControl;
  }

  /**
   * get the current connected user
   */
  getConnectedUser() {
    this.connectedUser = this.localStorageService.getUser();
  }

  /**
   * case updateMode :load permission for current entity line
   * case !updateMode :load default permission ALL_PERMISSION
   */
  private updateMode() {
    if (this.permission) {
      switch (this.permission.type) {
        case PermissionType.ALL_PERMSSION :
          this.caseAllPermission();
          break;
        case PermissionType.OWNER_PERMSSION :
          this.caseOwnerPermisison();
          break;
        case PermissionType.TEAM_PERMSSION:
          this.caseTeamPermission();
          break;
        case PermissionType.INDIVIDUAL_PERMSSION:
          this.caseIndividualPermission();
          break;
      }
    } else {
      this.caseAllPermission();
    }
  }

  /**
   * load permission for current entity line
   */
  private loadPermission() {
    if (this.relatedEntityId) {
      this.permissionService.getJavaGenericService().getData(PermissionConstant.CHECK_PERMISSION_BY_ENTITY_URL + '/entityName/' +
        this.relatedEntityName + '/entityId/' + this.relatedEntityId).subscribe(data => {
        this.checkCurrentUserAllowedPermissionInUpdateCase(data);
      }, () => {
        this.growlService.ErrorNotification(this.translate.instant(SharedCrmConstant.FAILURE_OPERATION));
      }, () => {
        if (!this.permission) {
          this.canUpdatePermissionEvent.emit(false);
        }
      });
    }
  }

  /**
   * check the state of the current line permission if is allowed to current user
   * @param data
   */
  private checkCurrentUserAllowedPermissionInUpdateCase(data) {
    if ( data.type === PermissionType.OWNER_PERMSSION || data.createdBy === this.connectedUser.IdUser.toString()) {
      this.permission = data;
      this.canUpdatePermissionEvent.emit(true);
      this.updateMode();
    } else {
      this.canUpdatePermissionEvent.emit(false);
    }
  }

  /**
   * reset checbox value to false
   */
  private resetCheckBoxValues() {
    this.checkedAllPermission = false;
    this.checkedTeamPermission = false;
    this.checkedIndividualPermission = false;
  }

  /**
   * set owner permission case addComponenet
   */
  private setDefaultPermission() {
    let userId = [];
    userId.push(this.connectedUser.Email);
    const permission = {
      type: PermissionType.OWNER_PERMSSION, permittedUserTeam: userId.toString(),
      permissionValidForm: true, id: this.permission ? this.permission.id : undefined
    };
    this.permissionService.send(permission, this.parent);
  }

  ngOnInit() {
    this.createPermissionForm();
    this.getConnectedUser();
    this.initAdminUserPermission();
    this.loadUsers();
  }

  initAdminUserPermission() {
    this.userService.getAllUserWithoutState().subscribe(users => {
      users.data.forEach(user => {
        if (!this.genericCrmService.isNullOrUndefinedOrEmpty(user.UserRole) &&
          (user.UserRole.some(role => role.IdRoleNavigation && role.IdRoleNavigation.Code === 'ADMIN') ||
            user.UserRole.some(role => role.IdRoleNavigation && role.IdRoleNavigation.Code === 'SuperAdmin'))) {
          this.listAdminIds.push(user.Email);
        }
      });
      this.setDefaultPermission();
    });
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    this.resetCheckBoxValues();
    this.createPermissionForm();
    this.getConnectedUser();
    this.loadPermission();
  }

  ngOnDestroy() {
    if (this.subscription$) {
      this.subscription$.unsubscribe();
    }
  }

  handleResponsablesFilter(userSearched) {
    this.listUsers = this.listUsersFilter.filter(responsable => responsable.FullName.toLowerCase()
      .includes(userSearched.toLowerCase()));
  }

  /**
   * add connected user id for the permission object to save
   * @param value
   */
  private addAdminUserToPermission(value) {
    let usersIds: number[];
    usersIds = [...value];
    this.listAdminIds.forEach(adminId => {
      if (!usersIds.some(userId => userId === adminId)) {
        usersIds.push(adminId);
      }
    });
    return usersIds;
  }

  filterUsers() {
    this.listUsersFilter = this.listUsersFilter.filter(responsable => responsable.FullName != null);
    this.removeDuplicateUsers();
    this.listUsers = this.listUsersFilter;
  }

  removeDuplicateUsers() {
    this.listUsersFilter = this.listUsersFilter.reduce((a, b) => {
      if (!a.find(data => data.Email === b.Email)) {
        a.push(b);
      }
      return a;
    }, []);
  }
}
