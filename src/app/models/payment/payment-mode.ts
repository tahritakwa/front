import { Resource } from '../shared/ressource.model';
import { DetailsPaymentMode } from './details-payment-mode';

export class PaymentMode extends Resource {
    Code: string;
    Label: string;
    DetailsSettlementMode: DetailsPaymentMode[];
    Document: Document;
}


