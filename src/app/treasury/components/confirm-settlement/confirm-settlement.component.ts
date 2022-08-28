import { Component, OnInit, Input, ComponentRef, HostListener } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IModalDialogOptions, IModalDialog } from 'ngx-modal-dialog';
import { FormModalDialogService } from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { ModalDialogInstanceService } from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import { FileInfo } from '../../../models/shared/objectToSend';
import { IntermediateSettlementGeneration } from '../../../models/payment/intermediate-settlement-generation.model';
import { CustomerOutstandingService } from '../../services/customer-outstanding.service';
import { ValidationService } from '../../../shared/services/validation/validation.service';
import { PaymentMethod } from '../../../models/payment-method/payment-method.model';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { Currency } from '../../../models/administration/currency.model';
import { TiersTypeEnumerator } from '../../../models/enumerators/tiers-type.enum';
import { BankAccount } from '../../../models/shared/bank-account.model';
import { PaymentMethodEnumerator } from '../../../models/enumerators/payment-method.enum';
import { Tiers } from '../../../models/achat/tiers.model';
import { SettlementGapMethodEnumerator } from '../../../models/enumerators/settlement-gap-method.enum';
import { TranslateService } from '@ngx-translate/core';
import { KeyboardConst } from '../../../constant/keyboard/keyboard.constant';
import { HttpStatusCodes } from '../../../../COM/services/http-status-codes';
import { LanguageService } from '../../../shared/services/language/language.service';
import {LocalStorageService} from '../../../login/Authentification/services/local-storage-service';
import { UserCurrentInformationsService } from '../../../shared/services/utility/user-current-informations.service';
import { FileService } from '../../../shared/services/file/file-service.service';
import { SettlementConstant } from '../../../constant/payment/settlement.constant';
import { Settlement } from '../../../models/payment/settlement.model';
import { DeadLineDocumentService } from '../../../sales/services/dead-line-document/dead-line-document.service';

@Component({
  selector: 'app-confirm-settlement',
  templateUrl: './confirm-settlement.component.html',
  styleUrls: ['./confirm-settlement.component.scss']
})
export class ConfirmSettlementComponent implements OnInit {

  /** Enumerators */
  public tiersTypeEnum = TiersTypeEnumerator;
  paymentMethodEnum = PaymentMethodEnumerator;
  public methodEnumerator: SettlementGapMethodEnumerator = new SettlementGapMethodEnumerator();

  tiersType;
  settlementFormGroup: FormGroup;
  paymentMethod: PaymentMethod;
  usedCurrency: Currency;
  tiersAssociated: Tiers;
  selectedBankAccount: BankAccount;
  settlement;
  bankAccount: BankAccount;
  gapMessage: string;
  gapMethodChoosen;
  variance = 0;
  withholdingTax = 0;
  /** General config */
  language: string;
  // formatDate
  dateFormat = this.translateService.instant(SharedConstant.DATE_FORMAT);

  companyWithholdingTax = false;

  // Files
  public filesInfos: Array<FileInfo> = new Array<FileInfo>();
  public withHoldingTaxFileInfos: Array<FileInfo> = new Array<FileInfo>();

  selectedCommitments = [];
  selectedTicket = [];
  isForPos : boolean;
  cashRegisterName: string;
  /** dialog properties */
  dialogOptions: Partial<IModalDialogOptions<any>>;

  constructor(private modalService: ModalDialogInstanceService,
    private validationService: ValidationService, private customerOutstandingService: CustomerOutstandingService,
    private translateService: TranslateService, private localStorageService: LocalStorageService, public fileService: FileService,
    public settlementService: DeadLineDocumentService) {
    this.language = this.localStorageService.getLanguage();
  }

  ngOnInit() {
  }

  /**
   * Inialise Modal
   * @param reference
   * @param options
   */
  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.dialogOptions = options;
    // selected Items
    this.selectedCommitments = Object.assign([], this.dialogOptions.data.listItemsSelected);
    this.selectedTicket = Object.assign([], this.dialogOptions.data.listSelectedTicket);
    this.isForPos = this.dialogOptions.data.isForPos;
    this.usedCurrency = this.isForPos? this.selectedTicket[0].IdUsedCurrencyNavigation : this.selectedCommitments[0].IdCurrencyNavigation;
    this.tiersAssociated = this.isForPos? this.selectedTicket[0].IdTiersNavigation : this.selectedCommitments[0].IdTiersNavigation;
    // files Infos
    this.filesInfos = this.dialogOptions.data.filesInfos;
    this.withHoldingTaxFileInfos = this.dialogOptions.data.withHoldingTaxFileInfos;
    // FormGroups
    this.settlementFormGroup = this.dialogOptions.data.settlementformGroup;
    this.settlement = this.settlementFormGroup.getRawValue();
    this.variance = this.dialogOptions.data.variance;
    this.selectedBankAccount = this.dialogOptions.data.selectedBankAccount;
    this.gapMethodChoosen = this.dialogOptions.data.gapMethodChoosen;
    this.companyWithholdingTax = this.dialogOptions.data.companyWithholdingTax;
    this.cashRegisterName = this.dialogOptions.data.CashRegisterName;
    this.tiersType = this.dialogOptions.data.tiersType;
    if (this.variance) {
      this.checkGapMessage();
    }
    this.paymentMethod = this.dialogOptions.data.paymentMethod;
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.key === KeyboardConst.ENTER) {
      this.save();
    }
  }

  checkGapMessage() {
    let message = '';
    switch (this.gapMethodChoosen) {
      case this.methodEnumerator.LossGap: {
        message = 'LOSS_MESSAGE_EXPLICATION';
        break;
      }
      case this.methodEnumerator.GainGap: {
        message = 'GAIN_MESSAGE_EXPLICATION';
        break;
      }
      case this.methodEnumerator.NoGap: {
        message = 'PAY_PARTIALLY_MESSAGE_EXPLICATION';
        break;
      }
    }
    this.gapMessage = `${this.translateService.instant(message)}`;
    this.gapMessage = this.gapMessage.replace('{AMOUNT}', this.variance.toString());
    this.gapMessage = this.gapMessage.replace('{CURRENCY}', this.usedCurrency.Code);
  }

  prepareSettlementInfo(): IntermediateSettlementGeneration {
    const settlementToGenerate = new IntermediateSettlementGeneration();
    settlementToGenerate.Settlement = this.settlementFormGroup.getRawValue();
    if(this.isForPos){
      settlementToGenerate.Settlement.IdSessionCash = null;
    }
    // Change Date To UTC
    const commitmentDate = settlementToGenerate.Settlement.CommitmentDate;
    settlementToGenerate.Settlement.CommitmentDate = new Date(Date.UTC(commitmentDate.getFullYear(),
      commitmentDate.getMonth(), commitmentDate.getDate()));
    const settlementDate = settlementToGenerate.Settlement.SettlementDate;
    settlementToGenerate.Settlement.SettlementDate = new Date(Date.UTC(settlementDate.getFullYear(),
      settlementDate.getMonth(), settlementDate.getDate()));
    settlementToGenerate.Settlement.ObservationsFilesInfo = this.filesInfos;
    settlementToGenerate.Settlement.WithholdingTaxObservationsFilesInfo = this.withHoldingTaxFileInfos;
    settlementToGenerate.Settlement.AmountWithCurrency = this.settlementFormGroup.controls.PaidAmountWithCurrency.value;
    settlementToGenerate.GapValue = Math.abs(this.variance);
    settlementToGenerate.SelectedFinancialCommitment = this.selectedCommitments;
    settlementToGenerate.GapManagementMethod = this.gapMethodChoosen;
    settlementToGenerate.SelectedTicket = this.selectedTicket;
    return settlementToGenerate;
  }

  /**
  * Confirm settlement and send the model
  */
  save() {
    if (this.settlementFormGroup.valid) {
      const objectToSave: IntermediateSettlementGeneration = this.prepareSettlementInfo();
      this.customerOutstandingService.addSettlement(objectToSave, this.isForPos).subscribe((res) => {
        if (res && res.customStatusCode) {
          // in case of error
          if (res.customStatusCode === HttpStatusCodes.deletedFinancialCommitments
            || res.customStatusCode === HttpStatusCodes.selectedFinancialCommitmentsHasBeenChanged) {
            this.closeAndRefreshGrid();
          }
        } else {
          // in case of success
          this.dialogOptions.data['generatedSettlement'] = res;
          this.printSettlementReport(res.Id);
          this.closeAndRefreshGrid();
        }
      }
      );
    } else {
      this.validationService.validateAllFormFields(this.settlementFormGroup);
    }

  }
  closeAndRefreshGrid() {
    this.dialogOptions.data['refreshGrid'] = true;
    this.dialogOptions.onClose();
    this.modalService.closeAnyExistingModalDialog();
  }
  public printSettlementReport(id: number){
    if(id){
      const params = {
        report_SettlementId: id
      };
      var documentName;
      if(this.tiersType == this.tiersTypeEnum.Supplier)
      {
         documentName = this.translateService.instant(SettlementConstant.SUPPLIER_SETTLEMENT)
      }else {
         documentName = this.translateService.instant(SettlementConstant.CLIENT_SETTLEMENT)
      }
      const dataToSend = {
        'reportName' : "Settlement",
        'documentName' : documentName,
        'reportFormatName' : 'pdf',
        'printCopies' : 1,
        'PrintType' : -1,
        'reportparameters' : params
      };
      this.settlementService.downloadJasperReport(dataToSend).subscribe(
        res => {
          this.fileService.downLoadFile(res.objectData);
        });
    }
  }
}
