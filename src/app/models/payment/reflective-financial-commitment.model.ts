import { Resource } from '../shared/ressource.model';
import { Settlement } from './settlement.model';


export class ReflectiveFinancialCommitment extends Resource {
  IdCommitment: number;
  IdCommitmentReplaced: number;
  AssignedAmount: number;
  AssignedAmountWithCurrency: number;
  DeletedToken: string;
}
