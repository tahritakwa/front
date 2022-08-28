import { Resource } from '../shared/ressource.model';
import { SalaryStructureSalaryRule } from './salary-structure-salary-rule.model';
import { SalaryStructureValidityPeriod } from './salary-structure-validity-period';

export class SalaryStructure extends Resource {
  SalaryStructureReference: string;
  Name: string;
  Order: number;
  Description: string;
  IdParent: number;
  /**
   * To memorize the minimum start date of the periodicity in order to carry out checks
   */
  StartDate = Date;
  IdParentNavigation: SalaryStructure;
  SalaryStructureValidityPeriod: Array<SalaryStructureValidityPeriod>;
}
