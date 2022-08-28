import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../../../../COM/config/app.config';
import {Interview} from '../../../models/rh/interview.model';
import {Observable} from 'rxjs/Observable';
import {Operation} from '../../../../COM/Models/operations';
import {InterviewConstant} from '../../../constant/rh/interview.constant';
import {ObjectToSave} from '../../../models/shared/objectToSend';
import {InterviewMark} from '../../../models/rh/interview-mark.model';
import { ResourceServiceRhPaie } from '../../../shared/services/resource/resource.service.rhpaie';


@Injectable()
export class InterviewService extends ResourceServiceRhPaie<Interview> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(
      httpClient, appConfig,
      'interview', 'Interview', 'RH');
  }

  public generateInterviewEmail(interview: Interview, lang: string): Observable<any> {
    return super.callService(Operation.POST, InterviewConstant.GENERATE_INTERVIEW_EMAIL_BY_ID.concat('/').concat(lang), interview);
  }

  public makeTheInterviewAsRequestedToCandidate(interview: Interview): Observable<any> {
    return super.callService(Operation.POST, InterviewConstant.MAKE_THE_INTERVIEW_AS_REQUESTED_TO_CANDIDATE, interview);
  }

  public confirmCandidateDisponibility(interview: Interview): Observable<any> {
    return super.callService(Operation.POST, InterviewConstant.CONFIRM_THE_CANDIDATE_DISPONIBILITY, interview);
  }

  public fromInterviewToNextStep(recruitmentId: number): Observable<any> {
    return super.callService(Operation.POST, InterviewConstant.FROM_INTERVIEW_TO_NEXT_STEP, recruitmentId);
  }

  public fromEvaluationToNextStep(recrutrementId: number): Observable<any[]> {
    return this.callService(Operation.GET, InterviewConstant.FROM_EVALUATION_TO_NEXT_STEP.concat(String(recrutrementId)));
  }

  public getCandidacyInterviewDetails(idCandidacy: number): Observable<any[]> {
    return this.callService(Operation.GET, InterviewConstant.GET_CANDIDACY_INTERVIEW_DETAILS.concat(String(idCandidacy)));
  }

  public cancelInterview(interview: Interview): Observable<any> {
    return super.callService(Operation.POST, InterviewConstant.CANCEL_INTERVIEW_API, interview);
  }

  public resendEmailToInterviewer(interview: Interview, idInterviewer): Observable<any> {
    const data: any = {};
    data[InterviewConstant.INTERVIEW] = interview;
    data[InterviewConstant.ID_INTERVIEWER] = idInterviewer;
    const objectToSave: ObjectToSave = new ObjectToSave();
    objectToSave.Model = data;
    return super.callService(Operation.POST, InterviewConstant.RESEND_EMAIL_TO_INTERVIEWER, objectToSave);
  }

  public confirmAvailabilityForTheInterview(data: InterviewMark): Observable<any> {
    return this.callService(Operation.POST, InterviewConstant.CONFIRM_AVAILABILITY_FOR_THE_INTERVIEW, data);
  }

  public checkInterviewHasAnotherInterview(interview: Interview): Observable<boolean> {
    return this.callService(Operation.POST, InterviewConstant.CHECK_INTERVIEW_HAS_ANOTHER_INTERVIEW, interview) as Observable<boolean>;
  }
}
