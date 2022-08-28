import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ViewContainerRef, Input } from '@angular/core';
import { DocumentAddComponent } from '../../../shared/components/document/document-add/document-add.component';
import { ContactDropdownComponent } from '../../../shared/components/contact-dropdown/contact-dropdown.component';
import { GridSalesInvoiceAssestsComponent } from '../../components/grid-sales-invoice-assests/grid-sales-invoice-assests.component';
import { SupplierDropdownComponent } from '../../../shared/components/supplier-dropdown/supplier-dropdown.component';
import { DocumentEnumerator } from '../../../models/enumerators/document.enum';
import { FormBuilder, Validators } from '@angular/forms';
import { CurrencyService } from '../../../administration/services/currency/currency.service';
import { DocumentFormService } from '../../../shared/services/document/document-grid.service';
import { TranslateService } from '@ngx-translate/core';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { DocumentService } from '../../services/document/document.service';
import { ValidationService } from '../../../shared/services/validation/validation.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CrudGridService } from '../../services/document-line/crud-grid.service';
import { FormModalDialogService } from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { SearchItemService } from '../../services/search-item/search-item.service';
import { ReportTemplateService } from '../../../shared/services/report-template/report-template.service';
import { LanguageService } from '../../../shared/services/language/language.service';
import { StarkPermissionsService } from '../../../stark-permissions/stark-permissions.module';
import { FileService } from '../../../shared/services/file/file-service.service';
import { StarkRolesService } from '../../../stark-permissions/service/roles.service';
import { DocumentConstant } from '../../../constant/sales/document.constant';
import { FileInfo } from '../../../models/shared/objectToSend';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { InformationTypeEnum } from '../../../shared/services/signalr/information/information.enum';
import { MessageService } from '../../../shared/services/signalr/message/message.service';
import { RoleConfigConstant } from '../../../Structure/_roleConfigConstant';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { ItemConstant } from '../../../constant/inventory/item.constant';
import { ActivityAreaEnumerator } from '../../../models/enumerators/activity-area.enum';
import { SalesSettingComboComponent } from '../../../shared/components/sales-setting-combo/sales-setting-combo.component';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { LocalStorageService } from '../../../login/Authentification/services/local-storage-service';
import { TiersService } from '../../../purchase/services/tiers/tiers.service';

@Component({
  selector: 'app-invoice-assets',
  templateUrl: './invoice-assets.component.html',
  styleUrls: ['./invoice-assets.component.scss']
})
export class InvoiceAssetsComponent extends DocumentAddComponent implements OnInit, OnDestroy {
  // contact dropdown
  @ViewChild(ContactDropdownComponent) public childListContactDropDown;
  @ViewChild(GridSalesInvoiceAssestsComponent) public documentLineGrid;
  @ViewChild('tiersDropDown') tiersDropDownEl: SupplierDropdownComponent;
  @ViewChild(SalesSettingComboComponent) public salesSettingsCombo;

  /** document Title Asset */
  documentTitle: string;

  /** action to Do (Add, edit, show ) */
  type: string;

  /** document Type */
  documentType = DocumentEnumerator.SalesInvoiceAsset;
  currentDate = new Date();
  isRestaurn = false;
  public isEsnVersion: boolean;
  public validateInvoiceAssetPermission_SA = false;
  public printInvoiceAssetPermission_SA = false;
  public showCustomerDetails = false;
  public hideCustomerAddBtn = false;
  public hasAddPermission = false;
  public hasUpdatePermission = false;
  public isUpdateMode = false;

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
    protected searchItemService: SearchItemService,
    protected serviceReportTemplate: ReportTemplateService, protected languageService: LanguageService,
    protected permissionsService: StarkPermissionsService,
    protected fileServiceService: FileService, private localStorageService: LocalStorageService,
    protected rolesService: StarkRolesService, protected growlService: GrowlService, public authService: AuthService,
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
      serviceReportTemplate, languageService, permissionsService,
      searchItemService,
      fileServiceService,
      rolesService, growlService,
      tiersService
    );
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
    this.route.data.subscribe(data => {
      this.isRestaurn = data.assetFinancial;
    });
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
      Code: [{
        value: this.documentTitle + '/' + this.currentDate.getFullYear(), disabled: true
      }],
      IdSettlementMode: [{ value: '', disabled: this.isDisabledForm() }, Validators.required],
      Reference: [{ value: '', disabled: this.isDisabledForm() }],
      IdCurrency: [{ value: '', disabled: true }, Validators.required],
      IdContact: [{ value: '', disabled: this.isDisabledForm() }],
      DocumentHtpriceWithCurrency: [{ value: NumberConstant.ZERO, disabled: true }],
      DocumentTotalVatTaxesWithCurrency: [{ value: NumberConstant.ZERO, disabled: true }],
      DocumentTtcpriceWithCurrency: [{ value: NumberConstant.ZERO, disabled: !this.hasUpdateTTCAmountPermission }],
      DocumentTtcprice: [{ value: NumberConstant.ZERO, disabled: true }],
      DocumentTotalDiscountWithCurrency: [{ value: NumberConstant.ZERO, disabled: true }],
      DocumentOtherTaxesWithCurrency: [{ value: NumberConstant.ZERO, disabled: this.isDisabledForm() }],
      DocumentTotalExcVatTaxesWithCurrency: [{ value: NumberConstant.ZERO, disabled: true }],
      DocumentPriceIncludeVatWithCurrency: [{ value: NumberConstant.ZERO, disabled: true }],
      DocumentAmountPaidWithCurrency: [0],
      DocumentRemainingAmountWithCurrency: [0],
      DocumentTypeCode: [this.documentEnumerator.SalesInvoiceAsset],
      IdDocumentAssociated: [null],
      isRestaurn: [this.isRestaurn],
      ProvisionalCode: ['']
    });
  }
  ngOnInit() {
    if (this.isRestaurn) {
      this.validateInvoiceAssetPermission_SA = this.authService.hasAuthority(PermissionConstant
        .CommercialPermissions.VALIDATE_FINANCIAL_ASSET_SALES);
      this.printInvoiceAssetPermission_SA = this.authService.hasAuthority(PermissionConstant
        .CommercialPermissions.PRINT_FINANCIAL_ASSET_SALES);
      this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.ADD_FINANCIAL_ASSET_SALES);
      this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_FINANCIAL_ASSET_SALES);
    } else {
      this.validateInvoiceAssetPermission_SA = this.authService.hasAuthority(PermissionConstant
        .CommercialPermissions.VALIDATE_INVOICE_ASSET_SALES);
      this.printInvoiceAssetPermission_SA = this.authService.hasAuthority(PermissionConstant
        .CommercialPermissions.PRINT_INVOICE_ASSET_SALES);
      this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.ADD_INVOICE_ASSET_SALES);
      this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_INVOICE_ASSET_SALES);
    }

    this.showCustomerDetails = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_CUSTOMER);
    this.hideCustomerAddBtn = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.ADD_CUSTOMER);
    this.hasUpdateTTCAmountPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_TTC_AMOUNT);
    this.documentTitle = this.isRestaurn ? this.translate.instant('ALL_ASSETS_FINACIAL') : this.translate.instant('INVOICEASSEST');
    this.type = this.documentService.setDocumentUrlType(this.router);
    this.documentLineGrid.view = this.service.linesToDisplay('data');
    this.createAddForm();
    this.documentService.setDocumentType(this.documentType);
    this.warningParagraph = this.isRestaurn ? 'VALIDATE_FINANCIAL_ASSET_WARRINIG_PARAGRAPH' : 'VALIDATE_ASSET_WARRINIG_PARAGRAPH';
    this.validateDocumentText = this.isRestaurn ? 'VALIDATE_FINANCIAL_ASSET' : 'VALIDATE_ASSET';
    this.validationMessageServiceInformation = InformationTypeEnum.SALES_INVOICE_ASSET_VALIDATION;
    this.addMessageServiceInformation = InformationTypeEnum.SALES_INVOICE_ASSET_ADD;
    this.backToListLink = this.isRestaurn ? DocumentConstant.SALES_ASSEST_FINACIA_URL : DocumentConstant.SALES_INOICE_ASSET_URL;
    this.routerReportLink = DocumentConstant.SALES_ASSET_REPORT_URL;
    this.getListReportTemplate();
    if (this.id > 0) {
      this.getDataToUpdate();
    }
    super.ngOnInit();
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

  /**
* focusOnAddLine
*/
  public focusOnAddLine() {
    this.documentLineGrid.focusOnAddLineButton();
  }


  public loadPrintDocumentRole() {
    if (this.isRestaurn) {
      this.permissionsService.hasPermission(RoleConfigConstant.PRINT.SALESFINANCIALASSET).then(x => this.printDocumentRole = x);
    } else if (this.documentType === DocumentEnumerator.SalesInvoiceAsset) {
      this.permissionsService.hasPermission(RoleConfigConstant.PRINT.SALESINVOICEASSET).then(x => this.printDocumentRole = x);
    }
  }

  public loadUpdateValidDocumentRole() {
    this.updateValidDocumentRole = false;
  }

  public loadDeleteValidDocumentRole() {
    if (this.isRestaurn) {
      this.permissionsService.hasPermission(RoleConfigConstant.DELETE.SALESFINANCIALASSET).then(x => this.printDocumentRole = x);
    } else if (this.documentType === DocumentEnumerator.SalesInvoiceAsset) {
      this.permissionsService.hasPermission(RoleConfigConstant.DELETE.SALESINVOICEASSET_SA).then(x => this.deleteDocumentLineRole = x);
    }
  }
  selectedTier(data: any) {
    if (data) {
      this.salesSettingsCombo.tierSelected(data);
    }
  }
}

