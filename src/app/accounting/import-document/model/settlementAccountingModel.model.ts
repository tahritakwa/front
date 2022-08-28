import { FiltreDocument } from "./filtreDocument.model";
import { FiltreSettlement } from "./filtreSettlement.model";

export class SettlementAccountingModel {

  StartDate: Date;
  EndDate: Date;
  IsAccounted: boolean;
  Page: number;
  PageSize: number;
  Type: number;
  FiltreSettlement: FiltreSettlement;
 
  constructor(startDate?: Date, endDate?: Date, IsAccounted?: boolean , Page?: number, PageSize?: number, Type? : number, 
    FiltreSettlement?: FiltreSettlement) {
    this.StartDate = startDate;
    this.EndDate = endDate;
    this.IsAccounted = IsAccounted;
    this.Page = Page;
    this.PageSize = PageSize;
    this.Type = Type;
    this.FiltreSettlement = FiltreSettlement;
  }
}
