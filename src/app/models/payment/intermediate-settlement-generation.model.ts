import { SettlementGapMethod } from '../enumerators/settlement-gap-method.enum';
import { Settlement } from './settlement.model';
import { FinancialCommitment } from '../sales/financial-commitment.model';
import { ReducedTicket } from '../treasury/reduced-ticket';

export class IntermediateSettlementGeneration {

    Settlement: Settlement;
    GapManagementMethod: SettlementGapMethod;
    NewFinancialCommitmentDate: Date;
    GapReason: string;
    GapValue: number;
    SelectedFinancialCommitment: FinancialCommitment[];
    SelectedTicket: ReducedTicket [];

}
