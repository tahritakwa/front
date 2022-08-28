import {Inject, Injectable} from '@angular/core';
import {LeaveType} from '../../../models/payroll/leave-type.model';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../../../../COM/config/app.config';
import { ResourceServiceRhPaie } from '../../../shared/services/resource/resource.service.rhpaie';

@Injectable()
export class LeaveTypeService extends ResourceServiceRhPaie<LeaveType> {

  constructor(@Inject(HttpClient)  httpClient, @Inject(AppConfig) appConfig) {
    super(
      httpClient, appConfig,
      'leaveType', 'LeaveType', 'PayRoll');
  }

}
