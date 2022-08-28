import {Component, ComponentRef, OnInit, ViewChild} from '@angular/core';
import {IModalDialog, IModalDialogOptions} from 'ngx-modal-dialog';
import {GenericAccountingService} from '../../services/generic-accounting.service';
import {DocumentAccountService} from '../../services/document-account/document-account.service';
import {TranslateService} from '@ngx-translate/core';
import {ValidationService} from '../../../shared/services/validation/validation.service';
import {GrowlService} from '../../../../COM/Growl/growl.service';
import {ModalDialogInstanceService} from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AccountsDropdownComponent} from '../../../shared/components/accounts-dropdown/accounts-dropdown.component';
import {DocumentAccountConstant} from '../../../constant/accounting/document-account.constant';
import {SharedAccountingConstant} from '../../../constant/accounting/sharedAccounting.constant';


@Component({
  selector: 'app-generate-document-account-from-amortization',
  templateUrl: './generate-document-account-from-amortization.component.html',
  styleUrls: ['./generate-document-account-from-amortization.component.scss']
})
export class GenerateDocumentAccountFromAmortization implements OnInit, IModalDialog {

  constructor(private genericAccountingService: GenericAccountingService, private documentAccountService: DocumentAccountService,
    private translate: TranslateService,
    private validationService: ValidationService, private growlService: GrowlService,
    private modalService: ModalDialogInstanceService) {
  }

  public generateDocumentAccountForm: FormGroup;

  public journalFiltredList: any;

  public optionDialog: Partial<IModalDialogOptions<any>>;

  public currentFiscalYear: string;

  public dotationAmortizationAccounts = [];

  @ViewChild(AccountsDropdownComponent) accountsDropDownComponent;

  showSpinner = false;

  /**
 * initialize dialog
 * @param reference
 * @param options
 */

  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.optionDialog = options;
    this.dotationAmortizationAccounts = options.data.dotationAmortizationAccounts;
  }

  initGenerateDocumentAccountForm() {
    this.generateDocumentAccountForm = new FormGroup({
      'journal': new FormControl('', Validators.required),
      'dotationAmortizationAccount': new FormControl('', Validators.required),
    }
    );
  }


  initJournalFilteredList() {
    this.genericAccountingService.getJournalList().then((journalList: any) => {
      this.journalFiltredList = journalList.slice(0);
    });
  }

  confirmGeneration() {
    if (this.generateDocumentAccountForm.valid) {
      this.documentAccountService.getJavaGenericService().sendData(DocumentAccountConstant.GENERATE_DOCUMENT_ACCOUNT_FROM_AMORIZATION +
        `?fiscalYearId=${this.optionDialog.data.currentFiscalYear.id}&isDetailedGeneration=${this.optionDialog.data.isDetailedGeneration}
        &journalId=${this.generateDocumentAccountForm.value.journal}&dotationAmortizationAccount=${this.generateDocumentAccountForm.value.dotationAmortizationAccount}`)
        .subscribe(data => {
          this.growlService.successNotification(this.translate.instant(SharedAccountingConstant.SUCCESS_OPERATION));
          this.growlService.InfoNotification(this.translate.instant(SharedAccountingConstant.DOCUMENT_ACCOUNT_GENERATED));
          this.modalService.closeAnyExistingModalDialog();
        }, () => {
        }, () => {
          this.modalService.closeAnyExistingModalDialog();
        });
    } else {
      this.validationService.validateAllFormFields(this.generateDocumentAccountForm);
    }
  }

  ngOnInit() {
    this.initJournalFilteredList();
    this.initGenerateDocumentAccountForm();
  }

}
