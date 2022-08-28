export class ClaimConstant {
  /*** FIELDS */
  public static IS_DELETED = 'IsDeleted';
  public static CODE_FIELD = 'Code';
  public static CODE_TITLE = 'CODE';
  public static DESCRIPTION_FIELD = 'Description';
  public static DESCRIPTION_TITLE = 'DESCRIPTION';
  public static ID_CLIENT_FIELD = 'IdClient';
  public static ID_CLIENT_TITLE = 'ID_CLIENT';
  public static CLIENT_FIELD = 'IdClientNavigation.Name';
  public static SUPPLIER_FIELD = 'IdFournisseurNavigation.Name';
  public static CLIENT_TITLE = 'CLIENT';
  public static SUPPLIER_TITLE = 'SUPPLIER';
  public static ID_ITEM_FIELD = 'IdItem';
  public static ITEM_FIELD = 'IdItem.Designation';
  public static ITEM_TITLE = 'ITEM';
  public static ID_DOCUMENT_FIELD = 'IdDocument';
  public static ID_TIERS_FIELD = 'IdTiers';
  public static ID_DOCUMENT_LINE_ASSOCIATED_FIELD = 'IdDocumentLineAssociated';
  public static ID_DOCUMENT_TITLE = 'DOCUMENT';
  public static ISTREATED_FIELD = 'IsTreated';
  public static ISTREATED_TITLE = 'ISTREATED';
  public static DATE_FIELD = 'DocumentDate';
  public static DATE_TITLE = 'DATE';
  public static FORMAT_DATE = 'format_date';
  public static DOCUMENT_FORMAT = 'dd/MM/yyyy HH:mm';
  public static GET_DATA_SOURCE_PREDICATE = 'getDataSourcePredicate';

  public static ID_WAREHOUSE_FIELD = 'IdWarehouseNavigation.WarehouseName';
  public static ID_WAREHOUSE_TITLE = 'WAREHOUSE';

  public static ID_ITEM_NAVIGATION_CODE_FIELD = 'IdItemNavigation.Code';
  public static ID_ITEM_NAVIGATION_CODE_TITLE = 'ITEMNAVIGATION_REFERENCE';

  public static ID_ITEM_WAREHOUSE_NAVIGATION_FIELD = 'IdItemNavigation';
  public static ID_ITEM_WAREHOUSE_NAVIGATION_TITLE = 'ITEMNAVIGATION';

  public static ID_ITEM_NAVIGATION_DESCRIPTION_FIELD = 'IdItemNavigation.Description';
  public static ID_ITEM_NAVIGATION_DESCRIPTION_TITLE = 'ITEMNAVIGATION_DESIGNATION';

  public static ID_ITEM_NAVIGATION_DESIGNATION_FIELD = 'IdItemNavigation.RefDesignation';
  public static ID_ITEM_NAVIGATION_DESIGNATION_TITLE = 'ITEMNAVIGATION_DESIGNATION';

  public static ID_ITEM_NAVIGATION_NATURE_LABEL_FIELD = 'IdItemNavigation.IdNatureNavigation.Label';
  public static ID_ITEM_NAVIGATION_NATURE_LABEL_TITLE = 'ITEMNAVIGATION_NATURE';

  public static ID_CLAIM_STATUS_LABEL_FIELD = 'IdClaimStatusNavigation.Label';
  public static ID_CLAIM_STATUS_ID_FIELD = 'IdClaimStatusNavigation.Id';
  public static ID_CLAIM_STATUS_FIELD = 'IdClaimStatus';
  //public static ID_CLAIM_STATUS_CLAIM_TYPE_FIELD = 'ClaimType';
  public static ID_CLAIM_STATUS_TITLE = 'STATUS';

  public static ID_CLAIM_TYPE_FIELD = 'ClaimTypeNavigation.TranslationCode';
  public static ID_CLAIM_TYPE_FIELD_DESCRIPTION = 'ClaimTypeNavigation.Description';
  public static ID_CLAIM_TYPE_TITLE = 'TYPE';

  public static ID_CLAIM_STATUS_NAVIGATION = 'IdClaimStatusNavigation';
  public static ID_WAREHOUSE_NAVIGATION = 'IdWarehouseNavigation';
  public static ID_ITEM_NAVIGATION = 'IdItemNavigation';
  public static ID_CLIENT_NAVIGATION = 'IdClientNavigation';
  public static ID_SUPPLIER_NAVIGATION = 'IdFournisseurNavigation';
  public static ID_SUPPLIER_FIELD = 'IdFournisseur';
  public static ID_CLAIM_TYPE_NAVIGATION = 'ClaimTypeNavigation';
  public static ID_WAREHOUSE = 'IdWarehouse';
  public static VALIDATION_CLAIM_DATE = 'ValidationDate';
  public static Missing = 'M';
  public static Deffective = 'D';
  public static Extra = 'E';
  public static CLAIM_UNSUCCESSFULL_ADD = 'CLAIM_UNSUCCESSFULL_ADD';
  public static CLAIM_UNSUCCESSFULL_GENERATE_STOCK_MOVEMENT = 'CLAIM_UNSUCCESSFULL_GENERATE_STOCK_MOVEMENT';
  public static CLAIM_UNSUCCESSFULL_GENERATE_CLAIM_ASSET = 'CLAIM_UNSUCCESSFULL_GENERATE_CLAIM_ASSET';
  public static CLAIM_UNSUCCESSFULL_UPDATE = 'CLAIM_UNSUCCESSFULL_UPDATE';
  public static CLAIM_UNSUCCESSFULL_ADD_EXCEED_QUANTITY = 'CLAIM_UNSUCCESSFULL_ADD_EXCEED_QUANTITY';
  public static CLAIM_UNSUCCESSFULL_SUPPLIER_RETRIEVE = 'CLAIM_UNSUCCESSFULL_SUPPLIER_RETRIEVE';
  public static CLAIM_UNSUCCESSFULL_DATA_RETRIEVE = 'CLAIM_UNSUCCESSFULL_DATA_RETRIEVE';
  public static CLAIM_UNSUCCESSFULL_INTERACTION_ADD = 'CLAIM_UNSUCCESSFULL_INTERACTION_ADD';
  public static CLAIM_UNSUCCESSFULL_ADD_ZERO_QUANTITY = 'CLAIM_UNSUCCESSFULL_ADD_ZERO_QUANTITY';
  public static CLAIM_EMPTY_CLAIM_DESCRIPTION = 'CLAIM_EMPTY_CLAIM_DESCRIPTION';
  public static CLAIM_SUCCESSFULL_ADD = 'CLAIM_SUCCESSFULL_ADD';
  public static CLAIM_UNSELECTED_TYPE_ALERT = 'CLAIM_UNSELECTED_TYPE_ALERT';
  public static CLAIM_ERROR = 'ERROR';
  public static CLAIM_OKAY = 'OKAY';
  public static CLAIM_NO_CONTACT = 'NO_CONTACT';
  public static CLAIM_QUANTITY = 'ClaimQty';
  public static CLAIM_MAX_QUUANTITY = 'ClaimMaxQty';
  public static ITEM_WITHOUT_MEASURE_UNIT= 'Item_Without_Measure_Unit';



  /*** APIS ROUTE */
  public static URI_ADVANCED_EDIT = 'main/helpdesk/claims/advancedEdit/';
  public static URI_SHOW_CLAIMS = 'main/helpdesk/claims/show/';
  public static URI_ADVANCED_ADD = 'main/helpdesk/claims/advancedAdd/';
  public static URI_CLAIM_LIST = '/main/helpdesk/claims';

  public static GET_CLAIM_LIST = 'getClaimList';
  public static GET_CLAIM_BL_DROPDOWN_LIST = 'getBLDropdownForClaims';
  public static GET_CLAIM_BC_DROPDOWN_LIST = 'getBCDropdownForClaims';
  public static GET_CLAIM_BR_DROPDOWN_LIST = 'getBRDropdownForClaims';
  public static GET_CLAIM_BL_DROPDOWN_LIST_FROM_CLAIM_ITEM = 'GetBLFromClaimItem';
  public static VERIFY_EXISTING_PURCHASE_DOCUMENT = 'VerifyExistingPurchaseDocument';
  public static GET_CLAIM_SI_DROPDOWN_LIST_FROM_CLAIM_ITEM = 'GetSIFromClaimItem';
  public static GET_CLAIM_BS_DROPDOWN_LIST_FROM_CLAIM_ITEM = 'GetBSFromClaimItem';
  public static GET_CLAIM_PURCHASEDOC_DROPDOWN_LIST = 'getPurchaseDocDropdownForClaims';
  public static GET_CLAIM_SALESDOC_FROMCLIENT = 'getSalesDocForClaimsFromClient';
  public static GET_CLAIM_SALESDOC_FROMTIERS = 'getSalesDocForClaimsFromTiers';
  public static GET_CLAIM_SALESDOC_DROPDOWN_LIST_FROMCLIENT = 'getSalesDocDropdownForClaimsFromClient';
  public static GET_CLAIM_SALESDOC_DROPDOWN_LIST_FROMTIERS = 'getSalesDocDropdownForClaimsFromTiers';
  public static GET_CLAIM_BL_LINE_DROPDOWN_LIST = 'getBLLineDropdownForClaims';
  public static GET_CLAIM_BR_LINE_DROPDOWN_LIST = 'getBRLineDropdownForClaims';
  public static INSERT_CLAIM = 'insertClaim';
  public static INSERT_CLAIM_LINE = 'insertClaimLine';
  public static GET_CLAIM = 'getClaim';
  public static GET_CLAIM_LINE_LIST = 'getClaimLine';
  public static TYPE_CLAIM = 'TYPE_CLAIM';

  //public static SAVE = 'insertClaim';
  public static GET_CLAIM_BY_ID = 'getClaimById/';
  public static UPDATE = 'updateClaim';
  public static DELETE = 'deleteClaim';
  public static ADD_CLAIM_LINE = 'addLineToClaim';
  public static UPDATE_CLAIM_LINE = 'updateLineToClaim';
  public static DELETE_CLAIM_LINE = 'deleteLineToClaim';
  public static ADD_CLAIM_TIERS_ASSET = 'addClaimTiersAsset';
  public static ADD_CLAIM_STOCK_MOVEMENT = 'addClaimStockMovement';
  public static ADD_CLAIM_MOVEMENT = 'addClaimTiersMovement';

  /*** STRINGS AND LITERALS */
  public static LIST_CLAIMS = 'LIST_CLAIMS';
  public static PROVISIONAL = 'PROVISIONAL';
  public static ALL_CLAIMS = 'ALL_CLAIMS';
  public static VALID = 'VALID';
  public static WAREHOUSE = 'WAREHOUSE';
  public static CLAIM_TYPE_NAME = 'ClaimType';
  public static CLIENT = 'CLIENT';

  public static ADD_CLAIM_INTERACTION = 'ADD_CLAIM_INTERACTION';
  public static HIDE = 'hide';
  public static CLAIMINTERACTION = 'ClaimInteraction';
  public static readonly WONT_BE_ABLE_TO_REVERT_AFTER_SAVING = 'WONT_BE_ABLE_TO_REVERT_AFTER_SAVING';
  public static readonly ATTRIBUT_ID = 'Id';
  public static TEXT_SWAL_WARRING_VALIDATE_CLAIM = 'TEXT_SWAL_WARRING_VALIDATE_CLAIM';
  public static TITLE_SWAL_WARRING_VALIDATE_CLAIM = 'TITLE_SWAL_WARRING_VALIDATE_CLAIM';
  public static TEXT_BUTTON_SWAL_WARRING_VALIDATE_CLAIM = 'TEXT_BUTTON_SWAL_WARRING_VALIDATE_CLAIM';
  public static TEXT_SWAL_WARRING_CLAIM_STATUS_CHANGE = 'TEXT_SWAL_WARRING_CLAIM_STATUS_CHANGE';
  public static CLAIM_UNSUCCESSFULL_SALE_ASSET_GENERATION = 'CLAIM_UNSUCCESSFULL_SALE_ASSET_GENERATION';
  public static CLAIM_UNSUCCESSFULL_PURCHASE_ASSET_GENERATION = 'CLAIM_UNSUCCESSFULL_PURCHASE_ASSET_GENERATION';

  public static NEW_CLAIM = 'NEW_CLAIM';
  public static SUBMITTED_CLAIM = 'SUBMITTED_CLAIM';
  public static ACCEPTED_CLAIM = 'ACCEPTED_CLAIM';
  public static REFUSED_CLAIM = 'REFUSED_CLAIM';
  public static CLOSED_CLAIM = 'CLOSED_CLAIM';
  public static IsBToB = 'IsBToB';

  public static CONTACT = 'contact';
  public static OPPORTUNITY = 'opportunity';
  public static ORGANISATION = 'organisation';
  public static CLIENT_CONTACT = 'contactIdClient/';
  public static ARCHIVED = '/archived/';
  public static CLAIM_ADD_URL = 'main/crm/claim/add';
  public static INTERACTION_DELETE_TEXT_MESSAGE = 'INTERACTION_DELETE_TEXT_MESSAGE';
  public static INTERACTION_DELETE_TITLE_MESSAGE = 'INTERACTION_DELETE_TITLE_MESSAGE';
  public static readonly CLAIM_DELETE_TITLE_MESSAGE = 'CLAIM_SUPPRESSION';
  public static readonly CLAIM_DELETE_TEXT_MESSAGE = 'CLAIM_DELETE_TEXT_MESSAGE';
  public static readonly CHOOSE_CUSTOMER_PLACEHOLDER = 'CHOOSE_CUSTOMER_PLACEHOLDER';
  public static readonly CHOOSE_SUPPLIER_PLACEHOLDER = 'CHOOSE_SUPPLIER_PLACEHOLDER';
  public static readonly ID_SUPPLIER = 'IdFournisseurNavigation.Id';
  public static readonly ID_CLIENT ='IdClientNavigation.Id';
  public static readonly CLAIM_INTERACTION_TEXT_MESSAGE = 'CLAIM_INTERACTION_TEXT_MESSAGE';
  public static readonly CLAIM_INTERACTION_TITLE_MESSAGE = 'CLAIM_INTERACTION_TITLE_MESSAGE';

}
