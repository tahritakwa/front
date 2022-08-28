import { Resource } from '../shared/ressource.model';

export class DetailsPaymentMode extends Resource {
    Code: string;
    Label: string;
    Percentage: number;
    IdPaymentMethod: string;
    IdSettlementType: string;
    NumberDays: number;
    settlementDay: string;
    completePrinting: string;
}


