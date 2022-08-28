import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from '../../../shared/services/signalr/message/message.service';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { CompanyService } from '../../../administration/services/company/company.service';
import { CurrencyService } from '../../../administration/services/currency/currency.service';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { DocumentEnumerator, documentStatusCode, InvoicingTypeEnumerator } from '../../../models/enumerators/document.enum';
import { TiersTypeEnumerator } from '../../../models/enumerators/tiers-type.enum';
import { DocumentAddComponent } from '../../../shared/components/document/document-add/document-add.component';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { DocumentFormService } from '../../../shared/services/document/document-grid.service';
import { FileService } from '../../../shared/services/file/file-service.service';
import { ValidationService } from '../../../shared/services/validation/validation.service';
import { StarkPermissionsService, StarkRolesService } from '../../../stark-permissions/stark-permissions.module';
import { DocumentService } from '../../services/document/document.service';
import { ReportTemplateService } from '../../../shared/services/report-template/report-template.service';
import { FormModalDialogService } from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { CrudGridService } from '../../services/document-line/crud-grid.service';
import { LanguageService } from '../../../shared/services/language/language.service';
import { SearchItemService } from '../../services/search-item/search-item.service';
import { GridSalesInvoiceAssestsComponent } from '../../components/grid-sales-invoice-assests/grid-sales-invoice-assests.component';
import { SupplierDropdownComponent } from '../../../shared/components/supplier-dropdown/supplier-dropdown.component';
import { DocumentConstant } from '../../../constant/sales/document.constant';
import { Warehouse } from '../../../models/inventory/warehouse.model';
import { WarehouseService } from '../../../inventory/services/warehouse/warehouse.service';
import { TicketService } from '../../../treasury/services/ticket/ticket.service';
import { Document } from '../../../models/sales/document.model';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { CounterSalesConstant } from '../../../constant/sales/counter-sales.constant';
import swal from 'sweetalert2';
import { SessionCash } from '../../../models/payment/session-cash.model';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { GridComponent } from '@progress/kendo-angular-grid';
import { TicketPaymentService } from '../../../treasury/services/ticket-payment/ticket-payment.service';
import { TicketPayment } from '../../../models/treasury/ticket-payment';
import { AmountFormatService } from '../../../treasury/services/amount-format.service';
import { Currency } from '../../../models/administration/currency.model';
import { ImportOrderDocumentLinesComponent } from '../../components/import-order-document-lines/import-order-document-lines.component';
import { PaymentTypeEnumerator } from '../../../models/enumerators/payment-type.enum';
import { ObjectToSend } from '../../../models/sales/object-to-save.model';
import { TiersService } from '../../../purchase/services/tiers/tiers.service';
import { VehicleDropdownComponent } from '../../components/vehicle-dropdown/vehicle-dropdown.component';
import { Filter, Operation, PredicateFormat, Relation } from '../../../shared/utils/predicate';
import { TicketConstant } from '../../../constant/treasury/ticket.constant';
import { Ticket } from '../../../models/treasury/ticket.model';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { DataSourceRequestState } from '@progress/kendo-data-query';
import { LocalStorageService } from '../../../login/Authentification/services/local-storage-service';
import { ActivityAreaEnumerator } from '../../../models/enumerators/activity-area.enum';
import { ReducedCompany } from '../../../models/administration/reduced-company.model';
import { LastBLItemPrice } from '../../../models/sales/last-bl-item-price.model';
import { DetailsProductComponent } from '../../../shared/components/item/details-product/details-product.component';
import { KeyboardConst } from '../../../constant/keyboard/keyboard.constant';
import { PaymentTypeDropdownComponent } from '../../../shared/components/payment-type-dropdown/payment-type-dropdown.component';
const API_GET_DATA_WITH_SPEC_FILTRE = 'getDataWithSpecificFilter';

@Component({
  selector: 'app-counter-sales-details',
  templateUrl: './counter-sales-details.component.html',
  styleUrls: ['./counter-sales-details.component.scss']
})
export class CounterSalesDetailsComponent extends DocumentAddComponent implements OnInit, AfterViewInit {
  public openTiersDetailsCollapse = true;
  @ViewChild('container', { read: ViewContainerRef })
  public containerDiv: ViewContainerRef;
  @ViewChild(GridSalesInvoiceAssestsComponent) public documentLineGrid;
  @ViewChild('tiersDropDown') tiersDropDownEl: SupplierDropdownComponent;
  @ViewChild('paymentGrid') private paymentGrid: GridComponent;
  @ViewChild('vehicleDropDown') vehicleDropDown: VehicleDropdownComponent;
  @Output() addTabClicked = new EventEmitter<boolean>();
  @Output() removeContext = new EventEmitter<any>();
  @Output() selectNewTab = new EventEmitter<number>();
  @Input() viewReference;
  @Input() liAssociatedReference;
  @Input() index;
  @Input() canCancelSale: boolean;
  @Input() sessionCash: SessionCash;
  @Input() idWarehouse: number;
  @Input() idTicket: number;
  @Input() idDocument: number;
  @Input() editMode: boolean;
  public currentCompany: ReducedCompany;
  // Role Properties
  updateValidDocumentRole = true;
  deleteReservedDocumentLineRole = true;
  public hasGenerateInvoicePermission: boolean;
  public hasPrintPermission: boolean;

  /** enumuration of Status of the document (balanced, VALID ... ) */
  public statusCode = documentStatusCode;
  public customerTiers = TiersTypeEnumerator.Customer;
  public paymentType = new PaymentTypeEnumerator();

  TicketCode = 'CodeGeneratedNumber';
  paymentData = [];
  documentTaxeResume = [];
  gridData = [];
  documentForm: FormGroup;
  /** document Type */
  documentType = DocumentEnumerator.SalesDelivery;
  documentEnumerator = DocumentEnumerator;
  public formatOptions;
  public warehouseAssociatedToCounterSales: Warehouse;

  public showGenerateInvoice = true;
  public invoiceGeneratedCode;
  public invoiceGeneratedId;
  public invoiceStatus;
  public disableImportBLButton = true;
  public noImportBL = false;
  
  public predicateTicket: PredicateFormat[] = [];
  showTicketLinesTab = true;
  showPaymentTab = false;
  isValidated = false;

  // Payment config
  paymentColumnsConfig: ColumnSettings[] = [
    {
      field: CounterSalesConstant.ID_PAYMENT_TYPE,
      title: CounterSalesConstant.PAYMENT_MODE_TITLE,
      filterable: true,
    },
    {
      field: CounterSalesConstant.AMOUNT,
      title: CounterSalesConstant.AMOUNT_TITLE,
      filterable: true,
    },
    {
      field: CounterSalesConstant.RECEIVED_AMOUNT,
      title: CounterSalesConstant.RECEIVED_AMOUNT_TITLE,
      filterable: true,
    },
    {
      field: CounterSalesConstant.AMOUNT_TO_BE_RETURNED,
      title: CounterSalesConstant.AMOUNT_TO_BE_RETURNED_TITLE,
      filterable: true,
    }
  ];
  paymentFormGroup: FormGroup;
  private editedRowIndex: number;
  isEditingMode = false;
  isRemoved = false;

  public TicketId: number;
  public paymentAmountSum: number;
  /* Grid state
*/
  public gridState: DataSourceRequestState = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.TWENTY,
    filter: { // Initial filter descriptor
      logic: 'and',
      filters: []
    }
  };
  // Grid settings
  public gridSettings: GridSettings = {
    state: this.gridState,
  };
  LastBLItemPrice: LastBLItemPrice;

  constructor(private warehouseService: WarehouseService,
    private fb: FormBuilder,
    protected currencyService: CurrencyService,
    protected documentFormService: DocumentFormService,
    protected service: CrudGridService,
    protected formModalDialogService: FormModalDialogService,
    protected viewRef: ViewContainerRef,
    protected serviceReportTemplate: ReportTemplateService,
    public companyService: CompanyService,
    protected translate: TranslateService,
    protected swalWarrings: SwalWarring,
    public documentService: DocumentService,
    protected validationService: ValidationService,
    protected messageService: MessageService,
    protected router: Router,
    protected permissionsService: StarkPermissionsService,
    protected languageService: LanguageService,
    protected searchItemService: SearchItemService,
    protected rolesService: StarkRolesService,
    protected fileServiceService: FileService,
    protected growlService: GrowlService,
    private authService: AuthService,
    protected ticketService: TicketService,
    private ticketPaymentService: TicketPaymentService,
    private amountFormatService: AmountFormatService,
    protected tiersService: TiersService,
    private fileService: FileService,
    public serviceComany: CompanyService,
    private localStorageService: LocalStorageService
  ) {
    super(
      currencyService,
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
      rolesService,
      growlService,
      tiersService
    );
    this.showVehicleDropdown = this.localStorageService.getActivityArea() == ActivityAreaEnumerator.Auto ? true : false;
  }
  @HostListener('document:keydown.shift.F', ['$event']) 
  onKeydownShiftFHandler(event: KeyboardEvent) {
   if(this.showGenerateInvoice && this.documentForm.controls.IdDocumentStatus.value === this.statusCode.Valid) {
     this.generatePosInvoiceFromBl()
   }
}
@HostListener('document:keydown.shift.T', ['$event']) 
  onKeydownShiftTHandler(event: KeyboardEvent) {
   if(this.documentForm.controls.IdDocumentStatus.value === this.statusCode.Valid && this.paymentData.length > 0 &&
    this.documentForm.controls['DocumentTtcpriceWithCurrency'].value == this.paymentAmountSum) {
     this.printTicketClickHandler()
   }
}
@HostListener('document:keydown.shift.+', ['$event']) 
  onKeydownShiftPlusHandler(event: KeyboardEvent) {
    this.AddTabClickHandler()
}
@HostListener('document:keydown.shift.B', ['$event']) 
  onKeydownShiftBHandler(event: KeyboardEvent) {
    this.noImportBL = true;
    if((!this.documentForm.controls.Id.value || !this.TicketHasLignes() ) && this.documentForm.controls.IdDocumentStatus.value != this.statusCode.Valid){
    this.checkImportBL();
    }
}
@HostListener('document:keydown.shift.V', ['$event']) 
  onKeydownShiftVHandler(event: KeyboardEvent) {
    if(this.documentForm.controls.Id.value && (this.documentForm.controls.IdDocumentStatus.value === this.statusCode.Provisional) && this.documentForm.controls["isAllLinesAreAvailbles"].value==false)
    this.onClickValidateBlAndTicket()
}
@HostListener('document:keydown.shift.C', ['$event']) 
  onKeydownShiftCHandler(event: KeyboardEvent) {
    if(this.documentForm.controls.IdDocumentStatus.value !== this.statusCode.Provisional && this.paymentData.length > 0 && this.documentForm.controls['DocumentTtcpriceWithCurrency'].value == this.paymentAmountSum)
    this.finish()
}
  ngAfterViewInit(): void {
    if (this.index > NumberConstant.ONE) {
      this.selectNewTab.emit(this.index);
    }
  }
  preparePredicate() {
    const predicate = new PredicateFormat();
    predicate.Relation = new Array<Relation>();
    predicate.Relation.push(new Relation(TicketConstant.ID_INVOICE_NAVIGATION));
    predicate.Relation.push(new Relation(TicketConstant.ID_DELIVERYFORM_NAVIGATION));
    predicate.Relation.push(new Relation(TicketConstant.ID_TICKET_PAYMENT));
    predicate.SpecificRelation = new Array<string>();
    predicate.SpecificRelation.push(TicketConstant.ID_TICKET_PAYMENT_TYPE_NAVIGATION);
    predicate.Filter = new Array<Filter>();
    predicate.Filter.push(new Filter(TicketConstant.ID, Operation.eq, this.idTicket));
    return predicate;
  }

  ngOnInit() {
    this.hasGenerateInvoicePermission = this.authService.hasAuthority(
      PermissionConstant.CommercialPermissions.GENERATE_INVOICE
    );
    this.hasPrintPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.PRINT_PAYMENT_TICKET);
    this.hasUpdateTTCAmountPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_TTC_AMOUNT);
    this.createAddForm();
    this.showVehicleDropdown = this.localStorageService.getActivityArea() == ActivityAreaEnumerator.Auto ? true : false;
    if (this.idTicket && this.index === NumberConstant.ONE) {
      this.prepareCounterSalesData();
    }
    if (this.idDocument && this.index === NumberConstant.ONE) {
      this.id = this.idDocument;
      if (this.id > NumberConstant.ZERO) {
        this.getDataToUpdate();
      }
    }
    // will be changed later warehouse must be passed in input as attribut of counter sales
    this.warehouseService.getById(this.idWarehouse).subscribe(res => {
      this.warehouseAssociatedToCounterSales = res;
    });
    this.getCompanyParams();
  }

  prepareCounterSalesData() {
    this.predicateTicket.push(this.preparePredicate());
    this.ticketService.reloadServerSideDataWithListPredicate(this.gridSettings.state, this.predicateTicket, API_GET_DATA_WITH_SPEC_FILTRE).subscribe(ticket => {
      const data = ticket.data[NumberConstant.ZERO];
      this.TicketCode = data.Code;
      this.TicketId = data.Id;
      this.id = data.IdDeliveryForm;
      if (this.id > NumberConstant.ZERO) {
        this.getDataToUpdate();
      }
      if (data.IdInvoice > NumberConstant.ZERO) {
        this.invoiceGeneratedCode = data.IdInvoiceNavigation.Code;
        this.invoiceGeneratedId = data.IdInvoiceNavigation.Id;
        this.invoiceStatus = data.IdInvoiceNavigation.IdDocumentStatus
      }
      if (data.TicketPayment && data.TicketPayment.length !== NumberConstant.ZERO) {
        data.TicketPayment.forEach(ticketPayment => {
          this.createFormGroup(ticketPayment);
          this.paymentFormGroup.controls.AmountToBeReturned.setValue(this.amountFormatService.format(this.selectedCurrency, ticketPayment.AmountReturned))
          this.paymentFormGroup.controls.Amount.setValue(this.amountFormatService.format(this.selectedCurrency, this.paymentFormGroup.controls.Amount.value));
          this.paymentFormGroup.controls.ReceivedAmount.setValue(this.amountFormatService.format(this.selectedCurrency, this.paymentFormGroup.controls.ReceivedAmount.value));
          this.paymentData.unshift(this.paymentFormGroup.getRawValue());
          this.paymentAmountSum = this.amountFormatService.format(this.selectedCurrency, this.paymentData.reduce((sum, current) => sum + current.Amount, 0));
        })
      }
    });
  }
  AddTabClickHandler() {
    this.addTabClicked.emit(this.index);
  }

  cancelTabClickHandler() {
    if (this.documentForm.controls.Id.value > 0) {
      // if the Bl is has a Provisional status
      if (this.documentForm.controls.IdDocumentStatus.value === this.statusCode.Provisional) {
        this.swalWarrings.CreateSwal(DocumentConstant.DOCUMENT_DELETE_TEXT_MESSAGE,
          DocumentConstant.DOCUMENT_DELETE_TITLE_MESSAGE).then((result) => {
            if (result.value) {
              this.documentService.removeDocument(this.documentForm.value).subscribe(() => {
                this.notifyParentToDeleteTheCurrentContextReference();
              });
            }
          });
      } else {
        // if the BL Has been validated
      }
    } else {
      this.notifyParentToDeleteTheCurrentContextReference();
    }
  }

  notifyParentToDeleteTheCurrentContextReference() {
    // Inform parent to delete the component from the container
    const data = { viewReference: this.viewReference, liAssociatedReference: this.liAssociatedReference };
    this.removeContext.emit(data);
  }

  printTicketClickHandler() {
    const documentName = this.translate.instant(CounterSalesConstant.PRINT_COUNTER_SALES_TICKET);
    const params = {
      'idTicket': this.TicketId,
    };
    const dataToSend = {
      'reportName': 'TicketPos',
      'documentName': documentName.concat('_').concat(this.TicketCode),
      'reportFormatName': 'pdf',
      'printCopies': 1,
      'PrintType': '-1',
      'reportparameters': params
    };
    this.ticketService.downloadJasperReport(dataToSend).subscribe(
      res => {
        this.fileService.downLoadFile(res.objectData);
      }
    );
  }

  onClickValidateBlAndTicket() {
    this.documentService.isAnyLineWithoutPrice(this.documentForm.controls['Id'].value).subscribe(x => {
      if (x.objectData === true) {
        this.growlService.ErrorNotification(this.translate.instant('SOME_LINES_ARE_ZERO'));
      }else{
    this.ticketService.ValidateBLAndGenerateTicket(this.documentForm.controls.Id.value, this.sessionCash.Id).subscribe(res => {
      // Update Ticket Code
      this.TicketCode = res.Code;
      this.TicketId = res.Id;
      this.documentLineGrid.loadItems();
      // update BL
      this.documentService.getDocumentWithDocumentLine(res.IdDeliveryForm).subscribe((data: Document) => {
        this.documentLineGrid.setModalDetails(data);
        this.documentForm.patchValue(data);
        this.documentTaxeResume.splice(0,)
        data.DocumentTaxsResume.forEach(element => {
          this.documentTaxeResume.push(element);
        });
        this.documentForm.controls['DocumentTtcpriceWithCurrency'].setValue(this.amountFormatService.format(this.selectedCurrency, this.documentForm.controls['DocumentTtcpriceWithCurrency'].value));
        this.documentForm.controls['DocumentTtcpriceWithCurrency'].disable();
        this.documentForm.controls['IdVehicle'].disable();
        this.documentForm.controls['Reference'].disable();
        this.documentForm.controls['Name'].disable();
        this.documentForm.controls['Tel1'].disable();
        this.documentForm.controls['MatriculeFiscale'].disable();
        this.showPaymentCard();
        this.addPaymentLine();
        this.isValidated = true;
      });

        });
      }
    });
  }
  showTicketLinesCard() {
    if (!this.showTicketLinesTab) {
      this.showTicketLinesTab = true;
      this.showPaymentTab = false;
    }
  }

  showPaymentCard() {
    if (!this.showPaymentTab) {
      this.showPaymentTab = true;
      this.showTicketLinesTab = false;
    }
  }
  public loadUpdateValidDocumentRole() {
    if (this.documentType === DocumentEnumerator.SalesDelivery) {
      this.updateValidDocumentRole = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_VALID_DELIVERY_SALES);
    }
  }

  public loadDeleteValidDocumentRole() {
    if (this.documentType === DocumentEnumerator.SalesDelivery) {
      this.deleteDocumentLineRole = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.DELETE_LINE_SALES);
    }
  }

  public loadDeleteReservedDocumentLineRole() {
    if (this.documentType === DocumentEnumerator.SalesDelivery) {
      this.deleteReservedDocumentLineRole = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.DELETE_RESERVED_LINE);
    }
  }

  /** create the form group */
  public createAddForm(): void {
    this.documentForm = this.fb.group({
      Id: [0],
      IdTiers: ['', Validators.required],
      DocumentDate: [new Date(), Validators.required],
      IdDocumentStatus: [documentStatusCode.Provisional],
      Code: [''],
      Reference: [''],
      IdCurrency: [''],
      IdContact: [''],
      IdDeliveryType: [''],
      DocumentHtpriceWithCurrency: [{ value: NumberConstant.ZERO, disabled: true }],
      DocumentTotalVatTaxesWithCurrency: [{ value: NumberConstant.ZERO, disabled: true }],
      DocumentTtcpriceWithCurrency: [NumberConstant.ZERO],
      DocumentTtcprice: [{ value: NumberConstant.ZERO, disabled: true }],
      DocumentTotalDiscountWithCurrency: [{ value: NumberConstant.ZERO, disabled: true }],
      DocumentOtherTaxesWithCurrency: [NumberConstant.ZERO],
      DocumentTotalExcVatTaxesWithCurrency: [{ value: NumberConstant.ZERO, disabled: true }],
      DocumentPriceIncludeVatWithCurrency: [{ value: NumberConstant.ZERO, disabled: true }],
      DocumentAmountPaidWithCurrency: [0],
      DocumentRemainingAmountWithCurrency: [0],
      DocumentTypeCode: [DocumentEnumerator.SalesDelivery],
      IdDocumentAssociated: [null],
      isAllLinesAreAvailbles: [''],
      IsTermBilling: [true],
      hasSalesInvoices: [false],
      IsForPos: [true],
      IdSessionCounterSales: [this.sessionCash.Id],
      // used just in front to know if the document is created from search item or not
      isFromSearch: [false],
      ProvisionalCode: [''],
      haveReservedLines: [''],
      IdVehicle: [''],
      Name: [''],
      Tel1: [''],
      MatriculeFiscale: [''],
      Adress: [''],
    });
  }

  generatePosInvoiceFromBl() {
    const invoice: Document = new Document();
    invoice.DocumentDate = new Date();
    invoice.DocumentTypeCode = DocumentEnumerator.SalesInvoices;
    invoice.IdDocumentStatus = documentStatusCode.Valid;
    invoice.IdTiers = this.documentForm.controls['IdTiers'].value;
    invoice.IdCurrency = this.documentForm.controls['IdCurrency'].value;
    invoice.IdUsedCurrency = this.documentForm.controls['IdCurrency'].value;
    invoice.ValidationDate = new Date();
    invoice.IsForPos = true;
    invoice.DocumentAmountPaidWithCurrency = 0;
    invoice.DocumentHtpriceWithCurrency = 0;
    invoice.DocumentOtherTaxesWithCurrency = 0;
    invoice.DocumentPriceIncludeVatWithCurrency = 0;
    invoice.DocumentRemainingAmountWithCurrency = 0;
    invoice.DocumentTotalDiscountWithCurrency = 0;
    invoice.DocumentTotalExcVatTaxesWithCurrency = 0;
    invoice.DocumentTotalVatTaxesWithCurrency = 0;
    invoice.DocumentTtcprice = 0;
    invoice.DocumentTtcpriceWithCurrency = 0;
    invoice.InoicingType = InvoicingTypeEnumerator.Cash;
    this.documentService
      .generatePosInvoiceFromBl(invoice, false, this.documentForm.controls['Id'].value, this.TicketId)
      .subscribe((data) => {
        this.showGenerateInvoice = false;
        this.invoiceGeneratedCode = data.Code;
        this.invoiceGeneratedId = data.Id;
        this.invoiceStatus = data.IdDocumentStatus
        this.documentForm.controls['IdDocumentStatus'].setValue(documentStatusCode.Balanced);
        let message: string = this.translate.instant(
          CounterSalesConstant.SUCCESS_GENERATE_INVOICE_MESSAGE
        );
        message = message.concat(
          '<a target="_blank" rel="noopener noreferrer" href="' + this.getInvoiceUrl() + '" > ' + data.Code + ' </a>');
        swal.fire({
          icon: SharedConstant.SUCCESS,
          html: message,
        });
      });
  }

  getInvoiceUrl() {
    return '/main/sales/invoice/show/' + this.invoiceGeneratedId + '/' + documentStatusCode.Valid;
  }

  /** Payment Methods*/
  paymentGridStateChange($event) {

  }

  receivePaymentType($event) {
    this.paymentFormGroup.controls.IdPaymentType.setValue($event.Id);
    this.paymentFormGroup.controls.IdPaymentTypeNavigation.setValue($event);
    if ($event.Code === this.paymentType.ESP) {
      this.paymentFormGroup.controls.ReceivedAmount.setValidators([Validators.required, Validators.min(this.paymentFormGroup.controls.Amount.value)]);
      this.paymentFormGroup.controls.ReceivedAmount.enable();
    } else {
      this.paymentFormGroup.controls.ReceivedAmount.disable();
      this.paymentFormGroup.controls.ReceivedAmount.setValidators([]);
    }
    this.paymentFormGroup.controls.ReceivedAmount.updateValueAndValidity();
    this.setAmountInputFocus();
    if($event.Code === this.paymentType.ESP) {
    this.setAmountToBeReturnedFocus();
    }
  }
  setAmountInputFocus() {
    setTimeout(() => {
    document.getElementsByName('Amount')[0].focus();
    }, NumberConstant.ONE_HUNDRED);
  }
  setAmountToBeReturnedFocus() {
    setTimeout(() => {
      document.getElementsByName('AmountToBeReturned')[0].focus();
      }, NumberConstant.ONE_HUNDRED);
  }
  createFormGroup(dataItem?) {
    this.paymentFormGroup = this.fb.group({
      Id: [dataItem ? dataItem.Id : 0],
      IdPaymentType: [dataItem ? dataItem.IdPaymentType : ''],
      IdPaymentTypeNavigation: [dataItem ? dataItem.IdPaymentTypeNavigation : undefined],
      Amount: [dataItem ? dataItem.Amount : '', Validators.required],
      ReceivedAmount: [dataItem ? dataItem.ReceivedAmount : ''],
      AmountToBeReturned: [{ value: dataItem ? dataItem.AmountToBeReturned : '', disabled: true }],
      IdTicket: [this.TicketId],
      CreationDate: [new Date],
      Status: [dataItem ? dataItem.Status : documentStatusCode.NotSatisfied]
    });
    if (dataItem && this.paymentFormGroup.controls.IdPaymentTypeNavigation.value &&
      this.paymentFormGroup.controls.IdPaymentTypeNavigation.value.Code !== this.paymentType.ESP) {
      this.paymentFormGroup.controls.ReceivedAmount.disable();
    }
  }

  addPaymentLine() {
    let amountNotPayed = this.amountFormatService.format(this.selectedCurrency, this.documentForm.controls.DocumentTtcpriceWithCurrency.value) -
      this.paymentData.reduce((sum, current) => sum + current.Amount, 0);
    amountNotPayed = this.amountFormatService.format(this.selectedCurrency, amountNotPayed);
    if (amountNotPayed > 0) {
      this.createFormGroup();
      this.paymentFormGroup.controls.Amount.setValue(amountNotPayed);
      this.paymentFormGroup.controls.Amount.setValidators([Validators.required, Validators.max(amountNotPayed), Validators.min(NumberConstant.ZERO)]);
      this.paymentGrid.addRow(this.paymentFormGroup);
      this.isEditingMode = true;
    }
  }

  saveCurrentPaymentLine({ rowIndex, isNew }) {
    if (this.paymentFormGroup.valid) {
      // add it to the Back
      const ticketPayment: TicketPayment = this.paymentFormGroup.getRawValue();
      ticketPayment.IdPaymentTypeNavigation = null;
      this.ticketPaymentService.save(ticketPayment, isNew).subscribe((res) => {
        this.paymentFormGroup.controls.Id.setValue(res.Id);
        // add it in the interface
        if (isNew) {
          this.paymentData.unshift(this.paymentFormGroup.getRawValue());
        } else {
          this.paymentData[rowIndex] = this.paymentFormGroup.getRawValue();
        }
        this.paymentAmountSum = this.amountFormatService.format(this.selectedCurrency, this.paymentData.reduce((sum, current) => sum + current.Amount, 0));
        this.closeEditor();
      });
    } else {
      this.validationService.validateAllFormFields(this.paymentFormGroup);
    }
  }

  removePaymentLine({ rowIndex, dataItem }) {
    if (this.invoiceStatus === this.statusCode.PartiallySatisfied || this.invoiceStatus === this.statusCode.TotallySatisfied) {
      return;
    }
    this.swalWarrings.CreateSwal().then((result) => {
      if (result.value) {
        this.ticketPaymentService.remove(dataItem).subscribe(() => {
          this.paymentData.splice(rowIndex, NumberConstant.ONE);
          this.paymentAmountSum = this.paymentData.reduce((sum, current) => sum + current.Amount, 0);
          this.closeEditor();
          // used to close nextline
          this.isRemoved = true;
        });
      }
    });
  }

  paymentLineClickHandler({ dataItem, rowIndex }): void {
    if(dataItem.Status === this.statusCode.TotallySatisfied ){ 
      return;
    }
    if (!this.isEditingMode) {
      if (this.isRemoved) {
        this.isRemoved = false;
        return;
      }
      this.isEditingMode = true;
      this.editedRowIndex = rowIndex;
      this.createFormGroup(dataItem);
      this.paymentGrid.editRow(rowIndex, this.paymentFormGroup);
      let amountNotPayed = this.documentForm.controls.DocumentTtcpriceWithCurrency.value -
        this.paymentData.reduce((sum, current) => sum + current.Amount, 0);
      this.paymentFormGroup.controls.Amount.setValidators([Validators.required, Validators.min(NumberConstant.ZERO),
      Validators.max(this.amountFormatService.format(this.selectedCurrency, this.paymentFormGroup.controls.Amount.value + amountNotPayed))]);
    }
  }

  cancelHandler() {
    this.closeEditor();
  }

  closeEditor() {
    this.paymentGrid.closeRow(this.editedRowIndex);
    this.editedRowIndex = undefined;
    this.paymentFormGroup = undefined;
    this.isEditingMode = false;
  }

  calculateAmountToBeReturned() {
    if (this.Amount.value === NumberConstant.ZERO) {
      this.paymentFormGroup.controls.AmountToBeReturned.setValue(this.amountFormatService.format(this.selectedCurrency, this.paymentFormGroup.controls.ReceivedAmount.value));
    }
    if (this.Amount.value && this.ReceivedAmount.value) {
      const diff = this.amountFormatService.format(this.selectedCurrency, (this.ReceivedAmount.value - this.Amount.value));
      if (diff > 0) {
        this.paymentFormGroup.controls.AmountToBeReturned.setValue(diff);
      } else {
        this.paymentFormGroup.controls.AmountToBeReturned.setValue(0);
      }
      this.paymentFormGroup.controls.Amount.setValue(this.amountFormatService.format(this.selectedCurrency, this.paymentFormGroup.controls.Amount.value));
      this.paymentFormGroup.controls.ReceivedAmount.setValue(this.amountFormatService.format(this.selectedCurrency, this.paymentFormGroup.controls.ReceivedAmount.value));
    }
  }

  setReceivedAmount() {
    if (this.paymentFormGroup.controls.IdPaymentTypeNavigation.value.Code !== this.paymentType.ESP) {
      this.paymentFormGroup.controls.ReceivedAmount.setValue(this.paymentFormGroup.controls.Amount.value);
      this.paymentFormGroup.controls.AmountToBeReturned.setValue(0);
    } else {
      this.paymentFormGroup.controls.ReceivedAmount.setValidators([Validators.required, Validators.min(this.paymentFormGroup.controls.Amount.value)]);
      this.paymentFormGroup.controls.ReceivedAmount.updateValueAndValidity();
    }
    this.paymentFormGroup.controls.Amount.setValue(this.amountFormatService.format(this.selectedCurrency, this.paymentFormGroup.controls.Amount.value));
    this.paymentFormGroup.controls.ReceivedAmount.setValue(this.amountFormatService.format(this.selectedCurrency, this.paymentFormGroup.controls.ReceivedAmount.value));
  }

  public finish() {
    this.swalWarrings.CreateSwal(this.translate.instant(CounterSalesConstant.FINISH_TICKET_PAYMENT_MSG), this.translate.instant('SWAL_TITLE')).then((result) => {
      if (result.value) {
        this.notifyParentToDeleteTheCurrentContextReference();
      }
    });

  }

  // Import BL
  checkImportBL() {
    if (this.documentForm.valid || this.documentForm.disabled) {
      this.noImportBL = true;
      const dataToSend = {
        formGroup : this.documentForm,
        documentType: this.documentEnumerator.SalesInvoices,
        documentAssociatedType: this.documentEnumerator.SalesDelivery,
        isFromCounterSale: true
       }
       const TITLE = this.translate.instant('IMPORT_BL');
       this.formModalDialogService.openDialog(TITLE, ImportOrderDocumentLinesComponent,
         this.viewRef, this.generateTicket.bind(this),
         dataToSend, true, SharedConstant.MODAL_DIALOG_SIZE_ML);
 
    } else {
      this.validationService.validateAllFormFields(this.documentForm);
      this.noImportBL = false;
    }
  }

  public generateTicket($event) {
    if($event && $event.Id) {
      this.documentForm.controls.Id.setValue($event.Id);
      this.documentForm.controls.Code.setValue($event.Code);
      this.documentForm.controls.IdDocumentStatus.setValue($event.IdDocumentStatus);
      this.documentForm.controls.DocumentTtcpriceWithCurrency.setValue($event.DocumentTtcpriceWithCurrency);
      this.documentForm.controls.IdTiers.disable();
      this.ticketService.generateTicketAfterBlImport(this.documentForm.controls.Id.value, this.sessionCash.Id).subscribe(res => {
        // Update Ticket Code
        this.TicketCode = res.Code;
        this.TicketId = res.Id;

        // load items
        this.documentLineGrid.loadItems();
        // update BL
        this.documentService.getDocumentWithDocumentLine($event.Id).subscribe((data: Document) => {
          this.documentLineGrid.setModalDetails(data);
          this.documentForm.patchValue(data);
          this.documentTaxeResume.splice(0,)
          data.DocumentTaxsResume.forEach(element => {
            this.documentTaxeResume.push(element);
          });
        });
        this.service.DataToImport = new Array();
      });
    }
  }
  public vehicleSelected($event) {
    this.prepareDocumentToUpdate();
    if (this.updateDocumentCondition()) {
      const objectToSave = new ObjectToSend(this.document);
      this.documentService.updateDocumentFields(objectToSave).subscribe(x => {
        x.objectData.DocumentDate = new Date(x.objectData.DocumentDate);
        x.objectData.DocumentInvoicingDate = new Date(x.objectData.DocumentInvoicingDate);
        this.documentForm.patchValue(x.objectData);
      });
    }
    this.documentForm.controls['Reference'].updateValueAndValidity();

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
      if (this.documentForm && this.documentForm.controls && this.documentForm.controls['IdVehicle'].value) {
        this.documentForm.controls['IdVehicle'].setValue(null);
      }
      if (this.vehicleDropDown) {
        this.vehicleDropDown.idTier = this.idSelectedTier;
        this.vehicleDropDown.ngOnInit();
      }
    } else {
      this.idSelectedTier = undefined;
    }
    this.documentForm.controls['Reference'].updateValueAndValidity();
  }
  public disableImportBLButtonEvent($event) {
    this.disableImportBLButton = $event;
  }

  TicketHasLignes(): boolean {
    return this.documentLineGrid && this.documentLineGrid.isContainsLines;
  }

  // Getters
  get ReceivedAmount(): FormControl {
    return this.paymentFormGroup.controls.ReceivedAmount as FormControl;
  }

  get Amount(): FormControl {
    return this.paymentFormGroup.controls.Amount as FormControl;
  }

  public getCompanyParams() {
    this.serviceComany.getReducedDataOfCompany().subscribe((x: ReducedCompany) => {
      this.currentCompany = x;
      if (this.documentForm && this.currentCompany.NoteIsRequired) {
        this.documentForm.controls['Reference'].setValidators([Validators.required]);
      }
    });
  }

  public isEnabledFormForPos() {
    if (this.documentForm) {
      if (this.documentForm.controls['IsForPos'] && this.documentForm.controls['IdDocumentStatus'].value === this.statusCode.Provisional) {
        this.documentForm.controls['IdVehicle'].enable();
        this.documentForm.controls['Reference'].enable();

        this.documentForm.controls['Name'].enable();
        this.documentForm.controls['Tel1'].enable();
        this.documentForm.controls['MatriculeFiscale'].enable();

        if (this.hasUpdateTTCAmountPermission) {
          this.documentForm.controls['DocumentTtcpriceWithCurrency'].enable();
        } else {
          this.documentForm.controls['DocumentTtcpriceWithCurrency'].disable();
        }
      }
    }
    return true;
  }

  public focusOnAddLine() {
    this.documentLineGrid.focusOnAddLineButton();
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

}
