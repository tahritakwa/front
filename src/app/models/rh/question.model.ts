import { Resource } from '../shared/ressource.model';
import { Interview } from './interview.model';

export class Question extends Resource {
  QuestionLabel: string;
  ResponseLabel: string;
  IdInterview: number;
  DeletedToken: string;
  InterviewViewModel: Interview;
}
