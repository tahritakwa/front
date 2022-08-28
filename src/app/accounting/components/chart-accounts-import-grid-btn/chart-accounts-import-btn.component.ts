import {Component, HostListener, Inject, Input, OnInit, ViewChild} from '@angular/core';
import {saveAs} from '@progress/kendo-file-saver';
import {GrowlService} from '../../../../COM/Growl/growl.service';
import {TranslateService} from '@ngx-translate/core';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {SwalWarring} from '../../../shared/components/swal/swal-popup';
import {Router} from '@angular/router';
import {ShowChartOfAccountsComponent} from '../../chart-of-accounts/chart-of-accounts-show/chart-of-accounts-show.component';
import {ChartAccountService} from '../../services/chart-of-accounts/chart-of-account.service';
import {ChartOfAccountsConstant} from '../../../constant/accounting/chart-of-account.constant';
import {SharedAccountingConstant} from '../../../constant/accounting/sharedAccounting.constant';
import {SpinnerService} from '../../../../COM/spinner/spinner.service';
import {NumberConstant} from '../../../constant/utility/number.constant';

@Component({
  selector: 'app-chart-accounts-import-btn',
  templateUrl: './chart-accounts-import-btn.component.html',
  styleUrls: ['./chart-accounts-import-btn.component.scss']
})
export class ChartAccountsImportBtnComponent implements OnInit {
  @ViewChild('toggle') toggle;

  private currentFileUpload: File;
  public shouldShow = false;
  @Input() canExportCharts: boolean;
  @Input() canImportCharts: boolean;
  @Input() canExportModelCharts: boolean;
  EXCEL_FILE_MAX_SIZE = 5;
  constructor(@Inject(ShowChartOfAccountsComponent) private showChartOfAccountsComponent: ShowChartOfAccountsComponent,
              private chartAccountService: ChartAccountService, private growlService: GrowlService,
              private translate: TranslateService, private router: Router, private swalWarrings: SwalWarring, private spinnerService: SpinnerService
  ) {
  }

  exportChartAccounts(): any {
    this.chartAccountService.getJavaGenericService().getEntityListHeaders(ChartOfAccountsConstant.CHARTS_EXPORT)
      .subscribe(data => {
        saveAs(data, this.translate.instant(ChartOfAccountsConstant.EXPORT_CHART_ACCOUNT_EXCEL_FILE_NAME));
      }, error => {
        this.growlService.ErrorNotification(this.translate.instant(SharedAccountingConstant.EXCEL_IMPORT_ERROR));
      });
  }

  exportModel(): any {
    this.chartAccountService.getJavaGenericService().getEntityListHeaders(ChartOfAccountsConstant.CHARTS_EXPORT_MODEL)
      .subscribe(data => {
        saveAs(data, this.translate.instant(ChartOfAccountsConstant.EXPORT_CHART_ACCOUNT_EXCEL_MODEL_FILE_NAME));
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
      alert(this.translate.instant(SharedAccountingConstant.EXCEL_FILE_MAX_SIZE_EXCEEDED, {maxSize : maxSize}));
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
    this.spinnerService.showLoader();
    this.chartAccountService.getJavaGenericService().saveEntity({
      'base64Content': base64Content,
      'name': file.name
    }, ChartOfAccountsConstant.CHARTS_IMPORT).subscribe(data => {

      this.spinnerService.hideLaoder();
      if (data.name) {
        this.swalWarrings.CreateSwal(SharedAccountingConstant.DO_YOU_WANT_TO_DOWNLOAD_AND_FIX_ERRORS,
          `${this.translate.instant(SharedAccountingConstant.EXCEL_IMPORT_ERROR)}`,
          SharedConstant.YES, SharedConstant.NO).then((result) => {
          if (result.value) {
            const linkSource = `data:${SharedAccountingConstant.EXCEL_MIME_TYPE};base64,${data.base64Content}`;
            const downloadLink = document.createElement('a');
            const fileName = this.translate.instant(ChartOfAccountsConstant.IMPORT_CHART_ACCOUNT_EXCEL_ERROR_FILE_NAME);
            downloadLink.href = linkSource;
            downloadLink.download = fileName;
            downloadLink.click();
          }
          this.currentFileUpload = undefined;
        });
      } else {
        this.currentFileUpload = undefined;
        this.growlService.successNotification(this.translate.instant(SharedAccountingConstant.SUCCESS_OPERATION));
        setTimeout(() => {
          window.location.reload();
        },  NumberConstant.ONE_HUNDRED);
      }
    }, () => {}, () => {
      this.spinnerService.hideLaoder();
    });
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
