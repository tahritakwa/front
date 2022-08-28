import {HttpClient} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {DataSourceRequestState} from '@progress/kendo-data-query';
import {Observable} from 'rxjs/Observable';
import {AppConfig} from '../../../../COM/config/app.config';
import {Operation} from '../../../../COM/Models/operations';
import {RecruitmentConstant} from '../../../constant/rh/recruitment.constant';
import {Recruitment} from '../../../models/rh/recruitment.model';
import {ObjectToSend} from '../../../models/sales/object-to-save.model';
import { ResourceServiceRhPaie } from '../../../shared/services/resource/resource.service.rhpaie';
import {PredicateFormat} from '../../../shared/utils/predicate';

@Injectable()
export class RecruitmentService extends ResourceServiceRhPaie<Recruitment> {
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig, 'recruitment', 'Recruitment', 'RH');
  }

  public doneRecruitment(recruitmentId: number): Observable<any> {
    return super.callService(
      Operation.POST,
      RecruitmentConstant.DONE_RECRUITMENT,
      recruitmentId
    );
  }

  public getRecruitmentsList(
    state: DataSourceRequestState,
    predicate: PredicateFormat,
    IdCandidate?: number,
    startDate?: Date,
    endDate?: Date
  ): Observable<any> {
    super.prepareServerOptions(state, predicate);
    const data: any = {};
    data[RecruitmentConstant.PREDICATE] = predicate;
    data[RecruitmentConstant.IDCANDIDATE] = IdCandidate ? IdCandidate : 0;
    data[RecruitmentConstant.START_DATE] = startDate;
    data[RecruitmentConstant.END_DATE] = endDate;
    const objectToSend: ObjectToSend = new ObjectToSend(data, null);
    return this.callService(
      Operation.POST,
      RecruitmentConstant.GET_RECRUITMENTS_LIST,
      objectToSend
    );
  }

  public validateRequest(data): Observable<any> {
    return this.callService(
      Operation.POST,
      RecruitmentConstant.VALIDATE_API_URL,
      data);
  }

  public OpenOrCloseOffer(data): Observable<any> {
    return this.callService(Operation.POST, RecruitmentConstant.PUBLISH_API_URL, data);
  }
}
