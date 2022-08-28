import { Resource } from '../shared/ressource.model';
import { EvaluationCriteria } from './evaluation-criteria.model';
import { InterviewMark } from './interview-mark.model';

export class CriteriaMark  extends Resource {
  Mark: number;
  IdEvaluationCriteria: number;
  IdInterviewMark: number;
  IdEvaluationCriteriaTheme: number;
  IdEvaluationCriteriaNavigation: EvaluationCriteria;
  IdInterviewMarkNavigation: InterviewMark;
}
