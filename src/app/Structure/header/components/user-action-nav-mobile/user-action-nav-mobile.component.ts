import {Component, Input, OnInit, ViewContainerRef} from '@angular/core';
import {User} from '../../../../models/administration/user.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FormModalDialogService} from '../../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import {LoginService} from '../../../../login/services/login.service';
import {ModalDialogInstanceService} from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {UserConstant} from '../../../../constant/Administration/user.constant';
import {ChangePasswordComponent} from '../user-actions-dropdown/change-password/change-password.component';
import {SharedConstant} from '../../../../constant/shared/shared.constant';
import { AuthService } from '../../../../login/Authentification/services/auth.service';
import { UserJavaService } from '../../../../administration/services/user/user.java.service';
import { Operation } from '../../../../../COM/Models/operations';
import {LocalStorageService} from '../../../../login/Authentification/services/local-storage-service';

const LOGIN_ROUTE = '/login';

@Component({
  selector: 'app-user-action-nav-mobile',
  templateUrl: './user-action-nav-mobile.component.html',
  styleUrls: ['./user-action-nav-mobile.component.scss']
})
export class UserActionNavMobileComponent implements OnInit {

  @Input() user: User;
  oldPassword: string;
  password: string;
  confirmPassword: string;
  title: string;
  titleButtonSave: string;
  public language: string;
  value = '';
  changePasswordFormGroup: FormGroup;

  /**
   *
   * @param fb
   * @param formModalDialogService
   * @param loginService
   * @param modalService
   * @param viewRef
   * @param router
   * @param translate
   */
  constructor(private fb: FormBuilder, private formModalDialogService: FormModalDialogService,
              private modalService: ModalDialogInstanceService,
              private viewRef: ViewContainerRef, private router: Router, public translate: TranslateService,
              private authService: AuthService,
              private userJavaService: UserJavaService, private localStorageService : LocalStorageService) { }
  /**
   *
   * on logout
   * */

  private createForm(): void {
    this.changePasswordFormGroup = this.fb.group({
      oldPassword: ['', Validators.required],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    }, { validator: this.checkIfMatchingPasswords('password', 'confirmPassword') });
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

  onClickChangePWD($event) {
    const options = {
      Email: this.localStorageService.getEmail()
    };
    this.formModalDialogService.openDialog(UserConstant.CHANGE_PWD, ChangePasswordComponent,
      this.viewRef, this.cancel.bind(this), options, null, SharedConstant.MODAL_DIALOG_SIZE_M);
  }

  cancel() {
    this.modalService.closeAnyExistingModalDialog();
  }

  onKey(event: any) { // without type info
    this.value += event.target.value + ' | ';
  }

  async onClickLogout() {
    const oauthRevokeUrl = 'oauth/revoke/';
    if (this.authService.isRefreshTokenNotNullAndNotExpired()) {
      const deletedToken = await this.authService.loadAccessTokenUsingRefreshToken(true)
        .flatMap(tokenId => this.userJavaService.getJavaGenericService().callService(Operation.POST, oauthRevokeUrl + tokenId));
      if (deletedToken) {
        this.authService.logout(this.translate.instant(SharedConstant.YOU_LOGGED_OUT));
      }
    }

  }
  ngOnInit(): void {
    this.createForm();
  }

  onClickProfile() {
    this.router.navigateByUrl(SharedConstant.PROFILE_URL);
  }
}
