import { Resource } from '../shared/ressource.model';
import { FinancialCommitment } from '../sales/financial-commitment.model';
import { Settlement } from './settlement.model';

export class SettlementCommitment extends Resource {
    CommitmentId: number;
    SettlementId: number;
    AssignedAmount?: number;
    AssignedAmountWithCurrency?: number;
    Direction?: number;
    DeletedToken: string;
    Commitment: FinancialCommitment;
    Settlement: Settlement;
}
