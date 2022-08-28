import {Inject, Injectable} from '@angular/core';
import {AppConfig} from '../../../../COM/config/app.config';
import {HttpClient} from '@angular/common/http';
import {ReviewFormation} from '../../../models/rh/review-formation.model';
import {Observable} from 'rxjs/Observable';
import {Operation} from '../../../../COM/Models/operations';
import {ReviewConstant} from '../../../constant/rh/review.constant';
import { ResourceServiceRhPaie } from '../../../shared/services/resource/resource.service.rhpaie';

@Injectable()
export class ReviewFormationService extends ResourceServiceRhPaie<ReviewFormation> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(
      httpClient, appConfig,
      'reviewFormation', 'ReviewFormation', 'RH');
  }

  public deleteReviewFormationModel(hasRight: boolean, reviewFormation: ReviewFormation): Observable<any> {
    return super.callService(Operation.DELETE,
      ReviewConstant.DELETE_REVIEW_FORMATION_MODEL.concat(String(hasRight)), reviewFormation);
  }

}
