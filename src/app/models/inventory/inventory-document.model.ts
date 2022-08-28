import { Resource } from '../shared/ressource.model';
import { PredicateFormat } from '../../shared/utils/predicate';

export class InventoryDocument extends Resource {
  IdStockDocument: number;
  Skip: number;
  Take: number;
  refDescription: string;
  predicate: PredicateFormat;
  constructor(idStockDocument?: number, page?: number, pageSize?: number, refDescription?: string, predicate?: PredicateFormat) {
    super();
    this.refDescription = refDescription;
    this.IdStockDocument = idStockDocument;
    this.Skip = page;
    this.Take = pageSize;
    this.predicate = predicate;
  }
}
