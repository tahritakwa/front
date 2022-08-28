import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Job} from '../../../models/payroll/job.model';
import {AppConfig} from '../../../../COM/config/app.config';
import {Operation} from '../../../../COM/Models/operations';
import {Observable} from 'rxjs/Observable';
import {JobConstant} from '../../../constant/payroll/job.constant';
import { ResourceServiceRhPaie } from '../../../shared/services/resource/resource.service.rhpaie';

@Injectable()
export class JobService extends ResourceServiceRhPaie<Job> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(
      httpClient, appConfig,
      'job', 'Job', 'PayRoll');
  }

  public getJobList(): Observable<any> {
    return this.callService(Operation.GET, JobConstant.GET_JOB_LIST);
  }

  public synchronizeJobs(): Observable<any> {
    return this.callService(Operation.POST, JobConstant.SYNCHRONIZE_JOBS);
  }

}
