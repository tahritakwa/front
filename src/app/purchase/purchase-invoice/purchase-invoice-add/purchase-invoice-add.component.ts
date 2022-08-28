import { Component, OnInit, OnDestroy, ViewChild, ViewContainerRef, AfterViewInit } from '@angular/core';
import { DocumentEnumerator } from '../../../models/enumerators/document.enum';
import { DocumentConstant } from '../../../constant/sales/document.constant';
import { FormBuilder, Validators } from '@angular/forms';
import { InformationTypeEnum } from '../../../shared/services/signalr/information/information.enum';
import { TranslateService } from '@ngx-translate/core';
import { DocumentService } from '../../../sales/services/document/document.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { ContactDropdownComponent } from '../../../shared/components/contact-dropdown/contact-dropdown.component';
import {
  GridPurchaseInvoiceAssestsBudgetComponent
} from '../../components/grid-purchase-invoice-assests-budget/grid-purchase-invoice-assests-budget.component';
import { CurrencyService } from '../../../administration/services/currency/currency.service';
import { DocumentFormService } from '../../../shared/services/document/document-grid.service';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { digitsAfterComma, ValidationService } from '../../../shared/services/validation/validation.service';
import { CrudGridService } from '../../../sales/services/document-line/crud-grid.service';
import { FormModalDialogService } from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { FileInfo } from '../../../models/shared/objectToSend';
import { MessageService } from '../../../shared/services/signalr/message/message.service';
import { DocumentAddComponent } from '../../../shared/components/document/document-add/document-add.component';
import { DeadLineDocumentService } from '../../../sales/services/dead-line-document/dead-line-document.service';
import { ReportTemplateService } from '../../../shared/services/report-template/report-template.service';
import { LanguageService } from '../../../shared/services/language/language.service';
import { SearchItemService } from '../../../sales/services/search-item/search-item.service';
import { StarkPermissionsService, StarkRolesService } from '../../../stark-permissions/stark-permissions.module';
import { FileService } from '../../../shared/services/file/file-service.service';
import { SupplierDropdownComponent } from '../../../shared/components/supplier-dropdown/supplier-dropdown.component';
import { RoleConfigConstant } from '../../../Structure/_roleConfigConstant';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { TiersTypeEnumerator } from '../../../models/enumerators/tiers-type.enum';
import { PredicateFormat, Filter, Operation } from '../../../shared/utils/predicate';
import { DeadLineDocumentComponent } from '../../../sales/components/dead-line-document/dead-line-document.component';
import { SettlementGapMethodEnumerator } from '../../../models/enumerators/settlement-gap-method.enum';
import { CompanyService } from '../../../administration/services/company/company.service';
import { ActivityAreaEnumerator } from '../../../models/enumerators/activity-area.enum';
import { ItemConstant } from '../../../constant/inventory/item.constant';
import { SalesSettingComboComponent } from '../../../shared/components/sales-setting-combo/sales-setting-combo.component';
import { isNullOrUndefined } from 'util';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { LocalStorageService } from '../../../login/Authentification/services/local-storage-service';
import { TiersService } from '../../services/tiers/tiers.service';


const INVOICE = 'INVOICE';
@Component({
  selector: 'app-purchase-invoice-add',
  templateUrl: './purchase-invoice-add.component.html',
  styleUrls: ['./purchase-invoice-add.component.scss']
})
export class PurchaseInvoiceAddComponent extends DocumentAddComponent implements OnInit, OnDestroy {

  // contact dropdown
  @ViewChild(ContactDropdownComponent) public childListContactDropDown;
  @ViewChild(GridPurchaseInvoiceAssestsBudgetComponent) public documentLineGrid;
  @ViewChild(SalesSettingComboComponent) public salesSettingsCombo;
  @ViewChild(DeadLineDocumentComponent) deadLineDocumentComponentChild;
  /** document Title Invoice */
  documentTitle: string;

  /** action to Do (Add, edit, show ) */
  type: string;

  /** document Type */
  documentType = DocumentEnumerator.PurchaseInvoices;

  /** settlement Properties */
  public SettlementGapMethodEnum: SettlementGapMethodEnumerator = new SettlementGapMethodEnumerator();
  settlementsHistory: Array<any> = new Array<any>();
  public lostAmount = 0;
  public lostAmountExplanation = '';

  public companyWithholdingTax = false;
  public isEsnVersion: boolean;
  /** displayAmount to deisplay amount lists*/
  displayAmount = false;
  currentDate = new Date();
  public tiersType = TiersTypeEnumerator;
  public predicate: PredicateFormat;
  public validateInvoicePermission_PU = false;
  public printInvoicePermission_PU = false;
  public showSupplierDetails = false;
  public showSettlementAddButton = false;
  public hideSupplierAddBtn = false;
  public isUpdateMode = false;
  public hasUpdatePermission: boolean;
  public hasAddPermission: boolean;
  public hasWithholdingTaxListPermission: boolean;

  constructor(private fb: FormBuilder,
    protected currencyService: CurrencyService,
    protected documentFormService: DocumentFormService,
    protected translate: TranslateService,
    protected swalWarrings: SwalWarring,
    public documentService: DocumentService,
    protected validationService: ValidationService,
    protected messageService: MessageService,
    protected router: Router,
    private route: ActivatedRoute,
    protected service: CrudGridService,
    protected formModalDialogService: FormModalDialogService,
    protected viewRef: ViewContainerRef, private settlementService: DeadLineDocumentService,
    protected serviceReportTemplate: ReportTemplateService, protected languageService: LanguageService,
    protected searchItemService: SearchItemService,
    private companyService: CompanyService,
    protected permissionsService: StarkPermissionsService,
    protected fileServiceService: FileService, protected rolesService: StarkRolesService,
    protected growlService: GrowlService, public authService: AuthService, private localStorageService: LocalStorageService,
    protected tiersService: TiersService) {
    super(currencyService,
      documentFormService,
      translate,
      swalWarrings,
      documentService,
      validationService,
      messageService,
      router,
      formModalDialogService,
      viewRef,
      service,
      serviceReportTemplate,
      languageService,
      permissionsService,
      searchItemService,
      fileServiceService, rolesService, growlService, tiersService);
    this.route.params.subscribe(params => {
      const idDocument = +params[DocumentConstant.ID]; // (+) converts string InvoiceConstants.ID to a number
      const idStatusParam = +params[DocumentConstant.STATUS_PARAM];
      if (idDocument) {
        this.id = idDocument;
        this.isUpdateMode = true;
      }
      if (idStatusParam) {
        this.idStatus = idStatusParam;
      }
    });
    this.attachmentFilesToUpload = new Array<FileInfo>();
    this.isSalesDocumment = false;
    this.isEsnVersion = this.localStorageService.getActivityArea() === ActivityAreaEnumerator.Esn;

  }

  CallngOnInit() {
    this.ngOnInit.bind(this);
  }
  /** create the form group */
  public createAddForm(): void {
    this.documentForm = this.fb.group({
      Id: [0],
      IdTiers: [{ value: '', disabled: this.isDisabledForm() }, Validators.required],
      DocumentDate: [{ value: new Date(), disabled: this.isDisabledForm() }, Validators.required],
      IdDocumentStatus: [1],
      Code: [{ value: 'Invoice/' + this.currentDate.getFullYear(), disabled: true }],
      IdSettlementMode: [{ value: '', disabled: this.isDisabledForm() }, Validators.required],
      Reference: [{ value: '', disabled: this.isDisabledForm() }],
      IdCurrency: [{ value: '', disabled: true }, Validators.required],
      IdContact: [{ value: '', disabled: this.isDisabledForm() }],
      DocumentHtpriceWithCurrency: [{ value: NumberConstant.ZERO, disabled: true }],
      DocumentTotalVatTaxesWithCurrency: [{ value: NumberConstant.ZERO, disabled: true }],
      DocumentTtcpriceWithCurrency: [{ value: NumberConstant.ZERO, disabled: true }],
      DocumentTtcprice: [{ value: NumberConstant.ZERO, disabled: true }],
      DocumentTotalDiscountWithCurrency: [{ value: NumberConstant.ZERO, disabled: true }],
      DocumentOtherTaxesWithCurrency: [{ value: NumberConstant.ZERO, disabled: this.isDisabledForm() }],
      DocumentTotalExcVatTaxesWithCurrency: [{ value: NumberConstant.ZERO, disabled: true }],
      DocumentPriceIncludeVatWithCurrency: [{ value: NumberConstant.ZERO, disabled: true }],
      DocumentAmountPaidWithCurrency: [0],
      DocumentRemainingAmountWithCurrency: [0],
      DocumentTypeCode: [this.documentEnumerator.PurchaseInvoices],
      IdDocumentAssociated: [null],
      IsGenerated: [false],
      ExchangeRate: [null, digitsAfterComma(3)],
      DocumentInvoicingNumber: [{ value: '', disabled: this.isDisabledForm() }],
      DocumentInvoicingDate: [{ value: new Date(), disabled: this.isDisabledForm() }],
      ProvisionalCode: [''],
      FilesInfos: [null]
    });
  }

  ngOnInit() {
    this.validateInvoicePermission_PU = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.VALIDATE_INVOICE_PURCHASE);
    this.printInvoicePermission_PU = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.PRINT_INVOICE_PURCHASE);
    this.showSupplierDetails = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_SUPPLIER);
    this.showSettlementAddButton = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.ADD_SETTLEMENTMODE);
    this.hideSupplierAddBtn = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.ADD_SUPPLIER);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_INVOICE_PURCHASE);
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.ADD_INVOICE_PURCHASE);
    this.hasWithholdingTaxListPermission = this.authService.hasAuthority
      (PermissionConstant.CommercialPermissions.ADD_PURCHASE_WITHHOLDING_TAX);
    this.type = this.documentService.setDocumentUrlType(this.router);
    this.documentLineGrid.view = this.service.linesToDisplay('data');
    this.createAddForm();
    this.getListReportTemplate();
    if (this.id > 0) {
      this.getDataToUpdate();
      this.companyService.getCurrentCompany().subscribe((data) => {
        this.companyWithholdingTax = data.WithholdingTax;
      });
    }
    this.documentTitle = this.translate.instant(INVOICE);
    this.documentService.setDocumentType(this.documentType);
    this.warningParagraph = 'VALIDATE_INVOICE_WARRINIG_PARAGRAPH';
    this.validateDocumentText = 'VALIDATE_INVOICE';
    super.ngOnInit();
    this.validationMessageServiceInformation = InformationTypeEnum.PURCHASE_INVOICE_VALIDATION;
    this.addMessageServiceInformation = InformationTypeEnum.PURCHASE_INVOICE_ADD;
    this.backToListLink = DocumentConstant.PURCHASE_INVOICE_URL;
    this.routerReportLink = DocumentConstant.PURCHASE_INVOICE_REPORT_URL;
    this.disableEnableExchangeRate();
    if (this.isUpdateMode && !this.hasUpdatePermission
      && this.documentForm.controls['IdDocumentStatus'].value === this.statusCode.Provisional) {
      this.documentForm.disable();
    }
  }
  ngOnDestroy() {
    this.destroy();
  }

  public showSettlementDetail(settlement: any) {
    settlement.companyWithholdingTax = this.companyWithholdingTax;
    super.showSettlementDetail(settlement);
  }

  RechargeSettlementInformations() {
    this.setDataEmpty();
    this.getDataToUpdate();
  }

  /**
   * get Settlement related to the document and dispaly values
   * @param idDocument
   */
  displaySettlements(idDocument) {
    this.settlementService.getDocumentPaymentHisotry(idDocument).subscribe(res => {
      if (res && res.length > 0) {
        this.displayAmount = true;
        this.settlementsHistory = [];
        res.forEach(item => {
          if (item.Settlement.Type === this.SettlementGapMethodEnum.NoGap) {
            this.settlementsHistory.push(item);
          } else if (item.Settlement.Type === this.SettlementGapMethodEnum.LossGap) {
            this.lostAmount += item.Settlement.AmountWithCurrency;
          }
        });
        if (this.lostAmount > 0) {
          const message = 'EXPLANATION_OF_THE_LOST_AMOUNT';
          this.lostAmountExplanation = `${this.translate.instant(message)}`;
          this.lostAmountExplanation = this.lostAmountExplanation.replace('{AMOUNT}', this.lostAmount.toString());
          this.lostAmountExplanation = this.lostAmountExplanation.replace('{CURRENCY}', this.formatOptions.currency);
        }
      }
    });
  }

  /**
* focusOnAddLine
*/
  public focusOnAddLine() {
    this.documentLineGrid.focusOnAddLineButton();
  }

  public loadPrintDocumentRole() {
    if (this.documentType === DocumentEnumerator.PurchaseInvoices) {
      this.permissionsService.hasPermission(RoleConfigConstant.PRINT.PURCHASEINVOICE).then(x =>
        this.printDocumentRole = x);
    }
  }
  public loadUpdateValidDocumentRole() {
    if (this.documentType === DocumentEnumerator.PurchaseInvoices) {
      this.permissionsService.hasPermission(RoleConfigConstant.UPDATE.PURCHASEINVOICE_SA).then(x =>
        this.updateValidDocumentRole = x);
    }
  }
  public refreshFinancialCommitmentComponent() {
    if (this.deadLineDocumentComponentChild) {
      this.deadLineDocumentComponentChild.refreshFinancialCommitmentComponent();
    }
  }

  public loadDeleteValidDocumentRole() {
    if (this.documentType === DocumentEnumerator.PurchaseInvoices) {
      this.permissionsService.hasPermission(RoleConfigConstant.DELETE.PURCHASEINVOICE_SA).then(x =>
        this.deleteDocumentLineRole = x);
    }
  }
  public RecalculateDocumentAndDocumentLineAfterChangingCurrencyExchangeRate() {
    if (!Number(this.documentForm.controls['ExchangeRate'].value) || this.documentForm.controls['ExchangeRate'].value < 0) {
      if (this.documentForm.controls['ExchangeRate'].value) {
        this.documentForm.controls['ExchangeRate'].setErrors({ incorrect: true });
      }
    }
    if (this.documentForm.controls['Id'].value > 0 && this.documentForm.valid && this.documentForm.controls['ExchangeRate'].value !== this.oldValueRate) {
      this.documentService.RecalculateDocumentAndDocumentLineAfterChangingCurrencyExchangeRate(this.documentForm.controls['Id'].value,
        this.documentForm.controls['ExchangeRate'].value).subscribe((data) => {
          if (!this.documentForm.controls['ExchangeRate'].value || this.documentForm.controls['ExchangeRate'].value == 0) {
            if (data == null || data == 0) {
              this.documentForm.controls['ExchangeRate'].setValue(undefined);
            } else {
              this.documentForm.controls['ExchangeRate'].setValue(data);
            }
          }
          this.oldValueRate = this.documentForm.controls['ExchangeRate'].value;
        });
    }
  }
  public disableEnableExchangeRate() {
    this.predicate = new PredicateFormat();
    this.predicate.Filter = new Array<Filter>();
    this.predicate.Filter.push(new Filter(DocumentConstant.ID_DOCUMENT, Operation.eq, this.id, false, true));
    this.documentService.getDocumentsAssociated(this.predicate).subscribe((data) => {
      if (data) {
        if (!isNullOrUndefined(this.documentForm)) {
          if (data.AssociatedDocuments.length > 0) {
            this.documentForm.controls['ExchangeRate'].disable();
            this.documentForm.controls['ExchangeRate'].setErrors({ incorrect: false });
          } else {
            this.documentForm.controls['ExchangeRate'].enable();
          }
        }
      }
    });
  }
  selectedTier(data: any) {
    if (data) {
      this.salesSettingsCombo.tierSelected(data);
    }
  }

}
