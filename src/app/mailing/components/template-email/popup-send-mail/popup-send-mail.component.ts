import {Component, ComponentRef, OnInit, ViewChild} from '@angular/core';
import {IModalDialog, IModalDialogOptions} from 'ngx-modal-dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ModalDialogInstanceService} from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import {SendMailService} from '../../../services/send-mail/send-mail.service';
import {TemplateEmailService} from '../../../services/template-email/template-email.service';
import {TemplateEmail} from '../../../../models/mailing/template-email';
import {SendMail} from '../../../../models/mailing/SendMail';
import {MailingConstant} from '../../../../constant/mailing/mailing.constant';
import {GrowlService} from '../../../../../COM/Growl/growl.service';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {ContactConstants} from '../../../../constant/crm/contact.constant';
import {SwalWarring} from '../../../../shared/components/swal/swal-popup';
import {ValidationService} from '../../../../shared/services/validation/validation.service';
import {UploadFilesComponent} from '../../upload-files/upload-files.component';
import {CrmConstant} from '../../../../constant/crm/crm.constant';
import {LocalStorageService} from '../../../../login/Authentification/services/local-storage-service';

@Component({
  selector: 'app-popup-send-mail',
  templateUrl: './popup-send-mail.component.html',
  styleUrls: ['./popup-send-mail.component.scss']
})
export class PopupSendMailComponent implements OnInit, IModalDialog {
  public sendMailFormGroup: FormGroup;
  public templateList = [];
  public templateListSource = [];
  listrecipients: string[];
  listrecipientsCc: string[];
  listrecipientsBcc: string[];
  public editBeforeSending = false;
  widhTemplate = false;
  widhoutTemplate = true;
  public isModal;
  selectedTemplateId;
  selectedTemplate: TemplateEmail;
  selectedTemplateDetails: string;
  editorContent: string;
  onlyImgContent: string;
  listFilePaths: string[];
  public mailIsValid = true;
  templateMail = new TemplateEmail();
  showCCRecipient = false;
  showBCCRecipient = false;
  currentUser;
  listFileValid = true;
  @ViewChild(UploadFilesComponent) filecomponent;

  public optionDialog: Partial<IModalDialogOptions<any>>;
  listMailRecieved: any;
  listToValid = true;
  listCcValid = true;
  listBccValid = true;
  savedAction = false;
  private validBody = false;

  constructor(private fb: FormBuilder, private modalService: ModalDialogInstanceService, private sendMailService: SendMailService,
              private templateEmailService: TemplateEmailService, private growlService: GrowlService, private translate: TranslateService,
              private router: Router, private swalWarring: SwalWarring, private validationService: ValidationService,
              private localStorageService : LocalStorageService) {
  }

  ngOnInit() {
    this.initTemplatesDropDown();
    this.createSendMailForm();
    this.selectedTemplateDetails = '';
    this.editorContent = '';
    this.listrecipientsCc = [];
    this.listrecipientsBcc = [];
    this.sendMailFormGroup.controls['template'].setValue(new TemplateEmail());
    this.currentUser = this.getCurrentUser();
  }

  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.optionDialog = options;
    this.listMailRecieved = this.optionDialog.data.listMails;
    this.listrecipients = this.listMailRecieved;
    this.isModal = true;
  }

  private createSendMailForm(): void {
    this.sendMailFormGroup = this.fb.group({
      subject: ['', [Validators.required]],
      template: [''],
      recepients: [['']],
      pathAttachments: []
    });
  }

  initTemplatesDropDown() {
    this.templateEmailService.getJavaGenericService().getEntityList().subscribe((data) => {
      this.templateList = [new TemplateEmail(null, this.translate.instant('NO_TEMPLATE'))];
      this.templateList = this.templateList.concat(data);
      this.templateListSource = data;
    });
  }

  selected(event) {
    if (this.selectedTemplateId === null) {
      this.setNoTemplate();
    } else {
      this.templateEmailService.getJavaGenericService().getEntityById(this.selectedTemplateId).subscribe((data) => {
          this.selectedTemplate = data;
          this.selectedTemplateDetails = this.selectedTemplate.body;
          this.editorContent = this.selectedTemplateDetails ? this.selectedTemplateDetails : '';
          this.sendMailFormGroup.controls['subject'].setValue(this.selectedTemplate.subject);
        }
      );
      this.widhTemplate = true;
      this.widhoutTemplate = false;
    }
  }

  private setNoTemplate() {
    this.selectedTemplate = null;
    this.selectedTemplateDetails = null;
    this.editorContent = null;
    this.widhoutTemplate = true;
    this.widhTemplate = false;
    this.sendMailFormGroup.controls['subject'].setValue(null);
  }

  handleFilter(value) {
    if (value.length !== 0) {
      this.templateList = this.templateList.filter((s) => s.name.toLowerCase().indexOf(value.toLowerCase()) !== -1);
    } else {
      this.templateList = this.templateListSource;
    }
  }

  onBackToListOrCancel() {
    if (!this.isModal) {
      this.router.navigateByUrl(ContactConstants.CONTACT_LIST_URL);
    } else {
      this.optionDialog.onClose();
      this.modalService.closeAnyExistingModalDialog();
    }
    this.listMailRecieved = [];
    this.listrecipients = [];
  }

  edit() {
    this.editBeforeSending = true;
  }

  reset() {
    this.sendMailFormGroup.reset();
    this.editorContent = null;
    this.listrecipients = [];
    this.listMailRecieved = [];
    this.savedAction = false;
  }

  sendMailWithoutBody(mail) {
    this.swalWarring.CreateSwalYesOrNo(this.translate.instant(MailingConstant.PUP_UP_SEND_MAIL_WITHOUT_OBJECT_TEMPLATE_TEXT))
      .then((result) => {
        if (result.value) {
          this.sendMailService.getJavaGenericService().saveEntity(mail).subscribe((data) => {
            if (data != null) {
              this.reset();
            }
          }, error => {
          }, () => {
            this.growlService.successNotification(this.translate.instant(MailingConstant.SUCCESS_OPERATION));
            this.onBackToListOrCancel();
          });
        }
      });
  }

  send() {
    this.validateEmailAddress('to');
    this.validateEmailAddress('cc');
    this.validateEmailAddress('bcc');
    this.savedAction = true;
    this.sendMailFormGroup.controls['recepients'].setValue(this.listrecipients);
    if (this.sendMailFormGroup.valid && this.listrecipients.length !== 0 && this.listToValid &&
      this.listBccValid && this.listCcValid && this.listFileValid) {
      const mailToSend = this.convertFormToDtoSendMail(this.sendMailFormGroup);
      if (this.isNullOrUndefinedOrEmpty(mailToSend.templateEmail.body) && !this.validBody) {
        this.sendMailWithoutBody(mailToSend);
      } else {
        this.sendMailService.getJavaGenericService().saveEntity(mailToSend).subscribe(
          data => {
            if (data != null) {
              this.reset();
            }
          }
        );
        this.growlService.successNotification(this.translate.instant(MailingConstant.SUCCESS_OPERATION));
        this.onBackToListOrCancel();
      }
    } else {
      this.validationService.validateAllFormFields(this.sendMailFormGroup);
      /*TO DO : add validator on list recipients */
    }
  }

  convertFormToDtoSendMail(form: FormGroup): SendMail {
    const sendMail = new SendMail();
    const formValue = form.value;
    this.templateMail.subject = formValue.subject;
    if (!this.editBeforeSending && this.widhTemplate) {
      this.templateMail.body = this.selectedTemplateDetails ? this.selectedTemplateDetails : '';
    } else {
      this.templateMail.body = this.editorContent ? this.editorContent : '';
    }
    this.checkImgValue();
    if (this.onlyImgContent) {
      this.templateMail.body = this.onlyImgContent;
    }
    sendMail.templateEmail = this.templateMail;
    /*TO DO : test sur list recipients emails valid !  */
    sendMail.toList = this.listrecipients;
    if (this.listFilePaths !== undefined) {
      sendMail.listPathAttachment = this.listFilePaths;
    } else {
      sendMail.listPathAttachment = [];
    }
    sendMail.ccList = this.listrecipientsCc;
    sendMail.bccList = this.listrecipientsBcc;
    sendMail.attchments = [];
    sendMail.idSender = this.currentUser.IdUser;
    return sendMail;
  }

  receiveMessage($event) {
    this.listFilePaths = $event;
  }

  checkMail(mails: string[]): boolean {
    let result = true;
    mails.forEach(mail => {
      if (!mail.match(CrmConstant.MAIL_PATTERN)) {
        result = false;
      }
    });
    return result;
  }

  mailMatch(mail): boolean {
    if (mail.match(CrmConstant.MAIL_PATTERN)) {
      return true;
    }
    return false;
  }

  showCC() {
    this.showCCRecipient = true;
  }

  showBCC() {
    this.showBCCRecipient = true;
  }

  private getCurrentUser() {
    return this.localStorageService.getUser();
  }

  checkFile(event) {
    this.listFileValid = event;
    this.validBody = event;
  }

  validateEmailAddress(from): void {
    switch (from) {
      case 'to':
        this.listToValid = this.checkMail(this.listrecipients);
        break;
      case 'cc' :
        this.listCcValid = this.listrecipientsCc.length === 0 || this.checkMail(this.listrecipientsCc);
        break;
      case 'bcc' :
        this.listBccValid = this.listrecipientsBcc.length === 0 || this.checkMail(this.listrecipientsBcc);
        break;
    }
  }

  checkListToNotValid(): boolean {
    return this.listrecipients.length > 0 && !this.checkMail(this.listrecipients);
  }

  checkListCcNotValid(): boolean {
    return this.listrecipientsCc.length > 0 && !this.checkMail(this.listrecipientsCc);
  }

  checkListBccNotValid(): boolean {
    return this.listrecipientsBcc.length > 0 && !this.checkMail(this.listrecipientsBcc);
  }

  public isNullOrUndefinedOrEmpty(value): boolean {
    if (value === null || value === undefined || value === '') {
      return true;
    }
  }

  deleteFileEvent(event) {
    this.validBody = false;
  }

  checkImgValue() {
    if (this.editBeforeSending || this.widhoutTemplate) {
      const editorElement = document.getElementById('htmlEditor');
      const html = editorElement.children[0].children[1].children[0].innerHTML;
      this.onlyImgContent = (!this.editorContent && html.includes('img')) ? html : null;
    }
  }
}
