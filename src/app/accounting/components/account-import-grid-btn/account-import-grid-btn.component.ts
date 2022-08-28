import { Component, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { saveAs } from '@progress/kendo-file-saver';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { TranslateService } from '@ngx-translate/core';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import {Router} from '@angular/router';
import { SharedAccountingConstant } from '../../../constant/accounting/sharedAccounting.constant';
import {SpinnerService} from '../../../../COM/spinner/spinner.service';
import {AccountService} from '../../services/account/account.service';
import {AccountsConstant} from '../../../constant/accounting/account.constant';
import {NumberConstant} from '../../../constant/utility/number.constant';

@Component({
  selector: 'app-account-import-grid-btn',
  templateUrl: './account-import-grid-btn.component.html',
  styleUrls: ['./account-import-grid-btn.component.scss']
})
export class AccountImportGridBtnComponent implements OnInit {
  @Input() advancedAdd: boolean;
  @Input() add: boolean;
  @Input() export: boolean;
  @Input() canImport: boolean;
  @Input() addLink: string;
  @Input() title: string;
  @Input() canExportModel: string;

  @ViewChild('toggle') toggle;
  private currentFileUpload: File;
  public shouldShow = false;
  spinner = false;
  EXCEL_FILE_MAX_SIZE = 5;
  constructor(
    private accountService: AccountService, private growlService: GrowlService,
    private translate: TranslateService, private router: Router, private swalWarrings: SwalWarring, private spinnerService: SpinnerService
  ) {
  }

  exportAccounts(): any {
    this.accountService.getJavaGenericService().getEntityListHeaders(AccountsConstant.ACCOUNT_EXPORT)
      .subscribe(data => {
        saveAs(data, this.translate.instant(AccountsConstant.EXPORT_ACCOUNTS_EXCEL_FILE_NAME));
      }, error => {
        this.growlService.ErrorNotification(this.translate.instant(SharedAccountingConstant.EXCEL_EXPORT_ERROR));
      });
  }

  exportModel(): any {
    this.accountService.getJavaGenericService().getEntityListHeaders(AccountsConstant.ACCOUNT_EXPORT_MODEL)
      .subscribe(data => {
        saveAs(data, this.translate.instant(AccountsConstant.EXPORT_ACCOUNTS_EXCEL_MODEL_FILE_NAME));
      }, error => {
        this.growlService.ErrorNotification(this.translate.instant(SharedAccountingConstant.EXCEL_EXPORT_ERROR));
      });
  }

  ngOnInit() {
  }

  uploadFile(event) {
    this.currentFileUpload = event.target.files[0];
    if (this.currentFileUpload) {
      const reader = new FileReader();
      reader.readAsBinaryString(this.currentFileUpload);
      this.handleInputChange(this.currentFileUpload);
      this.currentFileUpload = undefined;
    }
  }

  handleInputChange(file) {
    const reader = new FileReader();
    const maxSize = this.EXCEL_FILE_MAX_SIZE * SharedAccountingConstant.ONE_MEGABYTE;
    if (file.size < maxSize) {
      if (file.type.match(/-*excel/) || file.type.match(/-*xls-*/) || file.type.match(/-*spreadsheet-*/)) {
        reader.onloadend = this._handleReaderLoaded.bind(this, file);
        reader.readAsDataURL(file);
      } else {
        alert(this.translate.instant(SharedAccountingConstant.INVALID_FILE_TYPE));
      }
    } else {
      alert(this.translate.instant(SharedAccountingConstant.EXCEL_FILE_MAX_SIZE_EXCEEDED, { maxSize: maxSize }));
    }

  }

  _handleReaderLoaded(file, e) {
    const reader = e.target;
    const base64result = reader.result.substr(reader.result.indexOf(',') + 1);

    if (base64result !== undefined) {
      this.saveFile(base64result, file);
    }
  }

  saveFile(base64Content, file) {
    this.spinner = true;
    this.accountService.getJavaGenericService().saveEntity({
      'base64Content': base64Content,
      'name': file.name
    }, AccountsConstant.ACCOUNT_IMPORT).subscribe(data => {
      this.spinner = false;
      if (data.name) {
        this.swalWarrings.CreateSwal(SharedAccountingConstant.DO_YOU_WANT_TO_DOWNLOAD_AND_FIX_ERRORS,
          `${this.translate.instant(SharedAccountingConstant.EXCEL_IMPORT_ERROR)}`,
          SharedConstant.YES, SharedConstant.NO).then((result) => {
            if (result.value) {
              const linkSource = `data:${SharedAccountingConstant.EXCEL_MIME_TYPE};base64,${data.base64Content}`;
              const downloadLink = document.createElement('a');
              const fileName = this.translate.instant(AccountsConstant.IMPORT_ACCOUNTS_EXCEL_ERROR_FILE_NAME);
              downloadLink.href = linkSource;
              downloadLink.download = fileName;
              downloadLink.click();
            }
            this.currentFileUpload = undefined;
          });
      } else {
        this.growlService.successNotification(this.translate.instant(SharedAccountingConstant.SUCCESS_OPERATION));
        setTimeout(() => {
          window.location.reload();
        }, NumberConstant.ONE_THOUSAND);
      }
    }, () => {}, () => {
      this.spinner = false;
    });
    this.spinnerService.hideLaoder();
  }

  reset() {
    (document.getElementById('currentFile') as HTMLInputElement).value = '';
  }

  goToAddNewAccount() {
      this.router.navigateByUrl(AccountsConstant.ACCOUNT_ADD_URL);
  }
}
