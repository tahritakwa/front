export class MailingConstant {
  public static readonly MODULE_NAME = 'mailing';
  public static readonly MAILING_URL = 'templateEmail';
  public static readonly SEND_MAIL_URL: 'sendMail';
  public static SUCCESS_OPERATION = 'SUCCESS_OPERATION';
  public static FAILURE_OPERATION = 'FAILURE_OPERATION';
  public static PUP_UP_SEND_MAIL_WITHOUT_OBJECT_TEMPLATE_TEXT = 'PUP_UP_SEND_MAIL_WITHOUT_OBJECT_TEMPLATE_TEXT';
  public static TEMPLATE_EMAIL_LIST = 'main/mailing/templateEmail';
  public static NAME_TITLE = 'TEMPLATE_EMAIL_NAME';
  public static NAME_FIELD = 'name';
  public static SUBJECT_TITLE = 'TEMPLATE_EMAIL_SUBJECT';
  public static SUBJECT_FIELD = 'subject';
  public static BODY_TITLE = 'TEMPLATE_EMAIL_BODY';
  public static BODY_FIELD = 'body';
  public static PUP_UP_DELETE_TEMPLATE_TEXT: 'PUP_UP_DELETE_TEMPLATE_TEXT';
  public static TEMPLATEMAIL: 'templateEmail';
  public static USER_EMAIL_LIST = 'main/mailing/settingsUser';
  public static USERSEMAIL: 'settingsUser';
  public static USERSEMAIL_LIST = 'main/mailing/settingsUser/listUsercredentials';
  public static PASSWORD_DONT_MATCH = 'PASSWORD_DONT_MATCH';
  public static CODE_COMPANY = 'CodeCompany';
  public static CURRENT_OPERATION_HAS_NOT_BEEN_COMPLETED_YET = 'CURRENT_OPERATION_HAS_NOT_BEEN_COMPLETED_YET';
  public static ARE_YOU_SURE_TO_LEAVE_THE_OPERATION_WITHOUT_BEING_COMPLETED = 'ARE_YOU_SURE_TO_LEAVE_THE_OPERATION_WITHOUT_BEING_COMPLETED';
  public static PASSWORD_PATTERN = '^(?=.*\\d)(?=.*[a-z])(?=.*[$@$!%*?&])(?=.*[A-Z])(?!.*\\s).{8,30}$';
  public static PASSWORD_PATTERN_TOOLTIP = 'PASSWORD_PATTERN_TOOLTIP_MAILING';
  public static hostPattern = '(^([a-z0-9]+([a-z0-9-_]+)*\\.)+[a-z]{2,}$)|(^([0-9]{1,3})[.]([0-9]{1,3})[.]([0-9]{1,3})[.]([0-9]{1,3})$)';
  public static MAILING_VERSION = 'build-properties';
}
