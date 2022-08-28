import {
  Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewContainerRef, ViewEncapsulation, OnChanges, ViewChild, AfterViewChecked, ComponentRef
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';
import { SettlementConstant } from '../../../constant/payment/settlement.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { FinancialCommitmentNotBilledConstant } from '../../../constant/treasury/financial-commitment-not-billed.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { Currency } from '../../../models/administration/currency.model';
import { PaymentMethodEnumerator } from '../../../models/enumerators/payment-method.enum';
import { SettlementGapMethod, SettlementGapMethodEnumerator } from '../../../models/enumerators/settlement-gap-method.enum';
import { TiersTypeEnumerator } from '../../../models/enumerators/tiers-type.enum';
import { PaymentMethod } from '../../../models/payment-method/payment-method.model';
import { BankAccount } from '../../../models/shared/bank-account.model';
import { FileInfo } from '../../../models/shared/objectToSend';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { FormModalDialogService } from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { FileService } from '../../../shared/services/file/file-service.service';
import { ValidationService, digitsAfterComma } from '../../../shared/services/validation/validation.service';
import { AmountFormatService } from '../../services/amount-format.service';
import { ConfirmSettlementComponent } from '../confirm-settlement/confirm-settlement.component';
import { Tiers } from '../../../models/achat/tiers.model';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { FinancialCommitment } from '../../../models/sales/financial-commitment.model';
import { DocumentEnumerator, documentStatusCode } from '../../../models/enumerators/document.enum';
import { DeadLineDocumentService } from '../../../sales/services/dead-line-document/dead-line-document.service';
import {LocalStorageService} from '../../../login/Authentification/services/local-storage-service';
import { PaymentDropdownComponent } from '../../../shared/components/payment-dropdown/payment-dropdown.component';
import { TicketConstant } from '../../../constant/treasury/ticket.constant';
import { CashRegister } from '../../../models/treasury/cash-register.model';
import { SessionCashService } from '../../services/session-cash/session-cash.service';
import { SessionCash } from '../../../models/payment/session-cash.model';
import { Observable, Subject } from 'rxjs';
import { Settlement } from '../../../models/payment/settlement.model';
import { ModalDialogInstanceService } from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-add-settlement',
  templateUrl: './add-settlement.component.html',
  styleUrls: ['./add-settlement.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddSettlementComponent implements OnInit, OnChanges, AfterViewChecked {

  @ViewChild(PaymentDropdownComponent) paymentDropdown: PaymentDropdownComponent;
  /** Enumerators */
  public tiersTypeEnum = TiersTypeEnumerator;
  public paymentMethodEnum = PaymentMethodEnumerator;
  public methodEnumerator: SettlementGapMethodEnumerator = new SettlementGapMethodEnumerator();
  /** document Enumerator */
  documentEnumerator: DocumentEnumerator = new DocumentEnumerator();
  /** Inputs */
  @Input() tiersType;
  @Input() listFinancialCommitmentSelected;
  @Input() totalAmount;
  @Input() totalAmountWithholdingTax;
  @Input() selectedTiers: Tiers;
  @Input() selectedTiersFromPos: Tiers;
  @Input() tiersCurrency: Currency;
  @Input() companyWithholdingTax;
  @Input() listTicketsSelected;
  @Input() isForPos: boolean;
  @Input() paymentType;
  /** Output */
  @Output() savingDone = new EventEmitter();
  @Output() tiersSelectedChange = new EventEmitter();
  @Output() cancelButtonClicked = new EventEmitter();

  /** attributs */
  settlementFormGroup: FormGroup;
  varianceMethodFormGroup: FormGroup;
  filesInfos: Array<FileInfo> = new Array<FileInfo>();
  withHoldingTaxFileInfos: Array<FileInfo> = new Array<FileInfo>();
  gapMethodChoosen: SettlementGapMethod = this.methodEnumerator.NoGap;
  paymentMethod: PaymentMethod;
  selectedBankAccount: BankAccount;
  sessionCash: SessionCash;
  /** General config */
  language: string;

  /** dialog properties */
  dialogOptions: Partial<IModalDialogOptions<any>>;
  public data: any;

  // initialization
  totalAmountWithoutAssets = 0;
  totalAmountWithoutWithholdingTax = 0;
  totalAmountAssets = 0;
  varianceMethodSelected = false;
  isCertificateAutomaticallyGenerated = false;
  public financialCommitmentNotBilledConstant = FinancialCommitmentNotBilledConstant;
  public isModal = false ;

  public formatDate = this.translate.instant(SharedConstant.DATE_FORMAT);
  constructor(private fb: FormBuilder, private viewRef: ViewContainerRef,
    private swalWarrings: SwalWarring,
    private growlService: GrowlService,
    private validationService: ValidationService,
    private settlementService: DeadLineDocumentService,
    private formModalDialogService: FormModalDialogService,
    private translate: TranslateService,
    private fileService: FileService,
    private amountFormatService: AmountFormatService, private localStorageService: LocalStorageService,
    private sessionCashService: SessionCashService, private modalService: ModalDialogInstanceService, protected router: Router,) {
    this.language = this.localStorageService.getLanguage();
  }
  ngAfterViewChecked(): void {
    if(this.isForPos && this.paymentDropdown.paymentMethodDataSource && this.paymentType){
      let selectedPaymentMethod = this.paymentDropdown.paymentMethodDataSource.find(x => x.IdPaymentType === this.paymentType.Id);
      this.settlementFormGroup.controls.IdPaymentMethod.setValue(selectedPaymentMethod.Id);
      this.paymentDropdown.onSelect(selectedPaymentMethod.Id);
    }
  }

  ngOnInit() {
    this.createGapManagementFormGroup();
    this.data = Object.assign([], this.listFinancialCommitmentSelected);
    this.calculateAmounts();
    this.createFormGroup();
    this.updateControlsAfterChangingWithholdingTax();
    this.sessionCashService.getUserOpenedSession(this.localStorageService.getEmail()).subscribe(data =>{
      if(data.objectData){
        this.sessionCash = data.objectData;
        this.settlementFormGroup.controls.IdSessionCash.setValue(this.tiersType == this.tiersTypeEnum.Customer? this.sessionCash.Id : null);
        this.settlementFormGroup.controls.CashRegisterName.setValue(this.tiersType == this.tiersTypeEnum.Customer? this.sessionCash.IdCashRegisterNavigation.Name : '');
      }
    });
    if ((this.isForPos || this.tiersType == this.tiersTypeEnum.Supplier) && this.settlementFormGroup) {
      this.settlementFormGroup.controls.IdSessionCash.setValidators(null);
      this.settlementFormGroup.controls.IdSessionCash.updateValueAndValidity();
    }

  }

  public calculateAmounts() {
    const totalAssets = this.data.filter((x: FinancialCommitment) =>
      x.IdDocumentNavigation.DocumentTypeCode === DocumentEnumerator.SalesInvoiceAsset
      || x.IdDocumentNavigation.DocumentTypeCode === DocumentEnumerator.PurchaseAsset)
      .reduce((sum, current) => sum + current.RemainingAmountWithCurrency, 0);
    let totalInvoices = this.data.filter((x: FinancialCommitment) =>
      x.IdDocumentNavigation.DocumentTypeCode === DocumentEnumerator.SalesInvoices
      || x.IdDocumentNavigation.DocumentTypeCode === DocumentEnumerator.PurchaseInvoices)
      .reduce((sum, current) => sum + current.RemainingAmountWithCurrency, 0);
    this.totalAmountAssets = this.amountFormatService.format(this.tiersCurrency, totalAssets);
    totalInvoices = this.amountFormatService.format(this.tiersCurrency, totalInvoices);
    // totalAmount
    this.totalAmountWithoutWithholdingTax = this.amountFormatService.format(this.tiersCurrency,
      (this.totalAmount - this.totalAmountWithholdingTax ));
    this.totalAmountWithoutAssets = this.amountFormatService.format(this.tiersCurrency,
      totalInvoices + this.totalAmountWithholdingTax );
  }

  public createGapManagementFormGroup() {
    this.varianceMethodFormGroup = this.fb.group({
      PayPartially: [true],
      LossGap: [false],
      Advanced: [false],
      GainGap: [false],
      GapType: ['1']
    });
  }

  public closeForm() {
    this.cancelButtonClicked.emit(false);
  }

  /**
   * Method called when the item selection changed
   * @param total
   * @param WithholdingTax
   */
  public updateAmountsAndFormGroup() {
    this.data = Object.assign([], this.listFinancialCommitmentSelected);
    this.calculateAmounts();
    this.updateFormGroupValues();
    this.checkVarianceAndApplyValidity();
    // update Withholding Tax Control after calculating the WithholdingTax
    this.updateControlsAfterChangingWithholdingTax();
  }

  public updateControlsAfterChangingWithholdingTax() {
    // Change WithholdingTax value and validators
    this.settlementFormGroup.controls.WithholdingTax.setValue(this.getTheAmountFormatWithCurrencyPrecision(this.totalAmountWithholdingTax));
    this.settlementFormGroup.controls.WithholdingTax.setValidators([Validators.required,
    Validators.min(NumberConstant.ZERO), Validators.max(this.totalAmountWithholdingTax)]);
    this.settlementFormGroup.controls.WithholdingTax.updateValueAndValidity();
    // Change AmountToBePaidWithCurrency value & PaidAmountWithCurrency value and validators
    this.AmountToBePaidWithCurrency.setValue(this.getTheAmountFormatWithCurrencyPrecision(this.totalAmountWithoutWithholdingTax));
    this.PaidAmountWithCurrency.setValue(this.getTheAmountFormatWithCurrencyPrecision(this.totalAmountWithoutWithholdingTax));
    this.PaidAmountWithCurrency.setValidators([Validators.required,
    Validators.min(NumberConstant.ZERO),
    Validators.max(this.totalAmountWithoutWithholdingTax), digitsAfterComma(this.tiersCurrency ? this.tiersCurrency.Precision : 0)]);
    this.PaidAmountWithCurrency.updateValueAndValidity();

  }

  public initializesWithholdingTax() {
    this.settlementFormGroup.controls.WithholdingTax.setValue(this.getTheAmountFormatWithCurrencyPrecision(this.totalAmountWithholdingTax));
  }


  /**
   * Update the form group inputs when item selection changed
   */
  private updateFormGroupValues() {
    this.AmountWithCurrency.setValue(this.getTheAmountFormatWithCurrencyPrecision(this.totalAmountWithoutAssets));
    this.TotalAmountAssets.setValue(this.totalAmountAssets);
    this.AmountToBePaidWithCurrency.setValue(this.getTheAmountFormatWithCurrencyPrecision(this.totalAmountWithoutWithholdingTax));
    this.settlementFormGroup.controls.IdTiers.setValue(this.selectedTiers ? this.selectedTiers.Id : this.selectedTiersFromPos ? this.selectedTiersFromPos.Id : 0);
    this.settlementFormGroup.controls.IdCurrency.setValue(this.selectedTiers ? this.selectedTiers.IdCurrency : this.selectedTiersFromPos ? this.selectedTiersFromPos.Id : 0);
    this.settlementFormGroup.controls.IdPaymentMethod.setValue(this.paymentMethod ? this.paymentMethod.Id : undefined);
    this.PaidAmountWithCurrency.setValue(this.getTheAmountFormatWithCurrencyPrecision(this.totalAmountWithoutWithholdingTax));
    if(!this.isForPos){
      this.settlementFormGroup.controls.IdTiers.enable();
      this.settlementFormGroup.controls.IdPaymentMethod.enable();
      if(!this.paymentType){
        this.settlementFormGroup.controls.IdPaymentMethod.setValue(0);
        this.paymentDropdown.onSelect(0);
      }
    } else {
      this.settlementFormGroup.controls.IdTiers.disable();
      this.settlementFormGroup.controls.IdPaymentMethod.disable();
    }
  }

  getTheAmountFormatWithCurrencyPrecision(amount): string {
    let result = '0';
    if (amount > 0) {
      const leftPart = amount.toString().split('.')[0];
      let rigthPart = amount.toString().split('.')[1];
      if (rigthPart) {
        while (this.tiersCurrency && (rigthPart.length !== this.tiersCurrency.Precision)) {
          rigthPart = rigthPart + '0';
        }
        result = leftPart + '.' + rigthPart;
      } else {
        result = leftPart + '.';
        while (this.tiersCurrency && (result.split('.')[1].length !== this.tiersCurrency.Precision)) {
          result = result + '0';
        }
      }
    }
    return result;
  }

  createFormGroup() {
    this.settlementFormGroup = this.fb.group({
      Id: [0],
      Label: ['', [Validators.minLength(NumberConstant.ZERO),
      Validators.maxLength(NumberConstant.ONE_HUNDRED)]],
      Code: [''],
      SettlementReference: ['', [Validators.minLength(NumberConstant.ZERO),
      Validators.maxLength(NumberConstant.ONE_HUNDRED)]],
      Holder: [{value: this.selectedTiers ? this.selectedTiers.Name : this.selectedTiersFromPos? this.selectedTiersFromPos.Name : '', disabled : false}, [Validators.minLength(NumberConstant.ZERO),
      Validators.maxLength(NumberConstant.ONE_HUNDRED)]],
      IdTiers: [{value:this.selectedTiers ? this.selectedTiers.Id : this.selectedTiersFromPos? this.selectedTiersFromPos.Id : '', disabled:(this.isForPos || this.isModal)? true : false }],
      SettlementDate: [new Date(), [Validators.required]],
      IdPaymentMethod: [{value: '', disabled:this.isForPos? true : false}, [Validators.required]],
      AmountWithCurrency: [{
        value: this.getTheAmountFormatWithCurrencyPrecision(this.totalAmountWithoutAssets), disabled: true
      }],
      AmountToBePaidWithCurrency: [{
        value: this.getTheAmountFormatWithCurrencyPrecision(this.totalAmountWithoutWithholdingTax), disabled: true
      }],
      TotalAmountAssets: [{
        value: this.getTheAmountFormatWithCurrencyPrecision(this.totalAmountAssets), disabled: true
      }],
      IdCurrency: [{
        value: (this.selectedTiers ? this.selectedTiers.IdCurrency : this.selectedTiersFromPos ? this.selectedTiersFromPos.IdCurrency : ''), disabled: true
      }],
      PaidAmountWithCurrency: [{value : this.getTheAmountFormatWithCurrencyPrecision(this.totalAmount ? this.totalAmount : 0),
        disabled:false/*(this.isForPos || this.isModal)? true : false*/},[Validators.required, Validators.min(NumberConstant.ZERO), digitsAfterComma(this.tiersCurrency.Precision)]],
      WithholdingTax: [
        { value: this.getTheAmountFormatWithCurrencyPrecision(this.totalAmountWithholdingTax ? this.totalAmountWithholdingTax : 0) },
        [Validators.required, Validators.min(NumberConstant.ZERO)]
      ],
      CommitmentDate: [new Date()],
      IssuingBank: ['', [Validators.minLength(NumberConstant.ZERO),
      Validators.maxLength(NumberConstant.ONE_HUNDRED)]],
      IdBankAccount: [''],
      CertificateAutomaticallyGenerated: [],
      IdSessionCash: [''],
      CashRegisterName: [{value: '', disabled: true}]

    });
  }


  /**
   * Check variance and apply validity
   */
  checkVarianceAndApplyValidity() {
    const digits = this.tiersCurrency ? this.tiersCurrency.Precision : 0;
    this.PaidAmountWithCurrency.setValidators([Validators.required,
    Validators.min(NumberConstant.ZERO), digitsAfterComma(digits)]);
    this.PaidAmountWithCurrency.updateValueAndValidity();
  }

  getVariance() {
    return this.amountFormatService.format(this.tiersCurrency,
      this.PaidAmountWithCurrency.value - this.AmountToBePaidWithCurrency.value);
  }

  amountToBePaidWithCurrencyChanged($event) {
    const amountToBePaidWithCurrencyValue = this.amountFormatService.format(this.tiersCurrency,
      (this.totalAmount - this.totalAmountWithholdingTax));
    this.AmountToBePaidWithCurrency.setValue(this.getTheAmountFormatWithCurrencyPrecision(amountToBePaidWithCurrencyValue));
  }


  amountWithCurrencyChanged($event) {
    this.AmountWithCurrency.setValue(this.getTheAmountFormatWithCurrencyPrecision(this.totalAmountWithoutAssets));
  }

  paymentMethodChange($event) {
    this.paymentMethod = $event;
    if (this.paymentMethod && !this.paymentMethod.Immediate) {
      this.settlementFormGroup.controls.SettlementReference.setValidators([Validators.required, Validators.minLength(NumberConstant.ZERO),
      Validators.maxLength(NumberConstant.ONE_HUNDRED)]);
      this.settlementFormGroup.controls.CommitmentDate.setValidators([Validators.required]);
      this.settlementFormGroup.controls.Holder.setValidators([Validators.required, Validators.minLength(NumberConstant.ZERO),
      Validators.maxLength(NumberConstant.ONE_HUNDRED)]);
      if (this.tiersType === this.tiersTypeEnum.Customer) {
        this.settlementFormGroup.controls.IssuingBank.setValidators([Validators.required, Validators.minLength(NumberConstant.ZERO),
        Validators.maxLength(NumberConstant.ONE_HUNDRED)]);
      } else {
        this.settlementFormGroup.controls.IdBankAccount.setValidators([Validators.required]);
      }
    } else {
      this.settlementFormGroup.controls.SettlementReference.setValidators([]);
      this.settlementFormGroup.controls.CommitmentDate.setValidators([]);
      this.settlementFormGroup.controls.Holder.setValidators([]);
      if (this.tiersType === this.tiersTypeEnum.Customer) {
        this.settlementFormGroup.controls.IssuingBank.setValidators([Validators.required, Validators.minLength(NumberConstant.ZERO),
        Validators.maxLength(NumberConstant.ONE_HUNDRED)]);
        if ((this.paymentMethod && this.paymentMethod.Code === this.paymentMethodEnum.CashPayment) || !this.paymentMethod) {
          this.settlementFormGroup.controls.IssuingBank.setValidators([]);
        }
      } else {
        this.settlementFormGroup.controls.IdBankAccount.setValidators([Validators.required]);
        if ((this.paymentMethod && this.paymentMethod.Code === this.paymentMethodEnum.CashPayment) || !this.paymentMethod) {
          this.settlementFormGroup.controls.IdBankAccount.setValidators([]);
        }
      }
    }
    this.settlementFormGroup.controls.SettlementReference.updateValueAndValidity();
    this.settlementFormGroup.controls.CommitmentDate.updateValueAndValidity();
    this.settlementFormGroup.controls.Holder.updateValueAndValidity();
    this.settlementFormGroup.controls.IssuingBank.updateValueAndValidity();
    this.settlementFormGroup.controls.IdBankAccount.updateValueAndValidity();
  }

  OpenDialogForm() {
    if (this.settlementFormGroup.valid) {
      if (this.settlementFormGroup.controls.Label.value) {
        this.settlementFormGroup.controls.Label.setValue(this.settlementFormGroup.controls.Label.value.trim());
      }
      if (this.settlementFormGroup.controls.Holder.value) {
        this.settlementFormGroup.controls.Holder.setValue(this.settlementFormGroup.controls.Holder.value.trim());
      }
      if (this.settlementFormGroup.controls.IssuingBank.value) {
        this.settlementFormGroup.controls.IssuingBank.setValue(this.settlementFormGroup.controls.IssuingBank.value.trim());
      }
      if (this.settlementFormGroup.controls.SettlementReference.value) {
        this.settlementFormGroup.controls.SettlementReference.setValue(this.settlementFormGroup.controls.SettlementReference.value.trim());
      }
    }
    if (this.settlementFormGroup.valid && (this.listFinancialCommitmentSelected.length > 0 || this.listTicketsSelected.length > 0)) {
      const TITLE = FinancialCommitmentNotBilledConstant.GENERATE_SETTLEMENT;
      const data = {};
      data['listItemsSelected'] = this.listFinancialCommitmentSelected;
      data['settlementformGroup'] = this.settlementFormGroup;
      data['filesInfos'] = this.filesInfos;
      data['withHoldingTaxFileInfos'] = this.withHoldingTaxFileInfos;
      data['gapMethodChoosen'] = this.gapMethodChoosen;
      data['variance'] = this.getVariance();
      data['paymentMethod'] = this.paymentMethod;
      data['selectedBankAccount'] = this.selectedBankAccount;
      data['companyWithholdingTax'] = this.companyWithholdingTax;
      data['isForPos'] = this.isForPos;
      data['tiersType'] = this.tiersType;
      data['listSelectedTicket'] = this.listTicketsSelected;
      data['CashRegisterName'] = !this.isForPos && this.sessionCash ? this.sessionCash.IdCashRegisterNavigation.Name: "";
      this.formModalDialogService.openDialog(TITLE, ConfirmSettlementComponent,
        this.viewRef, this.refreshGrid.bind(this), data, true, SharedConstant.MODAL_DIALOG_SIZE_L);
    } else {
      if (!this.isForPos && this.listFinancialCommitmentSelected.length === 0) {
        this.growlService.warningNotification(this.translate
          .instant(this.financialCommitmentNotBilledConstant.AT_LEAST_ONE_FINANCIAL_COMMITMENT_MUST_BE_SELECTED));
      } else if (this.isForPos && this.listTicketsSelected.length === 0) {
        this.growlService.warningNotification(this.translate
          .instant(TicketConstant.AT_LEAST_ONE_TICKET_MUST_BE_SELECTED));
      } else {
        this.validationService.validateAllFormFields(this.settlementFormGroup);
      }
    }
  }

  refreshGrid(data) {
    // In case of adding new settlement => do refresh
    if (data.refreshGrid) {
      this.savingDone.emit(true);
      if (this.withHoldingTaxFileInfos.length === 0 && data.generatedSettlement &&
        data.generatedSettlement.WithholdingTax > 0 && this.isCertificateAutomaticallyGenerated) {
        // if user does not attached the file => generate withholding tax report
        this.settlementService.ReGenerateWithholdingTaxCertification(data.generatedSettlement.Id).subscribe(
          res => {
            this.fileService.downLoadFile(res.WithholdingTaxObservationsFilesInfo[0]);
          });
      }
    }
  }

  /**
   * If the financial commitment selectd list is not empty renitia
   * @param $event
   */
  emitSupplier($event) {
    if (this.listFinancialCommitmentSelected.length) {
      return new Promise(() => {
        setTimeout(() => {
          this.handleChangeSupplier($event);
        }, 200);
      });
    } else {
      this.selectedTiers = $event.selectedTiers;
      this.tiersSelectedChange.emit(this.selectedTiers);
    }
  }

  handleChangeSupplier($event): void {
    this.swalWarrings.CreateSwal(this.translate.instant(FinancialCommitmentNotBilledConstant.SELECTED_DOCUMENTS_WILL_BE_DESELECTED),
      this.translate.instant(FinancialCommitmentNotBilledConstant.ARE_YOU_SURE),
      this.translate.instant(FinancialCommitmentNotBilledConstant.VALIDATION_CONFIRM),
      this.translate.instant(FinancialCommitmentNotBilledConstant.CANCEL)).then((result) => {
        if (result.value) {
          this.selectedTiers = $event.selectedTiers;
          this.listFinancialCommitmentSelected.splice(NumberConstant.ZERO, this.listFinancialCommitmentSelected.length);
          this.tiersSelectedChange.emit(this.selectedTiers);
          this.settlementFormGroup.controls.AmountWithCurrency.setValue(0);
          this.settlementFormGroup.controls.PaidAmountWithCurrency.setValue(0);
          this.settlementFormGroup.controls.AmountToBePaidWithCurrency.setValue(0);
        } else {
          this.settlementFormGroup.controls.IdTiers.setValue(this.selectedTiers ? this.selectedTiers.Id : undefined);
        }
      });
  }

  lossGapCheck() {
    this.PayPartially.setValue(!this.PayPartially.value);
    this.LossGap.setValue(!this.LossGap.value);
    if (this.LossGap.value) {
      this.gapMethodChoosen = this.methodEnumerator.LossGap;
    } else {
      this.gapMethodChoosen = this.methodEnumerator.NoGap;
    }
  }

  changeBankAccount($event) {
    this.selectedBankAccount = $event;
  }

  gainGapCheck() {
    this.Advanced.setValue(!this.Advanced.value);
    this.GainGap.setValue(!this.GainGap.value);
    this.gapMethodChoosen = this.GainGap.value ? this.methodEnumerator.GainGap : this.methodEnumerator.NoGap;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes[SettlementConstant.SELECTED_TIERS]) {
      this.selectedTiers = changes[SettlementConstant.SELECTED_TIERS].currentValue;
      if (this.settlementFormGroup) {
        this.settlementFormGroup.controls.IdTiers.setValue(this.selectedTiers ? this.selectedTiers.Id : '');
        this.settlementFormGroup.controls.Holder.setValue(this.selectedTiers ? this.selectedTiers.Name : '');
        this.settlementFormGroup.controls.IdCurrency.setValue(this.selectedTiers ? this.selectedTiers.IdCurrency : '');
      }
    }
    if (changes[SettlementConstant.SELECTED_POS_TIERS]) {
      this.selectedTiersFromPos = changes[SettlementConstant.SELECTED_POS_TIERS].currentValue;
      if (this.settlementFormGroup) {
        this.settlementFormGroup.controls.IdTiers.setValue(this.selectedTiersFromPos ? this.selectedTiersFromPos.Id : '');
        this.settlementFormGroup.controls.Holder.setValue(this.selectedTiersFromPos ? this.selectedTiersFromPos.Name : '');
        this.settlementFormGroup.controls.IdCurrency.setValue(this.selectedTiersFromPos ? this.selectedTiersFromPos.IdCurrency : '');
      }
    }
    if (changes[SettlementConstant.IS_FOR_POS]) {
      if(this.settlementFormGroup){
        if (this.isForPos) {
          this.settlementFormGroup.controls.IdSessionCash.setValidators(null);
          this.settlementFormGroup.controls.IdSessionCash.updateValueAndValidity();
        }
      }
    }
    if (changes[SettlementConstant.TIERS_CURRENCY]) {
      this.tiersCurrency = changes[SettlementConstant.TIERS_CURRENCY].currentValue;
    }
    if (changes[SettlementConstant.TOTAL_AMOUNT] || changes[SettlementConstant.TOTAL_AMOUNT_WITHHOLDING_TAX]) {
      this.totalAmount = changes[SettlementConstant.TOTAL_AMOUNT] ?
        changes[SettlementConstant.TOTAL_AMOUNT].currentValue : this.totalAmount;
      this.totalAmountWithholdingTax = changes[SettlementConstant.TOTAL_AMOUNT_WITHHOLDING_TAX] ?
        changes[SettlementConstant.TOTAL_AMOUNT_WITHHOLDING_TAX].currentValue : this.totalAmountWithholdingTax;
      if (this.settlementFormGroup) {
        this.updateAmountsAndFormGroup();
      }
    }
  }
  /** Getters */
  get PayPartially(): FormControl {
    return this.varianceMethodFormGroup.get('PayPartially') as FormControl;
  }
  get LossGap(): FormControl {
    return this.varianceMethodFormGroup.get('LossGap') as FormControl;
  }
  get Advanced(): FormControl {
    return this.varianceMethodFormGroup.get('Advanced') as FormControl;
  }
  get GainGap(): FormControl {
    return this.varianceMethodFormGroup.get('GainGap') as FormControl;
  }
  get PaidAmountWithCurrency(): FormControl {
    return this.settlementFormGroup.controls.PaidAmountWithCurrency as FormControl;
  }
  get CertificateAutomaticallyGenerated(): FormControl {
    return this.settlementFormGroup.controls.CertificateAutomaticallyGenerated as FormControl;
  }
  get WithholdingTax(): FormControl {
    return this.settlementFormGroup.controls.WithholdingTax as FormControl;
  }
  get AmountToBePaidWithCurrency(): FormControl {
    return this.settlementFormGroup.controls.AmountToBePaidWithCurrency as FormControl;
  }
  get AmountWithCurrency(): FormControl {
    return this.settlementFormGroup.controls.AmountWithCurrency as FormControl;
  }
  get TotalAmountAssets(): FormControl {
    return this.settlementFormGroup.controls.TotalAmountAssets as FormControl;
  }

  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.dialogOptions = options;
    this.companyWithholdingTax  = options.data.companyWithholdingTax;
    this.tiersType = options.data.tiersType;
    this.tiersCurrency = options.data.tiersCurrency;
    this.selectedTiers = options.data.selectedTiers;
    this.isForPos =  options.data.isForPos ;
    this.totalAmount =  options.data.totalAmount ;
    this.totalAmountWithholdingTax = options.data.totalAmountWithholdingTax ;
    this.listFinancialCommitmentSelected =  options.data.listFinancialCommitmentSelected ;
    this.isModal = options.data.isModal ; 
  }
  public ValidateDocAndGenerateSettlement(){
    if(this.settlementFormGroup.valid){
      var settlementToGenerate = new Settlement();
      settlementToGenerate = this.settlementFormGroup.getRawValue();
      if(this.isForPos){
        settlementToGenerate.IdSessionCash = null;
      }
      const commitmentDate = settlementToGenerate.CommitmentDate;
      settlementToGenerate.CommitmentDate = new Date(Date.UTC(commitmentDate.getFullYear(),
        commitmentDate.getMonth(), commitmentDate.getDate()));
      const settlementDate = settlementToGenerate.SettlementDate;
      settlementToGenerate.SettlementDate = new Date(Date.UTC(settlementDate.getFullYear(),
        settlementDate.getMonth(), settlementDate.getDate()));
      settlementToGenerate.ObservationsFilesInfo = this.filesInfos;
      settlementToGenerate.WithholdingTaxObservationsFilesInfo = this.withHoldingTaxFileInfos;
      settlementToGenerate.AmountWithCurrency = this.settlementFormGroup.controls.PaidAmountWithCurrency.value;
      var idDoc ;
      if ( this.dialogOptions && this.dialogOptions.data && this.dialogOptions.data.listFinancialCommitmentSelected ){
        idDoc = this.dialogOptions.data.listFinancialCommitmentSelected.Id;
      }
      settlementToGenerate.IsDepositSettlement = true;
      this.settlementService.validateDocumentAndGenerateSettlemnt(settlementToGenerate, idDoc, documentStatusCode.Valid).subscribe( data =>{
        const url = 'main/sales/invoice/show/';
        this.router.navigateByUrl(url.concat(idDoc + '/' + 6));
        this.dialogOptions.onClose();
        this.modalService.closeAnyExistingModalDialog();
      });
    }
  }
  }
