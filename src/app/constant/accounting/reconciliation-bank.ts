export class ReconciliationConstant {

  public static JOURNAL_LABEL = 'journalLabel';
  public static JOURNAL_LABEL_TITLE = 'JOURNAL';
  public static CODE = 'codeDocument';
  public static CODE_TITLE = 'CODE_DOCUMENT_ACCOUNT';
  public static DOCUMENT_DATE = 'documentDate';
  public static DOCUMENT_DATE_TITLE = 'DOCUMENT_DATE';
  public static REFERENCE = 'reference';
  public static REFERENCE_TITLE = 'REFERENCE';
  public static LABEL = 'label';
  public static LABEL_TITLE = 'LABEL';
  public static CREDIT_AMOUNT = 'creditAmount';
  public static CREDIT_AMOUNT_TITLE = 'CREDIT';
  public static CURRENT_CREDIT = 'totalCurrentCredit';
  public static DEBIT_AMOUNT = 'debitAmount';
  public static DEBIT_AMOUNT_TITLE = 'DEBIT';

  public static RECONCILIATION_HISTORY_URL = 'main/accounting/reconciliationBankMenu/historic/';
  public static RECONCILIATION_BANK_STATEMENT_URL = 'main/accounting/reconciliationBankMenu/reconciliationBankStatement';
  public static RECONCILIATION_BANK_URL = 'main/accounting/reconciliationBankMenu/reconciliationBank';

  public static navLinkAccountingReconciliationBankMenu = [
    {
      key: 'reconciliationBankMenu/reconciliationBank',
      name: 'RECONCILIATION_BANK',
      parent: 'RECONCILIATION_BANK'
    },
    {
      key: 'reconciliationBankMenu/reconciliationBankStatement',
      name: 'RECONCILIATION_BANK_STATEMENT',
      parent: 'RECONCILIATION_BANK'
    },
    {
      key: 'reconciliationBankMenu/historic',
      name: 'HISTORY',
      parent: 'RECONCILIATION_BANK'
    }
  ];

}
