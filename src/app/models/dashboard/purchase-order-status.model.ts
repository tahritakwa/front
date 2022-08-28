import { Dashboard } from './dashboard.model';
export class PurchaseOrderStatus extends Dashboard {
  IdOrder: number;
  SupplierName: string;
  OrderCode: string;
  HtAmount: number;
  Status: number;
  HtAmountFormatOption : any;
}
