import {GridDataResult, PagerSettings} from '@progress/kendo-angular-grid';
import {State} from '@progress/kendo-data-query';
import {NumberConstant} from '../utility/number.constant';

export class SharedConstant {
  /** constants for local storage */
  public static COMPANY = 'company';
  public static NAME = 'name';
  public static USER = 'user';
  public static FORMAT_DATE = 'format_date';
  /** constants for grid with selection */
  public static CHECKED = 'checked';
  public static UNCHECKED = 'unchecked';
  public static INDETERMINATE = 'indeterminate';
  public static DELETING = 'DELETING';
  public static DELETING_TEXT = 'DELETING_TEXT';
  /* URL Params */
  public static ID_LOWERCASE = 'id';
  public static ID_COUNTRY = 'IdCountry';
  public static DEFAULT_PAGER_SETTINGS: PagerSettings = {
    buttonCount: 5, info: true, type: 'numeric', pageSizes: [10, 20, 50, 100], previousNext: true
  };
  public static DEFAULT_PAGER_SETTINGS_REDUCED: PagerSettings = {
    buttonCount: 5, info: true, type: 'numeric', pageSizes: [5, 10, 25, 50], previousNext: true
  };
  public static DEFAULT_PAGER_SETTINGS_BY_FOUR: PagerSettings = {
    buttonCount: 5, info: true, type: 'numeric', pageSizes: [8, 12, 24, 36, 48], previousNext: true
  };
  public static DEFAULT_PAGER_SETTINGS_BEGIN_WITH_ONE: PagerSettings = {
    buttonCount: 5, info: true, type: 'numeric', pageSizes: [1, 10, 20, 50, 100], previousNext: true
  };
  public static DEFAULT_ITEMS_NUMBER = 20;

  public static MONTHS = [
    'JANUARY',
    'FEBRUARY',
    'MARCH',
    'APRIL',
    'MAY',
    'JUNE',
    'JULY',
    'AUGUST',
    'SEPTEMBER',
    'OCTOBER',
    'NOVEMBER',
    'DECEMBER',
  ];
  public static readonly QUALIFICATION = 'Qualification';
  public static readonly WONT_BE_ABLE_TO_REVERT = 'WONT_BE_ABLE_TO_REVERT';
  public static readonly HIDE = 'hide';
  public static readonly ADD_QUALIFICATION = 'ADD_QUALIFICATION';
  public static readonly QUALIFIED_COLUMN_NAME = 'qualifiedColumnName';
  public static readonly ID_CANDIDATE = 'IdCandidate';
  public static readonly ID_EMPLOYEE = 'IdEmployee';
  public static readonly VALIDATE = 'VALIDATE';
  public static readonly DO_YOU_WANT_TO_CONTINUE = 'DO_YOU_WANT_TO_CONTINUE';
  public static readonly EMPLOYEE_UPPER = 'EMPLOYEE';
  public static readonly SUBMISSION_DATE = 'SUBMISSION_DATE';
  public static ID = 'Id';
  public static IDUSER = 'IdUser';
  public static IS_DELETED = 'IsDeleted';
  public static LANGUAGE = 'language';
  public static MODAL_DIALOG_SIZE_L = 'large';
  public static MODAL_DIALOG_SIZE_XXL = 'extra-large';
  public static MODAL_DIALOG_SIZE_XM = 'x-medium';
  public static MODAL_DIALOG_SIZE_ML = 'medium-large';
  public static MODAL_DIALOG_CLASS_L = 'modal-dialog modal-dialog-centered modal-xlg app-modal-window modal-dialog';
  public static MODAL_DIALOG_CLASS_XXL = 'modal-dialog modal-dialog-centered modal-xxlg app-modal-window modal-dialog';
  public static MODAL_DIALOG_CLASS_XM = 'modal-dialog modal-dialog-centered modal-slg app-modal-window modal-dialog';
  public static MODAL_DIALOG_CLASS_ML = 'modal-dialog modal-dialog-centered modal-mlg app-modal-window modal-dialog';
  public static CONTENT_CLASS_L = 'modal-content modal-xlg app-modal-window modal-dialog';
  public static CONTENT_CLASS_XXL = 'modal-content modal-xxlg app-modal-window modal-dialog';
  public static CONTENT_CLASS_ML = 'modal-content modal-mlg app-modal-window modal-dialog';
  public static CONTENT_CLASS_XM = 'modal-content modal-slg app-modal-window modal-dialog';
  public static MODAL_DIALOG_SIZE_M = 'medium';
  public static CLOSE = 'CLOSE';
  public static MODAL_DIALOG_CLASS_M = 'modal-dialog modal-dialog-centered modal-md modal-specifique-md';
  public static CONTENT_CLASS_M = 'modal-content modal-md modal-specifique-md';
  public static MODAL_DIALOG_SIZE_S = 'small';
  public static MODAL_DIALOG_CLASS_S = 'modal-dialog modal-dialog-centered modal-sm modal-specifique-sm';
  public static CONTENT_CLASS_S = 'modal-content modal-sm modal-specifique-sm';
  public static readonly OKAY = 'OKAY';
  public static readonly YES = 'YES';
  public static readonly SUCCESSFULLY_RESET = 'SUCCESSFULLY_RESET';
  public static readonly NO = 'NO';
  public static readonly LOGIC_AND = 'and';
  public static readonly LOGIC_OR = 'or';
  public static NAME_CLASS_SIDE_BAR_NAV_ITEM_NAV_DROPDOWN = 'nav-item nav-dropdown';
  public static NAME_CLASS_SIDE_BAR_NAV_ITEM_NAV_DROPDOWN_OPEN = 'nav-item nav-dropdown open';
  public static SELECTED_SUB_MENU = 'selectedSubMenu';
  public static LAST_INDEX_OPEN = 'lastIndexOpen';
  public static NAV_LINK = 'nav-link';
  public static TARGET_BLANK = '_blank';
  public static STEPER_RESULTS_STEPS = '_results';
  public static DONE_UPPER_CASE = 'DONE';
  public static NAV_LINK_ACTIVE = 'nav-link active';
  public static OPEN = 'open';
  public static SPEEDOMETRER = 'speedometer';
  public static CLICK = 'click';
  public static LEAVE = 'leave';
  public static ADMINISTRATIVE_MANAGMENT = 'administrativeManagment';
  public static EXPENSE_REPORT = 'expenseReport';
  public static DOCUMENT = 'document';
  public static DOCUMENTS = 'documents';
  public static TIMESHEET = 'timesheet';
  public static TEAM = 'payroll/team';
  public static SKILLS_MATRIX = 'payroll/skillsMatrix';
  public static SESSION = 'session';
  public static CNSS_DECLARATION = 'cnssdeclaration';
  public static TRANSFER_ORDER = 'transferorder';
  public static readonly ROUTER_STATE = '_routerState';
  public static readonly PIPE_FORMAT_DATE = 'yyyy-MM-dd';
  public static readonly PIPE_FORMAT_DATE_TIME = 'dd/MM/yyyy HH:mm';
  public static YYYY_MM_DD_HH_MM_SS = 'yyyy/MM/dd HH:mm:ss';
  public static YYYY_MM_DD_HH_MM_SS_FORMAT  = 'yyyy-MM-dd HH:mm:ss';
  public static GET_DATA_SOURCE_PREDICATE_AS_NO_TRACKING = 'getDataSourcePredicateAsNoTracking';
  public static readonly GET_DATA_SOURCE_PREDICATE = 'getDataSourcePredicate';
  public static readonly CANDIDATE = 'rh/candidate';
  public static readonly RECRUITMENT = 'rh/recruitment';
  public static readonly NOMENCLATURE = 'manufacturing/nomenclature';
  public static readonly GAMME = 'manufacturing/gamme';
  public static readonly FABRICATION_ARRANGEMENT = 'manufacturing/fabricationArrangement';
  public static readonly ERROR = 'error';
  public static readonly SUCCESS = 'success';
  public static readonly CODE = 'Code';
  public static readonly CODE_UPPERCASE = 'CODE';
  public static readonly NO_CHANGES_HAVE_BEEN_MADE = 'NO_CHANGES_HAVE_BEEN_MADE';
  public static readonly MESSAGE = 'Message';
  public static readonly KEY = 'Key';
  public static readonly CONFIGURE_THE_DASHBOARD = 'CONFIGURE_THE_DASHBOARD';
  public static readonly SAVE = 'SAVE';
  public static readonly VALUE = 'Value';
  public static readonly LEAVE_URL = '/main/payroll/leave';
  public static readonly EXPENSE_REPORT_URL = '/main/payroll/expenseReport';
  public static readonly DOCUMENT_URL = '/main/payroll/document';
  public static readonly CRA_URL = '/main/rh/cra';
  public static readonly GET_DATA_DROPDOWN_WITH_PREDICATE = 'getDataDropdownWithPredicate';
  public static readonly EMAIL = 'Email';
  public static readonly LINKED_IN = 'LinkedIn';
  public static readonly DANGEROUS_ACTION = 'DANGEROUS_ACTION';
  public static readonly CANCEL = 'CANCEL';
  public static readonly CONTINUE = 'CONTINUE';
  public static readonly PREDICATE = 'predicate';
  public static readonly DASHBOARD_URL = '/main/dashboard';
  public static readonly LEAVE_ADD_URL = 'main/payroll/leave/add';
  public static readonly TIMESHEET_URL = '/main/rh/timesheet';
  public static readonly DELIVERY_URL = 'main/sales/delivery/add';
  public static readonly DELIVERY_URL_NEW = 'main/sales/delivery/new';
  public static readonly DELIVERY_LIST_URL = 'main/sales/delivery';
  public static readonly ADD_ASSET_URL = 'main/sales/asset/add';
  public static readonly ADD_ASSET_URL_NEW = 'main/sales/asset/new';
  public static readonly QUOTATION_URL = 'main/sales/quotation/add';
  public static readonly QUOTATION_URL_NEW = 'main/sales/quotation/new';
  public static readonly SEARCH_ITEM_URL = '/main/sales/searchItem';
  public static readonly SEARCH_ITEM_ADD_URL = '/main/sales/searchItem';
  public static readonly SEARCH_ITEM_EDIT_URL = '/main/sales/searchItem/new';
  public static readonly INVOICE_URL_NEW = 'main/sales/invoice/new';
  public static readonly INVOICE_URL = 'main/sales/invoice/add';
  public static readonly TIMESHEET_LIST_URL = 'main/rh/timesheet/list';
  public static readonly COUNTER_SALES_URL = 'main/sales/counterSales';
  public static readonly SUPERADMIN = 'SUPERADMIN';
  public static readonly SuperAdmin = 'SuperAdmin';
  public static readonly ALLROLE = 'ALLROLE';
  public static readonly AllRole = 'All Role';
  public static TEXT_BUTTON_SWAL_WARNING_REFRESH_TERMBILLING_GENERATION = 'TEXT_BUTTON_SWAL_WARNING_REFRESH_TERMBILLING_GENERATION';
  public static TITLE_SWAL_WARNING_REFRESH_TERMBILLING_GENERATION = 'TITLE_SWAL_WARNING_REFRESH_TERMBILLING_GENERATION';
  public static TEXT_BUTTON_SWAL_WARNING_VALIDATE_REFRESH_TERMBILLING_GENERATION =
    'TEXT_BUTTON_SWAL_WARNING_VALIDATE_REFRESH_TERMBILLING_GENERATION';
  public static readonly TECDOC_IMAGE_BASE_URL = 'http://192.168.1.227/tecdoc/Articles-Images';
  public static readonly START_DATE = 'StartDate';
  public static readonly START_DATE_UPPERCASE = 'START_DATE';
  public static readonly END_DATE = 'EndDate';
  public static readonly END_DATE_UPPERCASE = 'END_DATE';
  public static readonly VALIDATION_CONFIRM = 'VALIDATION_CONFIRM';
  public static readonly ARE_YOU_SURE_TO_CONTINUE = 'ARE_YOU_SURE_TO_CONTINUE';
  public static readonly ARE_YOU_SURE = 'ARE_YOU_SURE';
  public static readonly WARNING = 'warning';
  public static readonly WARNING_TITLE = 'WARNING';
  public static readonly INFO = 'INFO';
  public static readonly FR = 'fr';

  public static readonly SLASH = '/';
  public static readonly PERCENTAGE = '%';
  public static readonly DOLLAR = '$';
  public static readonly IsUseTecDocApi = true;
  public static readonly ID_BANK = 'IdBank';

  // Shared Fomat_Number for grid
  public static NUMBER_FORMAT = '##,#.###';
  public static readonly DOT = '.';
  public static readonly DASH = '-';
  public static readonly OPEN_PARENTHESIS = '(';
  public static readonly CLOSE_PARENTHESIS = ')';
  public static readonly UNDERSCORE = '_';
  public static readonly TOKEN = 'Token';
  public static readonly ALL = 'All';
  public static readonly IS_ADMIN = 'isAdmin';
  public static readonly IS_ACTIF = 'IsActif';
  public static readonly MONTH_LOWER = 'month';
  public static readonly ONLY_FIRST_LEVEL_OF_HIERARCHY = 'onlyFirstLevelOfHierarchy';
  public static readonly CANCELED = 'Canceled';
  public static readonly MONTH = 'Month';
  public static readonly YEAR = 'Year';
  public static readonly MONTH_UPPERCASE = 'MONTH';
  public static readonly GET_UNICITY_PER_MONTH = 'getUnicityPerMonth';
  public static NUMBER = 'Number';
  public static readonly NUMBER_UPPERCASE = 'NUMBER';
  public static TITLE = 'Title';
  public static readonly TITLE_UPPERCASE = 'TITLE';
  public static CREATION_DATE = 'CreationDate';
  public static readonly STATE = 'State';
  public static readonly STATE_UPPERCASE = 'STATE';
  public static readonly STEP_UPPERCASE = 'STEP';
  public static Model = 'Model';
  public static readonly TYPE = 'Type';
  public static readonly TYPE_TITLE = 'TYPE';
  public static readonly BY_TYPE = 'BY_TYPE';
  public static readonly GMT_TIMEZONE = 'GMT';
  public static readonly PIPE_FORMAT_TIME = 'hh:mm';
  public static readonly VALIDITY_PERIOD_COLUMN_NAME = 'validityPeriodColumnName';
  public static readonly ID_SALARY_RULE = 'IdSalaryRule';
  public static readonly EMPTY = '';
  public static readonly STARK_DEFAULT_COLOR = '#4c9aae';
  public static readonly LABEL = 'Label';
  public static readonly LABEL_LOWERCASE = 'label';
  public static readonly DATE = 'date';
  public static readonly DOWNLOAD_JASPER_DOCUMENT_REPORT = 'downloadJasperDocumentReport';
  public static MAIN = '/main';
  public static readonly EQUAL_OPERATOR = 'eq';
  public static readonly FIX_REQUEST = 'FIX_REQUEST';
  public static readonly DELETE = 'DELETE';
  public static readonly REFUSE = 'REFUSE';
  public static readonly STATUS_NOT_SET = 'STATUS_NOT_SET';
  public static readonly DATA_NOT_SELECTED = 'DATA_NOT_SELECTED';
  public static readonly TERM_BILLING = 'TERM_BILLING';
  public static readonly ADD_CONTACT = 'ADD_CONTACT';
  public static readonly ONE_MEGABYTE_IN_BYTE = 1024;
  public static readonly UNAUTHRIZED_ERROR_MSG = 'UNAUTHRIZED_ERROR_MSG';
  public static readonly LEAVE_WITH_JUSTIFICATION_VIOLATION = 'LEAVE_WITH_JUSTIFICATION_VIOLATION';
  public static readonly VALIDATION_CURRENT_DAY_HOUR_REMINING = 'VALIDATION_CURRENT_DAY_HOUR_REMINING';
  public static readonly VERIFICATION_PERIOD_LEAVE_WARNING_MSG = 'VERIFICATION_PERIOD_LEAVE_WARNING_MSG';
  public static readonly SELECTED_WARNING_MSG = 'SELECTED_WARNING_MSG';
  public static readonly ALREADY_IMPORTED_DOCUMENT = 'ALREADY_IMPORTED_DOCUMENT';
  public static readonly ALREADY_DELIVERY_INVOICED = 'ALREADY_DELIVERY_INVOICED';
  public static readonly CRM = 'CRM';
  public static readonly YEAR_FORMAT = 'yyyy';
  public static readonly MONTH_FORMAT = 'MMMM yyyy';
  public static readonly BANK = 'Bank';
  public static readonly ROLES_NAMES = 'RolesNames';
  public static readonly COUNTRY = 'Country';
  public static readonly CONTRACT_TYPE = 'ContractType';
  public static readonly SALARY_STRUCTURE = 'SalaryStructure';
  public static readonly CNSS = 'Cnss';
  public static readonly BLANK_SPACE = ' ';
  public static readonly ACCESS_MODIF_PAIE = 'Access_Modif_Paie';
  public static readonly EMPLOYEE_READ_WRITE = 'Employe_Write_Read';
  public static readonly PAIE_READ_WRITE = 'Payroll_read_write_config';
  public static readonly PAIE_SETTING_R_W = 'Settings_Paie_RW';
  public static readonly G_administrative_RW = 'G_administrative_RW';
  public static readonly G_CAREER_RW = 'Career_Management_RW';
  public static readonly EMPLOYEE_READ = 'Employe_Read';
  public static readonly CONTRACT_FULL = 'Contrat-Full';
  public static readonly CONTRACT_DISABLED_ALL_DATA = 'Contract-Disabled-All-Data';
  public static readonly CONTRACT_DISABLED_WITHOUT_BASESALARY_BONUS = 'Contract-Disabled-Without-BaseSalary-Bonus';
  public static readonly TEXT_SWAL_DELETE_ALL = 'TEXT_SWAL_DELETE_ALL';
  public static readonly AUTHORIZED_FILE_FORMAT_ARE = 'AUTHORIZED_FILE_FORMAT_ARE';
  public static readonly FILE_TYPES = 'FILE_TYPES';
  public static readonly APPLICATION_PDF = 'application/pdf';
  public static readonly FILE_MAX_EXCEEDED = 'FILE_MAX_EXCEEDED';
  public static readonly MAX_NUMBER_OF_FILES_EXCEEDED = 'MAX_NUMBER_OF_FILES_EXCEEDED';
  public static readonly FULL_NAME_FROM_EMPLOYEE_NAVIGATION = 'IdEmployeeNavigation.FullName';
  public static readonly DESC = 'desc';
  public static readonly ASC = 'asc';
  public static MAIL_PATTERN = '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+(\\.[a-zA-Z0-9]{2,4}){1,3}$';
  public static readonly CET = 'CET';
  public static readonly CES = 'CES';
  public static readonly CE = 'CE';
  public static readonly CETTE = 'CETTE';
  public static readonly CONFIRMATION_TITLE = 'CONFIRMATION_TITLE';
  public static readonly RETURN_TO_PAGE_CONFIRMATION_MESSAGE = 'RETURN_TO_PAGE_CONFIRMATION_MESSAGE';
  public static CURRENT_OPERATION_HAS_NOT_BEEN_COMPLETED_YET = 'CURRENT_OPERATION_HAS_NOT_BEEN_COMPLETED_YET';
  public static ARE_YOU_SURE_TO_LEAVE_THE_OPERATION_WITHOUT_BEING_COMPLETED = 'ARE_YOU_SURE_TO_LEAVE_THE_OPERATION_WITHOUT_BEING_COMPLETED';
  public static readonly CUSTOMER_LIST_TITLE = 'CUSTOMER_LIST';
  public static readonly ARTICLE_LIST_TITLE = 'ARTICLELIST';
  public static readonly REFERENCE_TITLE = 'REFERENCE';
  public static readonly DESCRIPTION = 'Description';
  public static readonly DESIGNATION_TITLE = 'DESIGNATION';
  public static readonly TIERS_NAVIGATION_NAME = 'IdTiersNavigation.Name';
  public static readonly TIERS_NAVIGATION = 'IdTiersNavigation';
  public static readonly FSR_TITLE = 'FSR';
  public static readonly PERIOD_LIST_URL = 'main/settings/administration/period';
  public static readonly TAXES_LIST_URL = '/main/settings/administration/taxe';
  public static readonly BANK_LIST_URL = 'main/settings/treasury/bankManagement/bank';
  public static readonly CURRENCY_LIST_URL = 'main/settings/administration/currency';
  public static readonly OFFICE_LIST_URL = 'main/settings/administration/office';
  public static readonly ROLE_LIST_URL = 'main/settings/administration/role';
  public static readonly SETTLEMENT_MODE_LIST_URL = '/main/settings/payment/settlementmode';
  public static readonly PRODUCT_TYPE_LIST_URL = 'main/settings/administration/nature';
  public static readonly SUB_FAMILY_LIST_URL = 'main/settings/inventory/list-sub-family';
  public static readonly Model_LIST_URL = 'main/settings/inventory/list-model';
  public static readonly SUB_MODEL_LIST_URL = 'main/settings/inventory/list-sub-models';
  public static readonly SHARED = 'Shared';
  public static readonly PICTURE_BASE = 'data:image/png;base64,';
  public static SWAL_TITLE_NATURE = 'SWAL_TITLE_NATURE';
  public static SWAL_TEXT_NATURE = 'SWAL_TEXT_NATURE';
  public static IS_STOCK_MANAGED = 'IsStockManaged';
  public static COLUMN_ACTIONS_WIDTH = 120;
  public static readonly GROUP_TAX_DELETE_TEXT_MESSAGE = 'GROUP_TAX_DELETE_TEXT_MESSAGE';
  public static readonly GROUP_DELETE_TITLE_MESSAGE = 'GROUP_DELETE_TITLE_MESSAGE';
  public static readonly FAMILY_DELETE_TEXT_MESSAGE = 'FAMILY_DELETE_TEXT_MESSAGE';
  public static readonly FAMILY_DELETE_TITLE_MESSAGE = 'FAMILY_DELETE_TITLE_MESSAGE';
  public static readonly PRODUCT_BRAND_DELETE_TEXT_MESSAGE = 'PRODUCT_BRAND_DELETE_TEXT_MESSAGE';
  public static readonly PRODUCT_BRAND_DELETE_TITLE_MESSAGE = 'PRODUCT_BRAND_DELETE_TITLE_MESSAGE';
  public static COLUMN_ACTIONS_TITLE = 'ACTIONS';
  public static BRAND = 'Brand';
  public static LOGIN_ROUTE = '/login';
  public static PROFILE_URL = '/main/profile';
  public static NOTIFICATIONS_URL = '/main/notifications';
  public static B2B_URL = '/main/sales/order';
  public static ACTIONS_NOTIFICATIONS_URL = '/main/actions_notifications';
  public static ACTIONS_NOTIFICATIONS = 'ACTIONS_NOTIFICATIONS';
  public static USERS_ACTIONS_URL = '/main/user_actions';
  public static USERS_ACTIONS = 'USERS_ACTIONS';
  public static NOTIFICATIONS = 'NOTIFICATIONS';
  public static STARTDATE = 'STARTDATE';
  public static ENDDATE = 'ENDDATE';
  public static readonly GET_MODULES_SETTINGS = 'getModulesSettings';
  public static readonly GET_DATA_WITH_SPECIFIC_FILTER = 'getDataWithSpecificFilter';
  public static readonly GET_DATA_WAREHOUSE_WITH_SPECIFIC_FILTER = 'getDataWarehouseWithSpecificFilter ';
  public static readonly SALES_MODULE = 'Sales';
  public static FACEBOOK_LINK = 'https://www.facebook.com/';
  public static TWITTER_LINK = 'https://www.twitter.com/';
  public static LINKEDIN_LINK = 'https://www.linkedin.com/';
  public static readonly DATES_ERROR = 'DATES_ERROR';
  public static readonly ACTIVITY_AREA = 'activityArea';
  public static readonly MONDAY = 'Monday';
  public static readonly TUESDAY = 'Tuesday';
  public static readonly WEDNESDAY = 'Wednesday';
  public static readonly THURSDAY = 'Thursday';
  public static readonly FRIDAY = 'Friday';
  public static readonly SATURDAY = 'Saturday';
  public static readonly SUNDAY = 'Sunday';
  public static FORMAT_DATE_PLACEHOLDER = 'FORMAT_DATE_PLACEHOLDER';
  public static readonly CODE_COMPANY = 'CodeCompany';
  public static readonly PROVISIONING_DELETE_TITLE_MESSAGE = 'PROVISIONING_SUPPRESSION';
  public static readonly PROVISIONING_DELETE_TEXT_MESSAGE = 'PROVISIONING_DELETE_TEXT_MESSAGE';
  public static VEHICLE_BRAND = 'VEHICLE_BRAND';
  public static PRODUCT_BAND = 'PRODUCT_BAND';
  public static FAMILY = 'FAMILY';
  public static BARCODE = 'BARCODE';
  public static IS_CHECKED = 'isChecked';
  public static FIRST_INVALID_ELEMENT = 'form.ng-invalid';
  public static readonly MAILING = 'MAILING';
  public static DEFAULT_GRID_STATE: State = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.TWENTY,
    filter: {
      logic: SharedConstant.LOGIC_AND,
      filters: []
    }
  };
  public static DEFAULT_GRID_DATA: GridDataResult = {
    data: [],
    total: NumberConstant.ZERO
  };
  public static readonly GALLERY = 'GALLERY_PRODOUCT';
  public static readonly CHOOSESUPPLIER = 'CHOOSESUPPLIER';
  public static readonly CHOOSE_CUSTOMER_PLACEHOLDER = 'CHOOSE_CUSTOMER_PLACEHOLDER';
  public static readonly CONTRACT = 'CONTRACT';
  public static EMAILS = 'emails';
  public static TODAY = 'TODAY';
  public static TODAY_CLASS = 'k-today';
  public static FIRSTNAME = 'FirstName';
  public static ALL_STATUS = 'ALL_STATUS';
  public static IS_NOT = 'IS_NOT';
  public static IS = 'IS';
  public static FILE_AlREADY_IMPORTED = 'FILE_AlREADY_IMPORTED';
  public static DELETE_FAMILY_ECOMMERCE_TEXT = 'DELETE_FAMILY_ECOMMERCE_TEXT';
  public static ALL_UPPER = 'ALL';
  public static ITEM_TIERS = 'ItemTiers';
  public static CURRENCY = 'Currency';
  public static readonly ID_PHONE_NAVIGATION = 'IdPhoneNavigation';
  public static readonly TAXE_GROUP = 'TaxeGroup';
  public static readonly CHOOSERECIPIENT = 'CHOOSERECIPIENT';
  public static MODAL_DIALOG_SIZE_XS = 'extra-small';
  public static readonly YOU_LOGGED_OUT = 'YOU_LOGGED_OUT';
  public static readonly DISABLED = 'DISABLED';
  public static readonly DATE_FORMAT = 'DATE_FORMAT';
  public static readonly GET_USER_CURRENT_INFORMATIONS = 'getUserCurrentInformations';
  public static readonly TAB = 'Tab';
  public static readonly COMMA = ',';
  public static readonly COLON = ':';
  public static readonly SEMICOLON = ';';
  public static readonly STATUS = 'Status';
  public static readonly EMPLOYEE_FULL_NAME_TITLE = 'EMPLOYEE';
  public static readonly STATUS_TITLE = 'STATE_TITLE'
  public static readonly ID_JOB = 'IdJob';
  public static readonly TEAM_FIELD = 'Team';
  public static readonly TEAM_TITLE = 'TEAM';
  public static readonly EMPLOYEE = 'Employee';
  public static readonly NAME_FR = 'NameFr';
  public static readonly NAME_EN = 'NameEn';
  public static readonly ALPHA_2 = 'Alpha2';
  public static readonly ALPHA_3 = 'Alpha3';
  public static readonly COLORS = ['blue', 'yellow', 'pink', 'green', 'Navy', 'Orange', 'yellow', 'pink', 'green', 'Navy', 'Orange'];
  public static readonly RH = 'RH';
  public static readonly RH_PAYROLL_SETTINGS_URL = 'getRhPayrollSettings';
  public static readonly IS_ENABLED = 'isEnabled';
  public static readonly TRUE = 'true';
  public static CRM_DROPDOWN = 'crmDropdown';
  public static readonly CODE_PRODUCT = 'CodeProduct';
  public static readonly ONLY_MONTH_FORMAT = 'MMMM';
  public static readonly PIPE_FORMAT_DATE_DD_MM_YYYY = 'yyyy/MM/dd';
  public static readonly PIPE_FORMAT_DATE__DD_MM_YYYY = 'dd/MM/yyyy';
}
