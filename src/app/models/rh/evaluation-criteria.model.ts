import { EvaluationCriteriaTheme } from './evaluation-criteria-theme.model';
import { Resource } from '../shared/ressource.model';
import { CriteriaMark } from './criteria-mark.model';

export class EvaluationCriteria   extends Resource {
  Label: string;
  IdEvaluationCriteriaTheme: number;
  Description: string;
  IdEvaluationCriteriaThemeNavigation: EvaluationCriteriaTheme;
  CriteriaMark: Array<CriteriaMark>;
}
