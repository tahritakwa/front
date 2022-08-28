import {Inject, Injectable} from '@angular/core';
import {AppConfig} from '../../../../COM/config/app.config';
import {HttpClient} from '@angular/common/http';
import {ReviewSkills} from '../../../models/rh/review-skills.model';
import {Observable} from 'rxjs/Observable';
import {Operation} from '../../../../COM/Models/operations';
import {ReviewConstant} from '../../../constant/rh/review.constant';
import { ResourceServiceRhPaie } from '../../../shared/services/resource/resource.service.rhpaie';

@Injectable()
export class ReviewSkillsService extends ResourceServiceRhPaie<ReviewSkills> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(
      httpClient, appConfig,
      'reviewSkills', 'ReviewSkills', 'RH');
  }

  public deleteReviewSkillsModel(hasRight: boolean, reviewSkills: ReviewSkills): Observable<any> {
    return super.callService(Operation.DELETE,
      ReviewConstant.DELETE_REVIEW_SKILLS_MODEL.concat(String(hasRight)), reviewSkills);
  }
}
