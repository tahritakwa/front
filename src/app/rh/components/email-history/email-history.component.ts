import {Component, ComponentRef, OnInit, ViewEncapsulation} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {IModalDialog, IModalDialogOptions} from 'ngx-modal-dialog';
import {Subscription} from 'rxjs/Subscription';
import {Subject} from 'rxjs/Subject';
import {EmailEnumerator} from '../../../models/enumerators/email.enum';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-email-history',
  templateUrl: './email-history.component.html',
  styleUrls: ['./email-history.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EmailHistoryComponent implements OnInit, IModalDialog {
  public emailFormGroup: FormGroup;
  public isModal: boolean;
  public isUpdateMode: boolean;
  public options: Partial<IModalDialogOptions<any>>;
  public reference: ComponentRef<IModalDialog>;
  public closeDialogSubject: Subject<any>;
  public emailSubscription: Subscription;
  public emailEnumerator = EmailEnumerator;
  public email: any;
  public formatDate = this.translate.instant(SharedConstant.DATE_FORMAT);
  constructor(private fb: FormBuilder, private translate: TranslateService) {
      this.emailFormGroup = this.fb.group({
        emails: this.fb.array([]) ,
      });
  }

  get emails(): FormArray {
    return this.emailFormGroup.get(SharedConstant.EMAILS) as FormArray;
  }

  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.isModal = true;
    this.options = options;
    this.closeDialogSubject = options.closeDialogSubject;
  }

  ngOnInit() {
    this.options.data.forEach(object => {
      this.emails.push(this.createFormGroup(object.IdEmailNavigation, object.CreationDate));
    });
    this.emails.disable();
  }

  createFormGroup(email, date?): FormGroup {
    return this.fb.group({
      Id: [email ? email.Id : 0],
      Receivers: [email ? email.Receivers :
        undefined],
      Subject: [email ? email.Subject :
        undefined],
      Body: [email ? email.Body :
        undefined],
      From: [email ? email.From : undefined],
      CreationDate: [date ? date : undefined]
    });

  }

}
