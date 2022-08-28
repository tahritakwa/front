import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Attendance} from '../../../models/payroll/attendance.model';
import {AppConfig} from '../../../../COM/config/app.config';
import {Observable} from 'rxjs/Observable';
import {ObjectToSave} from '../../../models/shared/objectToSend';
import {Operation} from '../../../../COM/Models/operations';
import {AttendanceConstant} from '../../../constant/payroll/attendance.constant';
import { ResourceServiceRhPaie } from '../../../shared/services/resource/resource.service.rhpaie';

@Injectable()
export class AttendanceService extends ResourceServiceRhPaie<Attendance> {
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(
      httpClient, appConfig,
      'attendance', 'Attendance', 'PayRoll');
  }

  public updateAttendance(attendance: Attendance): Observable<any> {
    const data: any = {};
    data['attendance'] = attendance;
    const objectToSave: ObjectToSave = new ObjectToSave();
    objectToSave.Model = data;
    return this.callService(Operation.POST, AttendanceConstant.UPDATE_ATTENDANCE, objectToSave);
  }
}
