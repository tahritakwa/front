import { Resource } from '../shared/ressource.model';

export class SalaryStructureSalaryRule extends Resource {
  IdSalaryStructure: number;
  IdSalaryRule: number;
  IdRuleNavigation: number;
  IdStructureNavigation: number;
}
