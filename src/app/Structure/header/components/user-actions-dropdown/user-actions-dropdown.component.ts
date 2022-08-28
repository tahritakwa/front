import {Component, Input, OnInit, ViewContainerRef} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {ModalDialogInstanceService} from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import {UserService} from '../../../../administration/services/user/user.service';
import {UserConstant} from '../../../../constant/Administration/user.constant';
import {SharedConstant} from '../../../../constant/shared/shared.constant';
import {AuthService} from '../../../../login/Authentification/services/auth.service';
import {User} from '../../../../models/administration/user.model';
import {FormModalDialogService} from '../../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import {UserCurrentInformationsService} from '../../../../shared/services/utility/user-current-informations.service';
import {PermissionConstant} from '../../../permission-constant';

import {ChangePasswordComponent} from './change-password/change-password.component';
import {LocalStorageService} from '../../../../login/Authentification/services/local-storage-service';

@Component({
  selector: 'app-user-actions-dropdown',
  templateUrl: 'user-actions-dropdown.component.html',
  styleUrls: ['./user-actions-dropdown.component.scss']
})
export class UserActionsDropdownComponent implements OnInit {
  @Input() user: User;
  oldPassword: string;
  password: string;
  confirmPassword: string;
  title: string;
  titleButtonSave: string;
  public language: string;
  value = '';
  changePasswordFormGroup: FormGroup;
  public hasUpdateCompanyPermission: boolean;
  public hasShowCompanyPermission: boolean;
  hasUserShowPermissions = false;

  public settingsPermission = [
    PermissionConstant.SettingsRHAndPaiePermissions.UPDATE_COMPANY,
    PermissionConstant.SettingsRHAndPaiePermissions.LIST_COUNTRY,
    PermissionConstant.SettingsRHAndPaiePermissions.LIST_CITY,
    PermissionConstant.SettingsRHAndPaiePermissions.LIST_BANK,
    PermissionConstant.SettingsRHAndPaiePermissions.LIST_BANKACCOUNT,
    PermissionConstant.SettingsCommercialPermissions.LIST_TAX,
    PermissionConstant.SettingsCommercialPermissions.LIST_GROUP_TAX,
    PermissionConstant.SettingsCommercialPermissions.LIST_CURRENCY,
  ];
  public payrollSettingsPermission = [
    PermissionConstant.SettingsRHAndPaiePermissions.LIST_BENEFITINKIND,
    PermissionConstant.SettingsRHAndPaiePermissions.LIST_BONUS,
    PermissionConstant.SettingsRHAndPaiePermissions.LIST_CNSS,
    PermissionConstant.SettingsRHAndPaiePermissions.LIST_SALARYRULE,
    PermissionConstant.SettingsRHAndPaiePermissions.LIST_VARIABLE,
    PermissionConstant.SettingsRHAndPaiePermissions.LIST_SALARYSTRUCTURE,
    PermissionConstant.SettingsRHAndPaiePermissions.LIST_ADDITIONAL_HOUR
  ];
  public HRSettingsPermission = [
    PermissionConstant.SettingsRHAndPaiePermissions.LIST_SKILLS,
    PermissionConstant.SettingsRHAndPaiePermissions.LIST_GRADE,
    PermissionConstant.SettingsRHAndPaiePermissions.LIST_JOB,
    PermissionConstant.SettingsRHAndPaiePermissions.LIST_PERIOD,
    PermissionConstant.SettingsRHAndPaiePermissions.LIST_OFFICE,
    PermissionConstant.SettingsRHAndPaiePermissions.LIST_LANGUAGE,
    PermissionConstant.SettingsRHAndPaiePermissions.LIST_CONTRACTTYPE,
    PermissionConstant.SettingsRHAndPaiePermissions.LIST_LEAVETYPE,
    PermissionConstant.SettingsRHAndPaiePermissions.LIST_QUALIFICATIONTYPE,
    PermissionConstant.SettingsRHAndPaiePermissions.LIST_EXPENSEREPORTDETAILSTYPE,
    PermissionConstant.SettingsRHAndPaiePermissions.LIST_EVALUATIONCRITERIATHEME,
    PermissionConstant.SettingsRHAndPaiePermissions.LIST_INTERVIEWTYPE,
    PermissionConstant.SettingsRHAndPaiePermissions.LIST_EXITREASON,
    PermissionConstant.SettingsRHAndPaiePermissions.LIST_INTERVIEWTYPE,
    PermissionConstant.SettingsRHAndPaiePermissions.SHOW_GENERALSETTINGS,
    PermissionConstant.SettingsRHAndPaiePermissions.UPDATE_GENERALSETTINGS,
    PermissionConstant.SettingsRHAndPaiePermissions.SHOW_JOBSPARAMETERS,
    PermissionConstant.SettingsRHAndPaiePermissions.UPDATE_JOBSPARAMETERS
  ];
  public UserSettingsPermission = [
    PermissionConstant.SettingsRHAndPaiePermissions.LIST_USER,
    PermissionConstant.SettingsRHAndPaiePermissions.LIST_GROUPUSERS,
    PermissionConstant.SettingsRHAndPaiePermissions.LIST_ROLE,
    PermissionConstant.SettingsCommercialPermissions.B2B_SETTINGS

  ];
  public StockSettingsPermission = [
    PermissionConstant.SettingsCommercialPermissions.LIST_FAMILY,
    PermissionConstant.SettingsCommercialPermissions.LIST_MEASUREUNIT,
    PermissionConstant.SettingsCommercialPermissions.LIST_MODELOFITEM,
    PermissionConstant.SettingsCommercialPermissions.LIST_NATURE,
    PermissionConstant.SettingsCommercialPermissions.LIST_PRODUCTITEM,
    PermissionConstant.SettingsCommercialPermissions.LIST_SUBFAMILY,
    PermissionConstant.SettingsCommercialPermissions.LIST_SUBMODEL,
    PermissionConstant.SettingsCommercialPermissions.LIST_VEHICLEBRAND
  ];
  public SalesSettingsPermission = [
    PermissionConstant.SettingsCommercialPermissions.LIST_SETTLEMENTMODE,
    PermissionConstant.SettingsCommercialPermissions.LIST_PRICES,
    PermissionConstant.SettingsCommercialPermissions.LIST_PRICECATEGORY
  ];
  public TreasurySettingsPermissions = [
    PermissionConstant.SettingsTreasuryPermissions.LIST_WITHHOLDING_TAX_TREASURY,
    PermissionConstant.SettingsTreasuryPermissions.SHOW_WITHHOLDING_TAX_TREASURY
  ];

  public GarageSettingsPermission = [
    PermissionConstant.SettingsGaragePermissions.LIST_WORKER,
    PermissionConstant.SettingsGaragePermissions.LIST_UNIT,
    PermissionConstant.SettingsGaragePermissions.LIST_OPERATIONTYPE,
    PermissionConstant.SettingsGaragePermissions.LIST_OPERATION,
    PermissionConstant.SettingsGaragePermissions.LIST_OPERATION_PROPOSED,
    PermissionConstant.SettingsGaragePermissions.LIST_OPERATIONKIT,
    PermissionConstant.SettingsGaragePermissions.LIST_MACHINE,
    PermissionConstant.SettingsGaragePermissions.LIST_GARAGE,
    PermissionConstant.SettingsGaragePermissions.LIST_VEHICLE_BRAND,
    PermissionConstant.SettingsGaragePermissions.LIST_VEHICLEMODEL

  ];
  public CRMSettingsPermission = [
    PermissionConstant.CRMPermissions.VIEW_CATEGORY,
    PermissionConstant.CRMPermissions.ADD_CATEGORY,
    PermissionConstant.CRMPermissions.EDIT_CATEGORY,
    PermissionConstant.CRMPermissions.DELETE_CATEGORY,
    PermissionConstant.CRMPermissions.VIEW_ITEM,
    PermissionConstant.CRMPermissions.STATUS_OF_CATEGORIES,
    PermissionConstant.CRMPermissions.VIEW_STATUS,
    PermissionConstant.CRMPermissions.ADD_STATUS,
    PermissionConstant.CRMPermissions.EDIT_STATUS,
    PermissionConstant.CRMPermissions.VIEW_PIPELINE,
    PermissionConstant.CRMPermissions.ADD_PIPELINE,
    PermissionConstant.CRMPermissions.EDIT_PIPELINE,
    PermissionConstant.CRMPermissions.DELETE_PIPELINE

  ];
  public ManufactoringSettingsPermissions = [
    PermissionConstant.MANUFATORINGPermissions.MANUFACTURING_MACHINES_PERMISSION,
    PermissionConstant.MANUFATORINGPermissions.AREA_PERMISSION,
    PermissionConstant.MANUFATORINGPermissions.SECTION_PERMISSION,
  ];

  public showSettingsMenu: boolean;
  public showpayrollSettingsMenu: boolean;
  public showpRHSettingsMenu: boolean;
  public showUserSettings: boolean;
  public showStockSettingsMenu: boolean;
  public showSalesSettingsMenu: boolean;
  public showPurchaseSettingsMenu: boolean;
  public showTreasurySettingsMenu: boolean;
  public showGarageSettingsMenu: boolean;
  public showManufactoringSettingsMenu: boolean;
  public showCrmSettingsMenu: boolean;
  public showAccountingSettingMenu; boolean;

  constructor(private fb: FormBuilder, private formModalDialogService: FormModalDialogService,
              private modalService: ModalDialogInstanceService, private viewRef: ViewContainerRef, private router: Router,
              private userService: UserService, private authService: AuthService, public translate: TranslateService, private localStorageService: LocalStorageService) {


  }

  /**
   *
   * on logout
   * */

  private createForm(): void {
    this.changePasswordFormGroup = this.fb.group({
      oldPassword: ['', Validators.required],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    }, {validator: this.checkIfMatchingPasswords('password', 'confirmPassword')});
  }

  public checkIfMatchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
    return (group: FormGroup) => {
      const passwordInput = group.controls[passwordKey],
        passwordConfirmationInput = group.controls[passwordConfirmationKey];
      if (passwordInput.value !== passwordConfirmationInput.value) {
        return passwordConfirmationInput.setErrors({notEquivalent: true});
      } else {
        return passwordConfirmationInput.setErrors(null);
      }
    };
  }

  onClickChangePWD($event) {
    const options = {
      Email: this.localStorageService.getEmail()
    };
    this.formModalDialogService.openDialog(UserConstant.CHANGE_PWD, ChangePasswordComponent,
      this.viewRef, this.cancel.bind(this), options, null, SharedConstant.MODAL_DIALOG_SIZE_M, false);
  }

  cancel() {
    this.modalService.closeAnyExistingModalDialog();
  }

  onKey(event: any) { // without type info
    this.value += event.target.value + ' | ';
  }

  onClickLogout() {
    this.authService.logout();
  }

  ngOnInit(): void {
    this.createForm();
    this.loadPicture();
    this.hasUserShowPermissions = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.SHOW_USER);
    this.showSettingsMenu = this.authService.hasAuthorities(this.settingsPermission);
    this.showpayrollSettingsMenu = this.authService.hasAuthorities(this.payrollSettingsPermission);
    this.showpRHSettingsMenu = this.authService.hasAuthorities(this.HRSettingsPermission);
    this.showUserSettings = this.authService.hasAuthorities(this.UserSettingsPermission);
    this.showStockSettingsMenu = this.authService.hasAuthorities(this.StockSettingsPermission);
    this.showSalesSettingsMenu = this.authService.hasAuthorities(this.SalesSettingsPermission);
    this.showPurchaseSettingsMenu = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.LIST_EXPENSE);
    this.showTreasurySettingsMenu = this.authService.hasAuthorities(this.TreasurySettingsPermissions);
    this.showGarageSettingsMenu = this.authService.hasAuthorities(this.GarageSettingsPermission);
    this.showManufactoringSettingsMenu = this.authService.hasAuthorities(this.ManufactoringSettingsPermissions);
    this.showCrmSettingsMenu = this.authService.hasAuthorities(this.CRMSettingsPermission);
    this.showAccountingSettingMenu = this.authService.hasAuthority(PermissionConstant.AccountingPermissions.ACCOUNTING_SETTINGS);
  }

  onClickProfile() {
    this.router.navigateByUrl(SharedConstant.PROFILE_URL);
  }

  public loadPicture() {
    if (this.user && this.user.UrlPicture) {
      this.setPicture(this.user.UrlPicture);
    }
  }

  public setPicture(path) {
    this.userService.getPicture(path).subscribe((data: any) => {
      this.user.Picture = SharedConstant.PICTURE_BASE + data;
    });
  }
}
