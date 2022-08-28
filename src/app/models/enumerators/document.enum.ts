export class DocumentEnumerator {

  public static SalesOrder = 'O-SA';
  get SalesOrder() {
    return DocumentEnumerator.SalesOrder;
  }

  public static PurchaseOrder = 'O-PU';
  get PurchaseOrder() {
    return DocumentEnumerator.PurchaseOrder;
  }

  public static SalesDelivery = 'D-SA';
  get SalesDelivery() {
    return DocumentEnumerator.SalesDelivery;
  }

  public static PurchaseDelivery = 'D-PU';
  get PurchaseDelivery() {
    return DocumentEnumerator.PurchaseDelivery;
  }

  public static SalesInvoices = 'I-SA';
  get SalesInvoices() {
    return DocumentEnumerator.SalesInvoices;
  }

  public static PurchaseInvoices = 'I-PU';
  get PurchaseInvoices() {
    return DocumentEnumerator.PurchaseInvoices;
  }

  public static SalesQuotations = 'Q-SA';
  get SalesQuotations() {
    return DocumentEnumerator.SalesQuotations;
  }

  public static PurchasesQuotations = 'Q-PU';
  get PurchasesQuotations() {
    return DocumentEnumerator.PurchasesQuotations;
  }

  public static SalesAsset = 'A-SA';
  get SalesAsset() {
    return DocumentEnumerator.SalesAsset;
  }

  public static PurchaseAsset = 'A-PU';
  get PurchaseAsset() {
    return DocumentEnumerator.PurchaseAsset;
  }

  public static PurchaseRequest = 'RQ-PU';
  get PurchaseRequest() {
    return DocumentEnumerator.PurchaseRequest;
  }

  public static PurchaseBudget = 'B-PU';
  get PurchaseBudget() {
    return DocumentEnumerator.PurchaseBudget;
  }

  public static PurchaseFinalOrder = 'FO-PU';
  get PurchaseFinalOrder() {
    return DocumentEnumerator.PurchaseFinalOrder;
  }

  public static BE = 'BE-PU';
  get BE() {
    return DocumentEnumerator.BE;
  }

  public static BS = 'BS-SA';
  get BS() {
    return DocumentEnumerator.BS;
  }

  public static SalesInvoiceAsset = 'IA-SA';
  get SalesInvoiceAsset() {
    return DocumentEnumerator.SalesInvoiceAsset;
  }

  public static StockCalculationOperationReal = 'R';
  get StockCalculationOperationReal() {
    return DocumentEnumerator.StockCalculationOperationReal;
  }

  public static StockCalculationOperationPrvisoir = 'P';
  get StockCalculationOperationPrvisoir() {
    return DocumentEnumerator.StockCalculationOperationPrvisoir;
  }
  public static StockTransfert = 'STOCK-TRANSFER';
  get StockTransfert() {
    return DocumentEnumerator.StockCalculationOperationPrvisoir;
  }

}

export enum EcommerceReservationStatusCode {
  NoSelection = 0,
  Reservation = 1,
  Liberation = 2
}

export enum documentStatusCode {
  NoDocumentTypeSelected = 0,
  Provisional = 1,
  Valid = 2,
  Balanced = 3,
  Refused = 4,
  ToOrder = 5,
  TotallySatisfied = 6,
  PartiallySatisfied = 7,
  NotSatisfied = 8,
  Transferred = 9,
  Received = 10,
  Printed = 11,
  Accounted = 12,
  DRAFT = 13,
  ECOMMERCE = 14
}
export enum purchaseRequestDocumentStatusCode {
  ALL_DOCUMENT_REQUESTS = 0,
  NEW_PURCHASE_REQUEST = 1,
  VALID = 2,
  REFUSED = 4,
  ORDERD = 5
}

export enum accountingStatus {
  Accounted = 1,
  NotAccounted = 2,
  All = 3
}

export enum documentStateCode {

  IN_PROGRESS = 1,
  TREATED_REQUEST = 2,
  NOT_TREATED_REQUEST = 3,
  ALL_DOCUMENT_REQUESTS = 4,
  TotallySatisfied = 6,
  PartiallySatisfied = 7

}

export enum documentStatusCodeToSearch {
  Provisional = 1,
  Valid = 2,
  Balanced = 3,
  Refused = 4,
  TOTALLY_DELIVERED = 6,
  PARTIALLY_DELIVERED = 7,
  DRAFT = 13,
  ECOMMERCE = 14,
  Transferred = 9,
  Received = 10,
}

export enum InvoicingTypeEnumerator {
  Cash = 1,
  Term = 2,
  Other = 3,
  advance_Payment = 4
}

export enum CodeToNameDocument {
  'O-SA' = 'ORDER',
  'O-PU' = 'ORDER',
  'D-SA' = 'DELIVERY_FORM',
  'D-PU' = 'RECEIPT',
  'I-SA' = 'INVOICE',
  'I-PU' = 'INVOICE',
  'Q-SA' = 'QUOTATION',
  'Q-PU' = 'QUOTATION',
  'A-SA' = 'ASSET',
  'A-PU' = 'ASSET',
  'RQ-PU' = 'REQUEST',
  'B-PU' = 'BUDGET',
  'FO-PU' = 'FINAL_ORDER',
  'BE-PU' = 'BE',
  'BS-SA' = 'BS',
  'IA-SA' = 'INVOICE_ASSET'
}

export enum NameDocumentLink {
  'O-SA' = 'sales/order',
  'O-PU' = 'purchase/purchaseorder',
  'D-SA' = 'sales/delivery',
  'D-PU' = 'purchase/delivery',
  'I-SA' = 'sales/invoice',
  'I-PU' = 'purchase/invoice',
  'Q-SA' = 'sales/quotation',
  'Q-PU' = 'purchase/purchaseorder',
  'A-SA' = 'sales/asset',
  'A-PU' = 'purchase/asset',
  'RQ-PU' = 'purchase/purchaserequest',
  'B-PU' = 'BUDGET',
  'FO-PU' = 'purchase/purchasefinalorder',
  'BE-PU' = 'BE',
  'BS-SA' = 'BS',
  'IA-SA' = 'sales/invoiceasset'
}

export enum DocumentTypesEnumerator {
  SUPPLIER_ASSET = 1,
  CUSTOMER_ASSET = 2,
  BE = 3,
  PURCHASE_QUOTATION = 4,
  BS = 5,
  RECEIPT = 6,
  DELIVERY_FORM = 7,
  PURCHASE_FINAL_ORDER = 8,
  PURCHASE_INVOICE = 9,
  SALES_INVOICE = 10,
  PURCHASE_ORDER = 11,
  SALES_ORDER = 12,
  PRICE_REQUEST = 13,
  SALES_QUOTATION = 14,
  PURCHASE_REQUEST = 15,
  PURCHASE_TERMBILLING_INVOICE = 16,
  SALES_TERMBILLING_INVOICE = 17,
  PURCHASE_ASSET_INVOICE = 18,
  SALES_ASSET_INVOICE = 19,
  PURCHASE_CASH_INVOICE = 20,
  SALES_CASH_INVOICE = 21,
  ALL_ASSETS_FINACIAL = 22
}

