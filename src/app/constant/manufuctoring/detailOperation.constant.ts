export class DetailOperationConstant {
  public static ENTITY_NAME = 'detailOperation';
  public static DETAIL_OPERATION_COMPONENT_URL = 'main/manufacturing/detailOperation/suivi/';
  public static LIST_OPERATIONS_BY_ID_FABRICATION_AND_LAST_STATUS = 'getListOperationsByIdFabricationArrangementAndLastStatus/';
  public static LIST_OPERATIONS_BY_ID_FABRICATION = 'getDetailOperationByFabricationArrangement/';
  public static GET_OPERATION = '';
  public static START_OPERATION = 'startOperation';
  public static BREAK_OPERATION = 'breakOperation';
  public static CHANGER_OPERATION = 'changeOperation';
  public static RESUME_OPERATION = 'resumeOperation';
  public static END_OPERATION = 'endOperation';
  public static CALCUL_REEL_DURATION = 'calculReelDurationByOperation';
  public static COUNT_OPERATIONS_BY_GAMME = 'countOperationsByGammeId';
  public static FILTER_PARAM = '?fields=id,operation.id,operation.duration,operation.description,operation.machine.description,operation.machine.responsibleId,status,createdDate';
  public static STATUS_OPERATION_NOT_LANCED = 'NOT_LANCED';
  public static STATUS_OPERATION_IN_PROGRESS = 'IN_PROGRESS';
  public static STATUS_OPERATION_PAUSED = 'PAUSED';
  public static STATUS_OPERATION_RESUMED = 'RESUMED';
  public static STATUS_OPERATION_FINISHED = 'FINISHED';
  public static DESCRIPTION_STATUS_OPERATION_NOT_LANCED = 'OPERATION_NOT_LANCED';
  public static DESCRIPTION_STATUS_OPERATION_IN_PROGRESS = 'OPERATION_IN_PROGRESS';
  public static DESCRIPTION_STATUS_OPERATION_PAUSED = 'OPERATION_PAUSED';
  public static DESCRIPTION_STATUS_OPERATION_RESUMED = 'OPERATION_RESUMED';
  public static DESCRIPTION_STATUS_OPERATION_FINISHED = 'OPERATION_FINISHED';
  public static END_DATE_FIELD = 'finishDate';
  public static START_DATE_FIELD = 'startDate';
  public static END_DATE_TITLE = 'END_DATE';
  public static START_DATE_TITLE = 'START_DATE';
  public static DETAIL_OPERATION_DESCRPTION_FIELD = 'operation.description';
  public static PREPARE_DETAIL_OPERATION_DATES_URL = 'prepareDetailOperationDates';


}
