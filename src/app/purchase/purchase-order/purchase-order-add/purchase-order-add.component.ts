import {
  Component, OnInit, ViewChild, ViewContainerRef,
  OnDestroy, Output, EventEmitter, AfterViewInit
} from '@angular/core';
import { DocumentAddComponent } from '../../../shared/components/document/document-add/document-add.component';
import { FormBuilder, Validators } from '@angular/forms';
import { CurrencyService } from '../../../administration/services/currency/currency.service';
import { DocumentFormService } from '../../../shared/services/document/document-grid.service';
import { TranslateService } from '@ngx-translate/core';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { DocumentService } from '../../../sales/services/document/document.service';
import { ValidationService, strictSup } from '../../../shared/services/validation/validation.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CrudGridService } from '../../../sales/services/document-line/crud-grid.service';
import { FormModalDialogService } from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { MessageService } from '../../../shared/services/signalr/message/message.service';
import { DocumentConstant } from '../../../constant/sales/document.constant';
import { FileInfo } from '../../../models/shared/objectToSend';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { InformationTypeEnum } from '../../../shared/services/signalr/information/information.enum';
import { ContactDropdownComponent } from '../../../shared/components/contact-dropdown/contact-dropdown.component';
import { DocumentEnumerator } from '../../../models/enumerators/document.enum';
import { PurchaseOrderConstant } from '../../../constant/purchase/purchase-order.constant';
import { AddDevisComponent } from '../../devis/add-devis/add-devis.component';
import { Document } from '../../../models/sales/document.model';
import { ObjectToSave, ObjectToSend } from '../../../models/sales/object-to-save.model';
import { ReportTemplateService } from '../../../shared/services/report-template/report-template.service';
import { LanguageService } from '../../../shared/services/language/language.service';
import { TiersPriceRequestConstant } from '../../../constant/purchase/tiers-price-request';
import swal from 'sweetalert2';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { SearchItemService } from '../../../sales/services/search-item/search-item.service';
import { StarkPermissionsService, StarkRolesService } from '../../../stark-permissions/stark-permissions.module';
import { FileService } from '../../../shared/services/file/file-service.service';
import { SupplierDropdownComponent } from '../../../shared/components/supplier-dropdown/supplier-dropdown.component';
import { RoleConfigConstant } from '../../../Structure/_roleConfigConstant';
import { PurchaseOrderGridComponent } from '../../components/purchase-order-grid/purchase-order-grid.component';
import { AdvencedListProvisionnigComponent } from '../../components/advenced-list-provisionnig/advenced-list-provisionnig.component';
import { DocumentLine } from '../../../models/sales/document-line.model';
import { NegotitateQtyService } from '../../services/negotitate-qty/negotitate-qty.service';
import * as jsPDF from 'jspdf';
import * as jpt from 'jspdf-autotable';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { EquivalentItem } from '../../../models/purchase/equivalent-iItem.model';
import { ProvisioningService } from '../../services/order-project/provisioning-service.service';
import { ItemConstant } from '../../../constant/inventory/item.constant';
import { ActivityAreaEnumerator } from '../../../models/enumerators/activity-area.enum';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { ItemService } from '../../../inventory/services/item/item.service';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { TiersConstants } from '../../../constant/purchase/tiers.constant';
import { OrderProjectService } from '../../services/order-project/order-project.service';
import { Item } from '../../../models/inventory/item.model';
import { ItemToGetEquivalentList } from '../../../models/inventory/item-to-get-equivalent-list.model';
import { ListItemComponent } from '../../../inventory/components/list-item/list-item.component';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { LocalStorageService } from '../../../login/Authentification/services/local-storage-service';
import { TiersService } from '../../services/tiers/tiers.service';

const REPORT_NAME = 'report_';
const ORDER_PRICE_REQUEST = 'ORDER_PRICE_REQUEST';
const ITEM_DOESNT_HAVE_PRODUCTS = 'ITEM_DOESNT_HAVE_PRODUCTS';

@Component({
  selector: 'app-purchase-order-add',
  templateUrl: './purchase-order-add.component.html',
  styleUrls: ['./purchase-order-add.component.scss']
})
export class PurchaseOrderAddComponent extends DocumentAddComponent implements OnInit, OnDestroy {

  // contact dropdown
  @ViewChild(ContactDropdownComponent) public childListContactDropDown;
  @ViewChild(AddDevisComponent) public devisComponent;
  @ViewChild(PurchaseOrderGridComponent) public documentLineGrid;
  @ViewChild(AdvencedListProvisionnigComponent) public advencedListProvisionnigComponent;
  @ViewChild(ListItemComponent) equivalenceListItem;
  hideSave = false;
  /** document Title Asset */
  documentTitle: string;
  objectToSend: ObjectToSave;
  /** action to Do (Add, edit, show ) */
  type: string;
  /** document Type */
  documentType = DocumentEnumerator.PurchaseOrder;
  isClosed = true;
  devisIsAdded = false;
  currentDate = new Date();
  isChangedDocumentLine: boolean;
  @Output() isChangedLine = new EventEmitter<boolean>();
  showQuotation: boolean;
  isFromToLoadQuotation: boolean;
  item: any;
  DocumentNegotiationTitle = this.translate.instant('PRICE_NEGOTIATION');
  public isEsnVersion: boolean;
  public isItemSelectedHasProducts = false;
  public isItemLineSelected = false;
  private noProductsInfo = ITEM_DOESNT_HAVE_PRODUCTS;
  public existingElementList: Array<any> = new Array<any>();
  public equivalenceGrpList: Array<Item>;
  public guidItem = new Item;
  public showEquiv = false;
  public columnsConfig: ColumnSettings[] = [
    {
      field: ItemConstant.SUPPLIER_COLUMN_FIELD,
      title: TiersConstants.SUPPLIERS,
      _width: 150,
      filterable: true
    },
    {
      field: ItemConstant.CODE_COLUMN,
      title: ItemConstant.PRODUCTS,
      _width: 200,
      filterable: true
    },
    {
      field: 'Description',
      title: 'DESIGNATION',
      _width: 200,
      filterable: true
    },
    {
      field: 'AllAvailableQuantity',
      title: 'QTE_TOT',
      _width: 90,
      filterable: true
    },
    {
      field: 'LabelProduct',
      title: 'PRODUCT_BRAND',
      filterable: true,
      _width: 100
    }
  ];
  public validateOrderPermission_PU = false;
  public printOrderPermission_PU = false;
  public showSupplierDetails = false;
  public hideSupplierAddBtn = false;
  public hasAddPermission = false;
  public hasUpdatePermission = false;
  public isUpdateMode = false;
  public hasSendEmailPriceRequestPermission = false;

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
    protected permissionsService: StarkPermissionsService,
    protected searchItemService: SearchItemService,
    protected serviceReportTemplate: ReportTemplateService,
    protected languageService: LanguageService,
    protected growlService: GrowlService,
    public provisioningService: ProvisioningService,
    protected fileServiceService: FileService, protected rolesService: StarkRolesService,
    private negotitateQtyService: NegotitateQtyService, public authService: AuthService,
    private localStorageService: LocalStorageService,
    public itemService: ItemService,
    public OrderService: OrderProjectService,
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
  public gridEquivalenceSettings: GridSettings = {
    state: this.itemService.gridState,
    columnsConfig: this.columnsConfig,
  };

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
      Code: [{ value: this.translate.instant('ORDER') + '/' + this.currentDate.getFullYear(), disabled: true }],
      IdCurrency: [{ value: '', disabled: true }, Validators.required],
      IdContact: [''],
      DocumentHtpriceWithCurrency: [{ value: NumberConstant.ZERO, disabled: true }],
      DocumentTotalVatTaxesWithCurrency: [{ value: NumberConstant.ZERO, disabled: true }],
      DocumentTtcpriceWithCurrency: [{ value: NumberConstant.ZERO, disabled: true }],
      DocumentTtcprice: [{ value: NumberConstant.ZERO, disabled: true }],
      DocumentTotalDiscountWithCurrency: [{ value: NumberConstant.ZERO, disabled: true }],
      DocumentTotalExcVatTaxesWithCurrency: [{ value: NumberConstant.ZERO, disabled: true }],
      DocumentPriceIncludeVatWithCurrency: [{ value: NumberConstant.ZERO, disabled: true }],
      DocumentAmountPaidWithCurrency: [0],
      DocumentRemainingAmountWithCurrency: [0],
      DocumentTypeCode: [this.documentEnumerator.PurchaseOrder],
      IdDocumentAssociated: [null],
      IdDocumentAssociatedStatus: [1],
      IsGenerated: [false],
      Coefficient: [1, [Validators.max(100), strictSup(0)]],
      IsNegotitated: [false],
      ProvisionalCode: [''],
      Reference: [{ value: '', disabled: this.isDisabledForm() }],
    });

  }

  ngOnInit() {
    this.validateOrderPermission_PU = this.authService.hasAuthority
      (PermissionConstant.CommercialPermissions.VALIDATE_ORDER_QUOTATION_PURCHASE);
    this.printOrderPermission_PU = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.PRINT_ORDER_QUOTATION_PURCHASE);
    this.showSupplierDetails = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_SUPPLIER);
    this.hideSupplierAddBtn = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.ADD_SUPPLIER);
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.ADD_ORDER_QUOTATION_PURCHASE);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_ORDER_QUOTATION_PURCHASE);
    this.hasSendEmailPriceRequestPermission = this.authService.hasAuthority
      (PermissionConstant.CommercialPermissions.SEND_EMAIL_PRICEREQUEST);
    this.DocumentLineNegotiationOptions = true;
    //this.authService.hasAuthority(PermissionConstant.CommercialPermissions.NEGOTIATION);
    super.ngOnInit();
    this.type = this.documentService.setDocumentUrlType(this.router);
    this.createAddForm();
    this.getListReportTemplate();
    if (this.id > 0) {
      this.getDataToUpdate();
      if (this.documentForm.controls['IdDocumentAssociated'].value > 0) {
        this.devisIsAdded = true;
      }
    }
    this.documentTitle = this.translate.instant(ORDER_PRICE_REQUEST);
    this.documentService.setDocumentType(this.documentType);
    this.warningParagraph = 'VALIDATE_ORDER_WARRINIG_PARAGRAPH';
    this.validateDocumentText = 'VALIDATE_ORDER';
    this.validationMessageServiceInformation = InformationTypeEnum.PURCHASE_ORDER_VLIDATION;
    this.addMessageServiceInformation = InformationTypeEnum.PURCHASE_PURCHASE_ORDER_ADD;
    this.backToListLink = DocumentConstant.PURCHASE_ORDER_URL;
    this.routerReportLink = DocumentConstant.PURCHASE_ORDER_REPORT_URL;
    if (this.isUpdateMode && !this.hasUpdatePermission
      && this.documentForm.controls['IdDocumentStatus'].value === this.statusCode.Provisional) {
      this.documentForm.disable();
    }
  }

  // refreshQuotations($event){
  //   if($event){
  //     if($event == true){
  //       this.isChangedDocumentLine = true;
  //       this.verifyChangeToLoadQuotation();
  //       this.orderTabSelect()
  //     }
  //   }
  // }
  /* open poup */
  openPopup() {
    this.hideSave = (this.documentForm.value.IdDocumentAssociatedStatus === 2 || this.hideSave);
    if (this.documentForm.controls['IdDocumentAssociated'].value === 0 ||
      this.documentForm.controls['IdDocumentAssociated'].value === null) {
      this.documentService.savePurchaseBudgetFromPurchaseOrder(this.documentForm.controls['Id'].value).toPromise().then(x => {
        this.documentForm.controls['IdDocumentAssociated'].setValue(x.objectData.Id);
        this.openPoupActions();
      });
    } else {
      this.openPoupActions();
    }
  }

  public openPoupActions() {
    document.getElementById(PurchaseOrderConstant.GET_ELEMETN_HTML).style.width = PurchaseOrderConstant.FULL_WIDTH;
    this.isClosed = false;
  }

  /*close poup*/
  closePopup() {
    this.actionOnCloseModal();
  }

  /* save quotation document */
  saveQuotation() {
    this.saveBudget();
  }

  actionOnCloseModal() {
    document.getElementById(PurchaseOrderConstant.GET_ELEMETN_HTML).style.width = PurchaseOrderConstant.NO_WIDTH;
    this.isClosed = true;
  }

  ngOnDestroy() {
    this.destroy();
  }

  saveBudget() {
    this.documentService.getDocumentWithDocumentLine(this.documentForm.controls['Id'].value)
      .subscribe((x: Document) => {
        x.DocumentDate = new Date(x.DocumentDate);
        this.documentForm.patchValue(x);
        this.getDocumentLines();
        this.documentTaxeResume.splice(0,);
        x.DocumentTaxsResume.forEach(resume => {
          this.documentTaxeResume.push(resume);
        })
      });
  }

  // send email
  public sendMail() {
    if (this.documentForm.controls['Id'].value > 0) {
      if (this.documentLineGrid && this.documentLineGrid.filteredview && this.documentLineGrid.filteredview.data
        && this.documentLineGrid.filteredview.data.length > 0) {
        const title = this.translate.instant(TiersPriceRequestConstant.TITLE_SWAL_SEND_MAIL);
        const text = this.translate.instant(TiersPriceRequestConstant.TEXT_SWAL_SEND_MAIL);
        const confirmButtonText = this.translate.instant(TiersPriceRequestConstant.CONFIRM_BUTTON_SWAL_SEND_MAIL);
        const cancelButtonText = this.translate.instant(TiersPriceRequestConstant.CANCEL_BUTTON_SWAL_SEND_MAIL);
        this.swalWarrings.CreateSwal(text, title, confirmButtonText, cancelButtonText).then((result) => {
          if (result.value) {
            // send message
            this.documentService.SendPriceRequestMail(
              this.documentForm.controls['Id'].value, InformationTypeEnum.SALES_PRICE_REQUEST_ADD).subscribe(x => {
              });
          }
        });
      } else {
        this.growlService.InfoNotification(this.translate.instant('DOCUMENT_ACCOUNT_WITHOUT_LINES_CODE'));
      }
    } else {
      this.growlService.InfoNotification(this.translate.instant(TiersPriceRequestConstant.SAVE_REQUIRED));
    }
  }

  verifyChangeToLoadQuotation() {

    if (this.devisComponent) {
      if (this.devisComponent.documentLineGrid && this.devisComponent.documentLineGrid.gridSettings.state.filter.filters &&
        this.devisComponent.documentLineGrid.gridSettings.state.filter.filters.length > 0) {
        this.devisComponent.documentLineGrid.gridSettings.state.filter.filters = [];
      }
      if (this.devisComponent.documentLineGrid.predicate && this.devisComponent.documentLineGrid.predicate.Filter &&
        this.devisComponent.documentLineGrid.predicate.Filter.length > 0) {
        this.devisComponent.documentLineGrid.predicate.Filter = [];
      }
    }


    if (this.isChangedDocumentLine && this.documentForm.controls['IdDocumentAssociated'].value) {
      this.loadQuotation();
    } else if (this.showQuotation && this.devisComponent) {
      this.devisComponent.documentLineGrid.loadItems();
    }
  }

  loadQuotation() {
    this.showQuotation = true;
    if (this.devisComponent) {
      this.documentService.savePurchaseBudgetFromPurchaseOrder(this.documentForm.controls['Id'].value).toPromise().then(result => {
        if (result && result.objectData) {
          let docmt = result.objectData;
          // Save the Received Document from the server
          this.devisComponent.currentDocument = docmt;
          docmt.DocumentDate = new Date(docmt.DocumentDate);
          docmt.IdCurrency = docmt.IdUsedCurrency;
          this.devisComponent.statusOfCurrentDocument = docmt.IdDocumentStatus;
          this.devisComponent.budgetForm.patchValue(docmt);
          this.getSelectedCurrency();
          this.devisComponent.budgetForm.controls['IdDocumentStatus']
            .setValue(this.documentForm.controls['IdDocumentStatus'].value);
          this.idStatus = this.documentForm.controls['IdDocumentStatus'].value;
          this.documentForm.controls['IdDocumentAssociated'].setValue(docmt.Id);
          this.documentForm.controls['IsNegotitated'].setValue(docmt.IsNegotitated);
          if (this.devisComponent.documentLineGrid && docmt.DocumentLine) {
            this.devisComponent.documentLineGrid.loadItems();
            this.isFromToLoadQuotation = true;
          }
          this.isChangedDocumentLine = false;
        }
      });
    }
  }

  changeLineOfPurchaseOrder() {
    if (!this.isFromToLoadQuotation) {
      this.isChangedDocumentLine = true;
    }
    this.isFromToLoadQuotation = false;
  }


  deleteQuotation() {
    this.showQuotation = false;
    this.getDataToUpdate();
  }

  public checkIfItemsHasProducts(documentLine: DocumentLine) {
    this.showEquiv = true;
    if (documentLine && documentLine.IdItem) {
      this.guidItem.Id = documentLine.IdItem;
      if (documentLine.IdItemNavigation) {
        this.guidItem.EquivalenceItem = documentLine.IdItemNavigation.EquivalenceItem;
        this.guidItem.Description = documentLine.IdItemNavigation.Description;
      }
      if (this.itemService.isPurchase) {
        this.guidItem.IsForPurchase = this.itemService.isPurchase;
      }
      let list;
      this.itemService.getReducedItemEquivalance(this.guidItem).toPromise().then(res => {
        list = res;
        this.equivalenceGrpList = list;
        this.gridEquivalenceSettings.columnsConfig = this.columnsConfig;
        if (this.equivalenceListItem) {
          this.equivalenceListItem.onStateChange(this.gridEquivalenceSettings.state, this.equivalenceGrpList);
        }
      });
    }
  }

  selectedLine($event: DocumentLine) {
    if ($event) {
      this.item = $event.IdItem;
      this.advencedListProvisionnigComponent.idItem = $event.IdItem;
      this.advencedListProvisionnigComponent.description = $event.Designation;
      this.advencedListProvisionnigComponent.skip = 0;
      this.advencedListProvisionnigComponent.pageSize = 10;
      this.advencedListProvisionnigComponent.setGridLines();
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
    if (this.documentType === DocumentEnumerator.PurchaseOrder) {
      this.permissionsService.hasPermission(RoleConfigConstant.PRINT.PURCHASEORDER).then(x =>
        this.printDocumentRole = x);
    }
  }

  public loadUpdateValidDocumentRole() {
    if (this.documentType === DocumentEnumerator.PurchaseOrder) {
      this.permissionsService.hasPermission(RoleConfigConstant.UPDATE.PURCHASEORDER_SA).then(x =>
        this.updateValidDocumentRole = x);
    }
  }

  public loadDeleteValidDocumentRole() {
    if (this.documentType === DocumentEnumerator.PurchaseOrder) {
      this.permissionsService.hasPermission(RoleConfigConstant.DELETE.PURCHASEORDER_SA).then(x =>
        this.deleteDocumentLineRole = x);
    }
  }

  changeData() {
    super.changeData(true);
  }

  getDocumentLines() {
    this.documentLineGrid.loadItems();
  }

  orderTabSelect() {

    if (this.documentLineGrid) {
      if (this.documentLineGrid.gridSettings.state.filter.filters &&
        this.documentLineGrid.gridSettings.state.filter.filters.length > 0) {
        this.documentLineGrid.gridSettings.state.filter.filters = [];
      }
      if (this.documentLineGrid.predicate && this.documentLineGrid.predicate.Filter &&
        this.documentLineGrid.predicate.Filter.length > 0) {
        this.documentLineGrid.predicate.Filter = [];
      }
    }
    this.saveBudget();
  }

  printNegotiation() {
    let doc = new jsPDF();
    let columns = [this.translate.instant('refrence'),
    this.translate.instant('DESIGNATION'),
    this.translate.instant('PHT'),
    this.translate.instant('REQUESTED_PRICE'),
    this.translate.instant('REQUESTED_QTY')];
    let rows: any[];
    const title = this.DocumentNegotiationTitle;
    const orderNumber = this.translate.instant('COMMANDE') + ' :' + this.documentForm.controls['Code'].value;
    const orderDate = this.translate.instant('DATE') + ' :' +
      this.documentForm.controls['DocumentDate'].value.toLocaleDateString();
    this.negotitateQtyService.printNegotiation(this.documentForm.controls['Id'].value).subscribe(result => {
      if (result.objectData.negotiationDetailsToPrintViewModels.length > 0) {
        const tiersName = this.translate.instant('SUPPLIER') + ' :' + result.objectData.SupplierName;
        rows = [];
        result.objectData.negotiationDetailsToPrintViewModels.forEach((element) => {
          const itemToAdd = [element.Reference, element.Designation, element.HtPurchasePrice, element.RequestedPrice, element.RequestedQuantity];
          rows.push(Object.values(itemToAdd));
        });
        // Begin Header
        doc.setFontSize(12);
        doc.text(title, 85, 10);
        doc.text(orderNumber, 10, 20);
        doc.text(orderDate, 150, 20);
        doc.text(tiersName, 10, 27);
        // End Header
        doc.autoTable({
          margin: { vertical: 40 },
          head: [columns],
          body: rows,
          theme: ['striped']
        });
        doc.save(this.DocumentNegotiationTitle + '-' + new Date().toLocaleDateString() + '.pdf');
      } else {
        this.growlService.warningNotification(this.translate.instant('NO_NEGOTIAION_ADDED'));
      }
    });
  }

  changeDocumentFormValue($event) {
    this.documentForm.patchValue($event);
  }

  selectedContact(event) {
    this.prepareDocumentToUpdate();
    if (this.updateDocumentCondition()) {
      this.document.IsContactChanged = true;
      const objectToSave = new ObjectToSend(this.document);
      this.documentService.updateDocumentFields(objectToSave).subscribe(x => {
        this.document.IsContactChanged = false;
        x.objectData.DocumentDate = new Date(x.objectData.DocumentDate);
        x.objectData.DocumentInvoicingDate = new Date(x.objectData.DocumentInvoicingDate);
        this.documentForm.patchValue(x.objectData);
      });
    }
  }
  public reloadDataAfterReplace() {
    this.loadQuotation();
  }


}
