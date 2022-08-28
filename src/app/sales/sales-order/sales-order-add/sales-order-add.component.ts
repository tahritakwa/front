import { Component, OnInit, OnDestroy, ViewChild, ViewContainerRef, AfterViewInit, ComponentRef } from '@angular/core';
import { DocumentEnumerator, documentStateCode, documentStatusCode } from '../../../models/enumerators/document.enum';
import { DocumentConstant } from '../../../constant/sales/document.constant';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InformationTypeEnum } from '../../../shared/services/signalr/information/information.enum';
import { TranslateService } from '@ngx-translate/core';
import { DocumentService } from '../../services/document/document.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { DocumentAddComponent } from '../../../shared/components/document/document-add/document-add.component';
import { ContactDropdownComponent } from '../../../shared/components/contact-dropdown/contact-dropdown.component';
import { GridSalesInvoiceAssestsComponent } from '../../components/grid-sales-invoice-assests/grid-sales-invoice-assests.component';
import { CurrencyService } from '../../../administration/services/currency/currency.service';
import { DocumentFormService } from '../../../shared/services/document/document-grid.service';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { digitsAfterComma, ValidationService } from '../../../shared/services/validation/validation.service';
import { CrudGridService } from '../../services/document-line/crud-grid.service';
import { FormModalDialogService } from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { FileInfo } from '../../../models/shared/objectToSend';
import { MessageService } from '../../../shared/services/signalr/message/message.service';
import { ReportTemplateService } from '../../../shared/services/report-template/report-template.service';
import { LanguageService } from '../../../shared/services/language/language.service';
import { SearchItemService } from '../../services/search-item/search-item.service';
import { StarkPermissionsService, StarkRolesService } from '../../../stark-permissions/stark-permissions.module';
import { FileService } from '../../../shared/services/file/file-service.service';
import { SupplierDropdownComponent } from '../../../shared/components/supplier-dropdown/supplier-dropdown.component';
import { BTobService } from '../../../Structure/b-tob-notif/service/b-tob.service';
import { ObjectToValidate } from '../../../models/sales/object-to-save.model';
import { RoleConfigConstant } from '../../../Structure/_roleConfigConstant';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { ItemConstant } from '../../../constant/inventory/item.constant';
import { ActivityAreaEnumerator } from '../../../models/enumerators/activity-area.enum';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { LocalStorageService } from '../../../login/Authentification/services/local-storage-service';
import { TiersService } from '../../../purchase/services/tiers/tiers.service';
import { IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import swal from 'sweetalert2';
import { ModalDialogInstanceService } from 'ngx-modal-dialog/src/modal-dialog-instance.service';

const ORDER = 'ORDER';
@Component({
  selector: 'app-sales-order-add',
  templateUrl: './sales-order-add.component.html',
  styleUrls: ['./sales-order-add.component.scss']
})
export class SalesOrderAddComponent extends DocumentAddComponent implements OnInit, OnDestroy {

  // contact dropdown
  @ViewChild(ContactDropdownComponent) public childListContactDropDown;
  @ViewChild(GridSalesInvoiceAssestsComponent) public documentLineGrid;

  @ViewChild('tiersDropDown') tiersDropDownEl: SupplierDropdownComponent;
  /** document Title Asset */
  documentTitle: string;

  /** action to Do (Add, edit, show ) */
  type: string;

  /** document Type */
  documentType = DocumentEnumerator.SalesOrder;
  currentDate = new Date();
  public isEsnVersion: boolean;
  public validateOrderPermission_SA = false;
  public printOrderPermission_SA = false;
  public showCustomerDetails = false;
  public hideCustomerAddBtn = false;
  public isUpdateMode = false;
  public hasUpdatePermission: boolean;
  public hasAddPermission: boolean;
  public hasUpdateValidOrderPermission: boolean;
  public showAdvanceAmountModal = false;
  public dialogOptions: Partial<IModalDialogOptions<any>>;
  public addAmountFormGroup: FormGroup;
  public idDoc: number;
  public hasGenerateDepositInvoicePermission = false;
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
    protected fileServiceService: FileService,
    private b2bService: BTobService, private localStorageService: LocalStorageService,
    protected rolesService: StarkRolesService, protected growlService: GrowlService,
    public authService: AuthService, protected tiersService: TiersService, private modalService: ModalDialogInstanceService) {
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
    this.route.params.subscribe(params => {
      const idDocument = +params[DocumentConstant.ID]; // (+) converts string InvoiceConstants.ID to a number
      const idStatusParam = +params[DocumentConstant.STATUS_PARAM];
      if (idDocument) {
        this.id = idDocument;
      }
      if (idStatusParam) {
        this.idStatus = idStatusParam;
      }
    });
    this.attachmentFilesToUpload = new Array<FileInfo>();
    this.isSalesDocumment = true;
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
      Code: [{ value: 'ORDER/' + this.currentDate.getFullYear(), disabled: true }],
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
      DocumentTypeCode: [this.documentEnumerator.SalesOrder],
      IdDocumentAssociated: [null],
      IsBToB: [0],
      ProvisionalCode: ['']
    });
  }
  ngOnInit() {
    this.validateOrderPermission_SA = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.VALIDATE_ORDER_SALES);
    this.printOrderPermission_SA = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.PRINT_ORDER_SALES);
    this.showCustomerDetails = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_CUSTOMER);
    this.hideCustomerAddBtn = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.ADD_CUSTOMER);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_ORDER_SALES);
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.ADD_ORDER_SALES);
    this.hasUpdateValidOrderPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_VALID_ORDER_SALES);
    this.hasUpdateTTCAmountPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_TTC_AMOUNT);
    this.hasGenerateDepositInvoicePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.GENERATE_DEPOSIT_INVOICE);
    this.type = this.documentService.setDocumentUrlType(this.router);
    if (this.documentLineGrid) {
      this.documentLineGrid.view = this.service.linesToDisplay('data');
    }
    this.createAddForm();
    this.getListReportTemplate();
    if (this.id > 0) {
      this.isUpdateMode = true;
      this.getDataToUpdate();
    }
    this.documentTitle = this.translate.instant(ORDER);
    this.documentService.setDocumentType(this.documentType);
    this.warningParagraph = 'VALIDATE_ORDER_WARRINIG_PARAGRAPH';
    this.validateDocumentText = 'VALIDATE_ORDER';
    this.validationMessageServiceInformation = InformationTypeEnum.SALES_ORDER_VALIDATION;
    this.addMessageServiceInformation = InformationTypeEnum.SALES_ORDER_ADD;
    this.backToListLink = DocumentConstant.SALES_ORDER_URL;
    this.routerReportLink = DocumentConstant.SALES_ORDER_REPORT_URL;
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

  async validate() {
    if (!this.isSubmited) {
      await this.saveDocumentMessageNotification();
      this.validateAfterSubmit();
    } else {
      this.validateAfterSubmit();
    }

  }

  private validateAfterSubmit() {
    this.prepareDocument();
    if (this.documentForm.valid) {
      this.objectToValidate = new ObjectToValidate(this.documentForm.controls['Id'].value);
      this.documentService.isAnyLineWithoutPrice(this.documentForm.controls['Id'].value).subscribe(x => {
        if (x.objectData === true) {
          this.swalWarrings.CreateSwal(this.translate.instant('SOME_LINES_ARE_ZERO')
            , this.translate.instant('VALIDATE'), this.translate.instant('VALIDATE')).then((result) => {
              if (result.value) {
                this.validateDocument();
              }
            });
        }
        else {
          this.validateDocument();
        }
      });

    } else {
      this.validationService.validateAllFormFields(this.documentForm);
    }
  }
  /**
   * validate Document
   */
  validateDocument() {
    if (this.documentForm.controls['IsBToB'].value == false) {
      this.documentService.validateDocument(this.objectToValidate).
        subscribe((res) => {
          this.getDataToUpdate(res.Id);
          this.sendValidationMessage(res);
          this.b2bService.sendNotification();
        });
    } else {
      this.documentService.ValidateOrderBtoB(this.objectToValidate).subscribe((res) => {
        this.getDataToUpdate(res.Id);
        this.sendValidationMessage(res);
        this.b2bService.sendNotification();
      });
    }
  }
  public async onDownloadClick($event) {
    this.downloadOperation($event);
  }

  private downloadOperation($event) {
    super.onDownloadClick($event);
  }

  public loadPrintDocumentRole() {
    if (this.documentType === DocumentEnumerator.SalesOrder) {
      this.updateValidDocumentRole = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_VALID_ORDER_SALES);
    }
  }
  public loadUpdateValidDocumentRole() {
    if (this.documentType === DocumentEnumerator.SalesOrder) {
      this.updateValidDocumentRole = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_VALID_ORDER_SALES);
    }
  }

  public loadDeleteValidDocumentRole() {
    if (this.documentType === DocumentEnumerator.SalesOrder) {
      this.permissionsService.hasPermission(RoleConfigConstant.DELETE.SALESORDER_SA).then(x => this.deleteDocumentLineRole = x);
    }
  }
  public generateDepositInvoiceClick() {
    if (this.showGenerateDepositInvoiceButton) {
      this.showAdvanceAmountModal = true;
      this.addAmountFormGroup = this.fb.group({
        IdItem: [undefined, Validators.required],
        Amount: ['', {
          validators: [Validators.min(NumberConstant.ZERO), digitsAfterComma(this.currentDocument.IdUsedCurrencyNavigation.Precision), Validators.required,
          Validators.max(this.documentForm.controls['DocumentTtcpriceWithCurrency'].value)]
        }]
      });
    }
  }
  public advanceItemSelected($event) {
    if ($event && $event.itemComponent && $event.itemComponent.dataItem && $event.itemComponent.dataItem.UnitHtsalePrice) {
      this.addAmountFormGroup.controls['Amount'].setValue($event.itemComponent.dataItem.UnitHtsalePrice);
    }
  }
  public onAddAmountClick() {
    if (this.addAmountFormGroup.valid) {
      this.showAdvanceAmountModal = false;
      var amount = this.addAmountFormGroup.controls['Amount'].value;
      var IdItem = this.addAmountFormGroup.controls['IdItem'].value;
      this.documentService.GenerateDepositInvoiceFromOrder(this.currentDocument.Id, amount, IdItem).subscribe(data => {
        if (data) {
          this.showGenerateDepositInvoiceButton = false;
          this.closeAmountModal(true);
        }
        let message: string = this.translate.instant(DocumentConstant.DEPOSIT_INVOICE_GENERATED);
        if (this.authService.hasAuthorities([PermissionConstant.CommercialPermissions.UPDATE_INVOICE_SALES, PermissionConstant.CommercialPermissions.SHOW_INVOICE_SALES])) {

          message = message.concat('<a target="_blank" rel="noopener noreferrer" href="/main/sales/invoice/edit/' +
            data.Id + '/1" > ' + data.Code + '</a>');
        } else {

          message = message.concat('<span> ' + data.Code + '</span>');

        }
        if (this.dialogOptions) {
          this.dialogOptions.onClose();
        }
        swal.fire({
          icon: SharedConstant.SUCCESS,
          html: message,
        });

      });
      this.closeAmountModal(true);
    } else {
      this.validationService.validateAllFormFields(this.addAmountFormGroup);
    }
  }

  public generateInvoiceClick() {
    this.documentService.GenerateInvoiceFromOrder(this.id).subscribe(data => {
      if (data) {
        let message: string = this.translate.instant(DocumentConstant.INVOICE_GENERATED);
        if (this.authService.hasAuthorities([PermissionConstant.CommercialPermissions.UPDATE_INVOICE_SALES, PermissionConstant.CommercialPermissions.SHOW_INVOICE_SALES])) {

          message = message.concat('<a target="_blank" rel="noopener noreferrer" href="/main/sales/invoice/edit/' +
            data.Id + '/1" > ' + data.Code + '</a>');
        } else {

          message = message.concat('<span> ' + data.Code + '</span>');

        }
        if (this.dialogOptions) {
          this.dialogOptions.onClose();
        }
        swal.fire({
          icon: SharedConstant.SUCCESS,
          html: message,
        });
        this.showGenerateInvoiceButton = false;
        this.showGenerateDepositInvoiceButton = false;
      }

    });
  }
  public closeAmountModal(generatedDepositInvoice: any) {
    if (generatedDepositInvoice) {
      this.showGenerateDepositInvoiceButton = false;
    } else {
      this.showGenerateDepositInvoiceButton = true;
    }
    this.showAdvanceAmountModal = false;
    this.modalService.closeAnyExistingModalDialog();
    if (document && document.body && document.body.style) {
      document.body.style.overflow = 'auto';
    }
    this.removeAllModal();

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
  public removeAllModal() {
    const modal = document.getElementsByClassName('modal-backdrop show');
    if (modal.length > 0) {
      modal[0].className = '';
      this.removeAllModal();
    }
  }
}
