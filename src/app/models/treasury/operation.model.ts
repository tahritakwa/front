import { SessionCash } from "../payment/session-cash.model";

export class OperationCash {
  Id: number;
  Type: string;
  AgentCode: number;
  IdSession: number;
  OperationDate: Date;
  Amount: number;
  AmountWithCurrency: number;
  IdSessionNavigation: SessionCash;
}
