import { Resource } from '../shared/ressource.model';
import { Settlement } from './settlement.model';

export class ReflectiveSettlement extends Resource {
  
  IdSettlement: number;
  IdSettlementReplaced: number;
  AssignedAmount?: number;
  AssignedAmountWithCurrency?: number;
  DeletedToken: string;
  IdSettlementNavigation: Settlement;
  IdSettlementReplacedNavigation: Settlement;

}
