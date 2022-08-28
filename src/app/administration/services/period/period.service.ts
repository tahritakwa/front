import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { AppConfig } from '../../../../COM/config/app.config';
import { Period } from '../../../models/administration/period.model';
import { Observable } from 'rxjs/Observable';
import { Operation } from '../../../../COM/Models/operations';
import { PeriodConstant } from '../../../constant/Administration/period.constant';
import { ResourceServiceRhPaie } from '../../../shared/services/resource/resource.service.rhpaie';

@Injectable()
export class PeriodService extends ResourceServiceRhPaie<Period> {
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig,
      'period', 'Period', 'Administration');
  }

  /**
   * Get the date hours according to specifi period of this month
   */
  public GetHoursPeriodOfDate(date: Date): Observable<any> {
    return super.callService(Operation.POST, PeriodConstant.GET_HOURS_PERIOD_OF_DATE, date);
  }
  /**
   *
   * @param date
   */
  public GetEndTimeOfPeriod(date: Date): Observable<any> {
    return super.callService(Operation.GET, PeriodConstant.GET_END_TIME_OF_PERIOD.concat(JSON.stringify(date)));
  }

  /**
   *
   * @param date
   */
  public GetStartTimeOfPeriod(date: Date): Observable<any> {
    return super.callService(Operation.GET, PeriodConstant.GET_START_TIME_OF_PERIOD.concat(JSON.stringify(date)));
  }

  /**
   * Check if dayoff updated corrupte any payslip or timesheet
   */
  public checkIfDayOffsUpdateCorruptedPayslipOrTimesheet(model: Period): Observable<any> {
    return this.callService(Operation.POST,
     PeriodConstant.CHECK_IF_DAYOFFS_UPDATE_CORRUPTED_PAYSLIP_OR_TIMESHEET, model);
  }
}

