export class StockDocumentConstant {

  public static readonly REPORT_ROOT_DOWNLOAD = 'downloadJasperDocumentReport';
  public static URI_ADVANCED_EDIT = 'main/inventory/stockDocuments/transfertMovement/advancedEdit/';
  public static URI_LIST = 'main/inventory/transfertMovement';
  public static URI_INVENTORY_EDIT = 'main/inventory/inventoryDocuments/edit/';
  public static GET_ITEM_TECDOC_BY_REF_OR_BARCODE = 'getItemTecDocByRefOrBarcode';
  public static IS_USER_IN_INVENTORY_LIST_ROLE = 'isUserInInventoryListRole';
  public static IS_DELETED = 'IsDeleted';
  public static CODE_FIELD = 'Code';
  public static CODE_TITLE = 'CODE';
  public static DATE_FIELD = 'DocumentDate';
  public static DATE_TITLE = 'DOCUMENT_DATE';
  public static FORMAT_DATE = 'format_date';
  public static GET_DATA_SOURCE_PREDICATE = 'getDataSourcePredicate';

  public static DATE_VALUE_GT = 'dateValueGT';
  public static DATE_VALUE_LT = 'dateValueLT';

  public static ID_WAREHOUSE_SOURCE_FIELD = 'IdWarehouseSourceNavigation.WarehouseName';
  public static ID_WAREHOUSE_SOURCE_ID_FIELD = 'IdWarehouseSourceNavigation.Id';
  public static ID_WAREHOUSE_DESTINATION_ID_FIELD ='IdWarehouseDestinationNavigation.Id';
  public static ID_WAREHOUSE_SOURCE_TITLE = 'WAREHOUSE_SOURCE';
  public static ID_WAREHOUSE_DESTINATION_FIELD = 'IdWarehouseDestinationNavigation.WarehouseName';
  public static ID_WAREHOUSE_DESTINATION_TITLE = 'WAREHOUSE_DESTINATION';
  public static WAREHOUSE_NAME = 'WarehouseName';
  public static WAREHOUSE_TITLE = 'WAREHOUSE';

  public static ID_TIERS_FIELD = 'IdTiersNavigation.Name';
  public static ID_TIERS_TITLE = 'SUPPLIER';
  public static SHELF_FIELD = 'Shelf';
  public static SHELF_TITLE = 'SHELF';

  public static STORAGE_FIELD = 'Storage';
  public static STORAGE_TITLE = 'STORAGE';

  public static ID_ITEM_NAVIGATION_CODE_FIELD = 'IdItemNavigation.Code';
  public static ID_ITEM_NAVIGATION_CODE_FIELD_ITEM = 'CodeItem';
  public static ID_ITEM_NAVIGATION_CODE_TITLE = 'ITEMNAVIGATION_REFERENCE';

  public static ID_ITEM_NAVIGATION_DESCRIPTION_FIELD = 'IdItemNavigation.Description';
  public static ID_ITEM_NAVIGATION_DESCRIPTION_FIELD_ITEM = 'Designation';
  public static ID_ITEM_NAVIGATION_DESCRIPTION_TITLE = 'ITEMNAVIGATION_DESIGNATION';

  public static ID_ITEM_NAVIGATION_NATURE_LABEL_FIELD = 'IdItemNavigation.IdNatureNavigation.Label';
  public static ID_ITEM_NAVIGATION_NATURE_LABEL_TITLE = 'ITEMNAVIGATION_NATURE';

  public static ID_ITEM_NAVIGATION_ACTUALQUANTITY_FIELD = 'ActualQuantity';
  public static ID_ITEM_NAVIGATION_AVAILABLEQUANTITY_FIELD = 'AvailableQty';
  public static ID_ITEM_NAVIGATION_REALACTUALQUANTITY_FIELD = 'RealActualQuantity';
  public static ID_ITEM_NAVIGATION_ACTUALQUANTITY_TITLE = 'ITEMNAVIGATION_QUANTITY_IN_STORE_AT_DATE';

  public static ID_ITEM_NAVIGATION_SOLDQUANTITY_FIELD = 'SoldQty';
  public static ID_ITEM_NAVIGATION_SOLDQUANTITY_TITLE = 'ITEMNAVIGATION_QUANTITY_SOLD_IN_STORE';

  public static ID_ITEM_NAVIGATION_FORECASTQUANTITY_FIELD = 'ForecastQuantity';
  public static ID_ITEM_NAVIGATION_FORECASTQUANTITY_TITLE = 'ITEMNAVIGATION_QUANTITY';
  public static DOCUMENT_STATUS =  'DocumentStatus';
  public static ID_DOCUMENT_STATUS_FIELD = 'IdDocumentStatus';
  public static ID_DOCUMENT_STATUS_TITLE = 'STATUS';
  public static GET_STOCK_DOCUMENT_LIST = 'getStockDocumentList';
  public static GET_INVENTORY_MOVEMENT_LIST = 'getInventoryMovementList';
  public static INSERT_STOCK_DOCUMENT = 'insertStockInventoryDocument';
  public static INSERT_STOCK_DOCUMENT_LINE_LIST = 'insertStockInventoryDocumentLine';
  public static GET_STOCK_DOCUMENT = 'getStockInventoryDocument';
  public static GET_STOCK_DOCUMENT_LINE_LIST = 'getStockInventoryDocumentLine';
  public static GET_DAILY_STOCK_DOCUMENT_LINE_LIST = 'getStockDailyInventoryDocumentLine';
  public static GET_INVENTORY_DOCUMENT_LINE_LIST = 'getInventoryDocumentLine';
  public static TYPE_STOCK_DOCUMENT = 'TypeStockDocument';

  public static ID_DOCUMENT_STATUS_NAVIGATION = 'IdDocumentStatusNavigation';
  public static ID_WAREHOUSE_SOURCE_NAVIGATION = 'IdWarehouseSourceNavigation';
  public static ID_WAREHOUSE_DESTINATION_NAVIGATION = 'IdWarehouseDestinationNavigation';
  public static ID_TIERS_NAVIGATION = 'IdTiersNavigation';
  public static ID_ITEM_NAVIGATION = 'IdItemNavigation';

  public static ID_WAREHOUSE_SOURCE = 'IdWarehouseSource';
  public static ID_SHELF_SOURCE_FIELD = 'IdShelfSource';
  public static ID_STORAGE_SOURCE_FIELD = 'IdStorageSource';
  public static ID_STORAGE_SOURCE_NAVIGATION = 'IdStorageSourceNavigation';
  public static SHELF_AND_STORAGE_SOURCE_FIELD = 'IdStorageSourceNavigation.Label';
  public static SHELF_AND_STORAGE_SOURCE_TITLE = 'SHELF_AND_STORAGE_SOURCE';

  public static START_DOCUMENT_DATE = 'StartDocumentDate';
  public static END_DOCUMENT_DATE = 'EndDocumentDate';
  public static ID_WAREHOUSE_DESTINATION = 'IdWarehouseDestination';
  public static ID_SHELF_DESTINATION_FIELD = 'IdShelfDestination';
  public static ID_STORAGE_DESTINATION_FIELD = 'IdStorageDestination';
  public static ID_STORAGE_DESTINATION_NAVIGATION = 'IdStorageDestinationNavigation';
  public static SHELF_AND_STORAGE_DESTINATION_FIELD = 'IdStorageDestinationNavigation.Label';
  public static SHELF_AND_STORAGE_DESTINATION_TITLE = 'SHELF_AND_STORAGE_DESTINATION';
  public static SHELF_AND_STORAGE_DESTINATION = 'shelfDestinationLabel';
  public static SHELF_AND_STORAGE_SOURCE = 'shelfSourceLabel';
  public static GET_STOCK_DOCUMENT_BY_ID = 'getStockDocumentById/';
  public static VALIDATE = 'validateStockDocument';
  public static VALIDATE_INVENTORY = 'validateInventoryStockDocument';
  public static UNVALIDATE_INVENTORY = 'unvalidateInventoryStockDocument';
  public static SAVE_PLANNED_INVENTORY = 'savePlannedInventoryStockDocument';
  public static ADD_INVENTORY_DOCUMENT_LINE = 'addLineToInventoryDocument';
  public static UPDATE_INVENTORY_DOCUMENT_LINE = 'updateLineToInventoryDocument';

  public static TRANSFERT = 'transfertValidateStockDocument';
  public static TRANSFERT_FROM_ECOMMERCE = 'transfertValidateStockDocumentFromEcommerce';
  public static RECEIVE = 'receiveValidateStockDocument';
  public static TRANSFERT_DOCUMENT = 'TRANSFERT';
  public static ASSOCIATION_DOCUMENT = 'ASSOCIATION';

  public static ALL_TRANSFERT_MOVEMENT = 'ALL_TRANSFERT_MOVEMENT';
  public static ALL_Inventory = 'ALL_Inventory';

  public static TM = 'TM';
  public static TShSt = 'TShSt';
  public static Inventory = 'INV';
  public static ID = 'Id';
  public static ID_LINE = 'IdLine';
  public static LABEL_ITEM = 'LabelItem';
  public static DESIGNATION = 'Designation';
  public static DESCRIPTION = 'Description';
  public static BARCODE1 = 'BarCode1D';
  public static BARCODE2 = 'BarCode2D';
  public static CODE = 'Code';
  public static ID_ITEM = 'IdItem';
  public static ACTUAL_QUANTITY = 'ActualQuantity';
  public static FORECAST_QUANTITY = 'ForecastQuantity';
  public static FORECAST_QUANTITY2 = 'ForecastQuantity2';
  public static DATE = 'Date';
  public static GREEN = 'green';

  public static ID_WAREHOUSE = 'IdWarehouse';
  public static ID_WAREHOUSE_TITLE = 'WAREHOUSE';

  public static LABEL_QUANTITY = 'labelQteToShow';
  public static PROVISIONAL = 'Provisional';
  public static URI_VALIDATED_ENTITY = '/main/inventory/transfertMovement/show/';
  public static URI_INVENTORY = 'main/inventory/inventoryDocuments';
  public static RED = 'red';
  public static STOCK_DOCUMENT_LINE = 'StockDocumentLine';
  public static TEXT_SWAL_WARRING_VALIDATE_TRANSFERT_MOVEMENT = 'TEXT_SWAL_WARRING_VALIDATE_TRANSFERT_MOVEMENT';
  public static TITLE_SWAL_WARRING_VALIDATE_TRANSFERT_MOVEMENT = 'TITLE_SWAL_WARRING_VALIDATE_TRANSFERT_MOVEMENT';
  public static TEXT_BUTTON_SWAL_WARRING_VALIDATE_TRANSFERT_MOVEMENT = 'TEXT_BUTTON_SWAL_WARRING_VALIDATE_TRANSFERT_MOVEMENT';
  public static TITLE_SWAL_WARRING_VALIDATE_INVENTORY_MOVEMENT = 'TITLE_SWAL_WARRING_VALIDATE_INVENTORY_MOVEMENT';
  public static TEXT_BUTTON_SWAL_WARRING_VALIDATE_INVENTORY_MOVEMENT = 'TEXT_BUTTON_SWAL_WARRING_VALIDATE_INVENTORY_MOVEMENT';
  public static TITLE_SWAL_WARRING_PLANNED_INVENTORY_MOVEMENT = 'TITLE_SWAL_WARRING_PLANNED_INVENTORY_MOVEMENT';
  public static TEXT_BUTTON_SWAL_WARRING_EXISTING_INVENTORY_MOVEMENT = 'TEXT_BUTTON_SWAL_WARRING_EXISTING_INVENTORY_MOVEMENT';
  public static TEXT_BUTTON_SWAL_WARRING_NOTEXISTING_INVENTORY_MOVEMENT_ITEMS = 'TEXT_BUTTON_SWAL_WARRING_NOTEXISTING_INVENTORY_MOVEMENT_ITEMS';
  public static TEXT_BUTTON_SWAL_WARRING_UNSELECTED_WAREHOUSE = 'TEXT_BUTTON_SWAL_WARRING_UNSELECTED_WAREHOUSE';
  public static TEXT_BUTTON_SWAL_WARRING_INVALID_DATE = 'TEXT_BUTTON_SWAL_WARRING_INVALID_DATE';
  public static TEXT_BUTTON_SWAL_WARRING_PLANNED_INVENTORY = 'TEXT_BUTTON_SWAL_WARRING_PLANNED_INVENTORY';
  public static WAREHOUSE = 'WAREHOUSE';

  public static readonly INVENTORY_SLIP_SUMMARY_REPORT_NAME = 'inventoryborderaux';
  public static readonly INVENTORY_SUMMARY_REPORT_NAME = 'inventoryreport';
  public static readonly INVENTORY_SLIP_REPORT_NAME = 'inventoryslip';
  public static readonly INVENTORY_UPPERCASE = 'INVENTORY';
  public static readonly REPORT_GAINLOSS_UPPERCASE = 'REPORT_GAINLOSS';
  public static readonly ACCOUNTING_SALES_JOURNAL = 'ACCOUNTING_SALES_JOURNAL';
  public static readonly DAILY_INVENTORY_SLIP_SUMMARY_REPORT_NAME = 'dailyinventoryborderaux';
  public static readonly DAILY_INVENTORY_SUMMARY_REPORT_NAME = 'dailyinventoryreport';
  public static readonly DAILY_SALES_SLIP_SUMMARY_REPORT_NAME = 'dailyinventoryborderaux';
  public static readonly DAILY_SALES_SUMMARY_REPORT_NAME = 'dailyinventoryreport';

  public static URI_ECOMMERCE_EDIT = '/main/ecommerce/transfertMovement/advancedEdit/';
  public static URI_ECOMMERCE_LIST = 'main/ecommerce/movement';
  public static ECOMMERCE_STOCK = 'ecommerceStockDocument';
  public static TYPE_FIELD = 'IdWarehouseSourceNavigation.IsCentral';
  public static TYPE_TITLE = 'TYPE';
  public static ECOMMERCE_WAREHOUSE_SOURCE = 'IdWarehouseSourceNavigation.ForEcommerceModule';
  public static ECOMMERCE_WAREHOUSE_DESTINATION = 'IdWarehouseDestinationNavigation.ForEcommerceModule';
  public static SAVE_ECOMMERCE = 'insertStockEcommerce';
  public static UPDATE_ECOMMERCE = 'updateStockEcommerce';
  public static INSUFFICIENT_QUANTITY = 'INSUFFICIENT_QUANTITY';
  public static TEXT_BUTTON_SWAL_WARRING_UNVALIDATE_INVENTORY_MOVEMENT = 'TEXT_BUTTON_SWAL_WARRING_UNVALIDATE_INVENTORY_MOVEMENT';
  public static TITLE_SWAL_WARRING_UNVALIDATE_INVENTORY_MOVEMENT = 'TITLE_SWAL_WARRING_UNVALIDATE_INVENTORY_MOVEMENT';
  public static readonly ID_DOCUMENT_REQUEST_TYPE = 'IdDocumentRequestType';
  public static readonly URI_INVENTORY_DOCUMENT = 'main/inventory/inventoryDocuments';
  public static readonly LOSE_NEW_LINES = 'LOSE_NEW_LINES';
  public static readonly Unaffected = 'Unaffected';
  public static readonly STOCKDOCUMENT_MODEL = 'StockDocument';
  public static readonly STOCK_MVMNT_DELETE_TITLE_MESSAGE = 'STOCK_MVMNT_SUPPRESSION';
  public static readonly DELETE_STOCK_MOVEMENT_MESSAGE = 'DELETE_STOCK_MVT';
  public static readonly STOCK_MVMNT_DELETE_TEXT_MESSAGE = 'STOCK_MVMNT_DELETE_TEXT_MESSAGE';
  public static readonly DELETE_STOCK_MOVEMENT_TEXT = 'DELETE_STOCK_MVT_TEST';
  public static readonly INVENTORY_DELETE_TITLE_MESSAGE = 'INVENTORY_SUPPRESSION';
  public static readonly INVENTORY_DELETE_TEXT_MESSAGE = 'INVENTORY_DELETE_TEXT_MESSAGE';
  public static readonly AVAILABLE_QUANTITY = 'AvailableQuantity';
  public static TYPE_DOCUMENT = 'TypeDocument';
  public static TRANSFERT_TYPE = 'TransfertType';
  public static VALIDATE_STORAGE = 'validateStoragekDocument';
  public static readonly ID_DOCUMENT_NAVIGATION_DOCUMENT_DATE = 'IdDocumentNavigation.DocumentDate';
  public static readonly ID_DOCUMENT_NAVIGATION_ID_DOCUMENT_STATUS = 'IdDocumentNavigation.IdDocumentStatus';
  public static readonly ID_DOCUMENT_NAVIGATION = 'IdDocumentNavigation';
  public static readonly ID_WAREHOUSE_NAVIGATION = 'IdWarehouseNavigation';
  public static readonly STOCKDOCUMENT_INV = 'STOCKDOCUMENT_INV';
  public static readonly STOCKDOCUMENT_TM = 'STOCKDOCUMENT_TM';
  public static readonly TRANSFERT_MOVEMENT = 'Mouvement de transfert';
  public static readonly LIST_INVENTORY = 'LIST_INVENTORY';
  public static DOCUMENT_ASSOCIETED = 'IdDocumentLineAssociated';
  public static DOCUMENT_NAVIGATION_TYPE_CODE = 'IdDocumentNavigation.DocumentTypeCode';
  public static DOCUMENT_NAVIGATION_TIERS = 'IdDocumentNavigation.IdTiers';
  public static DOCUMENT_LINE_ASSOCIATED_NAVIGATION = 'IdDocumentLineAssociatedNavigation';
  public static DOCUMENT_NAVIGATION = 'IdDocumentNavigation';
  public static ID_TIERS_ID_FIELD = 'IdTiersNavigation.Id';
  public static URL_LIST_SHELF_AND_STORAGE = '/main/inventory/ShelfAndStorage';
  public static URI_VALIDATED_SHELF_AND_STORAGE_ENTITY = '/main/inventory/ShelfAndStorage/show/';
  public static ID_DOCUMENT_STATUS_NAVIGATION_TRM_LABEL_FIELD = 'IdDocumentStatusNavigation.Label';

  public static readonly NO_INVENTORY_SELLECTED_ALERT_INFO =  'NO_INVENTORY_SELLECTED_ALERT_INFO';
  public static readonly ID_TIERS_FROM_TIERS_PROVISIONING ='IdTiers';
  public static readonly STOCKDOCUMENT_TSHST = '_TSHST';

  public static readonly TIERCATEGORY = 'TIERCATEGORY';
  public static readonly TIER_CATEGORY = 'TIER_CATEGORY';
  public static  ID_STOCK_DOCUMENT_NAVIGATION ='IdStockDocumentNavigation';
  public static  ID_STOCK_DOCUMENT_NAVIGATION_CODE ='IdStockDocumentNavigation.Code';
  public static  ID_STOCK_DOCUMENT_NAVIGATION_DOCUMENTDATE ='IdStockDocumentNavigation.DocumentDate';
  public static  ID_STOCK_DOCUMENT_NAVIGATION_WAREHOUSENAME_SOURCE  ='IdStockDocumentNavigation.IdWarehouseSourceNavigation.WarehouseName';
  public static  ID_STOCK_DOCUMENT_NAVIGATION_WAREHOUSENAME_DESTINATION = 'IdStockDocumentNavigation.IdWarehouseDestinationNavigation.WarehouseName';
  public static  ID_STOCK_DOCUMENT_NAVIGATION_ID_DOCUMENT_STATUS = 'IdStockDocumentNavigation.IdDocumentStatus';
  public static  QUANTITY_TITLE = 'QUANTITY';
  public static  ID_STOCK_DOCUMENT_NAVIGATION_ID_WAREHOUSE_SOURCE_NAVIGATION = 'IdStockDocumentNavigation.IdWarehouseSourceNavigation';
  public static  ID_STOCK_DOCUMENT_NAVIGATION_ID_WAREHOUSE_DESTINATION_NAVIGATION = 'IdStockDocumentNavigation.IdWarehouseDestinationNavigation';
}
