import { Resource } from '../shared/ressource.model';

export class DailySalesLine extends Resource {
  AvailableQty: number;
  RealSoldQty: number;
  SoldQty: number;
  ValidBLQty: number;
  ProvisionalBLQty: number;
  SalesAssetQty: number;
  PurchaseAssetQty: number;
  IdItem: number;
  LabelItem: string;
  Designation: string;
  IdLine: number;
  CodeItem?: string;
}
