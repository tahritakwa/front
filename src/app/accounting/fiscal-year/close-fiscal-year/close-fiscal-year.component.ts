import {Component, ComponentRef, OnInit} from '@angular/core';
import {IModalDialog, IModalDialogOptions} from 'ngx-modal-dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ValidationService} from '../../../shared/services/validation/validation.service';
import {ModalDialogInstanceService} from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import {GrowlService} from '../../../../COM/Growl/growl.service';
import {TranslateService} from '@ngx-translate/core';
import {FiscalYearConstant} from '../../../constant/accounting/fiscal-year.constant';
import {SharedAccountingConstant} from '../../../constant/accounting/sharedAccounting.constant';
import {DatePipe} from '@angular/common';
import {Operation} from '../../../../COM/Models/operations';
import {FiscalYearService} from '../../services/fiscal-year/fiscal-year.service';
import {ActivatedRoute, Router} from '@angular/router';
import { SharedConstant } from '../../../constant/shared/shared.constant';
@Component({
  selector: 'app-close-fiscal-year',
  templateUrl: './close-fiscal-year.component.html',
  styleUrls: ['./close-fiscal-year.component.scss']
})
export class CloseFiscalYearComponent implements OnInit {


  public minStartDate: Date = new Date();
  public maxEndDate: Date = new Date();
  chooseClosingDateForm: FormGroup;
  public formatDate = this.translate.instant(SharedConstant.DATE_FORMAT);

  public optionDialog: Partial<IModalDialogOptions<any>>;
  constructor(
    private formBuilder: FormBuilder,
    private validationService: ValidationService,
    private datePipe: DatePipe,
    private modalService: ModalDialogInstanceService,
    private growlService: GrowlService,
    private fiscalYearService: FiscalYearService,
    private router: Router,
    public translate: TranslateService
  ) { }

  ngOnInit() {
    if (this.optionDialog.data['id']) {
      this.createChooseClosingDateForm(this.optionDialog.data);
    }
  }
  /**
   * initialize dialog
   * @param reference
   * @param options
   */
  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.optionDialog = options;
  }

  private createChooseClosingDateForm(item): void {

    this.minStartDate = new Date(item.startDate);
    this.maxEndDate = new Date(item.endDate);

    this.chooseClosingDateForm = this.formBuilder.group({
      startDate: [{value: this.minStartDate,  disabled: true} , [Validators.required]],
      endDate: [this.maxEndDate , [Validators.required]]
    });
  }

  close() {
    if (this.chooseClosingDateForm.valid) {
      const endDate = this.datePipe.transform(this.chooseClosingDateForm.getRawValue().endDate, SharedAccountingConstant.YYYY_MM_DD_HH_MM_SS);
      this.fiscalYearService.getJavaGenericService().callService(Operation.POST,
        `${FiscalYearConstant.FISCAL_YEAR_CLOSE_CONTROLLER_URL}/${this.optionDialog.data['id']}` +
        `?&endDate=${endDate}`).subscribe(data => {
        this.optionDialog.onClose();
        this.modalService.closeAnyExistingModalDialog();
        if (data.closing === true) {
          this.growlService.InfoNotification(this.translate.instant(FiscalYearConstant.FISCAL_YEAR_JOURNAL_CLOSED));
        }
        this.growlService.successNotification(this.translate.instant(SharedAccountingConstant.SUCCESS_OPERATION));
        
      }, err => {
        this.growlService.ErrorNotification(this.translate.instant(SharedAccountingConstant.FAILURE_OPERATION));
      });
      this.router.navigateByUrl(FiscalYearConstant.LIST_FISCAL_YEARS_URL);
    } else {
      this.validationService.validateAllFormFields(this.chooseClosingDateForm);
    }
  }
}
