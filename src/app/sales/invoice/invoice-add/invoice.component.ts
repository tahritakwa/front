import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { DocumentConstant } from '../../../constant/sales/document.constant';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { InformationTypeEnum } from '../../../shared/services/signalr/information/information.enum';
import { TranslateService } from '@ngx-translate/core';
import { DocumentEnumerator, documentStatusCode, InvoicingTypeEnumerator } from '../../../models/enumerators/document.enum';
import { DocumentService } from '../../services/document/document.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentAddComponent } from '../../../shared/components/document/document-add/document-add.component';
import { ContactDropdownComponent } from '../../../shared/components/contact-dropdown/contact-dropdown.component';
import { GridSalesInvoiceAssestsComponent } from '../../components/grid-sales-invoice-assests/grid-sales-invoice-assests.component';
import { CurrencyService } from '../../../administration/services/currency/currency.service';
import { DocumentFormService } from '../../../shared/services/document/document-grid.service';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { ValidationService } from '../../../shared/services/validation/validation.service';

import { CrudGridService } from '../../services/document-line/crud-grid.service';
import { FormModalDialogService } from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { FileInfo } from '../../../models/shared/objectToSend';
import { MessageService } from '../../../shared/services/signalr/message/message.service';
import { ReportTemplateService } from '../../../shared/services/report-template/report-template.service';
import { LanguageService } from '../../../shared/services/language/language.service';
import { DeadLineDocumentService } from '../../services/dead-line-document/dead-line-document.service';
import { SearchItemService } from '../../services/search-item/search-item.service';
import { ModalDialogInstanceService } from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import { StarkPermissionsService, StarkRolesService } from '../../../stark-permissions/stark-permissions.module';
import { FileService } from '../../../shared/services/file/file-service.service';
import { SupplierDropdownComponent } from '../../../shared/components/supplier-dropdown/supplier-dropdown.component';
import { RoleConfigConstant } from '../../../Structure/_roleConfigConstant';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { TiersTypeEnumerator } from '../../../models/enumerators/tiers-type.enum';
import { DeadLineDocumentComponent } from '../../components/dead-line-document/dead-line-document.component';
import { SettlementGapMethodEnumerator } from '../../../models/enumerators/settlement-gap-method.enum';
import { CompanyService } from '../../../administration/services/company/company.service';
import { ActivityAreaEnumerator } from '../../../models/enumerators/activity-area.enum';
import { ItemConstant } from '../../../constant/inventory/item.constant';
import { ReducedCompany } from '../../../models/administration/reduced-company.model';
import { EcommerceProductService } from '../../../ecommerce/services/ecommerce-product/ecommerce-product.service';
import { SalesSettingComboComponent } from '../../../shared/components/sales-setting-combo/sales-setting-combo.component';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { LocalStorageService } from '../../../login/Authentification/services/local-storage-service';
import { TiersService } from '../../../purchase/services/tiers/tiers.service';
import { AddSettlementComponent } from '../../../treasury/components/add-settlement/add-settlement.component';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { PurchaseOrderConstant } from '../../../constant/purchase/purchase-order.constant';

const INVOICE = 'INVOICE';
@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent extends DocumentAddComponent implements OnInit, OnDestroy {
  public openTiersDetailsCollapse = true;
  // contact dropdown
  @ViewChild(ContactDropdownComponent) public childListContactDropDown;
  @ViewChild(GridSalesInvoiceAssestsComponent) public documentLineGrid;

  @ViewChild('tiersDropDown') tiersDropDownEl: SupplierDropdownComponent;
  @ViewChild(DeadLineDocumentComponent) deadLineDocumentComponentChild;
  @ViewChild(SalesSettingComboComponent) public salesSettingsCombo;
  /** document Title Asset */
  documentTitle: string;

  /** action to Do (Add, edit, show ) */
  type: string;
  /** document Type */
  documentType = DocumentEnumerator.SalesInvoices;
  public isEsnVersion: boolean;

  /** settlement Properties */
  settlementsHistory: Array<any> = new Array<any>();
  public SettlementGapMethodEnum: SettlementGapMethodEnumerator = new SettlementGapMethodEnumerator();
  public lostAmount = 0;
  public lostAmountExplanation = '';
  public companyWithholdingTax = false;
  currentDate = new Date();
  public min: Date;
  public DocumentStatusCode = documentStatusCode;
  public OfConfirmationDocumentRole: boolean;
  public tiersType = TiersTypeEnumerator;
  public validateInvoicePermission_SA = false;
  public printInvoicePermission_SA = false;
  public showCustomerDetails = false;
  public hideCustomerAddBtn = false;
  public hasAddPermission = false;
  public hasUpdatePermission = false;
  public isUpdateMode = false;
  public hasWithholdingTaxListPermission = false;
  public hasInvoiceSalesListPermission = false;

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
    protected viewRef: ViewContainerRef,
    protected serviceReportTemplate: ReportTemplateService,
    private modalService: ModalDialogInstanceService,
    protected languageService: LanguageService, private settlementService: DeadLineDocumentService,
    protected searchItemService: SearchItemService,
    protected permissionsService: StarkPermissionsService,
    protected fileServiceService: FileService,
    private companyService: CompanyService, private localStorageService: LocalStorageService,
    public ecommerceProductService: EcommerceProductService,
    protected rolesService: StarkRolesService, protected growlService: GrowlService,
    public authService: AuthService, protected tiersService: TiersService) {
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
      fileServiceService,
      rolesService, growlService, tiersService);
    this.isEsnVersion = this.localStorageService.getActivityArea() === ActivityAreaEnumerator.Esn;
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
    this.isSalesDocumment = true;
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
      IdCurrency: [{ value: '', disabled: true }, Validators.required],
      IdContact: [{ value: '', disabled: this.isDisabledForm() }],
      DocumentHtpriceWithCurrency: [{ value: NumberConstant.ZERO, disabled: true }],
      DocumentTotalVatTaxesWithCurrency: [{ value: NumberConstant.ZERO, disabled: true }],
      DocumentTtcpriceWithCurrency: [{ value: NumberConstant.ZERO, disabled: !this.hasUpdateTTCAmountPermission }],
      DocumentTtcprice: [{ value: NumberConstant.ZERO, disabled: true }],
      DocumentTotalDiscountWithCurrency: [{ value: NumberConstant.ZERO, disabled: true }],
      DocumentOtherTaxesWithCurrency: [{ value: NumberConstant.ZERO }],
      DocumentTotalExcVatTaxesWithCurrency: [{ value: NumberConstant.ZERO, disabled: true }],
      DocumentPriceIncludeVatWithCurrency: [{ value: NumberConstant.ZERO, disabled: true }],
      DocumentAmountPaidWithCurrency: [0],
      DocumentRemainingAmountWithCurrency: [0],
      DocumentTypeCode: [this.documentEnumerator.SalesInvoices],
      IdDocumentAssociated: [null],
      InoicingType: [0],
      ProvisionalCode: [''],
      DocumentVarchar2: [''],
      DocumentVarchar3: [''],
      DocumentVarchar7: [''],
      DocumentVarchar8: [''],
      Reference: [''],
      IsForPos: [false],
      LeftToPayAmount: [null],
      Name: [''],
      Tel1: [''],
      MatriculeFiscale:[''],
      Adress: ['']
    });
  }

  ngOnInit() {
    this.validateInvoicePermission_SA = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.VALIDATE_INVOICE_SALES);
    this.printInvoicePermission_SA = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.PRINT_INVOICE_SALES);
    this.showCustomerDetails = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_CUSTOMER);
    this.hideCustomerAddBtn = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.ADD_CUSTOMER);
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.ADD_INVOICE_SALES);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_INVOICE_SALES);
    this.hasWithholdingTaxListPermission = this.authService.hasAuthority
      (PermissionConstant.CommercialPermissions.ADD_SALES_WITHHOLDING_TAX);
    this.hasInvoiceSalesListPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.LIST_INVOICE_SALES);
    this.hasUpdateTTCAmountPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_TTC_AMOUNT);
    this.type = this.documentService.setDocumentUrlType(this.router);
    this.createAddForm();
    this.getListReportTemplate();
    if (this.id > 0) {
      this.getDataToUpdate();
      this.companyService.getReducedDataOfCompany().subscribe((data: ReducedCompany) => {
        this.companyWithholdingTax = data.WithholdingTax;
      });
    }
    this.min = new Date();
    this.documentTitle = this.translate.instant(INVOICE);
    this.documentService.setDocumentType(this.documentType);
    this.warningParagraph = 'VALIDATE_INVOICE_WARRINIG_PARAGRAPH';
    this.validateDocumentText = 'VALIDATE_INVOICE';
    this.validationMessageServiceInformation = InformationTypeEnum.SALES_INVOICE_VALIDATION;
    this.addMessageServiceInformation = InformationTypeEnum.SALES_INVOICE_ADD;
    this.backToListLink = DocumentConstant.SALES_INVOICE_URL;
    this.routerReportLink = DocumentConstant.SALES_INVOICE_REPORT_URL;
    super.ngOnInit();
    this.loadOfConfirmationDocumentRole();
    if (this.isUpdateMode && this.documentForm.controls['IdDocumentStatus'].value === this.statusCode.Provisional) {
      if (!this.hasUpdatePermission) {
        this.documentForm.disable();
      }
      if (!this.hasUpdateTTCAmountPermission) {
        this.documentForm.controls['DocumentTtcpriceWithCurrency'].disable();
      }
    }
  }

  ngOnDestroy() {
    this.destroy();
  }

  RechargeSettlementInformations() {
    this.setDataEmpty();
    this.getDataToUpdate();
  }

  public refreshFinancialCommitmentComponent() {
    if (this.deadLineDocumentComponentChild) {
      this.deadLineDocumentComponentChild.refreshFinancialCommitmentComponent();
    }
  }

  /**
   * get Settlement related to the document and dispaly values
   * @param idDocument
   */
  displaySettlements(idDocument) {
    this.settlementService.getDocumentPaymentHisotry(idDocument).subscribe(res => {
      if (res && res.length > 0) {
        this.settlementsHistory = [];
        res.forEach(item => {
          if (item.Settlement.Type === this.SettlementGapMethodEnum.NoGap) {
            this.settlementsHistory.push(item);
          } else if (item.Settlement.Type === this.SettlementGapMethodEnum.LossGap) {
            this.lostAmount += item.Settlement.AmountWithCurrency;
          }
          if (this.lostAmount > 0) {
            const message = 'EXPLANATION_OF_THE_LOST_AMOUNT';
            this.lostAmountExplanation = `${this.translate.instant(message)}`;
            this.lostAmountExplanation = this.lostAmountExplanation.replace('{AMOUNT}', this.lostAmount.toString());
            this.lostAmountExplanation = this.lostAmountExplanation.replace('{CURRENCY}', this.formatOptions.currency);
          }
        });
      }
    });
  }

  public showSettlementDetail(settlement: any) {
    settlement.companyWithholdingTax = this.companyWithholdingTax;
    super.showSettlementDetail(settlement);
  }

  validateAndSynchronize() {
    if (this.currentDocument && this.currentDocument.InoicingType && this.currentDocument.InoicingType == InvoicingTypeEnumerator.advance_Payment) {

      this.formModalDialogService.openDialog("ADD_DEPOSIT_SETTLEMENT", AddSettlementComponent, this.viewRef, null,
        {
          'companyWithholdingTax': true,
          'tiersType': 1,
          'tiersCurrency': { 'Code': this.currentDocument.IdTiersNavigation.IdCurrencyNavigation.Code, 'Precision': this.currentDocument.IdTiersNavigation.IdCurrencyNavigation.Precision },
          'selectedTiers': this.currentDocument.IdTiersNavigation,
          'isForPos': false,
          'totalAmount': this.documentForm.controls['DocumentTtcpriceWithCurrency'].value,
          'totalAmountWithholdingTax': 0,
          'listFinancialCommitmentSelected': this.currentDocument,
          'isModal': true
        }
        , null, SharedConstant.MODAL_DIALOG_SIZE_L);
    } else {
      this.onClickValidate();
      this.documentService.getById(this.documentForm.controls['Id'].value).subscribe(x => {
        if (x.IdInvoiceEcommerce) {
          this.ecommerceProductService.AddInvoiceToMagento(x).subscribe((y) => {
          });
        }
      });
    }
  }


  /**
   *  focusOnAddLine
   * */
  public focusOnAddLine() {
    this.documentLineGrid.focusOnAddLineButton();
  }

  ofConfirmation() {
    this.documentService.ofConfirmation(this.documentForm.controls['Id'].value).subscribe(x => {
      this.redirectPage(this.DocumentStatusCode.DRAFT, DocumentConstant.SALES_INVOICE_EDIT_URL);
    });
  }

  reValidate() {
    this.documentService.reValidate(this.documentForm.controls['Id'].value).subscribe(x => {
      this.redirectPage(this.DocumentStatusCode.Valid, DocumentConstant.SALES_INVOICE_SHOW_URL);
    });
  }

  private redirectPage(status: number, url: string) {
    this.router.navigateByUrl(
      url.concat(this.documentForm.controls['Id'].value +
        '/' + status));
  }

  public showImportbtnInInvoiceWhenDraftState(): boolean {
    return this.documentType === this.documentEnumerator.SalesInvoices && this.documentForm.controls['Id'].value > 0 &&
      this.documentForm.controls['IdDocumentStatus'].value === this.DocumentStatusCode.DRAFT;
  }


  public async onDownloadClick($event) {
    this.downloadOperation($event);
  }

  private downloadOperation($event) {
    super.onDownloadClick($event);
  }

  public loadPrintDocumentRole() {
    if (this.documentType === DocumentEnumerator.SalesInvoices) {
      this.printDocumentRole = this.printInvoicePermission_SA;
    }
  }
  public loadUpdateValidDocumentRole() {
    if (this.documentType === DocumentEnumerator.SalesInvoices) {
      this.updateValidDocumentRole = this.hasUpdatePermission && this.validateInvoicePermission_SA;
    }
  }
  public loadOfConfirmationDocumentRole() {
    this.OfConfirmationDocumentRole = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.INVALIDATE_INVOICE_SALES);
  }
  invoiceHasLignes(): boolean {
    return this.documentLineGrid && this.documentLineGrid.isContainsLines;
  }
  get DocumentVarchar2(): FormControl {
    return this.documentForm.get(DocumentConstant.MARKET_NUMBER) as FormControl;
  }
  get DocumentVarchar3(): FormControl {
    return this.documentForm.get(DocumentConstant.DELIVARY_PERIOD) as FormControl;
  }
  get DocumentVarchar7(): FormControl {
    return this.documentForm.get(DocumentConstant.CODE_BC) as FormControl;
  }
  get DocumentVarchar8(): FormControl {
    return this.documentForm.get(DocumentConstant.PROJECT_CODE) as FormControl;
  }
  selectedTier(data: any) {
    if (data) {
      this.salesSettingsCombo.tierSelected(data);
      if (data.selectedTiers) {
        this.documentForm.controls['Name'].setValue(data.selectedTiers.Name);
        this.documentForm.controls['MatriculeFiscale'].setValue(data.selectedTiers.MatriculeFiscale);
        if (data.selectedTiers.IdPhoneNavigation != null) {
          this.documentForm.controls['Tel1'].setValue("( " + data.selectedTiers.IdPhoneNavigation.DialCode + ") " + data.selectedTiers.IdPhoneNavigation.Number);
        }
        if (data.selectedTiers.Address && data.selectedTiers.Address.length != 0)
        {
        this.documentForm.controls['Adress'].setValue(data.selectedTiers.Address[0].PrincipalAddress);
        }
      } else {
        this.documentForm.controls['Name'].setValue(undefined);
        this.documentForm.controls['MatriculeFiscale'].setValue(undefined);
        this.documentForm.controls['Tel1'].setValue(undefined);
        this.documentForm.controls['Adress'].setValue(undefined);
      }
    }
  }
  public showOrder() {
    let url: string;
    if (this.currentDocument && this.currentDocument.DepositOrderStatusCode &&
      this.currentDocument.DepositOrderStatusCode != documentStatusCode.Provisional && this.currentDocument.DepositOrderStatusCode != documentStatusCode.DRAFT) {
      url = '/'.concat(DocumentConstant.SHOW).concat('/').concat(this.currentDocument.IdSalesOrder.toString()).concat('/').concat(this.currentDocument.DepositOrderStatusCode.toString());
    } else {
      url = '/'.concat('edit').concat('/').concat(this.currentDocument.IdSalesOrder.toString()).concat('/').concat(this.currentDocument.DepositOrderStatusCode.toString());
    }
    window.open(DocumentConstant.SALES_ORDER_URL.concat(url));
  }
  public showDepositInvoice() {
    let url: string;
    if (this.currentDocument && this.currentDocument.DepositInvoiceStatusCode &&
      this.currentDocument.DepositInvoiceStatusCode != documentStatusCode.Provisional && this.currentDocument.DepositInvoiceStatusCode != documentStatusCode.DRAFT) {
      url = '/'.concat(DocumentConstant.SHOW).concat('/').concat(this.currentDocument.IdSalesDepositInvoice.toString()).concat('/').concat(this.currentDocument.DepositInvoiceStatusCode.toString());
    } else {
      url = '/'.concat('edit').concat('/').concat(this.currentDocument.IdSalesDepositInvoice.toString()).concat('/').concat(this.currentDocument.DepositInvoiceStatusCode.toString());
    }
    window.open(DocumentConstant.SALES_INVOICE_URL.concat(url));
  }
  public showInvoice() {
    let url: string;
    if (this.currentDocument && this.currentDocument.InvoiceFromDepositOrderStatusCode &&
      this.currentDocument.InvoiceFromDepositOrderStatusCode != documentStatusCode.Provisional && this.currentDocument.InvoiceFromDepositOrderStatusCode != documentStatusCode.DRAFT) {
      url = '/'.concat(DocumentConstant.SHOW).concat('/').concat(this.currentDocument.IdInvoiceFromDepositOrderCode.toString()).concat('/').concat(this.currentDocument.InvoiceFromDepositOrderStatusCode.toString());
    } else {
      url = '/'.concat('edit').concat('/').concat(this.currentDocument.IdInvoiceFromDepositOrderCode.toString()).concat('/').concat(this.currentDocument.InvoiceFromDepositOrderStatusCode.toString());
    }
    window.open(DocumentConstant.SALES_INVOICE_URL.concat(url));
  }
}
