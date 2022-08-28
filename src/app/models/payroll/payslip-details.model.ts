import { Resource } from '../shared/ressource.model';
import { Bonus } from './bonus.model';
import { Payslip } from './payslip.model';
import { SalaryRule } from './salary-rule.model';
import { BenefitInKind } from './benefit-in-kind.model';
export class PayslipDetails extends Resource {
  Rule: string;
  Gain: number;
  Deduction: number;
  Order: Date;
  AppearsOnPaySlip: number;
  IdPayslip: number;
  NumberOfDays: string;
  IdSalaryRule: number;
  IdBonus: number;
  IdBenefitInKind: number;
  IdBenefitInKindNavigation: BenefitInKind;
  IdBonusNavigation: Bonus;
  IdPayslipNavigation: Payslip;
  IdSalaryRuleNavigation: SalaryRule;
}
