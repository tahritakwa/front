import { Resource } from '../shared/ressource.model';
import { BenefitInKind } from './benefit-in-kind.model';
import { Contract } from './contract.model';

export class ContractBenefitInKind extends Resource {
  IdContract: number;
  IdBenefitInKind: number;
  ValidityStartDate?: Date;
  ValidityEndDate?: Date;
  Value: number;
  State: number;
  IdBenefitInKindNavigation: BenefitInKind;
  IdContractNavigation: Contract;
  constructor(benefitInKind: number, contract: number) {
    super();
    this.IdBenefitInKind = benefitInKind;
    this.IdContract = contract;
  }
}
