import { Resource } from '../shared/ressource.model';

export class InventoryDocumentLine extends Resource {
  IdStockDocument: number;
  Skip: number;
  Take: number;
  Code: string;
  Description: string;
  Barcode1D: string;
  Barcode2D: string;
  StartDate: Date;
  EndDate: Date;
  IdWarehouse: number;
  constructor(idStockDocument?: number, page?: number, pageSize?: number, code?: string,
    description?: string, barcode1d?: string, barcode2d?: string) {
    super();
    this.IdStockDocument = idStockDocument;
    this.Skip = page;
    this.Take = pageSize;
    this.Code = code;
    this.Description = description;
    this.Barcode1D = barcode1d;
    this.Barcode2D = barcode2d;
  }
}
