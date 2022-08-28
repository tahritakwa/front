export class BackgroundJobConstants {
  /* General config*/
  public static KEYS = 'Keys';
  public static FIELD = 'Field';
  /* job keys */
  public static ANNUAL_REVIEW_JOB_KEY = 'AnnualReviewJob';

  /* Job Fields */
  public static ANNUAL_REVIEW_JOB_NOTIFICATION_DAYS_FIELD = 'notificationDays';

  /* Other */

  public static UPDATE_REVIEW_NOTIFICATION_DAYS = 'updateReviewNotificationDays';
  public static GET_REVIEW_NOTIFICATION_DAYS = 'getReviewNotificationDays';
  public static ANNUAL_REVIEW_DESCRIPTION = 'Description';
  public static MIN_ANNUAL_REVIEW_DAYS = 0;
  public static MAX_ANNUAL_REVIEW_DAYS = 30;
  public static NOTIFICATION_DAYS_OUT_OF_RANGE = 'NOTIFICATION_DAYS_OUT_OF_RANGE';
  public static NOTIFICATION_DAY_ALREADY_SET = 'NOTIFICATION_DAY_ALREADY_SET';
  public static CANCEL_UPDATE = 'CANCEL_UPDATE';
  public static NO_CHANGES_HAVE_BEEN_MADE = 'NO_CHANGES_HAVE_BEEN_MADE';
  public static WARNING = 'WARNING';
  public static CANCEL_CHANGES_WARNING = 'CANCEL_CHANGES_WARNING';
  public static CLEAR_LIST_WARNING = 'CLEAR_LIST_WARNING';
  public static EMPTY_LIST_WARNING = 'EMPTY_LIST_WARNING';
}
