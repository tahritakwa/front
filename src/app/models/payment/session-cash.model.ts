
import { User } from "../administration/user.model";
import { Document } from "../sales/document.model";
import { Resource } from "../shared/ressource.model";
import { CashRegister } from "../treasury/cash-register.model";
import { OperationCash } from "../treasury/operation.model";
import { Ticket } from "../treasury/ticket.model";
import { Settlement } from "./settlement.model";

export class SessionCash extends Resource {
  Id: number;
  Code: string;
  IdCashRegister: number;
  OpeningDate : Date;
  ClosingDate : Date;
  LastCounter: string;
  IdSeller: number;
  State: number;
  Opening_Amount : number;
  Closing_Amount : number;
  ClosingCashAmount : number;
  CalculatedTotalAmount : number;
  IdResponsible: number;
  IdCashRegisterNavigation: CashRegister;
  IdSellerNavigation: User;
  IdResponsibleNavigation: User;
  Ticket: Ticket[];
  Settlement: Settlement[];
  OperationCash: OperationCash[];
  Document :Array<Document>;

}
