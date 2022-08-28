import { Component, ComponentRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DataResult, State } from '@progress/kendo-data-query';
import { IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';
import { ModalDialogInstanceService } from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import { Subject } from 'rxjs/Subject';
import { TreasuryConstant } from '../../../constant/treasury/treasury.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { Currency } from '../../../models/administration/currency.model';
import { DocumentEnumerator } from '../../../models/enumerators/document.enum';
import { PaymentMethodEnumerator } from '../../../models/enumerators/payment-method.enum';
import { PaymentStatusEnumerator } from '../../../models/enumerators/payment-status.enum';
import { FileService } from '../../../shared/services/file/file-service.service';
import { SettlementConstant } from '../../../constant/payment/settlement.constant';
import { TiersTypeEnumerator } from '../../../models/enumerators/tiers-type.enum';
import { FileInfo } from '../../../models/shared/objectToSend';
import { DeadLineDocumentService } from '../../../sales/services/dead-line-document/dead-line-document.service';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { ValidationService } from '../../../shared/services/validation/validation.service';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { DocumentUtilityService } from '../../services/document-utility.service';
import {LocalStorageService} from '../../../login/Authentification/services/local-storage-service';
import { SharedConstant } from '../../../constant/shared/shared.constant';

@Component({
  selector: 'app-pop-up-settlement-update-dispose',
  templateUrl: './pop-up-settlement-update-dispose.component.html',
  styleUrls: ['./pop-up-settlement-update-dispose.component.scss']
})
export class PopUpSettlementUpdateDisposeComponent implements OnInit {

  language: string;
  settlementFormGroup: FormGroup;
  dialogOptions: Partial<IModalDialogOptions<any>>;
  options: Partial<IModalDialogOptions<any>>;
  settlement: any;
  variance = false;
  isImmediatePaymentMethod = false;
  public closeDialogSubject: Subject<any>;
  public documentType = DocumentEnumerator;
  public paymentMethodEnum = PaymentMethodEnumerator;
  public tiersTypeEnum = TiersTypeEnumerator;
  tiersType: any;
  gridData: DataResult;
  public FilesInfos: Array<Array<FileInfo>> = new Array<Array<FileInfo>>();
  withHoldingTaxFileInfos: Array<FileInfo> = new Array<FileInfo>();
  public isFileInfo = true;
  public isUpdate = false;
  public paymentStatusEnum = PaymentStatusEnumerator;
  companyWithholdingTax = false;
  isBankPaymentMethod = false;
  showButtons = false;

  columnsConfig: ColumnSettings[] = [
    {
      field: TreasuryConstant.FINANCIAL_COMMITMENT_TYPE,
      title: TreasuryConstant.TYPE,
      tooltip: TreasuryConstant.TYPE_OF_FINANCIAL_COMMITMENT,
      filterable: true,
    },
    {
      field: TreasuryConstant.CODE_DOCUMENT,
      title: TreasuryConstant.CODE_BILL_TITLE,
      tooltip: TreasuryConstant.CODE_BILL_TITLE,
      filterable: true,
    },
    {
      field: TreasuryConstant.CODE_FINANCIAL_COMMITMENT_FROM_SETTLEMENT,
      title: TreasuryConstant.FINANCIAL_COMMITMENT_CODE_TITLE,
      tooltip: TreasuryConstant.FINANCIAL_COMMITMENT_CODE_TITLE,
      filterable: true,
    },
    {
      field: TreasuryConstant.AMOUNT_WITH_CURRENCY,
      title: TreasuryConstant.AMOUNTTTC,
      tooltip: TreasuryConstant.TOTAL_AMOUNT_TO_BE_PAID,
      filterable: true,
    },
    {
      field: TreasuryConstant.AMOUNT_WITHOUT_WITHHOLDING_TAX_WITH_CURRENCY,
      title: TreasuryConstant.AMOUNT_TO_BE_PAID,
      tooltip: TreasuryConstant.AMOUNT_TO_BE_PAID,
      filterable: true,
    },
    {
      field: TreasuryConstant.ASSIGNED_AMOUNT_WITH_CURRENCY,
      title: TreasuryConstant.ASSIGNED_AMOUNT,
      tooltip: TreasuryConstant.ASSIGNED_AMOUNT,
      filterable: true,
    },
    {
      field: TreasuryConstant.WITHHOLDING_TAX,
      title: TreasuryConstant.TOTAL_WITHHOLDING_TAX,
      tooltip: TreasuryConstant.WITH_HOLDING_TAX,
      filterable: true,
    },
    {
      field: TreasuryConstant.ASSIGNED_WITHHOLDING_TAX_WITH_CURRENCY,
      title: TreasuryConstant.ASSIGNED_WITHHOLDING_TAX,
      tooltip: TreasuryConstant.ASSIGNED_WITHHOLDING_TAX,
      filterable: true,
    },
  ];
  public gridState: State = {
    skip: 0,
    take: 10,
    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: []
    }
  };
  formatDate = this.translate.instant(SharedConstant.DATE_FORMAT);
  // Permission
  public hasShowSalesInvoicePermission: boolean;
  public hasShowPurchaseInvoicePermission: boolean;
  public hasUpdateCustomerPaymentHistory: boolean;
  public hasUpdateSupplierPaymentHistory: boolean;
  public hasCancelCustomerSettlement: boolean;
  public hasCancelSupplierSettlement: boolean;
  public haveCancelPermission = false ;
  public haveUpdatePermission = false ;

  constructor(private modalService: ModalDialogInstanceService, private fb: FormBuilder,
    private router: Router, private documentUtilityService: DocumentUtilityService, private swalWarrings: SwalWarring,
    public settlementService: DeadLineDocumentService, private validationService: ValidationService,
              private localStorageService : LocalStorageService, private translate: TranslateService, private authService: AuthService,public fileService: FileService) {
   this.language = this.localStorageService.getLanguage();
  }

  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.hasShowSalesInvoicePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.SHOW_INVOICE_SALES);
    this.hasShowPurchaseInvoicePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.SHOW_INVOICE_PURCHASE);
    this.hasUpdateCustomerPaymentHistory = this.authService.hasAuthority(PermissionConstant.TreasuryPermissions.UPDATE_CUSTOMER_PAYMENT_HISTORY);
    this.hasUpdateSupplierPaymentHistory = this.authService.hasAuthority(PermissionConstant.TreasuryPermissions.UPDATE_SUPPLIER_PAYMENT_HISTORY);
    this.hasCancelCustomerSettlement = this.authService.hasAuthority(PermissionConstant.TreasuryPermissions.CANCEL_CUSTOMER_SETTLEMENT);
    this.hasCancelSupplierSettlement = this.authService.hasAuthority(PermissionConstant.TreasuryPermissions.CANCEL_SUPPLIER_SETTLEMENT);
    this.options = options;
    this.settlement = Object.assign({}, this.options.data.Settlement);
    this.showButtons = this.options.data.showButtons ? this.options.data.showButtons : this.showButtons;
    this.companyWithholdingTax = this.options.data.CompanyWithholdingTax;
    this.isImmediatePaymentMethod = this.settlement.Immediate;
    this.tiersType = this.options.data.tiersType;
    this.closeDialogSubject = options.closeDialogSubject;
  }

  ngOnInit() {
    if(this.tiersType == this.tiersTypeEnum.Customer){
      this.haveCancelPermission = this.authService.hasAuthority(PermissionConstant.TreasuryPermissions.CANCEL_CUSTOMER_SETTLEMENT);
      this.haveUpdatePermission = this.authService.hasAuthority(PermissionConstant.TreasuryPermissions.UPDATE_CUSTOMER_PAYMENT_HISTORY)
    } else {
      this.haveCancelPermission = this.authService.hasAuthority(PermissionConstant.TreasuryPermissions.CANCEL_SUPPLIER_SETTLEMENT);
      this.haveUpdatePermission = this.authService.hasAuthority(PermissionConstant.TreasuryPermissions.UPDATE_SUPPLIER_PAYMENT_HISTORY)
    }
    this.createFormGroup();
    this.paymentMethodchange();
    this.showBankAccount();
    if (this.settlement.ObservationsFilesInfo && this.settlement.ObservationsFilesInfo.length > 0) {
      this.FilesInfos = this.settlement.ObservationsFilesInfo;
    }
    if (this.settlement.WithholdingTaxObservationsFilesInfo && this.settlement.WithholdingTaxObservationsFilesInfo.length > 0) {
      this.withHoldingTaxFileInfos = this.settlement.WithholdingTaxObservationsFilesInfo;
    }
    this.settlement.SettlementDate = new Date(this.settlement.SettlementDate);
    if (this.settlement.CommitmentDate) {
      this.settlement.CommitmentDate = new Date(this.settlement.CommitmentDate);
    }

    this.settlementService.getSettlementById(this.settlement.Id).subscribe((data) => {
      this.gridData = data.SettlementCommitment;
    });
  }

  createFormGroup() {
    this.settlementFormGroup = this.fb.group({
      Id: [0],
      Holder: ['', [Validators.required]],
      SettlementDate: [new Date(), [Validators.required]],
      CommitmentDate: [new Date(), [Validators.required]],
      Note: [''],
      IssuingBank: ['', [Validators.required]],
      Label: [''],
      SettlementReference: ['', [Validators.required]],
      Rib: [''],
      Agency: [''],
      Bank: [''],
      Address: ['']
    });
  }

  public reGenerateWithholdingTaxReport() {
    this.settlementService.ReGenerateWithholdingTaxCertification(this.settlement.Id).subscribe(
      res => {
        this.withHoldingTaxFileInfos = res.WithholdingTaxObservationsFilesInfo;
      });
  }


  save() {
    if (this.settlementFormGroup.valid) {
      this.settlementFormGroup.controls.Label.setValue(this.settlementFormGroup.controls.Label.value.trim());
      this.settlementFormGroup.controls.Holder.setValue(this.settlementFormGroup.controls.Holder.value.trim());
      this.settlementFormGroup.controls.IssuingBank.setValue(this.settlementFormGroup.controls.IssuingBank.value.trim());
      this.settlementFormGroup.controls.SettlementReference.setValue(this.settlementFormGroup.controls.SettlementReference.value.trim());
    }
    if (this.settlementFormGroup.valid) {
      this.settlement.ObservationsFilesInfo = this.FilesInfos;
      this.settlement.WithholdingTaxObservationsFilesInfo = this.withHoldingTaxFileInfos;
      Object.assign(this.settlement, this.settlementFormGroup.getRawValue());
      this.settlementService.updateSettlement(this.settlement).subscribe(() => {
        this.options.onClose();
        this.modalService.closeAnyExistingModalDialog();
      });
    } else {
      this.validationService.validateAllFormFields(this.settlementFormGroup);
    }
  }
  closeModal() {
    this.options.onClose();
    this.modalService.closeAnyExistingModalDialog();
  }
  replace() {
    this.swalWarrings.CreateSwal(this.getSwalTexte(), null, TreasuryConstant.SETTLEMENT_DISPOSAL)
      .then((result) => {
        if (result.value) {
          // Replace settlement
          this.settlementService.replaceSettlement(this.settlement.Id).subscribe(() => {
            this.closeModal();
          });
        }
      });
  }

  showDocument(document) {
    const url = this.documentUtilityService.showDocument(document);
    this.router.navigate([]).then(() => { window.open(url, '_blank'); });
  }
  getSwalTexte(): string {
    return TreasuryConstant.SETTLEMENT_DISPOSAL_MESSAGE;
  }
  updateSettlement() {
    this.isUpdate = true;
    this.settlementFormGroup.patchValue(this.settlement);
  }
  cancelUpdate() {
    this.isUpdate = false;
  }
  paymentMethodchange() {
    if (!this.isImmediatePaymentMethod) {
      this.settlementFormGroup.controls.SettlementReference.setValidators([Validators.required, Validators.minLength(NumberConstant.ZERO),
      Validators.maxLength(NumberConstant.ONE_HUNDRED)]);
      this.settlementFormGroup.controls.CommitmentDate.setValidators([Validators.required]);
      this.settlementFormGroup.controls.Holder.setValidators([Validators.required, Validators.minLength(NumberConstant.ZERO),
      Validators.maxLength(NumberConstant.ONE_HUNDRED)]);
      this.settlementFormGroup.controls.IssuingBank.setValidators([Validators.required, Validators.minLength(NumberConstant.ZERO),
      Validators.maxLength(NumberConstant.ONE_HUNDRED)]);
    } else {
      this.settlementFormGroup.controls.SettlementReference.setValidators([]);
      this.settlementFormGroup.controls.CommitmentDate.setValidators([]);
      this.settlementFormGroup.controls.Holder.setValidators([]);
      this.settlementFormGroup.controls.IssuingBank.setValidators([Validators.required, Validators.minLength(NumberConstant.ZERO),
      Validators.maxLength(NumberConstant.ONE_HUNDRED)]);
      if (this.settlement.PaymentMethodCode === this.paymentMethodEnum.CashPayment) {
        this.settlementFormGroup.controls.IssuingBank.setValidators([]);
      }
    }
    this.settlementFormGroup.controls.SettlementReference.updateValueAndValidity();
    this.settlementFormGroup.controls.CommitmentDate.updateValueAndValidity();
    this.settlementFormGroup.controls.Holder.updateValueAndValidity();
    this.settlementFormGroup.controls.IssuingBank.updateValueAndValidity();
  }
  showBankAccount() {
    if (this.tiersType === this.tiersTypeEnum.Supplier) {
      if (!this.isImmediatePaymentMethod ||
        this.settlement.PaymentMethodCode === this.paymentMethodEnum.BankTransfer ||
        this.settlement.PaymentMethodCode === this.paymentMethodEnum.BankCard) {
        this.isBankPaymentMethod = true;
        this.settlementFormGroup.controls.IssuingBank.setValidators([]);
        this.settlementFormGroup.controls.IssuingBank.updateValueAndValidity();
      }
    }
  }

  /**
   * return true if the settlement is linked to paymentSlip or is reconciled or is his status is canceled otherwise return false
   */
  private verifyIfSettlementIsCashedOrIsLinkedToPaymentSlipOrReconciliation(): boolean {
    return this.settlement && (
      (this.settlement.IdPaymentSlip > 0)
      || (this.settlement.IdReconciliation > 0)
      || (this.settlement.IdPaymentStatus === this.paymentStatusEnum.Canceled) || this.settlement.IdPaymentStatus === this.paymentStatusEnum.Cashed);
  }
  public onJasperPrintClick(){
    if(this.settlement){
  const params = {
    report_SettlementId: this.settlement.Id
  };
  var documentName;
  if(this.tiersType == this.tiersTypeEnum.Supplier)
  {
     documentName = this.translate.instant(SettlementConstant.SUPPLIER_SETTLEMENT)
  }else {
     documentName = this.translate.instant(SettlementConstant.CLIENT_SETTLEMENT)
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
