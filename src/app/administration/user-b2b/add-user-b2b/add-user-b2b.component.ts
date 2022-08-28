import { Component, OnInit, Input, EventEmitter, Output, AfterViewInit } from '@angular/core';
import { UserConstant } from '../../../constant/Administration/user.constant';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Employee } from '../../../models/payroll/employee.model';
import { PredicateFormat, Filter, Operation } from '../../../shared/utils/predicate';
import { UserService } from '../../services/user/user.service';
import { ValidationService } from '../../../shared/services/validation/validation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RoleService } from '../../services/role/role.service';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { User } from '../../../models/administration/user.model';
import { LoginConst } from '../../../constant/login/login.constant';
import { Observable } from 'rxjs/Observable';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { StyleConfigService } from '../../../shared/services/styleConfig/style-config.service';
import { EmployeeService } from '../../../payroll/services/employee/employee.service';
import { LocalStorageService } from '../../../login/Authentification/services/local-storage-service';
import { RoleJavaService } from '../../services/role/role.java.service';
import { Role } from '../../../models/auth/role.model';
import { MasterRoleUser } from '../../../models/administration/user-role.model';

@Component({
  selector: 'app-add-user-b2b',
  templateUrl: './add-user-b2b.component.html',
  styleUrls: ['./add-user-b2b.component.scss']
})
export class AddUserB2bComponent implements OnInit {
  private userId: number;
  public includeLiterals: false;
  public value = '';
  public mask = UserConstant.MASK;
  /**
   * attribute to use while verifying the route leave
   */
  private isSaveOperation = false;
  userFormGroup: FormGroup;
  /*
   * is updateMode
   */
  public isUpdateMode: boolean;


  public listUrl = UserConstant.LIST_URL;

  public predicate: PredicateFormat;
  public placeholder = SharedConstant.CHOOSE_CUSTOMER_PLACEHOLDER
  private lastConnectedCompanyCode = this.localStorageService.getCompanyCode();
  private roleB2B: Role;
  /**
   *
   * @param userService
   * @param fb
   * @param validationService
   * @param styleConfigService
   * @param activatedRoute
   * @param router
   * @param roleService
   */
  constructor(public userService: UserService, private fb: FormBuilder,
    private validationService: ValidationService,
    private styleConfigService: StyleConfigService,
    private activatedRoute: ActivatedRoute, private router: Router,
    public roleService: RoleService, private employeeService: EmployeeService,
    private localStorageService: LocalStorageService, private roleJavaService: RoleJavaService) {
  }

  ngOnInit(): void {

    this.roleJavaService.getJavaGenericService()
      .getEntityList(`roles?companyCode=${this.lastConnectedCompanyCode}`).subscribe((allRoles: Array<Role>) => {
        if (allRoles && allRoles.length > 0) {
          var rolesB2b = allRoles.filter(x => x.Code == 'B2B_ADMIN');
          if (rolesB2b)
            this.roleB2B = allRoles.filter(x => x.Code == 'B2B_ADMIN')[0];
        }
      });

    this.checkIsUpdateMode();
    this.createAddForm();
    if (this.isUpdateMode) {
      this.getDataToUpdate();
    }
  }

  public checkIsUpdateMode() {
    this.activatedRoute.params.subscribe(params => {
      this.userId = params[SharedConstant.ID_LOWERCASE] || 0;
      this.isUpdateMode = this.userId > NumberConstant.ZERO;
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
        validators: [Validators.required, Validators.pattern(SharedConstant.MAIL_PATTERN)]
      }],
      Phone: [''],
      MobilePhone: [''],
      WorkPhone: [''],
      IdUserParent: [''],
      IdTiers: ['', Validators.required],
      IsBToB: [true],
      Password: ['', [Validators.required, Validators.pattern(UserConstant.PASSWORDPATTERN)]],
      ConfirmPassword: ['', Validators.required]
    }, { validator: this.checkIfMatchingPasswords() });
  }

  preparePrediacte(): void {
    this.predicate = new PredicateFormat();
    this.predicate.Filter = new Array<Filter>();
    this.predicate.Filter.push(new Filter(UserConstant.ID, Operation.eq, this.userId));
  }

  setUserRole(): MasterRoleUser[] {
    const listOfUserRole = new Array<MasterRoleUser>();

    const userRole = new MasterRoleUser();
    userRole.IdRole = this.roleB2B.Id;
    listOfUserRole.push(userRole);

    return listOfUserRole;
  }

  /**
   * Save user
   * */
  save() {
    this.userFormGroup.updateValueAndValidity();
    if (this.userFormGroup.valid) {
      this.isSaveOperation = true;
      let user: User = new User();
      user = this.userFormGroup.value;
      user.MasterRoleUser = this.setUserRole();
      if (this.isUpdateMode) {
        this.userService.updateB2BUser(user)
          .subscribe(() => {
            this.router.navigateByUrl(UserConstant.LIST_URL);
          });
      } else {
        user.LastConnectedCompany = this.localStorageService.getCompanyCode();
        this.userService.save(user, true)
          .subscribe(() => {
            this.router.navigateByUrl(UserConstant.LIST_URL);
          });
      }
    } else {
      this.validationService.validateAllFormFields(this.userFormGroup);
    }
  }

  /**
   * check If Matching Password and confirmPassword for user
   * */
  public checkIfMatchingPasswords() {
    return (group: FormGroup) => {
      const passwordInput = group.controls[UserConstant.PASSWORD],
        passwordConfirmationInput = group.controls[UserConstant.CONFIRMPASSWORD];
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
      this.userFormGroup.patchValue({
        IdTiers: data.IdTiers,
        Id: data.Id,
        FirstName: data.FirstName,
        LastName: data.LastName,
        Email: data.Email,
        Phone: data.Phone,
        MobilePhone: data.MobilePhone,
        WorkPhone: data.WorkPhone,
        IdUserParent: data.IdUserParent,
        IsBToB: true
      });
      this.userFormGroup.controls['IdTiers'].disable();
      this.userFormGroup.controls[UserConstant.PASSWORD].setErrors(null);
      this.userFormGroup.controls[UserConstant.PASSWORD].clearValidators();
    });
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

  getFooterClass(): string {
    return this.styleConfigService.getFooterClassSettingLayoutAddComponent();
  }
}
