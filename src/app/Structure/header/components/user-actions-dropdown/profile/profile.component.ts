import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { isNullOrEmptyString } from '@progress/kendo-angular-grid/dist/es2015/utils';
import { IModalDialogOptions } from 'ngx-modal-dialog';
import { Subscription } from 'rxjs/Subscription';
import { RoleJavaService } from '../../../../../administration/services/role/role.java.service';
import { UserService } from '../../../../../administration/services/user/user.service';
import { UserConstant } from '../../../../../constant/Administration/user.constant';
import { ContactConstants } from '../../../../../constant/crm/contact.constant';
import { ActiveConstant } from '../../../../../constant/immobilization/active.constant';
import { BonusConstant } from '../../../../../constant/payroll/bonus.constant';
import { EmployeeConstant } from '../../../../../constant/payroll/employee.constant';
import { PhoneConstants } from '../../../../../constant/purchase/phone.constant';
import { TiersConstants } from '../../../../../constant/purchase/tiers.constant';
import { SharedConstant } from '../../../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../../../constant/utility/number.constant';
import { ActiveAssignmentService } from '../../../../../immobilization/services/active-assignment/active-assignment.service';
import { User } from '../../../../../models/administration/user.model';
import { Role } from '../../../../../models/auth/role.model';
import { ActiveAssignment } from '../../../../../models/immobilization/active-assignment.model';
import { Bonus } from '../../../../../models/payroll/bonus.model';
import { Contract } from '../../../../../models/payroll/contract.model';
import { Employee } from '../../../../../models/payroll/employee.model';
import { FileInfo } from '../../../../../models/shared/objectToSend';
import { BonusService } from '../../../../../payroll/services/bonus/bonus.service';
import { EmployeeService } from '../../../../../payroll/services/employee/employee.service';
import { SwalWarring } from '../../../../../shared/components/swal/swal-popup';
import { LanguageKnowledgeService } from '../../../../../shared/services/language-knowledge/language-knowledge.service';
import { ValidationService } from '../../../../../shared/services/validation/validation.service';
import { Filter, Operation, OrderBy, OrderByDirection, PredicateFormat, Relation } from '../../../../../shared/utils/predicate';
import {LocalStorageService} from '../../../../../login/Authentification/services/local-storage-service';
import {UserCurrentInformationsService} from '../../../../../shared/services/utility/user-current-informations.service';
import { LanguageService } from '../../../../../shared/services/language/language.service';
import { ModulesSettingsService } from '../../../../../shared/services/modulesSettings/modules-settings.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public connectedUser = this.localStorageService.getUser();
  connectedEmployee: Employee;
  userRoles: Role[];
  public currentUser: User;
  isGeneralInfo = true;
  employeeId: number;
  currentEmployee: Employee;
  predicate: PredicateFormat;
  language: string;
  lastContract: Contract;
  bonusesId: number[];
  bonuses: Bonus[];
  bonusPredicate: PredicateFormat;
  assignments: ActiveAssignment[];
  assignmentsPredicate: PredicateFormat;
  allEmployeeDocumentHaveNoValues = false;
  public pictureSrc: any;
  public ShowGoToEmployeeProfile = false;
  /**
   * default dial code
   */
  public dialCode: string = PhoneConstants.DEFAULT_DIAL_CODE_COUNTRY_TN;
  /*
 default country code
  */
  public countryCode: string = PhoneConstants.DEFAULT_COUNTRY_TN;
  /**
   * Form Group
   */
  userFormGroup: FormGroup;
  /**
   * form controle
   */
  @Input() control: FormControl;

  public isEditMode: boolean;
  public changedPwdShowed: boolean;
  pictureFileInfo: FileInfo;

  oldPassword: string;
  password: string;
  confirmPassword: string;
  title: string;
  Showoldpwd = true;
  public optionDialog: Partial<IModalDialogOptions<any>>;
  value = '';
  changePasswordFormGroup: FormGroup;

  @Input() inputOptions: Partial<IModalDialogOptions<any>>;
  public defaultPhoneCountryTn = PhoneConstants.DEFAULT_COUNTRY_TN;
  public defaultPhoneCountryFr = PhoneConstants.DEFAULT_COUNTRY_FR;
  public defaultPhoneCountryGb = PhoneConstants.DEFAULT_COUNTRY_GB;
  public isPhoneHasError = false;

  public languages: any[];
  public idSubscription: Subscription;
  id: number;
  isExternalProfile: boolean;
  email: string;


  public formatDate = this.translate.instant(SharedConstant.DATE_FORMAT);
  public reloadLanguage: boolean ;
  public selectedLang ;

  /**
   *
   * @param employeeService
   * @param formModalDialogService
   * @param viewRef
   * @param rolesService
   * @param userService
   * @param bonusService
   * @param activatedRoute
   * @param userRoleService
   * @param activeAssinmentService
   * @param translate
   * @param fb
   * @param languageKnowledgeService
   * @param swalWarring
   * @param router
   * @param validationService
   */
  constructor(private employeeService: EmployeeService, private userService: UserService,
    private bonusService: BonusService, private activatedRoute: ActivatedRoute,
    private activeAssinmentService: ActiveAssignmentService,
    private fb: FormBuilder, public languageKnowledgeService: LanguageKnowledgeService,
    private swalWarring: SwalWarring, private validationService: ValidationService,
    private roleJavaService: RoleJavaService, private localStorageService : LocalStorageService, private translate: TranslateService,
    private userCurrentInformationsService: UserCurrentInformationsService,
    private languageService: LanguageService, private router: Router, private serviceModulesSettings: ModulesSettingsService) {
    this.idSubscription = this.activatedRoute.params.subscribe(params => {
      this.id = + params[EmployeeConstant.PARAM_ID] || NumberConstant.ZERO;
      if (this.id) {
        this.isExternalProfile = true;
      } else {
        this.id = this.localStorageService.getUserId();
        this.email = this.localStorageService.getEmail();
      }
    });
  }

  ngOnInit() {
    this.createAddForm();
    this.getUserAndInitiate();
    this.checkRh()
  }
  getUserAndInitiate() {
    if (this.isExternalProfile) {
      this.userService.getById(this.id).subscribe(user => {
        this.language = user.Lang;
        this.currentUser = user;
        if (!this.currentUser.IdPhoneNavigation) {
          this.currentUser.IdPhoneNavigation = {};
        } else {
          this.currentUser.IdPhoneNavigation.CountryCode = this.currentUser.IdPhoneNavigation.CountryCode.toString().trim();
        }
        if (this.currentUser.UrlPicture) {
          this.userService.getPicture(this.currentUser.UrlPicture).subscribe((data: any) => {
            this.pictureSrc = SharedConstant.PICTURE_BASE + data;
          });
        }
        this.loadPhoneCountryFlag();
        this.initAccordingToTheUser();
      });
    } else {
      this.userService.getByEmail(this.email).subscribe(user => {
        this.language = user.Lang;
        this.currentUser = user;
        if (!this.currentUser.IdPhoneNavigation) {
          this.currentUser.IdPhoneNavigation = {};
        } else {
          this.currentUser.IdPhoneNavigation.CountryCode = this.currentUser.IdPhoneNavigation.CountryCode.toString().trim();
        }
        if (this.currentUser.UrlPicture) {
          this.userService.getPicture(this.currentUser.UrlPicture).subscribe((data: any) => {
            this.pictureSrc = SharedConstant.PICTURE_BASE + data;
          });
        }
        this.loadPhoneCountryFlag();
        this.initAccordingToTheUser();
      });
    }

  }
  initAccordingToTheUser() {
    this.getAllEmployeeInformation(this.currentUser.IdEmployee);
    //this.getEmployeeActivesAssignments(this.currentUser.IdEmployee);
    this.disableFields();
    this.setForm(this.currentUser);
    this.languages = [{
      id: 'fr-FR',
      label: 'FR',
      value: 'fr',
      name: 'Français',
      src: '../../../../../assets/flags/french.png'
    },
    {
      id: 'en-EN',
      label: 'EN',
      value: 'en',
      name: 'English',
      src: '../../../../../assets/flags/eng.png'
    }];
      this.language = this.localStorageService.getLanguage();
    this.userCurrentInformationsService.getConnectedEmployeeId().subscribe(idEmployee => {
      if (idEmployee) {
        this.getAllEmployeeInformation(idEmployee);
      }
      this.getuserRoles(this.connectedUser.IdUser);
      //this.getEmployeeActivesAssignments(idEmployee);
    })
  }

  // getEmployeeActivesAssignments(idEmployee: number) {
  //   this.prepareAssignmentsPrediacte(idEmployee);
  //   this.activeAssinmentService.callPredicateData(this.assignmentsPredicate).subscribe(result => {
  //     this.assignments = result;
  //   });
  // }

  getuserRoles(userId: number) {
    this.roleJavaService.getJavaGenericService()
      .getEntityList(`userRoles?userId=${this.id}`).subscribe((allRoles: Array<Role>) => {
        this.userRoles = allRoles;
      });
  }

  preparePrediacte(userId: number): void {
    this.predicate = new PredicateFormat();
    this.predicate.Relation = new Array<Relation>();
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(UserConstant.ROLE_NAVIGATION)]);
    this.predicate.Filter = new Array<Filter>();
    this.predicate.Filter.push(new Filter(UserConstant.ID_USER, Operation.eq, userId));
  }

  getAllEmployeeInformation(employeeId: number) {
    if (employeeId) {
      this.employeeService.getEmployeeForProfile(employeeId).subscribe(result => {
        this.currentEmployee = result;
        if (this.currentEmployee.EmployeeDocument !== null) {
          this.allEmployeeDocumentHaveNoValues = this.currentEmployee.EmployeeDocument.map(x => x.Value)
            .filter(x => x === null || x === SharedConstant.EMPTY).length === this.currentEmployee.EmployeeDocument.length;
        } else {
          this.allEmployeeDocumentHaveNoValues = true;
        }
        if (this.currentEmployee.Contract) {
          this.lastContract = this.currentEmployee.Contract[NumberConstant.ZERO];
        }
        if (this.lastContract && this.lastContract.ContractBonus && this.lastContract.ContractBonus.length > NumberConstant.ZERO) {
          this.bonusesId = this.lastContract.ContractBonus.map(x => x.IdBonus);
          this.prepareBonusesPrediacte(this.bonusesId);
          this.bonusService.callPredicateData(this.bonusPredicate).subscribe(res => {
            this.bonuses = res;
          });
        }
      });
    }
  }

  prepareBonusesPrediacte(bonusesId: Array<number>): void {
    this.bonusPredicate = new PredicateFormat();
    this.bonusPredicate.Filter = new Array<Filter>();
    bonusesId.forEach(id => {
      this.bonusPredicate.Filter.push(new Filter(BonusConstant.ID, Operation.eq, id, false, true));
    });
  }

  prepareAssignmentsPrediacte(employeeId: number): void {
    this.assignmentsPredicate = new PredicateFormat();
    this.assignmentsPredicate.Relation = new Array<Relation>();
    this.assignmentsPredicate.Relation.push.apply(this.assignmentsPredicate.Relation, [new Relation(ActiveConstant.ID_ACTIVE_NAVIGATION)]);
    this.assignmentsPredicate.Filter = new Array<Filter>();
    this.assignmentsPredicate.Filter.push(new Filter(ActiveConstant.ID_EMPLOYEE, Operation.eq, employeeId));
    this.assignmentsPredicate.OrderBy = new Array<OrderBy>();
    this.assignmentsPredicate.OrderBy.push.apply(this.assignmentsPredicate.OrderBy,
      [new OrderBy(ActiveConstant.ACQUISATION_DATE, OrderByDirection.asc)]);
  }

  /**
   * TODO : user  photo
   * @param event
   */
  onSelectFile(event) {
    const file = event.target.files[NumberConstant.ZERO];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      if (file.type.startsWith("image/")) {
        reader.onload = () => {
          this.pictureFileInfo = new FileInfo();
          this.pictureFileInfo.IdOfCarrierModel = this.id;
          this.pictureFileInfo.Name = file.name;
          this.pictureFileInfo.Extension = file.type;
          this.pictureFileInfo.FileData = (<string>reader.result).split(',')[1];
          this.pictureSrc = reader.result;

          this.userService.updatePicture(this.pictureFileInfo).subscribe(() => {
          });
        };
      }
    }
  }

  private buildIdPhoneNavigation() {
    return this.fb.group({
      Id: [NumberConstant.ZERO],
      Number: [],
      DialCode: [this.dialCode],
      CountryCode: [this.countryCode],
      IsDeleted: [false]
    });
  }

  private disableFields() {
    this.userFormGroup.disable();
  }

  private createAddForm(): void {
    this.createGeneraleInfoFormGroup();
    this.createPasswordFormGroup();
  }
  createGeneraleInfoFormGroup() {
    this.userFormGroup = this.fb.group({
      Id: this.id,
      LastName: ['', [Validators.required, Validators.minLength(TiersConstants.NAME_MIN_LENGTH),
      Validators.maxLength(TiersConstants.NAME_MAX_LENGTH)]],
      FirstName: ['', [Validators.required, Validators.minLength(TiersConstants.NAME_MIN_LENGTH),
      Validators.maxLength(TiersConstants.NAME_MAX_LENGTH)]],
      Birthday: [''],
      Email: [''],
      IdPhone: [NumberConstant.ZERO],
      IdPhoneNavigation: this.buildIdPhoneNavigation(),
      Fax: [''],
      Linkedin: ['', [Validators.maxLength(NumberConstant.TWO_HUNDRED_FIFTY_FIVE),
      Validators.pattern('^https:\\/\\/www\\.linkedin\\.com\\/[a-zA-Z0-9_.+-/@]+$')]],
      Facebook: ['', [Validators.maxLength(NumberConstant.TWO_HUNDRED_FIFTY_FIVE),
      Validators.pattern('^https:\\/\\/www\\.facebook\\.com\\/[a-zA-Z0-9_.+-/@]+$')]],
      Twitter: ['', [Validators.maxLength(NumberConstant.TWO_HUNDRED_FIFTY_FIVE),
      Validators.pattern('^https:\\/\\/www\\.twitter\\.com\\/[a-zA-Z0-9_.+-/@]+$')]],
      IsWithEmailNotification: [''],
      Language: ['']
    });
  }
  createPasswordFormGroup() {
    this.changePasswordFormGroup = this.fb.group({
      Id: this.id,
      NewPassword: ['', [Validators.required, Validators.pattern(UserConstant.PASSWORDPATTERN)]],
      ConfirmNewPassword: ['', [Validators.required]],
    }, { validator: this.checkIfMatchingPasswords('NewPassword', 'ConfirmNewPassword') });
    if (this.Showoldpwd) {
      this.changePasswordFormGroup.addControl(UserConstant.PASSWORD, new FormControl('', Validators.required));
    }
  }
  cancelChangePassword() {
    this.createPasswordFormGroup();
    this.changedPwdShowed = false;
  }

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

  setEditMode(): void {
    if (this.isEditMode === undefined || this.isEditMode === false) {
      this.isEditMode = true;
      this.userFormGroup.enable();
    } else {
      this.isEditMode = false;
      this.userFormGroup.disable();
    }
  }

  gotoLink(platform) {
    let url;
    switch (platform) {
      case 'fb':
        url = SharedConstant.FACEBOOK_LINK + this.userFormGroup.value.Facebook;
        break;
      case 'tw':
        url = SharedConstant.TWITTER_LINK + this.userFormGroup.value.Twitter;
        break;
      case 'li':
        url = SharedConstant.LINKEDIN_LINK + this.userFormGroup.value.Linkedin;
        break;
      default:
        break;
    }
    window.open(url, '_blank');
  }

  private setForm(profil): void {
    if (profil.Birthday) {
      profil.Birthday = new Date(profil.Birthday);
    }
    this.userFormGroup.patchValue(profil);
  }

  public showChangedPwd() {
    this.changedPwdShowed = !this.changedPwdShowed;
  }

  public cancel() {
    this.setEditMode();
  }

  isValidProfileField(name) {
    if (this.changePasswordFormGroup.get(name) !== null) {
      return ((this.changePasswordFormGroup.get(name).touched ||
        this.changePasswordFormGroup.get(name).dirty) &&
        this.changePasswordFormGroup.get(name).errors);
    }

  }

  saveChangePassword() {
    if (this.changePasswordFormGroup.valid) {
      this.userService.ChangePassword(this.prepareObjectToSend(this.changePasswordFormGroup.value),
        this.currentUser.Email).subscribe(() => {
          this.cancelChangePassword();
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

  /**phone filed
   *
   */
  get PhoneNavigation(): FormGroup {
    return this.userFormGroup.get(TiersConstants.PHONE_NAVIGATION) as FormGroup;
  }

  get IdPhone(): FormControl {
    return this.userFormGroup.get(TiersConstants.ID_PHONE) as FormControl;
  }
  isValidPhone(isValidPhone) {
    if (isValidPhone || isNullOrEmptyString(this.PhoneNavigation.value.Number)) {
      this.isPhoneHasError = false;
      this.PhoneNavigation.setErrors(null);
      this.PhoneNavigation.markAsUntouched();
    } else {
      this.isPhoneHasError = true;
      this.PhoneNavigation.setErrors({ 'wrongPattern': Validators.pattern });
      this.PhoneNavigation.markAsTouched();
    }
  }

  onCountryPhoneChange(phoneInformation) {
    this.PhoneNavigation.get(PhoneConstants.PHONE_DIAL_CODE).setValue(phoneInformation.dialCode);
    this.PhoneNavigation.get(PhoneConstants.PHONE_COUNTRY_CODE).setValue(phoneInformation.iso2);
  }

  loadPhoneCountryFlag() {
    if (this.currentUser && this.currentUser.IdPhoneNavigation &&
      this.currentUser.IdPhoneNavigation.CountryCode) {
      this.countryCode = this.currentUser.IdPhoneNavigation.CountryCode.toString().trim();
    }
  }
  /**
   * to do :save modification profile
   */
  save() {
    // tslint:disable-next-line:comment-format
    //save data of user if valid
    if ((this.userFormGroup as FormGroup).valid && !this.isPhoneHasError) {
      const userToSave = Object.assign({}, this.currentUser, this.userFormGroup.getRawValue());
      userToSave.Lang = userToSave.Language;
      this.userService.updateProfile(userToSave).subscribe(() => {
        this.setEditMode();
        if(this.reloadLanguage){
        this.languageService.chooseLang(this.selectedLang)
        }
      });
    } else {
      this.validationService.validateAllFormFields(this.userFormGroup);
    }
  }

  removeProfilePicture(event) {
    event.preventDefault();
    this.swalWarring.CreateDeleteSwal(ContactConstants.PICTURE_ELEMENT, ContactConstants.PRONOUN_CETTE).then((result) => {
      if (result.value) {
        this.pictureFileInfo = null;
        this.pictureSrc = null;
        this.userService.removePicture(this.id).subscribe(() => {
        });
      }
    });
  }

  public changeLanguage($event){
    if($event ){
      if(this.language != $event)
      {
        this.reloadLanguage = true ;
        this.selectedLang = $event
      }else{
        this.reloadLanguage = false ;
      }
      
    }

  }
  public goToEmployeeProfile() {
    this.router.navigateByUrl(EmployeeConstant.EMPLOYEE_PROFIL_URL.concat(this.currentEmployee.Id.toString()), { queryParams: this.currentEmployee, skipLocationChange: true });
  }
  checkRh() {
    this.serviceModulesSettings.getModulesSettings().subscribe(data => {
      if (data[SharedConstant.RH]) {
        this.ShowGoToEmployeeProfile = true;
      }
    });
  }
}
