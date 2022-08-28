import {Component, ComponentRef, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {IModalDialog, IModalDialogOptions} from 'ngx-modal-dialog';
import {Router} from '@angular/router';
import {ModalDialogInstanceService} from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import {ValidationService} from '../../../shared/services/validation/validation.service';
import {Subscription} from 'rxjs/Subscription';
import {Subject} from 'rxjs/Subject';
import {Email} from '../../../models/rh/email.model';
import swal from 'sweetalert2';
import {EmailService} from '../../../shared/services/email/email.service';
import {TranslateService} from '@ngx-translate/core';
import {EmailEnumerator} from '../../../models/enumerators/email.enum';
import {SharedConstant} from '../../../constant/shared/shared.constant';

@Component({
  selector: 'app-new-email',
  templateUrl: './new-email.component.html',
  styleUrls: ['./new-email.component.scss']
})
export class NewEmailComponent implements OnInit, OnDestroy, IModalDialog {
  public emailFormGroup: FormGroup;
  public isModal: boolean;
  public isUpdateMode: boolean;
  public options: Partial<IModalDialogOptions<any>>;
  public reference: ComponentRef<IModalDialog>;
  public closeDialogSubject: Subject<any>;
  public idSubscription: Subscription;
  public emailSubscription: Subscription;
  public originalEmailToUpdate: Email;
  public emailEnumerator = EmailEnumerator;

  constructor(private fb: FormBuilder, private router: Router,
              private modalService: ModalDialogInstanceService, private validationService: ValidationService,
              public emailService: EmailService, private translate: TranslateService) {
  }

  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.isModal = true;
    this.options = options;

    if (this.options.data) {
      this.originalEmailToUpdate = this.options.data;
      this.options.data = undefined;
    }

    this.closeDialogSubject = options.closeDialogSubject;
  }

  ngOnInit() {
    this.createFormGroup();
    if (this.originalEmailToUpdate) {
      this.isUpdateMode = true;
    }
  }

  ngOnDestroy(): void {
    if (this.idSubscription !== undefined) {
      this.idSubscription.unsubscribe();
    }
    if (this.emailSubscription !== undefined) {
      this.emailSubscription.unsubscribe();
    }
  }

  public createFormGroup() {
    this.emailFormGroup = this.fb.group({
      Id: [this.originalEmailToUpdate ? this.originalEmailToUpdate.Id : 0],
      Receivers: [this.originalEmailToUpdate ? this.originalEmailToUpdate.Receivers :
        undefined, [Validators.required]],
      Subject: [this.originalEmailToUpdate ? this.originalEmailToUpdate.Subject :
        undefined, [Validators.required]],
      Body: [this.originalEmailToUpdate ? this.originalEmailToUpdate.Body :
        undefined, [Validators.required]],
      From: [this.originalEmailToUpdate ? this.originalEmailToUpdate.From : undefined]
    });

  }

  save(isFromSendEmailRequest?: boolean) {
    const obj: Email = Object.assign({}, this.originalEmailToUpdate, this.emailFormGroup.getRawValue());
    this.options.data = obj;
    this.saveEmail(isFromSendEmailRequest);
  }

  saveEmail(isFromSendEmailRequest?: boolean): any {
    if (this.options.data) {

      if (isFromSendEmailRequest) {
        this.options.data.Status = EmailEnumerator.SendRequested;
      }

      let isToSave = true;

      if (this.options.data.Subject === this.originalEmailToUpdate.Subject &&
        this.options.data.Receivers === this.originalEmailToUpdate.Receivers &&
        this.options.data.Body === this.originalEmailToUpdate.Body &&
        this.options.data.Status === this.originalEmailToUpdate.Status) {
        isToSave = false;

        if (!isFromSendEmailRequest) {
          swal.fire({
            icon: SharedConstant.ERROR,
            html: `${this.translate.instant(SharedConstant.NO_CHANGES_HAVE_BEEN_MADE)}`
          });
        }

      }

      if (isToSave) {
        this.emailService.save(this.options.data, false).subscribe(() => {
          this.originalEmailToUpdate = this.options.data;
        });
      }

    }
  }

  sendEmail() {
    this.save(true);
    this.emailService.sendEmail(this.options.data).subscribe(() => {
      this.options.onClose();
      this.modalService.closeAnyExistingModalDialog();
    });
  }

}
