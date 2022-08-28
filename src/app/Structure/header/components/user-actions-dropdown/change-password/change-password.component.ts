import { Component, OnInit, ComponentRef } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { ModalDialogInstanceService } from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import { IModalDialogOptions, IModalDialog } from 'ngx-modal-dialog';
import { UserService } from '../../../../../administration/services/user/user.service';
import { UserConstant } from '../../../../../constant/Administration/user.constant';
import {LocalStorageService} from '../../../../../login/Authentification/services/local-storage-service';

@Component({
  selector: 'app-change-password-modal',
  templateUrl: 'change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit , IModalDialog {
  oldPassword: string;
  password: string;
  confirmPassword: string;
  title: string;
  titleButtonSave: string;
  Showoldpwd = true;
  userMail: string;
  public language: string;
  public optionDialog: Partial<IModalDialogOptions<any>>;
  value = '';
  changePasswordFormGroup: FormGroup;

  constructor(private fb: FormBuilder, private modalService: ModalDialogInstanceService, private userService: UserService,
              private localStorageService : LocalStorageService) { }
  /**
   *
   * on logout
   * */

  private createForm(): void {
    this.changePasswordFormGroup = this.fb.group({
      Id: [this.localStorageService.getUserId()],
      NewPassword: ['', [Validators.required, Validators.pattern(UserConstant.PASSWORDPATTERN)]],
      ConfirmNewPassword: ['', [Validators.required]],
    }, { validator: this.checkIfMatchingPasswords('NewPassword', 'ConfirmNewPassword') });
    if (this.Showoldpwd) {
      this.changePasswordFormGroup.addControl(UserConstant.PASSWORD, new FormControl ('', Validators.required));
    }
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

  isValidProfileField(name) {
    if (this.changePasswordFormGroup.get(name) !== null) {
      return ((this.changePasswordFormGroup.get(name).touched ||
        this.changePasswordFormGroup.get(name).dirty) &&
        this.changePasswordFormGroup.get(name).errors);
    }

  }

  cancel() {
    this.modalService.closeAnyExistingModalDialog();
  }


  saveChangePassword() {
    if (this.changePasswordFormGroup.valid) {
      this.userService.ChangePassword(this.prepareObjectToSend(this.changePasswordFormGroup.value), this.userMail).subscribe( data => {
        this.cancel();
      });
    }
  }

  private prepareObjectToSend(value): any {
    return {
      Model: value,
      EntityAxisValues: []
    };
  }

  onKey(event: any) { // without type info
    this.value += event.target.value + ' | ';
  }

  ngOnInit(): void {
    this.createForm();
  }
  /**
   * initialize dialog
   * @param reference
   * @param options
   */
  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.optionDialog = options;
    if (options.data.showPwd !== undefined) {
      this.Showoldpwd = options.data.showPwd;
    }
    if (options.data.Email !== undefined) {
      this.userMail = options.data.Email;
    }
  }
}
