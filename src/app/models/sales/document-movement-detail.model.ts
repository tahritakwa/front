export class DocumentMovementDetail {
  Code: string;
  Reference: string;
  DocumentDate: string;
  IdDocument: number;
  Status: number;
  IdTiers: number;
  TiersName: string
  DocumentTypeCode: string
  Quantity: any;
  PurchaseAmount: any;
  SalesAmount: any;
  PurchaseQuantity: any;
  SalesQuantity: any;
  IsSalesDocument: boolean;
  IsReservedLine: boolean;
  IsLastLine: boolean;
}
