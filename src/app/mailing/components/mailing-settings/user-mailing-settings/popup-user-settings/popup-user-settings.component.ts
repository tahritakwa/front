import {Component, ComponentRef, OnInit} from '@angular/core';
import {IModalDialog, IModalDialogOptions} from 'ngx-modal-dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ModalDialogInstanceService} from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import {SendMailService} from '../../../../services/send-mail/send-mail.service';
import {GrowlService} from '../../../../../../COM/Growl/growl.service';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {SwalWarring} from '../../../../../shared/components/swal/swal-popup';
import {ValidationService} from '../../../../../shared/services/validation/validation.service';
import {SettingsMailService} from '../../../../services/settings-mail/settings-mail-service';
import {MailingConstant} from '../../../../../constant/mailing/mailing.constant';
import {UserCredentials} from '../../../../../models/mailing/user-credentials';

@Component({
  selector: 'app-popup-user-settings',
  templateUrl: './popup-user-settings.component.html',
  styleUrls: ['./popup-user-settings.component.scss']
})
export class PopupUserSettingsComponent implements OnInit {
  public optionDialog: Partial<IModalDialogOptions<any>>;
  public mailingFormGroup: FormGroup;
  public currentUser;
  public isModal;
  public title;

  constructor(private fb: FormBuilder, private modalService: ModalDialogInstanceService, private sendMailService: SendMailService
    , private settingsMailService: SettingsMailService, private growlService: GrowlService, private translate: TranslateService,
              private router: Router, private swalWarring: SwalWarring, private validationService: ValidationService) { }

  ngOnInit() {
    this.createMailingForm();
    this.mailingFormGroup.controls['email'].setValue(this.optionDialog.data.user.Email);
  }
  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.optionDialog = options;
    this.currentUser = this.optionDialog.data.user;
    this.title = this.optionDialog.title;
    this.isModal = true;
  }

  private createMailingForm(): void {
    this.mailingFormGroup = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
    });
  }

  onBackToListOrCancel() {
    if (!this.isModal) {
      this.router.navigateByUrl(MailingConstant.USERSEMAIL_LIST);
    } else {
      this.optionDialog.onClose();
      this.modalService.closeAnyExistingModalDialog();
    }
  }
  reset() {
    this.mailingFormGroup.reset();
  }
  save() {
    if ( this.mailingFormGroup.valid) {
     let userCredentials = this.convertFormToDto(this.mailingFormGroup);
        this.settingsMailService.getJavaGenericService().saveEntity(userCredentials).subscribe(
          data => {
            if (data != null) {
              this.reset();
            }
          }
        );
        this.growlService.successNotification(this.translate.instant(MailingConstant.SUCCESS_OPERATION));
        this.onBackToListOrCancel();
    } else {
      this.validationService.validateAllFormFields(this.mailingFormGroup);
    }
  }
  private convertFormToDto(mailingFormGroup: FormGroup): UserCredentials {
   let userCredentials = new UserCredentials();
    /*TO DO : call crypt password from backend*/
    userCredentials = mailingFormGroup.value;
    userCredentials.id = this.currentUser.Id;
    return userCredentials;
  }
}
