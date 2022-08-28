export class ClaimStatusConstant {
  
  /*** FIELDS */
  public static IS_DELETED = 'IsDeleted';
  public static CODE_FIELD = 'Code';
  public static CODE_TITLE = 'CODE';
  public static DESCRIPTION_FIELD = 'Description';
  public static DESCRIPTION_TITLE = 'DESCRIPTION';
  public static ID_CLIENT_FIELD = 'IdClient';
  public static ID_CLIENT_TITLE = 'ID_CLIENT';
  public static CLIENT_FIELD = 'IdClientNavigation.Name';
  public static CLIENT_TITLE = 'CLIENT';
  public static ITEM_FIELD = 'IdItem.Designation';
  public static ITEM_TITLE = 'ITEM';
  public static ID_DOCUMENT_FIELD = 'IdDocument';
  public static ID_DOCUMENT_TITLE = 'DOCUMENT';
  public static ISTREATED_FIELD = 'IsTreated';
  public static ISTREATED_TITLE = 'ISTREATED';
  public static DATE_FIELD = 'DocumentDate';
  public static DATE_TITLE = 'CLAIM_DATE';
  public static FORMAT_DATE = 'format_date';
  public static GET_DATA_SOURCE_PREDICATE = 'getDataSourcePredicate';

  public static ID_WAREHOUSE_FIELD = 'IdWarehouseNavigation.WarehouseName';
  public static ID_WAREHOUSE_TITLE = 'WAREHOUSE';

  public static ID_ITEM_NAVIGATION_CODE_FIELD = 'IdItemNavigation.Code';
  public static ID_ITEM_NAVIGATION_CODE_TITLE = 'ITEMNAVIGATION_REFERENCE';

  public static ID_ITEM_WAREHOUSE_NAVIGATION_FIELD = 'IdItemNavigation';
  public static ID_ITEM_WAREHOUSE_NAVIGATION_TITLE = 'ITEMNAVIGATION';

  public static ID_ITEM_NAVIGATION_DESCRIPTION_FIELD = 'IdItemNavigation.Description';
  public static ID_ITEM_NAVIGATION_DESCRIPTION_TITLE = 'ITEMNAVIGATION_DESIGNATION';

  public static ID_ITEM_NAVIGATION_NATURE_LABEL_FIELD = 'IdItemNavigation.IdNatureNavigation.Label';
  public static ID_ITEM_NAVIGATION_NATURE_LABEL_TITLE = 'ITEMNAVIGATION_NATURE';

  public static ID_CLAIM_STATUS_FIELD = 'IdClaimStatusNavigation.Label';
  public static ID_CLAIM_STATUS_TITLE = 'CLAIM_STATUS_TITLE';

  public static ID_CLAIM_TYPE_FIELD = 'ClaimTypeNavigation.Description';
  public static ID_CLAIM_TYPE_TITLE = 'CLAIM_TYPE_TITLE';

  public static ID_CLAIM_STATUS_NAVIGATION = 'IdClaimStatusNavigation';
  public static ID_WAREHOUSE_NAVIGATION = 'IdWarehouseNavigation';
  public static ID_ITEM_NAVIGATION = 'IdItemNavigation';
  public static ID_CLIENT_NAVIGATION = 'IdClientNavigation';
  public static ID_FOURNISSEUR_NAVIGATION = 'IdFournisseurNavigation';
  public static ID_CLAIM_TYPE_NAVIGATION = 'IdClaimTypeNavigation';
  public static ID_WAREHOUSE = 'IdWarehouse';
  public static VALIDATION_CLAIM_DATE = 'ValidationDate';
  public static Manque = 'M';
  public static Defectueux = 'D';

  /*** APIS ROUTE */
  public static URI_ADVANCED_EDIT = 'main/helpdesk/claims/advancedEdit/';
  public static URI_ADVANCED_ADD = 'main/helpdesk/claims/advancedAdd/';

  public static GET_CLAIM_STATUS_LIST = 'getClaimStatusList';
  public static INSERT_CLAIM_STATUS = 'insertClaimStatus';
  public static TYPE_CLAIM = 'TYPE_CLAIM';

  public static SAVE = 'insertClaimStatus';
  public static GET_CLAIM_STATUS_BY_ID = 'getClaimStatusById/';
  public static UPDATE = 'updateClaimStatus';
  public static DELETE = 'deleteClaimStatus';

  /*** STRINGS AND LITERALS */
  public static LIST_CLAIMS = 'LIST_CLAIMS';
  public static PROVISIONAL = 'PROVISIONAL';
  public static ALL_CLAIMS = 'ALL_CLAIMS';
  public static VALID = 'VALID';
  public static CLAIM_TYPE_NAME = 'Type';
  public static CLAIM_STATUS_NAME = 'Code';

  

 
}

