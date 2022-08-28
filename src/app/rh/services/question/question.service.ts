import {Question} from '../../../models/rh/question.model';
import {Inject, Injectable} from '@angular/core';
import {AppConfig} from '../../../../COM/config/app.config';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Operation} from '../../../../COM/Models/operations';
import {ReviewConstant} from '../../../constant/rh/review.constant';
import { ResourceServiceRhPaie } from '../../../shared/services/resource/resource.service.rhpaie';

@Injectable()
export class QuestionService extends ResourceServiceRhPaie<Question> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(
      httpClient, appConfig,
      'question', 'Question', 'RH');
  }

  public deleteQuestionModel(hasRight: boolean, question: Question): Observable<any> {
    return super.callService(Operation.DELETE,
      ReviewConstant.DELETE_QUESTION_MODEL.concat(String(hasRight)), question);
  }
}
