import { Resource } from '../shared/ressource.model';

export class SalesInventoryDocumentLine extends Resource {
  Skip: number;
  Take: number;
  StartDate: Date;
  EndDate: Date;
  IdWarehouse: number;
  constructor( page?: number, pageSize?: number, startdate?: Date, enddate?: Date, idwarehouse?: number) {
    super();
    this.Skip = page;
    this.Take = pageSize;
    this.StartDate = startdate;
    this.EndDate = enddate;
    this.IdWarehouse = idwarehouse;
  }
}
