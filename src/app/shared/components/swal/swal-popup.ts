import swal from 'sweetalert2';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SharedConstant } from '../../../constant/shared/shared.constant';
@Injectable()
export class SwalWarring {
  /** Create Swal class */

  constructor(private translate: TranslateService) {
  }
  public CreateSwal(text?: string, title?: string, confirmButtonText?: string,
    cancelButtonText?: string, hideShowCancelButton?: boolean, hasTitle: boolean = true, allowEnterKey: boolean=true): any {
    return swal.fire({
      title: hasTitle ? (title
        ? `${this.translate.instant(title)}`
        : `${this.translate.instant('SWAL_TITLE')}`) : '',
      text: text
        ? `${this.translate.instant(text)}`
        : `${this.translate.instant('SWAL_TEXT')}`,
      confirmButtonText: confirmButtonText
        ? `${this.translate.instant(confirmButtonText)}`
        : `${this.translate.instant('SWAL_CONFIRM')}`,
      cancelButtonText: cancelButtonText
        ? `${this.translate.instant(cancelButtonText)}`
        : `${this.translate.instant('SWAL_CANCEL')}`,
      showCancelButton: hideShowCancelButton
        ? false
        : true,
      confirmButtonColor: 'var(--green)',
      cancelButtonColor: 'var(--red)',
      allowEnterKey: allowEnterKey
    });
  }

  public CreateSwalYesOrNo(text?: string, title?: string, confirmButtonText?: string,
    cancelButtonText?: string, hideShowCancelButton?: boolean, hasTitle: boolean = true): any {
    return swal.fire({
      title: hasTitle ? (title
        ? `${this.translate.instant(title)}`
        : `${this.translate.instant('SWAL_TITLE')}`) : '',
      text: text
        ? `${this.translate.instant(text)}`
        : `${this.translate.instant('SWAL_TEXT')}`,
      icon: 'error',
      confirmButtonText: confirmButtonText
        ? `${this.translate.instant(confirmButtonText)}`
        : `${this.translate.instant('SWAL_YES')}`,
      cancelButtonText: cancelButtonText
        ? `${this.translate.instant(cancelButtonText)}`
        : `${this.translate.instant('SWAL_NO')}`,
      showCancelButton: hideShowCancelButton
        ? false
        : true,
    });
  }
  public CreateDeleteSwal(entityname = 'ELEMENT', Pronoun = 'CET'): any {
    return swal.fire({
      title: this.translate.instant(SharedConstant.DELETING) + ' ' + this.translate.instant(entityname).toLowerCase(),
      text: this.translate.instant(SharedConstant.DELETING_TEXT) + ' ' + this.translate.instant(Pronoun) + ' ' + this.translate.instant(entityname).toLowerCase() + '?',
      confirmButtonText: this.translate.instant('YES'),
      cancelButtonText: this.translate.instant('NO'),
      showCancelButton: true,
      confirmButtonColor: 'var(--green)',
      cancelButtonColor: 'var(--red)',
    });
  }
}

