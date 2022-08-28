import { Resource } from "../shared/ressource.model";

export class SalaryStructureValidityPeriodSalaryRule extends Resource {
    IdSalaryStructureValidityPeriod: number;
    IdSalaryRule: number;
    IdSalaryRuleNavigation: number;
    IdValidityPeriodNavigation: number;
    IsDisabledCheckbox: boolean;
    Checked: boolean;
}
