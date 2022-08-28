import { Component, OnInit, ViewChild, ViewContainerRef, OnDestroy, AfterViewInit } from '@angular/core';
import { DocumentEnumerator } from '../../../models/enumerators/document.enum';
import { DocumentConstant } from '../../../constant/sales/document.constant';
import { FormBuilder, Validators } from '@angular/forms';
import { InformationTypeEnum } from '../../../shared/services/signalr/information/information.enum';
import { TranslateService } from '@ngx-translate/core';
import { DocumentService } from '../../../sales/services/document/document.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { CurrencyService } from '../../../administration/services/currency/currency.service';
import { DocumentFormService } from '../../../shared/services/document/document-grid.service';
import { ContactDropdownComponent } from '../../../shared/components/contact-dropdown/contact-dropdown.component';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { ValidationService } from '../../../shared/services/validation/validation.service';
import { FormModalDialogService } from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { MessageService } from '../../../shared/services/signalr/message/message.service';
import { FileInfo } from '../../../models/shared/objectToSend';
import {
  GridPurchaseInvoiceAssestsBudgetComponent
} from '../../components/grid-purchase-invoice-assests-budget/grid-purchase-invoice-assests-budget.component';
import { CrudGridService } from '../../../sales/services/document-line/crud-grid.service';
import { DocumentAddComponent } from '../../../shared/components/document/document-add/document-add.component';
import { ReportTemplateService } from '../../../shared/services/report-template/report-template.service';
import { LanguageService } from '../../../shared/services/language/language.service';
import { SearchItemService } from '../../../sales/services/search-item/search-item.service';
import { StarkPermissionsService, StarkRolesService } from '../../../stark-permissions/stark-permissions.module';
import { FileService } from '../../../shared/services/file/file-service.service';
import { SupplierDropdownComponent } from '../../../shared/components/supplier-dropdown/supplier-dropdown.component';
import { RoleConfigConstant } from '../../../Structure/_roleConfigConstant';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { ItemConstant } from '../../../constant/inventory/item.constant';
import { ActivityAreaEnumerator } from '../../../models/enumerators/activity-area.enum';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { LocalStorageService } from '../../../login/Authentification/services/local-storage-service';
import { TiersService } from '../../services/tiers/tiers.service';

const ASSET = 'ASSET';
@Component({
  selector: 'app-purchase-asset-add',
  templateUrl: './purchase-asset-add.component.html',
  styleUrls: ['./purchase-asset-add.component.scss']
})
export class PurchaseAssetAddComponent extends DocumentAddComponent implements OnInit, OnDestroy {

  // contact dropdown
  @ViewChild(ContactDropdownComponent) public childListContactDropDown;
  @ViewChild(GridPurchaseInvoiceAssestsBudgetComponent) public documentLineGrid;
  @ViewChild('tiersDropDown') tiersDropDownEl: SupplierDropdownComponent;
  /** document Title Asset */
  documentTitle: string;

  /** action to Do (Add, edit, show ) */
  type: string;

  /** document Type */
  documentType = DocumentEnumerator.PurchaseAsset;
  currentDate = new Date();
  public isEsnVersion: boolean;
  public validateAssetPermission_PU = false;
  public printAssetPermission_PU = false;
  public showSupplierDetails = false;
  public hideSupplierAddBtn = false;
  public isUpdateMode = false;
  public hasUpdatePermission: boolean;
  public hasAddPermission: boolean;



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
    protected languageService: LanguageService,
    protected searchItemService: SearchItemService,
    protected permissionsService: StarkPermissionsService,
    protected fileServiceService: FileService,
    protected rolesService: StarkRolesService, protected growlService: GrowlService,
    public authService: AuthService, private localStorageService: LocalStorageService, protected tiersService: TiersService) {
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
      service, serviceReportTemplate, languageService,
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
      Code: [{ value: 'Avoir/' + this.currentDate.getFullYear(), disabled: true }],
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
      DocumentTypeCode: [this.documentEnumerator.PurchaseAsset],
      IdDocumentAssociated: [null],
      IsGenerated: [false],
      ProvisionalCode: ['']
    });

  }
  ngOnInit() {
    this.validateAssetPermission_PU = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.VALIDATE_ASSET_PURCHASE);
    this.printAssetPermission_PU = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.PRINT_ASSET_PURCHASE);
    this.showSupplierDetails = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_SUPPLIER);
    this.hideSupplierAddBtn = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.ADD_SUPPLIER);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_ASSET_PURCHASE);
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.ADD_ASSET_PURCHASE);
    this.type = this.documentService.setDocumentUrlType(this.router);
    this.documentLineGrid.view = this.service.linesToDisplay('data');
    this.createAddForm();
    this.getListReportTemplate();
    if (this.id > 0) {
      this.getDataToUpdate();
    }
    this.documentTitle = this.translate.instant(ASSET);
    this.documentService.setDocumentType(this.documentType);
    this.warningParagraph = 'VALIDATE_ASSET_WARRINIG_PARAGRAPH';
    this.validateDocumentText = 'VALIDATE_ASSET';
    this.validationMessageServiceInformation = InformationTypeEnum.PURCHASE_ASSET_VALIDATION;
    this.addMessageServiceInformation = InformationTypeEnum.PURCHASE_PURCHASE_ASSET_ADD;
    this.routerReportLink = DocumentConstant.PURCHASE_ASSET_REPORT_URL;
    this.backToListLink = DocumentConstant.PURCHASE_ASSET_URL;
    this.attachmentFilesToUpload = new Array<FileInfo>();
    super.ngOnInit();
    if (this.isUpdateMode && !this.hasUpdatePermission
      && this.documentForm.controls['IdDocumentStatus'].value === this.statusCode.Provisional) {
      this.documentForm.disable();
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


  public async onDownloadClick($event) {
    this.downloadOperation($event);
  }

  private downloadOperation($event) {
    super.onDownloadClick($event);
  }

  public loadPrintDocumentRole() {
    if (this.documentType === DocumentEnumerator.PurchaseAsset) {
      this.permissionsService.hasPermission(RoleConfigConstant.PRINT.PURCHASEASSET).then(x =>
        this.printDocumentRole = x);
    }
  }

  public loadUpdateValidDocumentRole() {
    if (this.documentType === DocumentEnumerator.PurchaseAsset) {
      this.permissionsService.hasPermission(RoleConfigConstant.UPDATE.PURCHASEASSET_SA).then(x =>
        this.updateValidDocumentRole = x);
    }
  }

  public loadDeleteValidDocumentRole() {
    if (this.documentType === DocumentEnumerator.PurchaseAsset) {
      this.permissionsService.hasPermission(RoleConfigConstant.DELETE.PURCHASEASSET_SA).then(x =>
        this.deleteDocumentLineRole = x);
    }

  }
}
