export enum HttpAccountErrorCodes {
  CUSTOM_ACCOUNTING_RESPONSE_CODE = 223,

  ENTITY_NOT_FOUND = 20000,
  LABEL_MIN_LENGTH = 20001,
  ENTITY_REFERENCED = 20002,
  ENTITY_ACCOUNTING_FIELD_NOT_VALID = 20003,
  INVALID_FORMAT_EXCEPTION = 20004,
  HTTP_MESSAGE_NOT_READABLE_EXCEPTION = 20005,
  TRYING_TO_SORT_USING_NON_EXISTENT_FIELD = 20007,
  NO_COMPANY_SPECIFIED_CANT_CONNECT_TO_DATA_SOURCE = 20008,
  INVALID_COMPANY_SPECIFIED_CANT_CONNECT_TO_DATA_SOURCE = 20009,
  NO_LANGUAGE_IS_SPECIFIED=20012,
  FIELD_TYPE_NOT_COMPARABLE=20013,
  NO_USER_IS_SPECIFIED=20014,


  DOCUMENT_ACCOUNT_AMOUNT_CODE = 20100,
  DOCUMENT_ACCOUNT_WITHOUT_LINES_CODE = 20101,
  DOCUMENT_ACCOUNT_NO_FISCAL_YEAR = 20102,
  DOCUMENT_ACCOUNT_MISSING_PARAMETERS = 20103,
  DOCUMENT_ACCOUNT_DATE_IN_CLOSED_PERIOD = 20105,
  DOCUMENT_ACCOUNT_DATE_INVALID = 20106,
  DOCUMENT_ACCOUNT_CANT_HAVE_MULTIPLE_JOURNAL_ANEW_DOCUMENTS = 20107,
  BILL_DATE_AFTER_CURRENT_DATE = 20108,
  DOCUMENT_ACCOUNT_NON_EXISTENT = 20109,
  DOCUMENT_ACCOUNT_COMING_FROM_CLOSING_FISCAL_YEAR_CANNOT_BE_DELETED = 20113,
  DOCUMENT_ACCOUNT_COMING_FROM_CLOSING_FISCAL_YEAR_CANNOT_BE_MANUALLY_UPDATED = 20114,
  DOCUMENT_ACCOUNT_COMING_FROM_BILL_CANNOT_BE_DELETED = 20115,
  DOCUMENT_ACCOUNT_COMING_FROM_A_BILL_CANNOT_BE_MANUALLY_UPDATED = 20116,
  DOCUMENT_ACCOUNT_CANT_DELETE_DOCUMENT_IN_CLOSED_PERIOD = 20117,
  DOCUMENT_ACCOUNT_LINE_NOT_FOUND = 20118,
  DOCUMENT_ACCOUNT_ENTITY_NOT_FOUND = 20119,
  DOCUMENT_ACCOUNT_CANT_UPDATE_DOCUMENT_IN_CLOSED_PERIOD = 20120,
  DOCUMENT_ACCOUNT_CODE_EXISTS = 20121,
  DOCUMENT_ACCOUNT_CONTAINS_RECONCILABLE_LINES_CANNOT_BE_DELETED = 20122,
  DOCUMENT_ACCOUNT_CONTAINS_LETTERED_LINES_CANNOT_BE_DELETED=20123,
  DOCUMENT_ACCOUNT_LINE_ACCOUNT_DOES_NOT_EXIST=20125,
  DOCUMENT_ACCOUNT_FROM_AMORTIZATION_NOT_GENERATED_YET =20126,
  NO_ASSET_IS_DEPRECIABLE_IN_THE_FISCAL_YEAR = 20127,
  DOCUMENT_ACCOUNT_FROM_BILL_AMOUNT_TTC_EQUAL_ZERO_CANNOT_BE_GENERATED = 20128,

  CHART_ACCOUNT_PARENT_CHART_ACCOUNT_DONT_EXIST = 20200,
  CHART_ACCOUNT_CODE_EXISTS = 20201,
  CHART_ACCOUNT_LABEL_EXISTS = 20202,
  CHART_ACCOUNT_CODE_AND_LABEL_EXIST = 20203,
  CHART_ACCOUNT_MISSING_PARAMETERS = 20204,
  CHART_ACCOUNT_INEXISTANT = 20205,
  CHART_ACCOUNT_ALREADY_USED_CANT_CHANGE_CODE = 20206,
  CHART_ACCOUNT_ALREADY_USED_CANT_DELETE = 20207,
  CHART_ACCOUNT_MAX_CODE_EXCEEDED = 20208,

  ACCOUNT_CODE_EXISTS = 20300,
  ACCOUNT_CREDIT_DEBIT_IS_DIFFERENT = 20301,
  ACCOUNT_CODE_DIFFERENT_THAN_PARENT = 20302,
  ACCOUNT_NEGATIVE_CREDIT_OR_DEBIT = 20303,
  ACCOUNT_COULD_NOT_BE_CREATED = 20304,
  ACCOUNT_MISSING_PARAMETERS = 20305,
  ACCOUNT_CODE_LENGTH_INVALID = 20306,
  NO_ACCOUNT_PREFIXED_BY_CODE = 20307,
  NO_OPENING_BALANCE_SHEET_ACCOUNT = 20308,
  NO_CLOSING_BALANCE_SHEET_ACCOUNT = 20309,
  ACCOUNT_DOES_NOT_EXIST_ALLOCATION_NOT_POSSIBLE = 20310,
  ACCOUNT_RELATION_TYPE_INVALID = 20311,
  ACCOUNT_RELATION_TYPE_DUPLICATES = 20312,
  ACCOUNT_RELATION_IMPLEMENTATION_NONEXISTENT = 20313,
  ACCOUNT_SUPPLIER_DOES_NOT_EXIST = 20314,
  ACCOUNT_CUSTOMER_DOES_NOT_EXIST = 20315,
  ACCOUNT_TAXE_DOES_NOT_EXIST = 20316,
  ACCOUNT_IS_USED = 20317,
  NO_ACCOUNT_WITH_CODE = 20318,
  ACCOUNT_WITHHOLDING_TAX_DOES_NOT_EXIST = 20319,

  JOURNAL_CODE_EXISTS = 20400,
  JOURNAL_CODE_LENGTH = 20401,
  JOURNAL_MISSING_PARAMETERS = 20402,
  JOURNAL_NO_JOURNAL_A_NEW = 20403,
  JOURNAL_NOT_FOUND = 20404,
  JOURNAL_LABEL_EXISTS = 20405,
  JOURNAL_CONTAINS_CLOSED_LINES = 20406,

  FISCAL_YEAR_INEXISTANT_FISCAL_YEAR = 20501,
  FISCAL_YEAR_MISSING_PARAMETERS = 20502,
  FISCAL_YEAR_DATES_OVERLAP_ERROR = 20503,
  FISCAL_YEAR_DATES_ORDER_INVALID = 20504,
  FISCAL_YEAR_NAME_EXISTS = 20505,
  FISCAL_YEAR_CLOSED = 20506,
  FISCAL_YEAR_CLOSING_DATE_NULL = 20507,
  FISCAL_YEAR_CLOSING_INTERVAL_OVERLAP_WITH_ALREADY_CLOSED_ONE = 20508,
  FISCAL_YEAR_CLOSED_PERIOD_INEXISTANT = 20509,
  DOCUMENT_ACCOUNT_WITHOUT_FISCAL_YEAR = 20510,
  FISCAL_YEAR_PREVIOUS_FISCAL_YEAR_HAS_NO_NON_LETTERED_DOCUMENT_ACCOUNT_LINES = 20511,
  FISCAL_YEAR_NOT_ALL_DOCUMENTS_IN_NEW_PERIOD = 20512,
  TARGET_FISCAL_YEAR_IS_CLOSED = 20513,
  PREVIOUS_FISCAL_YEARS_NOT_ALL_CONCLUDED = 20514,
  CURRENT_FISCAL_YEAR_IS_NOT_CLOSED = 20515,
  START_DATE_INVALID = 20516,
  TARGET_FISCAL_YEAR_NON_EXISTENT = 20517,
  CURRENT_FISCAL_YEAR_NON_EXISTENT = 20518,
  RESULT_ACCOUNT_NON_EXISTENT = 20519,
  TARGET_FISCAL_YEAR_NOT_AFTER_SELECTED_FISCAL_YEAR = 20520,
  UPDATING_FISCAL_YEAR_THAT_IS_NOT_OPENED = 20521,
  UPDATING_FISCAL_YEAR_THAT_IS_NOT_LAST = 20522,
  DOCUMENT_ACCOUNT_NOT_IN_FISCAL_YEAR = 20523,
  FISCAL_YEAR_NOT_OPENED_OPERATION_NOT_ALLOWED = 20524,
  JOURNAL_A_NEW_TO_REMOVE_CONTAINS_LETTERED_LINES = 20525,
  FISCAL_YEAR_CLOSING_DATE_BEFORE_END_DATE = 20526,
  UPDATING_FISCAL_YEAR_THAT_IS_CONCLUDED = 20527,

  ACCOUNTING_CONFIGURATION_NO_CONFIGURATION_FOUND = 20600,
  ACCOUNTING_CONFIGURATION_ACCOUNTS_NOT_FOUND = 20601,
  ACCOUNTING_CONFIGURATION_FISCAL_YEAR_NOT_FOUND = 20602,
  ACCOUNTING_CONFIGURATION_MISSING_PARAMETERS = 20603,
  ACCOUNTING_CONFIGURATION_CATEGORY_NOT_FOUND = 20604,
  ACCOUNTING_CONFIGURATION_DEPRECITION_PERIOD_UNAFFECTED = 20605,

  START_DATE_IS_AFTER_END_DATE = 20701,
  BEGIN_ACCOUNT_CODE_IS_GREATER_THAN_END_ACCOUNT = 20702,

  TEMPLATE_ACCOUNTING_WITHOUT_LINES_CODE = 20800,
  TEMPLATE_ACCOUNTING_MISSING_PARAMETERS = 20801,
  TEMPLATE_ACCOUNTING_LABEL_EXISTS = 20802,

  BILL_ALREADY_IMPORTED = 20900,
  BILL_SAVE_ERROR = 20901,
  BILL_DATE_NOT_IN_FISCAL_YEAR = 20902,
  NULL_BILL_ACCOUNT_ID = 20903,
  NULL_VAT_ACCOUNT_ID = 20904,
  NULL_TIER_ACCOUNT_ID = 20905,
  NULL_ARTICLE_ACCOUNT_ID = 20906,

  YOU_MUST_CHOOSE_FOR_THE_THE_SAME_LETTER_SINGLE_ACCOUNT = 20921,
  TOTAL_DEBIT_SHOULD_BE_EQUAL_TO_TOTAL_CREDIT_FOR_ACCOUNT_AND_LETTER = 20922,
  CHOSEN_LETTERING_CODE_ALREADY_EXISTS = 20923,
  LAST_CODE_REACHED = 20924,
  LETTERING_OPERATION_IN_CLOSED_PERIOD = 20925,

  REPORT_LINE_INEXISTANT_REPORT_LINE = 20941,
  REPORT_LINE_INVALID_FORMULA = 20942,
  REPORT_LINE_STATE_OF_INCOME_FIELDS_MISMATCH = 20943,
  REPORT_LINE_INDEX_LINE_NOT_FOUND = 20944,
  REPORT_LINE_FORMULA_CONTAINS_REPETITION = 20945,
  REPORT_LINE_ASSETS_NOT_FOUND = 20946,
  REPORT_TYPE_INVALID = 20947,
  REPORT_LINE_INDEX_LINE_ORDER_INVALID = 20948,
  REPORT_LINE_NO_DEFAULT_REPORT_CONFIGURATION = 20949,
  REPORT_LINE_NO_DEFAULT_REPORT_CONFIGURATION_WITH_INDEX_FOR_THIS_REPORT_TYPE = 20950,
  REPORT_LINE_ANNEX_ALREADY_EXISTS = 20951,
  ACCOUNT_NOT_BALANCED = 20952,
  REPORT_LINE_CANNOT_UPDATE_WHEN_FISCAL_YEAR_NOT_OPENED = 20953,
  NO_ANNEX_REPORT_SUPPORTED_FOR_THIS_REPORT_TYPE = 20954 ,
  ERROR_JASPER_FILE_GENERATION = 20955,

  END_AMOUNT_LESS_THAN_BEGIN_AMOUNT = 20961,
  BEGIN_AMOUNT_OR_END_AMOUNT_FORMAT_INCORRECT = 20962,
  EXCEL_FILE_CREATION_FAIL = 20981,
  EXPORT_COULD_NOT_CREATE_DIRECTORY_FOR_FILES = 20982,
  EXCEL_ERROR_WHILE_READING_FILE = 20983,
  EXCEL_ERROR_DOWNLOADING_THE_FILE = 20984,
  EXCEL_INVALID_HEADERS = 20985,
  EXCEL_EMPTY_FILE = 20986,
  EXCEL_INVALID_CONTENT_FORMAT = 20987,
  EXCEL_INVALID_ROW = 20988,
  EXCEL_FIRST_ROW_SHOULD_CONTAIN_DOCUMENT_INFORMATION = 20989,
  EXCEL_HEADER_SHOULD_BE_IN_FIRST_ROW = 20990,
  EXCEL_HEADER_SHOULD_START_IN_FIRST_CELL = 20991,
  EXCEL_NO_FOLDER_FOR_GENERATED_REPORTS = 20992,
  EXCEL_FILE_LOCKED_BY_PASSWORD = 20993,
  EXCEL_FILE_NOT_FOUND = 20994,
  EXCEL_NO_CHART_ACCOUNTS_TO_BE_SAVED = 20995,
  EXCEL_NO_DOCUMENT_ACCOUNTS_TO_BE_SAVED = 20996,
  EXCEL_OLD_FORMAT_NOT_SUPPORTED = 20997,
  EXCEL_OOXML_FORMAT_NOT_SUPPORTED = 20998,
  EXCEL_NO_JOURNALS_TO_BE_SAVED = 20999,
  EXCEL_NO_ACCOUNTS_TO_BE_SAVED = 21000,
  EXCEL_NO_ACCOUNTING_TEMPLATES_TO_BE_SAVED = 21001,
  EXCEL_REPORT_TEMPLATES_NOT_FOUND = 21002,
  EXCEL_ERROR_PARSING_LOCAL_DATE_OBJECT  = 21003,

  ASSETS_OUT_OF_SERVICE = 21101,
  DATE_CESSION_AFTER_DATE_COMMISSIONING = 21102,
  DEPRECIATION_ASSETS_NOT_ACCOUNTED = 21103,
  AMORTIZATION_OF_ASSETS_NOT_FOUND = 21104,
  DEPRECIATION_ASSETS_FIELD_EMPTY = 21105,
  DATE_CESSION_NULL = 21106,
  RESOURCE_NOT_FOUND = 21107,
  DATE_CESSION_OUT_OF_SERVICE = 21108,
  DOCUMENT_ACCOUNT_LINE_WITH_BOTH_DEBIT_AND_CREDIT = 21200,
  USER_NOT_FOUND = 21201,
  USER_HAS_A_JOURNAL = 21202

}
