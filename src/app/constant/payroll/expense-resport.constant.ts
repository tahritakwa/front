import {SharedConstant} from '../shared/shared.constant';

export class ExpenseReportConstant {
  public static ID = 'Id';
  public static EXPENSE_REPORT_EDIT_URL = 'main/payroll/expenseReport/edit/';
  public static ID_EMPLOYEE = 'IdEmployee';
  public static ID_EMPLOYEE_NAVIGATION = 'IdEmployeeNavigation';
  public static EMPLOYEE_NAME_FROM_ID_EMPLOYEE_NAVIGATION = 'IdEmployeeNavigation.FullName';
  public static EMPLOYEE = 'EMPLOYEE';
  public static PURPOSE = 'Purpose';
  public static PURPOSE_UPPERCASE = 'PURPOSE';
  public static SUBMISSION_DATE = 'SubmissionDate';
  public static SUBMISSION_DATE_UPPERCASE = 'SUBMISSION_DATE';
  public static TOTAL_AMOUNT = 'TotalAmount';
  public static TOTAL_EXPENSE = 'TOTAL_EXPENSE';
  public static STATUS = 'Status';
  public static STATUS_UPPERCASE = 'STATUS';
  public static EXPENSE_REPORT_DETAILS = 'ExpenseReportDetails';
  public static SAVE_API_URL = 'insertExpenseReport';
  public static UPDATE_API_URL = 'updateExpenseReport';
  public static EXPENSE_REPORT_ADD_URL = 'main/payroll/expenseReport/add';
  public static CALCULATE_TOTAL_AMOUNT_API_URL = 'calculateTotalAmount';
  public static GET_EXPENSE_REPORTS_REQUESTS_WITH_HIERARCHY = 'getExpenseReportsRequestsWithHierarchy';
  public static IS_DELETED = 'IsDeleted';
  public static TREATED_BY_NAVIGATION = 'TreatedByNavigation';
  public static TREATMENT_DATE = 'TreatmentDate';
  public static TREATMENT_DATE_UPPERCASE = 'TREATMENT_DATE';
  public static TREATED_BY = 'TreatedByNavigation.FullName';
  public static TREATED_BY_UPPERCASE = 'TREATED_BY';
  public static ENTITY_NAME = 'ExpenseReportRequest';
  public static VALIDATE_API_URL = 'validate';
  public static EXPENSE_REPORT = 'ExpenseReport';
  public static VALIDATE_EXPENSE_REPORT_REQUEST_ALERT = 'VALIDATE_EXPENSE_REPORT_REQUEST_ALERT';
  public static REFUS_EXPENSE_REPORT_REQUEST_ALERT = 'REFUS_EXPENSE_REPORT_REQUEST_ALERT';
  public static BACK_TO_EXPENSE_REPORT_ADD_URL = 'main/payroll/expenseReport/add/';
  public static AMOUNT = 'Amount';
  public static readonly VAIDATE_EXPENSE_USER_URL_LIST = '/main/payroll/expenseReport/validateExpense/list';
  public static readonly GET_EXPENSE_FROM_LIST_ID = 'getExpenseFromListId';
  public static readonly VALIDATE_MASSIVE_EXPENSES = 'validateMassiveExpenses';
  public static readonly EXPENSE = 'main/payroll/expenseReport';
  public static EXPENSE_REPORT_ACTION = [
    SharedConstant.VALIDATE,
    SharedConstant.DELETE,
    SharedConstant.REFUSE,
  ];
  public static DELETE_EXPENSE_REPORT_ALERT = 'DELETE_EXPENSE_REPORT_ALERT';
  public static readonly DELETE_MASSIVE_EXPENSE_REPORT = 'deleteMassiveexpenseReport/';
  public static readonly REFUSE_MASSIVE_EXPENSE_REPORT = 'refuseMassiveexpenseReport/';
  public static REFUS_EXPENSE_REPORT_ALERT = 'REFUS_EXPENSE_REPORT_ALERT';
  public static readonly ID_CURRENCY = 'IdCurrency';
  public static readonly DOWNLOAD_EXPENSE_REPORT_DOCUMENTS_WAR = 'downloadExpenseReportDocumentsWar';

}
