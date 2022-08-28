

import { SessionCash } from '../payment/session-cash.model';
import { Document } from '../sales/document.model';
import { Resource } from '../shared/ressource.model';
import { TicketPayment } from './ticket-payment';

export class Ticket extends Resource {
    Id: number;
    Code: string;
    CreationDate: Date;
    Status: number;
    IdDeliveryForm: number;
    IdSessionCash: number;
    IdDeliveryFormNavigation: Document;
    IdSessionCashNavigation: SessionCash;
    IdInvoice?: number;
    IdInvoiceNavigation: Document;
    // Properties used for import Excel
    CreationDateTime: string;
    PaymentType: string;
    TicketPayment : Array<TicketPayment>;
}
