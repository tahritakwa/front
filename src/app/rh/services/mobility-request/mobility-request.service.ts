import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../../../../COM/config/app.config';
import {MobilityRequest} from '../../../models/rh/mobility-request.model';
import {MobilityRequestConstant} from '../../../constant/rh/mobility-request.constant';
import {Operation} from '../../../../COM/Models/operations';
import {Observable} from 'rxjs/Observable';
import { ResourceServiceRhPaie } from '../../../shared/services/resource/resource.service.rhpaie';

@Injectable()
export class MobilityRequestService extends ResourceServiceRhPaie<MobilityRequest> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(
      httpClient, appConfig,
      'mobilityRequest', 'MobilityRequest', 'RH');
  }

  public mobilityRequestValidation(mobilityRequest: MobilityRequest): Observable<any> {
    return this.callService(Operation.PUT, MobilityRequestConstant.MOBILITY_REQUEST_VALIDATION, mobilityRequest);
  }
}
