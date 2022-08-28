import {PagerSettings} from '@progress/kendo-angular-grid';
import {NumberConstant} from '../utility/number.constant';

export class CrmConstant {
  public static TITLE = 'title';
  public static TITLE_OBJECTIF_TITLE = 'TITLE_OBJECTIF_TITLE';
  public static RESPONSIBLE_USER = 'responsablesUsersId';
  public static RESPONSIBLE_USER_TITLE = 'RESPONSABLE_USER_TITLE';
  public static CONCERNED_USER = 'employeesId';
  public static CONCERNED_USER_TITLE = 'CONCERNED_USER_TITLE';
  public static TYPE = 'categoryType';
  public static TYPE_TITLE = 'TYPE';
  public static STATUS = 'status';
  public static STATUS_TITLE = 'STATUS';
  public static OPPORTUNITY_TYPE_TITLE = 'TYPE_TITLE';
  public static SUCCESS_OPERATION = 'SUCCESS_OPERATION';
  public static FAILURE_OPERATION = 'FAILURE_OPERATION';
  public static OBJECTIF_SERVICES = '';
  public static TYPE_CONTROLS = 'type';
  public static STATUTS = '/';
  public static CATEGORY_LIST_URL = '/main/crm/category';
  public static CATEGORY_SETTING_LIST_URL = '/main/settings/crm/category';
  public static FILE_SEPARATOR = '/';
  public static reasonForChange = 'reasonForChange';
  public static OBJECTIF_PRODUCT_SERVICES = '/product';
  public static STAFFING = 'Staffing';
  public static NAME = 'NAME';
  public static EMAIL = 'EMAIL';
  public static ORGANISM_LABEL = 'ORGANISM_LABEL';
  public static PHONE = 'PHONE_PERSO';
  public static ESTIMATED_INCCOME = 'estimatedIncome';
  public static RATING = 'rating';
  public static RESPONSABLE_ID = 'responsableUserId';
  public static OBJECTIF_ID = 'categoryId';
  public static CURRENT_POSITION_PIPE = 'currentPositionPipe';
  public static FILTER_ORG = 'org';
  public static FILTER_OBJ = 'obj';
  public static BY_ORGANISATION_URL = 'byOrganisation';
  public static BY_OPPORTUNITY_ID = 'by-opportunity-Id';
  public static BY_ORGANIZATION_ID = 'byOrganisation';
  public static OPP_BY_CONTACT_ID = 'by-prospect-contact';
  public static BY_CONTACT_ID = 'byContact';
  public static BY_ORGANIZATION_CLIENT_ID = 'byOrganisationClient';
  public static BY_CONTACT_CLIENT_ID = 'byContactClient';
  public static BY_ORGANIZATION_URL = 'byOrganisation';
  public static PRODUCT_SALE = 'Product sale';
  public static POP_UP_DELETE_CATEGORY_TEXT = 'POP_UP_DELETE_CATEGORY_TEXT';
  public static CATEGORY = 'CATEGORY';
  public static BY_TYPE = 'byType/';
  public static FILTER_ALL = 'all';
  public static ORGANISATION_field = 'organisationName';
  public static ORGANISATION_TITLE = 'ORGANISATION.ORGANISM_LABEL';
  public static CURRENT_STEP = 'currentStatus';
  public static OPPORTUNITY_TYPE = 'opportunityType';
  public static SUPPRESSION_IMPOSSIBLE_EXPLICATION = 'SUPPRESSION_OBJECTIVE_IMPOSSIBLE_EXPLICATION';
  public static PRODUCT_LIST = 'productIdList';
  public static REASON_OF_CHANGE = 'reasonForChange';
  public static CUSTOMER_ID = 'customerId';
  public static CRM_VERSION = 'build-properties';
  public static CRM = 'crm';
  public static PAGE_URL = 'page';
  public static PAGE_PAGINATION_URL = 'pageable';
  public static MAIL_PATTERN = '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+(\\.[a-zA-Z0-9]{2,4}){1,3}$';
  public static DETAILS = 'details';
  public static ACTION = 'ACTION';
  public static REMINDER_DATE = 'REMINDER_DATE';
  public static LEAVES = 'LEAVES';
  public static TOPIC_NOTIFICATION = '/topic/notification/';
  public static TOPIC_REMINDER_NOTIFICATION = '/topic/notificationReminder/';
  public static ARCHIVE_DEPENDENCY_CONTACT = 'ARCHIVE_DEPENDENCY_CONTACT';
  public static ARCHIVE_DEPENDENCY_OPPORTUNITY = 'ARCHIVE_DEPENDENCY_OPPORTUNITY';
  public static ARCHIVE_DEPENDENCY_CLAIM = 'ARCHIVE_DEPENDENCY_CLAIM';
  public static ARCHIVE_DEPENDENCY_ACTION = 'ARCHIVE_DEPENDENCY_ACTION';
  public static RESTORE_DEPENDENCY_CONTACT = 'RESTORE_DEPENDENCY_CONTACT';
  public static RESTORE_DEPENDENCY_OPPORTUNITY = 'RESTORE_DEPENDENCY_OPPORTUNITY';
  public static RESTORE_DEPENDENCY_CLAIM = 'RESTORE_DEPENDENCY_CLAIM';
  public static RESTORE_DEPENDENCY_ACTION = 'RESTORE_DEPENDENCY_ACTION';
  public static REACTIVATION_TITLE = 'REACTIVATION_TITLE';
  public static ARCHIVING_TITLE = 'ARCHIVING_TITLE';
  public static ARCHIVE_ALL = 'ARCHIVE_ALL';
  public static ORGANISATION = 'organisation';
  public static OPPORTUNITY = 'opportunity';
  public static CONTACT = 'contact';
  public static CLAIM = 'claim';
  public static ARCHIVE = 'archive';
  public static ORGANISATION_ID = 'organisationId';
  public static OPPORTUNITY_ID = 'opportunityId';
  public static CONTACT_ID = 'contactId';
  public static REMINDER = 'REMINDER';
  public static BY_USER = '/byUser';
  public static ALL = 'ALL';
  public static EVENT = 'EVENT';

  public static CLOSED = 'CLOSED';
  public static IS_UNIQUE = 'is-unique';
  public static INSERTED_ELEMENT = 'INSERTED';
  public static UPDATED_ELEMENT = 'UPDATED';
  public static FILTER_TYPES = {
    STRING: 'string',
    BOOLEAN: 'boolean',
    DATE: 'date',
    DROP_DOWN_LIST: 'dropdownlist'
  };

  public static FILTER_OPERATORS = {
    EQUAL: 'eq'
  };

  public static FILTER_FIELDS = {
    TYPE: 'type',
    OPERATOR: 'operator',
    FIELD: 'field',
    VALUE: 'value',
  };

  public static FILTER_KEY = 'filter';
  /**
   * to prevent the user to write only space in an input
   */
  public static NAMES_PATTERN = '.*\\S+.*';
  public static CURRENT_OPERATION_HAS_NOT_BEEN_COMPLETED_YET =  'CURRENT_OPERATION_HAS_NOT_BEEN_COMPLETED_YET';
  public static ARE_YOU_SURE_TO_LEAVE_THE_OPERATION_WITHOUT_BEING_COMPLETED = 'ARE_YOU_SURE_TO_LEAVE_THE_OPERATION_WITHOUT_BEING_COMPLETED' ;

  public static PAGER_SETTINGS: PagerSettings = {
    buttonCount: NumberConstant.FIVE, info: true, type: 'numeric', pageSizes: false, previousNext: true
  };
 public static IS_PROSPECT_PARAM = '?isProspect=';

}
