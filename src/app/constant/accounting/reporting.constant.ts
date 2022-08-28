import { ColumnSettings } from '../../shared/utils/column-settings.interface';
import { NumberConstant } from '../utility/number.constant';

export class ReportingConstant {
  public static ENTITY_NAME = 'reports';
  public static JASPER_ENTITY_NAME = 'jasper';
  public static EXCEL_ENTITY_NAME = 'excel';

  public static START_DATE_IS_AFTER_END_DATE = 'START_DATE_IS_AFTER_END_DATE';
  public static BEGIN_ACCOUNT_CODE_IS_GREATER_THAN_END_ACCOUNT = 'BEGIN_ACCOUNT_CODE_IS_GREATER_THAN_END_ACCOUNT';

  public static BALANCE_JASPER_REPORT = 'balance-Jasper-report';
  public static BANK_RECONCILIATION_JASPER_REPORT = 'bank-reconciliation-Jasper-report';
  public static BANK_RECONCILIATION_STATEMENT_JASPER_REPORT = 'bank-reconciliation-Statement-Jasper-report';
  public static GENERAL_LEDGER = 'general-ledger-accounts';
  public static GENERAL_LEDGER_URL = 'general-ledger';
  public static GENERAL_LEDGER_DETAILS = 'general-ledger-account-details';
  public static GENERAL_LEDGER_REPORT = 'general-ledger-report-jasper';

  public static TRIAL_BALANCE = 'trialBalance';
  public static RECONCILIATION_BANK = 'RECONCILIATION_BANK';
  public static RECONCILIATION_BANK_STATEMENT = 'RECONCILIATION_BANK_STATEMENT';
  public static GET_TRIAL_BALANCE = 'trial-balance';
  public static TRIAL_BALANCE_TITLE = "TRIAL_BALANCE";
  public static AUXILIARY_JOURNALS = 'AUXILIARY_JOURNALS';
  public static CENTRALISATION_OF_JOURNALS = 'CENTRALISATION_OF_JOURNALS';
  public static RECONCILIATION_BNK = 'RECONCILIATION_BNK';
  public static STATE_OF_JOURNAL_REPORT = 'journals-state-report-jasper';
  public static STATE_OF_JOURNALS_TITLE ='STATE_OF_JOURNALS';
  public static GENERAL_LEDGER_TITLE ='GENERAL_LEDGER';
  public static AMORTIZATION_REPORT = 'amortization-report';

  public static DEBIT = 'DEBIT';
  public static CODE = 'accountDto.code';
  public static CODE_TITLE = 'CODE';
  public static LABEL = 'accountDto.label';
  public static LABEL_TITLE = 'LABEL';
  public static INITIAL_DEBIT = 'totalInitialDebit';
  public static INITIAL_CREDIT = 'totalInitialCredit';
  public static CREDIT = 'CREDIT';
  public static CURRENT_DEBIT = 'totalCurrentDebit';
  public static CURRENT_CREDIT = 'totalCurrentCredit';
  public static ACCUMULATED_DEBIT = 'accumulatedDebit';
  public static ACCUMULATED_CREDIT = 'accumulatedCredit';
  public static BALANCE_DEBIT = 'balanceDebit';
  public static BALANCE_CREDIT = 'balanceCredit';

  public static STATE_OF_JOURNALS = 'journals-state';
  public static CENTRALIZING_OF_JOURNALS = 'centralizing-journal';
  public static STATE_OF_JOURNALS_DETAILS = 'journals-state-details';
  public static CENTRALIZING_OF_JOURNALS_DETAILS = 'centralizing-journal-details';
  public static CENTRALIZING_OF_JOURNALS_DETAILS_BY_MONTH = 'centralizing-journal-details-by-month';
  public static CENTRALIZING_OF_JOURNALS_REPORT = 'centralizing-journal-report';
  public static CENTRALIZING_OF_JOURNALS_SORTED_REPORT = 'centralizing-journal-by-date';

  public static STATE_OF_AUXILIARY_JOURNALS = 'auxiliary-journals';
  public static STATE_OF_AUXILIARY_REPORT_JOURNALS = 'auxiliary-journal-report';
  public static STATE_OF_AUXILIARY_JOURNALS_DETAILS = 'auxiliary-journal-details';

  public static STATE_OF_INCOME = 'STATE_OF_INCOME';
  public static ANNEX_STATE_OF_INCOME = 'ANNEX_STATE_OF_INCOME';

  public static BALANCE_SHEET_ASSETS = 'BALANCE_SHEET_ASSETS';
  public static BALANCE_SHEETS_EQUITY_AND_LIABILITIES = 'BALANCE_SHEETS_EQUITY_AND_LIABILITIES';
  public static GENERAL_BALANCE_SHEET = 'GENERAL_BALANCE_SHEET';
  public static ANNEX_BALANCE_SHEET = 'ANNEX_BALANCE_SHEET';

  public static INDUSTRIAL_INTERMEDIARY_BALANCES = 'INDUSTRIAL_INTERMEDIARY_BALANCES';
  public static COMMERCIAL_INTERMEDIARY_BALANCES = 'COMMERCIAL_INTERMEDIARY_BALANCES';
  public static CASH_FLOW = 'CASH_FLOW';
  public static CASH_FLOW_ANNEX = 'CASH_FLOW_ANNEX';
  public static YOUR_REPORT_HAS_BEEN_GENERATED = 'YOUR_REPORT_HAS_BEEN_GENERATED';
  public static MODEL_AUTHORIZED = 'MODEL_AUTHORIZED';
  public static MODEL_REFERENCE = 'MODEL_REFERENCE';
  public static CASH_FLOW_REPORT_NAME = 'CASH_FLOW_REPORT_NAME';
  public static CASH_FLOW_ANNEX_REPORT_NAME = 'CASH_FLOW_ANNEX_REPORT_NAME';
  public static CASH_FLOW_AUTHORIZED_REPORT_NAME = 'CASH_FLOW_AUTHORIZED_REPORT_NAME';
  public static CASH_FLOW_AUTHORIZED_ANNEX_REPORT_NAME = 'CASH_FLOW_AUTHORIZED_ANNEX_REPORT_NAME';
  public static CASH_FLOW_AUTHORIZED = 'CASH_FLOW_AUTHORIZED';
  public static CASH_FLOW_REFERENCE = 'CASH_FLOW_REFERENCE';


  public static RL_LABEL_TITLE = 'LABEL';
  public static RL_LABEL_FIELD = 'label';

  public static RL_FORMULA_TITLE = 'FORMULA';
  public static RL_FORMULA_FIELD = 'formula';

  public static RL_SIGN_TITLE = 'SIGN';
  public static RL_SIGN_FIELD = 'negative';


  public static RL_LINE_INDEX_TITLE = 'INDEX';
  public static RL_LINE_INDEX_FIELD = 'lineIndex';

  public static RL_ANNEX_CODE_TITLE = 'ANNEX_CODE';
  public static RL_ANNEX_CODE_FIELD = 'annexCode';

  public static RL_PREVIOUS_FISCAL_YEAR_VALUE_TITLE = 'FISCAL_YEAR';
  public static RL_PREVIOUS_FISCAL_YEAR_VALUE_FIELD = 'previousFiscalYearAmount';

  public static RL_CURRENT_FISCAL_YEAR_VALUE_TITLE = 'FISCAL_YEAR';
  public static RL_CURRENT_FISCAL_YEAR_VALUE_FIELD = 'amount';

  public static REPORT_LINE = 'report-line';
  public static GENERATE_ANNUAL_REPORT = 'generate-annual-report';
  public static GET_STANDARD_REPORT = 'standard-report';
  public static GET_ANNUAL_REPORT = 'annual-report';
  public static GENERATE_ANNUAL_REPORT_ANNEX = 'annual-report-annex';
  public static RESET_REPORT_LINE = 'reset-report-line';

  public static GENERATE_ANNUAL_REPORT_JASPER = "annual-report-detailed-jasper";
  public static GENERATE_ANNUAL_REPORT_ANNEX_JASPER = "annual-report-annex-jasper";

  public static INTERMEDIARY_BALANCE = 'INTERMEDIARY_BALANCE';
  public static BALANCE_SHEET = 'BALANCE_SHEET';
  public static BALANCE_SHEET_REPORT_TITLE = 'BALANCE_SHEET_REPORT_TITLE';
  public static AMORTIZATION_TABLE = 'AMORTIZATION_TABLE';


  public static SOI = 'SOI';
  public static BS = 'BS';
  public static BSAS = 'BSAS';
  public static BSEL = 'BSEL';
  public static BSAN = 'BSAN';
  public static CIB = 'CIB';
  public static IB = 'IB';
  public static IIB = 'IIB';
  public static CF = 'CF';
  public static CFA = 'CFA';


  public static NEGATIVE = 'NEGATIVE';
  public static POSITIVE = 'POSITIVE';

  public static CLOSE_RECONCILABLE_DOCUMENT_ACCOUNT_LINE = 'close-reconcilable-document-account-line';
  public static CLOSE_RECONCILABLE_DOCUMENT_ACCOUNT_ALL_LINE = 'close-reconcilable-document-account-all-line';

  public static BANK_RECONCILIATION = 'bank-reconciliation';
  public static ALL_BANK_RECONCILIATION = 'all-bank-reconciliation';
  public static BANK_RECONCILIATION_STATEMENT = 'bank-reconciliation-statement';
  public static CALCULATE_AMORTIZATION = 'calculate-amortization';
  public static DEPRECIATION_OF_ASSETS = 'depreciation-of-asset';
  public static AMORTIZATION_CODE = 'amortization-code';
  public static ACCOUNT_DEPRECIATION_OF_ASSETS = 'account-depreciation-assets';
  public static LIST_DEPRECIATION_OF_ASSETS_URL = 'main/accounting/depreciationAssets';
  public static CONFIGURATION_COOKIES_URL = 'configurationCookie';
  public static UNBALANCED_CHARTS = 'unbalanced-charts';
  public static ACCOUNT_NOT_BALANCED = 'ACCOUNT_NOT_BALANCED';

  public static REPORT_HAS_BEEN_UPDATED_BY_USER_AT = 'REPORT_HAS_BEEN_UPDATED_BY_USER_AT';
  public static DO_YOU_WANT_TO_PREVIEW_THE_CHANGES_BEFORE_PRINTING = 'DO_YOU_WANT_TO_PREVIEW_THE_CHANGES_BEFORE_PRINTING';
  public static NOTE_ON_TURNOVER_REPORT = 'NoteOnTurnoverReport';
  public static NOTE_ON_TURNOVER = 'NOTE_ON_TURNOVER';
  public static REPORTS_DEFAULT_COLUMNS_CONFIG: ColumnSettings[] = [
    {
      field: ReportingConstant.RL_LINE_INDEX_FIELD,
      title: ReportingConstant.RL_LINE_INDEX_TITLE,
      tooltip: ReportingConstant.RL_LINE_INDEX_TITLE,
      filterable: false,
      width: NumberConstant.EIGHTY,
    },
    {
      field: ReportingConstant.RL_LABEL_FIELD,
      title: ReportingConstant.RL_LABEL_TITLE,
      tooltip: ReportingConstant.RL_LABEL_TITLE,
      filterable: false,
      width: 350,
    },
    {
      field: ReportingConstant.RL_FORMULA_FIELD,
      title: ReportingConstant.RL_FORMULA_TITLE,
      tooltip: ReportingConstant.RL_FORMULA_TITLE,
      filterable: false,
      editable: true,
      width: NumberConstant.TWO_HUNDRED_SIXTY_FIVE,
    },
    {
      field: ReportingConstant.RL_SIGN_FIELD,
      title: ReportingConstant.RL_SIGN_TITLE,
      tooltip: ReportingConstant.RL_SIGN_TITLE,
      width: 80,
      filterable: false,
      editable: true,
    },
    {
      field: ReportingConstant.RL_ANNEX_CODE_FIELD,
      title: ReportingConstant.RL_ANNEX_CODE_TITLE,
      tooltip: ReportingConstant.RL_ANNEX_CODE_TITLE,
      filterable: false,
      editable: true,
      width: NumberConstant.EIGHTY,
    },
    {
      field: ReportingConstant.RL_CURRENT_FISCAL_YEAR_VALUE_FIELD,
      width: 120,
      filterable: false,
    },
    {
      field: ReportingConstant.RL_PREVIOUS_FISCAL_YEAR_VALUE_FIELD,
      width: 120,
      filterable: false,
    },
  ];
  public static INTERMEDIARY_BALANCE_REPORTS_DEFAULT_COLUMNS_CONFIG: ColumnSettings[] = [
    {
      field: ReportingConstant.RL_LINE_INDEX_FIELD,
      title: ReportingConstant.RL_LINE_INDEX_TITLE,
      tooltip: ReportingConstant.RL_LINE_INDEX_TITLE,
      filterable: false,
      width: NumberConstant.EIGHTY,
    },
    {
      field: ReportingConstant.RL_LABEL_FIELD,
      title: ReportingConstant.RL_LABEL_TITLE,
      tooltip: ReportingConstant.RL_LABEL_TITLE,
      filterable: false,
      width: NumberConstant.FOUR_HUNDRED,
    },
    {
      field: ReportingConstant.RL_FORMULA_FIELD,
      title: ReportingConstant.RL_FORMULA_TITLE,
      tooltip: ReportingConstant.RL_FORMULA_TITLE,
      filterable: false,
      editable: true,
      width: NumberConstant.TWO_HUNDRED_SIXTY_FIVE,
    },
    {
      field: ReportingConstant.RL_SIGN_FIELD,
      title: ReportingConstant.RL_SIGN_TITLE,
      tooltip: ReportingConstant.RL_SIGN_TITLE,
      filterable: false,
      width: NumberConstant.ONE_HUNDRED,
      editable: true,
    },
    {
      field: ReportingConstant.RL_ANNEX_CODE_FIELD,
      title: ReportingConstant.RL_ANNEX_CODE_TITLE,
      tooltip: ReportingConstant.RL_ANNEX_CODE_TITLE,
      filterable: false,
      editable: true,
      width: NumberConstant.EIGHTY,
    },
    {
      field: ReportingConstant.RL_CURRENT_FISCAL_YEAR_VALUE_FIELD,
      width: 140,
      filterable: false,
    },
    {
      field: ReportingConstant.RL_PREVIOUS_FISCAL_YEAR_VALUE_FIELD,
      width: 140,
      filterable: false,
    },
  ];

  public static REPORT_LIST_URL = 'main/accounting/reporting/financialStates';
  public static REPORT_HISTORY_URL = 'main/accounting/reporting/financialStates/historic/';

    public static navLinkAccountingReportMenu = [
      {
        key: 'editions/trialBalance',
        name: 'TRIAL_BALANCE',
        parent: 'EDITIONS'
      },
      {
        key: 'editions/generalLedger',
        name: 'GENERAL_LEDGER',
        parent: 'EDITIONS'
      },
      {
        key: 'financialStates/stateOfIncome',
        name: 'STATE_OF_INCOME',
        parent: 'FINANCIAL_STATES'
      },
      {
        key: 'financialStates/balancesheet',
        name: 'BALANCE_SHEET',
        parent: 'FINANCIAL_STATES'
      },

      {
        key: 'financialStates/intermediaryBalance',
        name: 'INTERMEDIARY_BALANCE',
        parent: 'FINANCIAL_STATES'
      },
      {
        key: 'financialStates/cashFlow',
        name: 'CASH_FLOW',
        parent: 'FINANCIAL_STATES'
      },
      {
        key: 'financialStates/historic/SOI',
        name: 'HISTORY',
        parent: 'STATE_OF_INCOME'
      },
      {
        key: 'financialStates/historic/BS',
        name: 'HISTORY',
        parent: 'BALANCE_SHEET'
      },

      {
        key: 'financialStates/historic/CIB',
        name: 'HISTORY',
        parent: 'INTERMEDIARY_BALANCE'
      },
      {
        key: 'financialStates/historic/CFA',
        name: 'HISTORY',
        parent: 'CASH_FLOW'
      },
      {
        key: 'journals/StateOfAuxiliaryJournals',
        name: 'AUXILIARY_JOURNALS',
        parent: 'JOURNALS'
      },
      {
        key: 'journals/centralisationOfJournals',
        name: 'CENTRALISATION_OF_JOURNALS',
        parent: 'JOURNALS'
      },
      {
        key: 'journals/stateOfJournals',
        name: 'STATE_OF_JOURNALS',
        parent: 'JOURNALS'
      }
    ];
}
