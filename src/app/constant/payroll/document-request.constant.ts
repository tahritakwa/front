import {SharedConstant} from '../shared/shared.constant';

export class DocumentRequestConstant {

  public static readonly TYPE = 'Type';
  public static readonly DESCRIPTION = 'Description';
  public static readonly STATUS = 'Status';
  public static readonly DEADLINE = 'DeadLine';
  public static readonly TYPE_TITLE = 'TYPE';
  public static readonly DESCRIPTION_TITLE = 'DESCRIPTION';
  public static readonly STATUS_TITLE = 'STATUS';
  public static readonly DEADLINE_TITLE = 'DEADLINE';
  public static readonly IN_PROGRESS = 'IN_PROGRESS';
  public static readonly TREATED = 'TREATED_REQUEST';
  public static readonly NOT_TREATED = 'NOT_TREATED_REQUEST';
  public static readonly ALL_DOCUMENT_REQUESTS = 'ALL_DOCUMENT_REQUESTS';
  public static readonly CLOSED = 'CLOSED';
  public static readonly MY_DOCUMENT = 'document';
  public static readonly USER_NAVIGATION_FULL_NAME = 'IdUserNavigation.IdEmployeeNavigation.FullName';
  public static readonly USER_NAVIGATION = 'IdUserNavigation.IdEmployeeNavigation';
  public static readonly DOCUMENT_REQUEST_TYPE_TITLE = 'DOCUMENT_REQUEST_TYPE_TITLE';
  public static readonly CODE_UPPERCASE = 'CODE';
  public static readonly CODE = 'Code';
  public static readonly LABEL_UPPERCASE = 'LABEL';
  public static readonly LABEL = 'Label';
  public static readonly CONNECTED_USER_DOCUMENT_REQUEST = 'connectedUSerDocumentRequest/';
  public static readonly SUBMISSION_DATE = 'SubmissionDate';
  public static readonly SUBMISSION_DATE_UPPERCASE = 'SUBMISSION_DATE';
  public static readonly ID_DOCUMENT_REQUEST_TYPE = 'IdDocumentRequestType';
  public static readonly ID_DOCUMENT_REQUEST_TYPE_NAVIGATION_LABEL = 'IdDocumentRequestTypeNavigation.Label';
  public static readonly ID_DOCUMENT_REQUEST_TYPE_NAVIGATION = 'IdDocumentRequestTypeNavigation';
  public static readonly ID_USER_NAVIGATION = 'IdUserNavigation';
  public static readonly UNAUTHRIZED_DELETE_ERROR_MSG = 'UNAUTHRIZED_DELETE_ERROR_MSG';
  public static readonly CAN_NOT_REMOVE = 'CAN_NOT_REMOVE';
  public static readonly DOCUMENT_REQUEST_EDIT_URL = 'main/payroll/document/edit/';
  public static readonly DOCUMENT_REQUEST_TYPE_NAVIGATION = 'IdDocumentRequestTypeNavigation';
  public static readonly ID_EMPLOYEE_NAVIGATION = 'IdEmployeeNavigation';
  public static readonly ID = 'Id';
  public static readonly DOCUMENT_REQUEST_VALIDATION = 'documentRequestValidation';
  public static readonly DOCUMENT_REQUEST_LIST_URL = 'main/payroll/document';
  public static readonly DOCUMENT_REQUEST_ADD_URL = 'main/payroll/document/add';
  public static readonly ID_EMPLOYEE = 'IdEmployee';
  public static GET_DOCUMENT_REQUESTS_WITH_HIERARCHY = 'getDocumentRequestsWithHierarchy';
  public static EMPLOYEE_NAME_FROM_ID_EMPLOYEE_NAVIGATION = 'IdEmployeeNavigation.FullName';
  public static TREATED_BY_NAVIGATION = 'TreatedByNavigation';
  public static EMPLOYEE = 'EMPLOYEE';
  public static TREATMENT_DATE = 'TreatmentDate';
  public static TREATMENT_DATE_UPPERCASE = 'TREATMENT_DATE';
  public static TREATED_BY = 'TreatedByNavigation.FullName';
  public static TREATED_BY_UPPERCASE = 'TREATED_BY';
  public static ENTITY_NAME = 'DocumentRequest';
  public static VALIDATE_API_URL = 'validate';
  public static DOCUMENT_REQUEST = 'DocumentRequest';
  public static VALIDATE_REQUEST = 'VALIDATE_REQUEST';
  public static VALIDATE_FUNCTIONALITY_NAME = 'VALIDATE-DOCUMENTREQUEST';
  public static VALIDATE_DOCUMENT_REQUEST_ALERT = 'VALIDATE_DOCUMENT_REQUEST_ALERT';
  public static REFUS_DOCUMENT_REQUEST_ALERT = 'REFUS_DOCUMENT_REQUEST_ALERT';
  public static readonly VAIDATE_DOCUMENT_URL_LIST = '/main/payroll/document/validatedocument/list';
  public static readonly DOCUMENTS = 'main/payroll/document';
  public static readonly GET_DOCUMENT_FROM_LIST_ID = 'getDocumentsFromListId';
  public static readonly VALIDATE_MASSIVE_DOCUMENTS = 'validateMassiveDocuments';
  public static DOCUMENT_REQUEST_ACTION = [
    SharedConstant.VALIDATE,
    SharedConstant.DELETE,
    SharedConstant.REFUSE,
  ];
  public static DELETE_DOCUMENT_REQUEST_ALERT = 'DELETE_DOCUMENT_REQUEST_ALERT';
  public static readonly DELETE_MASSIVE_DOCUMENTS = 'deleteMassiveDocumentRequest/';
  public static readonly REFUSE_MASSIVE_DOCUMENTS = 'refuseMassiveDocumentRequest/';
}
