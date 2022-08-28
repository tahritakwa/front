import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { isNullOrEmptyString } from '@progress/kendo-angular-grid/dist/es2015/utils';
import { State } from '@progress/kendo-data-query';
import { ModalDialogInstanceService } from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import { Observable } from 'rxjs/Observable';
import { isNullOrUndefined } from 'util';
import { PrivilegUserConstant } from '../../../constant/Administration/privilege-user.constant';
import { UserConstant } from '../../../constant/Administration/user.constant';
import { ContactConstants } from '../../../constant/crm/contact.constant';
import { LoginConst } from '../../../constant/login/login.constant';
import { PhoneConstants } from '../../../constant/purchase/phone.constant';
import { TiersConstants } from '../../../constant/purchase/tiers.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { Role } from '../../../models/administration/role.model';
import { UserPrivilege } from '../../../models/administration/user-privilege.model';
import { MasterRoleUser } from '../../../models/administration/user-role.model';
import { User } from '../../../models/administration/user.model';
import { ReducedEmployee } from '../../../models/payroll/reduced-employee.model';
import { FileInfo } from '../../../models/shared/objectToSend';
import { MultiselectDropdownComponent } from '../../../shared/components/multiselect-dropdown/multiselect-dropdown.component';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { FormModalDialogService } from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { MessageAdministrativeDocumentsService } from '../../../shared/services/signalr/message-administrative-documents/message-administrative-documents.service';
import { StyleConfigService } from '../../../shared/services/styleConfig/style-config.service';
import { unique, ValidationService } from '../../../shared/services/validation/validation.service';
import { Filter, Operation, PredicateFormat, Relation } from '../../../shared/utils/predicate';
import { StarkRolesService } from '../../../stark-permissions/service/roles.service';
import { isNotNullOrUndefinedAndNotEmptyValue } from '../../../stark-permissions/utils/utils';
import { ChangePasswordComponent } from '../../../Structure/header/components/user-actions-dropdown/change-password/change-password.component';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { RoleConfigConstant } from '../../../Structure/_roleConfigConstant';
import { CompanyService } from '../../services/company/company.service';
import { RoleJavaService } from '../../services/role/role.java.service';
import { RoleService } from '../../services/role/role.service';
import { UserPrivilegeService } from '../../services/user-privilege/user-privilege.service';
import { UserService } from '../../services/user/user.service';
import {LocalStorageService} from '../../../login/Authentification/services/local-storage-service';
import { LanguageService } from '../../../shared/services/language/language.service';
import {CacheService} from '../../../../COM/services/cache-service';
import { DepotDropdownComponent } from '../../../shared/components/depot-dropdown/depot-dropdown.component';
import { UserWarehouseService } from '../../../inventory/services/user-warehouse/user-warehouse.service';


@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
})
export class AddUserComponent implements OnInit {
  public USER_LIST_URL = '/main/settings/administration/user';
  public pictureUserSrc: any;
  public pictureFileInfo: FileInfo;
  public openCordinationDetailsCollapse = false;
  public openAuthAccesCollapse = false;
  public roleFiltredDataSource: Role[];
  public selectedIdItems: number[] = [];
  public dialCode: string[] = [PhoneConstants.DEFAULT_DIAL_CODE_COUNTRY_TN];
  public countryCode: string[] = [PhoneConstants.DEFAULT_COUNTRY_TN];
  public defaultPhoneCountryTn = PhoneConstants.DEFAULT_COUNTRY_TN;
  public defaultPhoneCountryFr = PhoneConstants.DEFAULT_COUNTRY_FR;
  public defaultPhoneCountryGb = PhoneConstants.DEFAULT_COUNTRY_GB;
  public tiersPhoneHasError = false;
  public includeLiterals: false;
  public value = '';
  public mask = UserConstant.MASK;
  public userFormGroup: FormGroup;
  /*
   * is updateMode
   */
  public isUpdateMode: boolean;
  /*
  * is isCurrentUser
  */
  public isCurrentUser: boolean;
  public ismodalopen = false;
  // connected Empployee
  public connectedUser;
  public userId: number;
  /*
   * Id Entity
   */
  private id: number;
  public predicate: PredicateFormat;
  public reducedEmployee: ReducedEmployee;
  public userPrivilegePredicate: PredicateFormat;
  public userPrivileges: UserPrivilege[];
  public currentUserPrivileges: any;
  public canChange = false;
  existingUserPrivilegesIds: number[];
  public isEsnSector = false;
  gridState: State = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.TWENTY,
    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: []
    }
  };
  public pwdInputsShowed: boolean;
  public initialListPrivilege: any;

  public userPrivilegesToDelete;
  public userPrivilegesToSend;
  public userPrivilegesToSendUpdated = [];
  public changePasswordFormGroup: FormGroup;
  public privilegeRole: boolean;
  @ViewChild(MultiselectDropdownComponent) multiSelectComponent: MultiselectDropdownComponent;
  /**
   * attribute to use while verifying the route leave
   */
  private isSaveOperation = false;
  userPhone: any;

  lastConnectedCompanyCode = this.localStorageService.getCompanyCode();
  public connectedUserEmail = this.localStorageService.getEmail();
  public email ;
  public language ;
  public reloadLang = false ;
  public newLang;
  /** Permissins */
  public hasShowUserPrivilege: boolean;
  public hasUpdatePermission: boolean;
  public hasAddPermission: boolean;
  public hasUpdateUserPrevilege: boolean;
  public hasChangePwdPermission: boolean;
  @ViewChild("depoDropdown") private depoDropdown: DepotDropdownComponent;
  @Output() WarehouseSelected = new EventEmitter<boolean>();
  array: FormGroup;
  /**
   *
   * @param swalWarrings
   * @param userService
   * @param fb
   * @param validationService
   * @param router
   * @param activatedRoute
   * @param roleService
   * @param formModalDialogService
   * @param messageAdministrativeDocumentsService
   * @param modalService
   * @param styleConfigService
   * @param viewRef
   * @param rolesService
   * @param userPrivilegeService
   * @param el
   */
  constructor(private swalWarrings: SwalWarring, public userService: UserService, private fb: FormBuilder,
    private validationService: ValidationService, private router: Router, private activatedRoute: ActivatedRoute,
    public roleService: RoleService, private formModalDialogService: FormModalDialogService,
    private messageAdministrativeDocumentsService: MessageAdministrativeDocumentsService,
    private modalService: ModalDialogInstanceService, private styleConfigService: StyleConfigService,
    private viewRef: ViewContainerRef, private rolesService: StarkRolesService,
    private userPrivilegeService: UserPrivilegeService, private el: ElementRef, private companyService: CompanyService,

    private roleJavaService: RoleJavaService, private authService: AuthService, private localStorageService : LocalStorageService,
    private languageService: LanguageService,private cacheService : CacheService, protected userWarehouseService : UserWarehouseService) {
    this.activatedRoute.params.subscribe(params => {
      this.id = +params[UserConstant.IDENTIFIER] || NumberConstant.ZERO;
    });
    this.userPhone = this.activatedRoute.snapshot.data['userPhone'];
    this.roleJavaService.getJavaGenericService()
      .getEntityList(`roles?companyCode=${this.lastConnectedCompanyCode}`).subscribe((allRoles: Array<Role>) => {
        this.roleFiltredDataSource = allRoles;
      });

  }

  ngOnInit(): void {
    this.hasShowUserPrivilege = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.SHOW_USERPRIVILEGE);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.UPDATE_USER);
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.ADD_USER);
    this.hasUpdateUserPrevilege = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.UPDATE_USERPRIVILEGE);
    this.hasChangePwdPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.CHANGE_PASSWORD_USER);
    this.userPrivileges = new Array<UserPrivilege>();
    this.messageAdministrativeDocumentsService.administrativeDocumentService = this.userService;
    this.companyService.getCurrentCompany().subscribe(data => {
      this.isEsnSector = data.ActivityArea === NumberConstant.TWO ? true : false;
    });
    this.isUpdateMode = this.id > 0;
    this.connectedUser = this.localStorageService.getUser();
    this.isUpdateMode = this.id > NumberConstant.ZERO;
    this.createAddForm();
    this.createPasswordForm();
    if (this.isUpdateMode) {
      this.removePaswwordValidator();
      this.getDataToUpdate();
    }
    if (this.hasShowUserPrivilege) {
      this.prepareUserPrivilegePredicate();
      this.getUserPrivileges();
    }

  }

  public loadPrivilegeRole() {
    this.rolesService.ListRoleConfigsAsObservable().subscribe((roledata: Array<any>) => {
      this.rolesService.hasOnlyRoles([RoleConfigConstant.PRIVILEGESCONFIG, RoleConfigConstant.AdminConfig])
        .then(x => {
          this.privilegeRole = x;
        });
    });
  }

  /*
   * Prepare Add form component
   */
  private createAddForm(): void {
    // Prepare the userFormGroup [purchaseRequestAdduserFormGroup]
    this.userFormGroup = this.fb.group({
      Id: [0],
      FirstName: ['', Validators.required],
      LastName: ['', Validators.required],
      Email: [{ value: '', disabled: this.isUpdateMode }, {
        validators: [Validators.required, Validators.pattern(SharedConstant.MAIL_PATTERN)],
        asyncValidators: unique(SharedConstant.EMAIL, this.userService, String(this.id)), updateOn: 'blur'
      }],
      MasterRoleUser: ['', Validators.required],
      Phone: [''],
      MobilePhone: [''],
      WorkPhone: [''],
      Lang: ['fr', Validators.required],
      Language: ['fr', Validators.required],
      IsTecDoc: [false],
      IdUserParent: [''],
      IdEmployee: [{ value: '', disabled: this.isUpdateMode }],
      OldPassword: [''],
      Password: ['', [Validators.required, Validators.pattern(UserConstant.PASSWORDPATTERN)]],
      ConfirmPassword: ['', Validators.required],
      IdPhoneNavigation: this.buildIdPhoneNavigation(),
      Fax: [''],
      Linkedin: ['', [Validators.maxLength(NumberConstant.TWO_HUNDRED_FIFTY_FIVE),
      Validators.pattern('^https:\\/\\/www\\.facebook\\.com\\/[a-zA-Z0-9_.+-/@]+$')]],
      Facebook: ['', [Validators.maxLength(NumberConstant.TWO_HUNDRED_FIFTY_FIVE),
      Validators.pattern('^https:\\/\\/www\\.linkedin\\.com\\/[a-zA-Z0-9_.+-/@]+$')]],
      Twitter: ['', [Validators.maxLength(NumberConstant.TWO_HUNDRED_FIFTY_FIVE),
      Validators.pattern('^https:\\/\\/www\\.twitter\\.com\\/[a-zA-Z0-9_.+-/@]+$')]],
      Privilege: this.fb.array([]),
      UserWarehouse : this.fb.array([])
    }, !this.isUpdateMode ? { validator: this.checkIfMatchingPasswords(UserConstant.PASSWORD, UserConstant.CONFIRMPASSWORD) } : {},
    );
    this.UserWarehouse.push(this.buildStorageForm());
    if(this.isUpdateMode && !this.hasUpdatePermission){
        this.userFormGroup.disable();
      }
  }

  buildStorageForm(): FormGroup {
    this.array = this.fb.group({
      Id: [0],
      UserMail: [''],
      IdWarehouse: [0],
      IsDeleted: [false]
    });
    return this.array;
  }

  preparePrediacte(): void {
    this.predicate = new PredicateFormat();
    this.predicate.Relation = new Array<Relation>();
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(UserConstant.USERROLE)]);
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(SharedConstant.ID_PHONE_NAVIGATION)]);
    this.predicate.Filter = new Array<Filter>();
    this.predicate.Filter.push(new Filter(UserConstant.ID, Operation.eq, this.id));
  }

  /**
   * Save user
   * */
  save() {
    this.userFormGroup.updateValueAndValidity();
    if (this.userFormGroup.valid && !this.tiersPhoneHasError) {
      let user: User = new User();
      user = this.userFormGroup.getRawValue();
      this.saveUser(user);
    } else {
      this.validationService.validateAllFormFields(this.userFormGroup);
      this.scrollToFirstInvalidFormControl();
    }

  }

  saveUser(user: User) {
    user.MasterRoleUser = this.setUserRole();
    if (this.hasShowUserPrivilege) {
      user.UserPrivilege = this.setUserPrivileges();
    }
    user.LastConnectedCompany = this.localStorageService.getCompanyCode();
    user.FirstName = user.FirstName.trim();
    user.LastName = user.LastName.trim();
    user.FullName = user.FirstName + ' ' + user.LastName;
    this.prepareUserPicture(user);
    this.isSaveOperation = true;
    this.userService.save(user, !this.isUpdateMode)
      .subscribe((res) => {
        if(this.UserWarehouse.value[0].IdWarehouse !== 0){
          let firstElement = this.UserWarehouse.controls[0] as FormGroup;
          firstElement.controls['UserMail'].setValue(user.Email);
          this.userWarehouseService.updateUserWarehouse(firstElement.value.UserMail, firstElement.value.IdWarehouse).subscribe();
        }
        this.cacheService.clearCache().subscribe();
        if (res) {
          user.Id = res.Id;
        }
        if (!this.isUpdateMode) {
          // Send add notif
          this.messageAdministrativeDocumentsService.startSendNewUserNotifMessage(
            user,
            user.Password
          );
        }
        if (this.connectedUser.IdUser === user.Id) {
          window.location.reload();
        }
        this.router.navigateByUrl(this.USER_LIST_URL);
        if(this.reloadLang){
          this.languageService.chooseLang(this.newLang)
        }
      });
  }
  setUserRole(): MasterRoleUser[] {
    const listOfUserRole = new Array<MasterRoleUser>();
    this.userFormGroup.controls[UserConstant.MASTER_ROLEUSER].value.forEach(element => {
      const userRole = new MasterRoleUser();
      userRole.IdRole = element.Id;
      listOfUserRole.push(userRole);
    });
    return listOfUserRole;
  }

  /**
   * check If Matching Password and confirmPassword for user
   * */
  public checkIfMatchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
    return (group: FormGroup) => {
      const passwordInput = group.controls[passwordKey],
        passwordConfirmationInput = group.controls[passwordConfirmationKey];
      if (passwordInput.value !== passwordConfirmationInput.value) {
        return passwordConfirmationInput.setErrors({ notEquivalent: true });
      } else {
        return passwordConfirmationInput.setErrors(null);
      }
    };
  }

  /**
   *  get data to update
   * */
  private getDataToUpdate(): void {
    this.preparePrediacte();
    this.userService.getModelByCondition(this.predicate).subscribe((data) => {
      if (!isNullOrUndefined(data)) {
      const user = data;
      this.language = user.Lang;
      this.email = user.Email;
      user.FirstName = user.FirstName.trim();
      user.LastName = user.LastName.trim();
      if (data.IdEmployee !== NumberConstant.ZERO  && data.IdEmployee !== null) {
        this.userFormGroup.controls['IdEmployee'].disable();
      }
      this.userId = data.Id;
      user.MasterRoleUser = data.MasterRoleUser ? data.MasterRoleUser.map(x => x.IdRoleNavigation) : new Array<Role>();
      this.selectedIdItems = user.MasterRoleUser.map(x => x.Id);
      this.userWarehouseService.getWarehouse(user.Email).subscribe(x => {
        let firstElement = this.UserWarehouse.controls[0] as FormGroup;
        firstElement.controls['IdWarehouse'].setValue(x.objectData.Id);
      });
      this.multiSelectComponent.initRolesDataSource();
       /** getpicture */
     if (user.UrlPicture) {
       this.userService.getPicture(user.UrlPicture).subscribe((databyte: any) => {
        this.pictureUserSrc = 'data:image/png;base64,' + databyte;
      });
     }
     user.IdPhoneNavigation = user.IdPhoneNavigation ? user.IdPhoneNavigation : '';
      this.userFormGroup.patchValue(user);
      this.userFormGroup.controls[UserConstant.PASSWORD].setErrors(null);
      this.userFormGroup.controls[UserConstant.PASSWORD].clearValidators();
      this.userFormGroup.controls[UserConstant.CONFIRMPASSWORD].clearValidators();
          if (this.localStorageService.getUserId() === this.id) {
              this.isCurrentUser = true;
          }
     }
    });
  }

  public changeEmployeeDropdownValue($event) {
    if (!this.isUpdateMode) {
      this.reducedEmployee = $event.employeeDataSource.filter(emp => emp.Id === $event.form.value.IdEmployee)[0];
      if (this.reducedEmployee) {
        this.FirstName.setValue(this.reducedEmployee.FirstName);
        this.LastName.setValue(this.reducedEmployee.LastName);
        this.Email.setValue(this.reducedEmployee.Email);
      } else {
        this.FirstName.setValue('');
        this.LastName.setValue('');
        this.Email.setValue('');
      }
    }
  }

  buildUserRole(data): number[] {
    const userRole = [];
    if (data) {
      data.forEach(element => {
        userRole.push(element.IdRole);
      });
    }
    return userRole;
  }

  get IdEmployee(): FormControl {
    return this.userFormGroup.get(UserConstant.IDEMPLOYEE) as FormControl;
  }

  get FirstName(): FormControl {
    return this.userFormGroup.get(UserConstant.FIRST_NAME_FIELD) as FormControl;
  }

  get LastName(): FormControl {
    return this.userFormGroup.get(UserConstant.LAST_NAME_FIELD) as FormControl;
  }

  get Email(): FormControl {
    return this.userFormGroup.get(UserConstant.EMAIL_FIELD) as FormControl;
  }

  get Password(): FormControl {
    return this.userFormGroup.get(UserConstant.PASSWORD) as FormControl;
  }

  get ConfirmPassword(): FormControl {
    return this.userFormGroup.get(UserConstant.CONFIRMPASSWORD) as FormControl;
  }

  openPwdModal() {
    this.ismodalopen = true;
    const options = {
      Iduser: this.userId,
      showPwd: false,
      Email: this.Email.value
    };
    let title = '';
    if (this.localStorageService.getLanguage() === 'fr') {
      title = 'Changer mot de passe';
    } else {
      title = 'Change password';
    }
    this.formModalDialogService.openDialog(title, ChangePasswordComponent,
      this.viewRef, this.closePwdModal.bind(this), options, null, SharedConstant.MODAL_DIALOG_SIZE_M);

  }

  closePwdModal() {
    this.ismodalopen = false;
    this.modalService.closeAnyExistingModalDialog();
  }

  // Id of clicked checkbox
  public getId(dataItem: UserPrivilege, columnIndex: number, rowIndex: number): string {
    return rowIndex.toString().concat(SharedConstant.UNDERSCORE).concat(columnIndex.toString())
      .concat(SharedConstant.UNDERSCORE).concat(dataItem.IdPrivilege.toString());
  }

  // Get user privileges
  getUserPrivileges() {
    this.userPrivilegeService.getuserPrivileges(this.userPrivilegePredicate).subscribe(result => {
      this.initialListPrivilege = result;
    });
  }

  prepareUserPrivilegePredicate() {
    this.userPrivilegePredicate = new PredicateFormat();
    this.userPrivilegePredicate.Relation = new Array<Relation>();
    this.userPrivilegePredicate.Relation.push.apply(this.userPrivilegePredicate.Relation,
      [new Relation(PrivilegUserConstant.PRIVILEGE_NAVIGATION)]);
    this.userPrivilegePredicate.Filter = new Array<Filter>();
    this.userPrivilegePredicate.Filter.push(new Filter(SharedConstant.IDUSER, Operation.eq, this.id));
  }

  // Update user privileges
  setUserPrivileges(): UserPrivilege[] {
    this.userPrivileges = this.initialListPrivilege.data;
    this.currentUserPrivileges = this.userFormGroup.value.Privilege;
    this.userPrivilegesToDelete = new Array<UserPrivilege>();
    this.userPrivilegesToSend = new Array<UserPrivilege>();
    this.userPrivilegesToSendUpdated = new Array<UserPrivilege>();
    if (this.isEmptyPrivilege()) {
      this.userPrivileges.forEach(userPrivilege => {
        userPrivilege.IsDeleted = true;
        userPrivilege.IdUser = this.id;
      });
      return this.userPrivileges;
    }
    if (this.currentUserPrivilegeIsValid()) {
      // load userPrivilegesToSend
      this.currentUserPrivileges.forEach((element, index) => {
        this.getUserPrivilegeToSend(element.module.idUser, element.module.valueIdPrivilege);
      });
      // setPrivilegeFieldValue
      this.setPrivilegeFieldValue();

      // load userPrivilegesToDelete
      this.userPrivilegesToDelete = this.userPrivileges.filter(({ Id: id1 }) =>
        !this.userPrivilegesToSendUpdated.some(({ Id: id2 }) => id2 === id1));
      if (this.userPrivilegesToDelete.length > NumberConstant.ZERO) {
        this.userPrivilegesToDelete.forEach(userPrivilege => {
          userPrivilege.IsDeleted = true;
        });
      }
      this.userPrivilegesToSendUpdated = this.userPrivilegesToSendUpdated.concat(this.userPrivilegesToDelete);
      this.userPrivilegesToSendUpdated.forEach(userPrivilege => {
        userPrivilege.IdUser = this.id;
      });
    }

    return this.userPrivilegesToSendUpdated;
  }

  currentUserPrivilegeIsValid(): boolean {
    return this.currentUserPrivileges && this.currentUserPrivileges.length > 0 &&
      isNotNullOrUndefinedAndNotEmptyValue(this.currentUserPrivileges[NumberConstant.ZERO].module) &&
      this.currentUserPrivileges[NumberConstant.ZERO].privilege.length > 0;
  }

  isEmptyPrivilege(): boolean {
    return this.currentUserPrivileges && this.currentUserPrivileges.length &&
      isNullOrEmptyString(this.currentUserPrivileges[NumberConstant.ZERO].module) &&
      this.currentUserPrivileges[NumberConstant.ZERO].privilege.length === NumberConstant.ZERO;
  }

  getUserPrivilegeToSend(idUser, idPrivilege) {
    const userPrivilege = this.userPrivileges.filter(
      data => data.Id === idUser && idUser !== NumberConstant.ZERO || data.IdPrivilege === idPrivilege);
    if (userPrivilege.length > NumberConstant.ZERO) {
      this.userPrivilegesToSend.push(userPrivilege[NumberConstant.ZERO]);
    }
  }

  setPrivilegeFieldValue() {
    this.userPrivilegesToSend.forEach((data, index) => {
      this.userPrivilegesToSendUpdated.push(this.setPrivilegeFieldSeleted(data, index));
    });
  }

  setPrivilegeFieldSeleted(userPrivilege: UserPrivilege, index: number): UserPrivilege {
    this.setSameLevelWithHierarchy(userPrivilege, false);
    this.setSameLevelWithoutHierarchy(userPrivilege, false);
    this.setSubLevel(userPrivilege, false);
    this.setSuperiorLevelWithHierarchy(userPrivilege, false);
    this.setSuperiorLevelWithoutHierarchy(userPrivilege, false);
    this.setManagement(userPrivilege, false);
    this.currentUserPrivileges[index].privilege.forEach(data => {
      if (data.field === PrivilegUserConstant.SAME_LEVEL_WITH_HIERARCHY) {
        this.setSameLevelWithHierarchy(userPrivilege, true);
      }
      if (data.field === PrivilegUserConstant.SAME_LEVEL_WITHOUT_HIERARCHY) {
        this.setSameLevelWithoutHierarchy(userPrivilege, true);
      }
      if (data.field === PrivilegUserConstant.SUB_LEVEL) {
        this.setSubLevel(userPrivilege, true);
      }
      if (data.field === PrivilegUserConstant.SUPERIOR_LEVEL_WITH_HIERARCHY) {
        this.setSuperiorLevelWithHierarchy(userPrivilege, true);
      }
      if (data.field === PrivilegUserConstant.SUPERIOR_LEVEL_WITHOUT_HIERARCHY) {
        this.setSuperiorLevelWithoutHierarchy(userPrivilege, true);
      }
      if (data.field.Management) {
        this.setManagement(userPrivilege, true);
      }
    });

    return userPrivilege;
  }


  setSelectableSettings(event: UserPrivilege, column) {
    if (event.SameLevelWithHierarchy && column.field === PrivilegUserConstant.SAME_LEVEL_WITH_HIERARCHY) {
      event.SameLevelWithoutHierarchy = false;
    } else if (event.SameLevelWithoutHierarchy && column.field === PrivilegUserConstant.SAME_LEVEL_WITHOUT_HIERARCHY) {
      event.SameLevelWithHierarchy = false;
    } else if (event.SuperiorLevelWithHierarchy && column.field === PrivilegUserConstant.SUPERIOR_LEVEL_WITH_HIERARCHY) {
      event.SuperiorLevelWithoutHierarchy = false;
    } else if (event.SuperiorLevelWithoutHierarchy && column.field === PrivilegUserConstant.SUPERIOR_LEVEL_WITHOUT_HIERARCHY) {
      event.SuperiorLevelWithHierarchy = false;
    }
  }

  removeUserPicture(event) {
    event.preventDefault();
    this.swalWarrings.CreateDeleteSwal(ContactConstants.PICTURE_ELEMENT, ContactConstants.PRONOUN_CETTE).then((result) => {
      if (result.value) {
        this.pictureUserSrc = null;
        this.pictureFileInfo = null;
      }
    });
  }

  onSelectFile(event) {
    const file = event.target.files[NumberConstant.ZERO];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      if (file.type.startsWith("image/")) {
        reader.onload = () => {
          this.pictureFileInfo = new FileInfo();
          this.pictureFileInfo.Name = file.name;
          this.pictureFileInfo.Extension = file.type;
          this.pictureFileInfo.FileData = (<string>reader.result).split(',')[1];
          this.pictureUserSrc = reader.result;
        };
      }
    }
  }
  public openAuthAccessCollapse() {
  }

  loadPhoneCountryFlag() {
    if (this.userPhone) {
      return this.userPhone.CountryCode.toString().trim();
    }
  }

  private buildIdPhoneNavigation() {
    return this.fb.group({
      Id: [NumberConstant.ZERO],
      Number: [],
      DialCode: [this.dialCode[NumberConstant.ZERO]],
      CountryCode: [this.countryCode[NumberConstant.ZERO]],
      IsDeleted: [false]
    });
  }

  isValidPhone(isValidPhone) {
    if (isValidPhone || isNullOrEmptyString(this.PhoneNavigation.value.Number)) {
      this.tiersPhoneHasError = false;
      this.PhoneNavigation.setErrors(null);
      this.PhoneNavigation.markAsUntouched();
    } else {
      this.tiersPhoneHasError = true;
      this.PhoneNavigation.setErrors({ 'wrongPattern': Validators.pattern });
      this.PhoneNavigation.markAsTouched();
    }
  }

  onCountryPhoneChange(phoneInformation) {
    this.PhoneNavigation.get(PhoneConstants.PHONE_DIAL_CODE).setValue(phoneInformation.dialCode);
    this.PhoneNavigation.get(PhoneConstants.PHONE_COUNTRY_CODE).setValue(phoneInformation.iso2);
  }

  get PhoneNavigation(): FormControl {
    return this.userFormGroup.get(TiersConstants.PHONE_NAVIGATION) as FormControl;
  }

  setSameLevelWithHierarchy(userPrivilege: UserPrivilege, status: boolean) {
    userPrivilege.SameLevelWithHierarchy = status;
  }

  setSameLevelWithoutHierarchy(userPrivilege: UserPrivilege, status: boolean) {
    userPrivilege.SameLevelWithoutHierarchy = status;
  }

  setSubLevel(userPrivilege: UserPrivilege, status: boolean) {
    userPrivilege.SubLevel = status;
  }

  setSuperiorLevelWithHierarchy(userPrivilege: UserPrivilege, status: boolean) {
    userPrivilege.SuperiorLevelWithHierarchy = status;
  }

  setSuperiorLevelWithoutHierarchy(userPrivilege: UserPrivilege, status: boolean) {
    userPrivilege.SuperiorLevelWithoutHierarchy = status;
  }

  setManagement(userPrivilege: UserPrivilege, status: boolean) {
    userPrivilege.Management = status;
  }

  public showPwdInputs() {
    this.pwdInputsShowed = !isNotNullOrUndefinedAndNotEmptyValue(this.pwdInputsShowed);
  }

  private scrollToFirstInvalidFormControl() {
    const firstFormControlWithError = this.el.nativeElement.querySelector('form input.ng-invalid');
    if (firstFormControlWithError) {
      this.scoll(firstFormControlWithError);
    }
  }

  private scoll(invalidControl) {
    window.scroll({
      top: this.getTopOffset(invalidControl),
      left: NumberConstant.ZERO,
      behavior: 'smooth'
    });
  }

  private getTopOffset(controlEl: HTMLElement): number {
    const labelOffset = NumberConstant.NINETY;
    return controlEl.getBoundingClientRect().top + window.scrollY - labelOffset;
  }


  private createPasswordForm(): void {
    this.changePasswordFormGroup = this.fb.group({
      Id: [this.localStorageService.getUserId()],
      NewPassword: ['', [Validators.required, Validators.pattern(UserConstant.PASSWORDPATTERN)]],
      ConfirmNewPassword: ['', [Validators.required]],
    }, { validator: this.checkIfMatchingPasswords(UserConstant.NEW_PASSWORD, UserConstant.CONFIRM_NEW_PASSWORD) });
    this.changePasswordFormGroup.addControl(UserConstant.PASSWORD, new FormControl('', Validators.required));
  }

  saveChangePassword() {
    if (this.changePasswordFormGroup.valid) {
      this.userService.ChangePassword(this.prepareObjectToSend(this.changePasswordFormGroup.value), this.Email.value).subscribe(data => {
        this.changePasswordFormGroup.reset();
      });
    } else {
      this.validationService.validateAllFormFields(this.changePasswordFormGroup);
    }
  }

  private prepareObjectToSend(value): any {
    return {
      Model: value,
      EntityAxisValues: []
    };
  }

  isValidProfileField(name) {
    if (this.changePasswordFormGroup.get(name) !== null) {
      return ((this.changePasswordFormGroup.get(name).touched ||
        this.changePasswordFormGroup.get(name).dirty) &&
        this.changePasswordFormGroup.get(name).errors);
    }
  }

  get MasterRoleUser(): FormControl {
    return this.userFormGroup.get(UserConstant.MASTER_ROLEUSER) as FormControl;
  }

  getFooterClass(): string {
    return this.styleConfigService.getFooterClassSettingLayoutAddComponent();
  }

  public removePaswwordValidator() {
    this.Password.clearValidators();
    this.ConfirmPassword.clearValidators();
    this.userFormGroup.updateValueAndValidity();
  }
  private prepareUserPicture(userToSave: User) {
    if (this.pictureFileInfo) {
      userToSave.PictureFileInfo = this.pictureFileInfo;
    }
  }
  /**
   * this method will be called by CanDeactivateGuard service to check the leaving component possibility
   */
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.isSaveOperation) {
      this.isSaveOperation = false;
      return true;
    }
    return this.validationService.handleCanDeactivateToLeaveCurrentComponent(this.isFormGroupChanged.bind(this));
  }

  private isFormGroupChanged(): boolean {
    return this.userFormGroup.touched;
  }
  public selectedLang($event){
    if($event && this.isUpdateMode && this.email == this.connectedUserEmail ){
      if(this.language != $event)
      {
        this.reloadLang = true ;
        this.newLang = $event
      }else{
        this.reloadLang = false ;
      }

    }
    if($event && this.userFormGroup && !this.userFormGroup.controls['Language'].value){
      this.userFormGroup.controls['Language'].setValue($event);
    }
  }

  public warehouseSelected($event) {
    this.WarehouseSelected.emit($event);
  }

  get UserWarehouse(): FormArray {
    return this.userFormGroup.get('UserWarehouse') as FormArray;
  }
}
