import {Component, ComponentRef, OnInit} from '@angular/core';
import {NumberConstant} from '../../../../../constant/utility/number.constant';
import {State} from '@progress/kendo-data-query';
import {ColumnSettings} from '../../../../../shared/utils/column-settings.interface';
import {MailingConstant} from '../../../../../constant/mailing/mailing.constant';
import {GridSettings} from '../../../../../shared/utils/grid-settings.interface';
import {PagerSettings} from '@progress/kendo-angular-grid';
import {TranslateService} from '@ngx-translate/core';
import {SwalWarring} from '../../../../../shared/components/swal/swal-popup';
import {ValidationService} from '../../../../../shared/services/validation/validation.service';
import {TemplateEmailSideNavService} from '../../../../services/template-email-side-nav/template-email-side-nav.service';
import {GrowlService} from '../../../../../../COM/Growl/growl.service';
import {Router} from '@angular/router';
import {UserCredentials} from '../../../../../models/mailing/user-credentials';
import {SettingsMailService} from '../../../../services/settings-mail/settings-mail-service';
import {HttpMailingErrorCodes} from '../../../../http-error-mailing-codes';
import {IModalDialog, IModalDialogOptions} from 'ngx-modal-dialog';
import {ModalDialogInstanceService} from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material';
import {LocalStorageService} from '../../../../../login/Authentification/services/local-storage-service';


/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-details-user-credentials',
  templateUrl: './details-user-credentials.component.html',
  styleUrls: ['./details-user-credentials.component.scss']
})

export class DetailsUserCredentialsComponent implements OnInit, IModalDialog {
  oldPasswordFormControl = new FormControl('', [
    Validators.required
  ]);
  newPasswordFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern(MailingConstant.PASSWORD_PATTERN)
  ]);
  newPasswordConfirmationFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern(MailingConstant.PASSWORD_PATTERN)
  ]);

  matcher = new MyErrorStateMatcher();
  public pwdMatches = true;
  public oldNewPwdMatches = false;
  public hide = true;
  public hidePwd = true;
  public hideConfirmPwd = true;
  public isUpdate = false;
  private pageSize = NumberConstant.TEN;
  public userData;
  public dataArray: any = [];
  public isNew = false;
  public isEquals = false;
  public passwordTooltipTitle = MailingConstant.PASSWORD_PATTERN_TOOLTIP;
  public showOldPwd = false;
  public showNewPwd = false;
  public currentUserId;
  public pwdValid = true;
  public gridState: State = {
    skip: 0,
    take: this.pageSize,
    filter: {
      logic: 'and',
      filters: []
    }
  };
  public columnsConfig: ColumnSettings[] = [
    {
      field: 'FirstName',
      title: 'FIRST_NAME',
      filterable: true
    },
    {
      field: 'LastName',
      title: 'LAST_NAME',
      filterable: true
    },
    {
      field: 'Email',
      title: 'EMAIL',
      filterable: true
    }
  ];
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };
  pagerSettings: PagerSettings = {
    buttonCount: NumberConstant.FIVE, info: true, type: 'numeric', pageSizes: false, previousNext: true
  };

  private userDataFromList;
  public optionDialog: Partial<IModalDialogOptions<any>>;


  constructor(private translateService: TranslateService,
              private swallWarning: SwalWarring, private validationService: ValidationService,
              private localStorageService : LocalStorageService, private settingsMailService: SettingsMailService,
              private growlService: GrowlService, private router: Router, private modalService: ModalDialogInstanceService) {
  }

  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.optionDialog = options;
    this.userDataFromList = options.data.data;
  }

  ngOnInit() {

    if (this.userDataFromList) {
      this.fillGridSettings(this.userDataFromList);
      this.checkIsNew(this.userDataFromList.Id);

    }

  }

  checkIsNew(idemployee) {
    this.settingsMailService.getJavaGenericService().getEntityById(idemployee).subscribe((resultat) => {
      this.isNew = resultat.errorCode === HttpMailingErrorCodes.NULL_EMPLOYEE_FOUND;
      if (!this.isNew) {
        this.currentUserId = resultat.id;
        this.pwdValid = true;
      }
    }, () => {
    }, () => {
      if (this.isNew === false) {
        this.showOldPwd = true;
        this.showNewPwd = true;
      } else {
        this.showOldPwd = false;
        this.showNewPwd = true;
      }
    });
  }

  returnToParent() {
    this.closePopUp();
  }

  validateAndReturn() {
    this.closePopUp();
  }

  fillGridSettings(data) {
    this.getUserDetails(data);
  }

  getUserDetails(user) {
    this.userData = user;
    this.dataArray = [];
    this.dataArray.push(this.userData);
    this.gridSettings.gridData = this.dataArray;
    this.currentUserId = undefined;
  }

  convertToUser(password) {
    const user: UserCredentials = new UserCredentials();
    user.idEmp = this.userData.Id;
    user.email = this.userData.Email;
    user.password = password;
    user.codeCompany = this.localStorageService.getCompanyCode();
    user.id = this.currentUserId ? this.currentUserId : NumberConstant.ZERO;
    /*TO DO : call crypt password service*/
    return user;
  }

  save(password) {
    this.settingsMailService.getJavaGenericService().saveEntity(this.convertToUser(password))
      .subscribe((_data) => {
        if (_data) {
        }
      });
    this.growlService.successNotification(this.translateService.instant(MailingConstant.SUCCESS_OPERATION));
    this.validateAndReturn();
  }

  update(password) {
    this.settingsMailService.getJavaGenericService().updateEntity(this.convertToUser(password), this.currentUserId)
      .subscribe((_data) => {
        if (_data) {
        }
      });
    this.growlService.successNotification(this.translateService.instant(MailingConstant.SUCCESS_OPERATION));
    this.validateAndReturn();
  }

  public isNullOrUndefinedOrEmpty(value): boolean {
    if (value === null || value === undefined || value === '') {
      return true;
    }
  }

  /*TO DO :call crypt service and check with entreing pwd*/
  checkPassword(caseNewPwd?: boolean) {
    const pwd = this.newPasswordFormControl.value;
    const confPwd = this.newPasswordConfirmationFormControl.value;
    this.pwdMatches = pwd === confPwd;
    this.oldNewPwdMatches = pwd === this.oldPasswordFormControl.value;

    if (caseNewPwd) {
      this.caseNewPwd(pwd, confPwd);
    } else {
      this.caseUpdateOldPwd(pwd, confPwd);
    }
  }

  private caseUpdateOldPwd(pwd, confPwd) {
    if (!this.isNullOrUndefinedOrEmpty(pwd) && this.pwdMatches &&
      !this.isNullOrUndefinedOrEmpty(this.oldPasswordFormControl.value) && !this.oldNewPwdMatches
    ) {
      this.checkCurrentUserId(confPwd);
    } else {
      this.updateFormControl();
    }
  }

  private caseNewPwd(pwd, confPwd) {
    if (!this.isNullOrUndefinedOrEmpty(pwd) && this.pwdMatches) {
      this.checkCurrentUserId(confPwd);
    } else {
      this.updateFormControl();
    }
  }

  private checkCurrentUserId(confPwd) {
    if (this.newPasswordFormControl.valid && this.newPasswordConfirmationFormControl.valid) {
      if (this.currentUserId) {
        this.update(confPwd);
      } else {
        this.save(confPwd);
      }
    }
  }

  private updateFormControl() {
    this.oldPasswordFormControl.markAsTouched();
    this.newPasswordFormControl.markAsTouched();
    this.newPasswordConfirmationFormControl.markAsTouched();
  }

  verifOldPassword() {
    this.isEquals = false;
    this.pwdValid = false;
    if (this.showOldPwd) {
      this.settingsMailService.getJavaGenericService().getEntityById(this.currentUserId, this.oldPasswordFormControl.value)
        .subscribe((data) => {
          if (data) {
            this.isEquals = data;
            this.pwdValid = this.isEquals === true;
          }
        }, () => {
        }, () => {
          if (this.pwdValid) {
            this.checkPassword();
          }
        });
    } else {
      this.checkPassword(true);
    }
  }


  closePopUp() {
    this.optionDialog.onClose();
    this.modalService.closeAnyExistingModalDialog();
  }
}

