import { Injectable, Inject } from '@angular/core';
import { AppConfig } from '../../../../COM/config/app.config';
import { HttpClient } from '@angular/common/http';
import { Document } from '../../../models/sales/document.model';
import { ItemPrice } from '../../../models/sales/item-price.model';
import { Observable } from 'rxjs/Observable';
import { Operation } from '../../../../COM/Models/operations';
import { DocumentLineUnitPrice } from '../../../models/sales/document-line-unit-price.model';
import { ReduisDocument } from '../../../models/sales/reduis-document.model';
import { ObjectToSave, ObjectToSend } from '../../../models/sales/object-to-save.model';
import { ResourceService } from '../../../shared/services/resource/resource.service';
import { DocumentConstant } from '../../../constant/sales/document.constant';
import { SendMailConfiguration } from '../../../models/shared/send-mail-configuration.model';
import { CreatedData } from '../../../models/shared/created-data.model';
import { FileInfo } from '../../../models/shared/objectToSend';
import { DocumentUpload } from '../../../models/sales/document-upload.model';
import { PurchaseOrderConstant } from '../../../constant/purchase/purchase-order.constant';
import { PredicateFormat } from '../../../shared/utils/predicate';
import { ItemHistory } from '../../../models/inventory/item-history.model';
import { SaveBalancesObject } from '../../../models/sales/save-balances-object-model';
import { ExpenseLineObject } from '../../../models/purchase/expense-line-object.model';
import { DataSourceRequestState, DataResult } from '@progress/kendo-data-query';
import { InputToCalculatePriceCost } from '../../../models/purchase/input-to-calculate-price-cost.model';
import { ImportDocuments } from '../../../models/sales/import-documents.model';
import { DocumentLinesWithPaging } from '../../../models/sales/document-lines-with-paging.model';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { ItemQuantity } from '../../../models/manufacturing/item-quantity';
import { InformationTypeEnum } from '../../../shared/services/signalr/information/information.enum';
import { DataTransferShowSpinnerService } from '../../../shared/services/spinner/data-transfer-show-spinner.service';
import { InputToCalculateCoefficientOfPriceCost } from '../../../models/purchase/input-to-calculate-coefficient-of-price-cost.model';
import { UserService } from '../../../administration/services/user/user.service';
import { BillingEmployee } from '../../../models/sales/billing-employee.model';
import { DocumentEnumerator, documentStatusCode } from '../../../models/enumerators/document.enum';
import { TranslateService } from '@ngx-translate/core';
import {LocalStorageService} from '../../../login/Authentification/services/local-storage-service';
import { ReducedTicket } from '../../../models/treasury/reduced-ticket';
const UPLOAD_FILE_URL = 'uploadFileDocument/';

@Injectable()
export class DocumentService extends ResourceService<Document> {


  lastPurchaseQrderId: number;
  lastPurchaseQuotationId: number;
  documentType: string;
  urlAction: string;
  isEditingExpense: boolean;
  isEditingDocumentLine: boolean;
  documentHasExpense: boolean;
  documentTtcPrice = 0;
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig,
      @Inject(DataTransferShowSpinnerService) dataTransferShowSpinnerService, private localStorageService : LocalStorageService, public translate: TranslateService) {
    super(httpClient, appConfig, 'document', 'Document', 'Sales', dataTransferShowSpinnerService);
  }
  public setDocumentType(documentType) {
    this.documentType = documentType;
  }
  public setDocumentUrlType(router): string {
    if (router.url.indexOf('/' + PurchaseOrderConstant.ADD) > 0) {
      this.urlAction = PurchaseOrderConstant.ADD;
    } else if (router.url.indexOf('/' + PurchaseOrderConstant.EDIT) > 0) {
      this.urlAction = PurchaseOrderConstant.EDIT;
    } else {
      this.urlAction = PurchaseOrderConstant.SHOW;
    }
    return this.urlAction;
  }
  public itemPrices(itemPrice: ItemPrice): Observable<any> {
    const data = {
      'itemPrice': itemPrice
    };
    const objectToSend: ObjectToSend = new ObjectToSend(data, null);
    return this.callService(Operation.POST, DocumentConstant.ITEM_PRICES, objectToSend, null, null, false);
  }
  public getDiscountValue(data: ItemPrice): Observable<any> {
    return this.callService(Operation.POST, DocumentConstant.GET_DISCOUNT_VALUE, data, null, null, false);
  }
  public cancelDocument(data: number): Observable<any> {
    return this.callService(Operation.POST, DocumentConstant.cancelDocument, data, null, null, false);
  }

  public documentLineUnitPrices(data: DocumentLineUnitPrice): Observable<any> {
    return this.callService(Operation.POST, DocumentConstant.LINE_UNIT_PRICES, data, null, null, false);
  }
  public getDocumentLineDiscountRate(data: DocumentLineUnitPrice): Observable<any> {
    return this.callService(Operation.POST, DocumentConstant.LINE_DISCOUNT_RATE, data, null, null, false);
  }
  public getDocumentLineValues(data: ItemPrice): Observable<any> {
    return this.callService(Operation.POST, DocumentConstant.LINE_VALUES, data, null, null, false);
  }
  public getDocumentTotalPrice(data: ReduisDocument): Observable<any> {
    return this.callService(Operation.POST, DocumentConstant.TOTAL_PRICES, data, null, null, false);
  }
  public recalculateDocumentLine(data: ReduisDocument): Observable<any> {
    return this.callService(Operation.POST, DocumentConstant.DOCUMENT_LINE, data, null, null, false);
  }
  public saveDocument(data: ObjectToSave): Observable<any> {
    data.Model.IdExchangeRate = null;
    return this.callService(Operation.POST, DocumentConstant.SAVE, data);
  }

  public isAnyLineWithoutPrice(idDoc: number): Observable<any> {
    return this.callService(Operation.POST, 'isAnyLineWithoutPrice', idDoc, null, null, false);
  }
  public validateDocument(data: ObjectToSave): Observable<any> {
    return this.callService(Operation.POST, DocumentConstant.VALID_DOCUMENT, data, null, null, false);
  }

  public getBlsForTermBilling(month: Date , idTierCategory? : number): Observable<any> {
    const data = {
      'date': month,
      'idTierCategory': idTierCategory
    };
    return this.callService(Operation.POST, DocumentConstant.GET_BLS_FOR_TERM_BILLING , data);
  }
  public getInvoiceAssetsForTermBilling(month: Date , idTierCategory? : number): Observable<any> {
    const data = {
      'date': month,
      'idTierCategory': idTierCategory
    };
    return this.callService(Operation.POST, 'getInvoiceAssetsForTermBilling' , data);
  }
  getDocumentsAssociatedForPriceRequest(documentId: number): Observable<any> {
    return this.callService(Operation.GET, 'getDocumentsAssociatedForPriceRequest/' + documentId);
  }
  GenerateTermInvoice(tierIdList, date, invoicingDate, isBl): Observable<any> {
    const data = {
      tierIdList: tierIdList,
      date: date,
      invoicingDate: invoicingDate,
      isBl: isBl
    };
    const objectToSend: ObjectToSend = new ObjectToSend(data, null);
    return this.callService(Operation.POST, 'generateTermInvoice', objectToSend);
  }

  public editDocument(data: ObjectToSave): Observable<any> {
    return this.callService(Operation.PUT, DocumentConstant.UPDATE, data, null, null, false);
  }

  public getDocumentWithDocumentLine(id: any): Observable<any> {
    return this.callService(Operation.GET, DocumentConstant.GET_DOCUMENT_WITH_DOCUMENT_LINE.concat(id));
  }
  public downloadDocument(idDocument: number): Observable<any> {
    return super.callService(Operation.GET, `${DocumentConstant.REPORT_ROOT}${idDocument}`);
  }
  public removeDocument(data): Observable<any> {
    return super.callService(Operation.DELETE, DocumentConstant.DELETE_ROOT, data);
  }
  public updateDocumentAssociated(data): Observable<any> {
    return super.callService(Operation.PUT, DocumentConstant.UPDATE_DOCUMENT_ASSOCIATED, data, null, null, false);
  }
  public GetDocumentLinesToImport(data): Observable<any> {
    return super.callService(Operation.PUT, DocumentConstant.GET_DOCUMENT_LINES_TO_IMPORT, data, null, null, false);
  }
  public sendMail(idMssage: number, createdData: CreatedData, mails: Array<string>): Observable<any> {
    return super.callService(Operation.POST, DocumentConstant.URL_MAIL_SEND,
      new SendMailConfiguration(idMssage, location.origin + '/main', createdData, mails), null, null, false);
  }
  public uploadFile(fileInfo: FileInfo): Observable<FileInfo> {
    const documentToUpload = new DocumentUpload();
    documentToUpload.fileInfoViewModel = fileInfo;
    documentToUpload.documentType = this.documentType;
    return this.callService(Operation.POST, UPLOAD_FILE_URL, documentToUpload, null, null, false) as Observable<FileInfo>;
  }
  public getDocumentsWithBalances(data): Observable<any> {
    return super.callService(Operation.POST, DocumentConstant.GET_DOCUMENTS_WITH_BALANCES, data, null, null, false);
  }

  public getLastBLPriceForItem(idItem: number, idTiers: number): Observable<any> {
    return super.callService(Operation.POST, 'getLastBLPriceForItem/' + idTiers, idItem, null, null, false);
  }


  /**
  * Get element with predicate condtion
  * @param predicate
  * @returns Observable
  */
  public getModelByCondition(predicate: PredicateFormat): Observable<any> {
    return super.callService(Operation.POST, DocumentConstant.GET_MODEL_BY_CONDITION_DOCUMENT, predicate, null, null, false);
  }
  /**
   * get ShelfAndStorage Of Item In Warehouse
   * @param idItem
   * @param idWarehouse
   */
  public getShelfAndStorageOfItemInWarehouse(idItem: any, idWarehouse: any): Observable<any> {
    return this.callService(Operation.GET, DocumentConstant.GET_SHELF_AND_STORAGE_OF_ITEM_IN_WAREHOUSE.
      concat('/').concat(idItem).concat('/').concat(idWarehouse), null, null, false);
  }
  public checkRealAndProvisionalStock(itemPrice: ItemPrice): Observable<any> {
    const data: any = {};
    data['itemPrice'] = itemPrice;
    const objectToSend: ObjectToSend = new ObjectToSend(data, null);
    return this.callService(Operation.POST, DocumentConstant.CHECK_REAL_AND_PROVISIONAL_STOCK, objectToSend, null, null, false);
  }
  public getItemHistoryMovement(itemHistory: ItemHistory): Observable<any> {
    return super.callService(Operation.POST, DocumentConstant.GET_ITEM_HISTORY_MOVEMENT, itemHistory, null, null, false);
  }
  public deleteDocument(id: any): Observable<any> {
    let data = {
      Id: id,
    };
    return super.callService(Operation.DELETE, 'deleteDocument', data);
  }

  /**
  * Get list of documents with predicate condtion
  * @param predicate
  * @returns Observable
  */
  public getDocumentsIdsWithCondition(state: DataSourceRequestState, predicate: PredicateFormat): Observable<any> {
    this.prepareServerOptions(state, predicate);
    return super.callService(Operation.POST, DocumentConstant.GET_DOCUMENTS_IDS_BY_CONDITION, predicate, null, null, false);
  }

  public getDocumentToImported(filterAccount: any): Observable<any> {
    return super.callService(Operation.POST, DocumentConstant.GET_ACCOUNT_DOCUMENT, filterAccount, null, null, false);
  }
  public accountedDocument(idDocuement: number): Observable<any> {
    return super.callService(Operation.POST, DocumentConstant.ACCOUNT_DOCUMENT, idDocuement, null, null, false);
  }
  public disaccountedDocument(idDocuement: number): Observable<any> {
    return super.callService(Operation.POST, DocumentConstant.DISACCOUNT_DOCUMENT, idDocuement, null, null, false);
  }

  public generateTermInvoices(): Observable<any> {
    return super.callService(Operation.POST, DocumentConstant.GENERATE_TERM_INVOICE);
  }

  public checkinvoicingErrors(): Observable<any> {
    return super.callService(Operation.POST, DocumentConstant.CHECK_INVOICING_ERRORS);
  }

  // real time save
  public saveCurrentDocumentLine(documentLine: ItemPrice, discountRecalculate: boolean = false): Observable<any> {
    documentLine.RecalculateDiscount = discountRecalculate;
    return super.callService(Operation.POST, 'saveCurrentDocumentLine', documentLine, null, null, false);
  }
  public saveCurrentDocument(document: Document): Observable<any> {
    document.UserMail = this.localStorageService.getEmail();
    const data: any = {};
    data['document'] = document;
    const objectToSend: ObjectToSend = new ObjectToSend(data, null);
    return super.callService(Operation.POST, 'saveCurrentDocument', objectToSend, null, true, false);
  }
  public updateDocumentInRealTime(documentId: number): Observable<any> {
    return super.callService(Operation.POST, 'updateDocumentAmounts', documentId, null, null, false);
  }
  public getDocumentInRealTime(documentId: number): Observable<any> {
    return super.callService(Operation.POST, 'getDocumentAmounts', documentId, null, null, false);
  }
  public updateDocumentAfterImport(importDocuments: ImportDocuments): Observable<any> {
    return super.callService(Operation.POST, 'updateDocumentAfterImport', importDocuments, null, null, false);
  }
  public fusionBl(importDocuments: ImportDocuments): Observable<any> {
    return super.callService(Operation.POST, 'fusionBl', importDocuments, null, null, false);
  }
  public saveBalances(data: SaveBalancesObject): Observable<any> {
    return super.callService(Operation.POST, 'SaveBalances', data, null, null, false);
  }

  public saveUpdateExpenseLine(data: ExpenseLineObject): Observable<any> {
    return super.callService(Operation.POST, 'saveUpdateExpenseLine', data, null, null, false);
  }
  public updateDocumentFields(data: ObjectToSave): Observable<any> {
    return super.callService(Operation.POST, 'UpdateDocumentFields', data, null, null, false);
  }



  public updateDocumentAfterImportFile(data: Document): Observable<any> {
    return super.callService(Operation.POST, 'updateDocumentAfterImportFile', data, null, null, false);
  }
  public recalculateDocumentAfterSetBudgetPurchase(data: any): Observable<any> {
    return super.callService(Operation.POST, 'recalculateDocumentAfterSetBudgetPurchase', data, null, null, false);
  }

  public calculateCostPrice(inputToCalculatePriceCost: InputToCalculateCoefficientOfPriceCost): Observable<any> {
    return super.callService(Operation.POST, DocumentConstant.CALCULATE_COST_PRICE, inputToCalculatePriceCost, null, false, false);
  }
  public getCostPriceWithPaging(costPriceWithPaging: DocumentLinesWithPaging): Observable<any> {
    return super.callService(Operation.POST, 'getCostPriceWithPaging', costPriceWithPaging, null, null, false);
  }

  public generateInvoiceFromTimeSheet(objectToSend: ObjectToSave): Observable<any> {
    return this.callService(Operation.POST, DocumentConstant.GENERATE_INVOICE_FROM_TIMESHEET, objectToSend);
  }
  public ImportedInvoiceLinesOnlyForSpecificItem(idItem: number): Observable<any> {
    return this.callService(Operation.POST, 'ImportedInvoiceLinesOnlyForSpecificItem', idItem);
  }

  public getDocumentLinesWithPaging(documentLinesWithPaging: DocumentLinesWithPaging): Observable<DataResult> {

    return this.callService(Operation.POST, 'getDocumentLinesWithPaging', documentLinesWithPaging).map(
      (retournedData: any) =>
        <GridDataResult>{
          data: retournedData.result.listObject.listData,
          total: retournedData.result.listObject.total,
          isContainsLines: retournedData.isContainsLines
        }
    );
  }

  public GetSearchDocumentLineResult(documentLinesWithPaging: DocumentLinesWithPaging): Observable<DataResult> {
    return this.callService(Operation.POST, 'getSearchDocumentLineResult', documentLinesWithPaging).map(
      (listObject: any) =>
        <GridDataResult>{
          data: listObject.listData,
          total: listObject.total
        }
    );
  }

  public savePurchaseBudgetFromPurchaseOrder(idDocument: number): Observable<any> {
    return this.callService(Operation.POST, 'savePurchaseBudgetFromPurchaseOrder', idDocument);
  }

  public updatePurchaseRequest(data: Document): Observable<any> {
    return super.callService(Operation.POST, 'updatePurchaseRequest', data, null, null, false);
  }

  public assingMargin(costPriceWithPaging: InputToCalculatePriceCost): Observable<any> {
    return super.callService(Operation.POST, 'assingMargin', costPriceWithPaging, null, null, false);
  }
  public getAvailbleQuantity(idItem: number, idWarehouse: number): Observable<any> {
    const itemQuantity = new ItemQuantity(idItem, undefined, idWarehouse);
    return super.callService(Operation.POST, 'getAvailbleQuantity', itemQuantity, null, null, false);
  }

  public SendPriceRequestMail(idDocument: number, informationType: InformationTypeEnum): Observable<any> {
    const data = {
      'idDocument': idDocument,
      'informationType': informationType,
      'url': location.origin + '/main'
    };
    return this.callService(Operation.POST, 'sendPriceRequestMailFromOrder', data);
  }

  public saveRemplacementItem(idItem, code, description, idDocumentLine): Observable<any> {
    const data = {
      'idItem': idItem,
      'code': code,
      'description': description,
      'idDocumentLine': idDocumentLine
    };

    return this.callService(Operation.POST, 'saveRemplacementItem', data);
  }
  public getDocumentLineByIdDocument(idDocument: number): Observable<any> {
    return this.callService(Operation.POST, 'getDocumentLineByIdDocument', idDocument, null, null, false);
  }

  public getDocumentLineOfBlNotAssociated(idTiersBS): Observable<any> {
    return this.callService(Operation.POST, 'getDocumentLineOfBlNotAssociated', idTiersBS, null, null, false);
  }

  public updateDocumentBSAfterImport(IdBsDocument: number, importedLines: any): Observable<any> {
    const data = {
      'IdCurrentDocument': IdBsDocument,
      'ReducedImportLines': importedLines
    };
    return this.callService(Operation.POST, DocumentConstant.UPDATE_BS_AFTER_IMPORT, data);
  }

  // real time save
  public saveCurrentBSDocumentLine(documentLine: ItemPrice): Observable<any> {
    return super.callService(Operation.POST, 'saveCurrentBSDocumentLine', documentLine, null, null, false);
  }

  public RecalculateDocumentAndDocumentLineAfterChangingCurrencyExchangeRate(idDocument: number, exchnageRate: number): Observable<any> {
    return this.callService(Operation.POST, 'RecalculateDocumentAndDocumentLineAfterChangingCurrencyExchangeRate/' +
      idDocument, exchnageRate);
  }
  public getFailedSalesDeliveryCount(): Observable<any> {
    return this.callService(Operation.GET, 'getFailedSalesDeliveryCount', null);
  }

  public downloadReport(idDocument: any): Observable<any> {
    return super.callService(Operation.POST,
      `${DocumentConstant.REPORT_ROOT_DOWNLOAD}`, idDocument);
  }

  public downloadJasperReport(idDocument: any): Observable<any> {
    this.EndPoint = 'jasperSalesPurchaseReporting';
    let queryResult = super.callService(Operation.POST,
      `${DocumentConstant.JASPER_REPORT_ROOT_DOWNLOAD}`, idDocument);
    this.EndPoint = 'Document';
    return queryResult;

  }

  public downloadPurchaseDeliveryReport(idDocument: any): Observable<any> {
    return super.callService(Operation.POST,
      `${DocumentConstant.REPORT_ROOT_PURCHASE_DELIVERY_DOWNLOAD}`, idDocument);
  }


  public downloadExpenseReport(idDocument: any): Observable<any> {
    return super.callService(Operation.POST,
      `${DocumentConstant.REPORT_ROOT_PURCHASE_EXPENSE_DOWNLOAD}`, idDocument);
  }

  public downloadCostReport(idDocument: any): Observable<any> {
    return super.callService(Operation.POST,
      `${DocumentConstant.REPORT_ROOT_PURCHASE_COST_DOWNLOAD}`, idDocument);
  }

  public downloadPurchaseReport(idDocument: any): Observable<any> {
    return super.callService(Operation.GET,
      `${DocumentConstant.REPORT_ROOT_PURCHASE_DOWNLOAD}${idDocument.reportparameters.id}/${idDocument.reportparameters.printType}/${idDocument.reportparameters.isFromBL}`);
  }

  public printReport(idDocument: any): Observable<any> {
    return super.callService(Operation.POST,
      `${DocumentConstant.REPORT_ROOT_PRINT}`, idDocument
      , null, null, true);
  }

  public printJasperReport(idDocument: any): Observable<any> {
    return super.callService(Operation.POST,
      `${DocumentConstant.REPORT_ROOT_PRINT}`, idDocument
      , null, null, true);
  }

  public downloadReport2(idDocument: any): Observable<any> {
    return super.callService(Operation.GET,
      `${DocumentConstant.REPORT_ROOT_DOWNLOAD}${idDocument.reportparameters.id}/${idDocument.reportparameters.printType}/${idDocument.reportparameters.isFromBL}`);
  }

  public printReport2(idDocument: any): Observable<any> {
    return super.callService(Operation.GET,
      `${DocumentConstant.REPORT_ROOT_PRINT}${idDocument.id}/${idDocument.printType}/${idDocument.printCopies}/${idDocument.isFromBL}`
      , null, null, true);
  }

  public multiPrintReport(idDocument: any): Observable<any> {
    return super.callService(Operation.POST, `${DocumentConstant.REPORT_ROOT_MULTI_PRINT}`, idDocument);
  }

  public multiPrintReportJasper(idDocument: any): Observable<any> {
    return super.callService(Operation.POST, `${DocumentConstant.REPORT_ROOT_MULTI_PRINT_JASPER}`, idDocument);
  }

  public downloadDailySalesDeliveryReport(idDocument: any): Observable<any> {
    return super.callService(Operation.POST, DocumentConstant.REPORT_ROOT_DOWNLOAD_DAILY_SALES_DELIVERY, idDocument);
  }

  public downloadJasperDailySalesDeliveryReport(idDocument: any): Observable<any> {
    return super.callService(Operation.POST, DocumentConstant.REPORT_ROOT_DOWNLOAD_DAILY_SALES_DELIVERY, idDocument);
  }

  public downloadDocumentControlStatusReport(idDocument: any): Observable<any> {
    return super.callService(Operation.POST, DocumentConstant.REPORT_ROOT_DOWNLOAD_DOCUMENT_CONTROL_STATUS, idDocument);
  }

  public downloadJasperDocumentControlStatusReport(idDocument: any): Observable<any> {
    return super.callService(Operation.POST, DocumentConstant.REPORT_ROOT_JASPER_DOWNLOAD_DOCUMENT_CONTROL_STATUS, idDocument);
  }

  public downloadDailySalesReport(idDocument: any): Observable<any> {
    return super.callService(Operation.POST, DocumentConstant.REPORT_ROOT_DOWNLOAD_DAILY_SALES, idDocument);
  }

  public downloadJasperDailySalesReport(idDocument: any): Observable<any> {
    return super.callService(Operation.POST, DocumentConstant.REPORT_ROOT_DOWNLOAD_JASPER_DAILY_SALES, idDocument);
  }

  public downloadJasperNoteOnTurnoverReport(dataToSend: any): Observable<any> {
    return super.callService(Operation.POST, DocumentConstant.DOWNLOAD_NOTE_ON_TURNOVER_URL, dataToSend);
  }

  public printAndDownloadReport(idDocument: any): Observable<any> {
    return super.callService(Operation.GET,
      `${DocumentConstant.REPORT_ROOT_PRINT_AND_DOWNLOAD}${idDocument.id}/${idDocument.printType}/${idDocument.printCopies}`
      , null, null, true);
  }



  getValidAssetsAndInvoice(idClient, gridstate, predicate, startDate?: Date, endDate?: Date): Observable<any> {
    this.prepareServerOptions(gridstate, predicate);
    return this.callService(Operation.POST, 'getValidAssetsAndInvoice/' + idClient,
      { Gridstate: gridstate, Predicate: predicate, StartDate: startDate, EndDate: endDate });
  }

  public updateBlsInRealTime(idsBls: number[]): Observable<any> {
    return super.callService(Operation.POST, 'updateBlsInRealTime', idsBls, null, null, false);
  }


  public getDocumentAvailibilityStockReserved(id: any): Observable<any> {
    return this.callService(Operation.GET,
      DocumentConstant.GET_DOCUMENT_AVAILABILITY_STOCK_RESERVED.concat(id));
  }
  public ofConfirmation(id: number): Observable<any> {
    return super.callService(Operation.POST, 'ofConfirmation', id);
  }
  public reValidate(id: number): Observable<any> {
    return super.callService(Operation.POST, 'reValidate', id);
  }
  public getProvisionalBl(idSupplier: number, idDocument: number,
    startDate?: Date, endDate?: Date, code?: string): Observable<any> {
    return super.callService(Operation.POST, 'getProvisionalBl',
      { IdSupplier: idSupplier, IdDocument: idDocument, StartDate: startDate, EndDate: endDate, Code: code });
  }
  public importProvisionalBl(documentIds: Array<number>): Observable<any> {
    return super.callService(Operation.GET, 'importProvisionalBl', documentIds);
  }
  public applyDiscountForAllDocumentLines(discont: number, id: number): Observable<any> {
    return super.callService(Operation.POST, 'applyDiscountForAllDocumentLines/' + discont + '/' + id);
  }
  public deleteAll(idLines: number[], id: number): Observable<any> {
    return super.callService(Operation.POST, 'deleteAll' + '/' + id, idLines);
  }

  public importLineToInvoiced(itemPrice: ItemPrice): Observable<any> {
    return super.callService(Operation.POST, 'importLineToInvoiced', itemPrice, null, null, false);
  }

  public getDocumentLineOfBsNotAssociated(year, startDate?, endDate?): Observable<any> {
    let dateFilter = { year, startDate, endDate };
    return this.callService(Operation.POST, 'getDocumentLineOfBsNotAssociated', dateFilter, null, null, false);
  }
  public setDocumentLineSalePolicy(idDocument: number, selectedPolicy: number, idLine: number): Observable<any> {
    const dataToSend = {
      'IdDocument': idDocument,
      'IdLine': idLine,
      'IdPolicy': selectedPolicy
    }
    return this.callService(Operation.POST, 'setDocumentLineSalePolicy', dataToSend, null, null, false);
  }
  public getDocumentLineCost(idLine: number): Observable<any> {
    return this.callService(Operation.POST, 'getDocumentLineCost/' + idLine, null, null, false);
  }

  public setDocumentDelivered(data): Observable<any> {
    return super.callService(Operation.POST, DocumentConstant.SET_DOCUMENT_DELIVERED,
      { 'idDocument': data.Id, 'isDelivered': !data.IsDeliverySuccess });
  }

  public getBalancedList(idTier: number, predicate: PredicateFormat): Observable<any> {
    const data: any = {};
    data['idTier'] = idTier;
    data['predicate'] = predicate;
    const objectToSave: ObjectToSave = new ObjectToSave();
    objectToSave.Model = data;
    return this.callService(Operation.POST, 'getBalancedList', objectToSave);
  }
  public cancelBalancedDocLine(idLine: number): Observable<any> {
    return this.callService(Operation.POST, 'cancelBalancedDocLine', idLine);
  }
  public savelBalancedDocLine(docLine: any): Observable<any> {
    return this.callService(Operation.POST, 'saveBalancedDocLine', docLine);
  }
  public getDocumentsAssociated(predicate: any): Observable<any> {
    return this.callService(Operation.POST, 'getDocumentsAssociated', predicate);
  }

  massValidate(DocumentList: any[]): Observable<any> {
    return this.callService(Operation.POST, 'massValidate', DocumentList);
  }
  public getNumberDaysOutStockCurrentYear(idItem: number): Observable<any> {
    return this.callService(Operation.GET, DocumentConstant.GET_NUMBER_DAYS_OUT_STOCK + idItem, null, null, false);
  }
  public translateStatus(idStatus: number , documentType: string){
    if(idStatus == documentStatusCode.Provisional){
      return this.translate.instant('PROVISOIRE');
    }

    if(idStatus == documentStatusCode.Printed){
      return this.translate.instant('PRINTED');
    }

    if(idStatus == documentStatusCode.Valid){
      return this.translate.instant('VALID');
    }

    if(idStatus == documentStatusCode.Refused){
      return this.translate.instant('CANCELED');
    }
    if(idStatus == documentStatusCode.ToOrder){
      return this.translate.instant('TOORDER');
    }

    if(idStatus == documentStatusCode.Balanced){
        if(documentType == DocumentEnumerator.SalesOrder || documentType == DocumentEnumerator.PurchaseFinalOrder ){
          return this.translate.instant('TOTALLY_DELIVERED');
        } else if (documentType == DocumentEnumerator.PurchaseOrder){
          return this.translate.instant('TOTALLY_ORDRED');
        }else if (documentType === DocumentEnumerator.PurchaseDelivery || documentType == DocumentEnumerator.SalesDelivery){
          return this.translate.instant('CHARGED');
        }else if(documentType == DocumentEnumerator.SalesQuotations){
          return this.translate.instant('ODREDER');
        }else{
          return '';
        }
    }
    if(idStatus == documentStatusCode.TotallySatisfied){
      return this.translate.instant('TOTALLY_PAID');
    }
    if(idStatus == documentStatusCode.Accounted){
      return this.translate.instant('ACCOUNTED');
    }
    if(idStatus == documentStatusCode.PartiallySatisfied){
      if(documentType == DocumentEnumerator.PurchaseFinalOrder || documentType == DocumentEnumerator.SalesOrder ){
        return this.translate.instant('PARTIALLY_DELIVERED');
      } else if (documentType == DocumentEnumerator.PurchaseOrder || documentType == DocumentEnumerator.SalesQuotations){
        return this.translate.instant('PARTIALLY_ORDRED');
      }else{
        return this.translate.instant('PARTIALLY_PAID');
      }
    }

     if(idStatus == documentStatusCode.DRAFT){
      if(documentType != DocumentEnumerator.SalesInvoices ){
        return this.translate.instant('DRAFT_B2B');
      } else if (documentType == DocumentEnumerator.SalesInvoices){
        return this.translate.instant('DRAFT');
      }else{
        return '';
      }
  }

}
public ValidateOrderBtoB(data: ObjectToSave): Observable<any> {
  return this.callService(Operation.POST, DocumentConstant.VALIDATE_DOCUMENT_FOR_BTOB, data, null, null, false);
}
public generatePosInvoiceFromBl(invoiceToGenerate : Document, isFromTickets: Boolean,idBl?: Number, ticketId?: Number,
  idsDelivery?: number[],idsTickets?: number[]): Observable<any>{
  invoiceToGenerate.UserMail = this.localStorageService.getEmail();
  const data: any = {};
  data['invoiceToGenerate'] = invoiceToGenerate;
  data['idsDelivery'] = idsDelivery;
  data['idsTickets'] = idsTickets;
  data['isFromTickets'] = isFromTickets;
  const objectToSave: ObjectToSend = new ObjectToSend(data, null);
  return this.callService(Operation.POST, 'generatePosInvoiceFromBl/' +
  idBl + '/' + ticketId, objectToSave);
}

public removeDocuments(data): Observable<any> {
  return super.callService(Operation.POST, 'deleteDocuments', data);
}
public isAnyRelationSupplierWithItem(IdTier :number, IdItem: number): Observable<any> {
  const dataToSend = {
    'IdTier': IdTier,
    'IdItem': IdItem,
  }
  return this.callService(Operation.POST, DocumentConstant.IS_ANY_RELATION_SUPPLIER_WITH_ITEM, dataToSend, null, null, false);
}
public GetNoteOnTurnoverLineList(startDate : string, endDate : string, idItem: number) : Observable<any>{
  const data: any = {};
    data['startDate'] = startDate;
    data['endDate'] = endDate;
    data['idItem'] = idItem;
    const objectToSave: ObjectToSend = new ObjectToSend(data, null);
    return this.callService(Operation.POST, DocumentConstant.GET_NOTE_ON_TURNOVER_LINE_LIST, objectToSave);
}
public CanceledOrderBtobFromStark(data: number): Observable<any> {
  return this.callService(Operation.POST, DocumentConstant.CANCEL_ORDER_BTOB, data, null, null, false);
}
public ExistingBLToBToBOrder(idDocument: number): Observable<any> {
  return this.callService(Operation.POST, DocumentConstant.EXISTING_BL_TO_BTOB_ORDER, idDocument, null, null, false);
}
public SynchronizeAllBToBDocuments(): Observable<any> {
  return this.callService(Operation.POST, DocumentConstant.SYNCHRONIZE_ALL_BTOB_DOCUMENTS, null, null, null, false);
  }

  public updateDocumentAfterChangeTtcPrice(IdDocument: number, documentTtcPrice: number): Observable<any> {
    const dataToSend = {
      'IdDocument': IdDocument,
      'DocumentTtcPrice': documentTtcPrice,
    }
    return super.callService(Operation.POST, DocumentConstant.UPDATE_DOCUMENT_AFTER_CHANGE_TTC_PRICE, dataToSend, null, null, false);
    }
    public GenerateDepositInvoiceFromOrder(idDocument: number, amount: number, idItem: number): Observable<any> {
        const dataToSend = {
            'IdDocument': idDocument,
            'IdItem': idItem,
            'Amount': amount
        };
        return this.callService(Operation.POST, DocumentConstant.GENERATE_DEPOSIT_INVOICE_FROM_ORDER, dataToSend, null, false, false)
    }

    public isValidDepositInvoiceStatus(idDepositInvoice: number, idOrder: number): Observable<any> {
        const dataToSend = {
            'IdDepositInvoice': idDepositInvoice,
            'IdOrder': idOrder
        };
        return this.callService(Operation.POST, DocumentConstant.IS_VALID_DEPOSIT_INVOICE_STATUS, dataToSend, null, null, false);
    }
    public GenerateInvoiceFromOrder(idDocument: number): Observable<any> {
        const dataToSend = {
            'IdDocument': idDocument
        };
        return this.callService(Operation.POST, DocumentConstant.GENERATE_INVOIVE_FROM_ORDER, dataToSend, null, false, false);
    }
    public checkOrderToCancel(idDocument: number): Observable<any> {
      const dataToSend ={
        'IdDocument': idDocument
      };
      return this.callService(Operation.POST, DocumentConstant.CHECK_ORDER_TO_CANCEL, dataToSend, null, true, false);
    }

    public checkReservedLines(idDocument : number) : Observable<any> {
      return this.callService(Operation.POST, DocumentConstant.CHECK_RESERVED_LINES, idDocument, null, false, false);
    }

    public generateInvoice(idsDocument : any) : Observable<any> {
      return this.callService(Operation.POST, DocumentConstant.GENERATE_INVOICE, idsDocument, null, false, false);
    } 

    public CheckInvoiceLinesToDelete(idInvoice: number, lines: number[]): Observable<any> {
      const dataToSend = {
        'IdInvoice': idInvoice,
        'Lines': lines
      }
      return this.callService(Operation.POST, 'CheckInvoiceLinesToDelete', dataToSend, null, null, false);
    }

}

