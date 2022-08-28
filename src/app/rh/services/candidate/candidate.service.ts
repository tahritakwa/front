import {Inject, Injectable} from '@angular/core';
import {Candidate} from '../../../models/rh/candidate.model';
import {AppConfig} from '../../../../COM/config/app.config';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Operation } from '../../../../COM/Models/operations';
import { CandidateConstant } from '../../../constant/rh/candidate.constant';
import { ResourceServiceRhPaie } from '../../../shared/services/resource/resource.service.rhpaie';

@Injectable()
export class CandidateService extends ResourceServiceRhPaie<Candidate> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(
      httpClient, appConfig,
      'candidate', 'Candidate', 'RH');
  }

  public getAvailableCandidates(): Observable<any> {
    return this.callService(Operation.POST, CandidateConstant.GET_AVAILABLE_CANDIDATES);
  }
}
