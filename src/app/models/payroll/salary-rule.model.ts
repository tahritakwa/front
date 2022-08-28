import { Resource } from '../shared/ressource.model';
import { RuleType } from '../enumerators/rule-type.enum';
import { RuleCategory } from '../enumerators/rule-category.enum';
import { RuleUniqueReference } from './rule-unique-reference';
import { SalaryRuleValidityPeriod } from './salary-rule-validity-period.model';

export class SalaryRule extends Resource {
  Name: string;
  Description: string;
  Order: number;
  RuleType: RuleType;
  IsBonus: boolean;
  AppearsOnPaySlip: boolean;
  Applicability: number;
  RuleCategory: RuleCategory;
  IdContributionRegister: number;
  IdRuleUniqueReference: number;
  DependNumberDaysWorked: boolean;
  UsedinNewsPaper: boolean;
  IsDisabledCheckbox: boolean;
  IdRuleUniqueReferenceNavigation: RuleUniqueReference;
  SalaryRuleValidityPeriod: Array<SalaryRuleValidityPeriod>;
  UpdatePayslip: boolean;
}
