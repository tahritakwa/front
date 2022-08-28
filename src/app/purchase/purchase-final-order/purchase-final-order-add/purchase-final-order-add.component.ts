import { Component, OnInit, OnDestroy, ViewContainerRef, ViewChild } from '@angular/core';
import { DocumentAddComponent } from '../../../shared/components/document/document-add/document-add.component';
import { CurrencyService } from '../../../administration/services/currency/currency.service';
import { DocumentFormService } from '../../../shared/services/document/document-grid.service';
import { MessageService } from '../../../shared/services/signalr/message/message.service';
import { ReportTemplateService } from '../../../shared/services/report-template/report-template.service';
import { DocumentService } from '../../../sales/services/document/document.service';
import { LanguageService } from '../../../shared/services/language/language.service';
import { TranslateService } from '@ngx-translate/core';
import { CrudGridService } from '../../../sales/services/document-line/crud-grid.service';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { ValidationService } from '../../../shared/services/validation/validation.service';
import { FormModalDialogService } from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Validators, FormBuilder } from '@angular/forms';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { InformationTypeEnum } from '../../../shared/services/signalr/information/information.enum';
import { DocumentConstant } from '../../../constant/sales/document.constant';
import { ContactDropdownComponent } from '../../../shared/components/contact-dropdown/contact-dropdown.component';
import {
  GridPurchaseInvoiceAssestsBudgetComponent
} from '../../components/grid-purchase-invoice-assests-budget/grid-purchase-invoice-assests-budget.component';
import { FileInfo } from '../../../models/shared/objectToSend';
import { DocumentEnumerator } from '../../../models/enumerators/document.enum';
import { SearchItemService } from '../../../sales/services/search-item/search-item.service';
import { StarkPermissionsService, StarkRolesService } from '../../../stark-permissions/stark-permissions.module';
import { FileService } from '../../../shared/services/file/file-service.service';
import { RoleConfigConstant } from '../../../Structure/_roleConfigConstant';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { ItemConstant } from '../../../constant/inventory/item.constant';
import { ActivityAreaEnumerator } from '../../../models/enumerators/activity-area.enum';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { LocalStorageService } from '../../../login/Authentification/services/local-storage-service';
import { TiersService } from '../../services/tiers/tiers.service';

const FINAL_ORDER = 'FINAL_ORDER';

@Component({
  selector: 'app-purchase-final-order-add',
  templateUrl: './purchase-final-order-add.component.html',
  styleUrls: ['./purchase-final-order-add.component.scss']
})
export class PurchaseFinalOrderAddComponent extends DocumentAddComponent implements OnInit, OnDestroy {

  @ViewChild(ContactDropdownComponent) public childListContactDropDown;
  @ViewChild(GridPurchaseInvoiceAssestsBudgetComponent) public documentLineGrid;

  documentTitle: string;
  currentDate = new Date();
  isClosed = true;
  documentType = DocumentEnumerator.PurchaseFinalOrder;
  public isEsnVersion: boolean;
  public validateFinalOrderPermission_PU = false;
  public printFinalOrderPermission_PU = false;
  public showSupplierDetails = false;
  public hideSupplierAddBtn = false;
  public hasAddPermission = false;
  public hasUpdatePermission = false;
  public isUpdateMode = false;

  ngOnDestroy(): void {
    this.destroy();
  }

  constructor(
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
    protected serviceReportTemplate: ReportTemplateService, protected languageService: LanguageService,
    private fb: FormBuilder,
    protected searchItemService: SearchItemService,
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
      service, serviceReportTemplate,
      languageService,
      permissionsService,
      searchItemService,
      fileServiceService, rolesService, growlService,
      tiersService);

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
      Code: [{ value: this.translate.instant(FINAL_ORDER) + '/' + this.currentDate.getFullYear(), disabled: true }],
      IdCurrency: [{ value: '', disabled: true }, Validators.required],
      IdContact: [{ value: '', disabled: this.isDisabledForm() }],
      DocumentHtpriceWithCurrency: [{ value: NumberConstant.ZERO, disabled: true }],
      DocumentTotalVatTaxesWithCurrency: [{ value: NumberConstant.ZERO, disabled: true }],
      DocumentTtcpriceWithCurrency: [{ value: NumberConstant.ZERO, disabled: true }],
      DocumentTtcprice: [{ value: NumberConstant.ZERO, disabled: true }],
      DocumentTotalDiscountWithCurrency: [{ value: NumberConstant.ZERO, disabled: true }],
      DocumentTotalExcVatTaxesWithCurrency: [{ value: NumberConstant.ZERO, disabled: true }],
      DocumentPriceIncludeVatWithCurrency: [{ value: NumberConstant.ZERO, disabled: true }],
      DocumentAmountPaidWithCurrency: [0],
      DocumentRemainingAmountWithCurrency: [0],
      DocumentTypeCode: [this.documentEnumerator.PurchaseFinalOrder],
      IdDocumentAssociated: [null],
      IdDocumentAssociatedStatus: [1],
      DocumentAssociatedType: [this.documentEnumerator.PurchaseOrder],
      IsGenerated: [false],
      ProvisionalCode: [''],
      Reference: [{ value: '', disabled: this.isDisabledForm() }],
    });
  }


  ngOnInit() {
    this.validateFinalOrderPermission_PU = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.VALIDATE_FINAL_ORDER_PURCHASE);
    this.printFinalOrderPermission_PU = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.PRINT_FINAL_ORDER_PURCHASE);
    this.showSupplierDetails = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_SUPPLIER);
    this.hideSupplierAddBtn = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.ADD_SUPPLIER);
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.ADD_FINAL_ORDER_PURCHASE);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_FINAL_ORDER_PURCHASE);
    super.ngOnInit();
    this.createAddForm();
    this.getListReportTemplate();
    if (this.id > 0) {
      this.getDataToUpdate();
    }
    this.documentTitle = this.translate.instant(FINAL_ORDER);
    this.documentService.setDocumentType(this.documentType);
    this.warningParagraph = 'VALIDATE_FINAL_ORDER_WARRINIG_PARAGRAPH';
    this.validateDocumentText = 'VALIDATE_FINAL_ORDER';
    this.validationMessageServiceInformation = InformationTypeEnum.PURCHASE_FINAL_ORDER_VALIDATION;
    this.addMessageServiceInformation = InformationTypeEnum.PURCHASE_FINAL_ORDER_ADD;
    this.backToListLink = DocumentConstant.PURCHASE_FINAL_ORDER_URL;
    this.routerReportLink = DocumentConstant.PURCHASE_FINAL_ORDER_REPORT_URL;
    if (this.isUpdateMode && !this.hasUpdatePermission
      && this.documentForm.controls['IdDocumentStatus'].value === this.statusCode.Provisional) {
      this.documentForm.disable();
    }
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
    if (this.documentType === DocumentEnumerator.PurchaseFinalOrder) {
      this.permissionsService.hasPermission(RoleConfigConstant.PRINT.PURCHASEFINALORDER).then(x =>
        this.printDocumentRole = x);
    }
  }

  public loadUpdateValidDocumentRole() {
    if (this.documentType === DocumentEnumerator.PurchaseFinalOrder) {
      this.permissionsService.hasPermission(RoleConfigConstant.UPDATE.PURCHASEFINALORDER_SA).then(x =>
        this.updateValidDocumentRole = x);
    }
  }

  public loadDeleteValidDocumentRole() {
    if (this.documentType === DocumentEnumerator.PurchaseFinalOrder) {
      this.permissionsService.hasPermission(RoleConfigConstant.DELETE.PURCHASEFINALORDER_SA).then(x =>
        this.deleteDocumentLineRole = x);
    }
  }
}
