import { Resource } from '../shared/ressource.model';
import { Bonus } from './bonus.model';
import { Contract } from './contract.model';

export class SessionBonus extends Resource {
  IdBonus: number;
  IdSession: number;
  IdContract: number;
  Value: number;
  IdContractNavigation: Contract;
  IdBonusNavigation: Bonus;
}
