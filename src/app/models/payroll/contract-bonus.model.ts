import { Resource } from '../shared/ressource.model';
import { Bonus } from './bonus.model';

export class ContractBonus extends Resource {
  Value: number;
  ValidityStartDate: Date;
  ValidityEndDate?: Date;
  IdBonus: number;
  IdContract: number;
  IdBonusNavigation: Bonus;
  State: number;
  constructor(bonus: number, contract: number) {
    super();
    this.IdBonus = bonus;
    this.IdContract = contract;
  }
}



