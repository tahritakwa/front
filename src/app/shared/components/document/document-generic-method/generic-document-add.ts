import {CurrencyService} from '../../../../administration/services/currency/currency.service';
import {FormGroup} from '@angular/forms';
import {DocumentConstant} from '../../../../constant/sales/document.constant';
import {DocumentFormService} from '../../../services/document/document-grid.service';
import {documentStatusCode, DocumentEnumerator, documentStateCode, InvoicingTypeEnumerator} from '../../../../models/enumerators/document.enum';
import {TranslateService} from '@ngx-translate/core';
import {SwalWarring} from '../../swal/swal-popup';
import {Document} from '../../../../models/sales/document.model';
import {ObjectToSave, ObjectToValidate} from '../../../../models/sales/object-to-save.model';
import {DocumentService} from '../../../../sales/services/document/document.service';
import {ValidationService} from '../../../services/validation/validation.service';
import {MessageService} from '../../../services/signalr/message/message.service';
import {Router} from '@angular/router';
import {SharedConstant} from '../../../../constant/shared/shared.constant';
import {PurchaseOrderConstant} from '../../../../constant/purchase/purchase-order.constant';
import {FormModalDialogService} from '../../../services/dialog/form-modal-dialog/form-modal-dialog.service';
import {ViewContainerRef, OnInit} from '@angular/core';
import {InformationTypeEnum} from '../../../services/signalr/information/information.enum';
import {FileInfo} from '../../../../models/shared/objectToSend';
import {ReportTemplateService} from '../../../services/report-template/report-template.service';
import {LanguageService} from '../../../services/language/language.service';
import {ReportTemplate} from '../../../../models/reporting/report-template.model';
import {PredicateFormat, Filter, Relation, Operation} from '../../../utils/predicate';
import {Languages} from '../../../../constant/shared/services.constant';
import {SearchItemService} from '../../../../sales/services/search-item/search-item.service';
import {StarkPermissionsService, StarkRolesService} from '../../../../stark-permissions/stark-permissions.module';
import {FileService} from '../../../services/file/file-service.service';
import { DocumentTaxsResume } from '../../../../models/sales/document-Taxs-Resume.model';
import { isNullOrUndefined } from 'util';
import { Currency } from '../../../../models/administration/currency.model';
import { TiersService } from '../../../../purchase/services/tiers/tiers.service';
import { ActivitySectorsEnumerator } from '../../../../models/shared/enum/activitySectors.enum';
import { NumberConstant } from '../../../../constant/utility/number.constant';
const BLANK_PAGE_TARGET = '_blank';

export abstract class GenericAddDocument implements OnInit {
  // show document other info if set to true
  public displayDetails: boolean;
  public documentCurrency: number;
  public formatOptions;
  public isSalesDocumment: boolean;
  public currency: number;
  public warningParagraph: string;
  public validateDocumentText: string;
  public currentDocument: Document;
  public objectToSend: ObjectToSave;
  public objectToValidate: ObjectToValidate;
  public validationMessageServiceInformation: InformationTypeEnum;
  public addMessageServiceInformation: InformationTypeEnum;
  public backToListLink: string;
  public routerReportLink: string;
  public idStatus = -1;
  public isSubmited = false;
  public isMultiReportTemplate: boolean;
  public isInEditingMode: boolean;
  // public isUpdateMode: boolean;
  /** enumuration of Status of the document (balanced, VALID ... ) */
  public statusCode = documentStatusCode;
  /** document Enumerator */
  public documentEnumerator: DocumentEnumerator = new DocumentEnumerator();
  dataReportTemplate: Array<ReportTemplate> = new Array<ReportTemplate>();
  printReportType: Array<any> = new Array<any>();
  // document id
  public id: number;
  documentForm: FormGroup;
  public IsBToB: boolean;
  // Observation Files
  public attachmentFilesToUpload: Array<FileInfo>;
  // public isSuperAdminRole = false;
  public updateValidDocumentRole = false;
  public DocumentLineNegotiationOptions = false;
  public printDocumentRole = false;
  public deleteDocumentLineRole = false;
  public validDocumentRole = false;
  public deleteReservedDocumentLineRole = false;
  public oldValueRate: number;
  public isAbledToMerge: boolean;
  public isFromSearchItemInterfce: boolean;
  public isAccounted = false;
  public documentTaxeResume: DocumentTaxsResume[] = [];
  public selectedTierType;
  public idSalesPrice;
  public idSelectedTier;
  selectedCurrency: Currency;
  public showVehicleDropdown = false;
  public hasUpdateTTCAmountPermission : boolean = false;
  public showGenerateDepositInvoiceButton = true;
  public showGenerateInvoiceButton = false;
  public isAdvancePayement = false;
  constructor(protected currencyService: CurrencyService,
    protected documentFormService: DocumentFormService,
    protected translate: TranslateService,
    protected swalWarrings: SwalWarring,
    protected documentService: DocumentService,
    protected validationService: ValidationService,
    protected messageService: MessageService,
    protected router: Router,
    protected formModalDialogService: FormModalDialogService,
    protected viewRef: ViewContainerRef,
    protected serviceReportTemplate: ReportTemplateService,
    protected languageService: LanguageService,
    protected permissionsService: StarkPermissionsService,
    protected searchItemService: SearchItemService,
    protected fileServiceService: FileService,
    protected rolesService: StarkRolesService,
    protected tiersService: TiersService) {

  }


  /**get tiers Currency symbol */
  getSelectedCurrency() {
    this.currencyService.getById(this.documentForm.controls['IdCurrency'].value).subscribe(currency => {
      this.selectedCurrency = currency;
      this.documentCurrency = currency.Precision;
      this.formatOptions = {
        style: 'currency',
        currency: currency.Code,
        currencyDisplay: 'symbol',
        minimumFractionDigits: this.documentCurrency
      };
    });
  }

  /**
   * on select Tiers Prepare supplier
   * @param $event
   */
  receiveSupplier($event) {
    if ($event && $event.type) {
      this.searchItemService.typeSupplier = $event.type;
    }
    this.selectedTier($event);
    if ($event && $event.itemForm &&
      ($event.itemForm.controls['DocumentTypeCode'].value == this.documentEnumerator.SalesInvoices ||
        $event.itemForm.controls['DocumentTypeCode'].value == this.documentEnumerator.SalesInvoiceAsset)
      && $event.selectedTiers && $event.selectedTiers.IdSettlementMode) {
      $event.itemForm.controls['IdSettlementMode'].setValue($event.selectedTiers.IdSettlementMode);
    }
    if ($event && $event.itemForm && $event.itemForm.controls["DocumentTypeCode"].value == this.documentEnumerator.SalesDelivery
      && $event.selectedTiers && $event.selectedTiers.IdDeliveryType) {
      $event.itemForm.controls["IdDeliveryType"].setValue($event.selectedTiers.IdDeliveryType);
    }
    if ($event && $event.selectedTiers && $event.selectedTiers.IdTypeTiers) {
      this.selectedTierType = $event.selectedTiers.IdTypeTiers;
    }
    if ($event && $event.selectedTiers && $event.selectedTiers.IdTypeTiers == 1 && $event.selectedTiers.IdSalesPrice) {
      this.searchItemService.idSelectedSalesPrice = $event.selectedTiers.IdSalesPrice;
    } else {
      this.searchItemService.idSelectedSalesPrice = undefined;
    }

    this.closeLine();
    // Intialise currency and contact with null value in every selection
    this.initialiseContactDropdown();
    this.documentForm.controls[DocumentConstant.ID_CONTACT].setValue(undefined);
    this.documentForm.controls[DocumentConstant.ID_USED_CURRENCY].setValue(undefined);    
    // Prepare Supplier
    const supplierReturn = this.documentFormService.prepareSupplier($event);
    // If type == purchase Delivery then ligne can't be only imported so if we change supplier all lines in the grid must be deleted
    this.deleteLinesInTheGridAfterChangingSupplier();
    if (supplierReturn) {
      this.documentForm.controls[DocumentConstant.ID_USED_CURRENCY].setValue(this.documentFormService.currency);
      // modify the list of contacts
      this.SetContact();
      // set currency format to kendo input from the selected Currency related to the supplier
      this.getSelectedCurrency();

    }
    if (!this.isSalesDocumment) {
      this.getCompanyParams();
    }
    if ($event) {
      this.checkForPreviousProvisinalDSA();
      if ((this.documentForm.controls['DocumentTypeCode'].value !== this.documentEnumerator.SalesDelivery && this.isSalesDocumment) || (
        this.documentForm.controls['DocumentTypeCode'].value === this.documentEnumerator.SalesDelivery &&  this.documentForm.controls['IsForPos'] &&
        this.documentForm.controls['IsForPos'].value)) {
        this.focusOnAddLine();
      }
    }
    if (this.documentForm.controls['Id'].value > 0) {
      this.changeData();
    }
    this.searchItemService.idSupplier = this.documentForm.controls['IdTiers'].value;
    //  if ($event.selectedValue) {
    this.setSupplierName();
    // }
  }

  abstract changeData();
  abstract selectedTier(data: any);

  /**
   * on Click validate Button
   */
  onClickValidate() {
    if (this.isSubmited) {
      this.validateOperation();
    } else {
      this.saveDocumentMessageNotification();
      this.validateOperation();
    }
  }

  private validateOperation() {
    if (!this.showReportAfterValidation()) {
      if (this.isAllawedToValidate) {
        const validationText = this.getValidationText();
        const validationTitle = this.getValidationTitle();
        const confirmButtonText = `${this.translate.instant('VALIDATE')}`;
        this.swalWarrings.CreateSwal(validationText, validationTitle, confirmButtonText).then((result) => {
          if (result.value) {
            this.validate();
          }
        });
      }
    } else {
      this.validate();
    }
  }

  getValidationText(): string {
    let message;
    message = `${this.translate.instant(this.warningParagraph)}`;
    return message;
  }

  getValidationTitle(): string {
    let title;
    title = `${this.translate.instant(this.validateDocumentText)}`;
    return title;
  }

  public redirectUrl() {
    const url = this.backToListLink.concat(PurchaseOrderConstant.ROUTE_SHOW);
    this.router.navigateByUrl(url.concat(this.documentForm.controls['Id'].value + '/' + 2));
  }

  /**check if the document is saved or updated before validating */
  validate() {
    if (this.documentForm.valid || this.documentForm.status === SharedConstant.DISABLED) {
      this.prepareDocument();
      if (this.documentForm.value.ExchangeRate) {
        this.documentForm.controls['ExchangeRate'].setErrors({ incorrect: false });
      }
      this.documentService.isAnyLineWithoutPrice(this.documentForm.controls['Id'].value).subscribe(x => {
        if (x.objectData === true) {
          this.swalWarrings.CreateSwal(this.translate.instant('SOME_LINES_ARE_ZERO')
            , this.translate.instant('VALIDATE'), this.translate.instant('VALIDATE')).then((result) => {
              if (result.value) {
                this.ValidateCallService();
              }
            });
        } else {
          this.ValidateCallService();
        }
      });

    } else {
      this.validationService.validateAllFormFields(this.documentForm);
    }
  }

  ValidateCallService() {
    this.objectToValidate = new ObjectToValidate(this.documentForm.controls['Id'].value);
    this.documentService.validateDocument(this.objectToValidate).subscribe((res) => {
      this.redirectUrl();
      this.sendValidationMessage(res);
    });
  }

  /**prepare document values for saving */
  prepareDocument() {
    this.currentDocument = new Document(
      // document lines
      this.documentForm.getRawValue()
    );
    this.objectToSend = new ObjectToSave(this.currentDocument);
  }

  /**
   * Send Add Notification
   * @param documentType
   * @param res
   */  sendValidationMessage(res) {
    this.messageService.startSendMessage(res, this.validationMessageServiceInformation, null, true, undefined, this.IsBToB,
      this.documentForm.controls['IdTiers'].value);
  }

  /* Send Add Notification
  * @param documentType
  * @param res
  */
  public async saveDocumentMessageNotification() {
    const Data = {
      Code: this.documentForm.controls['Code'].value,
      Id: this.documentForm.controls['Id'].value
    };
    this.isSubmited = true;
    await this.messageService.startSendMessage(Data, this.addMessageServiceInformation, null, true, undefined, this.IsBToB,
      this.documentForm.controls['IdTiers'].value);
  }

  onClickGoToList() {
    this.router.navigateByUrl(this.backToListLink);
  }

  public getPrintType(printType) {
    if (printType === 'ORIGINALE') {
      return 0;
    } else if (printType === 'COPIE') {
      return 1;
    } else if (printType === 'DUPLICATA') {
      return 2;
    } else if (printType == 'DETAILED') {
      return 3;
    } else {
      return -1;
    }
  }

  // get report after selecting report button
  public getReportName($event) {
    let printType;
    let printCopies = 1;
    let isFromBL = -1;
    const docTypeCode = this.documentForm.controls['DocumentTypeCode'].value;
    let params = null;

    if ($event && $event.printType) {
      printType = this.getPrintType($event.printType);
    } else {
      printType = -1;
    }

    if (this.documentForm.controls['IdDocumentStatus'].value === 1) {
      printCopies = 0;
    }

    if ((docTypeCode === this.documentEnumerator.SalesInvoices) || (docTypeCode === this.documentEnumerator.SalesInvoiceAsset)) {

      if (docTypeCode === this.documentEnumerator.SalesInvoices) {
        isFromBL = 1;
      }
      params = {
        report_documentId: this.documentForm.controls['Id'].value,
        print_type: printType
      };
    } else {
      params = {
        report_documentId: this.documentForm.controls['Id'].value
      };
    }
    if (docTypeCode === this.documentEnumerator.SalesOrder || docTypeCode === this.documentEnumerator.SalesQuotations) {
      return {
        'id': this.documentForm.controls['Id'].value,
        'reportName': this.dataReportTemplate && this.dataReportTemplate.length > 0 ? (<any>this.dataReportTemplate[0]).ReportName : 'documentReport',
        'documentName': 'report_'.concat(docTypeCode),
        'reportCode': docTypeCode,
        'reportFormatName': 'pdf',
        'printCopies': printCopies,
        'PrintType': printType,
        'isFromBL': isFromBL,
        'reportparameters': params
      };
    } else if (docTypeCode === this.documentEnumerator.SalesDelivery) {
      return {
        'id': this.documentForm.controls['Id'].value,
        'reportName': ($event && $event.ReportName) ? $event.ReportName : (this.dataReportTemplate && this.dataReportTemplate.length > 0 ? (<any>this.dataReportTemplate[0]).ReportName : 'documentReport'),
        'documentName': 'report_'.concat(docTypeCode),
        'reportCode': docTypeCode,
        'reportFormatName': 'pdf',
        'printCopies': printCopies,
        'PrintType': printType,
        'isFromBL': isFromBL,
        'reportparameters': params,
        'getWithReportName': true
      };
    } else if (docTypeCode === this.documentEnumerator.SalesInvoices) {
      if ($event && $event.TemplateCode && $event.TemplateCode == 'DETAILED') {
        var detailledReportData = this.dataReportTemplate.filter(x => x.TemplateCode == 'DETAILED')[0];

        return {
          'id': this.documentForm.controls['Id'].value,
          'reportName': detailledReportData ?  (<any>detailledReportData).ReportName : 'documentSalesDetails',
          'documentName': 'report_'.concat(docTypeCode),
          'reportCode': docTypeCode,
          'reportFormatName': 'pdf',
          'printCopies': printCopies,
          'PrintType': printType,
          'isFromBL': isFromBL,
          'reportparameters': params
        };
      } else {
        var detailledReportData = this.dataReportTemplate.filter(x => x.TemplateCode != 'DETAILED')[0];

        return {
          'id': this.documentForm.controls['Id'].value,
          'reportName': detailledReportData ?  (<any>detailledReportData).ReportName : 'genericDocumentReport',
          'documentName': 'report_'.concat(docTypeCode),
          'reportCode': docTypeCode,
          'reportFormatName': 'pdf',
          'printCopies': printCopies,
          'PrintType': printType,
          'isFromBL': isFromBL,
          'reportparameters': params
        };


      }

    }
      
    else {
      return {
        'id': this.documentForm.controls['Id'].value,
        'reportName': this.dataReportTemplate && this.dataReportTemplate.length > 0 ? (<any>this.dataReportTemplate[0]).ReportName : 'genericDocumentReport',
        'documentName': 'report_'.concat(docTypeCode),
        'reportCode': docTypeCode,
        'reportFormatName': 'pdf',
        'printCopies': printCopies,
        'PrintType': printType,
        'isFromBL': isFromBL,
        'reportparameters': params
      };
    }

  }

  // onclick report button
  public onDownloadClick($event): void {
    const dataToSend = this.getReportName($event);

    const url = this.backToListLink.concat('/report/');
    // url = url + dataToSend.reportparameters.id + '/'.concat(dataToSend.reportName) + '/'.concat(dataToSend.reportparameters.PrintType);
    this.downloadReport(dataToSend);
  }

  // onclick report button
  public onPrintClick($event): void {
    const dataToSend = this.getReportName($event);
    this.openReport(dataToSend);
  }


  public onJasperPrintClick($event?): void {
    const dataToSend = this.getReportName($event);
    this.openJasperReport(dataToSend);
  }
  public onClickGetOverview($event) {
    this.onJasperPrintClick($event);
  }
  // open report modal
  public openReport(dataToSend) {

    let url = this.backToListLink.concat('/report/');
    url = url + dataToSend.id + '/'.concat(dataToSend.reportName) + '/'.concat(dataToSend.printType);

    if (this.documentForm.controls['DocumentTypeCode'].value === this.documentEnumerator.SalesDelivery
      || this.documentForm.controls['DocumentTypeCode'].value === this.documentEnumerator.SalesAsset) {
      this.printDownloadedReport(dataToSend);
    } else if (this.documentForm.controls['DocumentTypeCode'].value === this.documentEnumerator.PurchaseDelivery) {
      // this.downloadReport(dataToSend);
      this.downloadPurchaseReport(dataToSend);
    } else {
      this.downloadReport(dataToSend);
    }

  }

  // open jasper report modal
  public openJasperReport(dataToSend) {
    const url = this.backToListLink.concat('/report/');
    // url = url + dataToSend.id + '/'.concat(dataToSend.reportName) + '/'.concat(dataToSend.printType);

    if (this.documentForm.controls['DocumentTypeCode'].value === this.documentEnumerator.SalesDelivery
      || this.documentForm.controls['DocumentTypeCode'].value === this.documentEnumerator.SalesAsset) {
      // this.printDownloadedJasperReport(dataToSend);
      this.downloadJasperReport(dataToSend);
    } else if (this.documentForm.controls['DocumentTypeCode'].value === this.documentEnumerator.PurchaseDelivery) {
      // this.downloadPurchaseReport(dataToSend);
      this.downloadJasperReport(dataToSend);
    } else {
      this.downloadJasperReport(dataToSend);
    }

  }


  /// Download Invoice
  public downloadReport(dataItem): void {
    this.documentService.downloadReport(dataItem).subscribe(
      res => {
        this.fileServiceService.downLoadFile(res.objectData);
      });
  }

  /// Download Invoice Jasper
  public downloadJasperReport(dataItem): void {
    this.documentService.EndPoint = 'jasperSalesPurchaseReporting';
    this.documentService.downloadJasperReport(dataItem).subscribe(
      res => {
        this.documentService.EndPoint = 'Document';
        this.fileServiceService.downLoadFile(res.objectData);
      });
    // this.documentService.EndPoint = 'Document';
  }

  /// Download Invoice
  public downloadPurchaseReport(dataItem): void {
    // this.documentService.downloadPurchaseReport(dataItem).subscribe(
    this.documentService.downloadPurchaseDeliveryReport(dataItem).subscribe(
      res => {
        this.fileServiceService.downLoadFile(res.objectData);
      });
  }

  /// Print Invoice Directly
  public printDownloadedReport(dataItem): void {
    this.documentService.printReport2(dataItem).subscribe(
      res => { });
  }

  /// Print Invoice Directly
  public printAndDownloadedReport(dataItem): void {
    this.documentService.printReport2(dataItem).subscribe(
      res => {
        this.fileServiceService.downLoadFile(res.objectData);
      });
  }

  /// Print Invoice Directly
  public multiPrintDownloadedReport(dataItem): void {
    this.documentService.multiPrintReport(dataItem).subscribe(
      res => {
        this.fileServiceService.downLoadFile(res.objectData);
      });
  }

  /// Print Invoice Directly
  public printDownloadedJasperReport(dataItem): void {
    this.documentService.printJasperReport(dataItem).subscribe(
      res => { });
  }

  public formatDate(): string {
    return this.translate.instant(SharedConstant.DATE_FORMAT);
  }

  /** get data when update or show document */
  public getDataToUpdate(id?: number) {
    if (id && !this.id) {
      this.id = id;
    }
    if (!this.id && this.documentForm && this.documentForm.value.Id) {
      this.id = this.documentForm.value.Id;
    }
    this.documentService.getDocumentWithDocumentLine(this.id).subscribe((data: Document) => {
      // Save the Received Document from the server

      this.currentDocument = data;
      this.documentService.documentTtcPrice = this.currentDocument.DocumentTtcpriceWithCurrency;
      if(this.currentDocument && this.currentDocument.InoicingType && this.currentDocument.InoicingType == InvoicingTypeEnumerator.advance_Payment)
      {
        this.isAdvancePayement = true;
        if(this.documentForm && this.documentForm.controls['DocumentTtcpriceWithCurrency']){
          this.documentForm.controls['DocumentTtcpriceWithCurrency'].disable();
        }

      }
      if(this.currentDocument && this.currentDocument.DocumentTypeCode == this.documentEnumerator.SalesInvoices && this.currentDocument.IdSalesDepositInvoice && 
        this.currentDocument.IdSalesOrder && this.documentForm && this.documentForm.controls['DocumentTtcpriceWithCurrency'] ){
          this.documentForm.controls['DocumentTtcpriceWithCurrency'].disable();
        }
      {
        
      }
      if (data && data.IdSalesDepositInvoice && data.DocumentTypeCode == this.documentEnumerator.SalesOrder && data.IdDocumentStatus == documentStatusCode.Valid){
        this.showGenerateDepositInvoiceButton = false;
        this.showGenerateInvoiceButtonVerification(data.IdSalesDepositInvoice, this.id);
      }else if (data && !data.IdSalesDepositInvoice && data.DocumentTypeCode == this.documentEnumerator.SalesOrder && data.IdDocumentStatus == documentStatusCode.Valid){
        this.showGenerateDepositInvoiceButton = true;
      }
      this.idSelectedTier = data.IdTiers;
      this.loadVehicleList();
      if (this.currentDocument && this.currentDocument.IdTiersNavigation && this.currentDocument.IdTiersNavigation.IdSalesPrice) {
        this.searchItemService.idSelectedSalesPrice = this.currentDocument.IdTiersNavigation.IdSalesPrice;
      }
      this.IsBToB = data.IsBToB;
      this.isAccounted = data.IsAccounted;

      this.loadUpdateValidDocumentRole();
      /**set expense line */
      this.prepareExpenseLines(data);
      // set is validated attribut from the documentStatus
      if (data.IdDocumentStatus !== documentStatusCode.Provisional
        && data.IdDocumentStatus !== documentStatusCode.Refused) {
        this.idStatus = data.IdDocumentStatus;
      }
      data.DocumentDate = new Date(data.DocumentDate);
      data.ValidationDate = new Date(data.ValidationDate);
      data.CreationDate = new Date(data.CreationDate);
      data.DocumentInvoicingDate = new Date(data.DocumentInvoicingDate);
      data.IdCurrency = data.IdUsedCurrency;
      if (!isNullOrUndefined(this.documentForm)) { 
        this.documentForm.patchValue(data);
        }
      if ((data.DocumentTypeCode == this.documentEnumerator.PurchaseDelivery || data.DocumentTypeCode == this.documentEnumerator.PurchaseInvoices) &&
        this.documentForm.controls['ExchangeRate'] && this.documentForm.controls['ExchangeRate'].value && this.documentForm.controls['ExchangeRate'].value == 0) {
        this.documentForm.controls['ExchangeRate'].setValue(undefined);
      }
      if (!this.isFromSearchItemInterfce) {
        this.setDocumentLines(data);
      }
      if (data.FilesInfos) {
        this.attachmentFilesToUpload = data.FilesInfos;
      }
      this.SetContact();
      this.getSelectedCurrency();

      this.displaySettlements(data.Id);
      if (!this.isSalesDocumment) {
        this.getCompanyParams();
      }
      this.isGeneratedLine();
      this.documentForm.controls['IdTiers'].disable();
      this.isSubmited = data.IsSubmited;
      if (this.documentForm.controls['ExchangeRate']) {
        this.oldValueRate = this.documentForm.controls['ExchangeRate'].value;
      }

      // for search Item modal
      this.searchItemService.idDocument = data.Id;
      this.searchItemService.statusDocument = data.IdDocumentStatus;
      this.searchItemService.code = data.Code;
      this.searchItemService.idSupplier = data.IdTiersNavigation.Id;
      this.searchItemService.typeSupplier = data.IdTiersNavigation.IdTypeTiers;
      this.searchItemService.supplierName = data.IdTiersNavigation.Name;
      this.searchItemService.disableFields = false;
      this.searchItemService.searchItemDocumentType = data.DocumentTypeCode;
      if (!this.isFromSearchItemInterfce) {
        this.searchItemService.isFromSearchItem_supplierInetrface = false;
      }
      this.isAbledToMerge = data.isAbledToMerge;


      this.documentTaxeResume.splice(0,)
      data.DocumentTaxsResume.forEach(element => {
        this.documentTaxeResume.push(element);
      });
      if(data.IdSessionCounterSalesNavigation && data.IdSessionCounterSalesNavigation.State === NumberConstant.TWO){
        this.documentForm.controls["IsForPos"].setValue(false);
      }
      if (this.documentForm.controls["IsForPos"] && this.documentForm.controls["IsForPos"].value 
      && this.documentForm.controls["DocumentTypeCode"].value === this.documentEnumerator.SalesDelivery) {
        this.documentForm.disable();
      }
    });
  }
  public isSubmitBtnDisplay() {
    return this.documentForm.controls['Id'].value > 0 && !this.isSubmited;
  }

  getListReportTemplate() {
    const predicate = new PredicateFormat();
    predicate.Filter = new Array<Filter>();
    predicate.Filter.push(new Filter(DocumentConstant.REPORT_CODE, Operation.eq, this.documentForm.controls["DocumentTypeCode"].value));
    predicate.Relation = new Array<Relation>();
    predicate.Relation.push(new Relation(DocumentConstant.ID_ENTITY_NAVIGATION));
    this.serviceReportTemplate.readPredicateData(predicate).subscribe(data => {
      let propertyNameReportTemplate: string;
      if (this.languageService.selectedLang === Languages.FR.value) {
        propertyNameReportTemplate = DocumentConstant.TEMPLATE_NAME_FR;
      } else {
        propertyNameReportTemplate = DocumentConstant.TEMPLATE_NAME_EN;
      }
      data.forEach(repT => {
        repT.text = repT[propertyNameReportTemplate];
      });
      const docTypeCode = this.documentForm.controls['DocumentTypeCode'].value;
      if (data.length > 1 && docTypeCode !== this.documentEnumerator.SalesInvoices) {
        this.isMultiReportTemplate = true;
      } else {
        this.isMultiReportTemplate = false;
      }
        this.dataReportTemplate = data;
    });

    this.printReportType = [
      { printType: 'ORIGINALE', TemplateCode: 'ORIGINALE' },
      { printType: 'COPIE', TemplateCode: 'COPIE' },
      { printType: 'DUPLICATA', TemplateCode: 'DUPLICATA' },
      { printType: 'DETAILED', TemplateCode: 'DETAILED' },
    ];

  }
  public showGenerateInvoiceButtonVerification(idDepositInvoice : number, idOrder : number  ){
    if(idDepositInvoice && idOrder){
      this.documentService.isValidDepositInvoiceStatus(idDepositInvoice, idOrder).subscribe(data => {
        if(data){
          this.showGenerateInvoiceButton = true;
        }
      });

    }
  }
  public ngOnInit() {
  }
  abstract setSupplierName();
  abstract loadPrintDocumentRole();
  abstract loadUpdateValidDocumentRole();
  abstract loadDeleteValidDocumentRole();
  abstract loadDeleteReservedDocumentLineRole();
  abstract loadValidDocumentRole();
  abstract isAllawedToValidate(): boolean;
  abstract initialiseContactDropdown();
  abstract deleteLinesInTheGridAfterChangingSupplier();
  abstract SetContact();
  abstract checkForPreviousProvisinalDSA();
  abstract showReportAfterValidation(): boolean;
  abstract CallngOnInit();
  abstract showReportWithOnPrintClick(): boolean;
  abstract showJasperReportWithOnPrintClick(): boolean;
  abstract isGeneratedLine();
  abstract prepareExpenseLines(data);
  abstract setDocumentLines(data);
  abstract displaySettlements(data);
  abstract getCompanyParams();
  abstract closeLine();
  public focusOnAddLine() { }
  abstract loadVehicleList();
}
