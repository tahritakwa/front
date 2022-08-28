import {Component, HostListener, Inject, Input, OnInit, ViewChild} from '@angular/core';
import { saveAs } from '@progress/kendo-file-saver';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { TranslateService } from '@ngx-translate/core';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { Router } from '@angular/router';
import { SharedAccountingConstant } from '../../../constant/accounting/sharedAccounting.constant';
import {TemplateAccountingService} from '../../services/template/template.service';
import {TemplateAccountingConstant} from '../../../constant/accounting/template.constant';
import {DataTransferShowSpinnerService} from '../../../shared/services/spinner/data-transfer-show-spinner.service';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {DocumentAccountConstant} from '../../../constant/accounting/document-account.constant';
import { RoleConfigConstant } from '../../../Structure/_roleConfigConstant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';

@Component({
  selector: 'app-accounting-template-import-grid-btn',
  templateUrl: './accounting-template-import-grid-btn.component.html',
  styleUrls: ['./accounting-template-import-grid-btn.component.scss']
})
export class AccountingTemplateImportGridBtn implements OnInit {

  @Input() export: boolean;
  @Input() advancedAdd: boolean;
  @Input() canImport: boolean;
  @Input() addLink: string;
  @Input() title: string;
  @Input() exportModelForImport: string;
  @ViewChild('toggle') toggle;
  private currentFileUpload: File;
  public dataTransferShowSpinnerService: DataTransferShowSpinnerService;
  spinner = false;
  EXCEL_FILE_MAX_SIZE = 5;
  public AccountingPermissions = PermissionConstant.SettingsAccountingPermissions;

  constructor(
    private templateAccountingService: TemplateAccountingService, private growlService: GrowlService,
    @Inject(DataTransferShowSpinnerService) dataTransferShowSpinnerService,  private authService: AuthService,
    private translate: TranslateService, private router: Router, private swalWarrings: SwalWarring) {
    if (dataTransferShowSpinnerService) {
      this.dataTransferShowSpinnerService = dataTransferShowSpinnerService;
    }
  }

  exportTemplates(): any {
    this.templateAccountingService.getJavaGenericService().getEntityListHeaders(TemplateAccountingConstant.ACCOUNTING_TEMPLATE_EXPORT)
      .subscribe(data => {
        saveAs(data, this.translate.instant(TemplateAccountingConstant.EXPORT_ACCOUNTING_TEMPLATES_EXCEL_FILE_NAME));
      }, error => {
        this.growlService.ErrorNotification(this.translate.instant(SharedAccountingConstant.EXCEL_EXPORT_ERROR));
      });
  }

  exportModel(): any {
    this.templateAccountingService.getJavaGenericService().getEntityListHeaders(TemplateAccountingConstant.ACCOUNTING_TEMPLATE_EXPORT_MODEL)
      .subscribe(data => {
        saveAs(data, this.translate.instant(TemplateAccountingConstant.EXPORT_ACCOUNTING_TEMPLATES_EXCEL_MODEL_FILE_NAME));
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
    this.templateAccountingService.getJavaGenericService().saveEntity({
      'base64Content': base64Content,
      'name': file.name
    }, TemplateAccountingConstant.ACCOUNTING_TEMPLATE_IMPORT).subscribe(data => {
      this.spinner = false;
      if (data.name) {
        this.swalWarrings.CreateSwal(SharedAccountingConstant.DO_YOU_WANT_TO_DOWNLOAD_AND_FIX_ERRORS,
          `${this.translate.instant(SharedAccountingConstant.EXCEL_IMPORT_ERROR)}`,
          SharedConstant.YES, SharedConstant.NO).then((result) => {
            if (result.value) {
              const linkSource = `data:${SharedAccountingConstant.EXCEL_MIME_TYPE};base64,${data.base64Content}`;
              const downloadLink = document.createElement('a');
              const fileName = this.translate.instant(TemplateAccountingConstant.IMPORT_ACCOUNTING_TEMPLATES_EXCEL_ERROR_FILE_NAME);
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

  reset() {
    (document.getElementById('currentFile') as HTMLInputElement).value = '';
  }

  goToAddNewTemplate() {
      this.router.navigateByUrl(TemplateAccountingConstant.ADD_TEMPLATE_URL);
  }
}
