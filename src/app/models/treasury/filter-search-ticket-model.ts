import { OrderBy } from '../../shared/utils/predicate';
import {Resource} from '../shared/ressource.model';
export class FilterSearchTicket extends Resource {
    IdPaymentType: number;
    IdTiers: number[];
    IdCashRegister : number;
    IdParentCash : number;
    CreationDate : Date
    PaidTicket :boolean;
    InvoiceBLCode :string;
    TicketCode :string;
    page : number;
    pageSize : number;
    OrderBy : OrderBy [];
}
