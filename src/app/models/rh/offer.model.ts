import { Resource } from '../shared/ressource.model';
import { Candidacy } from './candidacy.model';
import { SalaryStructure } from '../payroll/salary-structure.model';
import { Advantages } from './advantages.model';
import { Email } from './email.model';
import { Cnss } from '../payroll/cnss.model';
import { OfferBenefitInKind } from './offer-benefit-in-kind.model';
import { ContractType } from '../payroll/contract-type.model';
import { OfferBonus } from './offerBonus.model';

export class Offer extends Resource {
  State: number;
  StartDate: Date;
  EndDate?: Date;
  CreationDate: Date;
  SendingDate?: Date;
  WorkingHoursPerWeek: number;
  Salary: number;
  ThirteenthMonthBonus?: boolean;
  IdCnss: number;
  IdEmail?: number;
  IdCandidacy: number;
  IdSalaryStructure: number;
  IdContractType: number;
  MealVoucher?: number;
  AvailableCar?: boolean;
  AvailableHouse?: boolean;
  CommissionType?: number;
  CommissionValue?: number;
  IdContractTypeNavigation: ContractType;
  IdCnssNavigation: Cnss;
  IdCandidacyNavigation: Candidacy;
  IdSalaryStructureNavigation: SalaryStructure;
  IdEmailNavigation: Email;
  Advantages: Advantages[];
  OfferBenefitInKind: OfferBenefitInKind[];
  OfferBonus: OfferBonus[];
}
