import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../../../../COM/config/app.config';
import {Observable} from 'rxjs/Observable';
import {Operation} from '../../../../COM/Models/operations';
import {TimeSheet} from '../../../models/rh/timesheet.model';
import {TimeSheetConstant} from '../../../constant/rh/timesheet.constant';
import {Time} from '@angular/common';
import {ObjectToSave, ObjectToSend} from '../../../models/sales/object-to-save.model';
import {DataSourceRequestState} from '@progress/kendo-data-query';
import {PredicateFormat} from '../../../shared/utils/predicate';
import {BehaviorSubject} from 'rxjs';
import { ResourceServiceRhPaie } from '../../../shared/services/resource/resource.service.rhpaie';

@Injectable()
export class TimeSheetService extends ResourceServiceRhPaie<TimeSheet> {
  public listTimesheetId = new BehaviorSubject<any>([]);

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(
      httpClient, appConfig,
      'timeSheet', 'TimeSheet', 'RH');
  }

  /**
   * Get specified user timesheet for the current month
   * @param idEmployee
   * @param month
   */
  public getEmployeeTimeSheet(idEmployee: number, month: Date): Observable<any> {
    const data: any = {};
    data[TimeSheetConstant.ID_EMPLOYEE] = idEmployee;
    data[TimeSheetConstant.MONTH] = month;
    const objectToSend: ObjectToSend = new ObjectToSend(data, null);
    return super.callService(Operation.POST, TimeSheetConstant.EMPLOYEE_CURRENT_MONTH_TIMESHEET, objectToSend);
  }

  /**
   * Get specified user timesheet for the current year
   * @param idEmployee
   * @param year
   */
  public getYearTimeSheet(idEmployee: number, year: Date): Observable<any> {
    const data: any = {};
    data[TimeSheetConstant.ID_EMPLOYEE] = idEmployee;
    data[TimeSheetConstant.YEAR] = year;
    const objectToSend: ObjectToSend = new ObjectToSend(data, null);
    return super.callService(Operation.POST, TimeSheetConstant.GET_YEAR_TIMESHEET, objectToSend);
  }

  /**
   * Validate timesheet
   * @param data
   */
  public validateTimeSheet(data): Observable<any> {
    return this.callService(Operation.POST, TimeSheetConstant.VALIDATE_API_URL, data);
  }

  public definitiveValidate(idEmployee, idTimeSheet): Observable<any> {
    return this.callService(Operation.GET, TimeSheetConstant.DEFINITIVE_VALIDATE_API_URL.concat(idEmployee).concat('/').concat(idTimeSheet));
  }

  public sendMail(idEmployee: number, startDate: Date): Observable<any> {
    const data: any = {};
    data['idEmployee'] = idEmployee;
    data['startDate'] = startDate;
    const objectToSend: ObjectToSend = new ObjectToSend(data, null);
    return this.callService(Operation.POST, TimeSheetConstant.SEND_MAIL, objectToSend);
  }

  public TimeValueChange(date: Date, startTime: Time, endTime: Time): Observable<any> {
    const data: any = {};
    data[TimeSheetConstant.DATE] = date;
    data[TimeSheetConstant.START_TIME] = startTime;
    data[TimeSheetConstant.END_TIME] = endTime;
    const objectToSend: ObjectToSend = new ObjectToSend(data, null);
    return super.callService(Operation.POST, TimeSheetConstant.TIME_VALUE_CHANGE, objectToSend);
  }

  /**
   * Fix timesheet request
   * @param data
   */
  public timeSheetFixRequest(idTimeSheet: number): Observable<any> {
    return this.callService(Operation.GET, TimeSheetConstant.TIMESHEET_FIX_REQUEST.concat(idTimeSheet.toString()));
  }

  public getTimeSheetRequestsWithHierarchy(state: DataSourceRequestState, predicate?: PredicateFormat,
                                           hasHighRight?: boolean): Observable<any> {
    super.prepareServerOptions(state, predicate);
    const data: any = {};
    data['isAdmin'] = hasHighRight;
    data['predicate'] = predicate;
    const objectToSave: ObjectToSave = new ObjectToSave();
    objectToSave.Model = data;
    return this.callService(Operation.POST, TimeSheetConstant.GET_TIME_SHEET_REQUESTS_WITH_HIERARCHY, objectToSave);
  }

  public getEmployeesTimeSheets(year: Date, hasHighRight: boolean, predicate: PredicateFormat): Observable<any> {
    const data: any = {};
    data['hasHighRight'] = hasHighRight;
    data['year'] = year;
    data['predicate'] = predicate;
    const objectToSave: ObjectToSave = new ObjectToSave();
    objectToSave.Model = data;
    return super.callService(Operation.POST, TimeSheetConstant.GET_EMPLOYEES_TIMESHEETS, objectToSave);
  }

  public getAvailableEmployeeByTimeSheet(endDate: Date): Observable<any> {
    return this.callService(Operation.POST, TimeSheetConstant.GET_AVAILABLE_EMPLOYEE_BY_TIMESHEET, endDate);
  }

  /**
   * getTimeSheetFromListId
   * @param objectToSend
   */
  public getTimeSheetFromListId(objectToSend: Array<number>): Observable<any> {
    return super.callService(Operation.POST, TimeSheetConstant.GET_TIMESHEET_FROM_LIST_ID, objectToSend);
  }

  /**
   * validateMassiveTimeSheet
   * @param objectToSend
   */
  public validateMassiveTimeSheet(objectToSend: TimeSheet []): Observable<any> {
    return super.callService(Operation.POST, TimeSheetConstant.VALIDATE_MASSIVE_TIMESHEETS, objectToSend);
  }

  /**
   * timeSheetMassiveFixRequest
   * @param objectToSend
   */
  public timeSheetMassiveFixRequest(objectToSend: number []): Observable<any> {
    return this.callService(Operation.POST, TimeSheetConstant.TIMESHEET_MASSIVE_FIX_REQUEST, objectToSend);
  }

  /**
   * Get TimeSheet Ids
   */
  public getListTimeSheetIds(): Observable<any> {
    return this.listTimesheetId.asObservable();
  }
}
