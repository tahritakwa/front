import { Component,  ElementRef, OnInit, ViewChild, ComponentRef} from '@angular/core';

import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ComboBoxComponent} from '@progress/kendo-angular-dropdowns';
import { AccountingConfigurationService } from '../../services/configuration/accounting-configuration.service';
import { IModalDialogOptions, IModalDialog } from 'ngx-modal-dialog';
import { Subject } from 'rxjs';
import { ModalDialogInstanceService } from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import { ImportDocumentService } from '../../services/import-document/import-document.service';
import { TranslateService } from '@ngx-translate/core';
import { ReportingService } from '../../services/reporting/reporting.service';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { ImportDocumentConstants } from '../../../constant/accounting/import-document.constant';
import { ReportingConstant } from '../../../constant/accounting/reporting.constant';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { ValidationService } from '../../../shared/services/validation/validation.service';

@Component({
  selector: 'app-select-financial-account',
  templateUrl: './select-financial-account.component.html',
  styleUrls: ['./select-financial-account.component.scss']
})
export class SelectFinancialAccountComponent implements OnInit {

  @ViewChild('labelInput') labelInput: ElementRef;
  @ViewChild('planParentInput') planParenInput: ComboBoxComponent;

  options: Partial<IModalDialogOptions<any>>;
  reference: ComponentRef<IModalDialog>;
  public closeDialogSubject: Subject<any>;

  public financialAccountFormGroup: FormGroup;
  public bankAccounts = [];
  public cofferAccounts = [];
  public contentType: any;
  public user: any;
  public authorization: any;
  public displayBankAccounts: boolean;
  public displayCofferAccounts: boolean;

  constructor(private fb: FormBuilder, private growlService: GrowlService,
    private modalService: ModalDialogInstanceService, private translate: TranslateService,
    private importDocumentService: ImportDocumentService,  private reportService: ReportingService,
    private validationService: ValidationService) {
  }

  private createFinancialAccountFormGroup() {
    return this.fb.group({
      bankIdAccountingAccount: [{value: '', disabled: !this.displayBankAccounts}, [Validators.required]],
      cofferAccountId: [{value: '', disabled: !this.displayCofferAccounts},[Validators.required]]
    });
  }

  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.options = options;
    this.bankAccounts = options.data.bankAccounts;
    this.cofferAccounts = options.data.cofferAccounts;
    this.closeDialogSubject = options.closeDialogSubject;
    this.displayBankAccounts = options.data.displayBankAccounts;
    this.displayCofferAccounts = options.data.displayCofferAccounts;
  }

  setConfigurationServerSide() {
    this.reportService.getJavaGenericService().getData(ReportingConstant.CONFIGURATION_COOKIES_URL)
      .subscribe(data => {
        this.contentType =  data[NumberConstant.ZERO];
        this.user = data[NumberConstant.ONE];
        this.authorization = data[NumberConstant.TWO];
      });
  }

  validateSetllementsAndCloseModal() {
    if (this.financialAccountFormGroup.valid) {
      this.financialAccountFormGroup.updateValueAndValidity();
      let settlementsToImportDtos = {
        "cofferAccountId": this.financialAccountFormGroup.value.cofferAccountId,
        "bankAccountId": this.financialAccountFormGroup.value.bankIdAccountingAccount,
        "fiscalYearId": this.options.data.fiscalYearId,
        "regulationsDtos": this.options.data.regulationsDtos
      }
      this.importDocumentService.getJavaGenericService().sendData(`importRegulations?contentType=${this.contentType}&user=${this.user}&authorization=${this.authorization}`,
      settlementsToImportDtos).subscribe(() => {
       this.growlService.InfoNotification(this.translate.instant(ImportDocumentConstants.BILL_IMPORTED_SUCCESSFULLY));
     }, error => {
     },
       () => {
        this.options.onClose();
        this.modalService.closeAnyExistingModalDialog();
       });
    } else {
      this.validationService.validateAllFormFields(this.financialAccountFormGroup);
    }
  }

  ngOnInit() {
  //  this.getListAccount();
    this.financialAccountFormGroup = this.createFinancialAccountFormGroup();
    this.setConfigurationServerSide();
  }
}
