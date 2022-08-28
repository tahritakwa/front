import { Resource } from '../shared/ressource.model';
import { StockDocument } from './stock-document.model';
import { Item } from './item.model';

export class StockDocumentLine extends Resource {

  IdStockDocument?: number;
  ActualQuantity?: number;
  RealActualQuantity?: number;
  ProvisionalBLQuantity?: number;
  ForecastQuantity?: number;
  SoldQuantity?: number;
  IdItem?: number;
  IdItemNavigation: Item;
  IdDocumentNavigation: StockDocument;
  Description: string;
  IdLine: number;
  Code?: string;
  LabelItem: string;
  CodeItem: string;
  Designation: string;
  IdWarehouse: number;
  Shelf: string;
  Storage: string;
  ForecastQuantity2?: number;
}
