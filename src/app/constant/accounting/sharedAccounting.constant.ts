export class SharedAccountingConstant {
  public static YYYY_MM_DD_HH_MM_SS = 'yyyy/MM/dd HH:mm:ss';
  public static YYYY_MM_DD_HH_MM_SS_FORMAT  = 'yyyy-MM-dd HH:mm:ss';
  public static YYYY_MM_DD = 'yyyy/MM/dd';
  public static DD_MM_YYYY = 'dd/MM/yyyy';
  public static SUCCESS_OPERATION = 'SUCCESS_OPERATION';
  public static FAILURE_OPERATION = 'FAILURE_OPERATION';
  public static DOCUMENT_ACCOUNT_AMOUNT_CODE = 'DOCUMENT_ACCOUNT_AMOUNT_CODE';
  public static DOCUMENT_ACCOUNT_AMOUNT_BALANCED = 'DOCUMENT_ACCOUNT_AMOUNT_BALANCED';
  public static DOCUMENT_EXPORT_SUCCESS = 'DOCUMENT_EXPORT_SUCCESS';
  public static ALL = 'ALL';
  public static IS_LITERABLE = 'IS_LITERABLE';
  public static IS_NOT_LITERABLE = 'IS_NOT_LITERABLE';
  public static CLOSED = 'CLOSED';
  public static PARTIALLY_CLOSED = 'PARTIALLY_CLOSED';
  public static OPEN = 'OPEN';
  public static CONCLUDED = 'CONCLUDED';
  public static IS_RECONCILABLE = 'RECONCILABLE';
  public static IS_NOT_RECONCILABLE = 'IS_NOT_RECONCILABLE';
  public static SHOW_TOOLTIP_DELAY = 3000;
  public static START_DATE_ACCOUNTING = 'startDate';
  public static END_DATE_ACCOUNTING = 'endDate';
  public static START_DATE_DOTNET = 'StartDate';
  public static END_DATE_DOTNET = 'EndDate';
  public static INVALID_FILE_TYPE = 'INVALID_FILE_TYPE';
  public static EXCEL_FILE_MAX_SIZE_EXCEEDED = 'EXCEL_FILE_MAX_SIZE_EXCEEDED';
  public static EXCEL_FILE_MAX_SIZE = 5;
  public static DO_YOU_WANT_TO_DOWNLOAD_AND_FIX_ERRORS = 'DO_YOU_WANT_TO_DOWNLOAD_AND_FIX_ERRORS';
  public static EXCEL_IMPORT_ERROR = 'EXCEL_IMPORT_ERROR';
  public static EXCEL_EXPORT_ERROR = 'EXCEL_EXPORT_ERROR';
  public static EXCEL_IMPORT_SUCCESS = 'EXCEL_IMPORT_SUCCESS';
  public static FISCAL_YEAR_NOT_OPEN_CAN_ONLY_PREVIEW = 'FISCAL_YEAR_NOT_OPEN_CAN_ONLY_PREVIEW';
  public static DOCUMENT_IN_CLOSED_PERIOD_YOU_ARE_IN_READ_MODE = 'DOCUMENT_IN_CLOSED_PERIOD_YOU_ARE_IN_READ_MODE';
  public static DOCUMENT_ACCOUNT_LINE_DATE_IN_CLOSED_PERIOD = 'DOCUMENT_ACCOUNT_LINE_DATE_IN_CLOSED_PERIOD';
  public static DOCUMENT_COMES_FROM_A_CLOSING_OPERATION_YOU_ARE_IN_READ_MODE = 'DOCUMENT_COMES_FROM_A_CLOSING_OPERATION_YOU_ARE_IN_READ_MODE';
  public static DOCUMENT_COMES_FROM_AMORTIZATION_YOU_ARE_IN_READ_MODE = 'DOCUMENT_COMES_FROM_AMORTIZATION_YOU_ARE_IN_READ_MODE';
  public static DOCUMENT_ACCOUNT_IS_AUTOMATICALLY_GENERATED_YOU_ARE_IN_READ_MODE = 'DOCUMENT_ACCOUNT_IS_AUTOMATICALLY_GENERATED_YOU_ARE_IN_READ_MODE';
  public static SELECTED_FISCAL_YEAR_IS_NOT_OPENED_YOU_ARE_IN_READ_MODE = 'SELECTED_FISCAL_YEAR_IS_NOT_OPENED_YOU_ARE_IN_READ_MODE';
  public static DEFAULT_SORT_FISCAL_YEAR = '&sort=startDate,desc';
  public static DEFAULT_SORT_DOCUMENT_ACCOUNT_LIST = '&sort=documentDate,desc&sort=codeDocument,desc';
  public static DOCUMENT_ACCOUNT_GENERATED = 'DOCUMENT_ACCOUNT_GENERATED';
  public static CODE_TO_BE_REPLACED_BY = '{code}';
  public static ACCOUNTING_HAS_READ_WRITE_PERMISSION = 'accountingHasReadWritePermission';
  public static OPERATION_FAILED = 'OPERATION_FAILED';


  public static ACCOUNTING_REPORTING_URL = '/accounting/reporting/';
  public static EXCEL_MIME_TYPE = 'application/vnd.ms-excel';
  public static PDF_MIME_TYPE = 'application/pdf';
  public static XLSX = '.XLSX';
  public static PDF = '.pdf';
  public static ACCOUNTING_REPORTING_STATE_OF_INCOME_URL = SharedAccountingConstant.ACCOUNTING_REPORTING_URL + 'stateOfIncome';
  public static ACCOUNTING_REPORTING_BALANCE_SHEET_URL = SharedAccountingConstant.ACCOUNTING_REPORTING_URL + 'balancesheet';
  public static ACCOUNTING_REPORTING_INTERMEDIARY_BALANCE_SHEET_URL = SharedAccountingConstant.ACCOUNTING_REPORTING_URL + 'intermediaryBalance';
  public static TANGIBLE = 'TANGIBLE';
  public static INTANGIBLE = 'INTANGIBLE';
  public static RESET_DEPRECIATION_ASSETS = 'RESET_DEPRECIATION_ASSETS';
  public static ACCOUNTING_CONFIGURATION_CATEGORIES_NOT_FOUND = 'ACCOUNTING_CONFIGURATION_CATEGORIES_NOT_FOUND';
  public static NO_RECONCILED_LINES = 'NO_RECONCILED_LINES';
  public static GENERAL_LEDGER_TITLE = 'GENERAL_LEDGER';

  public static FILTER_TYPES = {
    STRING: 'string',
    BOOLEAN: 'boolean',
    DATE: 'date',
    NUMERIC: 'numeric',
    DROP_DOWN_LIST: 'dropdownlist'
  };

  public static FILTER_OPERATORS = {
    EQUAL: 'eq',
    NOT_EQUAL: 'neq',
    CONTAINS: 'contains',
    DOES_NOT_CONTAIN: 'doesnotcontain',
    STARTS_WITH: 'startswith',
    END_WITH: 'endswith',
    IS_NULL: 'isnull',
    IS_NOT_NULL: 'isnotnull',
    IS_EMPTY: 'isempty',
    IS_AFTER_OR_EQUAL: 'gte',
    IS_BEFORE_OR_EQUAL: 'lte',
    IS_AFTER: 'gt',
    IS_BEFORE: 'lt',
    IS_NOT_EMPTY: 'isnotempty'
  };

  public static FILTER_FIELDS = {
    TYPE: 'type',
    OPERATOR: 'operator',
    FIELD: 'field',
    VALUE: 'value',
  };

  public static FILTER_KEY = 'filter';

  public static FILTER_APIS = {
    GET_ACCOUNT_LIST: 'filter-account',
    GET_FISCAL_YEAR_LIST: 'filter-fiscal-year',
    GET_TEMPLATE_ACCOUNTING_LIST: 'filter-template-accounting',
    GET_JOURNAL_LIST: 'filter-journal',
    GET_DOCUMENT_ACCOUNT_LIST: 'filter-document-account'
  };

  public static FILTER_DROP_DOWN_BY = {
    PLAN: 'plan',
    JOURNAL: 'journal',
    CLOSING_STATE: 'closingState'
  };

  public static MAX_EXCEL_FILE_UPLOAD_SIZE = 1024;
  public static ONE_MEGABYTE = 1024 * 1024 ;
  public static NO_RECORDS_FOUND = 'NO_RECORDS_FOUND';

  public static MAP_FILTER_TYPES = {
    text: 'STRING',
    BOOLEAN: 'BOOLEAN',
    DATE: 'DATE',
    NUMERIC: 'NUMERIC',
    DROP_DOWN_LIST: 'DROP_DOWN_LIST'
  };
}

