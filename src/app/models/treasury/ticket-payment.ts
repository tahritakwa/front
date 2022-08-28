import { PaymentType } from "../payment/payement-type.model";
import { Resource } from "../shared/ressource.model";
import { Ticket } from "./ticket.model";

export class TicketPayment extends Resource {

    Id: number;
    IdTicket: number;
    CreationDate: Date;
    IdPaymentType: number;
    Amount: number;
    ReceivedAmount?: number;
    AmountReturned?: number;
    Status?: number;
    IdPaymentTypeNavigation: PaymentType;
    IdTicketNavigation: Ticket;
}
