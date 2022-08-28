export class UserConstant {
  public static readonly ID = 'Id';
  public static readonly IDROLE = 'IdRole';
  public static readonly IDENTIFIER = 'id';
  public static readonly FIRST_NAME_FIELD = 'FirstName';
  public static readonly FIRST_NAME = 'FIRST_NAME';
  public static readonly LAST_NAME_FIELD = 'LastName';
  public static readonly FULL_NAME = 'FullName';
  public static readonly LAST_NAME = 'LAST_NAME';
  public static readonly EMAIL_FIELD = 'Email';
  public static readonly CUSTOMER = 'IdTiersNavigation.Name';
  public static readonly CUSTOMER_ID = 'IdTiersNavigation';
  public static readonly EMAIL = 'EMAIL';
  public static readonly CUSTOMERS = 'CUSTOMERS';
  public static readonly PASSWORD = 'Password';
  public static readonly CONFIRMPASSWORD = 'ConfirmPassword';
  public static readonly MASK = '(+990)000000000000';
  public static readonly USER_URL_LIST = '/main/settings/administration/user';
  public static readonly PASSWORDPATTERN = '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,}$';
  public static readonly CURRENTUSER = 'user';
  public static readonly USERROLE = 'UserRole';
  public static readonly MASTER_ROLEUSER = 'MasterRoleUser';
  public static readonly GETPROFILE = 'getProfile/';
  public static readonly USER_URL_EDIT = '/main/settings/administration/user/Edit/';
  public static readonly USER_ROLE_URL_EDIT = '/main/administration/user/EditRoles/';
  public static readonly IDEMPLOYEE = 'IdEmployee';
  public static readonly EMPLOYEE = 'EMPLOYEE';
  public static readonly EMPLOYEE_FIELD = 'IdEmployeeNavigation.FullName';
  public static readonly USER_ROLE = 'UserRole';
  public static readonly ID_ROLE_NAVIGATION = 'RoleName';
  public static readonly ROLE_FIELD = 'Role';
  public static readonly ROLE = 'ROLE';
  public static readonly INSERT_USER = 'insertUser';
  public static readonly GET_USERS_LIST_FROM_MASTER_BASE = 'getUsersListFromMasterBase';
  public static readonly USER_COMPANY = 'MasterUserCompany';
  public static readonly USER_COMPANY_TITLE = 'COMPANY_ASSOCIATED';
  public static readonly ADD_ROLE_TO_MASTER_USER = 'ADD_ROLE_TO_MASTER_USER';
  public static readonly INSERT_USER_IN_THIS_COMPANY = 'insertUserInThisCompany';
  public static readonly DELETE_USER_FROM_SLAVE_BASE = 'deleteUserFromSlaveBase';
  public static readonly UNDEFINED = 'undefined';
  public static readonly SYNCHRONIZE_WITH_MASTER = 'synchronizeWithMaster';
  public static readonly IMPORT_FILE_USERS = 'importFileUsers';
  public static readonly NEW_PASSWORD = 'NewPassword';
  public static readonly CONFIRM_NEW_PASSWORD = 'ConfirmNewPassword';
  public static readonly UPDATE_PICTURE = 'updatePicture';
  public static readonly REMOVE_PICTURE = 'removePicture';
  public static readonly ASSIGN_AN_EMPLOYEE_TO_THIS_USER = 'ARE_SURE_YOU_DO_NOT_ASSIGN_AN_EMPLOYEE_TO_THIS_USER';
  public static readonly CHANGE_PWD = 'CHANGE_PWD';
  public static readonly URL_TARGETED_USERS = 'getTargetedUsers';
  public static readonly USER = 'User';
  public static readonly SHARED = 'Shared';
  public static readonly USER_BASE_URL = 'user';
  public static readonly GET_LIST_OF_USERS_PARENT = '/getListOfUsersParent';
  public static readonly CHANGE_PASSWORD = 'updatePwd';
  public static readonly CHANGE_PASSWORD_SUPERADMIN = 'updatePwdSuperAdmin';
  public static readonly SUCCESSFUL_SYNCHRONIZATION = 'SUCCESSFUL_SYNCHRONIZATION';
  public static readonly COMPANY_LIST = 'getCompanyList';
  public static readonly SIGN_IN = 'signIn';
  public static readonly LOGOUT = 'logOut';
  public static readonly LOGIN = 'login';
  public static readonly MAIN_URL = '/main';
  public static readonly EMAIL_EMPLOYEE_FIELD = 'Email';
  public static readonly EMAIL_EMPLOYEE = 'ASSOCIATE_EMPLOYEE_EMAIL';
  public static readonly WORKPHONE_FIELD = 'WorkPhone';
  public static readonly WORKPHONE = 'WORKPHONE';
  public static readonly MOBILEPHONE_FIELD = 'MobilePhone';
  public static readonly MOBILEPHONE = 'MOBILEPHONE';
  public static readonly PHONE_FIELD = 'Phone';
  public static readonly PHONE = 'PHONE';
  public static readonly INSERT_USERS_LIST = 'insertUsersList';
  public static readonly ROLE_NAVIGATION = 'IdRoleNavigation';
  public static readonly ID_USER = 'IdUser';
  public static readonly IS_DELETED = 'IsDeleted';
  public static readonly LANGUAGE = 'Lang';
  public static readonly DESACTIVATE = 'DESACTIVATE';
  public static readonly DESACTIVATE_USER_TEXT = 'DESACTIVATE_USER_TEXT';
  public static readonly DESACTIVATE_USER_URL_LIST = '/main/settings/administration/user/desactivateUser/list';
  public static readonly SIGN_OUT = 'signOut';
  public static readonly CHANGE_STATE_OF_USER = 'ChangeStateOfUser';
  public static readonly GET_USERS_FROM_LIST_ID = 'getUsersFromListId';
  public static readonly DESACTIVATE_MASSIVE_USERS = 'desactivateMassiveUsers';
  public static readonly REACTIVATE_MASSIVE_USERS = 'reactivateMassiveUsers';
  public static readonly LIST_ID = 'listId';
  public static readonly STATUS = 'state';
  public static readonly USER_URL_MASTER_USER_LIST = '/main/settings/administration/masterUsers';
  public static readonly NAME_EXCEL_MODEL_USER = 'Import_Users';
  public static readonly IMPORT_EXCEL_MODEL_USER = '../../../../assets/excel-models/Import_Users.xlsx';
  public static readonly ID_EMPLOYEE_NAVIGATION = 'IdEmployeeNavigation';
  public static readonly ID_TIMESHEET_NAVIGATION = 'IdEmployeeNavigation.TimeSheetIdEmployeeNavigation';
  public static readonly ID_LEAVE_NAVIGATION = 'IdEmployeeNavigation.LeaveIdEmployeeNavigation';
  public static readonly DESACTIVATE_USER_AFTER_RESIGNED = 'DesactivateUserFollowingExitEmployee';
  public static readonly GET_USER_BY_FILTER = 'getUserByFilter';
  public static readonly IS_ACTIF = 'IsActif';
  public static readonly LAST_CONNECTION = 'LastConnection';
  public static readonly LAST_CONNECTION_UPPERCASE = 'LAST_CONNECTION';
  public static readonly LAST_CONNECTED_IP_ADRESS = 'LastConnectedIpAdress';
  public static readonly LAST_CONNECTED_IP_ADRESS_UPPERCASE = 'LAST_CONNECTED_IP_ADRESS';
  public static readonly LAST_CONNECTED_COMPANY = 'LastConnectedCompany';
  public static readonly LAST_CONNECTED_COMPANY_UPPERCASE = 'LAST_CONNECTED_COMPANY';
  public static readonly IS_BTOB = 'IsBToB';
  public static readonly PREDICATE = 'predicate';
  public static readonly COMPANY_CODE = 'companyCode';
  public static readonly USER_PROFILE_URL = 'main/profile';
  public static readonly USER_LABEL = 'USER';
  public static readonly ACTIVE_USER = 'ACTIVE_USER';
  public static readonly INACTIVE_USER = 'INACTIVE_USER';
  public static readonly ALL_USERS = 'ALL_USERS';
  public static readonly ADRESS_IP = 'ADRESS_IP';
  public static readonly DELETE_TITLE_USER = 'DELETE_TITLE_USER';
  public static readonly DELETE_TXTE_USER = 'DELETE_TXTE_USER';
  public static readonly NO_SELECtED_USER = 'NO_SELECtED_USER';
  public static readonly MASTER_USERS = '/masterUsers';
  public static readonly LIST_URL = '/main/settings/administration/B2bSetting';
  public static readonly CHANGE_INACTIVE_STATE_OF_USER = 'changeInactiveStateOfUser';
  public static readonly REACTIVATE_USER_TEXT = 'REACTIVATE_USER_TEXT';
  public static readonly REACTIVATE = 'REACTIVATE';
  public static readonly EDIT_USER_B2B = '/main/settings/administration/B2bSetting/edit/';
  public static readonly ACTIVATE_TITLE_VALIDATION = 'ACTIVATE_TITLE_VALIDATION';
  public static readonly DEACTIVATE_TITLE_VALIDATION = 'DEACTIVATE_TITLE_VALIDATION';
  public static readonly TEXT_VALIDATION = 'TEXT_VALIDATION';
  public static readonly DEACTIVATE = 'DEACTIVATE';
  public static readonly ACTIVATE = 'ACTIVATE';
  public static readonly THIS_USER = 'THIS_USER';
  public static readonly THESE_USERS = 'THESE_USERS';
  public static readonly GET_USER_PHONE_BY_ID = 'getUserPhoneById/';
  public static readonly LIST_ROLES = 'ListRoles';
  public static readonly STATE_UPPERCASE = 'STATE';
  public  static readonly ExcelColumnsConfig: any[] = [
    {
      field: UserConstant.FULL_NAME,
      title: UserConstant.USER_LABEL,
      _width: 150,
      condition: true
    },
    {
      field: UserConstant.EMAIL_FIELD,
      title: UserConstant.EMAIL,
      _width: 200,
      condition: true
    },
    {
      field: UserConstant.LIST_ROLES,
      title: UserConstant.ROLE,
      _width: 200,
      condition: true
    },
    {
      field: UserConstant.LAST_CONNECTION,
      title: UserConstant.LAST_CONNECTION_UPPERCASE,
      _width: 150,
      condition: true
    },
    {
      field: UserConstant.IS_ACTIF,
      title: UserConstant.STATE_UPPERCASE,
      _width: 90,
      condition: true
    },
    {
      field: UserConstant.LAST_CONNECTED_IP_ADRESS,
      title: UserConstant.LAST_CONNECTED_IP_ADRESS_UPPERCASE,
      _width: 150,
      condition: true
    },
  ];
  public static readonly GET_USER_ID_BY_EMAIL = 'getUserIdByEmail';
  public static readonly USER_DISCONNECTION_MESSAGE = 'USER_DISCONNECTION_MESSAGE';
  public static readonly USER_DISCONNECTION_TITLE = 'USER_DISCONNECTION_TITLE';
  public static readonly UPDATE_PROFILE = "updateProfile";
}
