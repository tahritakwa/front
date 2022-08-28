import {Component, ComponentRef, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {MailingConstant} from '../../../../constant/mailing/mailing.constant';
import {TemplateEmailService} from '../../../services/template-email/template-email.service';
import {GrowlService} from '../../../../../COM/Growl/growl.service';
import {TranslateService} from '@ngx-translate/core';
import {HttpClient} from '@angular/common/http';
import {IModalDialog, IModalDialogOptions} from 'ngx-modal-dialog';
import {ModalDialogInstanceService} from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import {TemplateEmail} from '../../../../models/mailing/template-email';
import {ValidationService} from '../../../../shared/services/validation/validation.service';

@Component({
  selector: 'app-add-template-email',
  templateUrl: './add-template-email.component.html',
  styleUrls: ['./add-template-email.component.scss']
})
export class AddTemplateEmailComponent implements OnInit , IModalDialog {
  editorContent: string;
  public addFormGroup: FormGroup;
  templateEmail: TemplateEmail;
  public isModal;
  public optionDialog: Partial<IModalDialogOptions<any>>;
  constructor(private fb: FormBuilder, private router: Router, private templateEmailService: TemplateEmailService,
              private growlService: GrowlService, private translate: TranslateService,
              public http: HttpClient, private modalService: ModalDialogInstanceService, private validationService: ValidationService) { }
  ngOnInit() {
    this.createAddForm();
  }
  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.optionDialog = options;
    this.isModal = true;
  }
  private createAddForm(): void {
    this.addFormGroup = this.fb.group({
      name: ['', [Validators.required]],
      subject: ['', [Validators.required]],
    });
  }
  addTemplate(isRedirect: boolean) {
    if (this.addFormGroup.valid) {
      this.templateEmail = this.addFormGroup.value;
      this.templateEmail.body =  this.editorContent;
      this.templateEmailService.getJavaGenericService().saveEntity(this.templateEmail).subscribe(
        data => {
          if (data != null) {
            this.addFormGroup.reset();
            this.editorContent = null;
            this.growlService.successNotification(this.translate.instant(MailingConstant.SUCCESS_OPERATION));
          }
        }, () => {
          this.growlService.ErrorNotification(this.translate.instant(MailingConstant.FAILURE_OPERATION));
        }, () => {
          this.saveTemplateRedirection(isRedirect);
        }
      );
    } else {
      this.validationService.validateAllFormFields(this.addFormGroup);

    }
  }

  /**
   *
   * @param isRedirect
   */
  private saveTemplateRedirection(isRedirect: boolean) {
    if (isRedirect) {
      this.addFormGroup.reset();
    } else {
      this.router.navigate([MailingConstant.TEMPLATE_EMAIL_LIST]);
    }
  }

  save(isRedirect: boolean) {
    this. addTemplate(isRedirect);
  }

}
