import {AdministrativeDocumentStatusEnumerator} from '../../models/enumerators/administrative-document-status.enum';

export class AdministrativeDocumentConstant {
  public static readonly STATUS = 'Status';
  public static readonly EMPLOYEE_ID = 'IdEmployee';
  public static readonly ID_TEAM = 'IdTeam';
  public static readonly ID_TYPE = 'IdType';
  public static readonly PERIOD = 'Period';
  public static readonly LEAVE_STATUS = [AdministrativeDocumentStatusEnumerator.Waiting, AdministrativeDocumentStatusEnumerator.Accepted,
    AdministrativeDocumentStatusEnumerator.Refused, AdministrativeDocumentStatusEnumerator.Canceled];
  public static readonly DOCUMENT_STATUS = [AdministrativeDocumentStatusEnumerator.Waiting, AdministrativeDocumentStatusEnumerator.Accepted,
    AdministrativeDocumentStatusEnumerator.Refused];
  public static readonly PREPARE_AND_SEND_EMAIL = 'prepareAndSendEmail';
  public static readonly OKAY = 'OKAY';
  public static readonly ID_EMPLOYEE_NAVIGATION = 'IdEmployeeNavigation';
  public static readonly ID_CREATOR_NAVIGATION = 'IdCreatorNavigation';
}
