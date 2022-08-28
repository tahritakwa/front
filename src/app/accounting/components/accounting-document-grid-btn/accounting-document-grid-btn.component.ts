import { Component, HostListener, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { DocumentAccountConstant } from '../../../constant/accounting/document-account.constant';
import { saveAs } from '@progress/kendo-file-saver';
import { DocumentAccountService } from '../../services/document-account/document-account.service';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { TranslateService } from '@ngx-translate/core';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { Router } from '@angular/router';
import { DocumentAccountListComponent } from '../../document-account/document-account-list/document-account-list/document-account-list.component';
import { SharedAccountingConstant } from '../../../constant/accounting/sharedAccounting.constant';
import {DataTransferShowSpinnerService} from '../../../shared/services/spinner/data-transfer-show-spinner.service';
import {NumberConstant} from '../../../constant/utility/number.constant';

@Component({
  selector: 'app-accounting-document-grid-btn',
  templateUrl: './accounting-document-grid-btn.component.html',
  styleUrls: ['./accounting-document-grid-btn.component.scss']
})
export class AccountingDocumentGridBtnComponent implements OnInit {

  @Input() advancedAdd: boolean;
  @Input() add: boolean;
  @Input() export: boolean;
  @Input() canImport: boolean;
  @Input() canExportModel: boolean;
  @Input() addLink: string;
  @Input() title: string;
  @Input() openAddDocumentAccountInNewTab: boolean;

  @ViewChild('toggle') toggle;

  private currentFileUpload: File;
  public shouldShow = false;

  public dataTransferShowSpinnerService: DataTransferShowSpinnerService;
  spinner = false;
  EXCEL_FILE_MAX_SIZE = 5;
  constructor(@Inject(DocumentAccountListComponent) private documentAccountListComponent: DocumentAccountListComponent,
    private documentAccountService: DocumentAccountService, private growlService: GrowlService,
    @Inject(DataTransferShowSpinnerService) dataTransferShowSpinnerService,
    private translate: TranslateService, private router: Router, private swalWarrings: SwalWarring
  ) {
    if (dataTransferShowSpinnerService) {
      this.dataTransferShowSpinnerService = dataTransferShowSpinnerService;
    }
  }

  exportDocumentAccount(): any {
    this.documentAccountService.getJavaGenericService().getEntityListHeaders(DocumentAccountConstant.DOCUMENT_EXPORT)
      .subscribe(data => {
        saveAs(data, this.translate.instant(DocumentAccountConstant.EXPORT_DOCUMENT_ACCOUNT_EXCEL_FILE_NAME));
      }, error => {
        this.growlService.ErrorNotification(this.translate.instant(SharedAccountingConstant.EXCEL_EXPORT_ERROR));
      });
  }

  exportModel(): any {
    this.documentAccountService.getJavaGenericService().getEntityListHeaders(DocumentAccountConstant.DOCUMENT_EXPORT_MODEL)
      .subscribe(data => {
        saveAs(data, this.translate.instant(DocumentAccountConstant.EXPORT_DOCUMENT_ACCOUNT_EXCEL_MODEL_FILE_NAME));
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
    this.dataTransferShowSpinnerService.setShowSpinnerValue(true);
    this.spinner = true;
    this.documentAccountService.getJavaGenericService().saveEntity({
      'base64Content': base64Content,
      'name': file.name
    }, DocumentAccountConstant.DOCUMENT_IMPORT).subscribe(data => {
      this.spinner = false;
      if (data.name) {
        this.swalWarrings.CreateSwal(SharedAccountingConstant.DO_YOU_WANT_TO_DOWNLOAD_AND_FIX_ERRORS,
          `${this.translate.instant(SharedAccountingConstant.EXCEL_IMPORT_ERROR)}`,
          SharedConstant.YES, SharedConstant.NO).then((result) => {
            if (result.value) {
              const linkSource = `data:${SharedAccountingConstant.EXCEL_MIME_TYPE};base64,${data.base64Content}`;
              const downloadLink = document.createElement('a');
              const fileName = this.translate.instant(DocumentAccountConstant.IMPORT_DOCUMENT_ACCOUNT_EXCEL_ERROR_FILE_NAME);
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
        }, NumberConstant.FIVE_HUNDRED);
      }
    }, () => {}, () => {
      this.spinner = false;
    });
  }

  goToAddNewDocumentAccount() {
    if (this.openAddDocumentAccountInNewTab === true) {
      const url = DocumentAccountConstant.DOCUMENT_ACCOUNT_ADD_URL;
      window.open(url, '_blank');
    } else {
      this.router.navigateByUrl(DocumentAccountConstant.DOCUMENT_ACCOUNT_ADD_URL);
    }
  }

  @HostListener('window:mousedown', ['$event'])
  onClickedOutside(e: Event) {
    if (this.shouldShow === true) {
      this.toggle.nativeElement.classList.add('hide');
      this.toggle.nativeElement.classList.remove('show');
      this.shouldShow = false;
    }
  }

  showNav() {
    this.shouldShow = true;
  }

  reset() {
    (document.getElementById('currentFile') as HTMLInputElement).value = '';
  }
}
