import { Resource } from '../shared/ressource.model';
import { RuleUniqueReference } from './rule-unique-reference';
import { VariableValidityPeriod } from './variable-validity-period.model';

export class Variable extends Resource {
    Name: string;
    Description: string;
    Formule: string;
    IdRuleUniqueReference: number;
    UpdatePayslip: boolean;
    IdRuleUniqueReferenceNavigation: RuleUniqueReference;
    VariableValidityPeriod: Array<VariableValidityPeriod>;
  }

