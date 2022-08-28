import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DocumentConstant } from '../../../constant/sales/document.constant';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentEnumerator, documentStatusCode } from '../../../models/enumerators/document.enum';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { TranslateService } from '@ngx-translate/core';
import { DocumentService } from '../../services/document/document.service';
import { InformationTypeEnum } from '../../../shared/services/signalr/information/information.enum';
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
import { Filter, Operation, OrderBy, OrderByDirection, PredicateFormat } from '../../../shared/utils/predicate';
import { ReportTemplateService } from '../../../shared/services/report-template/report-template.service';
import { LanguageService } from '../../../shared/services/language/language.service';
import { ObjectToSend, ObjectToValidate } from '../../../models/sales/object-to-save.model';
import { SupplierDropdownComponent } from '../../../shared/components/supplier-dropdown/supplier-dropdown.component';
import { SearchItemService } from '../../services/search-item/search-item.service';
import { LastBLItemPrice } from '../../../models/sales/last-bl-item-price.model';
import { DetailsProductComponent } from '../../../shared/components/item/details-product/details-product.component';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { StarkPermissionsService, StarkRolesService } from '../../../stark-permissions/stark-permissions.module';
import { FileService } from '../../../shared/services/file/file-service.service';
import { ImportOrderDocumentLinesComponent } from '../../components/import-order-document-lines/import-order-document-lines.component';
import { RoleConfigConstant } from '../../../Structure/_roleConfigConstant';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { ItemConstant } from '../../../constant/inventory/item.constant';
import { ActivityAreaEnumerator } from '../../../models/enumerators/activity-area.enum';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { LocalStorageService } from '../../../login/Authentification/services/local-storage-service';
import { VehicleDropdownComponent } from '../../components/vehicle-dropdown/vehicle-dropdown.component';
import { CompanyService } from '../../../administration/services/company/company.service';
import { ReducedCompany } from '../../../models/administration/reduced-company.model';
import { TiersService } from '../../../purchase/services/tiers/tiers.service';
import { ActivitySectorsEnumerator } from '../../../models/shared/enum/activitySectors.enum';

const DELIVERY_FORM = 'DELIVERY_FORM';
const REPORT_NAME = 'report_';
@Component({
  selector: 'app-delivery-forms-add',
  templateUrl: './delivery-forms-add.component.html',
  styleUrls: ['./delivery-forms-add.component.scss']
})
export class DeliveryFormsAddComponent extends DocumentAddComponent implements OnInit, OnDestroy, OnChanges {
  public openTiersDetailsCollapse = true;
  public DocumentStatusCode = documentStatusCode;
  // contact dropdown
  @ViewChild(ContactDropdownComponent) public childListContactDropDown;
  @ViewChild(GridSalesInvoiceAssestsComponent) public documentLineGrid;
  @ViewChild('tiersDropDown') tiersDropDownEl: SupplierDropdownComponent;
  @ViewChild('vehicleDropDown') vehicleDropDown: VehicleDropdownComponent;
  @Input() idDocFromSearchItem: number;
  /** document Title Asset */
  documentTitle: string;
  /** action to Do (Add, edit, show ) */
  type: string;
  /** document Type */
  documentType = DocumentEnumerator.SalesDelivery;
  dataToSend;
  PrintWithOutValidate: boolean;
  currentDate = new Date();
  LastBLItemPrice: LastBLItemPrice;
  public isEsnVersion: boolean;
  public validateDeliveryPermission_SA = false;
  public printDeliveryPermission_SA = false;
  public fusionDeliveryPermission_SA = false;
  public showCustomerDetails = false;
  public hideCustomerAddBtn = false;
  public isUpdateMode = false;
  public hasUpdatePermission: boolean;
  public hasListPermission: boolean;
  public currentCompany: ReducedCompany;
  public activityArea;


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
    protected rolesService: StarkRolesService, private localStorageService: LocalStorageService,
    protected fileServiceService: FileService, protected growlService: GrowlService, public authService: AuthService,
    protected tiersService: TiersService, public serviceComany: CompanyService) {
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
      fileServiceService,
      rolesService, growlService, tiersService);
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
    this.activityArea = this.localStorageService.getActivityArea()
    this.isEsnVersion = this.activityArea === ActivityAreaEnumerator.Esn;
    this.showVehicleDropdown = this.activityArea == ActivityAreaEnumerator.Auto ? true : false;
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
      Code: [{ value: 'DELIVERY/' + this.currentDate.getFullYear(), disabled: true }],
      Reference: [{ value: '', disabled: this.isDisabledForm() }],
      IdCurrency: [{ value: '', disabled: true }, Validators.required],
      IdContact: [{ value: '', disabled: this.isDisabledForm() }],
      IdVehicle: [{ value: '', disabled: this.isDisabledForm() }],
      IdDeliveryType: [{ value: null, disabled: this.isDisabledForm() }],
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
      DocumentTypeCode: [this.documentEnumerator.SalesDelivery],
      IdDocumentAssociated: [null],
      isAllLinesAreAvailbles: [''],
      IsTermBilling: [{ value: true, disabled: this.isDisabledForm() }],
      hasSalesInvoices: [false],
      IsSynchronizedBtoB: [false],
      // used just in front to know if the document is created from search item or not
      isFromSearch: [this.idDocFromSearchItem > 0],
      ProvisionalCode: [''],
      haveReservedLines: [''],
      IsForPos: [false],
      Name: [''],
      Tel1: [''],
      MatriculeFiscale: [''],
      Adress: [''],
    });
  }

  public checkForPreviousProvisinalDSA(): void {
    // redicet to last provisional D-SA
    if (this.documentForm.controls['IdTiers'].value && this.documentForm.controls['IdDocumentStatus'].value === this.statusCode.Provisional ) {
      const predicate = new PredicateFormat();
      predicate.Filter = new Array<Filter>();
      predicate.Filter.push(new Filter(DocumentConstant.DOCUMENT_TYPE_CODE, Operation.eq, DocumentEnumerator.SalesDelivery));
      predicate.Filter.push(new Filter(DocumentConstant.ID_TIERS, Operation.eq, this.documentForm.controls['IdTiers'].value));
      predicate.Filter.push(new Filter(DocumentConstant.ID_DOCUMENT_STATUS, Operation.eq, documentStatusCode.Provisional));
      predicate.OrderBy = new Array<OrderBy>();
      predicate.OrderBy.push(new OrderBy(DocumentConstant.ID_DOCUMENT, OrderByDirection.desc));
      this.documentService.getModelByCondition(predicate).subscribe(data => {
        if (data != null) {
          this.isAbledToMerge = true;
          this.swalWarrings.CreateSwal(DocumentConstant.SALES_REDIRECT_DELEVERY_TEXT, null,
            DocumentConstant.SALES_REDIRECT_DELEVERY_CONFIRM,
            DocumentConstant.SALES_REDIRECT_DELEVERY_CANCEL, false, false).then((result) => {
              if (result.value) {
                this.router.navigateByUrl(
                  DocumentConstant.SALES_DELEVERY_EDIT_URL.concat(data.Id + '/' + data.IdDocumentStatus));
              } else {
                this.focusOnAddLine();
                this.tiersDropDownEl.fromSwalWarningEvent = true;
              }
            });
        } else {
          this.focusOnAddLine();
        }
      });
    }
  }

  ngOnInit() {
    this.validateDeliveryPermission_SA = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.VALIDATE_DELIVERY_SALES);
    this.printDeliveryPermission_SA = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.PRINT_DELIVERY_SALES);
    this.fusionDeliveryPermission_SA = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.FUSION_DELIVERY_SALES);
    this.showCustomerDetails = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_CUSTOMER);
    this.hideCustomerAddBtn = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.ADD_CUSTOMER);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_DELIVERY_SALES);
    this.hasListPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.LIST_DELIVERY_SALES);
    this.hasUpdateTTCAmountPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_TTC_AMOUNT);
    super.ngOnInit();
    this.type = this.documentService.setDocumentUrlType(this.router);
    this.documentLineGrid.view = this.service.linesToDisplay('data');
    this.createAddForm(); 
    this.showVehicleDropdown = this.activityArea == ActivityAreaEnumerator.Auto ? true : false;
    this.getListReportTemplate();
    if (this.idDocFromSearchItem) {
      this.id = this.idDocFromSearchItem;
      this.isFromSearchItemInterfce = true;
    }
    if (this.id > 0) {
      this.getDataToUpdate();
    }
    this.dataToSend = { 'id': this.documentForm.controls['Id'].value, 'reportName': REPORT_NAME };
    this.documentTitle = this.translate.instant(DELIVERY_FORM);
    this.documentService.setDocumentType(this.documentType);
    this.warningParagraph = 'VALIDATE_DELIVERY_WARRINIG_PARAGRAPH';
    this.validateDocumentText = 'VALIDATE_DELIVERY';
    this.validationMessageServiceInformation = InformationTypeEnum.SALES_DELEVERY_NOTE_VALIDATION;
    this.addMessageServiceInformation = InformationTypeEnum.SALES_DELEVERY_NOTE_ADD;
    this.backToListLink = DocumentConstant.SALES_DELIVERY_URL;
    this.routerReportLink = DocumentConstant.SALES_DELIVERY_REPORT_URL;
    if (this.isUpdateMode && this.documentForm.controls['IdDocumentStatus'].value === this.statusCode.Provisional) {
      if (!this.hasUpdatePermission) {
        this.documentForm.disable();
      }
      if (!this.hasUpdateTTCAmountPermission) {
        this.documentForm.controls['DocumentTtcpriceWithCurrency'].disable();
      }
    }
    this.getCompanyParams();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.idDocFromSearchItem.currentValue && changes.idDocFromSearchItem.previousValue) {
      this.ngOnInit();
    }
  }

  ngOnDestroy() {
    this.destroy();
  }

  /**check if the document is saved or updated before validating */
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
          this.growlService.ErrorNotification(this.translate.instant('SOME_LINES_ARE_ZERO'));
        } else {
          this.validateDocumentDelivery();
        }
      });

    } else {
      this.validationService.validateAllFormFields(this.documentForm);
    }
  }
  /**
   * validate document delivery
   */
  validateDocumentDelivery() {
    this.documentService.validateDocument(this.objectToValidate).
      subscribe((res) => {
        this.documentForm.disable();
        this.getDataToUpdate(res.Id);
        this.sendValidationMessage(res);
      });
  }
  public async onPrintClick($event) {
    if (!this.isSubmited) {
      await this.saveDocumentMessageNotification();
      this.printOperation($event);
    } else {
      this.printOperation($event);
    }
  }

  private printOperation($event) {
    if (this.PrintWithOutValidate === true || (this.documentForm.controls['isAllLinesAreAvailbles'].value === true ||
      this.documentForm.controls['isAllLinesAreAvailbles'].value == null)) {
      // open report modal without validation if there are reserved lines in the grid
      const dataToSend = this.getReportName($event);
      this.openReport(dataToSend);
    } else {
      super.onJasperPrintClick($event);
    }
  }
  /**
   * focusOnAddLine
   */
  public focusOnAddLine() {
    this.documentLineGrid.focusOnAddLineButton();
  }

  public submitCondition(): boolean {
    return this.isSubmitBtnDisplay() && this.isGridEmpty();
  }
  public ShowLastItemInBL($event) {
    if ($event && $event.objectData) {
      this.LastBLItemPrice = new LastBLItemPrice();
      Object.assign(this.LastBLItemPrice, $event.objectData);
    } else {
      this.LastBLItemPrice = undefined;
    }
  }

  onClickGoToDetails(id) {
    const TITLE = '';
    this.formModalDialogService.openDialog(TITLE, DetailsProductComponent,
      this.viewRef, null,
      id, true, SharedConstant.MODAL_DIALOG_SIZE_L);
  }

  getProvisionalBl() {
    const dataToSend = {
      formGroup: this.documentForm,
      isToMergeBl: true
    };
    const TITLE = this.translate.instant('FORK_BL');
    this.formModalDialogService.openDialog(TITLE, ImportOrderDocumentLinesComponent,
      this.viewRef, this.onCloseSearchFetchModal.bind(this),
      dataToSend, true, SharedConstant.MODAL_DIALOG_SIZE_L);
  }
  onCloseSearchFetchModal(data): void {
    this.getDataToUpdate(this.documentForm.controls['Id'].value);
    this.documentLineGrid.loadItems();
  }
  recieveDeliveryType($event) {
    this.documentForm.controls['IdDeliveryType'].setValue($event);
    if (this.documentForm.controls['Id'].value > 0 && !this.isFromSearchItemInterfce) {
      this.changeData();
    }
  }

  public async onDownloadClick($event) {
    this.downloadOperation($event);
  }

  private downloadOperation($event) {
    super.onDownloadClick($event);
  }
  public loadPrintDocumentRole() {
    if (this.documentType === DocumentEnumerator.SalesDelivery) {
      this.permissionsService.hasPermission(RoleConfigConstant.PRINT.SALESDELIVERY).then(x => this.printDocumentRole = x);
    }
  }
  public loadUpdateValidDocumentRole() {
    if (this.documentType === DocumentEnumerator.SalesDelivery) {
      this.updateValidDocumentRole = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_VALID_DELIVERY_SALES);
    }
  }

  public loadDeleteReservedDocumentLineRole() {
    if (this.documentType === DocumentEnumerator.SalesDelivery) {
      this.deleteReservedDocumentLineRole = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.DELETE_RESERVED_LINE);
    }
  }
  selectedTier(data: any) {
    if (data && data.selectedTiers) {
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
    if (data && data.selectedTiers && data.selectedTiers.Id) {


      this.idSelectedTier = data.selectedTiers.Id;
      if (this.vehicleDropDown) {
        this.vehicleDropDown.idTier = this.idSelectedTier;
        this.vehicleDropDown.ngOnInit();
      }
      if (this.documentForm && this.documentForm.controls && this.documentForm.controls['IdVehicle'].value) {
        this.documentForm.controls['IdVehicle'].setValue(null);
        this.vehicleDropDown.ngOnInit();
      }
    } else {
      if (this.vehicleDropDown) {
        this.vehicleDropDown.idTier = 0;
        this.vehicleDropDown.ngOnInit();
      }
      this.idSelectedTier = undefined;
    }
  }
  public vehicleSelected($event) {
    this.prepareDocumentToUpdate();
    if (this.updateDocumentCondition()) {
      this.document.IsSynchronizedBtoB = false;
      const objectToSave = new ObjectToSend(this.document);
      this.documentService.updateDocumentFields(objectToSave).subscribe(x => {
        x.objectData.DocumentDate = new Date(x.objectData.DocumentDate);
        x.objectData.DocumentInvoicingDate = new Date(x.objectData.DocumentInvoicingDate);
        this.documentForm.patchValue(x.objectData);
      });
    }
  }
  public loadVehicleList() {
    if (this.vehicleDropDown && this.idSelectedTier) {
      this.vehicleDropDown.idTier = this.idSelectedTier;
      this.vehicleDropDown.ngOnInit();
    }
  }
  public getCompanyParams() {
    this.serviceComany.getReducedDataOfCompany().subscribe((x: ReducedCompany) => {
      this.currentCompany = x;
      if (this.documentForm && this.currentCompany.NoteIsRequired) {
        this.documentForm.controls['Reference'].setValidators([Validators.required]);
      }
      else if (this.documentForm && !this.currentCompany.NoteIsRequired) {
        this.documentForm.controls['Reference'].clearValidators();
        this.documentForm.controls['Reference'].reset();
      }
    });
  }
}

