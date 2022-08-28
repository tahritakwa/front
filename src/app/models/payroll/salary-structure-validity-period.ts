import { SalaryStructure } from "./salary-structure.model";
import { Resource } from "../shared/ressource.model";
import { SalaryStructureValidityPeriodSalaryRule } from "./salary-structure-validity-period-salary-rule";

export class SalaryStructureValidityPeriod extends Resource {
  StartDate: Date;
  State: number;
  IdSalaryStructure: number;
  IdSalaryStructureNavigation: SalaryStructure;
  SalaryStructureValidityPeriodSalaryRule: Array<SalaryStructureValidityPeriodSalaryRule>;

  constructor(SalaryStructureValidityPeriodSalaryRule: Array<SalaryStructureValidityPeriodSalaryRule>) {
    super();
    this.SalaryStructureValidityPeriodSalaryRule = SalaryStructureValidityPeriodSalaryRule;
  }

}
