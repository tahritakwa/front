import { Resource } from '../shared/ressource.model';
import { EvaluationCriteria } from './evaluation-criteria.model';

export class EvaluationCriteriaTheme  extends Resource {
  Label: string;
  Description: string;
  CriteriaNumber: number;
  EvaluationCriteria: EvaluationCriteria[];
}
