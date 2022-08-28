import { Resource } from '../shared/ressource.model';
import { PriceRequestDetail } from './price-request-detail.model';
import { Document } from '../sales/document.model';

export class PriceRequest extends Resource {
  Code: string;
  Reference: string;
  CreationDate?: Date;
  DocumentDate?: Date;
  SupplierName: Array<string>;
  PriceRequestDetail: Array<PriceRequestDetail>;
  IdDocuments: number[];
  Document: Array<Document>;
}
