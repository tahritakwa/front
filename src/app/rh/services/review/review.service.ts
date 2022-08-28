import {Inject, Injectable} from '@angular/core';
import {AppConfig} from '../../../../COM/config/app.config';
import {HttpClient} from '@angular/common/http';
import {Review} from '../../../models/rh/Review.model';
import {Operation} from '../../../../COM/Models/operations';
import {ReviewConstant} from '../../../constant/rh/review.constant';
import {Observable} from 'rxjs/Observable';
import {ReviewForm} from '../../../models/rh/review-form.model';
import { ResourceServiceRhPaie } from '../../../shared/services/resource/resource.service.rhpaie';

@Injectable()
export class ReviewService extends ResourceServiceRhPaie<Review> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(
      httpClient, appConfig,
      'review', 'Review', 'RH');
  }

  public getReviewWithHisNavigations(idReview: number): Observable<any> {
    return super.callService(Operation.GET, ReviewConstant.GET_REVIEW_WITH_HIS_NAVIGATION.concat(String(idReview)));
  }

  public saveReviewForm(reviewForm: ReviewForm): Observable<any> {
    return super.callService(Operation.POST, ReviewConstant.SAVE_REVIEW_FORM, reviewForm);
  }

  public GetPastObjectiveList(idReview: number): Observable<any> {
    return super.callService(Operation.POST, ReviewConstant.GET_PAST_OBJECTIVE_LIST.concat(idReview.toString()));
  }

  public GetPastReviewFormationList(idReview: number): Observable<any> {
    return super.callService(Operation.POST, ReviewConstant.GET_PAST_REVIEW_FORMATION_LIST.concat(String(idReview)));
  }

  public CanAccessReviewDetails(idReview: number): Observable<any> {
    return super.callService(Operation.GET, ReviewConstant.CAN_ACCESS_REVIEW_DETAILS.concat(String(idReview)));
  }

  public ConnectedEmployeePriveleges(idReview: number): Observable<any> {
    return super.callService(Operation.GET, ReviewConstant.CONNECTED_EMPLOYEE_PRIVELEGES.concat(String(idReview)));
  }

  public closeReview(reviewForm: ReviewForm): Observable<any> {
    return super.callService(Operation.POST, ReviewConstant.CLOSE_REVIEW, reviewForm);
  }
}
