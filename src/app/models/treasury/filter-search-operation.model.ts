import { OrderBy } from "../../shared/utils/predicate";

export class FilterSearchOperation{
  IdCashRegister: number;
  page : number;
  pageSize : number;
  OrderBy : OrderBy [];
}
