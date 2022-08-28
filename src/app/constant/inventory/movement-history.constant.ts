import { PagerSettings } from '@progress/kendo-angular-grid';

export class MovementHistoryConstant {
  public static SUPPLIER_CODE_FIELD = 'SupplierCode';
  public static SUPPLIER_CODE_TITLE = 'SUPPLIER_CODE';
  public static ITEM_CODE_FIELD = 'ItemCode';
  public static ITEM_CODE_TITLE = 'ITEM_CODE';
  public static ITEM_DESIGNATION_FIELD = 'ItemDesignation';
  public static ITEM_DESIGNATION_TITLE = 'ITEM_DESIGNATION';
  public static DOCUMENT_TYPE_FIELD = 'DocumentType';
  public static DOCUMENT_TYPE_TITLE = 'DOCUMENT_TYPE';
  public static CUSTOMER_CODE_FIELD = 'CustomerCode';
  public static CUSTOMER_CODE_TITLE = 'CUSTOMER_CODE';
  public static CUSTOMER_NAME_FIELD = 'CustomerName';
  public static CUSTOMER_NAME_TITLE = 'CUSTOMER_NAME';
  public static DATE_FIELD = 'Date';
  public static DATE_TITLE = 'DATE';
  public static ORDER_FIELD = 'OrderNumber';
  public static ORDER_TITLE = 'ORDER_TITLE';
  public static QUANTITY_FIELD = 'Quantity';
  public static Quantity_TITLE = 'QUANTITY';
  public static PUHT_FIELD = 'Puht';
  public static PUHT_TITLE = 'PUHT';
  public static PUHT1_FIELD = 'Puht1';
  public static PUHT1_TITLE = 'PUHT1';
  public static PRICE_FIELD = 'Price';
  public static PRICE_TITLE = 'PRICE';
  public static DISCOUNT_FIELD = 'Discount';
  public static DISCOUNT_TITLE = 'DISCOUNT';
  public static IS_PURCHASE_FIELD = 'IsPurchase';
  public static IS_PURCHASE_TITLE = 'IS_PURCHASE';
  public static IS_SALE_FIELD = 'IsSale';
  public static IS_SALE_TITLE = 'IS_SALE';
  public static FISCAL_YEAR_FIELD = 'FiscalYear';
  public static FISCAL_YEAR_TITLE = 'FISCAL_YEAR_TITLE';
  public static FORMAT_DATE = 'format_date';
  public static GET_MOVEMENT_HISTORY_LIST = 'getMovementHistoryList';
  public static PAGER_SETTINGS: PagerSettings = {
    buttonCount: 5, info: true, type: 'numeric', pageSizes: [20, 50, 100, 500, 1000], previousNext: true
  };
}
