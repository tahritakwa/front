import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ViewContainerRef,
  AfterViewInit,
} from '@angular/core';
import { DocumentEnumerator, documentStatusCode } from '../../../models/enumerators/document.enum';
import { DocumentConstant } from '../../../constant/sales/document.constant';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { DocumentService } from '../../../sales/services/document/document.service';
import { Router, ActivatedRoute } from '@angular/router';
import { InformationTypeEnum } from '../../../shared/services/signalr/information/information.enum';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { DocumentAddComponent } from '../../../shared/components/document/document-add/document-add.component';
import { ContactDropdownComponent } from '../../../shared/components/contact-dropdown/contact-dropdown.component';
import { GridPurchaseInvoiceAssestsBudgetComponent } from '../../components/grid-purchase-invoice-assests-budget/grid-purchase-invoice-assests-budget.component';
import { CurrencyService } from '../../../administration/services/currency/currency.service';
import { DocumentFormService } from '../../../shared/services/document/document-grid.service';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { ValidationService } from '../../../shared/services/validation/validation.service';
import { CrudGridService } from '../../../sales/services/document-line/crud-grid.service';
import { FormModalDialogService } from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { FileInfo } from '../../../models/shared/objectToSend';
import { MessageService } from '../../../shared/services/signalr/message/message.service';
import { ExpenseGridComponent } from '../../components/expense-grid/expense-grid.component';

import { InputToCalculateCoefficientOfPriceCost } from '../../../models/purchase/input-to-calculate-coefficient-of-price-cost.model';
import { DocumentExpenseLineService } from '../../services/document-expense-line/document-expense-line.service';
import { CostPriceComponent } from '../../components/cost-price/cost-price.component';
import { Document } from '../../../models/sales/document.model';
import { ExpenseLineObject } from '../../../models/purchase/expense-line-object.model';
import { CostPrice } from '../../../models/purchase/cost-price.model';
import { ReportTemplateService } from '../../../shared/services/report-template/report-template.service';
import { LanguageService } from '../../../shared/services/language/language.service';
import { SearchItemService } from '../../../sales/services/search-item/search-item.service';
import {
  StarkPermissionsService,
  StarkRolesService,
} from '../../../stark-permissions/stark-permissions.module';
import { FileService } from '../../../shared/services/file/file-service.service';
import { SupplierDropdownComponent } from '../../../shared/components/supplier-dropdown/supplier-dropdown.component';
import { ObjectToValidate } from '../../../models/sales/object-to-save.model';
import { RoleConfigConstant } from '../../../Structure/_roleConfigConstant';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { ItemConstant } from '../../../constant/inventory/item.constant';
import { ActivityAreaEnumerator } from '../../../models/enumerators/activity-area.enum';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { LocalStorageService } from '../../../login/Authentification/services/local-storage-service';
import { TiersService } from '../../services/tiers/tiers.service';
import { GridComponent, SelectableSettings, SelectAllCheckboxState } from '@progress/kendo-angular-grid';

const RECEIPT = 'RECEIPT';
const PRINT_PURCHASE_REPORT = 'PRINT_PURCHASE_REPORT';
const PRINT_PURCHASE_EXPENSE_REPORT = 'PRINT_PURCHASE_EXPENSE_REPORT';
const PRINT_PURCHASE_COST_REPORT = 'PRINT_PURCHASE_COST_REPORT';

@Component({
  selector: 'app-purchase-delivery-add',
  templateUrl: './purchase-delivery-add.component.html',
  styleUrls: ['./purchase-delivery-add.component.scss'],
})
export class PurchaseDeliveryAddComponent extends DocumentAddComponent
  implements OnInit, OnDestroy {
  @ViewChild(ContactDropdownComponent) public childListContactDropDown;
  @ViewChild(GridPurchaseInvoiceAssestsBudgetComponent) public documentLineGrid;
  @ViewChild(ExpenseGridComponent) public expenseGrid;
  @ViewChild(CostPriceComponent) public costGrid;
  @ViewChild(GridComponent) public gridSelectTags: GridComponent;
  public isEsnVersion: boolean;

  @ViewChild('tiersDropDown') tiersDropDownEl: SupplierDropdownComponent;
  /** document Title DELIVERY */
  documentTitle: string;
  public totalPriceCost: InputToCalculateCoefficientOfPriceCost;
  /** action to Do (Add, edit, show ) */
  type: string;
  isCostTabSelected: boolean;
  disableValidationButton: boolean;
  /** document Type */
  documentType = DocumentEnumerator.PurchaseDelivery;
  /**cost price data for cost lines*/
  costPriceData: CostPrice;
  currentDate = new Date();
  public jasperPrintData = [];
  public showPriceTab = false;
  public showValidateButton = false;
  public showPrintButton = false;
  public validateDeliveryPermission_PU = false;
  public printDeliveryPermission_PU = false;
  public printExpenseReport = false;
  public printCostReport = false;
  public showSupplierDetails = false;
  public hideSupplierAddBtn = false;
  public hasAddPermission = false;
  public hasUpdatePermission = false;
  public isUpdateMode = false;
  public hasAddMesureUnitPermission: boolean;
  public hasAddExpensePermission: boolean;
  public DocumentStatusCode = documentStatusCode;
  public OfConfirmationDocumentRole: boolean;
  public showTagModal = false;
  public tagDataList :any[];
  public selectedTagLinesId : number[]= [];
  public editedRowIndex : number = -1;
  public formGroupTags : FormGroup;
  public selectAllState: SelectAllCheckboxState = 'checked';
  public selectableSettings: SelectableSettings;
  public allTags :any[];
  public shearchProductRef :string;

  constructor(
    private fb: FormBuilder,
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
    private documentExpenseGridLineService: CrudGridService,
    public documentExpenseLineService: DocumentExpenseLineService,
    protected serviceReportTemplate: ReportTemplateService,
    protected languageService: LanguageService,
    protected searchItemService: SearchItemService,
    protected permissionsService: StarkPermissionsService,
    protected fileServiceService: FileService,
    protected rolesService: StarkRolesService,
    protected growlService: GrowlService,
    public authService: AuthService,
    private localStorageService: LocalStorageService,
    protected tiersService: TiersService
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

    this.route.params.subscribe((params) => {
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

  /*set grid of expense data*/
  prepareExpenseLines(data: Document) {
    if (data.DocumentExpenseLine && data.DocumentExpenseLine.length > 0) {
      this.documentExpenseGridLineService.expenseData = [];
      data.DocumentExpenseLine.forEach((line) => {
        const expenseLine: ExpenseLineObject = new ExpenseLineObject(line);
        Object.assign(line, expenseLine);
        this.documentExpenseGridLineService.saveData(line, true, 'expenseData');
      });
      this.expenseGrid.calculateTotalExpenseLine();
    }
  }

  /** calculate document coef  */
  public priceCost(isToInitialize?: boolean) {
    if (
      !isToInitialize ||
      (isToInitialize &&
        (!this.costGrid.gridSettings.gridData ||
          !this.costGrid.gridSettings.gridData.data ||
          this.costGrid.gridSettings.gridData.data.length === 0))
    ) {
      if (
        this.documentForm.controls[
          DocumentConstant.DOCUMENT_HT_PRICE_WITH_CURRENCY
        ].value >= 0 &&
        this.documentForm.controls[DocumentConstant.ID_DOCUMENT_STATUS]
          .value === this.statusCode.Provisional
      ) {
        this.totalPriceCost = new InputToCalculateCoefficientOfPriceCost(
          this.documentForm.controls['IdCurrency'].value,
          this.documentForm.controls[
            DocumentConstant.DOCUMENT_TTC_PRICE_WITH_CURRENCY
          ].value,
          this.documentForm.controls[
            DocumentConstant.DOCUMENT_HT_PRICE_WITH_CURRENCY
          ].value,
          this.expenseGrid.totalTtcExpense,
          this.documentForm.controls[DocumentConstant.DOCUMENT_DATE].value,
          this.documentForm.controls[DocumentConstant.ID_DOCUMENT].value,
          this.costGrid.margin,
          null,
          null
        );
        this.documentService
          .calculateCostPrice(this.totalPriceCost)
          .subscribe((data) => {
            this.costGrid.setCoefficient(data.objectData);
            this.costGrid.initDataSource();
          });
      } else {
        if (this.isCostTabSelected) {
          this.costGrid.initDataSource();
        }
      }
    }
  }

  /** create the form group */
  public createAddForm(): void {
    this.documentForm = this.fb.group({
      Id: [0],
      IdTiers: [
        { value: '', disabled: this.isDisabledForm() },
        Validators.required,
      ],
      DocumentDate: [
        { value: new Date(), disabled: this.isDisabledForm() },
        Validators.required,
      ],
      IdDocumentStatus: [1],
      Code: [
        { value: 'DELIVERY/' + this.currentDate.getFullYear(), disabled: true },
      ],
      Reference: [{ value: '', disabled: this.isDisabledForm() }],
      IdCurrency: [{ value: '', disabled: true }, Validators.required],
      IdContact: [{ value: '', disabled: this.isDisabledForm() }],
      DocumentHtpriceWithCurrency: [
        { value: NumberConstant.ZERO, disabled: true },
      ],
      DocumentTotalVatTaxesWithCurrency: [
        { value: NumberConstant.ZERO, disabled: true },
      ],
      DocumentTtcpriceWithCurrency: [
        { value: NumberConstant.ZERO, disabled: true },
      ],
      DocumentTtcprice: [{ value: NumberConstant.ZERO, disabled: true }],
      DocumentTotalDiscountWithCurrency: [
        { value: NumberConstant.ZERO, disabled: true },
      ],
      DocumentOtherTaxesWithCurrency: [
        { value: NumberConstant.ZERO, disabled: this.isDisabledForm() },
      ],
      DocumentTotalExcVatTaxesWithCurrency: [
        { value: NumberConstant.ZERO, disabled: true },
      ],
      DocumentPriceIncludeVatWithCurrency: [
        { value: NumberConstant.ZERO, disabled: true },
      ],
      DocumentAmountPaidWithCurrency: [0],
      DocumentRemainingAmountWithCurrency: [0],
      DocumentTypeCode: [this.documentEnumerator.PurchaseDelivery],
      IdDocumentAssociated: [null],
      DocumentAssociatedType: [this.documentEnumerator.PurchaseFinalOrder],
      IsGenerated: [false],
      ExchangeRate: [null],
      DocumentInvoicingNumber: [{ value: '', disabled: this.isDisabledForm() }],
      DocumentInvoicingDate: [
        { value: new Date(), disabled: this.isDisabledForm() },
      ],
      ProvisionalCode: ['']
    });
  }

  ngOnInit() {
    this.validateDeliveryPermission_PU = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.VALIDATE_RECEIPT_PURCHASE);
    this.printDeliveryPermission_PU = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.PRINT_RECEIPT_PURCHASE);
    this.printExpenseReport = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.PRINT_EXPENSE_PURCHASE);
    this.printCostReport = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.PRINT_COST_PRICE_PURCHASE);
    this.showSupplierDetails = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_SUPPLIER);
    this.hideSupplierAddBtn = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.ADD_SUPPLIER);
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.ADD_RECEIPT_PURCHASE);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_RECEIPT_PURCHASE);
    this.hasAddMesureUnitPermission = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.ADD_MEASUREUNIT);
    this.hasAddExpensePermission = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.ADD_EXPENSE);
    this.type = this.documentService.setDocumentUrlType(this.router);
    this.loadOfConfirmationDocumentRole();
    this.documentLineGrid.view = this.service.data;
    this.createAddForm();
    this.getListReportTemplate();
    if (this.id > 0) {
      this.getDataToUpdate();
    }
    this.documentTitle = this.translate.instant(RECEIPT);
    this.documentService.setDocumentType(this.documentType);
    this.warningParagraph = 'VALIDATE_RECEIPT_WARRINIG_PARAGRAPH';
    this.validateDocumentText = 'VALIDATE_RECEIPT';
    this.validationMessageServiceInformation =
      InformationTypeEnum.PURCHASE_RECEIPT_VALIDATION;
    this.addMessageServiceInformation =
      InformationTypeEnum.PURCHASE_RECEIPT_ADD;
    this.backToListLink = DocumentConstant.PURCHASE_DELIVERY_URL;
    this.routerReportLink = DocumentConstant.PURCHASE_DELIVERY_REPORT_URL;
    this.showPriceTab = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.COST_PRICE_PURCHASE);
    this.initPrintReportJasperData();
    this.addPrintPurchaseCostReportToJasperData();
    super.ngOnInit();
    if (this.isUpdateMode && !this.hasUpdatePermission
      && this.documentForm.controls['IdDocumentStatus'].value === this.statusCode.Provisional) {
      this.documentForm.disable();
    }
  }
  initPrintReportJasperData() {
    if (this.printExpenseReport) {
      this.jasperPrintData.push({ printType: PRINT_PURCHASE_EXPENSE_REPORT, TemplateCode: this.translate.instant(PRINT_PURCHASE_EXPENSE_REPORT) });
    }
    if (this.printDeliveryPermission_PU) {
      this.jasperPrintData.push({ printType: PRINT_PURCHASE_REPORT, TemplateCode: this.translate.instant(PRINT_PURCHASE_REPORT) });
    }
  }

  public RecalculateDocumentAndDocumentLineAfterChangingCurrencyExchangeRate() {
    // this.documentForm.controls['ExchangeRate'].setValidators(
    //     [Validators.pattern('[+]?[0-9]*\.?[0-9]*'),
    //     Validators.min(0)]);
    if (!Number(this.documentForm.controls['ExchangeRate'].value) || this.documentForm.controls['ExchangeRate'].value < 0) {
      if (this.documentForm.controls['ExchangeRate'].value) {
        this.documentForm.controls['ExchangeRate'].setErrors({ incorrect: true });
      }
    }
    if (this.documentForm.controls['Id'].value > 0 && this.documentForm.valid && this.documentForm.controls['ExchangeRate'].value !== this.oldValueRate) {
      this.documentService.RecalculateDocumentAndDocumentLineAfterChangingCurrencyExchangeRate(
        this.documentForm.controls['Id'].value,
        this.documentForm.controls['ExchangeRate'].value).subscribe((data) => {
          if (!this.documentForm.controls['ExchangeRate'].value || this.documentForm.controls['ExchangeRate'].value == 0) {
            if (data == null || data == 0) {
              this.documentForm.controls['ExchangeRate'].setValue(undefined);
            } else {
              this.documentForm.controls['ExchangeRate'].setValue(data);
            }
          }
          this.expenseGrid.calculateTotalExpenseLine();
          this.oldValueRate = this.documentForm.controls['ExchangeRate'].value;
        });
    }
  }
  ngOnDestroy() {
    this.service.otherData = [];
    this.service.data = [];
    this.service.DataToImport = [];
  }
  validate() {
    this.prepareDocument();
    if (this.documentForm.valid || this.documentForm.status === SharedConstant.DISABLED) {
      this.objectToValidate = new ObjectToValidate(
        this.documentForm.controls['Id'].value
      );
      this.documentService.isAnyLineWithoutPrice(this.documentForm.controls['Id'].value).subscribe(x => {
        if (x.objectData === true) {
          this.swalWarrings.CreateSwal(this.translate.instant('SOME_LINES_ARE_ZERO')
            , this.translate.instant('VALIDATE'), this.translate.instant('VALIDATE')).then((result) => {
              if (result.value) {
                this.validatePurchaseDelivery();
              }
            });
        } else {
          this.validatePurchaseDelivery();
        }
      });
    } else {
      this.disableValidationButton = false;
      this.validationService.validateAllFormFields(this.documentForm);
    }
  }

  private addPrintPurchaseCostReportToJasperData() {
    if (this.showPriceTab && this.printCostReport) {
      this.jasperPrintData.push({ printType: PRINT_PURCHASE_COST_REPORT, TemplateCode: this.translate.instant(PRINT_PURCHASE_COST_REPORT) });
    }
  }
  /**
   * validate Purchase delivery
   */
  validatePurchaseDelivery() {
    this.documentService
      .validateDocument(this.objectToValidate)
      .subscribe((res) => {
        this.disableValidationButton = false;
        this.redirectUrl();
        this.sendValidationMessage(res);
      });
  }

  onClickValidate() {
    if (this.documentForm.valid || this.documentForm.status === SharedConstant.DISABLED) {
      if (!this.showReportAfterValidation()) {
        if (this.isAllawedToValidate) {
          const validationText = this.getValidationText();
          const validationTitle = this.getValidationTitle();
          const confirmButtonText = `${this.translate.instant('VALIDATE')}`;

          this.swalWarrings
            .CreateSwal(
              `${this.translate.instant('REQUEST_CALCUL_COST_PRICE')}`,
              `${this.translate.instant('CALCULATION_COST_PRICE')}`,
              `${this.translate.instant('CALCULATE')}`
            )
            .then((result) => {
              if (result.value) {
                this.disableValidationButton = true;
                this.totalPriceCost = new InputToCalculateCoefficientOfPriceCost(
                  this.documentForm.controls['IdCurrency'].value,
                  this.documentForm.controls[
                    DocumentConstant.DOCUMENT_TTC_PRICE_WITH_CURRENCY
                  ].value,
                  this.documentForm.controls[
                    DocumentConstant.DOCUMENT_HT_PRICE_WITH_CURRENCY
                  ].value,
                  this.expenseGrid.totalTtcExpense,
                  this.documentForm.controls[
                    DocumentConstant.DOCUMENT_DATE
                  ].value,
                  this.documentForm.controls['Id'].value,
                  this.costGrid.marginn,
                  null,
                  null
                );
                this.documentService
                  .calculateCostPrice(this.totalPriceCost)
                  .subscribe(() => {
                    this.swalWarrings
                      .CreateSwal(
                        validationText,
                        validationTitle,
                        confirmButtonText
                      )
                      .then((res) => {
                        if (res.value) {
                          this.validate();
                        }
                        this.disableValidationButton = false;
                      });
                  });
              }
            });

        }
      } else {
        this.disableValidationButton = true;
        this.validate();
      }
    } else {
      this.validationService.validateAllFormFields(this.documentForm);
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

  public loadUpdateValidDocumentRole() {
    if (this.documentType === DocumentEnumerator.PurchaseDelivery) {
      this.permissionsService
        .hasPermission(RoleConfigConstant.UPDATE.PURCHASEDELIVERY_SA)
        .then((x) => (this.updateValidDocumentRole = x));
    }
  }

  public loadDeleteValidDocumentRole() {
    if (this.documentType === DocumentEnumerator.PurchaseDelivery) {
      this.permissionsService
        .hasPermission(RoleConfigConstant.DELETE.PURCHASEDELIVERY_SA)
        .then((x) => (this.deleteDocumentLineRole = x));
    }
  }

  public loadValidDocumentRole() {
    if (this.documentType === DocumentEnumerator.PurchaseDelivery) {
      this.permissionsService
        .hasPermission(RoleConfigConstant.VALIDATE.PURCHASEDELIVERY_SA)
        .then((x) => (this.validDocumentRole = x));
    }
  }

  isPrintDisabledDelivery(): boolean {
    if (this.documentForm) {
      if (
        this.documentForm.controls['IdDocumentStatus'].value !== -1 &&
        this.documentForm.controls['IdDocumentStatus'].value !==
        this.statusCode.Valid &&
        this.documentForm.controls['IdDocumentStatus'].value !==
        this.statusCode.Balanced
      ) {
        return !this.printDocumentRole ? false : true;
      }
    }
    return (
      this.idStatus !== -1 &&
      this.idStatus !== this.statusCode.Valid &&
      this.idStatus !== this.statusCode.Balanced &&
      this.printDocumentRole
    );
  }

  public loadPrintDocumentRole() {
    if (this.documentType === DocumentEnumerator.PurchaseDelivery) {
      this.permissionsService
        .hasPermission(RoleConfigConstant.PRINT.PURCHASEDELIVERY_SA)
        .then((x) => (this.printDocumentRole = x));
    }
  }
  public onJasperPrintPointStateClick($event?): void {
    const params = {
      report_documentId: this.documentForm.controls['Id'].value,
    };

    const dataToSend = {
      id: this.documentForm.controls['Id'].value,
      documentName: 'purchasedeliveryreport',
      reportName: 'purchasedeliveryreport',
      reportFormatName: 'pdf',
      printCopies: 1,
      PrintType: -1,
      isFromBL: 0,
      reportparameters: params,
    };

    let url = this.backToListLink.concat('/report/');
    url =
      url +
      dataToSend.id +
      '/'.concat(dataToSend.reportName) +
      '/'.concat(dataToSend.PrintType.toString());

    this.documentService.EndPoint = 'jasperSalesPurchaseReporting';
    this.documentService.downloadJasperReport(dataToSend).subscribe((res) => {
      this.documentService.EndPoint = 'Document';
      this.fileServiceService.downLoadFile(res.objectData);
    });
  }

  public onJasperPrintExpenseClick($event?): void {
    const params = {
      report_documentId: this.documentForm.controls['Id'].value,
    };

    const dataToSend = {
      id: this.documentForm.controls['Id'].value,
      documentName: 'purchasedelivexpreport',
      reportName: 'purchasedelivexpreport',
      reportFormatName: 'pdf',
      printCopies: 1,
      PrintType: -1,
      isFromBL: 0,
      reportparameters: params,
    };

    let url = this.backToListLink.concat('/report/');
    url =
      url +
      dataToSend.id +
      '/'.concat(dataToSend.reportName) +
      '/'.concat(dataToSend.PrintType.toString());
    this.documentService.EndPoint = 'jasperSalesPurchaseReporting';
    this.documentService.downloadJasperReport(dataToSend).subscribe((res) => {
      this.documentService.EndPoint = 'Document';
      this.fileServiceService.downLoadFile(res.objectData);
    });
  }

  public onPrintExpenseClick($event): void {
    const params = {
      id: this.documentForm.controls['Id'].value,
      report_documentId: this.documentForm.controls['Id'].value,
      report_sourceUrl: '',
      isFromBL: -1,
      PrintType: -1,
    };

    const dataToSend = {
      id: this.documentForm.controls['Id'].value,
      reportName: 'purchasedelivexpreport.trdp',
      printCopies: 1,
      PrintType: -1,
      isFromBL: 0,
      reportparameters: params,
    };

    let url = this.backToListLink.concat('/report/');
    url =
      url +
      dataToSend.id +
      '/'.concat(dataToSend.reportName) +
      '/'.concat(dataToSend.PrintType.toString());

    this.documentService.downloadExpenseReport(dataToSend).subscribe((res) => {
      this.fileServiceService.downLoadFile(res.objectData);
    });
  }

  public onJasperPrintCostClick($event?): void {
    const params = {
      report_documentId: this.documentForm.controls['Id'].value,
    };

    const dataToSend = {
      id: this.documentForm.controls['Id'].value,
      documentName: 'purchasedelivcostreport',
      reportName: 'purchasedelivcostreport',
      reportFormatName: 'pdf',
      printCopies: 1,
      PrintType: -1,
      isFromBL: 0,
      reportparameters: params,
    };

    let url = this.backToListLink.concat('/report/');
    url =
      url +
      dataToSend.id +
      '/'.concat(dataToSend.reportName) +
      '/'.concat(dataToSend.PrintType.toString());

    this.documentService.EndPoint = 'jasperSalesPurchaseReporting';
    this.documentService.downloadJasperReport(dataToSend).subscribe((res) => {
      this.documentService.EndPoint = 'Document';
      this.fileServiceService.downLoadFile(res.objectData);
    });
  }

  public onPrintCostClick($event): void {
    const params = {
      id: this.documentForm.controls['Id'].value,
      report_documentId: this.documentForm.controls['Id'].value,
      isFromBL: -1,
      PrintType: -1,
    };

    const dataToSend = {
      id: this.documentForm.controls['Id'].value,
      reportName: 'purchasedelivcostpreport.trdp',
      printCopies: 1,
      PrintType: -1,
      isFromBL: 0,
      reportparameters: params,
    };

    let url = this.backToListLink.concat('/report/');
    url =
      url +
      dataToSend.id +
      '/'.concat(dataToSend.reportName) +
      '/'.concat(dataToSend.PrintType.toString());

    this.documentService.downloadCostReport(dataToSend).subscribe((res) => {
      this.fileServiceService.downLoadFile(res.objectData);
    });
  }

  public onJasperPrintButtonClick(element: any) {
    switch (element.printType) {
      case PRINT_PURCHASE_REPORT:
        this.onJasperPrintPointStateClick();
        break;
      case PRINT_PURCHASE_EXPENSE_REPORT:
        this.onJasperPrintExpenseClick();
        break;
      case PRINT_PURCHASE_COST_REPORT:
        this.onJasperPrintCostClick();
        break;
      default:
        return;
    }
  }
  private redirectPage(status: number, url: string) {
    this.router.navigateByUrl(
      url.concat(this.documentForm.controls['Id'].value +
        '/' + status));
  }

  reValidate() {
    if (this.documentForm.valid || this.documentForm.status === SharedConstant.DISABLED) {
      if (!this.showReportAfterValidation()) {
        if (this.isAllawedToValidate) {

          this.swalWarrings
            .CreateSwal(
              `${this.translate.instant('REQUEST_CALCUL_COST_PRICE')}`,
              `${this.translate.instant('CALCULATION_COST_PRICE')}`,
              `${this.translate.instant('CALCULATE')}`
            )
            .then((result) => {
              if (result.value) {
                this.disableValidationButton = true;
                this.totalPriceCost = new InputToCalculateCoefficientOfPriceCost(
                  this.documentForm.controls['IdCurrency'].value,
                  this.documentForm.controls[
                    DocumentConstant.DOCUMENT_TTC_PRICE_WITH_CURRENCY
                  ].value,
                  this.documentForm.controls[
                    DocumentConstant.DOCUMENT_HT_PRICE_WITH_CURRENCY
                  ].value,
                  this.expenseGrid.totalTtcExpense,
                  this.documentForm.controls[
                    DocumentConstant.DOCUMENT_DATE
                  ].value,
                  this.documentForm.controls['Id'].value,
                  this.costGrid.marginn,
                  null,
                  null
                );
                this.documentService
                  .calculateCostPrice(this.totalPriceCost)
                  .subscribe(() => {
                          this.documentService.reValidate(this.documentForm.controls['Id'].value).subscribe(x => {
                            this.redirectPage(this.DocumentStatusCode.Valid, DocumentConstant.PURCHASE_DELIVERY_SHOW);
                        this.disableValidationButton = false;
                      });
                  });
              }
            });

        }
      } else {
        this.disableValidationButton = true;
      }
    } else {
      this.validationService.validateAllFormFields(this.documentForm);
    }

    
  }

ofConfirmation() {
    this.documentService.ofConfirmation(this.documentForm.controls['Id'].value).subscribe(x => {
      this.redirectPage(this.DocumentStatusCode.DRAFT, DocumentConstant.PURCHASE_DELIVERY_EDIT);
    });
  }

  public loadOfConfirmationDocumentRole() {
    this.OfConfirmationDocumentRole = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.INVALIDATE_INVOICE_SALES);
  }

    public OpenTagModel() {
        if (this.documentLineGrid && this.documentLineGrid.view && this.documentLineGrid.view.data) {
            this.tagDataList = [];
            this.allTags = []
            this.documentLineGrid.view.data.forEach(line => {
                var tag = {
                    'Id': line.Id,
                    'Designation': line.Designation,
                    'Code': line.IdItemNavigation.Code,
                    'MovementQty': line.MovementQty,
                    'QuantityToPrint': line.MovementQty,
                    'Marque': line.IdItemNavigation && line.IdItemNavigation.IdProductItemNavigation &&
                        line.IdItemNavigation.IdProductItemNavigation.LabelProduct ? line.IdItemNavigation.IdProductItemNavigation.LabelProduct : undefined
                };
                this.tagDataList.push(tag);
            });
            this.allTags = this.tagDataList;
            this.selectedTagLinesId = this.tagDataList.map(x => x.Id);
            this.checkOrUncheckButton();
            this.showTagModal = true;
            this.setSelectableSettings();
        }

    }
    public closeTagModal() {
        this.showTagModal = false;
        if (document && document.body && document.body.style) {
            document.body.style.overflow = 'auto';
        }
        this.removeAllModal();
    }
    public removeAllModal() {
        const modal = document.getElementsByClassName('modal-backdrop show');
        if (modal.length > 0) {
            modal[0].className = '';
            this.removeAllModal();
        }
    }

    public PrintTags() {

    }
    public tagLineClickHandler({ sender, rowIndex, dataItem }: any): void {
        if (this.editedRowIndex == -1) {
            this.createFormGroup(dataItem);
            this.editedRowIndex = rowIndex;
            sender.editRow(rowIndex, this.formGroupTags);
        }
    }
    public cancelTagHandler({ sender, rowIndex }) {
        sender.closeRow(rowIndex);
        this.editedRowIndex = -1;
        this.formGroupTags = undefined;
    }
    public createFormGroup(dataItem: any) {
        this.formGroupTags = new FormGroup({
            'Id': new FormControl(dataItem.Id),
            'Designation': new FormControl(dataItem.Designation),
            'Code': new FormControl(dataItem.Code),
            'MovementQty': new FormControl(dataItem.MovementQty),
            'QuantityToPrint': new FormControl(dataItem.QuantityToPrint, { validators: [Validators.min(0), Validators.max(dataItem.MovementQty)] }),
        });
    }
    public selecttagsRow($event) {
        this.checkOrUncheckButton();
    }
    checkOrUncheckButton() {
        const len = this.selectedTagLinesId.length;
        const lenListInGrid = this.tagDataList.map((row) => row.Id).length;
        if (len === 0) {
            this.selectAllState = 'unchecked';
        } else if (len > 0 && len < lenListInGrid) {
            this.selectAllState = 'indeterminate';
        } else {
            this.selectAllState = 'checked';
        }
    }

    public onSelectAllChange(checkedState: SelectAllCheckboxState) {
        if (checkedState === 'checked') {
            this.selectedTagLinesId = [];
            this.selectedTagLinesId = this.tagDataList.map((row) => row.Id);
            this.selectAllState = 'checked';
        } else {
            this.selectedTagLinesId = [];
            this.selectAllState = 'unchecked';
        }
    }
    public setSelectableSettings(): void {
        this.selectableSettings = {
            checkboxOnly: true,
            mode: 'multiple'
        };
    }
    public saveTagHandler($event) {
        const tagQunatity = $event.formGroup.controls.QuantityToPrint.value;
        if ($event.formGroup.valid) {
            $event.dataItem.QuantityToPrint = tagQunatity;
            $event.sender.closeRow($event.rowIndex);
            this.editedRowIndex = -1;
        }

    }
    public shearchProduct() {
        if (this.shearchProductRef) {
            this.tagDataList = this.allTags.filter(x => x.Designation.toLowerCase().includes(this.shearchProductRef.toLowerCase()) ||
                x.Code.toLowerCase().includes(this.shearchProductRef.toLowerCase()));
        } else {
            this.tagDataList = this.allTags;
        }
    }

    public onPrintTagClick(){
      var lineToPrint = undefined;
      if(this.selectedTagLinesId && this.selectedTagLinesId.length > 0){
      this.selectedTagLinesId.forEach(x=>{
        if(lineToPrint){
          lineToPrint = lineToPrint +','+ x +'-'+ this.tagDataList.filter(y=> y.Id == x)[0].QuantityToPrint;
        }else{
          lineToPrint = x +'-'+ this.tagDataList.filter(y=> y.Id == x)[0].QuantityToPrint;
        }
      });
      const params = {
        report_lineIds: lineToPrint,
      };
  
      const dataToSend = {
        documentName: 'TagReport',
        reportName: 'TagReport',
        reportFormatName: 'pdf',
        printCopies: 1,
        reportparameters: params,
      };
      this.documentService.EndPoint = 'salesPurchaseReporting';
      this.documentService.downloadJasperReport(dataToSend).subscribe((res) => {
        this.documentService.EndPoint = 'Document';
        this.fileServiceService.downLoadFile(res.objectData);
      });
    }
    }
}
