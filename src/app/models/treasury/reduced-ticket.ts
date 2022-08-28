import { Tiers } from "../achat/tiers.model";
import { Currency } from "../administration/currency.model";
import { PaymentType } from "../payment/payement-type.model";
import { Document } from "../sales/document.model";
import { Resource } from "../shared/ressource.model";
import { TicketPayment } from "./ticket-payment";

export class ReducedTicket extends Resource{
  Id : number;
  Code : string
  CreationDate : Date;
  Status : number;
  CashRegisterName : string;
  Amount : number;
  IdDeliveryFormNavigation: Document;
  IdInvoiceNavigation: Document;
  TicketPayment : TicketPayment;
  IdUsedCurrencyNavigation : Currency;
  IdTiersNavigation : Tiers;
  IdPaymentTypeNavigation : PaymentType;
  IdInvoice : number;
  DeliveryFormCode : string;
  DeliveryFormStatus : number;
  TicketAmount : number;
  InvoiceStatus : number;
  InvoiceAmount : number;
  IdDeliveryForm : number;
  IdPaymentTicket : number;
}
