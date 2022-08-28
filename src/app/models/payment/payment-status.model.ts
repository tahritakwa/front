import { Resource } from '../shared/ressource.model';
import { FinancialCommitment } from '../sales/financial-commitment.model';
import { Settlement } from './settlement.model';

export class PaymentStatus extends Resource {
    Code: string;
    Label: string;
    DeletedToken: string;
    Settlement: Array<Settlement>;
}
