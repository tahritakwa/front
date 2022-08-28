import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../../../COM/config/app.config';
import { EmployeeSkills } from '../../../models/payroll/employee-skills.model';
import { Observable } from 'rxjs/Observable';
import { Operation } from '../../../../COM/Models/operations';
import { PredicateFormat } from '../../../shared/utils/predicate';
import { SkillsConstant } from '../../../constant/payroll/skills.constant';
import { EmployeeSkillsMatrixFilter } from '../../../models/enumerators/employee-skills-matrix-filter.enum';
import { ReviewConstant } from '../../../constant/rh/review.constant';
import { ResourceServiceRhPaie } from '../../../shared/services/resource/resource.service.rhpaie';

@Injectable()
export class EmployeeSkillsService extends ResourceServiceRhPaie<EmployeeSkills> {
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig,
      'employeeSkills', 'EmployeeSkills', 'PayRoll');
  }

  public getSkillsMatrix(filterSetting: EmployeeSkillsMatrixFilter): Observable<any> {
    return this.callService(Operation.POST, SkillsConstant.GET_SKILLS_MATRIX_URL, filterSetting);
  }

  public SaveRating(employeeSkills): Observable<any> {
    return this.callService(Operation.POST, SkillsConstant.SAVE_RATING_URL, employeeSkills);
  }

  public getPastReviewSkillsList(idReview: number): Observable<any> {
    return super.callService(Operation.POST, ReviewConstant.GET_PAST_REVIEW_SKILLS_LIST.concat(idReview.toString()));
  }
}

