export enum HttpStatusCodes {
  //
  // Summary:
  //     Equivalent to HTTP status 100. System.Net.HttpStatusCode.Continue indicates that
  //     the client can continue with its request.
  Continue = 100,
  //
  // Summary:
  //     Equivalent to HTTP status 101. System.Net.HttpStatusCode.SwitchingProtocols indicates
  //     that the protocol version or protocol is being changed.
  SwitchingProtocols = 101,
  //
  // Summary:
  //     Equivalent to HTTP status 200. System.Net.HttpStatusCode.OK indicates that the
  //     request succeeded and that the requested information is in the response. This
  //     is the most common status code to receive.
  OK = 200,
  //
  // Summary:
  //     Equivalent to HTTP status 201. System.Net.HttpStatusCode.Created indicates that
  //     the request resulted in a new resource created before the response was sent.
  Created = 201,
  //
  // Summary:
  //     Equivalent to HTTP status 202. System.Net.HttpStatusCode.Accepted indicates that
  //     the request has been accepted for further processing.
  Accepted = 202,
  //
  // Summary:
  //     Equivalent to HTTP status 203. System.Net.HttpStatusCode.NonAuthoritativeInformation
  //     indicates that the returned metainformation is from a cached copy instead of
  //     the origin server and therefore may be incorrect.
  NonAuthoritativeInformation = 203,
  //
  // Summary:
  //     Equivalent to HTTP status 204. System.Net.HttpStatusCode.NoContent indicates
  //     that the request has been successfully processed and that the response is intentionally
  //     blank.
  NoContent = 204,
  // Summary:
  //     Equivalent to HTTP status 205. System.Net.HttpStatusCode.ResetContent indicates
  //     that the client should reset (not reload) the current resource.
  ResetContent = 205,
  //
  // Summary:
  //     Equivalent to HTTP status 206. System.Net.HttpStatusCode.PartialContent indicates
  //     that the response is a partial response as requested by a GET request that includes
  //     a byte range.
  PartialContent = 206,
  //
  // Summary:
  //     Equivalent to HTTP status 300. System.Net.HttpStatusCode.Ambiguous indicates
  //     that the requested information has multiple representations. The default action
  //     is to treat this status as a redirect and follow the contents of the Location
  //     header associated with this response.
  Ambiguous = 300,
  //
  // Summary:
  //     Equivalent to HTTP status 300. System.Net.HttpStatusCode.MultipleChoices indicates
  //     that the requested information has multiple representations. The default action
  //     is to treat this status as a redirect and follow the contents of the Location
  //     header associated with this response.
  MultipleChoices = 300,
  //
  // Summary:
  //     Equivalent to HTTP status 301. System.Net.HttpStatusCode.Moved indicates that
  //     the requested information has been moved to the URI specified in the Location
  //     header. The default action when this status is received is to follow the Location
  //     header associated with the response. When the original request method was POST,
  //     the redirected request will use the GET method.
  Moved = 301,
  //
  // Summary:
  //     Equivalent to HTTP status 301. System.Net.HttpStatusCode.MovedPermanently indicates
  //     that the requested information has been moved to the URI specified in the Location
  //     header. The default action when this status is received is to follow the Location
  //     header associated with the response.
  MovedPermanently = 301,
  //
  // Summary:
  //     Equivalent to HTTP status 302. System.Net.HttpStatusCode.Found indicates that
  //     the requested information is located at the URI specified in the Location header.
  //     The default action when this status is received is to follow the Location header
  //     associated with the response. When the original request method was POST, the
  //     redirected request will use the GET method.
  Found = 302,
  //
  // Summary:
  //     Equivalent to HTTP status 302. System.Net.HttpStatusCode.Redirect indicates that
  //     the requested information is located at the URI specified in the Location header.
  //     The default action when this status is received is to follow the Location header
  //     associated with the response. When the original request method was POST, the
  //     redirected request will use the GET method.
  Redirect = 302,
  //
  // Summary:
  //     Equivalent to HTTP status 303. System.Net.HttpStatusCode.RedirectMethod automatically
  //     redirects the client to the URI specified in the Location header as the result
  //     of a POST. The request to the resource specified by the Location header will
  //     be made with a GET.
  RedirectMethod = 303,
  //
  // Summary:
  //     Equivalent to HTTP status 303. System.Net.HttpStatusCode.SeeOther automatically
  //     redirects the client to the URI specified in the Location header as the result
  //     of a POST. The request to the resource specified by the Location header will
  //     be made with a GET.
  SeeOther = 303,
  //
  // Summary:
  //     Equivalent to HTTP status 304. System.Net.HttpStatusCode.NotModified indicates
  //     that the client's cached copy is up to date. The contents of the resource are
  //     not transferred.
  NotModified = 304,
  //
  // Summary:
  //     Equivalent to HTTP status 305. System.Net.HttpStatusCode.UseProxy indicates that
  //     the request should use the proxy server at the URI specified in the Location
  //     header.
  UseProxy = 305,
  //
  // Summary:
  //     Equivalent to HTTP status 306. System.Net.HttpStatusCode.Unused is a proposed
  //     extension to the HTTP/1.1 specification that is not fully specified.
  Unused = 306,
  //
  // Summary:
  //     Equivalent to HTTP status 307. System.Net.HttpStatusCode.RedirectKeepVerb indicates
  //     that the request information is located at the URI specified in the Location
  //     header. The default action when this status is received is to follow the Location
  //     header associated with the response. When the original request method was POST,
  //     the redirected request will also use the POST method.
  RedirectKeepVerb = 307,
  //
  // Summary:
  //     Equivalent to HTTP status 307. System.Net.HttpStatusCode.TemporaryRedirect indicates
  //     that the request information is located at the URI specified in the Location
  //     header. The default action when this status is received is to follow the Location
  //     header associated with the response. When the original request method was POST,
  //     the redirected request will also use the POST method.
  TemporaryRedirect = 307,
  //
  // Summary:
  //     Equivalent to HTTP status 400. System.Net.HttpStatusCode.BadRequest indicates
  //     that the request could not be understood by the server. System.Net.HttpStatusCode.BadRequest
  //     is sent when no other error is applicable, or if the exact error is unknown or
  //     does not have its own error code.
  BadRequest = 400,
  //
  // Summary:
  //     Equivalent to HTTP status 401. System.Net.HttpStatusCode.Unauthorized indicates
  //     that the requested resource requires authentication. The WWW-Authenticate header
  //     contains the details of how to perform the authentication.
  Unauthorized = 401,
  //
  // Summary:
  //     Equivalent to HTTP status 402. System.Net.HttpStatusCode.PaymentRequired is reserved
  //     for future use.
  PaymentRequired = 402,
  //
  // Summary:
  //     Equivalent to HTTP status 403. System.Net.HttpStatusCode.Forbidden indicates
  //     that the server refuses to fulfill the request.
  Forbidden = 403,
  //
  // Summary:
  //     Equivalent to HTTP status 404. System.Net.HttpStatusCode.NotFound indicates that
  //     the requested resource does not exist on the server.
  NotFound = 404,
  //
  // Summary:
  //     Equivalent to HTTP status 405. System.Net.HttpStatusCode.MethodNotAllowed indicates
  //     that the request method (POST or GET) is not allowed on the requested resource.
  MethodNotAllowed = 405,
  //
  // Summary:
  //     Equivalent to HTTP status 406. System.Net.HttpStatusCode.NotAcceptable indicates
  //     that the client has indicated with Accept headers that it will not accept any
  //     of the available representations of the resource.
  NotAcceptable = 406,
  //
  // Summary:
  //     Equivalent to HTTP status 407. System.Net.HttpStatusCode.ProxyAuthenticationRequired
  //     indicates that the requested proxy requires authentication. The Proxy-authenticate
  //     header contains the details of how to perform the authentication.
  ProxyAuthenticationRequired = 407,
  //
  // Summary:
  //     Equivalent to HTTP status 408. System.Net.HttpStatusCode.RequestTimeout indicates
  //     that the client did not send a request within the time the server was expecting
  //     the request.
  RequestTimeout = 408,
  //
  // Summary:
  //     Equivalent to HTTP status 409. System.Net.HttpStatusCode.Conflict indicates that
  //     the request could not be carried out because of a conflict on the server.
  Conflict = 409,
  //
  // Summary:
  //     Equivalent to HTTP status 410. System.Net.HttpStatusCode.Gone indicates that
  //     the requested resource is no longer available.
  Gone = 410,
  //
  // Summary:
  //     Equivalent to HTTP status 411. System.Net.HttpStatusCode.LengthRequired indicates
  //     that the required Content-length header is missing.
  LengthRequired = 411,
  //
  // Summary:
  //     Equivalent to HTTP status 412. System.Net.HttpStatusCode.PreconditionFailed indicates
  //     that a condition set for this request failed, and the request cannot be carried
  //     out. Conditions are set with conditional request headers like If-Match, If-None-Match,
  //     or If-Unmodified-Since.
  PreconditionFailed = 412,
  //
  // Summary:
  //     Equivalent to HTTP status 413. System.Net.HttpStatusCode.RequestEntityTooLarge
  //     indicates that the request is too large for the server to process.
  RequestEntityTooLarge = 413,
  //
  // Summary:
  //     Equivalent to HTTP status 414. System.Net.HttpStatusCode.RequestUriTooLong indicates
  //     that the URI is too long.
  RequestUriTooLong = 414,
  //
  // Summary:
  //     Equivalent to HTTP status 415. System.Net.HttpStatusCode.UnsupportedMediaType
  //     indicates that the request is an unsupported type.
  UnsupportedMediaType = 415,
  //
  // Summary:
  //     Equivalent to HTTP status 416. System.Net.HttpStatusCode.RequestedRangeNotSatisfiable
  //     indicates that the range of data requested from the resource cannot be returned,
  //     either because the beginning of the range is before the beginning of the resource,
  //     or the end of the range is after the end of the resource.
  RequestedRangeNotSatisfiable = 416,
  //
  // Summary:
  //     Equivalent to HTTP status 417. System.Net.HttpStatusCode.ExpectationFailed indicates
  //     that an expectation given in an Expect header could not be met by the server.
  ExpectationFailed = 417,
  //
  // Summary:
  //     When the user tries to log in without having a defined role
  UndefinedRole = 418,
  //
  // Summary:
  //     Equivalent to HTTP status 426. System.Net.HttpStatusCode.UpgradeRequired indicates
  //     that the client should switch to a different protocol such as TLS/1.0.
  UpgradeRequired = 426,
  //
  // Summary:
  //     Equivalent to HTTP status 500. System.Net.HttpStatusCode.InternalServerError
  //     indicates that a generic error has occurred on the server.
  InternalServerError = 500,
  //
  // Summary:
  //     Equivalent to HTTP status 501. System.Net.HttpStatusCode.NotImplemented indicates
  //     that the server does not support the requested function.
  NotImplemented = 501,
  //
  // Summary:
  //     Equivalent to HTTP status 502. System.Net.HttpStatusCode.BadGateway indicates
  //     that an intermediate proxy server received a bad response from another proxy
  //     or the origin server.
  BadGateway = 502,
  //
  // Summary:
  //     Equivalent to HTTP status 503. System.Net.HttpStatusCode.ServiceUnavailable indicates
  //     that the server is temporarily unavailable, usually due to high load or maintenance.
  ServiceUnavailable = 503,
  //
  // Summary:
  //     Equivalent to HTTP status 504. System.Net.HttpStatusCode.GatewayTimeout indicates
  //     that an intermediate proxy server timed out while waiting for a response from
  //     another proxy or the origin server.
  GatewayTimeout = 504,
  //
  // Summary:
  //     Equivalent to HTTP status 505. System.Net.HttpStatusCode.HttpVersionNotSupported
  //     indicates that the requested HTTP version is not supported by the server.
  HttpVersionNotSupported = 505,
  /// <summary>
  /// Code n'existe pas
  /// </summary>
  CodeNExistePas = 250,
  // Success messages
  /// <summary>
  /// Add success code
  /// </summary>
  AddSuccessfull = 210,
  /// <summary>
  /// Update success code
  /// </summary>
  UpdateSuccessfull = 211,
  /// <summary>
  /// Delete success code
  /// </summary>
  DeleteSuccessfull = 212,
  /// <summary>
  /// Validation sucess code
  /// </summary>
  Success_VALIDATION = 216,
  /// <summary>
  /// Transafer entities success code
  /// </summary>
  TransferentitiesSuccessfull = 217,
  /// <summary>
  /// Save configuration success code
  /// </summary>
  SaveConfigurationSuccessfull = 218,
  /// <summary>
  /// Tarif Error code
  /// </summary>
  OverlapTarif = 516,
  /// <summary>
  /// Document line setteled error code
  /// </summary>
  SettledDocumentLine = 518,
  /// <summary>
  /// Warehouse required error code
  /// </summary>
  DepotObligatoire = 519,
  /// <summary>
  /// Delete error code
  /// </summary>
  DeleteError = 520,
  /// <summary>
  /// Warehouse required error code
  /// </summary>
  DepoRequiredError = 526,
  /// <summary>
  /// Success reject  !?
  /// </summary>
  SUCCESS_REJECT = 219,
  /// <summary>
  /// Duplicate entry error code
  /// </summary>
  duplicateEntry = 550,
  /// <summary>
  /// Duplicate entry couple error code
  /// </summary>
  duplicateEntryCouple = 551,
  /// <summary>
  /// Duplicate entry group error code
  /// </summary>
  duplicateEntryGroup = 552,
  /// <summary>
  /// Check old password error code
  /// </summary>
  CheckOldPassword = 553,
  /// <summary>
  /// When the users have not been synchronized with the master database
  /// </summary>
  UsersNotSynchronized = 554,
  // HttpStatusCodes
  /// <summary>
  /// When the users is inactif
  /// </summary>
  disabledUser = 555,
  /// Invalid date value
  /// </summary>
  invalidDateValueException = 556,
  /// <summary>
  /// Item quantity error code
  /// </summary>
  InsufficientQuantity = 600,
  /// <summary>
  /// Item quantity error code
  /// </summary>
  InsufficientQuantityForItem = 601,
  /// <summary>
  /// Document line solde error code
  /// </summary>
  LigneDejaSolde = 602,
  /// <summary>
  /// No lines added to document error code
  /// </summary>
  NoLinesAreAdded = 603,
  /// <summary>
  /// Authorized Amount Exceeded error code
  /// </summary>
  AuthorizedAmountExceeded = 604,
  /// <summary>
  /// User must have at least one role error code
  /// </summary>
  UserMastHaveAtLeastOneRoleError = 605,
  /// <summary>
  /// TecDoc Connection issues
  /// </summary>
  TecDocConnectionError = 606,

  /// <summary>
  /// IBAN bank account error code
  /// </summary>
  InvalidIBANBankAccount = 607,
  /// <summary>
  /// RIB bank account error code
  /// </summary>
  RIBBankAccount = 608,
  /// <summary>
  /// Positive minimum quantity error code
  /// </summary>
  PositiveMinimumQuantity = 609,
  /// <summary>
  /// Positive maximum quantity error code
  /// </summary>
  PositiveMaximumQuantity = 610,
  /// <summary>
  /// Price used error code
  /// </summary>
  PriceUsed = 611,
  /// <summary>
  /// Validation success code
  /// </summary>
  ValidationTermineeAvecSucces = 612,
  /// <summary>
  /// Settelement not settle error code
  /// </summary>
  SettlementIsNotSettled = 613,
  /// <summary>
  /// Contract value not setted error code
  /// </summary>
  ContractValueNotSetted = 614,
  /// <summary>
  /// Set supplier to items error code
  /// </summary>
  ///
  SetSupplierToItems = 615,
  /// <summary>
  /// Bonus value not setted error code
  /// </summary>
  BonusValueNotSetted = 616,
  /// <summary>
  /// Commercials percentage exceed 100 error code
  /// </summary>
  CommercialsPercentageExceed_100 = 617,
  /// <summary>
  /// Consultants percentage exceed 100 error code
  /// </summary>
  ConsultantsPercentageExceed_100 = 618,
  /// <summary>
  /// Commercials bonus Exceed total bonus error code
  /// </summary>
  CommercialsBonusExceedTotalBonus = 619,

  /// <summary>
  /// Lexical error
  /// </summary>
  ///
  LexicalError = 620,

  /// <summary>
  /// Syntactic error
  /// </summary>
  SYNTACTIC_ERROR = 621,
  /// <summary>
  /// Execution error
  /// </summary>
  EXECUTION_ERROR = 622,

  /// <summary>
  /// Contract without base salary
  /// </summary>
  BASE_SALARY_LACK = 623,
  /// <summary>
  /// Bonus assigned without value
  /// </summary>
  BONUS_LACK = 624,
  /// <summary>
  /// Constant rate without value
  /// </summary>
  CONSTANT_RATE_LACK = 625,
  /// <summary>
  /// Constant value without value
  /// </summary>
  CONSTANT_VALUE_LACK = 626,
  /// <summary>
  /// When attempt to generate payslip for resigned employee
  /// </summary>
  EMPLOYEE_RESIGNED = 627,
  /// <summary>
  /// When attempt to generate cnss declaration for one month of select trimester does not have a session
  /// </summary>
  CNSS_DECLARATION_ERROR = 628,
  /// <summary>
  /// When file error occur while teledeclaration generation
  /// </summary>
  CNSS_TELE_DECLARATION_ERROR = 629,
  /// <summary>
  /// When the company Cnss Affiliation number length is different to ten
  /// </summary>
  COMPANY_CNSS_AFFILIATION_INCORRECT = 630,
  /// <summary>
  /// When the CNSS Exploitation code length is different to four
  /// </summary>
  CNSS_EXPLOITATION_CODE_INCORRECT = 631,
  /// <summary>
  /// When the employee cnss number length is different to ten
  /// </summary>
  EMPLOYEE_CNSS_NUMBER_INCORRECT = 632,
  /// <summary>
  /// When the employee identity piece length is different to eigth
  /// </summary>
  EMPLOYEE_IDENTITY_PIECE_INCORRECT = 633,
  /// <summary>
  /// When any teledeclaration parameter exceed the required length
  /// </summary>
  PARAMETER_LENGTH_EXCEED = 634,
  /// <summary>
  /// When try to assigne a manager in  his managing team
  /// </summary>
  MANAGER_CANNOT_BE_IN_HIS_MANAGING_TEAM = 635,
  /// <summary>
  /// When try to assigne an employee in team like manager
  /// </summary>
  EMPLOYEE_CANNOT_BE_THIS_TEAM_MANAGER = 636,
  /// <summary>
  /// Session number is not unique per month
  /// </summary>
  SESSION_NUMBER_NOT_UNIQUE = 637,
  /// <summary>
  /// The attendances of one employee exceed company number days of work
  /// </summary>
  ATTENDANCE_VALUE_EXCEED = 638,
  /// <summary>
  /// When attempt to include one contract in two different transfer order
  /// </summary>
  CONTRACT_BY_TRANSFER_ORDER_UNICITY = 639,
  /// <summary>
  /// When an exception occurs when payslip preview is generating
  /// </summary>
  PAYSLIP_PREVIEW = 640,
  /// <summary>
  /// When attempt to include an employee who havenot payslip for specific month
  /// in transfer order
  /// </summary>
  EMPLOYEE_HAVENOT_PAYSLIP = 641,
  /// <summary>
  /// When attempt to delete a Closed session
  /// </summary>
  CANNOT_DELETE_CLOSED_SESSION = 642,
  /// <summary>
  /// When attempt to generate employer declaration
  /// </summary>
  ANY_SOURCE_DEDUCTION = 643,
  /// <summary>
  /// This exception will be handled when the leave dates overlap
  /// </summary>
  LeaveRequestViolation = 644,
  /// <summary>
  /// This exception will be handled when the leave daysNumber and hoursNumber equals to zero
  /// </summary>
  LeaveDateViolation = 645,
  /// <summary>
  /// This exception will be handled when the leave daysNumber and hoursNumber equals to zero
  /// </summary>
  LeaveUpdateViolation = 646,
  /// <summary>
  /// This exception will be handleed when the leave status is not waiting
  /// </summary>
  LeaveDeleteViolation = 647,
  /// <summary>
  /// This exception will be handleed when the startDate is greatter than the endDate
  /// </summary>
  LeaveDateIntervalViolation = 648,
  /// <summary>
  /// This exception will be handleed when leave type must have justification and there is no justificative documents
  /// </summary>
  LeaveWithJustificationViolation = 649,
  /// <summary>
  /// Handled when attempt to update validated or refused timesheet
  /// </summary>
  TIMESHEET_UPDATE_VIOLATION = 650,
  /// <summary>
  /// Handled when user have not permission for validate or refused timesheet
  /// </summary>
  HAVENOT_PERMISSION_FORVLIDATE_OR_REFUSE = 651,
  /// <summary>
  /// When working hours of the same day are overlapping
  /// </summary>
  TIMESHEET_LINE_OVERLAP = 652,
  /// <summary>
  /// When an employee try to add a CRA for a month that has not arrived yet.
  /// </summary>
  CANT_ADD_NEXT_MONTH_TIMESHEET = 653,
  /// <summary>
  /// Prevents the validation of a CRA if a waiting leave currently exists
  /// </summary>
  CANT_VALIDATE_TIMESHEET_BECAUSE_WAITING_LEAVE_EXIST = 654,
  /// <summary>
  /// Throw when the schedules of the day are not covered  by the day of Timesheet
  /// </summary>
  TIMESHEETDAYDOESNTCOVERHOURS = 656,
  /// <summary>
  /// This CRA can not be corrected. He has an invoice
  /// </summary>
  CANNOT_MAKE_FIX_REQUEST = 657,
  /// <summary>
  /// This CRA can not be corrected. He has an invoice
  /// </summary>
  CANNOT_SUBMIT_LEAVE_BECAUSE_TIMESHEET_HAS_INOICE = 658,
  /// <summary>
  /// When try to add timesheet line with line total time equal to zero
  /// </summary>
  CANNOT_SUBMIT_TIMESHEETLINE_TOTAL_TIME_EQUAL_ZERO = 659,
  /// <summary>
  /// Can not cancel this leave because he referenc one CRA which has invoice
  /// </summary>
  CANNOT_CANCEL_LEAVE_BECAUSE_TIMESHEET_HAS_INOICE = 660,
  /// <summary>
  /// Overtaking of leave is not authorized
  /// </summary>
  OVERTAKING_OF_LEAVE_IS_NOT_AUTHORIZED = 661,
  /// <summary>
  /// If a holiday date is not included in the period of the corresponding period
  /// </summary>
  HOLIDAY_DATE_NOT_INCLUDE_IN_PERIOD_DATE = 662,
  /// <summary>
  /// If period overlap
  /// </summary>
  OVERLAPPING_PERIOD = 663,
  /// <summary>
  /// no defined period
  /// </summary>
  ANY_PERIOD_DEFINED = 664,
  /// <summary>
  /// When attemp to specify an end time lower than the start time
  /// </summary>
  STARTTIME_EXCEED_ENDTIME = 665,
  /// <summary>
  /// When attemp to add one period with end date is greater than start date
  /// </summary>
  STARTDATE_EXCEED_ENDDATE = 666,
  /// <summary>
  /// When date have not any period
  /// </summary>
  DATE_MUST_HAVE_ONE_UNIQUE_PERIOD = 667,
  /// <summary>
  /// When the number of schedules defined is different from three
  /// </summary>
  PERIOD_MUST_HAVE_TWO_WORKING_HOURS_FOR_TIMESHEET_PER_HALF_DAY = 668,
  /// <summary>
  /// Database connection error code
  /// </summary>
  DbConnectionError = 669,
  /// <summary>
  /// circular relationship user-manager
  /// </summary>

  BonusWord = 670,
  WarehouseWord = 671,
  USER_MANAGER_RELATION = 672,
  /// <summary>
  /// Must Validate invoices in order
  /// </summary>
  VALIDATE_PREVIOUS_INVOICES = 673,
  /// <summary>
  /// Must Validate invoices in order
  /// </summary>
  VALIDATE_PREVIOUS_BL = 674,
  /// <summary>
  /// Must Validate invoices in order
  /// </summary>
  VALIDATE_SUBSEQUENT_INVOICES = 675,
  PasswordSercurityError = 676,
  ProfileSercurityError = 677,

  ClientRquiredError = 678,
  SupplierRquiredError = 679,
  ItemsInvalidError = 680,
  TaxItemValueError = 681,
  ClientCurrencyError = 682,
  SupplierCurrencyError = 683,
  TaxRequiredError = 684,
  /// <summary>
  /// Invalid Excel Format code
  /// </summary>
  InvalidExcelFormat = 685,
  /// <summary>
  /// Invalid Excel Data code
  /// </summary>
  InvalidExcelData = 686,
  ProductType = 687,
  /// <summary>
  /// Exception when trying to update candidacy that have one or more interviews
  /// </summary>
  UpdateCandidacyWithInterviews = 688,
  /// <summary>
  /// Exception when trying to update evaluation that have one or more offers sende, accepted or rejected
  /// </summary>
  UpdateEvaluationWithSendedOffers = 689,
  /// <summary>
  /// Exception when trying to update candidacy that have one or more offers sende, accepted or rejected
  /// </summary>
  UpdateCandidacyWithSendedOffers = 690,
  /// <summary>
  /// Exception when trying to update interview that have one or more offers sende, accepted or rejected
  /// </summary>
  UpdateInterviewWithSendedOffers = 691,
  /// <summary>
  /// Exception when having a negative quantity
  /// </summary>
  PositiveQuantityViolation = 692,
  /// <summary>
  /// Exception when settlement amount is zero
  /// </summary>
  SettlementAmountIsZero = 693,
  /// <summary>
  /// Exception when settlement amount is Greater Than Selected Commitment
  /// </summary>
  SettlementAmountIsGreaterThanSelectedCommitment = 694,
  /// <summary>
  ///  Exception when financial commitment allocated amount is Greater Than Remaining
  /// </summary>
  FinancialCommitmentAllocatedAmountGreaterThanRemaining = 695,
  /// <summary>
  /// when add same warehouse in item section
  /// </summary>
  WarehouseUnicity = 696,

  /// <summary>
  /// when quantity Min great them qunatity max in item section
  /// </summary>
  WarehouseQuantityMinMax = 697,

  /// <summary>
  /// This exception will be handled when RequiredColumn is set to null or empty
  /// </summary>
  ExcelRequiredColumn = 698,
  /// <summary>
  /// This exception will be handled when Excel Unique column is duplicated in DB
  /// </summary>
  ExcelUniqueColumnInDB = 699,
  /// <summary>
  /// This exception will be handled when Excel Unique column is duplicated in DB
  /// </summary>
  ExcelUniqueColumnInFile = 700,
  /// <summary>
  /// This exception will be handled when Excel Unique column is duplicated in DB
  /// </summary>
  ExcelInvalidEmailColumn = 701,
  /// <summary>
  /// This exception will be handled when deleting interview if it is requested to candidate
  /// </summary>
  DeleteInterviewViolation = 702,
  /// <summary>
  /// This exception will be handled when dependency dates violated
  /// </summary>
  DatesDependency = 703,
  /// <summary>
  /// The base salary must be unique per date
  /// </summary>
  BASESALARY_STARTDATE_MUST_BE_UNIQUE = 704,
  /// <summary>
  /// The contract bonus must be unique per date
  /// </summary>
  CONTRACTBONUS_STARTDATE_MUST_BE_UNIQUE = 705,
  /// <summary>
  /// Employee has at least two contracts with overlaping
  /// </summary>
  CONTRACT_OVERLAP = 706,
  /// <summary>
  /// Employee has more than one contract without end date
  /// </summary>
  MORE_THAN_ONE_CONTRACT_WITHOUT_ENDDATE = 707,

  /****************************************    SERVIVES CONTRACT EXCEPTION  ******************************************/
  /// <summary>
  /// Throw when one employee assignement to project assigment startdate is lower than project start date
  /// </summary>
  ASSIGNMENT_STARDATE_MUST_BE_BETWEEN_PROJECT_STARTDATE_AND_ENDDATE = 708,
  /// <summary>
  /// Throw when one employee have more than one assignment on the same date on the same project
  /// </summary>
  CANNOT_HAVE_MORE_THAN_ONE_ASIGNEMENT_WITH_SAME_DATE = 709,
  /// <summary>
  /// Throw when one employee assignement date is greater than unassignement date
  /// </summary>
  ASSIGNMENTDATE_MUST_BE_LOWER_THAN_UNASSIGNMENTDATE = 710,
  /// <summary>
  /// Throw when trying to modify an assignment already used in a CRA
  /// </summary>
  CANT_UPDATE_ASSIGNMENT_BECAUSE_USED_BY_TIMESHEETLINE = 711,
  /// <summary>
  /// Throw when trying to delete project associate with any timesheet
  /// </summary>
  CANT_DELETE_PROJECT_BECAUSE_USED_IN_TIMESHEET = 712,
  /// <summary>
  /// Throw when trying to add percentage of assignement lower than zero or greater than hundred
  /// </summary>
  PERCENTAGE_MUST_BE_BETWEEN_ZERO_AND_HENDRED = 713,
  /// <summary>
  /// Throw when trying to delete team associate with any employee
  /// </summary>
  CANT_DELETE_TEAM_BECAUSE_USED_IN_EMPLOYEES = 714,
  /// <summary>
  /// This exception will be handled when Employee Recursivity Violated
  /// </summary>
  EmployeeRecursivityViolation = 715,
  /// <summary>
  /// Maximum registration number is attained
  /// </summary>
  REGISTRATION_NUMBER_MAXIMAL_ACHIEVED = 716,
  /// <summary>
  /// This exception will be handled when PriceRequest contains two tiersPriceRequest with the same Supplier Id
  /// </summary>
  TiersPriceRequestUnicity = 717,

  /// <summary>
  /// This exception will be automaticly handled : SessionExpired
  /// </summary>
  SessionExpired = 718,

  /// <summary>
  /// This exception will be handled when supplier don't have contact
  /// </summary>
  ContactRequired = 719,
  IncompatibleEquivalenceGroup = 720,
  SendMailError = 721,
  GeneratePriceRequestError = 722,
  SendMailErrorTiersWithoutContactEmail = 723,
  ItemUnicity = 724,
  /// <summary>
  /// This exception will be handled when there is replacement loop in replacement item relation
  /// </summary>
  ItemReplacementLoop = 725,
  /// <summary>
  /// This exception will be handled when the candidacy preselected has an interview planified
  /// </summary>
  CandidacyUnPreselectedViolation = 726,
  /// <summary>
  /// This exception will be handled when the user wants to update a document request when he is not allowed to do so.
  /// </summary>
  DocumentRequestUpdateViolation = 727,

  ValidationOfDocumentWithStockReservation = 728,
  /// <summary>
  /// This exception will be handled when the user wants to validate a percentage assignment with employee.
  /// </summary>
  VALIDATION_OF_PERCENTAGE_ASSIGNMENT_WITH_EMPLOYEE = 729,
  /// <summary>
  /// This exception will be handled when the user wants to control a percentage assignment is not null.
  /// </summary>
  CONTROL_OF_PERCENTAGE_ASSIGNMENT_IS_NOT_NULL = 730,
  /// <summary>
  /// This exception will be handled when the user wants to update an expense report when he is not allowed to do so.
  /// </summary>
  ExpenseReportUpdateViolation = 731,

  /// <summary>
  /// This exception will be handled when the candidacy preselected has an interview planified
  /// </summary>
  CandidacyAddExistingCandidate = 732,
  /// <summary>
  /// This exception will be handled when no candidacy preselected and we want to go to the next step
  /// </summary>
  PreselectionToNextStepViolation = 733,
  /// <summary>
  /// This exception will be generated when the old password is wrong
  /// </summary>
  CandidacyEmptyList = 734,
  /// <summary>
  /// This exception will be handled when the candidacy selected has an offer planified
  /// </summary>
  CandidacyUnselectedViolation = 735,
  /// <summary>
  /// This exception will be handled when no candidacy selected and we want to go to the next step
  /// </summary>
  SelectionToNextStepViolation = 736,
  /// <summary>
  /// This exception will be handled when no interview to evaluate and we want to go to the next step
  /// </summary>
  InterviewToNextStepViolation = 737,
  /// <summary>
  /// This exception will be handled when trying to update any step of closed recruitment
  /// </summary>
  UpdateClosedRecruitmentViolation = 738,
  /// <summary>
  /// This exception will be handled when the candidacy already has an offer not which state is draf, sended or accepted
  /// and we want to add a new offer
  /// </summary>
  AddOfferViolation = 739,
  /// <summary>
  /// This exception will be handled when the candidacy already has an offer not which state is draf, sended or accepted
  /// and we want to add a new offer
  /// </summary>
  UpdateOfferViolation = 740,
  /// <summary>
  /// This exception will be handled when no candidacy state is less than hirring and we want to go to the next step
  /// </summary>
  OfferToNextStepViolation = 741,
  /// <summary>
  /// This exception will be handled when the candidacy preselected has an interview planified
  /// </summary>
  AddExistingCandidate = 742,
  /// <summary>
  /// This exception will be handled when trying to done recruitment without closing all previous steps
  /// </summary>
  DoneRecruitmentViolation = 743,
  /// <summary>
  /// This exception will be handled when the label of the interviewType is not unique
  /// </summary>
  AddInterviewTypeException = 744,
  /// <summary>
  /// This exception will be handled when the startDate and the endDate don't belong in period
  /// </summary>
  PeriodNotFoundException = 745,
  /// <summary>
  /// This exception will be handled when the offer state is not draft
  /// </summary>
  OfferDelteViolation = 746,
  /// <summary>
  /// This exception will be handled when the offer state is not draft
  /// </summary>
  OfferAcceptViolation = 747,
  /// <summary>
  /// This exception will be handled when the offer  state is not draft
  /// </summary>
  OfferRejectViolation = 748,
  /// <summary>
  /// Unicity of Email user
  /// </summary>
  UserEmailUnicity = 749,
  /// <summary>
  /// This exception will be handled when the user wants to delete a document request when he is not allowed to do so.
  /// </summary>
  DocumentRequestDeleteViolation = 750,
  /// <summary>
  /// This exception will be handled when the user wants to delete an expense report when he is not allowed to do so.
  /// </summary>
  ExpenseReportDeleteViolation = 751,
  /// <summary>
  /// This exception will be handled when the user wants to delete an associated BS line.
  /// </summary>
  BSDeleteOrEditLineViolation = 752,
  /// <summary>
  /// This exception will be handled when moving t next step while evaluation list is empty
  /// </summary>
  EmptyEvaluationListViolation = 753,
  /// <summary>
  /// This exception will be handled when adding an existing inventory document
  /// </summary>
  AddExistingInventory = 754,
  /// <summary>
  /// This exception will be handled when adding an existing inventory document
  /// </summary>
  AddExistingRoleCode = 755,
  /// <summary>
  /// This exception will be handled when adding an existing inventory document
  /// </summary>
  UpdateNotExistingRoleCode = 756,
  /// <summary>
  /// This exception will be handled when trying to update not existing inventory document
  /// </summary>
  AddNotExistingInventory = 757,
  /// <summary>
  /// This exception will be handled when adding an existing claim document
  /// </summary>
  AddExistingClaim = 758,
  /// <summary>
  /// This exception will be handled when trying to update not existing claim document
  /// </summary>
  AddNotExistingClaim = 759,
  /// <summary>
  /// This exception will be handled when trying to update not existing claim document
  /// </summary>
  UpdateNotExistingClaim = 760,
  /// <summary>
  /// This exception will be handled when Asset Exist
  AddExistingClaimTiersAsset = 761,
  /// <summary>
  /// This exception will be handled when BE Exist
  /// </summary>
  AddExistingClaimTiersMovementIn = 762,
  /// <summary>
  /// This exception will be handled when BS Exist
  /// </summary>
  AddExistingClaimTiersMovementOut = 763,
  /// <summary>
  /// This exception will be handled when the candidacy preselected has an interview planified
  /// </summary>
  AddExistingClaimDocumentMovement = 764,
  /// <summary>
  /// This exception will be handled when trying to update not existing claim tiers asset document
  /// </summary>
  AddNotExistingClaimTiersAsset = 765,
  /// <summary>
  /// This exception will be handled when the candidacy preselected has an interview planified
  /// </summary>
  AddExistingClaimStockMovement = 766,
  /// <summary>
  /// This exception will be handled when trying to update not existing claim stock movement document
  /// </summary>
  AddNotExistingClaimStockMovement = 767,
  /// <summary>
  /// This exception will be handled when trying to update not existing claim stock movement document
  /// </summary>
  UpdateNotExistingStockMovement = 768,
  /// <summary>
  /// This exception will be handled when trying to update not existing claim stock movement document
  /// </summary>
  UpdateNotExistingItemWarehouse = 769,
  /// <summary>
  /// This exception will be handled when the candidacy preselected has an interview planified
  /// </summary>
  AddExistingClaimType = 770,
  /// <summary>
  /// This exception will be handled when the candidacy preselected has an interview planified
  /// </summary>
  AddExistingClaimStatus = 771,
  /// <summary>
  /// This exception will be handled when the the item is not filed in the inventory stock document
  /// </summary>
  ItemNotFiled = 772,
  /// <summary>
  /// This exception will be handled when the candidacy preselected has an interview planified
  /// </summary>
  AddExistingInventoryLine = 773,
  /// <summary>
  /// This exception will be handled when the candidacy preselected has an interview planified
  /// </summary>
  AddNotExistingInventoryLine = 774,
  /// <summary>
  /// This exception will be handled when there is identical lines in documentLine
  /// </summary>
  ExistPendingInventoryDocument = 775,

  /// <summary>
  /// This exception will be handled when Price is not Valid
  /// </summary>
  ValueDiscountePrices = 776,

  /// <summary>
  /// This exception will be handled when there is identical lines in documentLine
  /// </summary>
  ItemAlreadyExistInDocument = 777,
  /// <summary>
  /// This exception will be handled when is other employee add objective for the collaborator
  /// </summary>
  AddReviewException = 778,
  /// <summary>
  /// Unicity of code
  /// </summary>
  CodeUnicity = 779,
  /// <summary>
  /// This exception will be handled when the unauthorize employee try to edit the review
  /// </summary>
  ObjectiveException = 780,
  /// <summary>
  /// This exception will be handled when the unauthorize employee try to edit the review
  /// </summary>
  ReviewEditException = 781,
  /// <summary>
  /// This exception will be handled when the user try to delete a review array wich is not the author or the super hierarchique
  /// </summary>
  DeleteReviewArrayException = 782,
  /// <summary>
  /// This exception will be handled when the user have no employee Id
  /// </summary>
  RequiredEmployeeUserViolation = 783,
  /// <summary>
  /// This exception will be handled when the user add a duplicate skills for a review
  /// </summary>
  DuplicateSkillsException = 784,
  /// <summary>
  /// This exception will be handled when the user add a duplicate formation for a review
  /// </summary>
  DuplicateFormationException = 785,
  /// <summary>
  /// This exception will be handled when the user add a duplicate formation for a review
  /// </summary>
  ReviewQuestionException = 786,
  /// <summary>
  /// This exception will be handled when the user delete the employee old skills
  /// </summary>
  ReviewSkillsDeleteException = 787,
  /// <summary>
  /// This exception will be handled when the user add the job wich designation is allready exist
  /// </summary>
  JobAddException = 788,
  /// <summary>
  /// This exception will be handled when the user add the job wich designation is allready exist
  /// </summary>
  NullJobAddException = 789,
  /// <summary>
  /// This exception will be handled when the job id is equal to the idUpperJob
  /// </summary>
  JobUpdateException = 790,
  /// <summary>
  /// This exception will be handled when hours in same intervall are not contiguous
  /// </summary>
  ContiguousHoursException = 791,
  /// <summary>
  /// This exception will be handled when the startTime is greater than a endTime of hour
  /// </summary>
  HoursTimeException = 792,
  /// <summary>
  /// This exception will be handled when the user add the period with no hours
  /// </summary>
  AddPeriodWithNoHoursException = 793,
  /// <summary>
  /// This exception will be handled when the user should not be able to delete this period
  /// </summary>
  CANT_DELETE_PERIOD = 794,
  /// <summary>
  /// This exception will be handled when the user should not be able to delete this period
  /// </summary>
  CANT_UPDATE_PERIOD_STARTDATE = 795,
  /// <summary>
  /// This exception will be handled when the extend of period startdate is wrong
  /// </summary>
  CANT_UPDATE_PERIOD_ENDDATE = 796,
  /// <summary>
  /// There is a billed timesheet referenced by this holiday
  /// </summary>
  CANNOT_UPDATE_BECAUSE_INVOICED_TIMEHSEET_EXIST = 797,
  /// <summary>
  /// This exception will be handled when the extend of period enddate is wrong
  /// </summary>
  DuplicateDayOffException = 798,
  /// <summary>
  /// This exception will be handled when the period to add is not contiguous with the previous one
  /// </summary>
  PeriodNotContiguousException = 799,
  /// <summary>
  /// This exception will be handled when the startDate of employee contrat is less than the HiringDate of the employee
  /// </summary>
  AddContractException = 800,
  /// <summary>
  /// This exception will be handled when the startDate of baseSalary is less than the startDate of the contract
  /// </summary>
  AddBaseSalaryException = 801,
  /// <summary>
  /// This exception will be handled when the startDate of contractBonus is less than the startDate of the contract
  /// </summary>
  AddContractBonusException = 802,
  /// <summary>
  /// This exception will be handled when the expense report has no atttachment file
  /// </summary>
  ExpenseReportFileNotFoundException = 803,
  /// <summary>
  /// This exception will be handled when the period to update is not contiguous with the previous one
  /// </summary>
  PeriodUpdateStartDateContiguousException = 804,
  /// <summary>
  /// This exception will be handled when the period to update is not contiguous with the next one
  /// </summary>
  PeriodUpdateEndDateContiguousException = 805,
  /// <summary>
  /// This exception will be handled when adding or modifying CIN that already exists
  /// </summary>
  SameCinNumber = 806,
  /// <summary>
  /// This exception will be handled when adding or modifying CNSS that already exists
  /// </summary>
  SameCnssNumber = 807,
  /// <summary>
  /// This exception will be handled when adding futur objectif with date inferior to today's date
  /// </summary>
  InvalidObjectifExpectedDate = 808,
  /// <summary>
  /// This exception will be handled when adding futur formation with date inferior to today's date
  /// </summary>
  InvalidFormationExpectedDate = 809,
  /// <summary>
  /// This exception will be handled when adding employee's idendity papers that already exists
  /// </summary>
  EmployeeIdendityPapersViolation = 810,
  /// <summary>
  /// This exception will be handled when adding or modifying Candidate CIN that already exists
  /// </summary>
  SameCandidateCinNumber = 811,
  /// <summary>
  /// This exception will be handled when adding or modifying email that already exists in employee list
  /// </summary>
  CandidateEmailIdAnEmployeeEmail = 812,
  /// <summary>
  /// This exception will be handled when adding or modifying email that already exists in candidate list
  /// </summary>
  DuplicatedCandidateEmailException = 813,
  /// <summary>
  /// This exception will be handled when adding or modifying Employee Rib that already exists in employee list
  /// </summary>
  DuplicatedEmployeeRibException = 814,
  /// <summary>
  /// This exception will be handled when the bonus validity start date is duplicate
  /// </summary>
  DuplicatedBonusValidityException = 815,
  /// <summary>
  /// Unicity of Email user
  /// </summary>
  UserEmployeeUnicity = 816,
  /// <summary>
  /// This exception will be handled when hours not found in period exception
  /// </summary>
  HoursNotFoundInPeriodException = 817,
  /// <summary>
  /// This exception will be handled whe the employee is the manager of his manager
  /// </summary>
  ReflexiveTeamManagerException = 818,
  /// <summary>
  /// This exception will be handled whe the employee is the the superior hierarchic of his manager
  /// </summary>
  AddSuperiorToCollaboratorTeamException = 819,
  /// <summary>
  /// This exception will be handled when the employee add two training request for the same training
  /// </summary>
  AddTrainingRequestException = 820,
  /// <summary>
  /// This exception will be handled when the employee update the training request which state is not wainting
  /// </summary>
  UpdateTrainingRequestException = 821,
  /// <summary>
  /// This exception will be handled when the mobility request has same current and destination office
  /// </summary>
  MobilityRequestSameOfficeViolation = 822,
  /// <summary>
  /// This exception will be handled when the training seance starthours is greater or equals the endhours
  /// </summary>
  AddTrainingSeanceHoursException = 823,
  /// <summary>
  /// This exception will be handled when the training seance starthours is greater or equals the endhours
  /// </summary>
  AddTrainingSeanceWeeklyHoursException = 824,
  /// <summary>
  /// This exception will be handled when the hours of the seances with the same date are lap
  /// </summary>
  AddTrainingSeanceHoursLapsException = 825,
  /// <summary>
  /// This exception will be handled when the hours of only planified seances weekly with the same date are overlapped
  /// </summary>
  AddTrainingSeanceHoursWeeklyLapsException = 826,
  /// <summary>
  /// This exception will be handled when the session has an end date and doesn't have a start date
  /// </summary>
  SessionWithEndDateAndWithoutStartDate = 827,
  /// <summary>
  /// This exception will be handled when the mobility request is modified or added by not allowed users
  /// </summary>
  PreventMobilityRequestAddModificationToNotAllowedUsers = 828,
  /// <summary>
  /// This exception will be handled when the mobility request is accepted or refused by users other then offices managers
  /// </summary>
  OnlyOfficeManagerAccepteOrRefuseTheMobilityRequest = 829,
  /// <summary>
  /// This exception will be handled when the training seance date is greater than the training session start date or less than its end date
  /// </summary>
  AddTrainingSeanceDateLapsException = 830,
  /// This exception will be handled when adding an existing claim document
  /// <summary>
  /// This exception will be handled when the period to add or to update is not contiguous with the previous one
  /// </summary>
  /// <summary>
  /// This exception will be handled when the training seance date is less than the training session start date
  /// </summary>
  AddTrainingSeanceDateLapsWithoutEndDateOfSessionException = 831,
  /// <summary>
  /// <summary>
  /// This exception will be handled when the training seance date is greater than the training session end date
  /// </summary>
  AddTrainingSeanceDateLapsWithoutStartDateOfSessionException = 832,
  /// <summary>
  /// This exception will be handled when the training session start date or end date already exists in another session
  /// </summary>
  AddTrainingSessionPeriodException = 833,

  /// <summary>
  /// This exception will be handled when the period to add or to update is not contiguous with the previous one
  /// </summary>
  No_Lines_To_Be_ADDED = 834,
  /// <summary>
  /// This exception will be handled when we try to update validated document
  /// </summary>
  AlreadyValidatedDocument = 835,

  /// <summary>
  /// This exception will be handled when the Document AlReady Invoiced
  /// </summary>
  DocumentAlReadyInvoiced = 836,
  InvalidQuantity = 837,
  /// <summary>
  /// This exception will be handled when we are trying to modify or add a document line to a validated bl
  /// </summary>
  ExistingSalesInvoiceFromValidatedDocument = 838,
  /// <summary>
  /// This exception will be handled when we are trying to modify or add a document line to a validated bl
  /// </summary>
  NotAvailableClaimStockMovementQuantity = 839,
  /// <summary>
  /// This exception will be handled when we are trying to modify or add a document line to a validated bl
  /// </summary>
  NotSameClaimQuantity = 840,

  /// <summary>
  /// This exception will be handled when the release of the quantity of a product is impossible
  /// </summary>
  LiberationQteException = 841,
  /// <summary>
  /// This exception will be handled when there is a problem to communicate with ecommerce
  /// </summary>
  EcommerceException = 842,
  /// <summary>
  /// This exception will be handled when there is an ecommerce request in progress
  /// </summary>
  EcommerceInProgressException = 843,

  /// Successfull Status Without Success Notification
  /// </summary>
  SuccessfullWithoutSuccessNotification = 220,

  SendMailErrorDocumentWithoutContact = 845,

  /// <summary>
  /// This exception will be handled when the training center has opening time less than closing time
  /// </summary>
  TrainingCenterOpeningTimeLessThanClosingTimeException = 846,
  /// <summary>
  /// This exception will be handled when there are duplicated training center names
  /// </summary>
  DuplicatedTrainingCenterNameException = 847,
  /// <summary>
  /// This exception will be handled when there are no external trainer for external training
  /// </summary>
  MissingExternalTrainerException = 848,
  /// <summary>
  /// This exception will be handled when the adding user to company while it exists already in master base
  /// </summary>
  userExitsInMasterBase = 849,
  /// <summary>
  /// This exception will be handled when the deleting user from company while its  already deleted
  /// </summary>
  userAlreadydeletedFromSlaveBase = 850,
  /// <summary>
  /// This exception will be handled when the two passwords are not coform
  /// </summary>
  PasswordConfirmityError = 851,
  /// <summary>
  /// This exception will be handled when the new password is the same as the old one
  /// </summary>
  SameOldPassword = 852,
  /// <summary>
  /// This exception will be handled when the operation is failed
  /// </summary>
  FailureOperation = 853,
  /// <summary>
  /// This exception will be handled when modifying the Email of user
  /// </summary>
  userEmailModificationProhibited = 854,
  /// <summary>
  /// This exception will be handled when modifying the Email of user
  /// </summary>
  ContractDeleteCheck = 855,
  /// <summary>
  /// This exception will be handled when selecting same level with hierarchy and without hierarchy
  /// </summary>
  PrivilegeSameLevel = 856,
  /// <summary>
  /// This exception will be handled when selecting superior level with hierarchy and without hierarchy
  /// </summary>
  PrivilegSuperiorLevel = 857,
  /// This exception will be handled when recruitment request status is already refused or canceled
  /// </summary>
  recruitmentUpdateViolation = 858,
  /// <summary>
  /// this exception will occure when an interview is not associated to a review or a candidacy
  /// </summary>
  NotReviewOrCandidacy = 859,

  /// <summary>
  /// This exception will be handled when selecting superior level with hierarchy and without hierarchy
  /// </summary>
  EmployeeExitUpdateViolation = 860,
  /// <summary>
  /// this exception will be handled when deleting employee who has status accepted
  /// </summary>
  ExitEmployeeDeleteCheck = 861,
  /// <summary>
  /// This exception will be handled when contract benefit in kind start date is less than contract start date
  /// </summary>
  ContractBenefitInKindStartDateException = 862,
  /// <summary>
  /// This exception will be handled when contract benefit in kind expiration date is greater than contract end date
  /// </summary>
  ContractBenefitInKindExpirationDateException = 863,
  /// <summary>
  /// This exception will be handled when contract benefit in kind start date is greater than benefit in kind expiration date
  /// </summary>
  ContractBenefitInKindStartDateGreaterThanExpirationDateException = 864,
  /// <summary>
  /// This exception will be handleld when selected employee has zero payslips in selected period
  /// </summary>
  EmployeeWithNoPayslipException = 865,
  /// <summary>
  /// This exception will be handled when offer benefit in kind start date is less than offer start date
  /// </summary>
  OfferBenefitInKindStartDateException = 866,
  /// <summary>
  /// This exception will be handled when offer benefit in kind expiration date is greater than offer end date
  /// </summary>
  OfferBenefitInKindExpirationDateException = 867,
  /// <summary>
  /// This exception will be handled when offer benefit in kind start date is greater than benefit in kind expiration date
  /// </summary>
  OfferBenefitInKindStartDateGreaterThanExpirationDateException = 868,
  /// <summary>
  /// This exception will be handled when job to update is in hierarchy level of chosen upper job
  /// </summary>
  JobHierarchyLevelViolation = 869,
  /// <summary>
  /// This exception will be handled when employee to update is equal to the upper employee
  /// </summary>
  EmployeeEqualToUpperEmployeeException = 870,
  /// <summary>
  /// This exception will be handled when there is no cnss declaration details generated
  /// </summary>
  CnssDeclarationDetailsException = 871,

  LineAddedsuccessfully = 207,
  /// <summary>
  /// This exception will be handled when the settelement date is invalid
  /// </summary>
  INVALID_SETTELMENT_DATE = 873,

  /// <summary>
  /// the connected user must be unique B2B
  /// </summary>
  USER_ALREADY_CONNECTED = 875,

  /// <summary>
  /// the connected user must be unique B2B
  /// </summary>
  NO_PRINTER_INSTALLED = 876,
  /// <summary>
  /// throw when item list is empty
  /// </summary>
  EMPTY_LIST = 877,
  /// <summary>
  /// throw when item has no associated invoice in draft state
  /// </summary>
  VALID_ASSOCIATED_INVOICE = 878,
  CantDeleteReservedDocument = 879,
  INVALID_SATATUS_DOCUMENT = 880,
  ITEM_NOT_EXIST_IN_WARHOUSE = 881,
  UPDATE_PURCHASE_DELIVERY_QUANTITY = 882,
  DOCUMENT_IS_IMPORTED = 883,
  DELETED_DOCUMENT_LINE = 884,
  UPDATED_QTY_DOCUMENT_LINE = 885,
  /// <summary>
  /// This exception will be handled when we try to delete reserved document line without the appropriate rights
  /// </summary>
  NO_RIGHTS_TO_DELETE_RESERVED_LINE = 886,
  /// <summary>
  /// This exception will be handled when we try to delete document line without the appropriate rights
  /// </summary>
  NO_RIGHTS_TO_DELETE_LINE = 887,

  /// <summary>
  /// This exception will be handled when we try to delete document with negotiaion
  /// </summary>
  NEGOTIATION_ALREADY_ADDED = 888,

  /// <summary>
  /// This exception will be handled when we try to delete provision line
  /// </summary>
  LINE_ALREAD_DELETED = 889,

  /// <summary>
  /// This exception will be handled when we try to delete central warehouse from item modification
  /// </summary>
  CENTRAL_CANNOT_BE_DELETED = 890,
  /// <summary>
  /// This exception will be handled when we try to import Bs after importing Bl in salesInvoice
  /// </summary>
  CANNOT_IMPORT_BS_BL = 891,
  /// <summary>
  /// This exception will be handled when we try to import an imported document
  /// </summary>
  IMPORTED_DOCUMENT = 892,
  /// <summary>
  /// This exception will be handled when deleting warehouse when it's used
  /// </summary>
  CANNOT_DELETE_WAREHOUSE = 893,
  /// <summary>
  /// This exception will be handled when 2 wrahouses have the same code
  /// </summary>
  WAREHOUSE_NAME_MUST_BE_UNIQUE = 894,
  /// <summary>
  /// This exception will be handled when the warehouse is not in the central warehouse
  /// </summary>
  WAREHOUSE_MUST_HAVE_PARENT = 895,
  /// <summary>
  /// This exception will be handled the selected employee is chosen as interviewer to his own interview
  /// </summary>
  EmployeeToInterviewMustNotBeInterviewer = 896,
  /// <summary>
  /// This exception will be handled when updating expired contract
  /// </summary>
  ContractUpdateCheck = 897,
  /// <summary>
  /// Validation Import File
  /// </summary>
  ImportFile = 898,
  /// <summary>
  // validate assignment date employee with start date project
  /// </summary>
  EMPLOYEE_PROJECT_VALIDITY_ASSIGNMENT_DATE = 899,
  SetSupplierToItem = 899,
  /// <summary>
  /// This exception will be handled when the employee not have a role
  /// </summary>
  EMPLOYEE_DID_NOT_HAVE_A_ROLE = 900,
  /// <summary>
  /// This exception will be handled when the leave has expired for this month
  /// </summary>
  LEAVE_HAS_EXPIRED_FOR_THE_MONTH = 901,
  NomenclatureReferenceUnique = 902,
  NomenclatureProductUnique = 903,
  NomenclatureProductNotExist = 904,
  NomenclatureCheckProductExistInSubProduct = 905,
  OldPasswordErrors = 906,
  MachineDescriptionUnique = 907,
  GammeUnique = 908,
  MachineUsedInOperation = 910,
  AreaNotEmpty = 911,
  NomenclatureUsedInFabricationArrangement = 912,
  GammeUsedInFabricationArrangement = 913,
  NomenclatureUsedInOtherNomenclature = 919,
  ADD_EXISTING_CLAIM_DOCUMENT_MOVEMENT = 920,
  CandidateEmailIsAnEmployeeEmail = 921,
  /// <summary>
  /// Document line solde error code
  /// </summary>
  LIGNE_DEJA_SOLDE = 922,
  /// <summary>
  /// No lines added to document error code
  /// </summary>
  NO_LINES_ARE_ADDED = 923,

  INVALID_START_AND_END_DATE = 924,
  /// <summary>
  /// Throw when attemp to update deleted document line
  /// </summary>
  DELETED_DOCUMENTS_LINE = 925,
  /// Throw when attemp to add or update expense with duplicated code
  /// </summary>
  DuplicatedExpenseCode = 926,
  /// <summary>
  /// code already exist
  /// </summary>
  CodeAlreadyExist = 927,
  /// <summary>
  /// This exception will be handled when Jasper server is unreachable
  /// </summary>
  UnreachableJasperServer = 928,
  /// <summary>
  /// This exception will be handled when there are missing data
  /// </summary>
  MissingData = 929,
  /// <summary>
  /// This exception will be handled when deleting an already deleted entity
  /// </summary>
  AlreadyDeletedEntity = 930,
  /// <summary>
  /// success importation of document
  /// </summary>
  DocumentImportedSuccessfully = 931,
  /// <summary>
  /// This exception will be handled when deleting an Item warehouse with quantity
  /// </summary>
  ItemAlreadyExistsIwarehouse = 932,
  /// <summary>
  /// Unicity Label
  /// </summary>
  LabelUnicity = 933,
  /// <summary>
  /// This exception will be handled when acquisition date is invalid
  /// </summary>
  AcquisitionDateIsInvalid = 934,
  /// <summary>
  ///  Exception when trying to update category that have one or more actives
  /// </summary>
  UpdateCategoryWithActives = 935,

  // #region Auto plage de code: 1000-3000

  InvalidLicense = 1000,
  LicenseMaximumUsersNumberViolation = 1001,

  /// <summary>
  /// no document selected for mass validation
  /// </summary>
  NoDocumentSelectedForMassValidation = 1002,
  /// <summary>
  /// This exception will be handled when Deleted Or Unreachable Entity
  /// </summary>
  DeletedOrUnreachableEntity = 1003,
  /// <summary>
  /// This exception will be handled when currency code isn't equal to three
  /// </summary>
  CurrencyCodeNotVerfied = 1004,
  /// <summary>
  /// This exception will be handled when Chosen Period Overlaps With Another
  /// </summary>
  ChosenPeriodOverlapsWithAnother = 1005,
  /// This exception will be handled when Chosen item exist in provisonal inventory
  /// </summary>
  ChosenItemExistInProvisionalInventory = 1006,
  /// <summary>
  /// This exception will be handled when deleting document have item exist in provisonal inventory
  /// </summary>
  DocumentHaveItemExistInProvisionalInventory = 1007,
  /// <summary>
  /// This exception will be handled when delet multiple lines that contains item exist in provisonal inventory
  /// </summary>
  SelectedLinesContainsItemExistInProvisionalInventory = 1008,
  /// <summary>
  /// This exception will be handled when validate invoice contains item exist in provisonal inventory
  /// </summary>
  SomeItemExistInProvisionalInventory = 1009,
  /// <summary>
  /// This exception will be handled when already affected element
  /// </summary>
  AlreadyAffectedElement = 2000,
  /// <summary>
  /// Affection success code
  /// </summary>
  AffectedSuccessfully = 2001,
  /// <summary>
  /// Affection success code
  /// </summary>
  UnaffectedSuccessfully = 2002,
  /// <summary>
  /// This exception will be handled when OverlapPriceDetail in the same price
  /// </summary>
  OverlapPriceDetail = 2003,
  /// <summary>
  /// This exception will be handled when add price without currency
  /// </summary>
  RequiredCurrency = 2004,
  /// <summary>
  /// This exception will be handled when adding item with existing code
  /// </summary>
  ItemAlreadyExist = 2005,
  /// <summary>
  /// This exception will be handled when the  collection of vehicule brand , model and sub model  is already exist
  /// </summary>
  CollectionBrandModelSubModelAlreadyExist = 2006,
  /// <summary>
  /// This exception will be handled when generating a new doc without validate the old provisional invoices
  /// </summary>
  ValidatePreviousInvoiceForTermInvoicing = 2007,
  /// <summary>
  /// This exception will be handled when the server Btob has unreachable
  /// </summary>
  BtoBServerIsUnreachable = 2013,
  /// <summary>
  /// This exception will be handled when deleted Settlement mode
  /// </summary>
  DeletedSettlementMode = 2014,
  /// <summary>
  /// This exception will be handled when cancel order atteched to payed deposit invoice
  /// </summary>
  DepositInvoiceIsPayed = 2015,
  /// <summary>
  /// This exception will be handled when trying to change the amount of reserved sales delivery
  /// </summary>
  DeliveryContainsReservedLines = 2016,
  /// <summary>
  /// This exception will be handled when trying to change the amount of sales delivery that contains product without unit price
  /// </summary>
  DeliveryContainsItemsWithoutPrice = 2017,
  /// <summary>
  /// This exception will be handled when trying to generate deposit invoice from order with sales delivery
  /// </summary>
  OrderContainsSalesDelivery = 2018,
  /// <summary>
  /// This exception will be handled when trying to generate invoice invoice from order with amount that is less than the advance amount 
  /// </summary>
  OrderAmountLessThanAdvance = 2019,
  /// This exception will be handled when generate inventory contains items exist il provisonal stock movement
  /// </summary>
  ItemsExistInProvisonalStockMovement = 1010,
  /// <summary>
  /// This exception will be handled when the generated inventory don't contains lines
  /// </summary>
  NoRowForThisInventory = 1011,
  /// <summary>
  /// This exception will be handled when validate inventory that is deleted
  /// </summary>
  ThisInventoryIsDeleted = 1012,
  /// <summary>
  /// This exception will be handled when validate inventory that is already validated
  /// </summary>
  ThisInventoryIsValidated = 1013,
  /// <summary>
  /// This exception will be handled when validate inventory contains different qty
  /// </summary>
  CheckItemsQty = 1014,
  /// <summary>
  /// This exception will be handled when the selected item don't have a measure unit
  /// </summary>
  ItemWithoutMeasureUnit = 1015,
  /// <summary>
  /// This exception will be handled when deleting a valid intentory
  /// </summary>
  CantDeleteValidInventory = 1017,
  /// <summary>
  /// This exception will be handled when update deleted intentory
  /// <summary>
  /// This exception will be handled when qty format is invalide
  /// </summary>
  WrongQty = 1016,
  /// <summary>
  /// <summary>
  /// This exception will be handled when update deleted intentory
  /// </summary>
  CantUpdateDeletedInventory = 1018,
  /// <summary>
  /// This exception will be handled when update a valid intentory
  /// </summary>
  CantUpdateValidInventory = 1019,
  /// <summary>
  /// This exception will be handled when generated list contains items without measure unit
  /// </summary>
  ThereAreItemsWithoutMeasureUnit = 1020,
  /// <summary>
  /// this exception will be handled when attemp to delete used user
  /// </summary>
  DeletionUsedUserFailed = 1021,
  /// <summary>
  /// this exception will be handled when updating a used prices
  /// </summary>
  CantUpdateUsedPrice = 1022,
  /// <summary>
  /// enable user success code
  /// </summary>
  EnableUserSuccessfull = 1023,
  /// <summary>
  /// disable user success code
  /// </summary>
  DisableUserSuccessfull = 1024,
  /// <summary>
  /// disable massif users success code
  /// </summary>
  DisableMassifUsersSuccessfull = 1025,
  /// <summary>
  /// disable massif users success code
  /// </summary>
  EnableMassifUsersSuccessfull = 1026,
  /// <summary>
  /// send mail success code
  /// </summary>
  SendMailSuccessfull = 1027,
  /// <summary>
  /// send sms success code
  /// </summary>
  SendSMSSuccessfull = 1037,
  /// <summary>
  /// send sms error code
  /// </summary>
  SMSServerError = 1040,
  /// this exception will be handled when the article is already exist in the document
  /// </summary>
  ArticleAlreadyExistInDocument = 1023,
  /// <summary>
  /// This exception will be handled when generate delivery form that already invoiced
  /// </summary>
  AllDeleveryInvoiced = 1024,
  /// <summary>
  /// This exception will be handled when expense report has no type
  /// </summary>
  MissingExpenseReportType = 1025,
  /// <summary>
  /// This exception will be handled when updating used product type
  /// </summary>
  UpdateUsedProductType = 1026,
  /// <summary>
  /// This exception will be handled when update or add provisioning with wrong cmd
  /// </summary>
  CmdInvalid = 1027,
  /// <summary>
  /// This exception will be handled when update or add item with Fodec Only
  /// </summary>
  ItemWithFodecOnly = 1028,
  /// <summary>
  /// This exception will be handled when update or add item with many tax amount type
  /// </summary>
  ItemWithAmountTaxOnly = 1029,
  /// <summary>
  /// This exception will be handled when shelf and storage already exists in warehouse
  /// </summary>
  ShelfAndStorageAlreadyExists = 1030,
  /// <summary>
  /// This exception will be handled when calculable tax not in tax group
  /// </summary>
  ErrorGroupTax = 1031,
  /// <summary>
  /// This exception will be handled when the user tries to change stock managed field in product type
  /// </summary>
  CannotChangeStockManagedFromProductType = 1032,
  /// <summary>
  /// This exception will be handled when the warehouse name already exists under same warehouse parent
  /// </summary>
  WarehouseMustBeUniqueByWarehouseParent = 1033,
  /// <summary>
  /// This exception will be handled when add or update documentLine with item that don't have tax
  /// </summary>
  ItemWithoutTaxError = 1034,
  /// <summary>
  /// This exception will be handled when add or update groupeTax with duplicate tax
  /// </summary>
  duplicateTaxe = 1035,
  /// <summary>
  /// This exception will be handled when oem item already exists
  /// </summary>
  ExistingOemItemPerBrand = 1036,
  /// <summary>
  /// This exception will be handled when no data to return
  /// </summary>
  NoDataToReturn = 1038,
  /// <summary>
  /// This exception will be handled when attemp to delete tiers with dependencies
  /// </summary>
  DeleteTiersError = 1039,
  // #endregion
  // #region ESN plage de code: 3001-5000

  /// <summary>
  /// This exception will be handled when adding required base salary with start date different then the contract's one
  /// </summary>
  requiredBaseSalaryStartdate = 3001,
  /// <summary>
  /// This exception will be handled when the contractType MinNoticePeriod is bigger than  MaxNoticePeriod
  /// </summary>
  ContractTypeMinMaxViolation = 3002,
  /// <summary>
  /// this exception will be handled when adding a new contract while there is already a contract with undefined EndDate
  /// </summary>
  ContractWithUndefinedEndDateExists = 3003,
  /// <summary>
  /// this exception will be handled when adding base salry with 0 value
  /// </summary>
  BaseSalaryValue = 3004,
  /// <summary>
  /// this exception will be handled when adding contract with end date less or equal to start date
  /// </summary>
  ContractDatesDependency = 3005,
  /// <summary>
  /// this exception will be handled when an interviewer has interview at the same hour
  /// </summary>
  InterviewerOccupied = 3006,
  /// <summary>
  /// this exception will be handled when an employee has interview at the same hour
  /// </summary>
  EmployeeOccupied = 3007,
  /// <summary>
  /// this exception will be handled when deletion fails
  /// </summary>
  DeletionFailed = 3008,

  /// <summary>
  /// This exception will be handled when adding an employee with a matricule different from the number
  /// </summary>
  MatriculeMustBeANumber = 3009,
  /// <summary>
  /// This exception will be handled when the interview supervisor isn't in the list of required interviewers
  /// </summary>
  SupervisorNotInRequiredInterviewers = 3010,
  /// <summary>
  /// This exception will be handled when the connected user can't update other users passwords
  /// </summary>
  CannotChangePassword = 3011,

  /// <summary>
  /// This exception is handled when employee has not any contract so any HiringDate
  /// </summary>
  EmployeeHasAnyContract = 3012,

  /// <summary>
  /// This exception is handled when employee exit release date to the same employee already exists
  /// </summary>
  ExisitingEmployeeExitReleaseDate = 3013,
  VariableStartDateValidity = 3014,
  /// <summary>
  /// this exception will be handled when adding another accepted Offer to the candidate
  /// </summary>
  CandidateAlreadyAcceptedInOtherOffer = 3015,
  /// <summary>
  /// This exception will be handled when the number of worked days per month is exceeded
  /// </summary>
  NumberOfWorkedDaysExceeded = 3016,
  /// <summary>
  /// This exception will be handled when the number of worked days per month isn't reached
  /// </summary>
  NumberOfWorkedDaysNotReached = 3017,
  /// <summary>
  /// This exception will be handled when the maximum number of days for a leave type is exceeded
  /// </summary>
  LeaveTypeMaximumNumberOfDaysLimitException = 3018,
  /// <summary>
  /// This exception will be handled when the leave to add period is after the leave type expiration date
  /// </summary>
  LeaveTypeExpirationDateViolation = 3019,
  /// <summary>
  /// This exception will be handled when the contract type code isn't alphabetic
  /// </summary>
  ContractTypeCodeViolation = 3020,
  /// <summary>
  /// This exception will be handled when the average daily rate is lower than zero or greater than one billion
  /// </summary>
  AverageDailyRateException = 3021,
  /// <summary>
  /// This exception will be handled when the average daily rate of an employee is lower than zero or greater than one billion
  /// </summary>
  EmployeeAverageDailyRateException = 3022,
  /// <summary>
  /// This exception will be handled when there are duplicated annual review priorities
  /// </summary>
  DuplicatedAnnualReviewManagerPriority = 3023,
  /// <summary>
  /// This exception will be handled when there is an overlimit expense report amount
  /// </summary>
  ExpenseReportDetailLimit = 3024,
  /// <summary>
  /// This exception is handled when employee has not any payslip between his hiring date and physical exit date
  /// </summary>
  EmployeeHasAnyPayslip = 3025,
  /// <summary>
  /// This exception is handled when there is a file in expense report that doesn't have a specified extension
  /// </summary>
  ExpenseReportFileExtensionViolation = 3026,
  /// <summary>
  /// This exception is handled when there is duplicated a language in recruitment offer
  /// </summary>
  DuplicatedLanguageInRecuitmentOffer = 3027,
  /// <summary>
  /// This exception is handled when drupal connection has failed
  /// </summary>
  FailedDrupalConnection = 3028,
  /// <summary>
  /// Minimum registration number is reached
  /// </summary>
  RegistrationNumberMinimalAchieved = 3029,
  /// <summary>
  /// Registration number is invalid
  /// </summary>
  InvalidRegistrationNumber = 3030,
  /// <summary>
  /// When try to add contract line from excel with data equal to zero
  /// </summary>
  INVALID_DATA_INPUT_FROM_EXCEL_FILE = 3031,
  ///  This exception is handled when cin length is wrong
  /// </summary>
  InvalidCinLength = 3032,
  /// <summary>
  /// This exception will be handled when Excel Unique column is duplicated in DB
  /// </summary>
  EXCEL_INVALID_DATA_COLUMN = 3033,
  EXCEL_INVALID_SSN_COLUMN = 3034,
  EXCEL_INVALID_RIB_COLUMN = 3035,
  /// <summary>
  /// Employee did not have a contract FROM EXCEL
  /// </summary>
  EOMPLYEE_DID_NOT_HAVE_A_CONTRACT_FROM_EXCEL = 3036,
  /// <summary>
  /// This exception is handled when Matricules are not found
  /// </summary>
  NUMBERS_NOT_FOUND_FROM_DB = 3037,
  /// <summary>
  /// Employee has more than one contract without end date
  /// </summary>
  MORE_THAN_ONE_CONTRACT_WITHOUT_ENDDATE_WITH_PARAMS = 3038,
  /// <summary>
  /// Employee has at least two contracts with overlaping
  /// </summary>
  CONTRACT_OVERLAP_WITH_PARAMS = 3039,
  /// <summary>
  /// Interview start time exceeds end time
  /// </summary>
  InterviewStartTimeExceedsEndTime = 3040,
  /// <summary>
  /// This exception will be handled when there are more than one bonus in contratct or offer without end date
  /// </summary>
  MultipleContractOrOfferBonuesesWithoutEndDate = 3041,
  /// <summary>
  /// This exception will be handled when there is an overlap of the same bonus in contract of offer
  /// </summary>
  OverlapOfSameBonusInContractOrOffer = 3042,
  /// <summary>
  /// This exception will be handled when there is an overlap of the same bonus in contract of offer
  /// </summary>
  NumberOfCandidateExceeded = 3043,
  /// <summary>
  /// This exception will be handled when exit deposit date before hiring date
  /// </summary>
  ExitDepositDateBeforeHiringDate = 3044,
  /// <summary>
  /// This exception will be handled when release date before hiring date
  /// </summary>
  ReleaseDateBeforeHiringDate = 3045,
  /// <summary>
  /// This exception will be handled when exit deposit date after release date
  /// </summary>
  ExitDepositDateAfterReleaseDate = 3046,
  /// <summary>
  /// This exception will be handled when interview date befor hiring date
  /// </summary>
  InterviewDateBeforeHiringDate = 3047,
  /// <summary>
  /// This exception will be handled when exit deposit date after interview date
  /// </summary>
  ExitDepositDateAfterInterviewDate = 3048,
  /// <summary>
  /// This exception will be handled when exit employe release has no physical exit date
  /// </summary>
  EmployeeExithasNoExitPhysicalDate = 3049,
  /// <summary>
  /// This exception will be handled when employee has some contract after exit employee physical date
  /// </summary>
  EmployeeHasSomeContractAfterExitPhysicalDate = 3050,
  /// <summary>
  /// This exception will be handled when interview date before recruitment creation date
  /// </summary>
  InterviewDateBeforeRecuirmentCreationDate = 3051,
  /// <summary>
  /// This exception will be handled when exit physical date does not include in the selected period
  /// </summary>
  ValidateResignedEmployee = 3052,
  /// <summary>
  /// This exception will be handled when employee is resigned
  /// </summary>
  ActionNotAllowedWithResignedEmployee = 3053,
  /// <summary>
  /// This exception will be handled when the date of assignment of an employee to a
  /// team is less than the date of creation of the team
  /// </summary>
  ASSIGNMENT_DATE_MUST_BE_BEFOR_TEAM_CREATION_DATE = 3054,
  /// <summary>
  /// This exception will be handled when the IdCitizenship equal null
  /// </summary>
  INVALID_IDCITIZENSHIP = 3055,
  /// <summary>
  /// This exception will be handled when there is duplication of interviews
  /// </summary>
  InterviewDuplication = 3056,
  /// <summary>
  /// This exception will be handled when  EmployeeExitPhysical Date before leave start date or before leave end date
  /// </summary>
  EmployeeExitPhysicalDateBeforeLeaveDate = 3057,
  /// <summary>
  /// This exception will be handled when we try to generate leave balance for exit employee
  /// </summary>
  CannotGenerateLeaveBalance = 3058,
  /// <summary>
  /// This exception will be handled when expense report has no type
  /// <summary>
  /// This exception will be handled when connected user tries to validate his proper request
  /// </summary>
  ConnectedUserCannotValidateHisRequest = 3059,
  /// <summary>
  /// This exception will be handled when the user tries to add a shared document entity without a document
  /// </summary>
  CannotAddSharedDocumentEntityWithoutDocument = 3060,
  /// <summary>
  /// This exception will be handled when attempt to add employee team without assignent date
  /// </summary>
  CannotAddEmployeeTeamWithoutAssignementDate = 3063,
  /// <summary>
  /// This exception will be handled when currency id not exist in the base
  /// </summary>
  INVALID_IDCURRENCY_EXCEL_COLUMN = 3067,
  /// <summary>
  /// This exception will be handled when taxe group tiers not exist in the base
  /// </summary>
  INVALID_IDTAXEGROUPTIERS_EXCEL_COLUMN = 3068,
  /// <summary>
  /// This exception will be handled when the user tries to validate a document request entity without uploading a document
  /// </summary>
  CannotValidateDocumentRequestEntityWithoutDocument = 3070,
  /// <summary>
  /// This exception will be handled when add document line before adding document
  /// </summary>
  ADD_DOCUMENT_LINE_TO_NOT_EXISTING_DOCUMENT = 3071,
  // #region Paie plage de code: 5001-7000

  /// <summary>
  /// This exception will be handled when total of number of days worked, days paid leave and days non paid leave
  /// is greater than max number of days allowed
  /// </summary>
  AttendanceMaxDaysAllowed = 5001,
  /// <summary>
  /// This exception will be handled when there is a negative bonus session
  /// </summary>
  NegativeBonusSession = 5002,
  /// <summary>
  /// This exception will be handled when the incoming employer rate is not a rate
  /// </summary>
  IncorrectEmployerRate = 5003,
  /// <summary>
  /// This exception will be handled when the incoming salary rate is not a rate
  /// </summary>
  IncorrectSalaryRate = 5004,
  /// <summary>
  /// This exception will be handled when the incoming work accident quota rate is not a rate
  /// </summary>
  IncorrectWorkAccidentQuota = 5005,
  /// <summary>
  /// This exception will be handled when the incoming operating code already exists
  /// </summary>
  ExistingOperatingCode = 5006,
  /// <summary>
  /// This exception will be handled when the limits of an order or applicability of a salary rule isn't respected
  /// </summary>
  OrderAndApplicabilityLimits = 5007,
  /// <summary>
  /// This exception will be handled when the employee does not have a contract
  /// </summary>
  EmployeeWithoutContract = 5008,
  /// <summary>
  /// This exception will be handled when the loan amount exceeds the authorized limit
  /// </summary>
  LoanExceedsLimit = 5009,
  /// This exception will be handled when there is already a loan in the chosen month
  /// </summary>
  LoanExistenceInSameMonth = 5010,
  /// <summary>
  /// This exception will be handled when the loan amount exceeds the authorized limit
  /// </summary>
  PeriodicityStartdateMustBeUnique = 5011,
  /// <summary>
  /// This exception will handled when attempt to close session without payslips
  /// </summary>
  CanNotCloseSessionWithoutPayslip = 5012,
  /// <summary>
  /// This exception will handled when attempt to close session with wrong or not calculated payslips
  /// </summary>
  CanNotCloseSessionWithWrongOrNotCalculatedPayslip = 5013,
  /// <summary>
  /// This exception will handled when there is no transfer order detail attached to generated transfer order
  /// </summary>
  TransferOrderWithNoTransferOrderDetails = 5014,
  /// <summary>
  /// This exception will handled when the variable reference contains numbers
  /// </summary>
  VariableReferenceViolation = 5015,
  /// <summary>
  /// When attempt to update contract associate with closed session
  /// </summary>
  CantUpdateEntityBecauseAnyPayslipIsUsedInClosedSesion = 5016,
  /// <summary>
  /// When attempt to generate payslip non configured period
  /// </summary>
  NoValidityPeriodIsConfiguredForThisPeriod = 5017,
  /// <summary>
  /// This exception will be handled to forbid single loan installment deletion
  /// </summary>
  ForbidLoanInstallmentDeletion = 5018,
  /// <summary>
  /// This exception will be handled there is only one unpaid loan installment which value will exceed loan amount
  /// </summary>
  LoanAmountExceeded = 5019,
  /// <summary>
  /// This exception will be handled the loan installment amount to update is negative
  /// </summary>
  NegativeLoanInstallment = 5020,
  /// <summary>
  /// This exception will be handled the loan amount is zero or negative
  /// </summary>
  NegativeLoanAmount = 5021,
  /// <summary>
  /// A salary structure must have at least one associated rule or a parent structure
  /// </summary>
  SalarystructureMustHaveRuleOrParent = 5022,
  /// <summary>
  /// When circular relationship is detected between this salary structure and its parent's structure
  /// </summary>
  CircularRelationshipBetweenSalarySrtructures = 5023,
  /// <summary>
  /// This exception will be handled when net salary is negative
  /// </summary>
  NegativeSalary = 5024,
  /// <summary>
  /// This exception will be handled when the number of months for the advance overrun one
  /// </summary>
  MonthNumberOverrun = 5025,
  /// <summary>
  /// This exception will be handled when the date of the loan Installment is after contract date
  /// </summary>
  ForbidLoanInstallmentUpdate = 5026,
  /// <summary>
  /// This exception will be handled when the addition of EmployerRate and SalaryRate exceeds 100
  /// </summary>
  EmployerSalaryRateExceedsLimit = 5027,
  /// <summary>
  /// This exception will be handled when the end date for a contract is required
  /// </summary>
  RequiredContractEndDate = 5028,
  /// <summary>
  /// This exception will be handled when the end date for a contract is required
  /// </summary>
  CannotCloseSourceDeductionSessionWithoutClosedPayslipSession = 5029,
  /// <summary>
  /// This exception will be handled when the end date for a contract is required
  /// </summary>
  CannotCloseSourceDeductionSessionWithWrongOrNotCalculatedSourceDeduction = 5030,
  /// <summary>
  /// This exception will be handled when closing transfer order without closed payslip session
  /// </summary>
  CannotCloseTransferOrderWithoutClosedPayslipSession = 5031,
  /// <summary>
  /// This exception will be handled when the employee to be deleted is an upper hierarchique
  /// </summary>
  DeleteEmployeeError = 5032,
  /// <summary>
  /// This exception will be handled when the same bonus is affected more than once to the same contract
  /// </summary>
  DuplicatedBonusForSameContract = 5033,
  /// <summary>
  /// This exception will be handled when the user attemps to close one session in future month
  /// </summary>
  CanNotCLoseSessionInFuture = 5034,
  /// <summary>
  /// This exception will be handled when the payslip to broadcast isn't correct
  /// </summary>
  CannotBroadcastPayslip = 5035,
  /// <summary>
  /// This exception is thrown when the user want to close not correct transferorder
  /// </summary>
  CannotCloseNotCorrectTransferOrder = 5036,
  /// <summary>
  /// This exception is thrown when user attemps to broadcast file to uncorrect file path
  /// </summary>
  SpecifiedPathIsIncorrect = 5037,
  /// <summary>
  /// This exception is thrown when user user can't broadcast file
  /// </summary>
  CantBroadCastFile = 5038,
  /// <summary>
  /// This exception will be handled when there we don't select salary rule other than those from parent
  /// </summary>
  CannotAddSalaryStructureWithParentAndWithoutNewSalaryRule = 5039,
  /// <summary>
  /// This exception will be handled when the Bonus aleardy exists in Session
  /// </summary>
  BonusExistanceInSession = 5040,
  /// <summary>
  /// This exception will be handled when there are not validated timeheets in billing session when closing it
  /// </summary>
  CannotCloseBillingSession = 5041,
  /// <summary>
  /// This exception is thrown when the user want to close a deleted session
  /// </summary>
  CanNotCLoseDeletedSession = 5042,
  /// <summary>
  /// This exception is thrown when the value of the bonus inserted equal to zero
  /// </summary>
  BonusValueEqualToZero = 5043,
  // #endregion

  // #region Treso plage de code: 8000-9000
  /// <summary>
  /// this exception is generated when we try to pass a settlement to pay the last unpaid financial
  /// commitment without paying the withholding tax
  /// </summary>
  unpaidWithholdingTax = 8001,
  /// <summary>
  /// this exception is throw when user delete paymentSlip which state is not provisional
  /// </summary>
  deletePaymentSlipNotProvisionnal = 8002,
  /// <summary>
  /// this exception is throw when no invoice find to the selected financial commitment
  /// </summary>
  NoInvoiceAssociateToTheFinancialCommitment = 8003,
  /// <summary>
  /// this exception is throw when no contact found for the tiers to who we want to send the revivial mail
  /// </summary>
  NoTiersContactFoundToSendRevivialMail = 8004,
  /// <summary>
  /// this exception is thrown when user try to add new settlement when selected financial commitments has been deleted
  /// </summary>
  deletedFinancialCommitments = 8005,
  /// <summary>
  /// this exception is thrown when user try to add new settlement when selected financial commitments has been changed
  /// </summary>
  selectedFinancialCommitmentsHasBeenChanged = 8006,
  /// <summary>
  /// throw error if user try to change company setting and set withoholding Tax to false  while there is already financial
  /// commitment configured with withholdingTax
  /// </summary>
  changingWithholdingTaxCompanySettings = 8007,
  /// <summary>
  /// throw error if user try to change withoholding Tax configuration in invoice while
  /// there is already a payment that has been done
  /// </summary>
  paymentHasAlreadyBeenDone = 8008,
  /// <summary>
  /// throw error there are no settlement in payment slip
  /// </summary>
  NoSettlementFoundInPaymentSlip = 8009,
  /// <summary>
  /// throw error if the settlment is linked to paymentSlip or reconciliation or is status is cashed
  /// </summary>
  SettlementCannotBeModified = 8010,
  /// <summary>
  /// throw error if the user have already opened cash session
  /// </summary>
  USER_ALREADY_HAS_CASH_SESSION = 8011,
  /// <summary>
  /// throw error if principale cash name is duplicate
  /// </summary>
  DuplicatePrincipaleCashRegisterName = 8012,
  /// throw error if receipe or expense cash name is duplicate
  /// </summary>
  DuplicateReceipeOrExpenseCashRegisterName = 8013,
  /// <summary>
  /// success close of sessionCash
  /// </summary>
  SessionCashClosedSuccessfull = 8014,
  /// <summary>
  /// success open of sessionCash
  /// </summary>
  SessionCashOpenedSuccessfull = 8015,
  /// <summary>
  /// throw error when user try to delete opened cashRegister
  /// </summary>
  DeleteCashRegisterError = 8016,
  /// <summary>
  /// throw error if the user have already cash register
  /// </summary>
  USER_ALREADY_HAS_CASH_REGISTER = 8017,
  // #region Treso plage de code: 10000-11000
  /// <summary>
  /// When the calcul of expected duration failed
  /// </summary>
  OperationExpectedDurationFailed = 10000,
  /// <summary>
  /// When the operation is duplicated in intervention
  /// </summary>
  DuplicatedOperation = 10001,
  /// <summary>
  /// When the item is duplicated in intervention
  /// </summary>
  DuplicatedItem = 10002,
  /// <summary>
  /// When the item is not valaible in garage warehouse
  /// </summary>
  ItemNotAvailableInGarageWarehouse = 10003,
  /// <summary>
  /// When there are no warehouse of the garage
  /// </summary>
  GarageWareouseNotExist = 10004,
  /// <summary>
  /// When there are no item and operation in intervention
  /// </summary>
  NoItemAndOperationNotExistToGenerateInvoice = 10005,
  /// <summary>
  /// When there are opeartion which state are not completed
  /// </summary>
  ThereAreOperationWhichAreNotCompleted = 10006,
  /// <summary>
  /// When there are related operationType to the unit
  /// </summary>
  UnityCannotBeModified = 10007,
  /// <summary>
  /// When there are related operation to the operationType
  /// </summary>
  OperationTypeCannotBeModified = 10008,
  /// <summary>
  /// When there are related Intervention to the Opeartion
  /// </summary>
  OperationCannotBeModified = 10009,
  /// <summary>
  /// When post has no name
  /// </summary>
  PostHasNoName = 10011,
  /// <summary>
  /// When worker is related to garage
  /// </summary>
  WorkerGradeCannotBeModified = 10012,
  /// <summary>
  /// throw error when the file extension is not supported
  /// </summary>
  FileExtensionNotSupported = 10013,
  /// <summary>
  /// throw error when the customer vehicle is related to an billed intervention
  /// </summary>
  CustomerVehicleUpdate = 10014,
  /// <summary>
  /// throw error when delete intervention in progress
  /// </summary>
  InterventionInProgress = 10015,
  /// <summary>
  /// throw error when delete intervention completed
  /// </summary>
  InterventionCompleted = 10016,
  /// <summary>
  /// throw error when intervention date and delivery date is null or invalid
  /// </summary>
  InterventionOrDeliveryDateRequired = 10017,
  /// <summary>
  /// throw error when the user try to change the warehouse associated to the garage while there is at least one intervention not closed
  /// </summary>
  InterventionNotClosed = 10018,
  /// <summary>
  /// Throw when the tiers phone number don't found
  /// </summary>
  TiersPhoneNotFound = 10019,
  /// <summary>
  /// Throw when recipients numbers not found
  /// </summary>
  SmsReceiversNotFound = 10020,
  /// <summary>
  /// This exception will be handled when the settelement date is invalid
  /// </summary>
  DocumentAddedsuccessfully = 208,

  //#region Auth Plage de code: 11001-16000
  /// <summary>
  /// Throw when permission is missing
  /// </summary>
  MISSING_PERMISSION = 11001,

  //#region Auth Plage de code: 11001-16000
  /// <summary>
  /// Throw when send sms date and hour are invalid
  /// </summary>
  InvalidSendSmsDateHour = 10021,
  /// <summary>
  /// This exception will be handled when the line is successfully deleted
  /// </summary>
  LineDeletedSuccessfully = 209,

  // #endregion
}
