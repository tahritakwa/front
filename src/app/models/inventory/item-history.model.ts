import { DocumentMovementDetail } from '../sales/document-movement-detail.model';

export class ItemHistory {
  IdItem: string;
  StartDate: string;
  EndDate: string;
  Document: Array<DocumentMovementDetail>;
  StartQuantity: number;
  EndQuantity: number;
  EndPurchaseAmount: number;
  EndSaleAmount: number;
  AvailableQty: number;
}
