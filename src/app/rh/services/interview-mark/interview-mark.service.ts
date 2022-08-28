import {Inject, Injectable} from '@angular/core';
import {InterviewMark} from '../../../models/rh/interview-mark.model';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../../../../COM/config/app.config';
import {Operation} from '../../../../COM/Models/operations';
import {Observable} from 'rxjs/Observable';
import {InterviewConstant} from '../../../constant/rh/interview.constant';
import { ResourceServiceRhPaie } from '../../../shared/services/resource/resource.service.rhpaie';

@Injectable()
export class InterviewMarkService extends ResourceServiceRhPaie<InterviewMark> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(
      httpClient, appConfig,
      'interviewMark', 'InterviewMark', 'RH');
  }

  public GetInterviewMarkCriteriaMarkList(idInterviewMark: number): Observable<any> {
    return this.callService(Operation.GET, InterviewConstant.GET_INTERVIEW_MARK_CRITERIA_MARK_LIST.concat(String(idInterviewMark)));
  }

  public UpdateInterviewMarkWithCriteriaMark(data: InterviewMark): Observable<any> {
    return this.callService(Operation.POST, InterviewConstant.UPDATE_INTERVIEW_MARK_WITH_CRITERIA_MARK, data);
  }
}
