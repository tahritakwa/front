import { Resource } from "../shared/ressource.model";
import { SalaryRule } from "./salary-rule.model";

export class SalaryRuleValidityPeriod extends Resource {
    StartDate: Date;
    State: number;
    Rule: string;
    IdSalaryRule: number;
    IdSalaryRuleNavigation: SalaryRule;
}
